import { Router, Request, Response } from 'express';
import { eventBus } from '../events/eventBus.js';
import { store } from '../repositories/store.js';

export const eventsRouter = Router();

eventsRouter.get('/runs/:runId/events', (req: Request, res: Response) => {
  const runId = req.params.runId as string;
  const run = store.getRun(runId);

  if (!run) {
    return res.status(404).json({ error: `Run "${runId}" not found` });
  }

  // Set SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Keep connection alive with periodic heartbeat
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 15000);

  const rawLastId = req.headers['last-event-id'];
  const lastEventId = rawLastId ? parseInt(rawLastId as string, 10) : undefined;
  const userId = req.headers['x-user-id'] ? String(req.headers['x-user-id']) : undefined;

  eventBus.subscribe(runId, res, userId, lastEventId);

  req.on('close', () => {
    clearInterval(heartbeat);
  });
});
