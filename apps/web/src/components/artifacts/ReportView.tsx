import React, { useState, useEffect } from 'react';
import {
  Artifact,
  WorkflowRun,
} from '@flowpilot/shared';
import {
  FileText,
  Download,
  ShieldCheck,
  ExternalLink,
  Award,
  CheckCircle2,
  Table,
  Layers,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { getRunDetails } from '../../lib/api';

interface ReportViewProps {
  runId: string;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ runId, onBack }) => {
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [run, setRun] = useState<WorkflowRun | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    getRunDetails(runId).then((data) => {
      setRun(data.run);
      const report = data.artifacts.find((a) => a.type === 'report') || data.artifacts[0];
      if (report) setArtifact(report);
    });
  }, [runId]);

  const handleDownloadMarkdown = () => {
    if (!artifact) return;
    const blob = new Blob([artifact.rawContent || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowpilot_verified_report_${runId.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!artifact?.rawContent) return;
    navigator.clipboard.writeText(artifact.rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
          >
            {copied ? '✓ Copied Markdown' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs tracking-tight shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Artifact (.md)
          </button>
        </div>
      </div>

      {/* Verified Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>VERIFIED DELIVERABLE ARTIFACT • FLOWPILOT ACCEPTANCE ENGINE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          {artifact?.title || 'Verified Project Management Evaluation Report'}
        </h1>
        <p className="text-xs text-slate-300">
          This report was synthesized from authentic live search results, audited for free-tier constraints,
          and checked against deterministic acceptance criteria.
        </p>
      </div>

      {/* Report Content Container */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        {artifact?.rawContent ? (
          <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-6 font-sans">
            {/* Render nicely formatted Markdown lines */}
            {artifact.rawContent.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-2xl font-extrabold text-white pb-3 border-b border-slate-800">
                    {paragraph.replace('# ', '')}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-lg font-bold text-cyan-400 mt-8 mb-3 flex items-center gap-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base font-bold text-slate-100 mt-4 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('|')) {
                // Render Table cleanly
                const rows = paragraph.trim().split('\n');
                return (
                  <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs font-sans">
                      <tbody>
                        {rows.map((row, rIdx) => {
                          const cells = row.split('|').filter((c) => c.trim() !== '');
                          if (rIdx === 1) return null; // Separator row
                          return (
                            <tr
                              key={rIdx}
                              className={`border-b border-slate-800/80 ${rIdx === 0 ? 'bg-slate-900/90 font-bold text-cyan-300' : 'bg-slate-950/40 text-slate-300'}`}
                            >
                              {cells.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3 border-r border-slate-800/60 last:border-r-0">
                                  {cell.trim().replace(/\*\*/g, '')}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('1. ') || paragraph.startsWith('[')) {
                return (
                  <div key={idx} className="space-y-1.5 pl-2 font-mono text-xs text-slate-300">
                    {paragraph.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                );
              }
              return (
                <p key={idx} className="text-slate-300 text-sm leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            Loading deliverable content...
          </div>
        )}
      </div>
    </div>
  );
};
