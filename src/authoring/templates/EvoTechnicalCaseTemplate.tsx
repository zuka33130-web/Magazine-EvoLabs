import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CaseSchema } from '../schema';
import { EvoEvidenceResultTemplate } from './EvoEvidenceResultTemplate';

interface EvoTechnicalCaseTemplateProps {
  caseObj: CaseSchema;
  onResolveCase?: () => void;
}

export const EvoTechnicalCaseTemplate: React.FC<EvoTechnicalCaseTemplateProps> = ({
  caseObj,
  onResolveCase,
}) => {
  const [unlockedEvidenceIds, setUnlockedEvidenceIds] = useState<Set<string>>(new Set());
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  const selectedHypothesis = caseObj.hypotheses.find((h) => h.id === selectedHypothesisId);
  const isCorrect = selectedHypothesis?.isCorrectCause ?? false;

  const handleExecuteAction = (actionId: string, evidenceId: string) => {
    setUnlockedEvidenceIds((prev) => new Set([...prev, evidenceId]));
  };

  const handleEvaluateHypothesis = () => {
    if (!selectedHypothesisId) return;
    setIsEvaluated(true);
    if (isCorrect) {
      onResolveCase?.();
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 py-6 text-zinc-100 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#090c13] border border-rose-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
            <FileSearch className="w-4 h-4" />
            <span>EXPEDIENTE TÉCNICO // {caseObj.difficulty}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">{caseObj.id}</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">v{caseObj.version}</span>
        </div>

        <h2 className="text-2xl font-black text-white font-mono">{caseObj.title}</h2>
        <p className="text-xs text-zinc-300 italic">{caseObj.scenario}</p>

        {/* Symptoms Board */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
          <div className="text-xs font-bold font-mono text-rose-400 uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Síntomas Reportados:
          </div>
          <ul className="text-xs text-zinc-200 list-disc pl-4 space-y-0.5">
            {caseObj.symptoms.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Progressive Investigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions / Available tests */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider">
            1. Acciones de Investigación Disponibles
          </h3>

          <div className="space-y-2.5">
            {caseObj.possibleActions.map((act) => {
              const isUnlocked = unlockedEvidenceIds.has(act.unlockedEvidenceId);
              return (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{act.label}</span>
                    <span className="text-[10px] font-mono text-zinc-400">Herramienta: {act.toolRequired}</span>
                  </div>

                  {isUnlocked ? (
                    <span className="text-emerald-400 font-mono font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Evidencia Descubierta
                    </span>
                  ) : (
                    <button
                      onClick={() => handleExecuteAction(act.id, act.unlockedEvidenceId)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                    >
                      Ejecutar Prueba
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Evidence Board */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center justify-between">
            <span>2. Evidencia Recabada</span>
            <span className="text-xs text-zinc-500 font-normal">({unlockedEvidenceIds.size}/{caseObj.availableEvidence.length})</span>
          </h3>

          <div className="space-y-2.5">
            {caseObj.availableEvidence.map((ev) => {
              const isUnlocked = unlockedEvidenceIds.has(ev.id);
              if (!isUnlocked) {
                return (
                  <div key={ev.id} className="p-3 rounded-xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center text-xs font-mono text-zinc-600">
                    [EVIDENCIA BLOQUEADA - EJECUTA UNA ACCIÓN DE INVESTIGACIÓN]
                  </div>
                );
              }

              return (
                <div key={ev.id} className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono">{ev.label}</span>
                    <span className="text-[9px] font-mono px-2 py-0.2 rounded bg-black/40 border border-emerald-500/30 text-emerald-300">
                      {ev.provenance}
                    </span>
                  </div>
                  <div className="text-emerald-300 font-mono text-[11px]">{ev.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hypothesis Testing Matrix */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider">
          3. Hipótesis Explicativa de Causa Raíz
        </h3>

        <div className="space-y-2.5">
          {caseObj.hypotheses.map((hyp) => {
            const isSelected = selectedHypothesisId === hyp.id;
            return (
              <button
                key={hyp.id}
                onClick={() => {
                  setSelectedHypothesisId(hyp.id);
                  setIsEvaluated(false);
                }}
                className={`w-full p-4 rounded-xl border text-left text-xs transition-all space-y-1 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-400 text-white'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <span className="font-bold font-mono text-sm block">{hyp.title}</span>
                <p className="text-zinc-400 font-sans text-xs">{hyp.description}</p>
              </button>
            );
          })}
        </div>

        {/* Evaluation Output */}
        {isEvaluated && selectedHypothesis && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in ${
              isCorrect
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold uppercase font-mono">
              {isCorrect ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {isCorrect ? 'Causa Raíz Verificada con Evidencia' : 'Hipótesis Refutada'}
            </div>
            <p className="font-sans leading-relaxed text-zinc-200">
              {isCorrect ? caseObj.resolutionDiagnosis.technicalJustification : selectedHypothesis.refutationExplanation}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] font-mono text-zinc-500">
            Skills: {caseObj.demonstratedSkills.join(', ')}
          </span>

          <button
            onClick={handleEvaluateHypothesis}
            disabled={!selectedHypothesisId}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:pointer-events-none text-black font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Evaluar Hipótesis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Generated Evidence when resolved */}
      {isEvaluated && isCorrect && caseObj.evidenceGenerated.length > 0 && (
        <div className="pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider">
            Evidencia Pericial Generada
          </h3>
          {caseObj.evidenceGenerated.map((ev) => (
            <EvoEvidenceResultTemplate key={ev.id} evidence={ev} />
          ))}
        </div>
      )}
    </div>
  );
};
