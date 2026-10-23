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
          <div className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-slate-900 font-mono text-xs font-bold uppercase mb-2">
            PHASE 13: REPEATABLE AGENT BENCHMARK
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
            NVIDIA Nemotron Benchmark Suite
          </h1>
          <p className="font-mono text-xs sm:text-sm text-slate-600 mt-1">
            Standardized evaluation testing 15 distinct edge cases: malformed plans, tool timeouts, hallucinations, and recovery.
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={isRunning}
          className="btn-retro btn-retro-primary px-6 py-2.5 text-xs uppercase disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Evaluating 15 Benchmarks...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1.5 fill-slate-950" /> Run Full Evaluation Suite →
            </>
          )}
        </button>
      </div>

      {/* Metrics Row */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-retro p-5 bg-white">
            <span className="text-xs font-mono font-bold uppercase text-slate-600 block mb-1">Planning Success</span>
            <div className="font-mono text-3xl font-black text-blue-600">{summary.planningSuccessRate}%</div>
            <p className="font-mono text-[11px] text-slate-500 mt-1">Structured JSON conformant</p>
          </div>

          <div className="card-retro p-5 bg-white">
            <span className="text-xs font-mono font-bold uppercase text-slate-600 block mb-1">Verification Pass Rate</span>
            <div className="font-mono text-3xl font-black text-emerald-600">{summary.verificationPassRate}%</div>
            <p className="font-mono text-[11px] text-slate-500 mt-1">Satisfied acceptance rules</p>
          </div>

          <div className="card-retro p-5 bg-white">
            <span className="text-xs font-mono font-bold uppercase text-slate-600 block mb-1">Mean Response Latency</span>
            <div className="font-mono text-3xl font-black text-slate-950">{summary.averageLatencyMs}ms</div>
            <p className="font-mono text-[11px] text-slate-500 mt-1">Nebius Token Factory roundtrip</p>
          </div>

          <div className="card-retro p-5 bg-white">
            <span className="text-xs font-mono font-bold uppercase text-slate-600 block mb-1">Tokens Benchmarked</span>
            <div className="font-mono text-3xl font-black text-amber-500">
              {summary.totalTokensUsed.toLocaleString()}
            </div>
            <p className="font-mono text-[11px] text-slate-500 mt-1">Prompt + Completion</p>
          </div>
        </div>
      )}

      {/* Benchmark Scenarios Table */}
      <div className="card-retro p-6 sm:p-8 bg-white space-y-5">
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
          <h2 className="font-display text-lg font-black text-slate-950 uppercase flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Evaluation Scenarios Matrix (15 Tasks)
          </h2>
          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-900">
            Standard Suite
          </span>
        </div>

        {summary ? (
          <div className="overflow-x-auto rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-amber-100 text-slate-950 border-b-2 border-slate-900 font-bold uppercase">
                  <th className="p-3">#ID</th>
                  <th className="p-3">Scenario Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Plan Valid</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3 text-right">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {summary.results.map((res, idx) => (
                  <tr key={res.scenarioId} className="hover:bg-amber-50/50 transition-colors">
                    <td className="p-3 font-bold text-slate-500">#{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-950">{res.scenarioName}</td>
                    <td className="p-3 text-[11px] font-bold text-blue-700">
                      {res.category}
                    </td>
                    <td className="p-3">
                      {res.planningSucceeded ? (
                        <span className="text-emerald-700 font-bold">Passed</span>
                      ) : (
                        <span className="text-rose-600 font-bold">Rejected</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border border-slate-900 uppercase ${
                          res.actualStatus === 'completed'
                            ? 'bg-emerald-100 text-emerald-900'
                            : res.actualStatus === 'partially_completed'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {res.actualStatus}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-700">{res.latencyMs}ms</td>
                    <td className="p-3 text-right text-[11px] text-slate-600">
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
