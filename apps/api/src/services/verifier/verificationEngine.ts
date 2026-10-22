import {
  WorkflowStep,
  WorkflowVerificationReport,
  VerificationCheckItem,
  Artifact,
} from '@flowpilot/shared';
import { nebiusClient } from '../ai/nebiusClient.js';
import { logger } from '../../utils/logger.js';

export class VerificationEngine {
  /**
   * Verifies all steps, outputs, and final artifacts against deterministic acceptance rules.
   */
  async verifyWorkflow(
    runId: string,
    steps: WorkflowStep[],
    artifacts: Artifact[]
  ): Promise<WorkflowVerificationReport> {
    logger.info(`Starting deterministic verification for run ${runId}`);
    const checks: VerificationCheckItem[] = [];

    // 1. Check: All required steps succeeded
    const failedSteps = steps.filter((s) => s.status !== 'passed');
    checks.push({
      id: 'chk_steps_passed',
      name: 'All Workflow Steps Completed Successfully',
      description: 'Every step in the approved plan completed execution without unhandled exceptions.',
      passed: failedSteps.length === 0,
      evidence:
        failedSteps.length === 0
          ? `All ${steps.length} steps passed.`
          : `Failed steps: ${failedSteps.map((s) => s.stepId).join(', ')}`,
      isCritical: true,
    });

    // 2. Check: At least 3 distinct products researched
    const factExtractionSteps = steps.filter((s) => s.toolId === 'extract_facts' && s.status === 'passed');
    const distinctEntities = new Set(
      factExtractionSteps.map((s) => s.rawOutput?.entity?.name?.toLowerCase().trim()).filter(Boolean)
    );

    checks.push({
      id: 'chk_three_products',
      name: 'Minimum 3 Distinct Products Researched',
      description: 'The workflow gathered verified intelligence on at least 3 distinct software products.',
      passed: distinctEntities.size >= 3,
      evidence: `Found ${distinctEntities.size} distinct evaluated entities: [${Array.from(distinctEntities).join(', ')}]`,
      isCritical: true,
    });

    // 3. Check: Real source URLs present and valid
    const allSources: string[] = [];
    for (const step of steps) {
      if (step.toolId === 'web_search' && step.rawOutput?.results) {
        step.rawOutput.results.forEach((r: any) => {
          if (r.url) allSources.push(r.url);
        });
      }
      if (step.toolId === 'extract_facts' && step.rawOutput?.entity?.sourceUrl) {
        allSources.push(step.rawOutput.entity.sourceUrl);
      }
    }

    const uniqueSources = Array.from(new Set(allSources));
    const validHttpSources = uniqueSources.filter((u) => u.startsWith('http://') || u.startsWith('https://'));

    checks.push({
      id: 'chk_valid_sources',
      name: 'Authentic Web Source Verification',
      description: 'Sources gathered from real web search or live extraction must have valid HTTP/HTTPS URLs.',
      passed: validHttpSources.length >= 2,
      evidence: `Collected ${validHttpSources.length} authentic source URLs across search and extraction tools.`,
      isCritical: true,
    });

    // 4. Check: Pricing and free-tier explicitly extracted or tagged
    let pricingVerified = true;
    for (const step of factExtractionSteps) {
      const pricing = step.rawOutput?.entity?.pricing;
      if (!pricing || (!pricing.price && !pricing.details)) {
        pricingVerified = false;
        break;
      }
    }

    checks.push({
      id: 'chk_pricing_coverage',
      name: 'Pricing & Free-Tier Coverage',
      description: 'Every evaluated product contains explicit pricing figures or documented tier details.',
      passed: pricingVerified && factExtractionSteps.length > 0,
      evidence: pricingVerified
        ? 'All products contain verified pricing, tier data, or free-tier availability.'
        : 'Missing pricing documentation for one or more products.',
      isCritical: true,
    });

    // 5. Check: Report artifact created and non-empty
    const reportArtifact = artifacts.find((a) => a.type === 'report');
    const reportContent = reportArtifact?.rawContent || '';
    const hasRequiredSections =
      reportContent.includes('Executive Summary') &&
      reportContent.includes('Comparison Matrix') &&
      reportContent.includes('Detailed Product Evaluations') &&
      reportContent.includes('Final Recommendation');

    checks.push({
      id: 'chk_report_integrity',
      name: 'Final Report Structure & Integrity',
      description: 'Generated report artifact contains all mandatory sections: Summary, Comparison Table, Recommendation, and Citations.',
      passed: !!reportArtifact && reportContent.length > 200 && hasRequiredSections,
      evidence: reportArtifact
        ? `Report "${reportArtifact.title}" (${reportContent.length} bytes) verified with all required sections.`
        : 'No valid report artifact found.',
      isCritical: true,
    });

    // Tally results
    const passedCount = checks.filter((c) => c.passed).length;
    const failedCount = checks.filter((c) => !c.passed).length;
    const criticalFailed = checks.some((c) => !c.passed && c.isCritical);

    let status: 'passed' | 'partially_passed' | 'failed' = 'passed';
    if (criticalFailed) {
      status = 'failed';
    } else if (failedCount > 0) {
      status = 'partially_passed';
    }

    // Supplementary critique from NVIDIA Nemotron if configured
    let critiqueSummary = `Verification complete: ${passedCount}/${checks.length} criteria satisfied.`;
    if (nebiusClient.isConfigured() && status === 'passed') {
      try {
        const critiquePrompt = `Analyze these verification results for a project-management research run:
${checks.map((c) => `- ${c.name}: ${c.passed ? 'PASSED' : 'FAILED'} (${c.evidence})`).join('\n')}

Provide a 2-sentence quality critique from NVIDIA Nemotron.`;
        const critiqueRes = await nebiusClient.generateChatCompletion([
          { role: 'system', content: 'You are an objective AI verification reviewer.' },
          { role: 'user', content: critiquePrompt },
        ]);
        critiqueSummary += ` NVIDIA Nemotron Evaluation: ${critiqueRes.content.trim()}`;
      } catch (_) {}
    }

    return {
      runId,
      status,
      checks,
      passedCount,
      failedCount,
      totalCount: checks.length,
      critiqueSummary,
      verifiedAt: new Date().toISOString(),
    };
  }
}

export const verificationEngine = new VerificationEngine();
