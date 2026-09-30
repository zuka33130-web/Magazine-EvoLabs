import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Check, BookOpen } from 'lucide-react';

export interface EvoChapterNavigationFooterProps {
  currentChapterNumber: string; // '01' through '07'
  currentChapterTitle: string;
  isCompleted: boolean;
  onMarkCompleted: () => void;
  onBackToIndex: () => void;
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
  onFinishTome?: () => void;
  previousChapterLabel?: string;
  nextChapterLabel?: string;
  isNextAvailable?: boolean;
}

export const EvoChapterNavigationFooter: React.FC<EvoChapterNavigationFooterProps> = ({
  currentChapterNumber,
  currentChapterTitle,
  isCompleted,
  onMarkCompleted,
  onBackToIndex,
  onPreviousChapter,
  onNextChapter,
  onFinishTome,
  previousChapterLabel,
  nextChapterLabel,
  isNextAvailable = true,
}) => {
  const isFirstChapter = currentChapterNumber === '01';
  const isLastChapter = currentChapterNumber === '07';

  return (
    <section
      aria-label="Navegación pedagógica del capítulo"
      className="mt-12 pt-8 border-t border-zinc-800/80 bg-[#0d0f15] rounded-2xl p-6 sm:p-8 space-y-6"
    >
      {/* Top Header Information */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-850">
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
            CAPÍTULO {currentChapterNumber} // {currentChapterTitle}
          </span>
          <span className="text-zinc-600 text-xs font-mono-tech">•</span>
          <span className="text-xs font-mono-tech text-zinc-400">
            ESTADO:{' '}
            <strong className={isCompleted ? 'text-emerald-400' : 'text-yellow-400'}>
              {isCompleted ? 'TERMINADO ✓' : 'EN CURSO'}
            </strong>
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-wider uppercase text-zinc-400 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
        >
          <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
          <span>ÍNDICE DEL TOMO 01</span>
        </button>
      </div>

      {/* Main 3 Action Buttons Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Previous Button */}
        <div>
          {isFirstChapter ? (
            <button
              type="button"
              onClick={onBackToIndex}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 font-mono-tech font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-400" />
              <span>← ÍNDICE DEL TOMO 01</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPreviousChapter}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 font-mono-tech font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-400" />
              <span>← {previousChapterLabel || 'CAPÍTULO ANTERIOR'}</span>
            </button>
          )}
        </div>

        {/* Center: Mark as Completed Confirmation */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onMarkCompleted}
            className={`w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/60'
                : 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 hover:border-yellow-400/60 shadow-lg'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>TERMINADO ✓ (VOLVER A CONFIRMAR)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                <span>MARCAR COMO TERMINADO</span>
              </>
            )}
          </button>
        </div>

        {/* Next Button or Finish Tome */}
        <div>
          {isLastChapter ? (
            <button
              type="button"
              onClick={onFinishTome || onNextChapter}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-mono-tech font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:shadow-yellow-400/25 cursor-pointer"
            >
              <span>FINALIZAR TOMO // PRUEBA FINAL →</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextChapter}
              disabled={!isNextAvailable}
              className={`w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isNextAvailable
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-xl hover:shadow-yellow-400/25'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed opacity-70'
              }`}
            >
              <span>{nextChapterLabel || 'SIGUIENTE CAPÍTULO'} →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
