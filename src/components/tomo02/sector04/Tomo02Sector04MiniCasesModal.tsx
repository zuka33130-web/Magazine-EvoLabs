import React, { useState } from 'react';
import {
  X,
  FileCheck,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_04_MINICASES, Sector04MiniCase } from '../../../data/tomo02Sector04Data';

interface Tomo02Sector04MiniCasesModalProps {
  onClose: () => void;
  onCaseSolved?: (caseId: string) => void;
}

export const Tomo02Sector04MiniCasesModal: React.FC<Tomo02Sector04MiniCasesModalProps> = ({
  onClose,
  onCaseSolved,
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [solvedCases, setSolvedCases] = useState<Record<string, boolean>>({});

  const activeCase: Sector04MiniCase = SECTOR_04_MINICASES[activeCaseIndex];
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
      <div className="relative w-full max-w-4xl bg-[#080B10] border border-[#00A4EF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,164,239,0.15)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#05070A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0078D4]/20 border border-[#00A4EF]/40 text-[#60CDFF]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide uppercase font-mono">
                EXPEDIENTES FORENSES // CASOS SECTOR 04
              </h2>
              <p className="text-xs text-zinc-400">
                Auditoría pericial de procesos, métricas de memoria y detección de anomalías
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-[#11161D] border border-sky-500/30 text-xs font-mono text-[#60CDFF]">
              RESUELTOS: <span className="text-emerald-400 font-bold">{totalSolved}</span> / {SECTOR_04_MINICASES.length}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#11161D] hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Case Navigation Tabs */}
        <div className="px-6 py-3 bg-[#080B10] border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto shrink-0 font-mono">
          {SECTOR_04_MINICASES.map((item, idx) => {
            const isActive = idx === activeCaseIndex;
            const isCaseSolved = solvedCases[item.id];

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCaseIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#0078D4] text-white shadow-[0_0_15px_rgba(0,164,239,0.3)]'
                    : 'bg-[#11161D] text-zinc-400 hover:text-zinc-200 border border-sky-500/10'
                }`}
              >
                <span>{item.code}</span>
                {isCaseSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-sans">
          {/* Active Case Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[#60CDFF]">
              <Shield className="w-4 h-4 text-[#00A4EF]" />
              <span>{activeCase.code}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300 font-bold uppercase">{activeCase.title}</span>
            </div>

            {/* User Statement / Scenario */}
            <div className="p-4 rounded-xl bg-[#11161D] border border-sky-500/20 space-y-3 font-mono">
              <div>
                <span className="text-[10px] text-[#60CDFF] font-bold uppercase tracking-wider block mb-1">
                  DECLARACIÓN DEL USUARIO AFECTADO:
                </span>
                <p className="text-zinc-200 italic font-sans text-sm">
                  {activeCase.userStatement}
                </p>
              </div>

              <div className="border-t border-sky-500/10 pt-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
                  ESCENARIO TÉCNICO OBSERVADO:
                </span>
                <p className="text-zinc-300 font-sans text-xs">
                  {activeCase.scenario}
                </p>
              </div>

              <div className="border-t border-sky-500/10 pt-2">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block mb-1">
                  ERROR O CONCEPCIÓN ERRÓNEA INICIAL:
                </span>
                <p className="text-zinc-300 font-sans text-xs">
                  {activeCase.initialMistake}
                </p>
              </div>
            </div>

            {/* Diagnostic Question */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                <HelpCircle className="w-4 h-4 text-[#00A4EF]" />
                <span>DIAGNÓSTICO Y MÉTRICA REQUERIDA:</span>
              </div>
              <p className="text-sm text-zinc-200 font-bold">
                {activeCase.diagnosticQuestion}
              </p>

              {/* Options */}
              <div className="space-y-2 pt-1 font-mono">
                {activeCase.options.map((opt) => {
                  const isSelected = selectedOptId === opt.id;
                  const showResult = isSelected || isSolved;

                  let btnStyle = 'bg-[#11161D] border-sky-500/20 text-zinc-300 hover:border-[#00A4EF]/50';
                  if (isSelected) {
                    btnStyle = opt.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-red-950/60 border-red-500 text-red-200';
                  } else if (isSolved && opt.isCorrect) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isSolved}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {showResult && opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : showResult && isSelected && !opt.isCorrect ? (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-600" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div>{opt.text}</div>
                        {showResult && isSelected && (
                          <p className="text-[11px] text-zinc-300 font-sans mt-1">
                            {opt.explanation}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verdict & Lesson */}
            {(isSolved || selectedOpt) && (
              <div className="p-4 rounded-xl bg-[#05070A] border border-sky-500/30 space-y-3 animate-fadeIn font-sans">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#60CDFF]">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>VERDICTO TÉCNICO PERICIAL:</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {activeCase.technicalVerdict}
                </p>
                <div className="p-2.5 rounded bg-[#11161D] border border-emerald-500/30 text-xs font-mono text-emerald-300">
                  <span className="font-bold text-emerald-400">LECCIÓN APRENDIDA: </span>
                  {activeCase.lessonLearned}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-[#05070A] flex items-center justify-between shrink-0 font-mono text-xs">
          <span className="text-zinc-400">
            Sector 04 · Administrador de Tareas de Verdad
          </span>

          <button
            type="button"
            onClick={() => {
              if (activeCaseIndex < SECTOR_04_MINICASES.length - 1) {
                setActiveCaseIndex((prev) => prev + 1);
              } else {
                onClose();
              }
            }}
            className="px-5 py-2 rounded-xl bg-[#0078D4] hover:bg-[#0067C0] text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>{activeCaseIndex < SECTOR_04_MINICASES.length - 1 ? 'Siguiente Caso' : 'Cerrar Casos'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
