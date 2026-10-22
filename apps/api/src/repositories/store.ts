import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  WorkflowRun,
  WorkflowPlan,
  WorkflowStep,
  RunEvent,
  Artifact,
} from '@flowpilot/shared';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../data');
const DATA_FILE = path.join(DATA_DIR, 'flowpilot_state.json');

export interface StoreState {
  runs: Record<string, WorkflowRun>;
  plans: Record<string, WorkflowPlan>;
  steps: Record<string, WorkflowStep[]>;
  events: Record<string, RunEvent[]>;
  artifacts: Record<string, Artifact>;
}

class FlowPilotStore {
  private state: StoreState = {
    runs: {},
    plans: {},
    steps: {},
    events: {},
    artifacts: {},
  };

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.state = JSON.parse(raw);
        logger.info(`Loaded persisted store from ${DATA_FILE}`);
      }
    } catch (err) {
      logger.warn('Could not load persisted store, initializing fresh state', err);
    }
  }

  private persistState() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      logger.error('Failed to persist store state', err);
    }
  }

  // Runs
  saveRun(run: WorkflowRun): WorkflowRun {
    this.state.runs[run.id] = { ...run };
    this.persistState();
    return this.state.runs[run.id];
  }

  getRun(runId: string): WorkflowRun | undefined {
    return this.state.runs[runId];
  }

  listRuns(userId?: string): WorkflowRun[] {
    const all = Object.values(this.state.runs);
    const filtered = userId ? all.filter((r) => r.userId === userId) : all;
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Plans
  savePlan(plan: WorkflowPlan): WorkflowPlan {
    this.state.plans[plan.id] = { ...plan };
    this.persistState();
    return this.state.plans[plan.id];
  }

  getPlan(planId: string): WorkflowPlan | undefined {
    return this.state.plans[planId];
  }

  getPlanByRun(runId: string): WorkflowPlan | undefined {
    return Object.values(this.state.plans).find((p) => p.runId === runId);
  }

  // Steps
  saveSteps(runId: string, steps: WorkflowStep[]): WorkflowStep[] {
    this.state.steps[runId] = steps.map((s) => ({ ...s }));
    this.persistState();
    return this.state.steps[runId];
  }

  updateStep(runId: string, stepId: string, updates: Partial<WorkflowStep>): WorkflowStep | undefined {
    const list = this.state.steps[runId] || [];
    const index = list.findIndex((s) => s.stepId === stepId);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      this.state.steps[runId] = list;
      this.persistState();
      return list[index];
    }
    return undefined;
  }

  getStepsByRun(runId: string): WorkflowStep[] {
    return this.state.steps[runId] || [];
  }

  // Events
  addEvent(event: RunEvent): RunEvent {
    if (!this.state.events[event.runId]) {
      this.state.events[event.runId] = [];
    }
    this.state.events[event.runId].push(event);
    this.persistState();
    return event;
  }

  getEventsByRun(runId: string, fromSequence = 0): RunEvent[] {
    const all = this.state.events[runId] || [];
    return all.filter((e) => e.sequence >= fromSequence);
  }

  getNextEventSequence(runId: string): number {
    const list = this.state.events[runId] || [];
    return list.length + 1;
  }

  // Artifacts
  saveArtifact(artifact: Artifact): Artifact {
    this.state.artifacts[artifact.id] = { ...artifact };
    this.persistState();
    return this.state.artifacts[artifact.id];
  }

  getArtifact(artifactId: string): Artifact | undefined {
    return this.state.artifacts[artifactId];
  }

  listArtifactsByRun(runId: string): Artifact[] {
    return Object.values(this.state.artifacts).filter((a) => a.runId === runId);
  }

  listAllArtifacts(): Artifact[] {
    return Object.values(this.state.artifacts).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const store = new FlowPilotStore();
