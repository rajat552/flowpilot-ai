import React, { useState, useEffect } from 'react';
import { Cpu, X, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { fetchReady } from '../../lib/api';

interface NebiusStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NebiusStatusModal: React.FC<NebiusStatusModalProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  const checkConnection = () => {
    setIsPinging(true);
    fetchReady()
      .then((res) => {
        setData(res);
        setIsPinging(false);
      })
      .catch(() => setIsPinging(false));
  };

  useEffect(() => {
    if (isOpen) checkConnection();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-lg w-full space-y-6 relative glow-indigo">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Nebius Token Factory Connection</h3>
            <p className="text-xs text-slate-400">NVIDIA Nemotron Inference Service</p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#060a12] border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Base URL:</span>
              <span className="text-slate-200">{data?.nebiusTokenFactory?.baseUrl || 'https://api.tokenfactory.nebius.com/v1/'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Active Model:</span>
              <span className="text-cyan-400 font-semibold">{data?.nebiusTokenFactory?.modelId || 'nvidia/llama-3.1-nemotron-70b-instruct'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              {data?.nebiusTokenFactory?.configured ? (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Configured & Verified
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" /> Deterministic Standby
                </span>
              )}
            </div>
          </div>

          {data?.nebiusTokenFactory?.testResult && (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">Latest Inference Ping:</div>
              <p className="text-slate-300 text-[11px]">{data.nebiusTokenFactory.testResult.message}</p>
              <div className="text-cyan-400 text-[10px] text-right">
                Latency: {data.nebiusTokenFactory.testResult.latencyMs}ms
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <a
            href="https://nebius.com/services/token-factory"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
          >
            Nebius Documentation <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={checkConnection}
            disabled={isPinging}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            {isPinging ? 'Pinging...' : 'Re-test Ping'}
          </button>
        </div>
      </div>
    </div>
  );
};
