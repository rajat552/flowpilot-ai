import { z } from 'zod';

export const RunStatusSchema = z.enum([
  'queued',
  'planning',
  'awaiting_approval',
  'running',
  'verifying',
  'recovering',
  'completed',
  'partially_completed',
  'failed',
  'cancelled',
]);

export const CreateRunInputSchema = z.object({
  goal: z
    .string()
    .min(5, 'Goal must be at least 5 characters long')
    .max(2000, 'Goal cannot exceed 2000 characters')
    .trim(),
  workflowType: z.enum(['research', 'comparison', 'audit', 'custom']).default('research'),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  maxRetries: z.number().int().min(0).max(5).optional().default(2),
  budgetLimitTokens: z.number().int().min(500).max(100000).optional().default(25000),
});

export type CreateRunInput = z.infer<typeof CreateRunInputSchema>;
