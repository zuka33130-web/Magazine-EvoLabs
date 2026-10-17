import React, { useState } from 'react';
import {
  X,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_13_MINICASES } from '../../../data/tomo02Sector13Data';

interface Tomo02Sector13MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector13MiniCasesModal: React.FC<Tomo02Sector13MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SECTOR_13_MINICASES[0]?.id || '');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showVerdicts, setShowVerdicts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentCase = SECTOR_13_MINICASES.find((c) => c.id === selectedCaseId) || SECTOR_13_MINICASES[0];

  const handleSelectOption = (caseId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [caseId]: optionId }));
  };

  const handleVerify = (caseId: string) => {
    if (selectedOptions[caseId]) {
      setShowVerdicts((prev) => ({ ...prev, [caseId]: true }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
                Casos Prácticos Reales // Sector 13
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                EXPEDIENTES TÉCNICOS DE INSTALACIÓN, RECOVERY Y WINRE
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 min-h-[480px]">
          <div className="p-4 space-y-2 bg-slate-950/30">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block px-2 mb-2">
              Expedientes Disponibles
            </span>
            {SECTOR_13_MINICASES.map((c) => {
              const isSelected = c.id === currentCase.id;
              const hasAnswered = !!showVerdicts[c.id];
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer font-sans ${
                    isSelected
                      ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 shadow-md'
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold">{c.code}</span>
                    {hasAnswered && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Resuelto
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold truncate">{c.title}</div>
                </button>
              );
            })}
          </div>

          <div className="md:col-span-2 p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <span>{currentCase.code}</span>
                <span>•</span>
                <span>DESPLIEGUE Y RECUPERACIÓN SISTÉMICA</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">{currentCase.title}</h3>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Escenario Técnico Reportado
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">{currentCase.scenario}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg">
                <span className="font-mono text-rose-400 font-bold block mb-1">Declaración del Usuario:</span>
                <p className="text-slate-300 italic">{currentCase.userStatement}</p>
              </div>
              <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-lg">
                <span className="font-mono text-amber-400 font-bold block mb-1">Error de Diagnóstico Común:</span>
                <p className="text-slate-300">{currentCase.initialMistake}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                {currentCase.diagnosticQuestion}
              </span>

              <div className="space-y-2">
                {currentCase.options.map((opt) => {
                  const isChosen = selectedOptions[currentCase.id] === opt.id;
                  const isVerified = showVerdicts[currentCase.id];
                  let borderClass = 'border-slate-800 hover:border-slate-700 bg-slate-950/40';
                  if (isChosen && !isVerified) {
                    borderClass = 'border-cyan-500 bg-cyan-950/20 text-cyan-200';
                  } else if (isVerified) {
                    if (opt.isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-950/30 text-emerald-200';
                    } else if (isChosen && !opt.isCorrect) {
                      borderClass = 'border-rose-500 bg-rose-950/30 text-rose-200';
                    }
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !isVerified && handleSelectOption(currentCase.id, opt.id)}
                      className={`p-3.5 rounded-xl border transition-all text-xs cursor-pointer ${borderClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono font-bold text-slate-400 mt-0.5">{opt.id.toUpperCase()})</span>
                        <div className="space-y-1.5 flex-1">
                          <p className="font-sans leading-relaxed">{opt.text}</p>
                          {isVerified && (
                            <p className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {!showVerdicts[currentCase.id] ? (
                <button
                  disabled={!selectedOptions[currentCase.id]}
                  onClick={() => handleVerify(currentCase.id)}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    selectedOptions[currentCase.id]
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Emitir Dictamen Técnico
                </button>
              ) : (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl w-full space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DICTAMEN TÉCNICO OFICIAL EVO LABS</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {currentCase.technicalVerdict}
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs">
                    <Lightbulb className="w-4 h-4 shrink-0" />
                    <span className="font-mono">Lección Aprendida: {currentCase.lessonLearned}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
