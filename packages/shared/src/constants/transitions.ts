import { RunStatus } from '../types/run.js';
import { StepStatus } from '../types/step.js';

export const VALID_RUN_TRANSITIONS: Record<RunStatus, RunStatus[]> = {
  queued: ['planning', 'cancelled'],
  planning: ['awaiting_approval', 'failed', 'cancelled'],
  awaiting_approval: ['running', 'planning', 'cancelled'],
  running: ['verifying', 'recovering', 'failed', 'cancelled'],
  verifying: ['completed', 'partially_completed', 'recovering', 'failed', 'cancelled'],
  recovering: ['running', 'verifying', 'partially_completed', 'failed', 'cancelled'],
  completed: [], // terminal
  partially_completed: [], // terminal
  failed: [], // terminal
  cancelled: [], // terminal
};

export const VALID_STEP_TRANSITIONS: Record<StepStatus, StepStatus[]> = {
  pending: ['running', 'skipped', 'cancelled'],
  running: ['passed', 'failed', 'retrying', 'cancelled'],
  retrying: ['running', 'failed', 'needs_attention', 'cancelled'],
  passed: [], // terminal for single step attempt
  failed: ['retrying', 'needs_attention'],
  skipped: [],
  needs_attention: ['running', 'cancelled'],
  cancelled: [],
};

export function canTransitionRun(current: RunStatus, next: RunStatus): boolean {
  if (current === next) return true;
  const allowed = VALID_RUN_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

export function canTransitionStep(current: StepStatus, next: StepStatus): boolean {
  if (current === next) return true;
  const allowed = VALID_STEP_TRANSITIONS[current] || [];
  return allowed.includes(next);
}
