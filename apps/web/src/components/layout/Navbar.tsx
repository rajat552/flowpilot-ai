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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b-2 border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
            <Compass className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-950">
                FlowPilot<span className="text-blue-600">.AI</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-slate-900 font-mono font-bold">
                NEMOTRON-70B
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-mono hidden sm:block">From instructions to verified outcomes</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border-2 border-slate-900">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-all ${
              currentView === 'landing'
                ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-all ${
              currentView === 'dashboard'
                ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('new_workflow')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-all ${
              currentView === 'new_workflow'
                ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white'
            }`}
          >
            New Workflow
          </button>
          <button
            onClick={() => onNavigate('evaluations')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-all ${
              currentView === 'evaluations'
                ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white'
            }`}
          >
            Benchmarks
          </button>
        </nav>

        {/* Actions & Nebius Status Indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNebiusModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border-2 border-slate-900 text-xs font-mono font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            title="Inspect Nebius Token Factory connection"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Nebius Token Factory</span>
            {nebiusReady === true && (
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 border border-emerald-800 px-1.5 py-0.2 rounded text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live
              </span>
            )}
            {nebiusReady === false && (
              <span className="flex items-center gap-1 text-amber-800 bg-amber-100 border border-amber-800 px-1.5 py-0.2 rounded text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Active
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('new_workflow')}
            className="btn-retro btn-retro-primary px-3.5 py-1.5 text-xs"
          >
            + Start Run <span className="ml-1 text-slate-950 font-bold">→</span>
          </button>
        </div>
      </div>
    </header>
  );
};
