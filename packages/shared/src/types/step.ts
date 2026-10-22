export type StepStatus =
  | 'pending'
  | 'running'
  | 'passed'
  | 'failed'
  | 'retrying'
  | 'skipped'
  | 'needs_attention'
  | 'cancelled';

export interface StepAcceptanceCriterion {
  id: string;
  description: string;
  passed: boolean;
  evidence?: string;
  critical?: boolean;
}

export interface WorkflowStep {
  id: string;
  runId: string;
  stepId: string;
  order: number;
  title: string;
  instruction: string;
  status: StepStatus;
  toolId: string;
  toolInput: Record<string, any>;
  expectedOutput: string;
  acceptanceCriteria: StepAcceptanceCriterion[];
  dependencies: string[];
  retryLimit: number;
  attemptCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  inputSummary?: string;
  outputSummary?: string;
  rawOutput?: any;
  error?: string;
  startedAt?: string;
  finishedAt?: string;
}
