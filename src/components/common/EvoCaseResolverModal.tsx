import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  Cpu,
  Activity,
  ChevronRight,
  Database,
  Terminal,
  Award,
} from 'lucide-react';
import {
  EvoTechnicalCaseEngine,
  TechnicalCaseDefinition,
  ProgressiveEvidenceItem,
  CaseInvestigationAction,
  CaseHypothesisOption,
} from '../../services/evoTechnicalCaseEngine';

interface EvoCaseResolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseResolved?: () => void;
}

export const EvoCaseResolverModal: React.FC<EvoCaseResolverModalProps> = ({
  isOpen,
  onClose,
  onCaseResolved,
}) => {
  const [caseState, setCaseState] = useState<TechnicalCaseDefinition>(() =>
    EvoTechnicalCaseEngine.getReferenceCase()
  );
  const [selectedHypothesis, setSelectedHypothesis] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteAction = (actionId: string) => {
    const { updatedCase } = EvoTechnicalCaseEngine.executeAction(caseState, actionId);
    setCaseState(updatedCase);
  };

  const handleTestHypothesis = () => {
    if (!selectedHypothesis) return;
    const { updatedCase, isSuccess } = EvoTechnicalCaseEngine.testHypothesis(
      caseState,
      selectedHypothesis
    );
    setCaseState(updatedCase);
    if (isSuccess && onCaseResolved) {
      onCaseResolved();
    }
  };

  const unlockedCount = caseState.availableEvidence.filter((e) => e.isUnlocked).length;
  const totalEvidenceCount = caseState.availableEvidence.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#090c13] border border-amber-400/30 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase bg-amber-400/15 text-amber-300 border border-amber-400/30">
                CASE ENGINE // FASE 03
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                DIFICULTAD: {caseState.difficulty}
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-500">
                EVIDENCIA DESBLOQUEADA: {unlockedCount} DE {totalEvidenceCount}
              </span>
            </div>
            <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
              {caseState.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY CONTENT - SCROLLABLE */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto font-sans-editorial text-xs text-zinc-300">
          {/* 1. SÍNTOMAS Y ESCENARIO */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono-tech font-bold text-xs uppercase">
              <Activity className="w-4 h-4" />
              <span>ESCENARIO E INVESTIGACIÓN DE SÍNTOMAS</span>
            </div>
            <p className="text-zinc-200 leading-relaxed text-xs sm:text-sm">
              {caseState.scenario}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
              <span className="text-[10px] font-mono-tech uppercase font-bold text-zinc-400 block">
                SÍNTOMAS REPORTADOS POR EL SISTEMA:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-tech text-zinc-300">
                {caseState.symptoms.map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded bg-black/50 border border-zinc-800/80">
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. ACCIONES DE INVESTIGACIÓN (EVIDENCIA PROGRESIVA) */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="flex items-center gap-2 text-cyan-400 font-mono-tech font-bold text-xs uppercase">
                <Search className="w-4 h-4" />
                ACCIONES DE INVESTIGACIÓN DISPONIBLES
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-500">
                EJECUTE ACCIONES PARA RECOLECTAR EVIDENCIA OBJETIVA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {caseState.possibleActions.map((act) => (
                <div
                  key={act.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                    act.isExecuted
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-tech font-bold text-xs text-white uppercase">
                        {act.label}
                      </span>
                      {act.isExecuted ? (
                        <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-mono-tech uppercase font-bold">
                          EVIDENCIA OBTENIDA
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono-tech text-zinc-500">
                          {act.costMinutes} MIN DE AUDITORÍA
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans-editorial">
                      {act.description}
                    </p>
                  </div>

                  {!act.isExecuted && (
                    <button
                      type="button"
                      onClick={() => handleExecuteAction(act.id)}
                      className="mt-2 w-full px-3 py-1.5 rounded-lg bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono-tech font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>EJECUTAR PRUEBA Y RECOLECTAR EVIDENCIA</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. EVIDENCIAS DESBLOQUEADAS */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="flex items-center gap-2 text-emerald-400 font-mono-tech font-bold text-xs uppercase">
                <Database className="w-4 h-4" />
                EXPEDIENTE DE EVIDENCIA EXTRAÍDA ({unlockedCount} DE {totalEvidenceCount})
              </span>
            </div>

            {unlockedCount > 0 ? (
              <div className="space-y-3 font-mono-tech text-xs">
                {caseState.availableEvidence
                  .filter((ev) => ev.isUnlocked)
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-zinc-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[9px] font-bold uppercase">
                            {ev.category}
                          </span>
                          <span className="font-bold text-white uppercase text-xs">{ev.title}</span>
                        </div>
                        <span className="text-[9px] text-zinc-500 uppercase">
                          PROCEDENCIA: {ev.provenance}
                        </span>
                      </div>

                      <p className="text-[11px] text-amber-300 font-bold">{ev.shortSnippet}</p>
                      <pre className="p-2.5 rounded bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-normal font-mono">
                        {ev.detailedData}
                      </pre>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-dashed border-zinc-800 text-center space-y-1 text-zinc-500 font-mono-tech text-xs">
                <span>SIN EVIDENCIA OBTENIDA EN EXPEDIENTE.</span>
                <p className="text-[11px] font-sans-editorial">
                  Ejecute al menos una acción de investigación arriba para desbloquear datos reales de diagnóstico.
                </p>
              </div>
            )}
          </div>

          {/* 4. PLANTEAMIENTO DE HIPÓTESIS Y TEST */}
          {caseState.systemState !== 'RESOLVED' && (
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-amber-400/30 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="flex items-center gap-2 text-amber-400 font-mono-tech font-bold text-xs uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  EVALUACIÓN DE HIPÓTESIS PERICIAL
                </span>
                <span className="text-[10px] font-mono-tech text-zinc-500">
                  SELEACCIONE LA CAUSA RAÍZ RESPALDADA POR LA EVIDENCIA
                </span>
              </div>

              <div className="space-y-2">
                {caseState.hypotheses.map((hyp) => (
                  <label
                    key={hyp.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      selectedHypothesis === hyp.id
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hypothesis"
                      value={hyp.id}
                      checked={selectedHypothesis === hyp.id}
                      onChange={() => setSelectedHypothesis(hyp.id)}
                      className="mt-1 accent-amber-400"
                    />
                    <div className="space-y-1">
                      <span className="font-mono-tech font-bold text-xs uppercase block text-white">
                        {hyp.title}
                      </span>
                      <p className="text-[11px] text-zinc-400 font-sans-editorial">
                        {hyp.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {/* CONSECUENCIA DE DECISIONES DE HIPÓTESIS */}
              {caseState.hypothesisFeedback && (
                <div
                  className={`p-4 rounded-xl border font-mono-tech text-xs space-y-1.5 animate-in fade-in ${
                    caseState.selectedHypothesisId === 'hyp-bcd-corrupto'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/30 border-red-500/40 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold uppercase text-[10px]">
                    {caseState.selectedHypothesisId === 'hyp-bcd-corrupto' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>CONSECUENCIA Y EXPLICACIÓN DE EVIDENCIA:</span>
                  </div>
                  <p className="font-sans-editorial text-[11.5px] leading-relaxed">
                    {caseState.hypothesisFeedback}
                  </p>
                </div>
              )}

              <button
                type="button"
                disabled={!selectedHypothesis}
                onClick={handleTestHypothesis}
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20 transition-all"
              >
                <span>VALIDAR HIPÓTESIS CON EVIDENCIA EXTRAÍDA →</span>
              </button>
            </div>
          )}

          {/* 5. DICTAMEN PERICIAL FINAL Y CIERRE */}
          {caseState.systemState === 'RESOLVED' && caseState.diagnosis && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-500/40 space-y-4 font-mono-tech text-xs animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-sm">
                  <Award className="w-5 h-5" />
                  <span>{caseState.diagnosis.diagnosisTitle}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase">
                  CASO CERRADO Y GUARDADO EN MI EVO
                </span>
              </div>

              <div className="space-y-3 font-sans-editorial text-zinc-200">
                <div>
                  <strong className="text-emerald-400 font-mono-tech text-[10px] uppercase block">
                    DICTAMEN Y CAUSA RAÍZ:
                  </strong>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {caseState.diagnosis.conclusionNotes}
                  </p>
                </div>

                <div>
                  <strong className="text-emerald-400 font-mono-tech text-[10px] uppercase block">
                    JUSTIFICACIÓN TÉCNICA:
                  </strong>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    {caseState.diagnosis.technicalJustification}
                  </p>
                </div>

                <div>
                  <strong className="text-emerald-400 font-mono-tech text-[10px] uppercase block">
                    PASOS DE RESOLUCIÓN EJECUTADOS:
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300 font-mono-tech pt-1">
                    {caseState.diagnosis.remediationStepsExecuted.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="text-emerald-400 font-mono-tech text-[10px] uppercase block">
                    CAPACIDADES VERIFICADAS EN MI EVO:
                  </strong>
                  <div className="flex items-center gap-2 flex-wrap pt-1 font-mono-tech text-[9.5px]">
                    {caseState.diagnosis.demonstratedSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                CERRAR EXPEDIENTE Y VOLVER A EVO LABS →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
