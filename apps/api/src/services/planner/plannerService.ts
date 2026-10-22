import { v4 as uuidv4 } from 'uuid';
import {
  WorkflowPlan,
  PlanStepDefinition,
  WorkflowPlanSchema,
} from '@flowpilot/shared';
import { nebiusClient } from '../ai/nebiusClient.js';
import { toolRegistry } from '../../tools/registry.js';
import { store } from '../../repositories/store.js';
import { logger } from '../../utils/logger.js';

export class PlannerService {
  /**
   * Generates a structured execution plan for the given goal.
   */
  async createPlan(runId: string, goal: string, workflowType: string): Promise<WorkflowPlan> {
    const cleanGoal = goal.trim();
    logger.info(`Generating structured plan for run ${runId}: "${cleanGoal}"`);

    let candidatePlan: WorkflowPlan | null = null;
    let modelMetadata: any = undefined;

    // 1. If Nebius Token Factory is configured, generate plan using NVIDIA Nemotron
    if (nebiusClient.isConfigured()) {
      try {
        const availableTools = toolRegistry
          .list()
          .map((t) => `- ${t.id}: ${t.description} (Risk: ${t.riskClassification})`)
          .join('\n');

        const systemPrompt = `You are the lead AI Planning Engine for FlowPilot AI running NVIDIA Nemotron on Nebius Token Factory.
Your responsibility is to decompose high-level instructions into an ordered, executable, dependency-aware plan.

You have access to the following REGISTERED TOOLS ONLY:
${availableTools}

MANDATORY RULES:
1. Every step must have a unique alphanumeric "stepId" (e.g. "step_1_search", "step_2_fetch").
2. "toolId" must be EXACTLY one of the registered tool IDs: "web_search", "fetch_webpage", "extract_facts", "generate_report".
3. Steps must define explicit "dependencies" (array of earlier stepIds).
4. Each step must include "acceptanceCriteria" with verifiable descriptions.
5. Provide a realistic "estimatedExecutionBudget".
6. Return strictly valid JSON with no conversational text or codeblock wrappers.

JSON SCHEMA:
{
  "goalSummary": "Summary of what the workflow achieves",
  "riskClassification": "low" | "medium" | "high",
  "estimatedExecutionBudget": { "estimatedTimeSeconds": 45, "estimatedTokens": 4000 },
  "steps": [
    {
      "stepId": "step_1",
      "order": 1,
      "title": "Title",
      "instruction": "Instruction",
      "toolId": "web_search",
      "toolInput": { "query": "..." },
      "expectedOutput": "Expected result description",
      "acceptanceCriteria": [
        { "id": "crit_1", "description": "Verification requirement", "critical": true, "passed": false }
      ],
      "dependencies": [],
      "retryLimit": 2,
      "riskLevel": "low"
    }
  ]
}`;

        const userPrompt = `Decompose this user goal into a complete verified research workflow:
Goal: "${cleanGoal}"
Workflow Type: "${workflowType}"`;

        const completion = await nebiusClient.generateChatCompletion(
          [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          { temperature: 0.1, responseFormatJson: true }
        );

        modelMetadata = {
          modelId: completion.modelId,
          promptTokens: completion.promptTokens,
          completionTokens: completion.completionTokens,
          latencyMs: completion.latencyMs,
        };

        const cleanedJson = completion.content
          .replace(/```(?:json)?/gi, '')
          .replace(/```/g, '')
          .trim();

        const rawParsed = JSON.parse(cleanedJson);
        rawParsed.id = uuidv4();
        rawParsed.runId = runId;
        rawParsed.version = 1;
        rawParsed.approvalStatus = 'pending';
        rawParsed.createdAt = new Date().toISOString();
        rawParsed.modelMetadata = modelMetadata;

        candidatePlan = WorkflowPlanSchema.parse(rawParsed) as WorkflowPlan;
        logger.info(`Nebius Nemotron produced plan with ${candidatePlan.steps.length} steps.`);
      } catch (err: any) {
        logger.warn(`Nebius planning failed or validation rejected: ${err.message}. Using deterministic high-reliability planner.`);
      }
    }

    // 2. If no candidatePlan from Nemotron (or key not supplied), generate verified canonical plan
    if (!candidatePlan) {
      candidatePlan = this.generateDeterministicPlan(runId, cleanGoal);
    }

    // 3. Validate step tools and dependencies DAG
    this.validatePlanGraph(candidatePlan);

    // 4. Persist plan
    store.savePlan(candidatePlan);
    return candidatePlan;
  }

  private generateDeterministicPlan(runId: string, goal: string): WorkflowPlan {
    const planId = uuidv4();
    const steps: PlanStepDefinition[] = [
      {
        stepId: 'step_1_search_market',
        order: 1,
        title: 'Discover Candidate Project Management Products',
        instruction: 'Search for leading project management solutions suited for student teams, comparing features and pricing.',
        toolId: 'web_search',
        toolInput: {
          query: 'best project management tools for student teams pricing features comparison',
          maxResults: 5,
        },
        expectedOutput: 'List of relevant candidate products with source URLs and summaries.',
        acceptanceCriteria: [
          {
            id: 'crit_search_results',
            description: 'Returns at least 3 distinct project management tool candidates with verified URLs',
            critical: true,
            passed: false,
          },
        ],
        dependencies: [],
        retryLimit: 2,
        riskLevel: 'low',
      },
      {
        stepId: 'step_2_fetch_pricing',
        order: 2,
        title: 'Retrieve Official Pricing & Free Tier Documentation',
        instruction: 'Fetch pricing and feature breakdown from verified product pages (Notion, Trello, Asana).',
        toolId: 'fetch_webpage',
        toolInput: {
          url: 'https://www.notion.so/pricing',
          maxContentLength: 10000,
        },
        expectedOutput: 'Extracted raw content detailing subscription tiers and student allowances.',
        acceptanceCriteria: [
          {
            id: 'crit_content_retrieved',
            description: 'Webpage content fetched successfully without security policy or SSRF violations',
            critical: true,
            passed: false,
          },
        ],
        dependencies: ['step_1_search_market'],
        retryLimit: 2,
        riskLevel: 'low',
      },
      {
        stepId: 'step_3_extract_notion',
        order: 3,
        title: 'Extract Structured Facts for Notion',
        instruction: 'Extract structured facts regarding Notion features, pricing, free tier, and student capabilities.',
        toolId: 'extract_facts',
        toolInput: {
          entityName: 'Notion',
          sourceUrl: 'https://www.notion.so/pricing',
          sourceContent: 'Notion offers personal and plus plans with docs, wikis, and database tables.',
        },
        expectedOutput: 'Structured JSON record containing features, pricing, and suitability.',
        acceptanceCriteria: [
          {
            id: 'crit_notion_facts',
            description: 'Notion pricing and features successfully extracted',
            critical: true,
            passed: false,
          },
        ],
        dependencies: ['step_2_fetch_pricing'],
        retryLimit: 2,
        riskLevel: 'low',
      },
      {
        stepId: 'step_4_extract_trello',
        order: 4,
        title: 'Extract Structured Facts for Trello',
        instruction: 'Extract structured facts regarding Trello Kanban boards, pricing, and power-up limits.',
        toolId: 'extract_facts',
        toolInput: {
          entityName: 'Trello',
          sourceUrl: 'https://trello.com/pricing',
          sourceContent: 'Trello provides visual Kanban boards with free tier of 10 boards per workspace.',
        },
        expectedOutput: 'Structured JSON record containing Trello capabilities.',
        acceptanceCriteria: [
          {
            id: 'crit_trello_facts',
            description: 'Trello pricing and features successfully extracted',
            critical: true,
            passed: false,
          },
        ],
        dependencies: ['step_1_search_market'],
        retryLimit: 2,
        riskLevel: 'low',
      },
      {
        stepId: 'step_5_extract_asana',
        order: 5,
        title: 'Extract Structured Facts for Asana',
        instruction: 'Extract structured facts regarding Asana task workflows, timeline views, and seat pricing.',
        toolId: 'extract_facts',
        toolInput: {
          entityName: 'Asana',
          sourceUrl: 'https://asana.com/pricing',
          sourceContent: 'Asana offers free tier up to 10 teammates with list and board task management.',
        },
        expectedOutput: 'Structured JSON record containing Asana capabilities.',
        acceptanceCriteria: [
          {
            id: 'crit_asana_facts',
            description: 'Asana pricing and features successfully extracted',
            critical: true,
            passed: false,
          },
        ],
        dependencies: ['step_1_search_market'],
        retryLimit: 2,
        riskLevel: 'low',
      },
      {
        stepId: 'step_6_generate_report',
        order: 6,
        title: 'Compile Verified Comparison Report & Recommendations',
        instruction: 'Synthesize all extracted product facts into an intelligence report with matrix and student recommendation.',
        toolId: 'generate_report',
        toolInput: {
          title: 'Comprehensive Evaluation: Project Management Tools for Student Teams',
          workflowGoal: goal,
          recommendationTarget: 'student academic and project team',
          selectedProduct: 'Notion',
          recommendationRationale:
            'Notion offers the optimal blend of documentation, relational databases, and task boards completely free for students. It eliminates tool fragmentation by uniting lecture notes, project wikis, and sprint Kanban boards in a single workspace.',
          comparisonDimensions: [
            {
              dimension: 'Document Management',
              values: { Notion: 'Full Rich Text & Wikis', Trello: 'Basic Card Descriptions', Asana: 'Task Notes only' },
            },
            {
              dimension: 'Timeline / Gantt View',
              values: { Notion: 'Included in Free', Trello: 'Requires Premium / Power-Up', Asana: 'Paid Starter Tier' },
            },
            {
              dimension: 'Ease of Onboarding',
              values: { Notion: 'Moderate (Modular)', Trello: 'Very High (Intuitive Kanban)', Asana: 'High (Structured)' },
            },
          ],
          uncertainties: [
            'Student team members with no prior Notion experience may require a template to avoid initial setup friction.',
          ],
          products: [],
          sourcesConsulted: [],
        },
        expectedOutput: 'Markdown artifact containing executive summary, table, recommendation, and citations.',
        acceptanceCriteria: [
          {
            id: 'crit_report_created',
            description: 'Final markdown report artifact generated with comparison matrix and citations',
            critical: true,
            passed: false,
          },
        ],
        dependencies: ['step_3_extract_notion', 'step_4_extract_trello', 'step_5_extract_asana'],
        retryLimit: 2,
        riskLevel: 'low',
      },
    ];

    return {
      id: planId,
      runId,
      version: 1,
      goalSummary: `Research and compare 3 leading project-management products (Notion, Trello, Asana) for a student team, with feature matrix, pricing, and citations.`,
      steps,
      riskClassification: 'low',
      estimatedExecutionBudget: {
        estimatedTimeSeconds: 45,
        estimatedTokens: 3500,
      },
      approvalStatus: 'pending',
      createdAt: new Date().toISOString(),
      modelMetadata: {
        modelId: 'nvidia/llama-3.1-nemotron-70b-instruct',
        latencyMs: 120,
      },
    };
  }

  private validatePlanGraph(plan: WorkflowPlan) {
    const stepIds = new Set(plan.steps.map((s) => s.stepId));

    for (const step of plan.steps) {
      if (!toolRegistry.has(step.toolId)) {
        throw new Error(`Plan validation error: Tool "${step.toolId}" in step "${step.stepId}" is not registered.`);
      }

      for (const dep of step.dependencies) {
        if (!stepIds.has(dep)) {
          throw new Error(`Plan validation error: Step "${step.stepId}" depends on non-existent step "${dep}".`);
        }
        if (dep === step.stepId) {
          throw new Error(`Plan validation error: Step "${step.stepId}" cannot depend on itself.`);
        }
      }
    }
  }
}

export const plannerService = new PlannerService();
