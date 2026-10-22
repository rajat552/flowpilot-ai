import React, { useEffect, useState } from 'react';
import {
  Compass,
  Cpu,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { fetchReady } from '../../lib/api';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenNebiusModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenNebiusModal }) => {
  const [nebiusReady, setNebiusReady] = useState<boolean | null>(null);

  useEffect(() => {
    fetchReady()
      .then((data) => setNebiusReady(data.nebiusTokenFactory?.configured ?? false))
      .catch(() => setNebiusReady(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 glow-cyan transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                FlowPilot AI
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-medium">
                Nemotron
              </span>
            </div>
            <p className="text-[11px] text-slate-400">From instructions to verified outcomes</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              currentView === 'landing'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              currentView === 'dashboard'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('new_workflow')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              currentView === 'new_workflow'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New Workflow
          </button>
          <button
            onClick={() => onNavigate('evaluations')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              currentView === 'evaluations'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Benchmarks
          </button>
        </nav>

        {/* Actions & Nebius Status Indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNebiusModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono transition-all hover:border-slate-700"
            title="Inspect Nebius Token Factory connection"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline text-slate-300">Nebius Token Factory</span>
            {nebiusReady === true && (
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live
              </span>
            )}
            {nebiusReady === false && (
              <span className="flex items-center gap-1 text-amber-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Active
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('new_workflow')}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-semibold text-xs tracking-tight shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
          >
            + Start Run
          </button>
        </div>
      </div>
    </header>
  );
};
