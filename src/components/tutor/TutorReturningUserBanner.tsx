import React from 'react';
import { Sparkles, ArrowRight, Map, HelpCircle, RotateCcw } from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

interface TutorReturningUserBannerProps {
  lastChapterNumber: string;
  lastChapterTitle: string;
  completedCount: number;
  onContinue: () => void;
  onOpenMap: () => void;
  className?: string;
}

export const TutorReturningUserBanner: React.FC<TutorReturningUserBannerProps> = ({
  lastChapterNumber,
  lastChapterTitle,
  completedCount,
  onContinue,
  onOpenMap,
  className = '',
}) => {
  const { openTutorWithTab } = useTutorEvo();

  return (
    <div
      className={`w-full rounded-2xl bg-[#0e1322] border border-amber-500/40 p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans-editorial ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              BIENVENIDO DE NUEVO A TOMO 01
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              {completedCount} de 7 completados
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-extrabold text-white">
            Último punto: Capítulo {lastChapterNumber} — {lastChapterTitle}
          </h4>
          <p className="text-xs text-zinc-300">
            Tutor EVO guardó tu avance exacto. Podés retomar de inmediato o revisar tu mapa de progreso.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
        {/* ACCIÓN PRINCIPAL DOMINANTE */}
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 md:flex-initial px-6 py-3 rounded-xl font-mono-tech font-black text-xs uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-400/20"
        >
          <span>CONTINUAR DONDE QUEDÉ</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>

        {/* ACCIÓN SECUNDARIA */}
        <button
          type="button"
          onClick={onOpenMap}
          className="px-4 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-mono-tech font-bold text-xs uppercase tracking-wider border border-zinc-700/80 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Map className="w-3.5 h-3.5 text-cyan-400" />
          <span>VER MAPA</span>
        </button>
      </div>
    </div>
  );
};
