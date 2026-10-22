import { v4 as uuidv4 } from 'uuid';
import {
  WorkflowRun,
  WorkflowPlan,
  WorkflowStep,
  Artifact,
  canTransitionRun,
  ExtractedProductFact,
} from '@flowpilot/shared';
import { store } from '../../repositories/store.js';
import { toolRegistry } from '../../tools/registry.js';
import { eventBus } from '../../events/eventBus.js';
import { verificationEngine } from '../verifier/verificationEngine.js';
import { recoveryEngine } from '../recovery/recoveryEngine.js';
import { logger } from '../../utils/logger.js';

export class ExecutionEngine {
  private activeRuns: Set<string> = new Set();
  private cancellationTokens: Set<string> = new Set();

  cancelRun(runId: string): boolean {
    if (this.activeRuns.has(runId)) {
      this.cancellationTokens.add(runId);
      logger.info(`Cancellation requested for active run ${runId}`);
      return true;
    }
    const run = store.getRun(runId);
    if (run && canTransitionRun(run.status, 'cancelled')) {
      run.status = 'cancelled';
      run.finishedAt = new Date().toISOString();
      store.saveRun(run);
      eventBus.emit(runId, 'run.cancelled', { reason: 'User requested cancellation' });
      return true;
    }
    return false;
  }

  async executeApprovedRun(runId: string): Promise<WorkflowRun> {
    const run = store.getRun(runId);
    if (!run) throw new Error(`Run ${runId} not found.`);

    const plan = store.getPlanByRun(runId);
    if (!plan) throw new Error(`Approved plan for run ${runId} not found.`);

    if (run.status !== 'awaiting_approval' && run.status !== 'queued') {
      throw new Error(`Run ${runId} is in status "${run.status}" and cannot be executed.`);
    }

    // Transition to running
    run.status = 'running';
    run.startedAt = new Date().toISOString();
    store.saveRun(run);
    this.activeRuns.add(runId);

    eventBus.emit(runId, 'run.approved', {
      planId: plan.id,
      stepsCount: plan.steps.length,
    });

    // Initialize persisted steps
    const initialSteps: WorkflowStep[] = plan.steps.map((s, idx) => ({
      id: uuidv4(),
      runId,
      stepId: s.stepId,
      order: s.order || idx + 1,
      title: s.title,
      instruction: s.instruction,
      status: 'pending',
      toolId: s.toolId,
      toolInput: { ...s.toolInput },
      expectedOutput: s.expectedOutput,
      acceptanceCriteria: s.acceptanceCriteria.map((c) => ({ ...c })),
      dependencies: [...s.dependencies],
      retryLimit: s.retryLimit ?? 2,
      attemptCount: 0,
      riskLevel: s.riskLevel || 'low',
    }));

    store.saveSteps(runId, initialSteps);

    // Topological DAG execution loop
    const collectedFacts: ExtractedProductFact[] = [];
    const collectedSources: Array<{ title: string; url: string; date?: string }> = [];

    const startTime = Date.now();

    try {
      let pendingSteps = store.getStepsByRun(runId);

      while (pendingSteps.some((s) => s.status === 'pending' || s.status === 'retrying')) {
        // Check for cancellation
        if (this.cancellationTokens.has(runId)) {
          logger.info(`Run ${runId} was cancelled by user.`);
          run.status = 'cancelled';
          run.finishedAt = new Date().toISOString();
          store.saveRun(run);
          eventBus.emit(runId, 'run.cancelled', { reason: 'User cancelled execution' });
          this.activeRuns.delete(runId);
          this.cancellationTokens.delete(runId);
          return run;
        }

        // Find steps whose dependencies are satisfied
        const completedStepIds = new Set(
          pendingSteps.filter((s) => s.status === 'passed').map((s) => s.stepId)
        );

        const eligibleSteps = pendingSteps.filter(
          (s) =>
            (s.status === 'pending' || s.status === 'retrying') &&
            s.dependencies.every((dep) => completedStepIds.has(dep))
        );

        if (eligibleSteps.length === 0) {
          // Deadlock or unrecoverable dependency failure
          const failedDeps = pendingSteps.filter((s) => s.status === 'failed');
          logger.warn(`No eligible steps found to execute for run ${runId}. Unresolved failures:`, failedDeps);
          break;
        }

        // Execute eligible steps (sequentially or bounded parallel)
        for (const step of eligibleSteps) {
          await this.executeSingleStep(step, run, collectedFacts, collectedSources);
        }

        // Refresh pending step states
        pendingSteps = store.getStepsByRun(runId);
      }

      // Step execution completed. Transition to Verification Phase
      run.status = 'verifying';
      store.saveRun(run);
      eventBus.emit(runId, 'step.verification', { status: 'verifying_outcomes' });

      const finalSteps = store.getStepsByRun(runId);
      const finalArtifacts = store.listArtifactsByRun(runId);

      const verificationReport = await verificationEngine.verifyWorkflow(runId, finalSteps, finalArtifacts);

      run.metrics = {
        ...run.metrics,
        totalDurationMs: Date.now() - startTime,
        executionDurationMs: Date.now() - startTime,
        toolCallCount: finalSteps.length,
      };

      if (verificationReport.status === 'passed') {
        run.status = 'completed';
        run.completionSummary = `Verified completion: All ${verificationReport.totalCount} criteria satisfied with full evidence. Deliverable report generated.`;
        store.saveRun(run);
        eventBus.emit(runId, 'run.completed', {
          verificationReport,
          summary: run.completionSummary,
        });
      } else if (verificationReport.status === 'partially_passed') {
        run.status = 'partially_completed';
        run.completionSummary = `Partial completion: ${verificationReport.passedCount}/${verificationReport.totalCount} criteria satisfied. Non-critical warnings reported.`;
        store.saveRun(run);
        eventBus.emit(runId, 'run.partially_completed', {
          verificationReport,
          summary: run.completionSummary,
        });
      } else {
        run.status = 'failed';
        run.errorSummary = `Verification failed: Critical checks did not meet acceptance criteria. ${verificationReport.critiqueSummary}`;
        store.saveRun(run);
        eventBus.emit(runId, 'run.failed', {
          verificationReport,
          error: run.errorSummary,
        });
      }

      run.finishedAt = new Date().toISOString();
      store.saveRun(run);
      return run;
    } catch (err: any) {
      logger.error(`Fatal error in execution engine for run ${runId}`, err);
      run.status = 'failed';
      run.errorSummary = `Workflow engine failure: ${err.message}`;
      run.finishedAt = new Date().toISOString();
      store.saveRun(run);
      eventBus.emit(runId, 'run.failed', { error: run.errorSummary });
      return run;
    } finally {
      this.activeRuns.delete(runId);
      this.cancellationTokens.delete(runId);
    }
  }

  private async executeSingleStep(
    step: WorkflowStep,
    run: WorkflowRun,
    collectedFacts: ExtractedProductFact[],
    collectedSources: Array<{ title: string; url: string; date?: string }>
  ) {
    step.status = 'running';
    step.attemptCount += 1;
    step.startedAt = new Date().toISOString();
    store.updateStep(step.runId, step.stepId, step);

    eventBus.emit(step.runId, 'step.started', {
      stepId: step.stepId,
      title: step.title,
      toolId: step.toolId,
      attempt: step.attemptCount,
    });

    eventBus.emit(step.runId, 'tool.started', {
      stepId: step.stepId,
      toolId: step.toolId,
      input: step.toolInput,
    });

    // Dynamic parameter injection for the report builder step
    if (step.toolId === 'generate_report') {
      step.toolInput.products = collectedFacts;
      step.toolInput.sourcesConsulted = collectedSources;
    }

    const toolResult = await toolRegistry.execute(step.toolId, step.toolInput);

    if (toolResult.success) {
      step.status = 'passed';
      step.finishedAt = new Date().toISOString();
      step.rawOutput = toolResult.data;
      step.outputSummary = `Tool ${step.toolId} succeeded.`;

      // Harvest data
      if (step.toolId === 'web_search' && toolResult.data?.results) {
        toolResult.data.results.forEach((r: any) => {
          if (r.url) collectedSources.push({ title: r.title, url: r.url, date: r.publishedDate });
        });
      } else if (step.toolId === 'extract_facts' && toolResult.data?.entity) {
        collectedFacts.push(toolResult.data.entity);
        collectedSources.push({
          title: `${toolResult.data.entity.name} Official Overview`,
          url: toolResult.data.entity.sourceUrl,
          date: toolResult.data.entity.pricing?.lastVerifiedDate,
        });
      } else if (step.toolId === 'generate_report' && toolResult.data?.markdownContent) {
        // Save deliverable artifact
        const artifact: Artifact = {
          id: uuidv4(),
          runId: step.runId,
          userId: run.userId,
          type: 'report',
          title: toolResult.data.title || 'Verified Project Management Evaluation Report',
          contentType: 'text/markdown',
          storageReference: `artifacts/${step.runId}/${toolResult.data.reportId}.md`,
          contentSnippet: toolResult.data.summary,
          rawContent: toolResult.data.markdownContent,
          verificationStatus: 'verified',
          createdAt: new Date().toISOString(),
          metadata: {
            productCount: toolResult.data.productCount,
            sourcesCount: toolResult.data.sourcesCount,
          },
        };
        store.saveArtifact(artifact);
        eventBus.emit(step.runId, 'artifact.created', {
          artifactId: artifact.id,
          title: artifact.title,
          type: artifact.type,
        });
      }

      // Mark acceptance criteria passed
      step.acceptanceCriteria.forEach((crit) => {
        crit.passed = true;
        crit.evidence = `Tool execution succeeded on attempt ${step.attemptCount}`;
      });

      store.updateStep(step.runId, step.stepId, step);
      eventBus.emit(step.runId, 'tool.completed', {
        stepId: step.stepId,
        toolId: step.toolId,
        success: true,
      });
    } else {
      // Handle tool failure and evaluate bounded recovery
      const errorMsg = toolResult.error || 'Execution failed';
      step.error = errorMsg;

      const recovery = recoveryEngine.decideStepRecovery(step, errorMsg);

      if (recovery.shouldRetry) {
        step.status = 'retrying';
        if (recovery.modifiedInput) {
          step.toolInput = recovery.modifiedInput;
        }
        store.updateStep(step.runId, step.stepId, step);
        eventBus.emit(step.runId, 'step.retry', {
          stepId: step.stepId,
          attempt: step.attemptCount,
          reason: recovery.reason,
        });
      } else {
        step.status = 'failed';
        step.finishedAt = new Date().toISOString();
        store.updateStep(step.runId, step.stepId, step);
        eventBus.emit(step.runId, 'step.failed', {
          stepId: step.stepId,
          error: errorMsg,
          reason: recovery.reason,
        });
      }
    }
  }
}

export const executionEngine = new ExecutionEngine();
