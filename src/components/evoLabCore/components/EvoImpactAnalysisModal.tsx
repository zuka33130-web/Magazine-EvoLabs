// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — IMPACT ANALYSIS MODAL
// Principle: "IMPACT ANALYSIS: ANTES DE REEMPLAZAR, EXPLICAR QUÉ AFECTA. NO BORRAR SILENCIOSAMENTE."
// ============================================================================

import React from 'react';
import {
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  X,
} from 'lucide-react';
import { ComponentImpactAssessment } from '../types';

interface EvoImpactAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment?: ComponentImpactAssessment;
  onConfirmChange: () => void;
}

export const EvoImpactAnalysisModal: React.FC<EvoImpactAnalysisModalProps> = ({
  isOpen,
  onClose,
  assessment,
  onConfirmChange,
}) => {
  if (!isOpen || !assessment) return null;

  const hasBreaking = assessment.affectedSubsystems.some(
    (a) => a.severity === 'BREAKING_INCOMPATIBLE'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono-tech animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0d1017] border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-[#121622] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ANÁLISIS DE IMPACTO DE REEMPLAZO
              </span>
            </div>
            <h2 className="font-display font-black text-xl text-white uppercase tracking-tight">
              ESTE CAMBIO AFECTARÁ LA MACHINE
            </h2>
            <p className="text-xs text-zinc-400 font-sans-editorial">
              Estás por incorporar <strong className="text-white">{assessment.incomingComponent.model}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0 border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 font-sans-editorial text-xs leading-relaxed">
            {assessment.warningMessage}
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              SUBSISTEMAS AFECTADOS EN CADENA:
            </span>

            {assessment.affectedSubsystems.map((sub, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border space-y-1.5 ${
                  sub.severity === 'BREAKING_INCOMPATIBLE'
                    ? 'border-red-500/50 bg-red-950/20 text-red-200'
                    : 'border-yellow-500/40 bg-yellow-950/15 text-yellow-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <div className="flex items-center gap-2">
                    {sub.severity === 'BREAKING_INCOMPATIBLE' ? (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                    )}
                    <span>{sub.label}</span>
                  </div>

                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                      sub.severity === 'BREAKING_INCOMPATIBLE'
                        ? 'bg-red-500/30 text-red-300'
                        : 'bg-yellow-500/30 text-yellow-300'
                    }`}
                  >
                    {sub.severity === 'BREAKING_INCOMPATIBLE' ? 'INCOMPATIBLE' : 'REQUIERE REVALIDACIÓN'}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-300 font-sans-editorial pl-6 leading-tight">
                  {sub.impactDescription}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 text-[11px] text-zinc-400 font-sans-editorial">
            Al presionar <strong>"CAMBIAR Y REVALIDAR"</strong>, EVO CORE actualizará el componente y recalculará la matriz completa de compatibilidad en tiempo real.
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800 bg-[#0e121b] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
          >
            CANCELAR
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmChange();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>CAMBIAR Y REVALIDAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
