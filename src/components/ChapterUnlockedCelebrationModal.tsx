import React, { useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Award } from 'lucide-react';

interface ChapterUnlockedCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedChapterNumber: string;
  completedChapterTitle: string;
  unlockedChapterNumber: string;
  unlockedChapterTitle: string;
  onOpenNextChapter: () => void;
}

export const ChapterUnlockedCelebrationModal: React.FC<ChapterUnlockedCelebrationModalProps> = ({
  isOpen,
  onClose,
  completedChapterNumber,
  completedChapterTitle,
  unlockedChapterNumber,
  unlockedChapterTitle,
  onOpenNextChapter,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-desbloqueo-capitulo"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#111217] border-2 border-yellow-400 shadow-2xl p-6 sm:p-8 text-left space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gold bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400" />

        {/* Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold tracking-widest text-yellow-400">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>METODOLOGÍA EVO // PROGRESO REGISTRADO</span>
          </div>
          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-yellow-400 text-black font-bold uppercase">
            VALIDADO
          </span>
        </div>

        {/* Main Headlines */}
        <div className="space-y-2 pt-1 border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-2 text-sm sm:text-base font-mono-tech text-yellow-400 font-bold uppercase tracking-wider">
            <span>CAPÍTULO {completedChapterNumber} COMPLETADO</span>
            <CheckCircle2 className="w-5 h-5 text-yellow-400 inline-block" />
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight leading-none">
            CAPÍTULO {unlockedChapterNumber} DESBLOQUEADO
          </h2>

          <p className="text-xs font-mono-tech uppercase text-zinc-400 tracking-wider pt-1">
            {unlockedChapterTitle}
          </p>
        </div>

        {/* Narrative Context */}
        <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-2">
          <p className="font-sans-editorial text-sm sm:text-base text-zinc-200 leading-relaxed italic">
            “Los datos de tu hardware han sido auditados y consolidados. Ya contás con el expediente técnico necesario para avanzar.”
          </p>
          <p className="text-xs font-mono-tech text-zinc-400">
            La investigación se profundiza: de observar componentes y flujos pasamos a medir cómo se comportan frente a la exigencia real.
          </p>
        </div>

        {/* Action Buttons: ABRIR CAPÍTULO XX & VOLVER AL ÍNDICE */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            id="btn-abrir-capitulo-desbloqueado"
            onClick={() => {
              onOpenNextChapter();
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-xl hover:shadow-yellow-400/25 group/btn"
          >
            <span>ABRIR CAPÍTULO {unlockedChapterNumber}</span>
            <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            id="btn-celebracion-volver-indice"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-mono-tech font-bold text-xs uppercase bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VOLVER AL ÍNDICE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
