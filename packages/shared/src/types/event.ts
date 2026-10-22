export type WorkflowEventType =
  | 'run.created'
  | 'run.planning'
  | 'plan.ready'
  | 'run.approved'
  | 'step.started'
  | 'tool.started'
  | 'tool.completed'
  | 'step.verification'
  | 'step.retry'
  | 'step.failed'
  | 'artifact.created'
  | 'run.completed'
  | 'run.partially_completed'
  | 'run.failed'
  | 'run.cancelled';

export interface RunEvent {
  id: string;
  runId: string;
  sequence: number;
  eventType: WorkflowEventType;
  timestamp: string;
  safePayload: Record<string, any>;
}
