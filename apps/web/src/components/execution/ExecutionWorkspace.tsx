import React, { useState, useEffect } from 'react';
import {
  WorkflowRun,
  WorkflowStep,
  RunEvent,
} from '@flowpilot/shared';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Clock,
  XCircle,
  Terminal,
  FileText,
  Radio,
  Loader2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useRunEvents } from '../../hooks/useRunEvents';
import { getRunDetails, cancelRun } from '../../lib/api';

interface ExecutionWorkspaceProps {
  runId: string;
  onViewReport: (runId: string) => void;
  onCancel: () => void;
}

export const ExecutionWorkspace: React.FC<ExecutionWorkspaceProps> = ({
  runId,
  onViewReport,
  onCancel,
}) => {
  const { events, isConnected, lastEvent } = useRunEvents(runId);
  const [run, setRun] = useState<WorkflowRun | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [activeStepTab, setActiveStepTab] = useState<string | null>(null);
  const [elapsedSecs, setElapsedSecs] = useState<number>(0);

  // Poll details periodically or on event trigger
  useEffect(() => {
    let interval: any;
    const fetchState = () => {
      getRunDetails(runId)
        .then((data) => {
          setRun(data.run);
          setSteps(data.steps);
          if (!activeStepTab && data.steps.length > 0) {
            setActiveStepTab(data.steps[0].stepId);
          }
        })
        .catch(() => {});
    };

    fetchState();
    interval = setInterval(fetchState, 1500);

    return () => clearInterval(interval);
  }, [runId, lastEvent]);

  // Elapsed timer
  useEffect(() => {
    if (run?.status === 'completed' || run?.status === 'failed' || run?.status === 'cancelled') {
      return;
    }
    const timer = setInterval(() => {
      setElapsedSecs((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [run?.status]);

  const handleCancel = async () => {
    await cancelRun(runId);
    onCancel();
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verified Complete
          </span>
        );
      case 'partially_completed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Partially Complete
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium animate-pulse">
            <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            Executing Tools
          </span>
        );
      case 'verifying':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-mono font-medium">
            <Activity className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            Auditing Evidence
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono font-medium">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Failed
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
            {status || 'Queued'}
          </span>
        );
    }
  };

  const selectedStep = steps.find((s) => s.stepId === activeStepTab);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Run Status Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getStatusBadge(run?.status)}
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-ping' : 'text-slate-600'}`} />
                <span>{isConnected ? 'SSE Live Stream Connected' : 'Connecting to Stream...'}</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Execution Workspace: {run?.goal}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Elapsed: {elapsedSecs}s</span>
            </div>

            {(run?.status === 'completed' || run?.status === 'partially_completed') && (
              <button
                onClick={() => onViewReport(runId)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs tracking-tight shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> View Verified Report
              </button>
            )}

            {run?.status === 'running' && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900 text-xs font-medium transition-all"
              >
                Cancel Execution
              </button>
            )}
          </div>
        </div>

        {run?.completionSummary && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300">
            {run.completionSummary}
          </div>
        )}
      </div>

      {/* Main Grid: Steps Timeline & Active Step Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Steps Column (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Workflow Steps ({steps.length})</span>
            <span>Progress: {steps.filter((s) => s.status === 'passed').length}/{steps.length}</span>
          </h2>

          <div className="space-y-2">
            {steps.map((step) => {
              const isSelected = step.stepId === activeStepTab;
              return (
                <div
                  key={step.stepId}
                  onClick={() => setActiveStepTab(step.stepId)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/80 border-cyan-500/60 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {step.status === 'passed' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {step.status === 'running' && (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                      )}
                      {step.status === 'retrying' && (
                        <RotateCcw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                      )}
                      {step.status === 'failed' && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      {step.status === 'pending' && (
                        <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                      )}

                      <div>
                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span>{step.toolId}</span>
                          {step.attemptCount > 1 && (
                            <span className="text-amber-400">attempt {step.attemptCount}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isSelected ? 'rotate-90 text-cyan-400' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            {selectedStep ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400">Step Inspection</span>
                    <h3 className="text-sm font-bold text-slate-100">{selectedStep.title}</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Status: {selectedStep.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-slate-400">Instruction: </strong>
                  {selectedStep.instruction}
                </div>

                {/* Tool Input Payload */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Tool Input ({selectedStep.toolId})
                  </span>
                  <pre className="bg-[#060a12] p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-36">
                    {JSON.stringify(selectedStep.toolInput, null, 2)}
                  </pre>
                </div>

                {/* Tool Output & Evidence */}
                {selectedStep.rawOutput && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">
                      Validated Tool Output Evidence
                    </span>
                    <pre className="bg-[#060a12] p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-48">
                      {JSON.stringify(selectedStep.rawOutput, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Acceptance Criteria Status */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                    Step Acceptance Criteria
                  </span>
                  <div className="space-y-1">
                    {selectedStep.acceptanceCriteria.map((c) => (
                      <div
                        key={c.id}
                        className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800"
                      >
                        <span className="text-slate-300">{c.description}</span>
                        {c.passed ? (
                          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">Pending</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-xs text-slate-500 font-mono">
                Select a step to inspect input/output telemetry.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time SSE Event Log Terminal */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-semibold text-slate-200">
              Live Event Bus Telemetry ({events.length} Events)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">SSE Protocol v1.0</span>
        </div>

        <div className="bg-[#050810] p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 h-48 overflow-y-auto space-y-1.5">
          {events.length === 0 ? (
            <div className="text-slate-600 text-center py-8">Waiting for events from agent...</div>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-600 text-[10px] shrink-0 font-mono">
                  {ev.timestamp.split('T')[1].slice(0, 8)}
                </span>
                <span className="text-cyan-500 text-[11px] font-semibold shrink-0">
                  #{ev.sequence}
                </span>
                <span className="text-indigo-400 font-medium shrink-0">[{ev.eventType}]</span>
                <span className="text-slate-300 text-[11px] truncate">
                  {JSON.stringify(ev.safePayload)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
