import React from 'react';
import {
  Map,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
  FlaskConical,
  Activity,
  Check,
} from 'lucide-react';
import { ChapterItem } from '../../types';

interface TutorProgressMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: ChapterItem[];
  currentChapterNumber?: string;
  onSelectChapter: (chapterNumber: string) => void;
  onOpenExam?: () => void;
  onOpenLab?: () => void;
}

export const TutorProgressMapModal: React.FC<TutorProgressMapModalProps> = ({
  isOpen,
  onClose,
  chapters,
  currentChapterNumber = '01',
  onSelectChapter,
  onOpenExam,
  onOpenLab,
}) => {
  if (!isOpen) return null;

  const completedCount = chapters.filter((c) => c.status === 'COMPLETADO').length;
  const isExamPassed =
    typeof window !== 'undefined' &&
    localStorage.getItem('evo_tomo01_completed') === 'true';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mapa de Recorrido Real"
      className="fixed inset-0 z-[145] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 font-sans-editorial select-none"
    >
      <div className="bg-[#0b0f19] border border-zinc-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">MAPA DE RECORRIDO REAL</h3>
              <p className="text-xs text-zinc-400">
                Tomo 01 // Conocé tu PC — Progreso fidedigno basado en evidencia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Status Badge */}
        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs mb-4 shrink-0 font-mono">
          <span className="text-zinc-300">
            Capítulos Completados: <strong className="text-amber-400">{completedCount} de 7</strong>
          </span>
          <span className="text-cyan-400 font-bold">
            {isExamPassed ? '★ TEORÍA COMPROBADA' : 'EN CURSO'}
          </span>
        </div>

        {/* Linear Step-by-Step Path List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {/* Step 0: Introducción */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-500/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">00. Introducción & Orientación Tutor EVO</span>
                <span className="text-[10px] text-zinc-400 font-mono">Método EVO + Pasaporte de Hardware</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold">
              ✓ COMPLETADO
            </span>
          </div>

          {/* Chapters 01 to 07 */}
          {chapters.map((cap) => {
            const isCurrent = cap.number === currentChapterNumber;
            const isCompleted = cap.status === 'COMPLETADO';
            const isUnlocked = cap.status === 'DISPONIBLE' || isCompleted;

            return (
              <div
                key={cap.number}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                  isCurrent
                    ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-500/10'
                    : isCompleted
                    ? 'bg-zinc-950 border-emerald-500/30'
                    : isUnlocked
                    ? 'bg-zinc-950 border-zinc-700'
                    : 'bg-black/50 border-zinc-900 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center shrink-0 animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    </div>
                  ) : isUnlocked ? (
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-500 shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-zinc-600 shrink-0" />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        Capítulo {cap.number}: {cap.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-black font-extrabold">
                          ● ESTÁS ACÁ
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 block font-sans-editorial">
                      {cap.tagline}
                    </span>
                  </div>
                </div>

                {isUnlocked && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectChapter(cap.number);
                      onClose();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400 text-black'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    {isCurrent ? 'Continuar' : 'Ir'}
                  </button>
                )}
              </div>
            );
          })}

          {/* Step 8: Examen Final */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
              isExamPassed
                ? 'bg-emerald-950/40 border-emerald-500/60'
                : completedCount >= 7
                ? 'bg-yellow-950/40 border-yellow-500/60'
                : 'bg-black/50 border-zinc-900 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award
                className={`w-4 h-4 shrink-0 ${
                  isExamPassed
                    ? 'text-emerald-400'
                    : completedCount >= 7
                    ? 'text-yellow-400'
                    : 'text-zinc-600'
                }`}
              />
              <div>
                <span className="font-bold text-white block">
                  08. Examen Final Interactivo (15 Preguntas)
                </span>
                <span className="text-[11px] text-zinc-400">
                  {isExamPassed
                    ? '★ TEORÍA COMPROBADA CERTIFICADA'
                    : completedCount >= 7
                    ? 'Disponible para rendir'
                    : 'Requiere completar los 7 capítulos'}
                </span>
              </div>
            </div>

            {completedCount >= 7 && onOpenExam && (
              <button
                type="button"
                onClick={() => {
                  onOpenExam();
                  onClose();
                }}
                className="px-3 py-1 rounded-lg bg-yellow-400 text-black font-extrabold text-xs cursor-pointer hover:brightness-110"
              >
                Rendir
              </button>
            )}
          </div>

          {/* Step 9: Laboratorio */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-500/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">
                  09. Laboratorio Virtual de Identidad y Hardware
                </span>
                <span className="text-[11px] text-zinc-400">
                  Banco interactivo de experimentación libre
                </span>
              </div>
            </div>

            {onOpenLab && (
              <button
                type="button"
                onClick={() => {
                  onOpenLab();
                  onClose();
                }}
                className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-bold text-xs border border-cyan-500/40 cursor-pointer"
              >
                Abrir Lab
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-zinc-800 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700 cursor-pointer"
          >
            Cerrar Mapa
          </button>
        </div>
      </div>
    </div>
  );
};
