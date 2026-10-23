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
      <div className="card-retro p-6 sm:p-8 bg-white space-y-6">
        <div className="flex items-center justify-between pb-5 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-400 border-2 border-slate-900 text-slate-950 shadow-[2px_2px_0px_#0f172a]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                Create New Workflow
              </h2>
            </div>
            <p className="font-mono text-xs text-slate-600 mt-1">
              Decompose your high-level goal into an approved DAG plan using NVIDIA Nemotron.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="btn-retro btn-retro-secondary px-3 py-1.5 text-xs font-mono"
          >
            Cancel
          </button>
        </div>

        {/* Template Pills */}
        <div>
          <label className="text-xs font-mono font-bold uppercase text-slate-700 block mb-2">
            Quick-Start Goal Templates
          </label>
          <div className="flex flex-wrap gap-2">
            {templates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setGoal(t.text)}
                className="text-xs font-mono font-bold px-3 py-1.5 rounded-md bg-slate-50 hover:bg-amber-100 border-2 border-slate-900 text-slate-900 transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_#0f172a]"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono font-bold uppercase text-slate-900">
                Goal / Natural-Language Instruction <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">{goal.length}/2000</span>
            </div>
            <textarea
              rows={4}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Research three project-management products, compare their features and pricing..."
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-lg p-3.5 text-xs sm:text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all font-mono leading-relaxed"
              required
            />
          </div>

          {/* Workflow Type */}
          <div>
            <label className="text-xs font-mono font-bold uppercase text-slate-700 block mb-2">
              Workflow Paradigm
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['research', 'comparison', 'audit', 'custom'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWorkflowType(type)}
                  className={`py-2 px-3 rounded-md border-2 border-slate-900 text-xs font-mono font-bold uppercase transition-all ${
                    workflowType === type
                      ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_#0f172a]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-700 hover:text-slate-950 flex items-center gap-1.5 font-mono font-bold"
            >
              <Settings2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{showAdvanced ? '[-] Hide Advanced Settings' : '[+] Configure Safety & Token Limits'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 rounded-lg bg-slate-50 border-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono font-bold text-slate-700 block mb-1">Max Retries per Step</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(parseInt(e.target.value, 10))}
                    className="w-full bg-white border-2 border-slate-900 rounded p-2 text-xs text-slate-950 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono font-bold text-slate-700 block mb-1">Token Budget Ceiling</label>
                  <input
                    type="number"
                    step={1000}
                    min={1000}
                    max={50000}
                    value={budgetTokens}
                    onChange={(e) => setBudgetTokens(parseInt(e.target.value, 10))}
                    className="w-full bg-white border-2 border-slate-900 rounded p-2 text-xs text-slate-950 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-100 border-2 border-rose-600 text-xs font-mono font-bold text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-900">
            <button
              type="button"
              onClick={onCancel}
              className="btn-retro btn-retro-secondary px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-retro btn-retro-primary px-6 py-2.5 text-xs disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Decomposing Plan...
                </>
              ) : (
                <>
                  Generate Plan with Nemotron <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
