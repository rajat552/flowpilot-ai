import React, { useState } from 'react';
import { Sparkles, ArrowRight, Settings2, AlertCircle, Loader2 } from 'lucide-react';
import { createRun } from '../../lib/api';
import { WorkflowRun, WorkflowPlan } from '@flowpilot/shared';

interface NewWorkflowModalProps {
  initialGoal?: string;
  onPlanReady: (run: WorkflowRun, plan: WorkflowPlan) => void;
  onCancel: () => void;
}

export const NewWorkflowModal: React.FC<NewWorkflowModalProps> = ({
  initialGoal = '',
  onPlanReady,
  onCancel,
}) => {
  const [goal, setGoal] = useState<string>(
    initialGoal ||
      'Research three project-management products, compare their features and pricing, identify the best fit for a student team, and generate a report with sources.'
  );
  const [workflowType, setWorkflowType] = useState<string>('research');
  const [maxRetries, setMaxRetries] = useState<number>(2);
  const [budgetTokens, setBudgetTokens] = useState<number>(25000);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || goal.length < 5) {
      setError('Please provide a goal with at least 5 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await createRun({
        goal: goal.trim(),
        workflowType,
      });
      onPlanReady(response.run, response.plan);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize workflow');
      setIsLoading(false);
    }
  };

  const templates = [
    {
      label: 'PM Tools for Students',
      text: 'Research three project-management products, compare their features and pricing, identify the best fit for a student team, and generate a report with sources.',
    },
    {
      label: 'Developer Sprint Tools',
      text: 'Evaluate Linear, Jira, and GitHub Projects for a student software engineering capstone team with pricing and integration matrices.',
    },
    {
      label: 'Vector Database Audit',
      text: 'Analyze Pinecone, Qdrant, and Weaviate pricing tiers, open-source options, and hosting capabilities for an AI application.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-white">Create New Workflow</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Decompose your high-level goal into an approved DAG plan using NVIDIA Nemotron.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            Cancel
          </button>
        </div>

        {/* Template Pills */}
        <div className="mb-6">
          <label className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
            Quick-Start Goal Templates
          </label>
          <div className="flex flex-wrap gap-2">
            {templates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setGoal(t.text)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-200">
                Goal / Natural-Language Instruction <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">{goal.length}/2000</span>
            </div>
            <textarea
              rows={4}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Research three project-management products, compare their features and pricing..."
              className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
              required
            />
          </div>

          {/* Workflow Type */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['research', 'comparison', 'audit', 'custom'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setWorkflowType(type)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                  workflowType === type
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Advanced Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-mono"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Advanced Settings' : 'Configure Safety & Token Limits'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Max Retries per Step</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(parseInt(e.target.value, 10))}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Token Budget Ceiling</label>
                  <input
                    type="number"
                    step={1000}
                    min={1000}
                    max={50000}
                    value={budgetTokens}
                    onChange={(e) => setBudgetTokens(parseInt(e.target.value, 10))}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs tracking-tight transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Decomposing Plan...
                </>
              ) : (
                <>
                  Generate Plan with Nemotron <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
