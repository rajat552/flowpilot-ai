import React from 'react';
import {
  ShieldCheck,
  Cpu,
  ArrowRight,
  Terminal,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Search,
  FileCheck,
} from 'lucide-react';

interface LandingPageProps {
  onStartWorkflow: (initialGoal?: string) => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartWorkflow, onNavigate }) => {
  const samplePrompts = [
    {
      title: 'Primary Hackathon Demo',
      prompt:
        'Research three project-management products, compare their features and pricing, identify the best fit for a student team, and generate a report with sources.',
      badge: 'Recommended',
    },
    {
      title: 'Developer Issue Trackers',
      prompt:
        'Research Linear vs Jira vs GitHub Projects, compare sprint planning features and developer pricing, and evaluate for a 5-person startup.',
      badge: 'Software Teams',
    },
    {
      title: 'Vector Databases Evaluation',
      prompt:
        'Compare Pinecone, Qdrant, and Milvus on pricing tiers, latency benchmarks, and hybrid search capabilities with official documentation sources.',
      badge: 'AI Infrastructure',
    },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-10">
        {/* Ambient glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-8 glow-cyan">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nebius Token Factory × NVIDIA Nemotron</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          From Instructions to{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Verified Outcomes.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Most AI agents stop after generating plausible text. <strong className="text-white">FlowPilot AI</strong> decomposes
          goals into structured DAG plans, executes registered tools, deterministically audits evidence,
          and delivers authenticated artifacts.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onStartWorkflow(samplePrompts[0].prompt)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-sm tracking-tight shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Launch Primary Demo Workflow <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-sm transition-all"
          >
            View Dashboard & Metrics
          </button>
        </div>
      </section>

      {/* Quick Launch Sample Prompts */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">Interactive Workflows</h2>
          <h3 className="text-2xl font-bold text-white mt-1">Select an objective to decompose and execute</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {samplePrompts.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onStartWorkflow(item.prompt)}
              className="glass-card p-6 rounded-2xl hover:border-cyan-500/50 cursor-pointer transition-all hover:-translate-y-1 group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/80 font-mono">
                    {item.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">#0{idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  "{item.prompt}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Configure & Run</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiator: Unverified AI vs FlowPilot */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">The Problem & Solution</span>
            <h2 className="text-3xl font-bold text-white mt-2">Why Verified Execution Matters</h2>
            <p className="text-sm text-slate-400 mt-2">
              Existing assistants claim success without checking whether tool results actually satisfy criteria.
              FlowPilot creates a verifiable audit trail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ordinary Assistant */}
            <div className="bg-rose-950/20 border border-rose-900/40 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" /> Conventional Unverified Agents
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Hallucinates pricing when webpages cannot be scraped.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Fails silently without notifying the user or retrying.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>No approval gate; executes side-effects autonomously.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Produces answers without linking to authentic live sources.</span>
                </li>
              </ul>
            </div>

            {/* FlowPilot AI */}
            <div className="bg-cyan-950/20 border border-cyan-800/40 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" /> FlowPilot AI Verified Agent
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Deterministic Criteria:</strong> Validates products, URLs, and pricing before completion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Bounded Recovery:</strong> Automatically retries or reformulates queries on failure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Human-in-the-Loop:</strong> Review, inspect DAG dependencies, and approve before execution.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Auditable Deliverables:</strong> Preserves source URLs, retrieval dates, and metrics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 7-Step Autonomous Loop */}
      <section className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">Core Architecture</h2>
        <h3 className="text-3xl font-bold text-white mb-12">The Verified Execution Lifecycle</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { step: '01', title: 'Understand', desc: 'Goal normalization & safety check', icon: Search },
            { step: '02', title: 'Plan', desc: 'NVIDIA Nemotron DAG decomposition', icon: Layers },
            { step: '03', title: 'Validate', desc: 'Schema & tool permission review', icon: FileCheck },
            { step: '04', title: 'Execute', desc: 'Tavily, fetch & extraction tools', icon: Terminal },
            { step: '05', title: 'Verify', desc: 'Deterministic acceptance checks', icon: ShieldCheck },
            { step: '06', title: 'Recover', desc: 'Bounded retries & fallback queries', icon: RotateCcw },
            { step: '07', title: 'Deliver', desc: 'Persistent markdown artifact', icon: CheckCircle },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card p-4 rounded-xl text-left border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-400">{item.step}</span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-tight">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
