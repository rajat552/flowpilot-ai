import {
  WorkflowRun,
  WorkflowPlan,
  WorkflowStep,
  Artifact,
  EvaluationSummary,
} from '@flowpilot/shared';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchReady() {
  const res = await fetch(`${API_BASE}/ready`);
  return res.json();
}

export async function createRun(payload: { goal: string; workflowType?: string }) {
  const res = await fetch(`${API_BASE}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create run');
  }
  return (await res.json()) as { runId: string; status: string; run: WorkflowRun; plan: WorkflowPlan };
}

export async function listRuns(): Promise<WorkflowRun[]> {
  const res = await fetch(`${API_BASE}/runs`);
  const data = await res.json();
  return data.runs || [];
}

export async function getRunDetails(runId: string): Promise<{
  run: WorkflowRun;
  plan?: WorkflowPlan;
  steps: WorkflowStep[];
  artifacts: Artifact[];
}> {
  const res = await fetch(`${API_BASE}/runs/${runId}`);
  if (!res.ok) throw new Error('Run not found');
  return res.json();
}

export async function approveRun(runId: string) {
  const res = await fetch(`${API_BASE}/runs/${runId}/approve`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to approve plan');
  }
  return res.json();
}

export async function cancelRun(runId: string) {
  const res = await fetch(`${API_BASE}/runs/${runId}/cancel`, {
    method: 'POST',
  });
  return res.json();
}

export async function listArtifacts(runId?: string): Promise<Artifact[]> {
  const url = runId ? `${API_BASE}/runs/${runId}/artifacts` : `${API_BASE}/artifacts`;
  const res = await fetch(url);
  const data = await res.json();
  return data.artifacts || [];
}

export async function getArtifact(artifactId: string): Promise<Artifact> {
  const res = await fetch(`${API_BASE}/artifacts/${artifactId}`);
  const data = await res.json();
  return data.artifact;
}

export async function fetchEvaluations(): Promise<EvaluationSummary> {
  const res = await fetch(`${API_BASE}/evaluations`);
  const data = await res.json();
  return data.summary;
}

export async function runEvaluations(): Promise<EvaluationSummary> {
  const res = await fetch(`${API_BASE}/evaluations/run`, { method: 'POST' });
  const data = await res.json();
  return data.summary;
}
