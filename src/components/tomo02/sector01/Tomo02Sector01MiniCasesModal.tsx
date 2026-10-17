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
  Terminal,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SECTOR_01_MINICASES, Sector01MiniCase } from '../../../data/tomo02Sector01CasesAndTests';

interface Tomo02Sector01MiniCasesModalProps {
  onClose: () => void;
}

export const Tomo02Sector01MiniCasesModal: React.FC<Tomo02Sector01MiniCasesModalProps> = ({
  onClose,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const currentCase: Sector01MiniCase = SECTOR_01_MINICASES[selectedCaseIndex] || SECTOR_01_MINICASES[0];
  const userChoiceId = selectedAnswers[currentCase.id];
  const isRevealed = showExplanation[currentCase.id];

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentCase.id]: optionId }));
    setShowExplanation((prev) => ({ ...prev, [currentCase.id]: true }));
  };

  const selectedOption = currentCase.options.find((o) => o.id === userChoiceId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn font-sans">
      <div className="relative w-full max-w-5xl bg-[#080B10] border border-sky-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,164,239,0.18)] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#080B10] via-[#0078D4]/20 to-[#080B10] p-6 border-b border-sky-500/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0078D4]/15 border border-[#00A4EF]/40 flex items-center justify-center text-[#60CDFF] shadow-[0_0_15px_rgba(0,164,239,0.2)]">
              <Activity className="w-7 h-7 text-[#00A4EF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0078D4]/20 text-[#60CDFF] font-bold border border-[#00A4EF]/40">
                  CASOS FORENSES DE BANCO // 8 INCIDENTES
                </span>
                <span className="text-xs font-mono text-zinc-400">SECTOR 01: ANTES DEL LOGO</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide mt-1 font-display">
                MINICASOS DE DIAGNÓSTICO EN CAMPO
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#11161D] hover:bg-[#151B23] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-sky-500/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with 2 Columns */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Case Selector List */}
          <div className="lg:col-span-4 space-y-2 border-r border-sky-500/15 pr-0 lg:pr-4">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
              EXPEDIENTES DISPONIBLES ({SECTOR_01_MINICASES.length})
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {SECTOR_01_MINICASES.map((c, idx) => {
                const isResolved = selectedAnswers[c.id] !== undefined;
                const isCurrent = idx === selectedCaseIndex;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0078D4]/15 border-[#00A4EF]/75 text-white shadow-[0_0_15px_rgba(0,164,239,0.15)]'
                        : 'bg-[#11161D] border-sky-500/15 text-zinc-300 hover:bg-[#151B23]'
                    }`}
                    style={{
                      borderLeft: isCurrent ? '3px solid #00A4EF' : undefined,
                    }}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs shrink-0 ${
                        isCurrent
                          ? 'bg-gradient-to-br from-[#0078D4] to-[#00A4EF] text-white font-bold'
                          : isResolved
                          ? 'bg-emerald-500/20 text-[#16C784] border border-emerald-500/40 font-bold'
                          : 'bg-[#151B23] text-zinc-400'
                      }`}
                    >
                      {isResolved ? '✓' : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-zinc-200">{c.title}</div>
                      <div className="text-[11px] font-mono text-[#60CDFF] mt-0.5">{c.code}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Case Details & Resolution */}
          <div className="lg:col-span-8 space-y-5">
            {/* Case Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono text-[#60CDFF] font-bold px-2 py-0.5 rounded bg-[#0078D4]/20 border border-[#00A4EF]/40">
                  {currentCase.code}
                </span>
                <span className="text-xs font-mono text-zinc-400">DIAGNÓSTICO PRE-BOOT</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">{currentCase.title}</h3>
            </div>

            {/* Scenario & Statements */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#11161D] border border-sky-500/20 text-sm text-zinc-300 leading-relaxed">
                <div className="text-xs font-mono text-[#60CDFF] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00A4EF]" />
                  ESCENARIO REAL
                </div>
                {currentCase.scenario}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 text-xs">
                  <div className="font-bold text-[#FF4D5A] flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    DECLARACIÓN TÍPICA DEL USUARIO
                  </div>
                  <div className="text-zinc-300 italic">{currentCase.userStatement}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/25 text-xs">
                  <div className="font-bold text-[#60CDFF] flex items-center gap-1.5 mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-[#00A4EF]" />
                    ERROR DEDUCTIVO COMÚN
                  </div>
                  <div className="text-zinc-300">{currentCase.initialMistake}</div>
                </div>
              </div>
            </div>

            {/* Diagnostic Question */}
            <div className="p-4 rounded-xl bg-[#11161D] border border-sky-500/25 shadow-md">
              <div className="text-xs font-mono text-[#60CDFF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00A4EF]" />
                PREGUNTA TÉCNICA DE ACCIÓN
              </div>
              <div className="text-sm font-bold text-white mb-4">{currentCase.diagnosticQuestion}</div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentCase.options.map((opt) => {
                  const isChosen = userChoiceId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 cursor-pointer ${
                        isRevealed
                          ? opt.isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                            : isChosen
                            ? 'bg-red-950/40 border-red-500/60 text-red-200'
                            : 'bg-[#080B10]/40 border-zinc-800 text-zinc-500 opacity-60'
                          : isChosen
                          ? 'bg-[#0078D4]/25 border-[#00A4EF] text-white'
                          : 'bg-[#080B10] border-sky-500/20 text-zinc-300 hover:bg-[#151B23] hover:border-sky-500/40'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5 ${
                          isRevealed
                            ? opt.isCorrect
                              ? 'bg-emerald-500 text-black font-bold'
                              : isChosen
                              ? 'bg-red-500 text-white font-bold'
                              : 'bg-[#151B23] text-zinc-400'
                            : 'bg-[#151B23] text-[#60CDFF]'
                        }`}
                      >
                        {isRevealed && opt.isCorrect ? '✓' : isRevealed && isChosen ? '✗' : opt.id.toUpperCase()}
                      </div>
                      <div className="leading-relaxed">{opt.text}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation & Verdict when answered */}
            {isRevealed && selectedOption && (
              <div className="space-y-3 animate-fadeIn">
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    selectedOption.isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-zinc-200'
                      : 'bg-red-950/30 border-red-500/40 text-zinc-200'
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-sm">
                    {selectedOption.isCorrect ? (
                      <span className="text-[#16C784] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> ¡Diagnóstico Correcto!
                      </span>
                    ) : (
                      <span className="text-[#FF4D5A] flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Diagnóstico Incorrecto
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-300 mt-1">{selectedOption.explanation}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#11161D] border border-sky-500/20 text-xs space-y-2">
                  <div className="text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#00A4EF]" />
                    VEREDICTO TÉCNICO OFICIAL
                  </div>
                  <p className="text-zinc-300">{currentCase.technicalVerdict}</p>
                  <div className="pt-2 border-t border-sky-500/15 flex items-center gap-2 text-zinc-400">
                    <Lightbulb className="w-4 h-4 text-[#00A4EF] shrink-0" />
                    <span className="text-[11px] font-mono">
                      <strong className="text-zinc-200">Lección de Banco:</strong> {currentCase.lessonLearned}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-[#080B10] p-4 border-t border-sky-500/20 flex items-center justify-between">
          <button
            onClick={() => setSelectedCaseIndex((prev) => Math.max(0, prev - 1))}
            disabled={selectedCaseIndex === 0}
            className="px-4 py-2 rounded-lg bg-[#11161D] hover:bg-[#151B23] disabled:opacity-40 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer border border-sky-500/20"
          >
            Caso Anterior
          </button>
          <div className="text-xs font-mono text-zinc-400">
            CASO {selectedCaseIndex + 1} DE {SECTOR_01_MINICASES.length}
          </div>
          <button
            onClick={() => setSelectedCaseIndex((prev) => Math.min(SECTOR_01_MINICASES.length - 1, prev + 1))}
            disabled={selectedCaseIndex === SECTOR_01_MINICASES.length - 1}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] disabled:opacity-40 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,164,239,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            Siguiente Caso
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
