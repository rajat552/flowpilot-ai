import { ToolDefinition } from '@flowpilot/shared';
import { executeWebSearch } from './webSearchTool.js';
import { executeFetchWebpage } from './fetchWebpageTool.js';
import { executeExtractFacts } from './extractFactsTool.js';
import { executeGenerateReport } from './reportGeneratorTool.js';
import { logger } from '../utils/logger.js';

export interface RegisteredTool {
  definition: ToolDefinition;
  handler: (input: unknown) => Promise<any>;
}

class ToolRegistry {
  private tools: Map<string, RegisteredTool> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.register({
      definition: {
        id: 'web_search',
        name: 'Web Search',
        description: 'Performs live web search for market, product, and pricing information with verified URLs.',
        riskClassification: 'low',
        timeoutMs: 20000,
      },
      handler: executeWebSearch,
    });

    this.register({
      definition: {
        id: 'fetch_webpage',
        name: 'Fetch Webpage Content',
        description: 'Safely retrieves and parses text content from a verified URL with SSRF protection.',
        riskClassification: 'low',
        timeoutMs: 15000,
      },
      handler: executeFetchWebpage,
    });

    this.register({
      definition: {
        id: 'extract_facts',
        name: 'Extract Product Facts',
        description: 'Extracts structured features, pricing, limitations, and suitability from source text.',
        riskClassification: 'low',
        timeoutMs: 25000,
      },
      handler: executeExtractFacts,
    });

    this.register({
      definition: {
        id: 'generate_report',
        name: 'Generate Intelligence Report',
        description: 'Compiles verified research data into an executive summary, comparison matrix, and citations.',
        riskClassification: 'low',
        timeoutMs: 15000,
      },
      handler: executeGenerateReport,
    });
  }

  register(tool: RegisteredTool) {
    this.tools.set(tool.definition.id, tool);
  }

  get(toolId: string): RegisteredTool | undefined {
    return this.tools.get(toolId);
  }

  has(toolId: string): boolean {
    return this.tools.has(toolId);
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.definition);
  }

  async execute(toolId: string, input: unknown): Promise<{ success: boolean; data?: any; error?: string }> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      const err = `Tool execution blocked: "${toolId}" is not a registered or permitted tool.`;
      logger.error(err);
      return { success: false, error: err };
    }

    try {
      logger.info(`Executing tool "${toolId}"`);
      const result = await tool.handler(input);
      return { success: true, data: result };
    } catch (err: any) {
      logger.error(`Tool execution failed for "${toolId}"`, err);
      return { success: false, error: err?.message || 'Unknown tool execution error' };
    }
  }
}

export const toolRegistry = new ToolRegistry();
