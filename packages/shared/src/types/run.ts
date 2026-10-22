export type RunStatus =
  | 'queued'
  | 'planning'
  | 'awaiting_approval'
  | 'running'
  | 'verifying'
  | 'recovering'
  | 'completed'
  | 'partially_completed'
  | 'failed'
  | 'cancelled';

export interface RunMetrics {
  totalDurationMs?: number;
  planningDurationMs?: number;
  executionDurationMs?: number;
  verificationDurationMs?: number;
  totalTokensUsed?: number;
  promptTokens?: number;
  completionTokens?: number;
  toolCallCount?: number;
  retryCount?: number;
}

export interface WorkflowRun {
  id: string;
  userId: string;
  goal: string;
  workflowType: 'research' | 'comparison' | 'audit' | 'custom';
  status: RunStatus;
  approvedPlanId?: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  modelId: string;
  errorSummary?: string;
  completionSummary?: string;
  metrics: RunMetrics;
  tags?: string[];
}

export interface CreateRunDto {
  goal: string;
  workflowType?: 'research' | 'comparison' | 'audit' | 'custom';
  tags?: string[];
  maxRetries?: number;
  budgetLimitTokens?: number;
}
