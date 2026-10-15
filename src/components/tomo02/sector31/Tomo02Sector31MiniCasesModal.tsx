import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Activity,
  ArrowRight,
} from "lucide-react";
import { SECTOR_31_MINICASES } from "../../../data/tomo02Sector31Data";

interface Tomo02Sector31MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector31MiniCasesModal: React.FC<Tomo02Sector31MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCase = SECTOR_31_MINICASES[selectedCaseIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#080B10] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-[#0B0F17] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                SECTOR 31 // CASOS CLÍNICOS DE SYSINTERNALS
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Expedientes Técnicos: Diagnóstico con la Suite de Microsoft
              </h3>
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

        {/* Navigation tabs */}
        <div className="flex border-b border-zinc-800 bg-black/40 px-4 overflow-x-auto">
          {SECTOR_31_MINICASES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedCaseIndex(idx);
                setSelectedOptionId(null);
              }}
              className={`px-4 py-3 text-xs font-mono font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                selectedCaseIndex === idx
                  ? "border-cyan-400 text-cyan-300 font-bold bg-cyan-950/20"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="opacity-60 mr-1.5">{c.code}:</span>
              <span>{c.title}</span>
            </button>
          ))}
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Scenario */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Escenario de Incidente</span>
            </div>
            <p className="text-zinc-200 leading-relaxed bg-[#0B0F17] p-4 rounded-xl border border-zinc-800/80">
              {currentCase.scenario}
            </p>
          </div>

          {/* User Statement & Mistake */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentCase.userStatement && (
              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                  Declaración del Usuario:
                </span>
                <p className="text-xs text-zinc-300 italic">"{currentCase.userStatement}"</p>
              </div>
            )}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 uppercase font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Trampa de Diagnóstico Habitual</span>
              </div>
              <p className="text-xs text-zinc-300">{currentCase.initialMistake}</p>
            </div>
          </div>

          {/* Question & Options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold uppercase">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Pregunta de Intervención Forense:</span>
            </div>
            <p className="text-white font-medium">{currentCase.diagnosticQuestion}</p>

            <div className="space-y-2 pt-1">
              {currentCase.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? "bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                          : "bg-red-950/40 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                        : "bg-[#0B0F17] border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs text-zinc-200 leading-relaxed">{opt.text}</span>
                      {isSelected && (
                        <div className="shrink-0 mt-0.5">
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div
                        className={`mt-3 pt-3 border-t text-xs leading-relaxed font-mono ${
                          opt.isCorrect
                            ? "border-emerald-500/30 text-emerald-300"
                            : "border-red-500/30 text-red-300"
                        }`}
                      >
                        {opt.explanation}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#0B0F17] flex items-center justify-between">
          <div className="text-xs font-mono text-zinc-400">
            Caso {selectedCaseIndex + 1} de {SECTOR_31_MINICASES.length}
          </div>
          <div className="flex items-center gap-2">
            {selectedCaseIndex < SECTOR_31_MINICASES.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedCaseIndex((prev) => prev + 1);
                  setSelectedOptionId(null);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Siguiente Caso</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase font-mono transition-all cursor-pointer"
              >
                Finalizar Expedientes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
