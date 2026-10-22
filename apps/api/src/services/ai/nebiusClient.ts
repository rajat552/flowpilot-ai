import OpenAI from 'openai';
import { config } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export interface ModelCompletionResult {
  content: string;
  modelId: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
}

export class NebiusTokenFactoryClient {
  private client: OpenAI | null = null;
  public readonly modelId: string;
  public readonly baseUrl: string;

  constructor() {
    this.modelId = config.nebius.modelId;
    this.baseUrl = config.nebius.baseUrl;

    if (config.nebius.apiKey && config.nebius.apiKey.trim() !== '') {
      this.client = new OpenAI({
        apiKey: config.nebius.apiKey,
        baseURL: this.baseUrl,
      });
      logger.info(`Nebius Token Factory initialized with model ${this.modelId} at ${this.baseUrl}`);
    } else {
      logger.warn('NEBIUS_API_KEY is not set. Real model inference will require a valid Token Factory key.');
    }
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async testConnection(): Promise<{ success: boolean; model: string; message: string; latencyMs: number }> {
    if (!this.client) {
      return {
        success: false,
        model: this.modelId,
        message: 'NEBIUS_API_KEY is not configured in environment variables.',
        latencyMs: 0,
      };
    }

    const start = Date.now();
    try {
      const response = await this.client.chat.completions.create({
        model: this.modelId,
        messages: [
          { role: 'system', content: 'You are an NVIDIA Nemotron assistant on Nebius Token Factory.' },
          { role: 'user', content: 'Respond with the single word "VERIFIED".' },
        ],
        max_tokens: 10,
        temperature: 0.1,
      });

      const latencyMs = Date.now() - start;
      const reply = response.choices[0]?.message?.content?.trim() || '';

      return {
        success: true,
        model: this.modelId,
        message: `Nebius Token Factory responded: ${reply}`,
        latencyMs,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - start;
      logger.error('Nebius Token Factory connection test failed', err);
      return {
        success: false,
        model: this.modelId,
        message: err?.message || 'Failed to connect to Nebius Token Factory',
        latencyMs,
      };
    }
  }

  async generateChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
      responseFormatJson?: boolean;
    }
  ): Promise<ModelCompletionResult> {
    if (!this.client) {
      throw new Error(
        'Nebius Token Factory client is not configured. Please supply NEBIUS_API_KEY in .env or environment.'
      );
    }

    const start = Date.now();
    try {
      const completion = await this.client.chat.completions.create({
        model: this.modelId,
        messages,
        temperature: options?.temperature ?? 0.2,
        max_tokens: options?.maxTokens ?? 3500,
        response_format: options?.responseFormatJson ? { type: 'json_object' } : undefined,
      });

      const latencyMs = Date.now() - start;
      const content = completion.choices[0]?.message?.content || '';
      const usage = completion.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      };

      return {
        content,
        modelId: this.modelId,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        latencyMs,
      };
    } catch (err: any) {
      logger.error('Error during Nebius Token Factory inference', err);
      throw new Error(`Nebius Token Factory inference error: ${err.message || 'Unknown network error'}`);
    }
  }
}

export const nebiusClient = new NebiusTokenFactoryClient();
