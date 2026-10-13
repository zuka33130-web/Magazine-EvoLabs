import React from 'react';
import { Database, ShieldCheck, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { EvidenceSchema } from '../schema';

interface EvoEvidenceResultTemplateProps {
  evidence: EvidenceSchema;
  onAcceptEvidence?: () => void;
}

export const EvoEvidenceResultTemplate: React.FC<EvoEvidenceResultTemplateProps> = ({
  evidence,
  onAcceptEvidence,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-zinc-900 to-zinc-950 border border-emerald-500/40 text-zinc-100 font-sans space-y-4 my-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 block">
              ARTEFACTO DE EVIDENCIA PERICIAL
            </span>
            <span className="text-xs font-mono text-zinc-400">{evidence.id}</span>
          </div>
        </div>

        <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
          PROVENANCE: {evidence.provenance}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-white font-mono">{evidence.title}</h4>
        <p className="text-xs text-zinc-300 leading-relaxed font-sans">{evidence.description}</p>
      </div>

      {/* Expected Artifacts & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Artefactos Generados:</span>
          <ul className="text-xs text-zinc-200 list-disc pl-4 space-y-0.5 font-mono">
            {evidence.expectedArtifacts.map((art, i) => (
              <li key={i}>{art}</li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Habilidad Demostrada:</span>
          <div className="text-xs font-mono font-bold text-cyan-300 pt-1">
            {evidence.skillId}
          </div>
          <p className="text-[11px] text-zinc-400 font-sans italic pt-1">{evidence.whyExplanation}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
        <span className="text-[10px] font-mono text-zinc-500">
          Fuente: {evidence.sourceType} #{evidence.sourceId} • v{evidence.version}
        </span>

        {onAcceptEvidence && (
          <button
            onClick={onAcceptEvidence}
            className="px-4 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Incorporar a Mi Expediente</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
