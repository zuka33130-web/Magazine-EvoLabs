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
import { SECTOR_07_MINICASES, Sector07MiniCase } from '../../../data/tomo02Sector07Data';

interface Tomo02Sector07MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector07MiniCasesModal: React.FC<Tomo02Sector07MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [caseId: string]: string }>({});
  const [showVerdicts, setShowVerdicts] = useState<{ [caseId: string]: boolean }>({});

  if (!isOpen) return null;

  const currentCase: Sector07MiniCase = SECTOR_07_MINICASES[activeCaseIndex];
  const selectedOptionId = selectedOptions[currentCase.id];
  const isVerdictRevealed = showVerdicts[currentCase.id];

  const handleSelectOption = (optionId: string) => {
    if (isVerdictRevealed) return;
    setSelectedOptions((prev) => ({ ...prev, [currentCase.id]: optionId }));
  };

  const handleRevealVerdict = () => {
    if (!selectedOptionId) return;
    setShowVerdicts((prev) => ({ ...prev, [currentCase.id]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-[#080B10] border-2 border-[#00A4EF]/50 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-[0_0_40px_rgba(0,164,239,0.25)] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0078D4]/20 border border-[#00A4EF]/40 text-[#60CDFF]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#60CDFF] tracking-wider uppercase block">
                SECTOR 07 // CASOS CLÍNICOS PERICIALES
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                SYSMMAIN, PRECARGA Y GESTIÓN DE CACHÉ
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-zinc-800/80 bg-[#0C1017] overflow-x-auto shrink-0">
          {SECTOR_07_MINICASES.map((c, idx) => {
            const isAnswered = !!showVerdicts[c.id];
            const isActive = idx === activeCaseIndex;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCaseIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${isActive ? 'bg-[#0078D4] text-white shadow-[0_0_12px_rgba(0,164,239,0.4)]' : isAnswered ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                <span>{c.code}</span>
                {isAnswered && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#0D121C] border border-sky-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#60CDFF] tracking-wider uppercase">
                  {currentCase.code} // {currentCase.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  ESCENARIO REAL
                </span>
              </div>
              <p className="text-zinc-200 leading-relaxed text-xs sm:text-sm">{currentCase.scenario}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                DECLARACIÓN DEL USUARIO:
              </span>
              <p className="italic font-serif text-xs sm:text-sm">{currentCase.userStatement}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
              <HelpCircle className="w-4 h-4 text-[#60CDFF]" />
              <span>{currentCase.diagnosticQuestion}</span>
            </div>

            <div className="space-y-2">
              {currentCase.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle = 'bg-[#0E131D] border-zinc-800 text-zinc-300 hover:border-sky-500/40 hover:bg-[#121824]';

                if (isVerdictRevealed) {
                  if (opt.isCorrect) {
                    optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optionStyle = 'bg-red-950/40 border-red-500 text-red-200';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-[#0078D4]/20 border-[#00A4EF] text-white font-bold shadow-[0_0_12px_rgba(0,164,239,0.2)]';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${optionStyle}`}
                  >
                    <div className="mt-0.5">
                      {isVerdictRevealed && opt.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isVerdictRevealed && isSelected && !opt.isCorrect ? (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#00A4EF] bg-[#00A4EF]' : 'border-zinc-600'}`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="leading-snug text-xs">{opt.text}</p>
                      {isVerdictRevealed && (
                        <p
                          className={`text-[11px] mt-1 font-mono ${opt.isCorrect ? 'text-emerald-400' : 'text-zinc-400'}`}
                        >
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {!isVerdictRevealed && (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleRevealVerdict}
              className={`w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${selectedOptionId ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white shadow-[0_0_20px_rgba(0,164,239,0.3)] hover:brightness-110' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
            >
              <span>EMITIR DICTAMEN PERICIAL</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {isVerdictRevealed && (
            <div className="p-4 rounded-xl bg-[#090D14] border border-emerald-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs uppercase">
                <Shield className="w-4 h-4" />
                <span>DICTAMEN TÉCNICO OFICIAL EVO LABS</span>
              </div>
              <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">{currentCase.technicalVerdict}</p>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>LECCIÓN APRENDIDA: {currentCase.lessonLearned}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0C1017] border-t border-zinc-800 flex items-center justify-between shrink-0 font-mono text-xs">
          <span className="text-zinc-500">
            CASO {activeCaseIndex + 1} DE {SECTOR_07_MINICASES.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activeCaseIndex === 0}
              onClick={() => setActiveCaseIndex((prev) => prev - 1)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              ANTERIOR
            </button>
            <button
              type="button"
              disabled={activeCaseIndex === SECTOR_07_MINICASES.length - 1}
              onClick={() => setActiveCaseIndex((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-lg bg-[#0078D4] hover:bg-[#0067C0] text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors font-bold"
            >
              SIGUIENTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
