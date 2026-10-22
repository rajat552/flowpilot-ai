import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateRunInputSchema,
  WorkflowRun,
} from '@flowpilot/shared';
import { store } from '../repositories/store.js';
import { plannerService } from '../services/planner/plannerService.js';
import { executionEngine } from '../services/executor/executionEngine.js';
import { eventBus } from '../events/eventBus.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const runsRouter = Router();

// Create new run and generate structured plan
runsRouter.post('/runs', async (req: Request, res: Response) => {
  try {
    const input = CreateRunInputSchema.parse(req.body);
    const runId = uuidv4();
    const userId = (req.headers['x-user-id'] as string) || 'guest_user';

    const run: WorkflowRun = {
      id: runId,
      userId,
      goal: input.goal,
      workflowType: input.workflowType,
      status: 'planning',
      createdAt: new Date().toISOString(),
      modelId: config.nebius.modelId,
      metrics: {
        retryCount: 0,
        toolCallCount: 0,
      },
      tags: input.tags,
    };

    store.saveRun(run);

    eventBus.emit(runId, 'run.created', {
      runId,
      goal: run.goal,
      workflowType: run.workflowType,
      modelId: run.modelId,
    });

    eventBus.emit(runId, 'run.planning', {
      runId,
      status: 'generating_structured_plan',
    });

    // Generate plan
    const plan = await plannerService.createPlan(runId, input.goal, input.workflowType);

    run.status = 'awaiting_approval';
    run.approvedPlanId = plan.id;
    store.saveRun(run);

    eventBus.emit(runId, 'plan.ready', {
      planId: plan.id,
      stepsCount: plan.steps.length,
      estimatedTimeSeconds: plan.estimatedExecutionBudget.estimatedTimeSeconds,
    });

    res.status(201).json({
      runId: run.id,
      status: run.status,
      run,
      plan,
    });
  } catch (err: any) {
    logger.error('Error creating run', err);
    res.status(400).json({ error: err.message || 'Invalid run creation payload' });
  }
});

// List all runs
runsRouter.get('/runs', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string | undefined;
  const runs = store.listRuns(userId);
  res.json({ runs, total: runs.length });
});

// Get single run by ID
runsRouter.get('/runs/:runId', async (req: Request, res: Response) => {
  const runId = req.params.runId as string;
  const run = store.getRun(runId);
  if (!run) {
    return res.status(404).json({ error: `Run "${runId}" not found` });
  }

  const plan = store.getPlanByRun(runId);
  const steps = store.getStepsByRun(runId);
  const artifacts = store.listArtifactsByRun(runId);

  res.json({
    run,
    plan,
    steps,
    artifacts,
  });
});

// Approve plan and start execution
runsRouter.post('/runs/:runId/approve', async (req: Request, res: Response) => {
  const runId = req.params.runId as string;
  const run = store.getRun(runId);
  if (!run) {
    return res.status(404).json({ error: `Run "${runId}" not found` });
  }

  if (run.status !== 'awaiting_approval' && run.status !== 'queued') {
    return res.status(400).json({
      error: `Run "${runId}" cannot be approved because it is in status "${run.status}"`,
    });
  }

  // Launch execution asynchronously
  executionEngine.executeApprovedRun(runId).catch((err) => {
    logger.error(`Execution error for run ${runId}`, err);
  });

  res.json({
    runId,
    status: 'running',
    message: 'Plan approved. Workflow execution initiated.',
  });
});

// Cancel run
runsRouter.post('/runs/:runId/cancel', async (req: Request, res: Response) => {
  const runId = req.params.runId as string;
  const success = executionEngine.cancelRun(runId);
  if (success) {
    res.json({ runId, status: 'cancelled', message: 'Cancellation initiated.' });
  } else {
    res.status(400).json({ error: `Could not cancel run "${runId}"` });
  }
});
