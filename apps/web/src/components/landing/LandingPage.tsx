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
  Database,
  GitBranch,
  CheckSquare,
} from 'lucide-react';

interface LandingPageProps {
  onStartWorkflow: (initialGoal?: string) => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartWorkflow, onNavigate }) => {
  const samplePrompts = [
    {
      title: 'PRIMARY HACKATHON DEMO',
      prompt:
        'Research three project-management products, compare their features and pricing, identify the best fit for a student team, and generate a report with sources.',
      badge: 'RECOMMENDED',
      icon: Search,
      category: 'Market Intelligence',
    },
    {
      title: 'DEVELOPER SPRINT SUITE',
      prompt:
        'Research Linear vs Jira vs GitHub Projects, compare sprint planning features and developer pricing, and evaluate for a 5-person startup.',
      badge: 'SOFTWARE TEAMS',
      icon: GitBranch,
      category: 'Tool Evaluation',
    },
    {
      title: 'VECTOR DATABASE BENCHMARK',
      prompt:
        'Compare Pinecone, Qdrant, and Milvus on pricing tiers, latency benchmarks, and hybrid search capabilities with official documentation sources.',
      badge: 'AI INFRASTRUCTURE',
      icon: Database,
      category: 'Architecture Audit',
    },
  ];

  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border-2 border-slate-900 text-slate-900 text-xs font-mono font-bold mb-6 shadow-[2px_2px_0px_#0f172a]">
          <span className="w-2 h-2 rounded-full bg-amber-400 border border-slate-900" />
          <span>NEBIUS TOKEN FACTORY × NVIDIA NEMOTRON</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-slate-950 mb-6 leading-tight uppercase">
          From Instructions to{' '}
          <span className="text-blue-600 block sm:inline">
            Verified Outcomes.
          </span>
        </h1>

        <p className="font-mono text-sm sm:text-base text-slate-700 max-w-2xl mx-auto mb-10 leading-relaxed">
          Most AI assistants stop after generating plausible text. <strong className="text-slate-950 font-bold">FlowPilot AI</strong> decomposes
          natural-language goals into structured DAG plans, executes registered tools, deterministically audits outcomes,
          and delivers authenticated artifacts with verifiable citations.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onStartWorkflow(samplePrompts[0].prompt)}
            className="w-full sm:w-auto btn-retro btn-retro-primary px-8 py-3.5 text-sm"
          >
            Launch Primary Workflow <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto btn-retro btn-retro-secondary px-6 py-3.5 text-sm"
          >
            View Dashboard & Metrics
          </button>
        </div>
      </section>

      {/* High-Impact Stats Banner (Directly styled like MLH 5M+ / 1000+ / 100 Countries) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="card-retro p-8 bg-white grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1 border-r-0 md:border-r-2 border-slate-900/10 last:border-r-0">
            <div className="font-mono font-black text-4xl sm:text-5xl text-slate-950">100%</div>
            <div className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider">Acceptance Audit</div>
          </div>
          <div className="space-y-1 border-r-0 md:border-r-2 border-slate-900/10 last:border-r-0">
            <div className="font-mono font-black text-4xl sm:text-5xl text-blue-600">7-Stage</div>
            <div className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider">Autonomous DAG</div>
          </div>
          <div className="space-y-1 border-r-0 md:border-r-2 border-slate-900/10 last:border-r-0">
            <div className="font-mono font-black text-4xl sm:text-5xl text-amber-500">15+</div>
            <div className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider">Benchmark Tasks</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono font-black text-4xl sm:text-5xl text-emerald-600">&lt;1.4s</div>
            <div className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider">Tool Execution</div>
          </div>
        </div>
      </section>

      {/* Quick Launch Interactive Objectives (Styled like MLH "Become an Organizer" & "Partner With MLH") */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded bg-amber-100 text-amber-950 border border-slate-900 font-mono text-xs font-bold uppercase mb-2">
            Interactive Objectives
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 uppercase">
            Select a Goal to Decompose and Verify
          </h2>
        </div>

        <div className="space-y-4">
          {samplePrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => onStartWorkflow(item.prompt)}
                className="card-retro card-retro-hover p-6 bg-white cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 border-2 border-slate-900 flex items-center justify-center shrink-0 group-hover:bg-amber-400 transition-colors shadow-[2px_2px_0px_#0f172a]">
                    <Icon className="w-6 h-6 text-slate-950" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-950 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-900 text-slate-800">
                        {item.badge}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-600 leading-relaxed">
                      "{item.prompt}"
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3 self-end md:self-center">
                  <span className="text-xs font-mono font-bold text-slate-700 hidden sm:inline">Launch Workflow</span>
                  <div className="w-10 h-10 rounded-lg bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-slate-950 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Differentiator: Golden Amber Banner (Directly inspired by MLH Fellowship banner) */}
      <section className="bg-mlh-amber-banner py-16 px-4 border-y-2 border-slate-900 shadow-inner">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center text-white space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest bg-slate-950/30 px-3 py-1 rounded border border-white/20 font-bold">
              The Architecture Difference
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-sm">
              Connecting Intelligence with Deterministic Truth
            </h2>
            <p className="font-mono text-xs sm:text-sm text-amber-100 max-w-2xl mx-auto">
              Conventional LLM agents hallucinate results and claim unverified success.
              FlowPilot AI bridges natural language with strict programmatic audit checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ordinary Assistant */}
            <div className="card-retro p-6 bg-white space-y-4">
              <div className="flex items-center gap-2 text-rose-600 font-mono font-bold text-sm pb-3 border-b-2 border-slate-900">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>UNVERIFIED AI AGENTS</span>
              </div>
              <ul className="space-y-3 font-mono text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-rose-100 border border-rose-600 text-rose-700 flex items-center justify-center font-black shrink-0 text-xs">✕</span>
                  <span>Hallucinates pricing when webpages cannot be scraped.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-rose-100 border border-rose-600 text-rose-700 flex items-center justify-center font-black shrink-0 text-xs">✕</span>
                  <span>Fails silently on network errors without retrying or recovering.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-rose-100 border border-rose-600 text-rose-700 flex items-center justify-center font-black shrink-0 text-xs">✕</span>
                  <span>No human approval gate; executes hazardous side-effects blindly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-rose-100 border border-rose-600 text-rose-700 flex items-center justify-center font-black shrink-0 text-xs">✕</span>
                  <span>Produces generic answers without verifiable live web links.</span>
                </li>
              </ul>
            </div>

            {/* FlowPilot AI */}
            <div className="card-retro p-6 bg-white space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-mono font-bold text-sm pb-3 border-b-2 border-slate-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>FLOWPILOT VERIFIED ENGINE</span>
              </div>
              <ul className="space-y-3 font-mono text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-100 border border-emerald-600 text-emerald-800 flex items-center justify-center font-black shrink-0 text-xs">✓</span>
                  <span><strong>Deterministic Criteria:</strong> Programmatically audits prices, URLs, and entity names.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-100 border border-emerald-600 text-emerald-800 flex items-center justify-center font-black shrink-0 text-xs">✓</span>
                  <span><strong>Bounded Recovery:</strong> Automatically reformulates search queries if results are sparse.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-100 border border-emerald-600 text-emerald-800 flex items-center justify-center font-black shrink-0 text-xs">✓</span>
                  <span><strong>Approval Safety Gate:</strong> Inspect DAG dependencies and tool risk before execution begins.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-100 border border-emerald-600 text-emerald-800 flex items-center justify-center font-black shrink-0 text-xs">✓</span>
                  <span><strong>Authenticated Deliverables:</strong> Exports complete Markdown reports with source metadata.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 7-Step Autonomous Loop (Isometric-inspired retro grid) */}
      <section className="max-w-6xl mx-auto px-4 text-center">
        <div className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-900 border border-slate-900 font-mono text-xs font-bold uppercase mb-2">
          Architecture Breakdown
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 uppercase mb-10">
          The 7-Stage Verified Execution Pipeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-left">
          {[
            { step: '01', title: 'Understand', desc: 'Goal normalization & safety intake', icon: Search, color: 'bg-amber-100 text-amber-950' },
            { step: '02', title: 'Plan', desc: 'NVIDIA Nemotron DAG decomposition', icon: Layers, color: 'bg-blue-100 text-blue-950' },
            { step: '03', title: 'Validate', desc: 'DAG circularity & tool permissions', icon: FileCheck, color: 'bg-yellow-100 text-yellow-950' },
            { step: '04', title: 'Execute', desc: 'Tavily, fetch & extraction tools', icon: Terminal, color: 'bg-emerald-100 text-emerald-950' },
            { step: '05', title: 'Verify', desc: 'Deterministic acceptance checks', icon: ShieldCheck, color: 'bg-blue-100 text-blue-950' },
            { step: '06', title: 'Recover', desc: 'Bounded retries & query mutations', icon: RotateCcw, color: 'bg-red-100 text-red-950' },
            { step: '07', title: 'Deliver', desc: 'Exportable markdown artifact', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-950' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card-retro card-retro-hover p-4 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-900 ${item.color}`}>
                      #{item.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-900" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-950 mb-1">{item.title}</h4>
                </div>
                <p className="font-mono text-[11px] text-slate-600 mt-2 leading-tight">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
