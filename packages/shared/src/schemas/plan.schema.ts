import { z } from 'zod';

export const StepAcceptanceCriterionSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(3),
  passed: z.boolean().default(false),
  evidence: z.string().optional(),
  critical: z.boolean().default(true),
});

export const AllowedToolIdSchema = z.enum([
  'web_search',
  'fetch_webpage',
  'extract_facts',
  'generate_report',
]);

export const PlanStepSchema = z.object({
  stepId: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9_-]+$/, 'stepId must be alphanumeric with dashes or underscores'),
  order: z.number().int().min(1),
  title: z.string().min(3).max(150),
  instruction: z.string().min(5).max(1000),
  toolId: AllowedToolIdSchema,
  toolInput: z.record(z.any()),
  expectedOutput: z.string().min(3).max(500),
  acceptanceCriteria: z.array(StepAcceptanceCriterionSchema).min(1),
  dependencies: z.array(z.string()).default([]),
  retryLimit: z.number().int().min(0).max(3).default(2),
  riskLevel: z.enum(['low', 'medium', 'high']).default('low'),
});

export const WorkflowPlanSchema = z.object({
  id: z.string().optional(),
  runId: z.string().optional(),
  version: z.number().int().min(1).default(1),
  goalSummary: z.string().min(5).max(500),
  steps: z.array(PlanStepSchema).min(1).max(20),
  riskClassification: z.enum(['low', 'medium', 'high']).default('low'),
  estimatedExecutionBudget: z
    .object({
      estimatedTimeSeconds: z.number().min(1).max(600).default(60),
      estimatedTokens: z.number().min(100).max(100000).default(5000),
    })
    .default({ estimatedTimeSeconds: 60, estimatedTokens: 5000 }),
  approvalStatus: z.enum(['pending', 'approved', 'rejected', 'modified']).default('pending'),
  createdAt: z.string().optional(),
  approvedAt: z.string().optional(),
  modelMetadata: z
    .object({
      modelId: z.string(),
      promptTokens: z.number().optional(),
      completionTokens: z.number().optional(),
      latencyMs: z.number().optional(),
    })
    .optional(),
});

export type WorkflowPlanInput = z.infer<typeof WorkflowPlanSchema>;
export type PlanStepInput = z.infer<typeof PlanStepSchema>;
