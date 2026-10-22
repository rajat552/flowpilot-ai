import { Response } from 'express';
import { RunEvent, WorkflowEventType } from '@flowpilot/shared';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../repositories/store.js';
import { logger } from '../utils/logger.js';

interface ClientConnection {
  res: Response;
  userId?: string;
}

class EventBus {
  private connections: Map<string, Set<ClientConnection>> = new Map();

  subscribe(runId: string, res: Response, userId?: string, lastEventId?: number) {
    if (!this.connections.has(runId)) {
      this.connections.set(runId, new Set());
    }

    const client: ClientConnection = { res, userId };
    this.connections.get(runId)!.add(client);

    // Send existing events for replay if requested
    const startSeq = lastEventId !== undefined ? lastEventId + 1 : 1;
    const history = store.getEventsByRun(runId, startSeq);
    for (const ev of history) {
      this.sendToClient(res, ev);
    }

    res.on('close', () => {
      this.unsubscribe(runId, client);
    });
  }

  unsubscribe(runId: string, client: ClientConnection) {
    const clients = this.connections.get(runId);
    if (clients) {
      clients.delete(client);
      if (clients.size === 0) {
        this.connections.delete(runId);
      }
    }
  }

  emit(runId: string, eventType: WorkflowEventType, safePayload: Record<string, any>): RunEvent {
    const sequence = store.getNextEventSequence(runId);
    const event: RunEvent = {
      id: uuidv4(),
      runId,
      sequence,
      eventType,
      timestamp: new Date().toISOString(),
      safePayload,
    };

    store.addEvent(event);
    logger.info(`[Event] [${runId}] #${sequence} ${eventType}`, safePayload);

    const clients = this.connections.get(runId);
    if (clients) {
      for (const client of clients) {
        this.sendToClient(client.res, event);
      }
    }

    return event;
  }

  private sendToClient(res: Response, event: RunEvent) {
    res.write(`id: ${event.sequence}\n`);
    res.write(`event: ${event.eventType}\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }
}

export const eventBus = new EventBus();
