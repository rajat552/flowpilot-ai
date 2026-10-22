import { describe, it, expect } from 'vitest';
import {
  canTransitionRun,
  canTransitionStep,
  CreateRunInputSchema,
  WorkflowPlanSchema,
} from '@flowpilot/shared';

describe('Workflow State Machine Transitions', () => {
  it('allows valid run status transitions', () => {
    expect(canTransitionRun('queued', 'planning')).toBe(true);
    expect(canTransitionRun('planning', 'awaiting_approval')).toBe(true);
    expect(canTransitionRun('awaiting_approval', 'running')).toBe(true);
    expect(canTransitionRun('running', 'verifying')).toBe(true);
    expect(canTransitionRun('verifying', 'completed')).toBe(true);
    expect(canTransitionRun('verifying', 'partially_completed')).toBe(true);
  });

  it('prevents terminal-state regressions', () => {
    expect(canTransitionRun('completed', 'running')).toBe(false);
    expect(canTransitionRun('failed', 'planning')).toBe(false);
    expect(canTransitionRun('cancelled', 'verifying')).toBe(false);
  });

  it('allows valid step transitions', () => {
    expect(canTransitionStep('pending', 'running')).toBe(true);
    expect(canTransitionStep('running', 'passed')).toBe(true);
    expect(canTransitionStep('running', 'retrying')).toBe(true);
    expect(canTransitionStep('retrying', 'running')).toBe(true);
    expect(canTransitionStep('running', 'failed')).toBe(true);
  });
});

describe('Input and Plan Schemas', () => {
  it('validates a correct run creation payload', () => {
    const valid = CreateRunInputSchema.safeParse({
      goal: 'Research three project-management products for student teams',
      workflowType: 'research',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects an empty or excessively short goal', () => {
    const invalid = CreateRunInputSchema.safeParse({
      goal: 'abc',
    });
    expect(invalid.success).toBe(false);
  });

  it('rejects an unknown tool in plan schema', () => {
    const invalidPlan = WorkflowPlanSchema.safeParse({
      goalSummary: 'Test goal',
      steps: [
        {
          stepId: 'step_1',
          order: 1,
          title: 'Bad Step',
          instruction: 'Execute arbitrary script',
          toolId: 'unsupported_arbitrary_shell_tool',
          toolInput: {},
          expectedOutput: 'None',
          acceptanceCriteria: [{ id: 'c1', description: 'desc', critical: true, passed: false }],
        },
      ],
    });
    expect(invalidPlan.success).toBe(false);
  });
});
