import React, { useState } from 'react';
import {
  DiagnosticInterventionProposal,
  DiagnosticOutcomeStatus,
} from '../../types';
import { Wrench, RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface InterventionStationProps {
  proposal: DiagnosticInterventionProposal;
  onCompleteIntervention: (
    updatedProposal: DiagnosticInterventionProposal,
    outcome: DiagnosticOutcomeStatus
  ) => void;
}

export const InterventionStation: React.FC<InterventionStationProps> = ({
  proposal,
  onCompleteIntervention,
}) => {
  const [executed, setExecuted] = useState(proposal.executed || false);
  const [beforeState, setBeforeState] = useState(proposal.beforeState || '');
  const [afterState, setAfterState] = useState(proposal.afterState || '');
  const [retestResult, setRetestResult] = useState(proposal.retestResult || '');
  const [selectedOutcome, setSelectedOutcome] = useState<DiagnosticOutcomeStatus>('RESUELTO');

  const handleFinish = () => {
    onCompleteIntervention(
      {
        ...proposal,
        executed: true,
        beforeState: beforeState || 'Registrado en observaciones previas',
        afterState: afterState || 'Condición verificada tras la intervención',
        retestResult: retestResult || 'Retest ejecutado bajo carga equivalente',
      },
      selectedOutcome
    );
  };

  const outcomeOptions: Array<{ value: DiagnosticOutcomeStatus; label: string; desc: string }> = [
    { value: 'RESUELTO', label: 'RESUELTO', desc: 'La falla desapareció por completo tras la intervención controlada.' },
    { value: 'MEJORO', label: 'MEJORÓ', desc: 'Disminuyó la frecuencia o gravedad del síntoma de manera observable.' },
    { value: 'SIN_CAMBIOS', label: 'SIN CAMBIOS', desc: 'El síntoma persiste idéntico. Se descarta que esta sea la causa primaria.' },
    { value: 'EMPEORO', label: 'EMPEORÓ', desc: 'La intervención introdujo inestabilidad. Se revierte inmediatamente.' },
    { value: 'NO_PUDO_REPRODUCIRSE', label: 'NO PUDO REPRODUCIRSE', desc: 'La condición de falla no volvió a manifestarse durante el retest.' },
    { value: 'CAUSA_PROBABLE', label: 'CAUSA PROBABLE IDENTIFICADA', desc: 'Fuerte correlación técnica aunque requiere observación continuada.' },
    { value: 'DOS_HIPOTESIS_PRINCIPALES', label: 'DOS HIPÓTESIS PRINCIPALES', desc: 'Se redujo el abanico a dos componentes concretos.' },
    { value: 'MULTIFACTORIAL', label: 'MULTIFACTORIAL', desc: 'Concurrencia de varios factores (ej. temperatura + fondo + driver).' },
    { value: 'EVIDENCIA_INSUFICIENTE', label: 'EVIDENCIA INSUFICIENTE', desc: 'Los datos obtenidos no permiten aislar la causa con rigor científico.' },
    { value: 'REQUIERE_DIAGNOSTICO_ADICIONAL', label: 'REQUIERE DIAGNÓSTICO ADICIONAL', desc: 'Es necesario instrumental de taller o pruebas de estrés prolongadas.' },
  ];

  return (
    <div
      id="estacion-intervencion-controlada-taller"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-700 shadow-2xl space-y-7 relative overflow-hidden text-white"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">FASE FINAL DE TALLER</span>
          <span>•</span>
          <span>INTERVENCIÓN CONTROLADA Y RETEST</span>
        </div>
        <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight">
          PROPUESTA DE INTERVENCIÓN CON FUNDAMENTO
        </h3>
        <p className="font-sans-editorial text-sm text-zinc-400 leading-relaxed">
          En EVO LABS no cambiamos cosas al azar ni tocamos 5 configuraciones al mismo tiempo.
          Modificamos UNA sola variable respaldada por las pruebas previas, observamos el efecto y re-testeamos.
        </p>
      </div>

      {/* Proposal Dossier Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-tech text-xs">
        {/* Left Column */}
        <div className="space-y-3 p-4 rounded-2xl bg-black/50 border border-zinc-800">
          <div className="space-y-1">
            <span className="text-yellow-400 font-bold block text-[11px] uppercase">
              QUÉ VAMOS A CAMBIAR
            </span>
            <p className="text-white font-sans-editorial text-sm font-semibold">
              {proposal.whatToChange}
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-zinc-800/80">
            <span className="text-zinc-400 font-bold block text-[10px] uppercase">
              POR QUÉ
            </span>
            <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
              {proposal.why}
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-zinc-800/80">
            <span className="text-zinc-400 font-bold block text-[10px] uppercase">
              QUÉ EVIDENCIA LO RESPALDA
            </span>
            <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
              {proposal.backingEvidence}
            </p>
          </div>
        </div>

        {/* Right Column: Safety & Reversibility */}
        <div className="space-y-3 p-4 rounded-2xl bg-black/50 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-bold block text-[11px] uppercase">
              NIVEL DE RIESGO
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase">
              RIESGO {proposal.riskLevel}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
            <span className="text-zinc-400 font-bold block text-[11px] uppercase">
              REVERSIBLE
            </span>
            <span className="text-white font-bold flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {proposal.reversible ? 'SÍ, 100% REVERSIBLE' : 'REQUIERE PRECAUCIÓN'}
            </span>
          </div>

          <div className="space-y-1 pt-2 border-t border-zinc-800/80">
            <span className="text-zinc-400 font-bold block text-[10px] uppercase flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              CÓMO VOLVER ATRÁS
            </span>
            <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
              {proposal.howToRevert}
            </p>
          </div>
        </div>
      </div>

      {/* Execution Tracker */}
      <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-4 font-mono-tech text-xs">
        <span className="font-bold text-white uppercase tracking-wider block text-xs">
          REGISTRO DE CAMBIO Y RETEST // MÉTODO CIENTÍFICO:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
            <span className="text-zinc-400 block text-[10px] font-bold uppercase">1. ANTES</span>
            <input
              type="text"
              value={beforeState}
              onChange={(e) => setBeforeState(e.target.value)}
              placeholder="Ej. Tirones cada 30s / Reinicio a los 15 min..."
              className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
            <span className="text-yellow-400 block text-[10px] font-bold uppercase">2. CAMBIO APLICADO</span>
            <input
              type="text"
              value={afterState}
              onChange={(e) => setAfterState(e.target.value)}
              placeholder="Ej. Cerré launchers / Desinstalé driver / Fijé 144 FPS..."
              className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
            <span className="text-sky-400 block text-[10px] font-bold uppercase">3. RETEST BAJO MISMA CONDICIÓN</span>
            <input
              type="text"
              value={retestResult}
              onChange={(e) => setRetestResult(e.target.value)}
              placeholder="Ej. 15 min misma partida: cadencia estable..."
              className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Outcome Selection */}
      <div className="space-y-3 font-mono-tech text-xs">
        <span className="font-bold text-yellow-400 uppercase tracking-wider block text-xs">
          RESULTADO FINAL DEL CASO // DIAGNÓSTICO EVO:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {outcomeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedOutcome(opt.value)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                selectedOutcome === opt.value
                  ? 'bg-yellow-400 text-black font-bold border-yellow-400 shadow-md'
                  : 'bg-black/40 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span className="block text-xs font-bold uppercase mb-0.5">{opt.label}</span>
              <span className={`block text-[11px] font-sans-editorial ${selectedOutcome === opt.value ? 'text-black/80' : 'text-zinc-400'}`}>
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Final Action */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleFinish}
          className="px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase flex items-center gap-2 transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer"
        >
          <span>GUARDAR EXPEDIENTE Y CERRAR CASO</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
