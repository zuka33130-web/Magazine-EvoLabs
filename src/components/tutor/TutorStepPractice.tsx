import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info,
  Shield,
  HelpCircle,
  RotateCcw,
  Check,
  Terminal,
} from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

export interface PracticeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  commandOrAction?: string;
  whatToObserve: string;
  interpretation: string;
  tip?: string;
}

interface TutorStepPracticeProps {
  practiceId: string;
  title: string;
  purpose: string;
  requirements: string;
  expectedResult: string;
  steps: PracticeStep[];
  onComplete?: () => void;
  className?: string;
}

export const TutorStepPractice: React.FC<TutorStepPracticeProps> = ({
  practiceId,
  title,
  purpose,
  requirements,
  expectedResult,
  steps,
  onComplete,
  className = '',
}) => {
  const { openTutorWithTab } = useTutorEvo();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`evo_practice_done_${practiceId}`) === 'true';
    } catch {
      return false;
    }
  });
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNextStep = () => {
    if (isLastStep) {
      setIsFinished(true);
      try {
        localStorage.setItem(`evo_practice_done_${practiceId}`, 'true');
      } catch {
        // ignore
      }
      if (onComplete) onComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsFinished(false);
    setSelectedFeedback(null);
  };

  return (
    <div
      className={`w-full rounded-2xl bg-[#090d16] border border-purple-500/30 p-4 sm:p-6 text-white font-sans-editorial shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">
              PRÁCTICA PASO A PASO GUIADA
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-white">{title}</h4>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openTutorWithTab('explain')}
          className="text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Ayuda</span>
        </button>
      </div>

      {/* STATE 1: PRE-PRACTICE OVERVIEW */}
      {!hasStarted && !isFinished && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-1">
              <strong className="text-purple-400 font-mono text-[10px] block uppercase">
                ¿QUÉ VAMOS A HACER?
              </strong>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans-editorial">
                {purpose}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-1">
              <strong className="text-cyan-400 font-mono text-[10px] block uppercase">
                ¿QUÉ NECESITÁS?
              </strong>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
                {requirements}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-1 sm:col-span-2">
              <strong className="text-emerald-400 font-mono text-[10px] block uppercase">
                ¿QUÉ RESULTADO ESPERAMOS?
              </strong>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
                {expectedResult}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Práctica pericial 100% segura (sólo lectura y diagnóstico).</span>
            </div>

            <button
              type="button"
              onClick={() => setHasStarted(true)}
              className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-black bg-gradient-to-r from-purple-400 to-indigo-400 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-purple-500/20"
            >
              <span>COMENZAR PASO A PASO ({totalSteps} PASOS)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: ACTIVE STEP-BY-STEP (ONE ACTION AT A TIME) */}
      {hasStarted && !isFinished && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Step Counter Indicator */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 font-bold">
              PASO {currentStepIndex + 1} DE {totalSteps}
            </span>

            {/* Micro progress dots */}
            <div className="flex gap-1.5">
              {steps.map((s, idx) => (
                <div
                  key={s.stepNumber}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'bg-purple-400 ring-2 ring-purple-400/40'
                      : idx < currentStepIndex
                      ? 'bg-emerald-400'
                      : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Step Instruction Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-purple-500/30 space-y-3">
            <h5 className="font-extrabold text-base text-white">
              {currentStep.title}
            </h5>

            <p className="text-sm text-zinc-200 leading-relaxed font-sans-editorial">
              {currentStep.instruction}
            </p>

            {/* Command box if applicable */}
            {currentStep.commandOrAction && (
              <div className="p-3 rounded-xl bg-[#06080e] border border-zinc-800 flex items-center justify-between font-mono text-xs text-amber-300">
                <div className="flex items-center gap-2 truncate">
                  <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />
                  <code className="truncate">{currentStep.commandOrAction}</code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(currentStep.commandOrAction || '');
                  }}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 shrink-0 ml-2"
                >
                  Copiar
                </button>
              </div>
            )}

            {/* Observation & Interpretation Cards */}
            <div className="grid sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-0.5">
                <strong className="text-cyan-400 font-mono text-[10px] block uppercase">
                  QUÉ TENÉS QUE OBSERVAR:
                </strong>
                <p className="text-zinc-300 leading-relaxed">{currentStep.whatToObserve}</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-0.5">
                <strong className="text-emerald-400 font-mono text-[10px] block uppercase">
                  QUÉ SIGNIFICA EL RESULTADO:
                </strong>
                <p className="text-zinc-300 leading-relaxed">{currentStep.interpretation}</p>
              </div>
            </div>

            {currentStep.tip && (
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{currentStep.tip}</span>
              </div>
            )}
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentStepIndex === 0
                  ? 'text-zinc-600 bg-zinc-900/30 cursor-not-allowed border border-transparent'
                  : 'text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Paso Anterior</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-black bg-gradient-to-r from-purple-400 to-indigo-400 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-purple-500/20"
            >
              <span>{isLastStep ? 'FINALIZAR PRÁCTICA' : 'SIGUIENTE PASO →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: POST-PRACTICE INTERPRETATION & COMPLETION */}
      {isFinished && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-emerald-500/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PRÁCTICA COMPLETADA CON ÉXITO</span>
            </div>

            <h5 className="font-extrabold text-base text-white">
              ¿Qué obtuviste en tu pantalla?
            </h5>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
              Tutor EVO te ayuda a interpretar tu resultado. Elegí la opción que mejor describa lo que viste:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              {[
                {
                  id: 'correct',
                  label: 'Obtuve los datos esperados y los valores coinciden con la guía.',
                  verdict: 'Excelente. Tu hardware responde correctamente y la telemetría es fidedigna.',
                  badgeColor: 'text-emerald-400',
                },
                {
                  id: 'difference',
                  label: 'Los números o nombres difieren un poco respecto al ejemplo de la guía.',
                  verdict: 'Es completamente normal: cada máquina tiene especificaciones y componentes distintos. Lo importante es que lograste identificar el dato.',
                  badgeColor: 'text-cyan-400',
                },
                {
                  id: 'doubt',
                  label: 'No estoy seguro de haber entendido todos los valores.',
                  verdict: 'Podés consultar el glosario de Tutor EVO o repetir los pasos para afianzar.',
                  badgeColor: 'text-amber-400',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedFeedback(opt.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                    selectedFeedback === opt.id
                      ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{opt.label}</span>
                    {selectedFeedback === opt.id && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  {selectedFeedback === opt.id && (
                    <p className="text-[11px] text-zinc-300 pt-1 font-sans-editorial">
                      <strong className={opt.badgeColor}>Devolución: </strong>
                      {opt.verdict}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir Práctica</span>
            </button>

            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Práctica Registrada en tu Pasaporte</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
