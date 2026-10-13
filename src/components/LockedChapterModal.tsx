import React, { useEffect } from 'react';
import { Lock, ArrowRight, X, ArrowLeft, AlertCircle } from 'lucide-react';
import { ChapterRequirementInfo } from '../utils/chapterPrerequisites';

interface LockedChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirements: ChapterRequirementInfo | null;
  onGoToMissing: (chapterNumber: string, stationOrSection?: string) => void;
}

export const LockedChapterModal: React.FC<LockedChapterModalProps> = ({
  isOpen,
  onClose,
  requirements,
  onGoToMissing,
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

  if (!isOpen || !requirements) return null;

  const handleAction = () => {
    onGoToMissing(requirements.targetChapterNumber, requirements.targetStationOrSection);
    onClose();
  };

  return (
    <div
      id="modal-capitulo-bloqueado"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#111217] border border-zinc-700/80 shadow-2xl p-6 sm:p-8 text-left space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top subtle hairline accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 opacity-90" />

        {/* Header: Close Button & Locked Chapter Title */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/80 text-yellow-400 font-mono-tech text-[11px] uppercase font-bold tracking-widest">
                <Lock className="w-3 h-3 text-yellow-400" />
                <span>CAPÍTULO {requirements.chapterNumber} BLOQUEADO</span>
              </span>
            </div>
            <div className="pt-2">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-zinc-400 block">
                Para desbloquear:
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-snug">
                {requirements.chapterTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prerequisite Chapter Status Section */}
        <div className="space-y-3 rounded-xl bg-black/40 border border-zinc-800 p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 text-xs font-mono-tech">
            <span className="text-zinc-400 font-medium uppercase tracking-wider">
              Estado del Capítulo {requirements.prerequisiteChapterNumber}:
            </span>
            <span className="text-yellow-400 font-semibold uppercase tracking-wider truncate max-w-[200px]">
              {requirements.prerequisiteChapterTitle}
            </span>
          </div>

          {/* List of steps: Completed (✓) vs Pending (○) */}
          <ul className="space-y-2 pt-1 text-xs font-mono-tech">
            {requirements.steps.map((step) => (
              <li
                key={step.id}
                className={`flex items-center gap-2.5 transition-colors ${
                  step.completed ? 'text-zinc-200' : 'text-zinc-500'
                }`}
              >
                {step.completed ? (
                  <span className="w-4 h-4 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border border-zinc-600 text-zinc-500 flex items-center justify-center font-normal text-[10px] shrink-0">
                    ○
                  </span>
                )}
                <span className={step.completed ? 'font-medium text-zinc-200' : 'text-zinc-400'}>
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Pending Activities Card */}
        <div className="space-y-2 rounded-xl bg-yellow-400/5 border border-yellow-400/30 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono-tech font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 shrink-0 text-yellow-400" />
            <span>{requirements.missingCountText}</span>
          </div>

          <ul className="space-y-1.5 pt-1 text-xs font-mono-tech text-zinc-200">
            {requirements.pendingActivities.map((act, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-yellow-400 shrink-0 select-none">○</span>
                <span className="leading-snug text-zinc-300 font-sans-editorial text-sm">
                  {act}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions: Primary IR A LO QUE FALTA & Secondary VOLVER AL ÍNDICE */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            id="btn-ir-a-lo-que-falta"
            onClick={handleAction}
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group/btn"
          >
            <span>IR A LO QUE FALTA</span>
            <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            id="btn-modal-volver-indice"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VOLVER AL ÍNDICE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
