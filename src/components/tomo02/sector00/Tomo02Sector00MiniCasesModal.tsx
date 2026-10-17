import React, { useState } from 'react';
import {
  X,
  FileCheck,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Shield,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_00_MINICASES, Sector00MiniCase } from '../../../data/tomo02Sector00Data';

interface Tomo02Sector00MiniCasesModalProps {
  onClose: () => void;
  onCaseSolved?: (caseId: string) => void;
}

export const Tomo02Sector00MiniCasesModal: React.FC<Tomo02Sector00MiniCasesModalProps> = ({
  onClose,
  onCaseSolved,
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [solvedCases, setSolvedCases] = useState<Record<string, boolean>>({});

  const activeCase: Sector00MiniCase = SECTOR_00_MINICASES[activeCaseIndex];
  const selectedOptId = selectedOptions[activeCase.id];
  const selectedOpt = activeCase.options.find((o) => o.id === selectedOptId);
  const isSolved = solvedCases[activeCase.id];

  const handleSelectOption = (optId: string) => {
    if (isSolved) return;
    setSelectedOptions((prev) => ({ ...prev, [activeCase.id]: optId }));
    const opt = activeCase.options.find((o) => o.id === optId);
    if (opt && opt.isCorrect) {
      setSolvedCases((prev) => ({ ...prev, [activeCase.id]: true }));
      onCaseSolved?.(activeCase.id);
    }
  };

  const totalSolved = Object.values(solvedCases).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090c12] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.15)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#06080d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-mono-tech font-black text-sm">
              {totalSolved}/{SECTOR_00_MINICASES.length}
            </div>
            <div>
              <span className="text-xs font-mono-tech font-bold text-yellow-400 uppercase tracking-widest">
                TALLER FORENSE // RESOLUCIÓN DE MINICASOS REALES
              </span>
              <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-tight">
                SECTOR 00: EXPEDIENTES DE DIAGNÓSTICO EN BANCO
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#0b0f17] border-b border-zinc-800 overflow-x-auto shrink-0">
          {SECTOR_00_MINICASES.map((c, idx) => {
            const solved = solvedCases[c.id];
            const isActive = idx === activeCaseIndex;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCaseIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-md'
                    : solved
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>{c.code}</span>
                {solved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Case Title & User Statement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono-tech text-cyan-300 font-bold">
                {activeCase.code} // {activeCase.title}
              </span>
              {isSolved && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono-tech font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> RESUELTO
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/20 space-y-2">
              <div className="text-xs font-mono-tech text-cyan-400 font-bold uppercase tracking-wider">
                SITUACIÓN REPORTADA EN TALLER
              </div>
              <p className="text-sm text-zinc-200 font-sans-editorial leading-relaxed">
                {activeCase.scenario}
              </p>
              <div className="p-3 rounded-lg bg-black/50 border-l-2 border-yellow-400 text-xs font-mono-tech text-yellow-200 italic">
                {activeCase.userStatement}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-xs font-mono-tech text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div>
                <span className="font-bold">ERROR DE PRINCIPIANTE COMÚN: </span>
                {activeCase.initialMistake}
              </div>
            </div>
          </div>

          {/* Diagnostic Question & Options */}
          <div className="space-y-3">
            <div className="text-xs font-mono-tech text-cyan-300 font-bold uppercase flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              {activeCase.diagnosticQuestion}
            </div>

            <div className="space-y-2.5">
              {activeCase.options.map((opt) => {
                const isSelected = selectedOptId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-950/50 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-red-950/40 border-red-500 text-red-200'
                        : 'bg-[#0b0f17] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center text-xs font-mono-tech font-bold mt-0.5 ${
                        isSelected
                          ? opt.isCorrect
                            ? 'border-emerald-400 bg-emerald-500 text-black'
                            : 'border-red-400 bg-red-500 text-white'
                          : 'border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {isSelected ? (opt.isCorrect ? '✓' : '✕') : ''}
                    </div>

                    <div className="flex-1 text-xs sm:text-sm font-sans-editorial leading-relaxed">
                      {opt.text}
                      {isSelected && (
                        <div
                          className={`mt-2 p-2 rounded text-xs font-mono-tech ${
                            opt.isCorrect ? 'bg-emerald-900/30 text-emerald-300' : 'bg-red-900/30 text-red-300'
                          }`}
                        >
                          {opt.explanation}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technical Verdict & Lesson */}
          {isSolved && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-emerald-400 font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                DICTAMEN TÉCNICO PERICIAL
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 font-sans-editorial">
                {activeCase.technicalVerdict}
              </p>
              <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/20 text-xs font-mono-tech text-emerald-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>LECCIÓN EVO: {activeCase.lessonLearned}</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer navigation */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-[#06080d] flex items-center justify-between shrink-0">
          <button
            disabled={activeCaseIndex === 0}
            onClick={() => setActiveCaseIndex((prev) => prev - 1)}
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-zinc-300 disabled:opacity-40 hover:text-white"
          >
            ← CASO ANTERIOR
          </button>

          <span className="text-xs font-mono-tech text-zinc-400 hidden sm:inline">
            CASO {activeCaseIndex + 1} DE {SECTOR_00_MINICASES.length}
          </span>

          <button
            disabled={activeCaseIndex === SECTOR_00_MINICASES.length - 1}
            onClick={() => setActiveCaseIndex((prev) => prev + 1)}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono-tech font-bold disabled:opacity-40 transition-colors"
          >
            SIGUIENTE CASO →
          </button>
        </div>

      </div>
    </div>
  );
};
