import { useState, useEffect, useRef } from 'react';
import { RunEvent } from '@flowpilot/shared';

export function useRunEvents(runId: string | null) {
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<RunEvent | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!runId) {
      setEvents([]);
      setIsConnected(false);
      return;
    }

    const eventSource = new EventSource(`/api/runs/${runId}/events`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    const handleEvent = (e: MessageEvent) => {
      try {
        const parsed: RunEvent = JSON.parse(e.data);
        setEvents((prev) => {
          if (prev.some((p) => p.id === parsed.id)) return prev;
          return [...prev, parsed];
        });
        setLastEvent(parsed);
      } catch (err) {
        // Heartbeat or malformed
      }
    };

    // Listen to standard workflow event types
    const eventTypes = [
      'run.created',
      'run.planning',
      'plan.ready',
      'run.approved',
      'step.started',
      'tool.started',
      'tool.completed',
      'step.verification',
      'step.retry',
      'step.failed',
      'artifact.created',
      'run.completed',
      'run.partially_completed',
      'run.failed',
      'run.cancelled',
    ];

    eventTypes.forEach((type) => {
      eventSource.addEventListener(type, handleEvent);
    });

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [runId]);

  return { events, isConnected, lastEvent };
}
