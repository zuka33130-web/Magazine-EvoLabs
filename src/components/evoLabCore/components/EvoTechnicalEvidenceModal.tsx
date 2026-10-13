import React from 'react';
import { X, ShieldCheck, Activity, Terminal, Clock, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { TechnicalEvidence } from '../types';

interface EvoTechnicalEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceList: TechnicalEvidence[];
  title?: string;
  subtitle?: string;
}

export const EvoTechnicalEvidenceModal: React.FC<EvoTechnicalEvidenceModalProps> = ({
  isOpen,
  onClose,
  evidenceList,
  title = 'EXPEDIENTE FORENSE // EVIDENCIA TÉCNICA METROLÓGICA',
  subtitle = 'Desglose pericial de mediciones físicas, origen epistemológico y niveles de certidumbre.',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-zinc-700 bg-[#0e1219] shadow-2xl flex flex-col font-mono-tech overflow-hidden"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(34, 211, 238, 0.15)',
        }}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#080a0d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  EVO METROLOGY RECORD
                </span>
                <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  RIGOR METROLÓGICO
                </span>
              </div>
              <h2 className="font-display font-black text-white text-base sm:text-lg tracking-tight uppercase">
                {title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle banner */}
        <div className="px-5 py-2.5 bg-zinc-900/60 border-b border-zinc-800/80 text-xs text-zinc-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{subtitle}</span>
        </div>

        {/* Evidence items list */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {evidenceList.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No se han registrado trazas de evidencia para este ensayo todavía.
            </div>
          ) : (
            evidenceList.map((item, index) => (
              <div
                key={item.id || index}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {item.metricName}
                    </span>
                    <span className="text-zinc-500 text-xs">•</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-800 text-zinc-300">
                      {item.subsystem}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.provenance === 'MEASURED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : item.provenance === 'DERIVED'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : item.provenance === 'ESTIMATED'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                      }`}
                    >
                      {item.provenance}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold">
                      Confianza: {item.confidencePct}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block uppercase">Valor Medido</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {item.value} {item.unit}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block uppercase">Fuente / Sensor</span>
                    <span className="text-zinc-300 font-bold text-xs truncate block" title={item.source}>
                      {item.source}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block uppercase">Marca Temporal</span>
                    <span className="text-zinc-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp ? item.timestamp.replace('T', ' ').substring(0, 19) : 'En vivo'}
                    </span>
                  </div>
                </div>

                {item.verdictNote && (
                  <p className="text-zinc-300 text-xs bg-zinc-900/40 p-2.5 rounded-lg border-l-2 border-cyan-400">
                    {item.verdictNote}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#080a0d] flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Principio epistemológico: Toda afirmación causal requiere registro medible.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold cursor-pointer transition-all shadow-md"
          >
            CERRAR EVIDENCIA
          </button>
        </div>
      </div>
    </div>
  );
};
