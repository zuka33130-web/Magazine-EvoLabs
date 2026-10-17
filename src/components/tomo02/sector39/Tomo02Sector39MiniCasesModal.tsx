import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  ArrowRight,
} from "lucide-react";
import { SECTOR_39_MINICASES } from "../../../data/tomo02Sector39Data";

interface Tomo02Sector39MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector39MiniCasesModal: React.FC<Tomo02Sector39MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const currentCase = SECTOR_39_MINICASES[selectedCaseIndex];
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
        <div className="p-4 sm:p-6 border-b border-cyan-500/20 flex items-center justify-between bg-[#0D121D]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold tracking-wider uppercase">
                <span>CASOS CLÍNICOS PERICIALES // LABORATORIO FINAL</span>
                <span>•</span>
                <span>SECTOR 39</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                El Veredicto de la Evidencia: Casos Reales
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case selector tabs */}
        <div className="flex border-b border-zinc-800 bg-[#080B10] px-4 pt-2 gap-2 overflow-x-auto">
          {SECTOR_39_MINICASES.map((c, idx) => {
            const isDone = !!selectedAnswers[c.id];
            const isCorrect = isDone && c.options.find((o) => o.id === selectedAnswers[c.id])?.isCorrect;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCaseIndex(idx)}
                className={`px-4 py-2 text-xs font-mono font-medium rounded-t-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  selectedCaseIndex === idx
                    ? "bg-[#0A0D14] text-cyan-300 border-t border-x border-cyan-500/40"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span>{c.code}</span>
                {isDone && (
                  isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2">
              {currentCase.title}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              {currentCase.scenario}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300">
            <span className="font-bold text-white block mb-1">Declaración del Cliente:</span>
            <p className="italic">"{currentCase.userStatement}"</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300">
            <span className="font-bold text-white block mb-1">Error del Soporte Amateur:</span>
            <p>{currentCase.initialMistake}</p>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>Pregunta Pericial del Laboratorio Final:</span>
            </h4>
            <p className="text-sm font-semibold text-white mb-3">
              {currentCase.diagnosticQuestion}
            </p>

            <div className="space-y-2.5">
              {currentCase.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnStyle = "bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300";

                if (selectedOptionId) {
                  if (opt.isCorrect) {
                    btnStyle = "bg-emerald-950/40 border-emerald-500/50 text-emerald-300";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-950/40 border-rose-500/50 text-rose-300";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="font-mono font-bold text-xs shrink-0 mt-0.5">
                      [{opt.id.replace("opt-", "")}]
                    </span>
                    <div className="flex-1">
                      <div>{opt.text}</div>
                      {selectedOptionId && (
                        <div className="mt-2 text-[11px] opacity-90 border-t border-white/10 pt-1.5">
                          {opt.explanation}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedOption && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-cyan-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Veredicto Pericial EVO:</span>
              </div>
              <p className="text-zinc-200">{currentCase.technicalVerdict}</p>

              <div className="pt-2 border-t border-zinc-800">
                <span className="font-bold text-amber-400 font-mono text-[11px] uppercase block mb-0.5">
                  Lección Magistral del Tomo 02:
                </span>
                <p className="text-zinc-300 text-[11px]">{currentCase.lessonLearned}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#080B10] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500">
            Caso {selectedCaseIndex + 1} de {SECTOR_39_MINICASES.length}
          </span>
          <div className="flex gap-2">
            {selectedCaseIndex < SECTOR_39_MINICASES.length - 1 ? (
              <button
                type="button"
                onClick={() => setSelectedCaseIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Siguiente Caso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
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
