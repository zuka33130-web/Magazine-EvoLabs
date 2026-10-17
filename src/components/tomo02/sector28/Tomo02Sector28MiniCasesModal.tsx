import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  AlertOctagon,
} from "lucide-react";
import { SECTOR_28_MINICASES } from "../../../data/tomo02Sector28Data";

interface Tomo02Sector28MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector28MiniCasesModal: React.FC<Tomo02Sector28MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCase = SECTOR_28_MINICASES[selectedCaseIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#080B10] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-[#0B0F17] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                SECTOR 28 // CASOS CLÍNICOS FORENSES
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white uppercase font-mono">
                {currentCase.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Case selector tabs */}
        <div className="flex border-b border-cyan-500/10 bg-[#06080D] px-4 pt-2 gap-2 overflow-x-auto">
          {SECTOR_28_MINICASES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedCaseIndex(idx);
                setSelectedOptionId(null);
              }}
              className={`px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCaseIndex === idx
                  ? "bg-[#080B10] text-cyan-300 border-t-2 border-x border-cyan-500/40 border-b-transparent"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {c.code}: {c.title.slice(0, 25)}...
            </button>
          ))}
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-zinc-300">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">
              Escenario Clínico:
            </span>
            <p className="leading-relaxed bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
              {currentCase.scenario}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Declaración del Usuario & Error Inicial:
            </span>
            <p className="italic">{currentCase.userStatement}</p>
            <p className="text-zinc-400 text-[11px] pt-1">
              <span className="text-amber-300 font-bold">Trampa típica: </span>
              {currentCase.initialMistake}
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-white font-bold block">
              {currentCase.diagnosticQuestion}
            </span>
            <div className="space-y-2">
              {currentCase.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    selectedOptionId === opt.id
                      ? opt.isCorrect
                        ? "bg-emerald-950/30 border-emerald-500/60 text-emerald-200"
                        : "bg-red-950/30 border-red-500/60 text-red-200"
                      : "bg-[#0B0F17] border-zinc-800 hover:border-cyan-500/30 text-zinc-300"
                  }`}
                >
                  <span className="font-mono font-bold shrink-0 text-cyan-400">
                    [{opt.id.slice(-1)}]
                  </span>
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{opt.text}</p>
                    {selectedOptionId === opt.id && (
                      <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedOptionId && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Veredicto Técnico Final
              </div>
              <p className="text-zinc-300 leading-relaxed">{currentCase.technicalVerdict}</p>
              <div className="flex items-start gap-2 pt-2 border-t border-cyan-500/20 text-emerald-300 font-mono text-[11px]">
                <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Lección de Arquitectura: </strong>
                  {currentCase.lessonLearned}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
