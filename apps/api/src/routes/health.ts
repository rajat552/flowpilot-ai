import { Router, Request, Response } from 'express';
import { nebiusClient } from '../services/ai/nebiusClient.js';
import { toolRegistry } from '../tools/registry.js';
import { config } from '../config/env.js';

export const healthRouter = Router();

healthRouter.get('/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'FlowPilot AI Orchestrator',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
    registeredTools: toolRegistry.list().map((t) => t.id),
  });
});

healthRouter.get('/ready', async (_req: Request, res: Response) => {
  const nebiusStatus = await nebiusClient.testConnection();

  res.json({
    ready: true,
    nebiusTokenFactory: {
      configured: nebiusClient.isConfigured(),
      modelId: nebiusClient.modelId,
      baseUrl: nebiusClient.baseUrl,
      testResult: nebiusStatus,
    },
    toolsCount: toolRegistry.list().length,
    timestamp: new Date().toISOString(),
  });
});
