export interface EvaluationScenario {
  id: string;
  name: string;
  description: string;
  goal: string;
  category:
    | 'straightforward_research'
    | 'ambiguous_goal'
    | 'missing_information'
    | 'unsupported_tool'
    | 'malformed_model_output'
    | 'tool_timeout'
    | 'search_failure'
    | 'incomplete_sources'
    | 'duplicate_search_results'
    | 'verification_failure'
    | 'retry_exhaustion'
    | 'user_cancellation'
    | 'strict_budget_limit'
    | 'hallucination_trap'
    | 'multi_step_dependency';
  expectedStatus: 'completed' | 'partially_completed' | 'failed' | 'cancelled';
  expectedPlanValid: boolean;
  expectedMinSources: number;
}

export interface EvaluationResult {
  scenarioId: string;
  scenarioName: string;
  category: string;
  runId: string;
  modelId: string;
  planningSucceeded: boolean;
  executionSucceeded: boolean;
  verificationPassed: boolean;
  finalStatusSatisfied: boolean;
  actualStatus: string;
  retryCount: number;
  sourcesFound: number;
  latencyMs: number;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  failureCategory?: string;
  timestamp: string;
}

export interface EvaluationSummary {
  totalScenarios: number;
  completedScenarios: number;
  planningSuccessRate: number;
  executionSuccessRate: number;
  verificationPassRate: number;
  overallSatisfactionRate: number;
  averageLatencyMs: number;
  totalTokensUsed: number;
  results: EvaluationResult[];
  executedAt: string;
}
