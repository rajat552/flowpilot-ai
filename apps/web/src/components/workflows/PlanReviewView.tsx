import React, { useState } from 'react';
import {
  WorkflowPlan,
  WorkflowRun,
} from '@flowpilot/shared';
import {
  Layers,
  Clock,
  Coins,
  ShieldAlert,
  CheckCircle2,
  Play,
  XCircle,
  Cpu,
  ArrowRight,
  GitFork,
} from 'lucide-react';
import { approveRun, cancelRun } from '../../lib/api';

interface PlanReviewViewProps {
  run: WorkflowRun;
  plan: WorkflowPlan;
  onExecutionStarted: () => void;
  onCancelled: () => void;
}

export const PlanReviewView: React.FC<PlanReviewViewProps> = ({
  run,
  plan,
  onExecutionStarted,
  onCancelled,
}) => {
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);
    try {
      await approveRun(run.id);
      onExecutionStarted();
    } catch (err: any) {
      setError(err.message || 'Approval failed');
      setIsApproving(false);
    }
  };

  const handleCancel = async () => {
    await cancelRun(run.id);
    onCancelled();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="card-retro p-6 sm:p-8 bg-white space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-950 border border-slate-900 text-xs font-mono font-bold">
                STEP 3: HUMAN APPROVAL GATE
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">RUN #{run.id.slice(0, 8)}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              Review Proposed Execution Plan
            </h1>
            <p className="font-mono text-xs text-slate-600 mt-1">
              Nemotron has mapped this goal into {plan.steps.length} sequential and parallel tool actions.
              Verify acceptance criteria before granting execution permission.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={handleCancel}
              className="btn-retro btn-retro-secondary px-4 py-2.5 text-xs"
            >
              Reject Plan
            </button>
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="btn-retro btn-retro-primary px-6 py-2.5 text-xs disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-slate-950 mr-1.5" />
              {isApproving ? 'Initiating Execution...' : 'Approve & Execute →'}
            </button>
          </div>
        </div>

        {/* Goal Summary Pill */}
        <div className="p-3.5 rounded-lg bg-slate-50 border-2 border-slate-900 text-xs font-mono">
          <span className="text-slate-500 font-bold uppercase">Objective: </span>
          <span className="text-slate-950 font-medium">{run.goal}</span>
        </div>

        {/* Telemetry Chips */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-700">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-900 font-bold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Est. Time: ~{plan.estimatedExecutionBudget.estimatedTimeSeconds}s</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-900 font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>Est. Tokens: ~{plan.estimatedExecutionBudget.estimatedTokens}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-900 font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Risk Level: {plan.riskClassification.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-900 font-bold">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>Model: {plan.modelMetadata?.modelId || run.modelId}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-100 border-2 border-rose-600 text-xs font-mono font-bold text-rose-900">
            {error}
          </div>
        )}
      </div>

      {/* Ordered Steps Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <span>Execution DAG Pipeline</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-slate-900">
            {plan.steps.length} Steps
          </span>
        </h2>

        {plan.steps.map((step, idx) => (
          <div
            key={step.stepId}
            className="card-retro p-6 bg-white space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-400 border-2 border-slate-900 text-slate-950 font-mono text-sm flex items-center justify-center font-black shadow-[2px_2px_0px_#0f172a]">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-slate-950 uppercase">{step.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-slate-900">
                      tool: {step.toolId}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">id: {step.stepId}</span>
                  </div>
                </div>
              </div>

              {step.dependencies.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-900">
                  <GitFork className="w-3.5 h-3.5 text-blue-600" />
                  <span>Depends on: {step.dependencies.join(', ')}</span>
                </div>
              )}
            </div>

            <p className="font-mono text-xs sm:text-sm text-slate-700 leading-relaxed pl-11">
              {step.instruction}
            </p>

            {/* Expected Output */}
            <div className="pl-11 text-xs font-mono text-slate-600">
              <strong className="text-slate-900 uppercase">Expected Outcome: </strong>
              {step.expectedOutput}
            </div>

            {/* Acceptance Criteria */}
            <div className="pl-11 pt-3 border-t-2 border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
                Deterministic Acceptance Criteria:
              </span>
              <ul className="space-y-1.5 font-mono">
                {step.acceptanceCriteria.map((crit) => (
                  <li key={crit.id} className="text-xs text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{crit.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
