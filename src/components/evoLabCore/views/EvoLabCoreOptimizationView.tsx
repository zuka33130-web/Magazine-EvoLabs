// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — A/B EMPIRICAL OPTIMIZATION VIEW
// Principle: "NO SE ADIVINA. SE MIDE."
// ============================================================================

import React, { useState } from 'react';
import { ArrowLeft, Sliders, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle, BookOpen, Activity } from 'lucide-react';
import { Machine } from '../types';
import { OptimizationEngine, OptimizationExperiment } from '../services/optimizationEngine';
import { EvoMachinePreparedCard } from '../components/EvoMachinePreparedCard';

interface EvoLabCoreOptimizationViewProps {
  machine: Machine;
  onNavigateHome: () => void;
  onNavigateToTomo?: (tomoId: '01' | '02' | '03' | '04') => void;
  onChangeMachineRequested?: () => void;
}

export const EvoLabCoreOptimizationView: React.FC<EvoLabCoreOptimizationViewProps> = ({
  machine,
  onNavigateHome,
  onNavigateToTomo,
  onChangeMachineRequested,
}) => {
  const [experiments, setExperiments] = useState<OptimizationExperiment[]>(() =>
    OptimizationEngine.getAvailableExperiments(machine)
  );

  const handleApply = (expId: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id === expId) {
          return OptimizationEngine.applyAndCompare(exp);
        }
        return exp;
      })
    );
  };

  const handleRevert = (expId: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            status: 'REVERTED',
            afterEvidence: undefined,
            verdict: undefined,
          };
        }
        return exp;
      })
    );
  };

  const handleKeep = (expId: string) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            status: 'KEPT',
          };
        }
        return exp;
      })
    );
  };

  return (
    <div className="space-y-6 font-mono-tech select-none animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <button
          type="button"
          onClick={onNavigateHome}
          className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER AL LABORATORIO</span>
        </button>
        <span className="text-xs font-bold text-emerald-400">
          BANCO DE OPTIMIZACIÓN EMPÍRICA A/B
        </span>
      </div>

      {/* Machine Card */}
      <EvoMachinePreparedCard
        machine={machine}
        onChangeMachineRequested={onChangeMachineRequested}
        compact
      />

      {/* Philosophy Header */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d1017] space-y-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h3 className="font-display font-black text-white text-base uppercase">
            MÉTODO CIENTÍFICO DE OPTIMIZACIÓN EVO
          </h3>
        </div>
        <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
          Optimizar no es activar 50 tweaks a ciegas. Cada ajuste se aplica sobre una medición previa (BEFORE), se re-mide el resultado (AFTER), se emite un veredicto (BETTER / SAME / WORSE) y se ofrece un botón de reversión inmediata.
        </p>
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className={`p-5 rounded-2xl border transition-all ${
              exp.status === 'APPLIED' || exp.status === 'KEPT'
                ? 'border-emerald-500/50 bg-[#0c1412]'
                : 'border-zinc-800 bg-[#0d1017]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                  SUBSISTEMA: {exp.targetSubsystem.toUpperCase()} • RIESGO: {exp.riskLevel}
                </span>
                <h4 className="font-display font-bold text-white text-sm sm:text-base">
                  {exp.name}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-[10px] font-black ${
                  exp.status === 'APPLIED' || exp.status === 'KEPT'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : exp.status === 'REVERTED'
                    ? 'bg-zinc-800 text-zinc-400'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  ESTADO: {exp.status}
                </span>
              </div>
            </div>

            <p className="pt-3 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
              {exp.descriptionEs}
            </p>

            {/* A/B Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              {/* BEFORE */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
                  <span>MEDICIÓN ANTES (BEFORE)</span>
                  <span className="text-zinc-500 font-mono">{exp.beforeEvidence.provenance}</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {exp.beforeEvidence.metricName}: <span className="text-amber-400">{exp.beforeEvidence.value} {exp.beforeEvidence.unit}</span>
                </div>
                <div className="text-[11px] text-zinc-500 font-sans-editorial">
                  {exp.beforeEvidence.verdictNote}
                </div>
              </div>

              {/* AFTER */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
                  <span>MEDICIÓN DESPUÉS (AFTER)</span>
                  {exp.afterEvidence && (
                    <span className="text-emerald-400 font-mono font-bold">{exp.afterEvidence.provenance}</span>
                  )}
                </div>
                {exp.afterEvidence ? (
                  <>
                    <div className="text-sm font-bold text-white">
                      {exp.afterEvidence.metricName}: <span className="text-emerald-400">{exp.afterEvidence.value} {exp.afterEvidence.unit}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans-editorial">
                      {exp.afterEvidence.verdictNote}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-zinc-600 italic pt-2">
                    Pendiente de ejecución empírica en laboratorio.
                  </div>
                )}
              </div>
            </div>

            {/* Verdict if applied */}
            {exp.verdictExplanationEs && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{exp.verdictExplanationEs}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/60 mt-3">
              <div className="text-[11px] text-zinc-500">
                Reversibilidad: <strong>{exp.reversibility.howToRevert}</strong>
              </div>

              <div className="flex items-center gap-2">
                {exp.status === 'PENDING' || exp.status === 'REVERTED' ? (
                  <button
                    type="button"
                    onClick={() => handleApply(exp.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Activity className="w-4 h-4" />
                    <span>APLICAR Y MEDIR A/B</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleRevert(exp.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>REVERTIR (ROLLBACK)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeep(exp.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-black text-emerald-400 cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>MANTENER AJUSTE</span>
                    </button>
                  </>
                )}

                {onNavigateToTomo && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTomo('02')}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Aprender en Tomo 02"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TOMO 02</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
