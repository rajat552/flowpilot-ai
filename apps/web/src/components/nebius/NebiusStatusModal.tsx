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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="card-retro p-6 sm:p-8 bg-white max-w-lg w-full space-y-6 relative shadow-[8px_8px_0px_#0f172a]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded bg-white hover:bg-slate-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 transition-colors shadow-[2px_2px_0px_#0f172a]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-amber-400 border-2 border-slate-900 text-slate-950 flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-black text-slate-950 uppercase">Nebius Token Factory</h3>
            <p className="font-mono text-xs text-slate-600">NVIDIA Nemotron Inference Service</p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-lg bg-slate-50 border-2 border-slate-900 space-y-2.5">
            <div className="flex justify-between text-slate-600">
              <span className="font-bold uppercase">Base URL:</span>
              <span className="text-slate-950 font-bold">{data?.nebiusTokenFactory?.baseUrl || 'https://api.tokenfactory.nebius.com/v1/'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-bold uppercase">Active Model:</span>
              <span className="text-blue-700 font-bold">{data?.nebiusTokenFactory?.modelId || 'nvidia/llama-3.1-nemotron-70b-instruct'}</span>
            </div>
            <div className="flex justify-between text-slate-600 items-center">
              <span className="font-bold uppercase">Status:</span>
              {data?.nebiusTokenFactory?.configured ? (
                <span className="text-emerald-800 bg-emerald-100 border border-slate-900 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Configured & Live
                </span>
              ) : (
                <span className="text-amber-900 bg-amber-100 border border-slate-900 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Deterministic Standby
                </span>
              )}
            </div>
          </div>

          {data?.nebiusTokenFactory?.testResult && (
            <div className="p-3.5 rounded-lg bg-amber-50 border-2 border-slate-900 space-y-1">
              <div className="text-[10px] font-bold text-slate-700 uppercase">Latest Inference Ping:</div>
              <p className="text-slate-950 text-xs font-semibold">{data.nebiusTokenFactory.testResult.message}</p>
              <div className="text-blue-700 text-[11px] font-bold text-right">
                Latency: {data.nebiusTokenFactory.testResult.latencyMs}ms
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100">
          <a
            href="https://nebius.com/services/token-factory"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 font-mono"
          >
            Nebius Documentation <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={checkConnection}
            disabled={isPinging}
            className="btn-retro btn-retro-primary px-4 py-2 text-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isPinging ? 'animate-spin' : ''}`} />
            {isPinging ? 'Pinging...' : 'Re-test Ping'}
          </button>
        </div>
      </div>
    </div>
  );
};
