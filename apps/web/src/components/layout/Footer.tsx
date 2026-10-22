import React from 'react';
import { ShieldCheck, Cpu, Code2, Award, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070a12] text-slate-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                FP
              </div>
              <span className="font-bold text-slate-200 text-sm">FlowPilot AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              From instructions to verified outcomes. Autonomous AI workflow agent with strict deterministic
              verification, bounded retries, and authentic deliverables.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Apache-2.0 License • Open Source
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" /> Hackathon Track
            </h4>
            <p className="text-xs text-slate-400">
              <strong className="text-slate-200">Nebius × NVIDIA Global AI Hackathon</strong>
              <br />
              Track: <span className="text-cyan-400 font-medium">Best Apps and Agents</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Evaluated on real tool execution, acceptance criteria, and model inference fidelity.
            </p>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> AI Infrastructure
            </h4>
            <ul className="text-xs space-y-1 text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Nebius Token Factory</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>NVIDIA Nemotron-70B-Instruct</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Tavily & Live Web Scraping</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verification Loop
            </h4>
            <p className="text-xs text-slate-400 font-mono text-[11px] bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              Understand → Plan → Validate → Execute → Verify → Recover → Deliver
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FlowPilot AI. Built for the Nebius × NVIDIA Global AI Hackathon.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rajat552/flowpilot-ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" /> GitHub Repository
            </a>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-400 font-mono text-[11px]">System: Nominal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
