import { z } from 'zod';

export const VerificationCheckItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  passed: z.boolean(),
  evidence: z.string(),
  isCritical: z.boolean().default(true),
});

export const WorkflowVerificationReportSchema = z.object({
  runId: z.string(),
  status: z.enum(['passed', 'partially_passed', 'failed']),
  checks: z.array(VerificationCheckItemSchema),
  passedCount: z.number().int(),
  failedCount: z.number().int(),
  totalCount: z.number().int(),
  critiqueSummary: z.string(),
  verifiedAt: z.string(),
});

export type VerificationCheckItem = z.infer<typeof VerificationCheckItemSchema>;
export type WorkflowVerificationReport = z.infer<typeof WorkflowVerificationReportSchema>;
