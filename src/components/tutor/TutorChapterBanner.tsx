import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Activity,
  CheckCircle2,
  Zap,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

export type EvoMethodStage =
  | 'ENTENDER'
  | 'OBSERVAR'
  | 'PRACTICAR'
  | 'DIAGNOSTICAR'
  | 'COMPROBAR'
  | 'AVANZAR';

interface TutorChapterBannerProps {
  chapterNumber: string;
  chapterTitle: string;
  currentStage: EvoMethodStage;
  currentAction: string;
  tutorExplanation: string;
  nextStep: string;
  whatToLookFor?: string;
  onOpenMap?: () => void;
  className?: string;
}

const METHOD_STAGES: { id: EvoMethodStage; label: string; number: string }[] = [
  { id: 'ENTENDER', label: 'ENTENDER', number: '1' },
  { id: 'OBSERVAR', label: 'OBSERVAR', number: '2' },
  { id: 'PRACTICAR', label: 'PRACTICAR', number: '3' },
  { id: 'DIAGNOSTICAR', label: 'DIAGNOSTICAR', number: '4' },
  { id: 'COMPROBAR', label: 'COMPROBAR', number: '5' },
  { id: 'AVANZAR', label: 'AVANZAR', number: '6' },
];

export const TutorChapterBanner: React.FC<TutorChapterBannerProps> = ({
  chapterNumber,
  chapterTitle,
  currentStage,
  currentAction,
  tutorExplanation,
  nextStep,
  whatToLookFor,
  onOpenMap,
  className = '',
}) => {
  const { openTutorWithTab, mode } = useTutorEvo();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div
      className={`w-full rounded-2xl bg-[#0a0e18] border border-amber-500/30 p-4 sm:p-5 shadow-xl font-sans-editorial text-white mb-6 relative overflow-hidden ${className}`}
    >
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar: Location & Tutor Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        {/* ESTÁS ACÁ */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>ESTÁS ACÁ:</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
            Tomo 01
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-white font-bold">
            Capítulo {chapterNumber}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-cyan-400 font-bold bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
            {currentStage}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
          >
            <span>{isExpanded ? 'Contraer' : 'Ver orientación'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => openTutorWithTab('explain')}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/40 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>? TUTOR EVO</span>
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="pt-3.5 space-y-4 animate-in fade-in duration-200">
          {/* Method Stepper Chain */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
            {METHOD_STAGES.map((s, idx) => {
              const isActive = s.id === currentStage;
              const isPast =
                METHOD_STAGES.findIndex((m) => m.id === currentStage) > idx;

              return (
                <div key={s.id} className="flex items-center gap-1 shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      isActive
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                        : isPast
                        ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-950 text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span>{s.number}.</span>
                    )}
                    <span>{s.label}</span>
                  </div>

                  {idx < METHOD_STAGES.length - 1 && (
                    <span className="text-zinc-700 text-xs px-0.5">→</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3 Columns / Cards of Immediate Action */}
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            {/* AHORA: Acción Concreta */}
            <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>AHORA: QUÉ HACÉS</span>
              </span>
              <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                {currentAction}
              </p>
            </div>

            {/* TUTOR EVO DICE: Explicación Contextual */}
            <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>TUTOR EVO DICE</span>
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
                {tutorExplanation}
              </p>
            </div>

            {/* DESPUÉS: Próximo Paso */}
            <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider uppercase flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-emerald-400" />
                <span>DESPUÉS: QUÉ SIGUE</span>
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
                {nextStep}
              </p>
            </div>
          </div>

          {/* Optional Observation Tip */}
          {whatToLookFor && (
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center gap-2 text-xs text-zinc-300">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-white font-mono text-[11px]">QUÉ MIRAR: </strong>
                {whatToLookFor}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
