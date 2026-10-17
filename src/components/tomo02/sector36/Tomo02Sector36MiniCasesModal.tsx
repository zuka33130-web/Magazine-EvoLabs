import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { SECTOR_36_MINICASES } from "../../../data/tomo02Sector36Data";

interface Tomo02Sector36MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector36MiniCasesModal: React.FC<Tomo02Sector36MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const currentCase = SECTOR_36_MINICASES[selectedCaseIndex];
  const selectedOptionId = selectedAnswers[currentCase.id];
  const selectedOption = currentCase.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentCase.id]: optionId,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-sans-editorial">
      <div className="bg-[#0A0D14] border border-cyan-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-[#070A0F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                Casos Forenses Prácticos · Sector 36
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                PC Lenta: El Motor de Diagnóstico Central
              </h3>
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

        {/* Case selector tabs */}
        <div className="flex border-b border-cyan-500/20 bg-[#05070B] overflow-x-auto p-1 gap-1">
          {SECTOR_36_MINICASES.map((c, index) => {
            const isResolved = selectedAnswers[c.id] !== undefined;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCaseIndex(index)}
                className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  selectedCaseIndex === index
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                }`}
              >
                <span>{c.code}</span>
                {isResolved && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 font-mono text-xs text-zinc-300">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white uppercase mb-2">
              {currentCase.title}
            </h4>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 space-y-2">
              <p className="leading-relaxed">{currentCase.scenario}</p>
              <div className="p-2.5 rounded bg-black/40 border border-amber-500/20 text-amber-300 flex items-start gap-2">
                <span className="font-bold text-[10px] uppercase shrink-0">Declaración del Cliente:</span>
                <span className="italic">"{currentCase.userStatement}"</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase block mb-0.5">Error Técnico Habitual:</span>
              <p>{currentCase.initialMistake}</p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold block uppercase text-xs">
              {currentCase.diagnosticQuestion}
            </span>
            <div className="space-y-2">
              {currentCase.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? opt.isCorrect
                          ? "bg-green-950/30 border-green-500/60 text-green-200"
                          : "bg-red-950/30 border-red-500/60 text-red-200"
                        : "bg-[#0D121D] hover:bg-[#121926] border-zinc-800 text-zinc-300"
                    }`}
                  >
                    <span className="leading-relaxed">{opt.text}</span>
                    {isSelected && (
                      <span className="shrink-0 mt-0.5">
                        {opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedOption && (
            <div
              className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                selectedOption.isCorrect
                  ? "bg-green-950/20 border-green-500/40 text-green-300"
                  : "bg-red-950/20 border-red-500/40 text-red-300"
              }`}
            >
              <div className="font-bold uppercase flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>{selectedOption.isCorrect ? "Resolución Correcta" : "Diagnóstico Erróneo"}</span>
              </div>
              <p className="leading-relaxed">{selectedOption.explanation}</p>
              {selectedOption.isCorrect && (
                <div className="pt-2 border-t border-green-500/20 space-y-1">
                  <div>
                    <span className="font-bold text-white block">Veredicto Forense:</span>
                    <span className="text-zinc-300">{currentCase.technicalVerdict}</span>
                  </div>
                  <div className="pt-1">
                    <span className="font-bold text-cyan-300 block">Lección del Especialista:</span>
                    <span className="text-zinc-300">{currentCase.lessonLearned}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#070A0F] flex items-center justify-between">
          <span className="text-zinc-500 font-mono text-[11px]">
            Caso {selectedCaseIndex + 1} de {SECTOR_36_MINICASES.length}
          </span>
          <div className="flex items-center gap-2 font-mono text-xs">
            {selectedCaseIndex < SECTOR_36_MINICASES.length - 1 ? (
              <button
                type="button"
                onClick={() => setSelectedCaseIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Siguiente Caso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer"
              >
                Cerrar Casos
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
