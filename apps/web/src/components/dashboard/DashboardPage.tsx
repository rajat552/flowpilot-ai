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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Workflow Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audited execution telemetry, past plans, and verified artifacts.
          </p>
        </div>

        <button
          onClick={onNewWorkflow}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs tracking-tight shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> New AI Workflow
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Total Workflows</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalRuns}</div>
          <p className="text-[11px] text-slate-500 mt-1">Persisted execution runs</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Verification Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{verificationRate}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Passed acceptance checks</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Verified Artifacts</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{artifacts.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Exportable intelligence reports</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Inference Model</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xs font-bold text-purple-300 font-mono truncate mt-2">
            Nemotron-70B
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Nebius Token Factory</p>
        </div>
      </div>

      {/* Recent Workflow Runs */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Recent Executions
          </h2>
          <span className="text-xs font-mono text-slate-500">{runs.length} runs on record</span>
        </div>

        {runs.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">No workflows recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by launching your first research workflow with NVIDIA Nemotron.
            </p>
            <button
              onClick={onNewWorkflow}
              className="mt-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium"
            >
              Start First Workflow
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {runs.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRun(r.id)}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-3 rounded-xl cursor-pointer transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">{r.goal}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                    <span>ID: {r.id.slice(0, 8)}</span>
                    <span>•</span>
                    <span>{r.createdAt ? new Date(r.createdAt).toLocaleTimeString() : ''}</span>
                    <span>•</span>
                    <span className="capitalize">{r.workflowType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                      r.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : r.status === 'running'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse'
                        : r.status === 'awaiting_approval'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {r.status}
                  </span>

                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deliverable Artifacts Grid */}
      {artifacts.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" /> Exportable Artifacts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artifacts.map((a) => (
              <div
                key={a.id}
                onClick={() => onSelectArtifact(a.runId)}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {a.type.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {a.createdAt.split('T')[0]}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{a.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{a.contentSnippet}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
