import React from 'react';
import { DiagnosticHypothesis, HypothesisStatus } from '../../types';
import { CheckCircle2, XCircle, HelpCircle, AlertTriangle, ArrowDown, Activity } from 'lucide-react';

interface HypothesisMapProps {
  hypotheses: DiagnosticHypothesis[];
}

export const HypothesisMap: React.FC<HypothesisMapProps> = ({ hypotheses }) => {
  const activeHypotheses = hypotheses.filter(
    (h) => h.status !== 'DESCARTADA_PARA_ESTE_CASO' && h.status !== 'NO_EVALUABLE'
  );
  const discardedHypotheses = hypotheses.filter(
    (h) => h.status === 'DESCARTADA_PARA_ESTE_CASO' || h.status === 'NO_EVALUABLE'
  );

  const getStatusBadge = (status: HypothesisStatus) => {
    switch (status) {
      case 'INDICIO_FUERTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono-tech text-[10px] font-bold uppercase">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            INDICIO FUERTE
          </span>
        );
      case 'INDICIO_MODERADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-mono-tech text-[10px] font-bold uppercase">
            <Activity className="w-3 h-3 text-yellow-400" />
            INDICIO MODERADO
          </span>
        );
      case 'INDICIO_DEBIL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono-tech text-[10px] font-bold uppercase">
            <HelpCircle className="w-3 h-3 text-sky-400" />
            INDICIO DÉBIL
          </span>
        );
      case 'DESCARTADA_PARA_ESTE_CASO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-400 line-through font-mono-tech text-[10px] font-bold uppercase">
            <XCircle className="w-3 h-3 text-zinc-500" />
            DESCARTADA
          </span>
        );
      case 'SIN_INDICIO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono-tech text-[10px] uppercase">
            SIN INDICIO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900/60 border border-zinc-800 text-zinc-500 font-mono-tech text-[10px] uppercase">
            PENDIENTE
          </span>
        );
    }
  };

  return (
    <div id="mapa-de-hipotesis-vivo" className="p-5 sm:p-6 rounded-3xl bg-[#0e0f14] border border-zinc-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 uppercase font-bold tracking-wider">
            <Activity className="w-4 h-4 text-yellow-400" />
            <span>MAPA DE HIPÓTESIS VIVO // EVO DIAGNOSTIC</span>
          </div>
          <p className="font-sans-editorial text-xs text-zinc-400">
            Cada respuesta y prueba técnica fortalece o descarta caminos. Sin porcentajes arbitrarios: evidencia verificable.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/60 px-3.5 py-2 rounded-xl border border-zinc-800 font-mono-tech text-xs">
          <span className="text-zinc-400 uppercase text-[11px]">HIPÓTESIS ACTIVAS:</span>
          <span className="text-yellow-400 font-black text-sm">
            {activeHypotheses.length} DE {hypotheses.length}
          </span>
          {discardedHypotheses.length > 0 && (
            <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
              <ArrowDown className="w-3 h-3" /> {discardedHypotheses.length} descartada{discardedHypotheses.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Active Hypotheses List */}
      <div className="space-y-3">
        <span className="font-mono-tech text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
          LÍNEAS DE INVESTIGACIÓN BAJO ANÁLISIS:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeHypotheses.map((hyp) => (
            <div
              key={hyp.id}
              className={`p-3.5 rounded-xl border transition-all ${
                hyp.status === 'INDICIO_FUERTE'
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/30'
                  : hyp.status === 'INDICIO_MODERADO'
                  ? 'bg-yellow-950/10 border-yellow-500/30'
                  : 'bg-black/40 border-zinc-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-white font-sans-editorial text-sm font-semibold leading-snug">
                  {hyp.label}
                </span>
                {getStatusBadge(hyp.status)}
              </div>

              <div className="flex items-center justify-between font-mono-tech text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                <span className="uppercase text-zinc-500 font-bold">{hyp.componentCategory}</span>
                {hyp.reasoning && <span className="text-zinc-400 truncate max-w-[200px]">{hyp.reasoning}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discarded Hypotheses Section */}
      {discardedHypotheses.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono-tech text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              POSIBILIDADES DESCARTADAS EN ESTE CASO ({discardedHypotheses.length}):
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {discardedHypotheses.map((hyp) => (
              <div
                key={hyp.id}
                className="px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-500 font-mono-tech text-xs flex items-center gap-2 line-through"
                title={hyp.reasoning || 'Descartada por evidencia observada'}
              >
                <XCircle className="w-3 h-3 text-zinc-600" />
                <span>{hyp.label}</span>
              </div>
            ))}
          </div>
          <p className="font-sans-editorial text-[11px] text-zinc-500 italic">
            “Descartar con certeza es avanzar: reduce el margen de error y evita gastar dinero en piezas que no solucionan la falla.”
          </p>
        </div>
      )}
    </div>
  );
};
