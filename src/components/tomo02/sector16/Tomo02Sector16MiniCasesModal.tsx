import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_16_MINICASES } from '../../../data/tomo02Sector16Data';

interface Tomo02Sector16MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector16MiniCasesModal: React.FC<Tomo02Sector16MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    SECTOR_16_MINICASES[0]?.id || ''
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showVerdicts, setShowVerdicts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentCase =
    SECTOR_16_MINICASES.find((c) => c.id === selectedCaseId) ||
    SECTOR_16_MINICASES[0];

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
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
                Casos Prácticos Reales // Sector 16
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                EXPEDIENTES TÉCNICOS DE IMPRESIÓN, USB, BLUETOOTH Y PERIFÉRICOS
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

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          {/* Sidebar tabs */}
          <div className="md:col-span-4 border-r border-slate-800 p-4 space-y-2 bg-slate-950/30">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 block">
              Expedientes de Laboratorio ({SECTOR_16_MINICASES.length})
            </span>
            {SECTOR_16_MINICASES.map((c) => {
              const isSelected = c.id === currentCase.id;
              const hasVerdict = showVerdicts[c.id];
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-cyan-600/15 border-cyan-500/40 text-cyan-300 font-medium'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400">{c.code || c.id.toUpperCase()}</span>
                    {hasVerdict && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Resuelto
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-200 line-clamp-1">{c.title}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{c.scenario.slice(0, 50)}...</span>
                </button>
              );
            })}
          </div>

          {/* Case detail view */}
          <div className="md:col-span-8 p-6 space-y-6 overflow-y-auto max-h-[600px]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  INCIDENTE DE PERIFÉRICOS
                </span>
                <span className="text-xs font-mono text-slate-500">·</span>
                <span className="text-xs font-mono text-slate-400">{currentCase.code || currentCase.id.toUpperCase()}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">{currentCase.title}</h3>
            </div>

            {/* Scenario Description */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs leading-relaxed">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                ESCENARIO DEL INCIDENTE
              </span>
              <p className="text-slate-300 font-sans">{currentCase.scenario}</p>
              {currentCase.userStatement && (
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 italic">
                  &ldquo;{currentCase.userStatement}&rdquo;
                </div>
              )}
            </div>

            {/* Dilemma Question & Options */}
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

            {/* Verdict or button */}
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
