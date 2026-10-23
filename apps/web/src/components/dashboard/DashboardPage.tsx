import React, { useState, useEffect } from 'react';
import {
  WorkflowRun,
  Artifact,
} from '@flowpilot/shared';
import {
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { listRuns, listArtifacts } from '../../lib/api';

interface DashboardPageProps {
  onNewWorkflow: () => void;
  onSelectRun: (runId: string) => void;
  onSelectArtifact: (runId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNewWorkflow,
  onSelectRun,
  onSelectArtifact,
}) => {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([listRuns(), listArtifacts()])
      .then(([r, a]) => {
        setRuns(r);
        setArtifacts(a);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const totalRuns = runs.length;
  const completedRuns = runs.filter((r) => r.status === 'completed').length;
  const verificationRate = totalRuns > 0 ? Math.round((completedRuns / totalRuns) * 100) : 100;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Welcome / Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-slate-900 font-mono text-xs font-bold uppercase mb-2">
            Execution Telemetry
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
            Workflow Dashboard
          </h1>
          <p className="font-mono text-xs sm:text-sm text-slate-600 mt-1">
            Audited execution telemetry, past DAG plans, and verified deliverable artifacts.
          </p>
        </div>

        <button
          onClick={onNewWorkflow}
          className="btn-retro btn-retro-primary px-5 py-2.5 text-xs uppercase"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New AI Workflow →
        </button>
      </div>

      {/* Metrics Row (Direct MLH Neo-Brutalist Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-retro p-5 bg-white">
          <div className="flex items-center justify-between text-slate-600 text-xs font-mono font-bold uppercase mb-2">
            <span>Total Workflows</span>
            <Compass className="w-4 h-4 text-slate-900" />
          </div>
          <div className="font-mono text-3xl font-black text-slate-950">{totalRuns}</div>
          <p className="font-mono text-[11px] text-slate-500 mt-1">Persisted execution runs</p>
        </div>

        <div className="card-retro p-5 bg-white">
          <div className="flex items-center justify-between text-slate-600 text-xs font-mono font-bold uppercase mb-2">
            <span>Verification Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-3xl font-black text-emerald-600">{verificationRate}%</div>
          <p className="font-mono text-[11px] text-slate-500 mt-1">Passed acceptance checks</p>
        </div>

        <div className="card-retro p-5 bg-white">
          <div className="flex items-center justify-between text-slate-600 text-xs font-mono font-bold uppercase mb-2">
            <span>Verified Artifacts</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-mono text-3xl font-black text-slate-950">{artifacts.length}</div>
          <p className="font-mono text-[11px] text-slate-500 mt-1">Exportable intelligence reports</p>
        </div>

        <div className="card-retro p-5 bg-white">
          <div className="flex items-center justify-between text-slate-600 text-xs font-mono font-bold uppercase mb-2">
            <span>Inference Model</span>
            <Cpu className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-mono text-sm font-black text-slate-950 uppercase truncate mt-2">
            Nemotron-70B
          </div>
          <p className="font-mono text-[11px] text-slate-500 mt-1">Nebius Token Factory</p>
        </div>
      </div>

      {/* Recent Workflow Runs */}
      <div className="card-retro p-6 sm:p-8 bg-white space-y-5">
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
          <h2 className="font-display text-lg font-black text-slate-950 uppercase flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" /> Recent Executions
          </h2>
          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-900">
            {runs.length} runs recorded
          </span>
        </div>

        {runs.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-lg bg-amber-100 border-2 border-slate-900 text-slate-900 flex items-center justify-center mx-auto shadow-[2px_2px_0px_#0f172a]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-950 uppercase">No workflows recorded yet</h3>
            <p className="font-mono text-xs text-slate-600 max-w-sm mx-auto">
              Get started by launching your first research workflow decomposed by NVIDIA Nemotron.
            </p>
            <button
              onClick={onNewWorkflow}
              className="mt-2 btn-retro btn-retro-primary px-4 py-2 text-xs"
            >
              Start First Workflow →
            </button>
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-100">
            {runs.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRun(r.id)}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-amber-50/50 px-3 rounded-lg cursor-pointer transition-colors group"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {r.goal}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500">
                    <span className="font-bold text-slate-700">RUN #{r.id.slice(0, 8)}</span>
                    <span>•</span>
                    <span>{r.createdAt ? new Date(r.createdAt).toLocaleTimeString() : ''}</span>
                    <span>•</span>
                    <span className="uppercase text-slate-600 font-bold">{r.workflowType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border border-slate-900 uppercase ${
                      r.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-900'
                        : r.status === 'running'
                        ? 'bg-blue-100 text-blue-900 animate-pulse'
                        : r.status === 'awaiting_approval'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {r.status}
                  </span>

                  <div className="w-8 h-8 rounded bg-white border border-slate-900 flex items-center justify-center text-slate-900 group-hover:bg-amber-400 group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deliverable Artifacts Grid */}
      {artifacts.length > 0 && (
        <div className="card-retro p-6 sm:p-8 bg-white space-y-5">
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
            <h2 className="font-display text-lg font-black text-slate-950 uppercase flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Exportable Artifacts
            </h2>
            <span className="font-mono text-xs text-slate-500">{artifacts.length} reports</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artifacts.map((a) => (
              <div
                key={a.id}
                onClick={() => onSelectArtifact(a.runId)}
                className="card-retro card-retro-hover p-4 bg-slate-50 cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-slate-900">
                    {a.type.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {a.createdAt.split('T')[0]}
                  </span>
                </div>
                <h4 className="font-mono font-bold text-xs text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {a.title}
                </h4>
                <p className="font-mono text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {a.contentSnippet}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
