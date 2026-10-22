import { WorkflowStep } from '@flowpilot/shared';
import { logger } from '../../utils/logger.js';

export interface RecoveryAction {
  shouldRetry: boolean;
  modifiedInput?: Record<string, any>;
  reason: string;
}

export class RecoveryEngine {
  decideStepRecovery(step: WorkflowStep, errorMsg: string): RecoveryAction {
    if (step.attemptCount >= step.retryLimit) {
      logger.warn(`Step "${step.stepId}" has exhausted all ${step.retryLimit} retry attempts.`);
      return {
        shouldRetry: false,
        reason: `Exhausted maximum retry budget (${step.retryLimit} attempts).`,
      };
    }

    // Search failure recovery: broaden or simplify query
    if (step.toolId === 'web_search') {
      const currentQuery = step.toolInput?.query || '';
      const simplifiedQuery = currentQuery
        .replace(/pricing|features|comparison/gi, '')
        .trim();

      return {
        shouldRetry: true,
        modifiedInput: {
          ...step.toolInput,
          query: simplifiedQuery || 'project management software',
        },
        reason: `Retrying search with simplified query after error: "${errorMsg}".`,
      };
    }

    // Webpage fetch failure: retry with timeout increase
    if (step.toolId === 'fetch_webpage') {
      return {
        shouldRetry: true,
        modifiedInput: {
          ...step.toolInput,
          maxContentLength: 8000,
        },
        reason: `Retrying webpage extraction with adjusted parameters.`,
      };
    }

    // Generic retry
    return {
      shouldRetry: true,
      reason: `Retrying failed operation (attempt ${step.attemptCount + 1}/${step.retryLimit}).`,
    };
  }
}

export const recoveryEngine = new RecoveryEngine();
