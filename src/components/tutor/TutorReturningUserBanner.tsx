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

      <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-extrabold text-xs text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
        >
          <span>CONTINUAR DONDE QUEDÉ</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>

        <button
          type="button"
          onClick={onOpenMap}
          className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Map className="w-3.5 h-3.5 text-cyan-400" />
          <span>VER MAPA</span>
        </button>

        <button
          type="button"
          onClick={() => openTutorWithTab('explain')}
          className="px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Abrir asistencia de Tutor EVO"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>TUTOR EVO</span>
        </button>
      </div>
    </div>
  );
};
