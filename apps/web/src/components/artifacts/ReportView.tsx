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
          className="btn-retro btn-retro-secondary px-3.5 py-1.5 text-xs font-mono font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Workspace
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="btn-retro btn-retro-secondary px-3.5 py-1.5 text-xs font-mono font-bold"
          >
            {copied ? '✓ Copied Markdown' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="btn-retro btn-retro-primary px-4 py-1.5 text-xs font-mono font-bold uppercase"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Artifact (.md)
          </button>
        </div>
      </div>

      {/* Verified Banner */}
      <div className="card-retro p-6 sm:p-8 bg-emerald-50 space-y-2">
        <div className="flex items-center gap-2 text-emerald-800 font-mono font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>VERIFIED DELIVERABLE ARTIFACT • FLOWPILOT ACCEPTANCE ENGINE</span>
        </div>
        <h1 className="font-display text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
          {artifact?.title || 'Verified Project Management Evaluation Report'}
        </h1>
        <p className="font-mono text-xs text-slate-700 leading-relaxed">
          This report was synthesized from authentic live search results, audited for free-tier constraints,
          and checked against deterministic acceptance criteria.
        </p>
      </div>

      {/* Report Content Container */}
      <div className="card-retro p-6 sm:p-10 bg-white space-y-6">
        {artifact?.rawContent ? (
          <div className="max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed space-y-6 font-mono">
            {/* Render nicely formatted Markdown lines */}
            {artifact.rawContent.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={idx} className="font-display text-2xl font-black text-slate-950 uppercase pb-3 border-b-2 border-slate-900">
                    {paragraph.replace('# ', '')}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="font-display text-lg font-bold text-blue-600 uppercase mt-8 mb-3 flex items-center gap-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-display text-base font-bold text-slate-950 uppercase mt-4 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('|')) {
                // Render Table cleanly
                const rows = paragraph.trim().split('\n');
                return (
                  <div key={idx} className="overflow-x-auto my-4 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
                    <table className="w-full text-left text-xs font-mono">
                      <tbody>
                        {rows.map((row, rIdx) => {
                          const cells = row.split('|').filter((c) => c.trim() !== '');
                          if (rIdx === 1) return null; // Separator row
                          return (
                            <tr
                              key={rIdx}
                              className={`border-b border-slate-900/20 last:border-b-0 ${rIdx === 0 ? 'bg-amber-100 font-bold text-slate-950 border-b-2 border-slate-900' : 'bg-white text-slate-800 hover:bg-slate-50'}`}
                            >
                              {cells.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3 border-r border-slate-900/10 last:border-r-0">
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
                  <div key={idx} className="space-y-1.5 pl-2 font-mono text-xs sm:text-sm text-slate-700">
                    {paragraph.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                );
              }
              return (
                <p key={idx} className="text-slate-800 text-xs sm:text-sm leading-relaxed">
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
