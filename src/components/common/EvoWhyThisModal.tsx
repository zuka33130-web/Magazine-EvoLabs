import React from 'react';
import {
  X,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Activity,
  AlertTriangle,
  FileText,
  Lock,
  Database,
  ArrowRight,
} from 'lucide-react';
import { VerifiedClaim, EpistemicProvenance } from '../../services/evoTechnicalIdentityEngine';

interface EvoWhyThisModalProps {
  claim: VerifiedClaim | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvoWhyThisModal: React.FC<EvoWhyThisModalProps> = ({ claim, isOpen, onClose }) => {
  if (!isOpen || !claim) return null;

  const getProvenanceBadge = (provenance: EpistemicProvenance) => {
    switch (provenance) {
      case 'MEASURED':
        return (
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            PROVENANCE: MEASURED (MEDIDO DIRECTO)
          </span>
        );
      case 'SYSTEM_REPORTED':
        return (
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            PROVENANCE: SYSTEM_REPORTED (OS / WMI)
          </span>
        );
      case 'CALCULATED':
        return (
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            PROVENANCE: CALCULATED (DERIVADO MATEMÁTICO)
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            PROVENANCE: SIMULATED (LAB VIRTUAL)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-zinc-700 text-zinc-300">
            PROVENANCE: UNKNOWN / ESTIMATED
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFICADA':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            ESTADO: VERIFICADA
          </span>
        );
      case 'DEMOSTRADA':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            ESTADO: DEMOSTRADA
          </span>
        );
      case 'EN_DESARROLLO':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            ESTADO: EN DESARROLLO
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
            ESTADO: NO OBSERVADA
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0a0d14] border border-amber-500/40 rounded-2xl shadow-2xl text-zinc-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                TRAZABILIDAD EPISTÉMICA // AUDITORÍA TÉCNICA
              </span>
              <h3 className="text-base font-bold text-white">¿Por qué EVO afirma esto?</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Claim Box */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono text-zinc-400 font-bold uppercase">{claim.category} // {claim.title}</span>
              {getStatusBadge(claim.status)}
            </div>
            <p className="text-sm font-bold text-white font-mono">{claim.assertion}</p>
            <div className="pt-2 border-t border-zinc-800/80">
              {getProvenanceBadge(claim.provenance)}
            </div>
          </div>

          {/* Epistemic Reason (Why Evo says this) */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Justificación de la Afirmación
            </div>
            <p className="text-zinc-200 leading-relaxed font-sans text-xs">
              {claim.whyEvoSaysThis}
            </p>
          </div>

          {/* Empirical Proof */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wide">
              <Database className="w-4 h-4" />
              Evidencia Empírica Concreta
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
              {claim.empiricalProof}
            </div>
          </div>

          {/* Anti-Gamification / Rigor statement */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 space-y-1">
            <div className="font-bold text-zinc-300 text-[11px] uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              Garantía de Rigor Metrológico
            </div>
            <p className="text-[11px] leading-relaxed">
              En EVO LABS no existen niveles de experiencia arbitrarios ni gamificación decorativa. Cada afirmación en tu expediente
              responde estrictamente a eventos registrados en el almacenamiento local de tu navegador.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#080b10] border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
