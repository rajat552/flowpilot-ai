import { describe, it, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../src/repositories/store.js';
import { plannerService } from '../src/services/planner/plannerService.js';
import { executionEngine } from '../src/services/executor/executionEngine.js';
import { verificationEngine } from '../src/services/verifier/verificationEngine.js';

describe('FlowPilot End-to-End Workflow Execution', () => {
  it('plans, approves, executes, and verifies the primary research workflow', async () => {
    const runId = uuidv4();
    const goal =
      'Research three project-management products, compare their features and pricing, identify the best fit for a student team, and generate a report with sources.';

    // 1. Create Run in Store
    const run = store.saveRun({
      id: runId,
      userId: 'test_user',
      goal,
      workflowType: 'research',
      status: 'planning',
      createdAt: new Date().toISOString(),
      modelId: 'nvidia/llama-3.1-nemotron-70b-instruct',
      metrics: { retryCount: 0, toolCallCount: 0 },
    });
    expect(run.status).toBe('planning');

    // 2. Plan Generation
    const plan = await plannerService.createPlan(runId, goal, 'research');
    expect(plan.steps.length).toBeGreaterThanOrEqual(4);
    expect(plan.steps[0].toolId).toBe('web_search');

    run.status = 'awaiting_approval';
    run.approvedPlanId = plan.id;
    store.saveRun(run);

    // 3. Execution
    const completedRun = await executionEngine.executeApprovedRun(runId);
    expect(['completed', 'partially_completed']).toContain(completedRun.status);

    // 4. Verification Check
    const steps = store.getStepsByRun(runId);
    const artifacts = store.listArtifactsByRun(runId);

    expect(steps.length).toBe(plan.steps.length);
    expect(artifacts.length).toBeGreaterThanOrEqual(1);

    const reportArtifact = artifacts[0];
    expect(reportArtifact.type).toBe('report');
    expect(reportArtifact.rawContent).toContain('Executive Summary');
    expect(reportArtifact.rawContent).toContain('Comprehensive Comparison Matrix');
    expect(reportArtifact.rawContent).toContain('Final Recommendation');
    expect(reportArtifact.rawContent).toContain('Verified Citations');

    // 5. Verifier Audit
    const verif = await verificationEngine.verifyWorkflow(runId, steps, artifacts);
    expect(verif.status).toBe('passed');
    expect(verif.passedCount).toBe(verif.totalCount);
  }, 45000);
});
