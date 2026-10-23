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
          <span className="badge-retro bg-emerald-100 text-emerald-950 border-2 border-slate-900 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mr-1.5" />
            VERIFIED COMPLETE
          </span>
        );
      case 'partially_completed':
        return (
          <span className="badge-retro bg-amber-100 text-amber-950 border-2 border-slate-900 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
            PARTIALLY COMPLETE
          </span>
        );
      case 'running':
        return (
          <span className="badge-retro bg-blue-100 text-blue-950 border-2 border-slate-900 text-xs animate-pulse">
            <Loader2 className="w-3.5 h-3.5 text-blue-700 mr-1.5 animate-spin" />
            EXECUTING TOOLS
          </span>
        );
      case 'verifying':
        return (
          <span className="badge-retro bg-purple-100 text-purple-950 border-2 border-slate-900 text-xs">
            <Activity className="w-3.5 h-3.5 text-purple-700 mr-1.5 animate-spin" />
            AUDITING EVIDENCE
          </span>
        );
      case 'failed':
        return (
          <span className="badge-retro bg-rose-100 text-rose-950 border-2 border-slate-900 text-xs">
            <XCircle className="w-3.5 h-3.5 text-rose-700 mr-1.5" />
            FAILED
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge-retro bg-slate-100 text-slate-800 border-2 border-slate-900 text-xs">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="badge-retro bg-slate-100 text-slate-800 border-2 border-slate-900 text-xs">
            {status?.toUpperCase() || 'QUEUED'}
          </span>
        );
    }
  };

  const selectedStep = steps.find((s) => s.stepId === activeStepTab);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Run Status Header */}
      <div className="card-retro p-6 sm:p-8 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {getStatusBadge(run?.status)}
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700">
                <span className={`w-2.5 h-2.5 rounded-full border border-slate-900 ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <span>{isConnected ? 'SSE STREAM: CONNECTED' : 'CONNECTING...'}</span>
              </div>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
              Workspace: {run?.goal}
            </h1>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 bg-slate-100 px-3 py-2 rounded-md border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Elapsed: {elapsedSecs}s</span>
            </div>

            {(run?.status === 'completed' || run?.status === 'partially_completed') && (
              <button
                onClick={() => onViewReport(runId)}
                className="btn-retro btn-retro-primary px-5 py-2.5 text-xs uppercase"
              >
                <FileText className="w-4 h-4 mr-1.5" /> View Verified Report →
              </button>
            )}

            {run?.status === 'running' && (
              <button
                onClick={handleCancel}
                className="btn-retro bg-rose-100 hover:bg-rose-200 text-rose-900 px-4 py-2 text-xs"
              >
                Cancel Execution
              </button>
            )}
          </div>
        </div>

        {run?.completionSummary && (
          <div className="p-4 rounded-lg bg-emerald-50 border-2 border-slate-900 text-xs font-mono text-emerald-950 font-semibold">
            {run.completionSummary}
          </div>
        )}
      </div>

      {/* Main Grid: Steps Timeline & Active Step Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Steps Column (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-800 uppercase">
            <span>Workflow Steps ({steps.length})</span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-slate-900">
              Passed: {steps.filter((s) => s.status === 'passed').length}/{steps.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {steps.map((step) => {
              const isSelected = step.stepId === activeStepTab;
              return (
                <div
                  key={step.stepId}
                  onClick={() => setActiveStepTab(step.stepId)}
                  className={`p-3.5 rounded-lg border-2 border-slate-900 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-100 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5'
                      : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#0f172a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {step.status === 'passed' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {step.status === 'running' && (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                      )}
                      {step.status === 'retrying' && (
                        <RotateCcw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                      )}
                      {step.status === 'failed' && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      {step.status === 'pending' && (
                        <span className="w-4 h-4 rounded-full border-2 border-slate-400 shrink-0" />
                      )}

                      <div>
                        <h4 className="text-xs font-mono font-bold text-slate-950 line-clamp-1">
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                          <span className="font-bold uppercase">{step.toolId}</span>
                          {step.attemptCount > 1 && (
                            <span className="text-amber-800 font-bold">attempt {step.attemptCount}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-slate-900 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card-retro p-6 bg-white space-y-4">
            {selectedStep ? (
              <>
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600">Step Inspection</span>
                    <h3 className="font-display text-sm sm:text-base font-bold text-slate-950 uppercase">{selectedStep.title}</h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-900">
                    STATUS: {selectedStep.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-700">
                  <strong className="text-slate-950 uppercase font-bold">Instruction: </strong>
                  {selectedStep.instruction}
                </div>

                {/* Tool Input Payload */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-600 block mb-1">
                    Tool Input ({selectedStep.toolId})
                  </span>
                  <pre className="bg-[#0b132b] p-3 rounded-lg border-2 border-slate-900 font-mono text-[11px] text-amber-300 overflow-x-auto max-h-36">
                    {JSON.stringify(selectedStep.toolInput, null, 2)}
                  </pre>
                </div>

                {/* Tool Output & Evidence */}
                {selectedStep.rawOutput && (
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block mb-1">
                      Validated Tool Output Evidence
                    </span>
                    <pre className="bg-[#0b132b] p-3 rounded-lg border-2 border-slate-900 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-48">
                      {JSON.stringify(selectedStep.rawOutput, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Acceptance Criteria Status */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-700 block mb-1.5">
                    Step Acceptance Criteria
                  </span>
                  <div className="space-y-1.5 font-mono">
                    {selectedStep.acceptanceCriteria.map((c) => (
                      <div
                        key={c.id}
                        className="text-xs flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-900"
                      >
                        <span className="text-slate-900">{c.description}</span>
                        {c.passed ? (
                          <span className="text-[11px] font-mono font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono font-bold text-slate-500">Pending</span>
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
      <div className="card-retro p-6 bg-white space-y-3">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-950" />
            <h3 className="font-mono text-xs font-bold uppercase text-slate-950">
              Live Event Bus Telemetry ({events.length} Events)
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-900">
            SSE Protocol v1.0
          </span>
        </div>

        <div className="bg-[#0b132b] p-4 rounded-lg border-2 border-slate-900 font-mono text-xs text-slate-300 h-52 overflow-y-auto space-y-1.5">
          {events.length === 0 ? (
            <div className="text-slate-500 text-center py-10">Waiting for live events from agent orchestrator...</div>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-500 text-[10px] shrink-0 font-mono">
                  {ev.timestamp.split('T')[1].slice(0, 8)}
                </span>
                <span className="text-amber-400 text-[11px] font-bold shrink-0">
                  #{ev.sequence}
                </span>
                <span className="text-blue-400 font-bold shrink-0">[{ev.eventType}]</span>
                <span className="text-slate-200 text-[11px] truncate">
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
