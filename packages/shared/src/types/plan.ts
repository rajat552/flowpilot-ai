import { StepAcceptanceCriterion } from './step.js';

export interface PlanStepDefinition {
  stepId: string;
  order: number;
  title: string;
  instruction: string;
  toolId: string;
  toolInput: Record<string, any>;
  expectedOutput: string;
  acceptanceCriteria: StepAcceptanceCriterion[];
  dependencies: string[];
  retryLimit: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface WorkflowPlan {
  id: string;
  runId: string;
  version: number;
  goalSummary: string;
  steps: PlanStepDefinition[];
  riskClassification: 'low' | 'medium' | 'high';
  estimatedExecutionBudget: {
    estimatedTimeSeconds: number;
    estimatedTokens: number;
  };
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'modified';
  createdAt: string;
  approvedAt?: string;
  modelMetadata?: {
    modelId: string;
    promptTokens?: number;
    completionTokens?: number;
    latencyMs?: number;
  };
}
