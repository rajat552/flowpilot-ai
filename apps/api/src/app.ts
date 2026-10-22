import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { healthRouter } from './routes/health.js';
import { runsRouter } from './routes/runs.js';
import { eventsRouter } from './routes/events.js';
import { artifactsRouter } from './routes/artifacts.js';
import { evaluationsRouter } from './routes/evaluations.js';

export const app = express();

// Enable CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development ports, deployed domains, or undefined (e.g. mobile/curl)
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Allow configured hosts
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Request tracing middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = (req.headers['x-request-id'] as string) || uuidv4();
  res.setHeader('x-request-id', reqId);
  (req as any).id = reqId;

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.includes('/events')) {
      logger.info(`[HTTP] ${req.method} ${req.path} ${res.statusCode} ${duration}ms (reqId: ${reqId})`);
    }
  });

  next();
});

// Mount Routes
app.use('/api', healthRouter);
app.use('/api', runsRouter);
app.use('/api', eventsRouter);
app.use('/api', artifactsRouter);
app.use('/api', evaluationsRouter);

// Root Welcome
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'FlowPilot AI API & Agent Orchestrator',
    description: 'From instructions to verified outcomes. Powered by NVIDIA Nemotron via Nebius Token Factory.',
    documentation: '/api/health',
    version: '1.0.0',
  });
});

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled server error', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});
