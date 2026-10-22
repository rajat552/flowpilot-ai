import React, { useState, useEffect } from 'react';
import {
  EvaluationSummary,
  EvaluationResult,
} from '@flowpilot/shared';
import {
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  Cpu,
  Loader2,
} from 'lucide-react';
import { fetchEvaluations, runEvaluations } from '../../lib/api';

export const EvaluationsPage: React.FC = () => {
  const [summary, setSummary] = useState<EvaluationSummary | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    fetchEvaluations().then(setSummary).catch(() => {});
  }, []);

  const handleRunAll = async () => {
    setIsRunning(true);
    try {
      const res = await runEvaluations();
      setSummary(res);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-medium">
              Phase 13: Repeatable Agent Evaluation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NVIDIA Nemotron Benchmark Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Standardized evaluation testing 15 distinct edge cases: malformed plans, tool timeouts, hallucinations, and recovery.
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs tracking-tight shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Evaluating 15 Benchmarks...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" /> Run Full Evaluation Suite
            </>
          )}
        </button>
      </div>

      {/* Metrics Row */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">Planning Success</span>
            <div className="text-2xl font-bold text-cyan-400">{summary.planningSuccessRate}%</div>
            <p className="text-[11px] text-slate-500 mt-1">Structured JSON conformant</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">Verification Pass Rate</span>
            <div className="text-2xl font-bold text-emerald-400">{summary.verificationPassRate}%</div>
            <p className="text-[11px] text-slate-500 mt-1">Satisfied acceptance rules</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">Mean Response Latency</span>
            <div className="text-2xl font-bold text-indigo-400">{summary.averageLatencyMs}ms</div>
            <p className="text-[11px] text-slate-500 mt-1">Nebius Token Factory roundtrip</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-1">Tokens Benchmarked</span>
            <div className="text-2xl font-bold text-purple-400">
              {summary.totalTokensUsed.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Prompt + Completion</p>
          </div>
        </div>
      )}

      {/* Benchmark Scenarios Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" /> Evaluation Scenarios Matrix (15 Tasks)
        </h2>

        {summary ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="pb-3 pl-2">#ID</th>
                  <th className="pb-3">Scenario Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Plan Valid</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Latency</th>
                  <th className="pb-3 text-right pr-2">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {summary.results.map((res, idx) => (
                  <tr key={res.scenarioId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pl-2 font-mono text-slate-500">#{idx + 1}</td>
                    <td className="py-3 font-semibold text-slate-200">{res.scenarioName}</td>
                    <td className="py-3 font-mono text-[11px] text-cyan-400">
                      {res.category}
                    </td>
                    <td className="py-3">
                      {res.planningSucceeded ? (
                        <span className="text-emerald-400 font-mono">Passed</span>
                      ) : (
                        <span className="text-rose-400 font-mono">Rejected</span>
                      )}
                    </td>
                    <td className="py-3 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          res.actualStatus === 'completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : res.actualStatus === 'partially_completed'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {res.actualStatus}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-400">{res.latencyMs}ms</td>
                    <td className="py-3 pr-2 text-right font-mono text-[11px] text-slate-400">
                      {res.sourcesFound} sources • {res.retryCount} retries
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-500 font-mono">
            Loading benchmark dataset...
          </div>
        )}
      </div>
    </div>
  );
};
