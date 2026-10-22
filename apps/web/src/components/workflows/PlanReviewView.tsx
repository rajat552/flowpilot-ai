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
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium">
                Step 3: Human Approval Gate
              </span>
              <span className="text-xs font-mono text-slate-500">Run ID: {run.id.slice(0, 8)}...</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Review Proposed Execution Plan</h1>
            <p className="text-xs text-slate-400 mt-1">
              Nemotron has mapped this goal into {plan.steps.length} sequential and parallel tool actions.
              Verify acceptance criteria before granting execution permission.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
            >
              Reject Plan
            </button>
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs tracking-tight shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-black" />
              {isApproving ? 'Initiating Execution...' : 'Approve & Execute'}
            </button>
          </div>
        </div>

        {/* Goal Summary Pill */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#070b14] border border-slate-800/80 text-xs">
          <span className="text-slate-400 font-mono">Objective: </span>
          <span className="text-slate-200 font-medium">{run.goal}</span>
        </div>

        {/* Telemetry Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Est. Time: ~{plan.estimatedExecutionBudget.estimatedTimeSeconds}s</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-indigo-400" />
            <span>Est. Tokens: ~{plan.estimatedExecutionBudget.estimatedTokens}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Risk Level: {plan.riskClassification.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Model: {plan.modelMetadata?.modelId || run.modelId}</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-900 text-xs text-rose-300">
            {error}
          </div>
        )}
      </div>

      {/* Ordered Steps Breakdown */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Execution DAG Pipeline ({plan.steps.length} Steps)
        </h2>

        {plan.steps.map((step, idx) => (
          <div
            key={step.stepId}
            className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-800 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{step.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      tool: {step.toolId}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">id: {step.stepId}</span>
                  </div>
                </div>
              </div>

              {step.dependencies.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                  <GitFork className="w-3 h-3 text-indigo-400" />
                  <span>Depends on: {step.dependencies.join(', ')}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              {step.instruction}
            </p>

            {/* Expected Output */}
            <div className="pl-10 text-[11px] text-slate-400">
              <strong className="text-slate-300">Expected Outcome: </strong>
              {step.expectedOutput}
            </div>

            {/* Acceptance Criteria */}
            <div className="pl-10 pt-2 border-t border-slate-800/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                Deterministic Acceptance Criteria:
              </span>
              <ul className="space-y-1">
                {step.acceptanceCriteria.map((crit) => (
                  <li key={crit.id} className="text-xs text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
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
