import React from 'react';
import { ShieldCheck, Cpu, Code2, Award, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-slate-900 bg-white text-slate-700 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-slate-950 font-black text-xs font-mono">
                FP
              </div>
              <span className="font-display font-extrabold text-slate-950 text-base">FlowPilot<span className="text-blue-600">.AI</span></span>
            </div>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              From instructions to verified outcomes. Autonomous AI workflow agent with strict deterministic
              verification, bounded retries, and authentic deliverables.
            </p>
            <div className="text-[11px] text-slate-500 font-mono font-semibold">
              Apache-2.0 License • Open Source
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Hackathon Track
            </h4>
            <p className="text-xs text-slate-700 font-mono">
              <strong className="text-slate-950">Nebius × NVIDIA Global AI Hackathon</strong>
              <br />
              Track: <span className="text-blue-600 font-bold">Best Apps and Agents</span>
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Evaluated on real tool execution, acceptance criteria, and model inference fidelity.
            </p>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-600" /> AI Infrastructure
            </h4>
            <ul className="text-xs font-mono space-y-1.5 text-slate-700">
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 border border-slate-900" />
                <span>Nebius Token Factory</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 border border-slate-900" />
                <span>NVIDIA Nemotron-70B-Instruct</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
                <span>Tavily & Live Web Scraping</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verification Loop
            </h4>
            <div className="card-retro p-3 bg-slate-50 border-2 border-slate-900 text-slate-900 font-mono text-[11px]">
              Understand → Plan → Validate → Execute → Verify → Recover → Deliver
            </div>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600">
          <p>© 2026 FlowPilot AI. Built for the Nebius × NVIDIA Global AI Hackathon.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rajat552/flowpilot-ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-950 font-bold flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-4 h-4" /> GitHub Repository
            </a>
            <span className="text-slate-400">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-slate-900 font-mono font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System: Nominal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
