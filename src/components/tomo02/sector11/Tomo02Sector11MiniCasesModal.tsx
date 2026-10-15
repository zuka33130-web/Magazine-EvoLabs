import React, { useState } from 'react';
import {
  X,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_11_MINICASES } from '../../../data/tomo02Sector11Data';

interface Tomo02Sector11MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector11MiniCasesModal: React.FC<Tomo02Sector11MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SECTOR_11_MINICASES[0]?.id || '');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showVerdicts, setShowVerdicts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentCase = SECTOR_11_MINICASES.find((c) => c.id === selectedCaseId) || SECTOR_11_MINICASES[0];

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
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
                Casos Prácticos Reales // Sector 11
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                EXPEDIENTES TÉCNICOS DE REGISTRO DE WINDOWS
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

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Case Navigation Sidebar */}
          <div className="md:col-span-4 space-y-2 border-r border-slate-800/80 pr-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">
              Expedientes Periciales
            </span>
            {SECTOR_11_MINICASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedCaseId === c.id
                    ? 'bg-cyan-600/15 border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono font-bold block text-cyan-400 mb-0.5">
                  {c.code}
                </span>
                <span className="text-xs font-semibold block leading-snug line-clamp-2">
                  {c.title}
                </span>
              </button>
            ))}
          </div>

          {/* Active Case Details */}
          <div className="md:col-span-8 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400">{currentCase.code}</span>
                <span className="text-xs text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-mono">FORENSIC CASE STUDY</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">{currentCase.title}</h3>
            </div>

            {/* Scenario */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                Escenario Forense
              </span>
              <p className="text-slate-300 leading-relaxed">{currentCase.scenario}</p>
              <div className="pt-2 text-slate-400 italic font-mono text-[11px]">
                {currentCase.userStatement}
              </div>
            </div>

            {/* Diagnostic Question */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block font-bold">
                Pregunta de Diagnóstico:
              </span>
              <p className="text-xs text-slate-200">{currentCase.diagnosticQuestion}</p>

              {/* Options */}
              <div className="space-y-2">
                {currentCase.options.map((opt) => {
                  const isSelected = selectedOptions[currentCase.id] === opt.id;
                  const isSubmitted = showVerdicts[currentCase.id];

                  let borderClass = 'border-slate-800 hover:border-slate-700 bg-slate-950/40';
                  if (isSelected) {
                    borderClass = 'border-cyan-500 bg-cyan-950/20 text-cyan-200';
                  }
                  if (isSubmitted && opt.isCorrect) {
                    borderClass = 'border-emerald-500 bg-emerald-950/30 text-emerald-200';
                  } else if (isSubmitted && isSelected && !opt.isCorrect) {
                    borderClass = 'border-rose-500 bg-rose-950/30 text-rose-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentCase.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${borderClass}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono font-bold uppercase text-[11px] mt-0.5">
                          [{opt.id.replace('opt-', '').toUpperCase()}]
                        </span>
                        <div className="flex-1">
                          <p>{opt.text}</p>
                          {isSubmitted && (
                            <p className="text-[11px] font-mono mt-2 pt-2 border-t border-slate-800/60 text-slate-300">
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!showVerdicts[currentCase.id] && (
                <button
                  onClick={() => handleVerify(currentCase.id)}
                  disabled={!selectedOptions[currentCase.id]}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Verificar Veredicto
                </button>
              )}

              {/* Verdict Banner */}
              {showVerdicts[currentCase.id] && (
                <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold">
                    <Shield className="w-4 h-4" />
                    <span>VEREDICTO FORENSE OFICIAL</span>
                  </div>
                  <p className="text-slate-300">{currentCase.technicalVerdict}</p>
                  <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Lección aprendida: {currentCase.lessonLearned}</span>
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
