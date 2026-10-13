import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Terminal,
  Activity,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { LabSchema } from '../schema';
import { EvoEvidenceResultTemplate } from './EvoEvidenceResultTemplate';

interface EvoInteractiveLabTemplateProps {
  lab: LabSchema;
  onLabCompleted?: () => void;
}

export const EvoInteractiveLabTemplate: React.FC<EvoInteractiveLabTemplateProps> = ({
  lab,
  onLabCompleted,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [systemState, setSystemState] = useState<Record<string, any>>(lab.initialSystemState);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[EVO LAB FACTORY] Laboratorio "${lab.title}" inicializado.`,
    `[SISTEMA] Estado base cargado con ${Object.keys(lab.initialSystemState).length} variables operativas.`,
  ]);

  const activeStep = lab.steps[activeStepIndex];
  const allStepsDone = lab.steps.length > 0 && lab.steps.every((s) => completedSteps[s.id] === true);

  const handleExecuteStep = (stepId: string) => {
    const step = lab.steps.find((s) => s.id === stepId);
    if (!step) return;

    setCompletedSteps((prev) => ({ ...prev, [stepId]: true }));
    setTerminalLogs((prev) => [
      ...prev,
      `> EJECUTANDO: ${step.title}`,
      `[OK] ${step.expectedOutcome} (PROVENANCE: ${step.provenance})`,
    ]);

    if (activeStepIndex < lab.steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  const handleResetLab = () => {
    setCompletedSteps({});
    setActiveStepIndex(0);
    setSystemState(lab.initialSystemState);
    setTerminalLogs([
      `[EVO LAB FACTORY] Laboratorio reiniciado.`,
      `[SISTEMA] Estado base restablecido.`,
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 py-6 text-zinc-100 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#090c13] border border-cyan-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Wrench className="w-4 h-4" />
            <span>LABORATORIO // {lab.labType}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Dificultad: {lab.difficulty}</span>
          </div>

          <span className="text-[10px] font-mono text-zinc-500">
            Versión: v{lab.version}
          </span>
        </div>

        <h2 className="text-2xl font-black text-white font-mono">{lab.title}</h2>
        <p className="text-xs text-zinc-300 italic">{lab.objective}</p>

        {/* Tools Required */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800 text-xs font-mono text-zinc-400 flex-wrap">
          <span className="text-zinc-500">Instrumental:</span>
          {lab.toolsRequired.map((t, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Main Lab Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Step Sequence */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider">
            Secuencia de Pasos y Validación
          </h3>

          <div className="space-y-3">
            {lab.steps.map((step, idx) => {
              const isCompleted = completedSteps[step.id] === true;
              const isCurrent = activeStepIndex === idx;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                      : isCurrent
                      ? 'bg-cyan-950/30 border-cyan-500/50 text-white'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold">
                      PASO {step.stepNumber}: {step.title}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 border border-zinc-800">
                      PROVENANCE: {step.provenance}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300">{step.instruction}</p>

                  <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60 flex items-center justify-between">
                    <span>Componente: <strong className="text-zinc-200">{step.targetComponent}</strong></span>
                    {isCompleted ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completado
                      </span>
                    ) : (
                      <button
                        onClick={() => handleExecuteStep(step.id)}
                        className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" /> Ejecutar Medición
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Telemetry Console & State */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Consola de Telemetría
          </h3>

          <div className="rounded-xl bg-black border border-zinc-800 p-4 font-mono text-xs text-emerald-300 h-64 overflow-y-auto space-y-1.5 scrollbar-thin">
            {terminalLogs.map((log, i) => (
              <div key={i} className="leading-relaxed">{log}</div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-zinc-400 font-bold uppercase">Criterios de Aprobación:</span>
              <button
                onClick={handleResetLab}
                className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reiniciar
              </button>
            </div>
            <ul className="text-zinc-300 list-disc pl-4 space-y-1 font-mono text-[11px]">
              {lab.validationCriteria.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Generated Evidence when finished */}
      {allStepsDone && lab.evidenceGenerated.length > 0 && (
        <div className="pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider">
            Evidencia Generada por el Laboratorio
          </h3>
          {lab.evidenceGenerated.map((ev) => (
            <EvoEvidenceResultTemplate key={ev.id} evidence={ev} />
          ))}
        </div>
      )}

      {/* Completion Bar */}
      <div className="p-5 rounded-2xl bg-[#090c13] border border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400">
          Estado del Lab: {allStepsDone ? (
            <strong className="text-emerald-400">LABORATORIO FINALIZADO CON ÉXITO</strong>
          ) : (
            <strong className="text-amber-400">EN PROCESO ({Object.keys(completedSteps).length}/{lab.steps.length} pasos)</strong>
          )}
        </span>

        {allStepsDone && onLabCompleted && (
          <button
            onClick={onLabCompleted}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Certificar Laboratorio</span>
            <ShieldCheck className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
