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
import { SECTOR_08_MINICASES, Sector08MiniCase } from '../../../data/tomo02Sector08Data';

interface Tomo02Sector08MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector08MiniCasesModal: React.FC<Tomo02Sector08MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SECTOR_08_MINICASES[0]?.id || '');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showVerdicts, setShowVerdicts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentCase = SECTOR_08_MINICASES.find((c) => c.id === selectedCaseId) || SECTOR_08_MINICASES[0];

  const handleSelectOption = (caseId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [caseId]: optionId }));
  };

  const handleVerify = (caseId: string) => {
    if (selectedOptions[caseId]) {
      setShowVerdicts((prev) => ({ ...prev, [caseId]: true }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block">
                Casos Prácticos Reales // Sector 08
              </span>
              <h2 className="text-lg font-bold text-slate-100 font-sans">
                EXPEDIENTES TÉCNICOS DE MEMORIA Y PAGEFILE
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          {/* Sidebar case selector */}
          <div className="md:col-span-4 border-r border-slate-800 bg-slate-950/30 p-4 space-y-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block px-2 mb-2">
              SELECCIONAR CASO DE ESTUDIO
            </span>
            {SECTOR_08_MINICASES.map((c) => {
              const isSelected = c.id === currentCase.id;
              const isSolved = showVerdicts[c.id];

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500/40 text-blue-300'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {c.code}
                      </span>
                      {isSolved && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Resuelto
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-semibold leading-snug line-clamp-2">
                      {c.title}
                    </h4>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'translate-x-1 text-blue-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Main case display */}
          <div className="md:col-span-8 p-6 space-y-6 overflow-y-auto max-h-[600px]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-2">
                <Shield className="w-4 h-4" />
                <span>EXPEDIENTE DIAGNÓSTICO {currentCase.code}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">{currentCase.title}</h3>
            </div>

            {/* Scenario description */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  ESCENARIO TÉCNICO EN EL CLIENTE
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{currentCase.scenario}</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs italic text-slate-400">
                {currentCase.userStatement}
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-slate-800/60 text-xs text-amber-300/90">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-amber-200">Error inicial común:</strong>{' '}
                  {currentCase.initialMistake}
                </div>
              </div>
            </div>

            {/* Question & options */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>Pregunta Diagnóstica</span>
              </h4>
              <p className="text-sm font-medium text-slate-100">{currentCase.diagnosticQuestion}</p>

              <div className="space-y-2 mt-3">
                {currentCase.options.map((opt) => {
                  const caseSelectedOpt = selectedOptions[currentCase.id];
                  const isOptSelected = caseSelectedOpt === opt.id;
                  const isVerified = showVerdicts[currentCase.id];

                  let optionStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isOptSelected && !isVerified) {
                    optionStyle = 'bg-blue-950/40 border-blue-500/60 text-blue-200';
                  } else if (isVerified) {
                    if (opt.isCorrect) {
                      optionStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
                    } else if (isOptSelected && !opt.isCorrect) {
                      optionStyle = 'bg-rose-950/40 border-rose-500/60 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isVerified}
                      onClick={() => handleSelectOption(currentCase.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <div className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center text-[10px] ${
                        isOptSelected ? 'border-blue-400 bg-blue-500 text-white font-bold' : 'border-slate-600'
                      }`}>
                        {isOptSelected && '✓'}
                      </div>
                      <div className="flex-1">
                        <span>{opt.text}</span>
                        {isVerified && (
                          <p className={`mt-2 text-[11px] font-mono leading-normal ${
                            opt.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {opt.explanation}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification Button or Verdict */}
            {!showVerdicts[currentCase.id] ? (
              <button
                disabled={!selectedOptions[currentCase.id]}
                onClick={() => handleVerify(currentCase.id)}
                className={`w-full py-3 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all shadow-lg ${
                  selectedOptions[currentCase.id]
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Emitir Dictamen Técnico
              </button>
            ) : (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                    VERDICTO TÉCNICO CANÓNICO EVO
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {currentCase.technicalVerdict}
                  </p>
                </div>

                <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-lg flex items-start gap-2 text-xs text-blue-300">
                  <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Lección Aprendida:</strong> {currentCase.lessonLearned}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
