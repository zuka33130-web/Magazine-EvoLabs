import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_21_MINICASES } from '../../../data/tomo02Sector21Data';

interface Tomo02Sector21MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector21MiniCasesModal: React.FC<Tomo02Sector21MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    SECTOR_21_MINICASES[0]?.id || ''
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showVerdicts, setShowVerdicts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentCase =
    SECTOR_21_MINICASES.find((c) => c.id === selectedCaseId) ||
    SECTOR_21_MINICASES[0];

  const handleSelectOption = (caseId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [caseId]: optionId }));
  };

  const handleVerify = (caseId: string) => {
    if (selectedOptions[caseId]) {
      setShowVerdicts((prev) => ({ ...prev, [caseId]: true }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Casos de Estudio Forense y Diagnóstico // Sector 21
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Minicasos Reales: Seguridad, Privilegios y Antivirus
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Case Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
            {SECTOR_21_MINICASES.map((mc) => (
              <button
                key={mc.id}
                onClick={() => setSelectedCaseId(mc.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap border ${
                  selectedCaseId === mc.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {mc.code}: {mc.title}
              </button>
            ))}
          </div>

          {currentCase && (
            <div className="space-y-6">
              {/* Scenario Box */}
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Escenario de Incidente</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentCase.scenario}
                </p>
                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg text-xs font-mono text-amber-200">
                  <span className="font-bold text-amber-400">Declaración del Usuario:</span> "{currentCase.userStatement}"
                </div>
              </div>

              {/* Diagnostic Question */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-200">
                  {currentCase.diagnosticQuestion}
                </h4>
                <div className="space-y-2">
                  {currentCase.options.map((opt) => {
                    const isSelected = selectedOptions[currentCase.id] === opt.id;
                    const showVerdict = showVerdicts[currentCase.id];

                    let optionStyle =
                      'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (isSelected) {
                      optionStyle = 'bg-amber-500/10 border-amber-500 text-amber-200 font-medium';
                    }

                    if (showVerdict && isSelected) {
                      optionStyle = opt.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500 text-rose-200';
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(currentCase.id, opt.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 ${optionStyle}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                            isSelected
                              ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                              : 'border-slate-700 text-slate-500'
                          }`}
                        >
                          {opt.id.toUpperCase().replace('OPT-', '')}
                        </div>
                        <div className="flex-1">
                          <div>{opt.text}</div>
                          {showVerdict && isSelected && (
                            <p className="mt-2 text-[11px] opacity-90 leading-relaxed border-t border-slate-800/80 pt-2">
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              {!showVerdicts[currentCase.id] ? (
                <button
                  onClick={() => handleVerify(currentCase.id)}
                  disabled={!selectedOptions[currentCase.id]}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all uppercase tracking-wider"
                >
                  Confirmar Diagnóstico Forense
                </button>
              ) : (
                <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DICTAMEN TÉCNICO OFICIAL</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {currentCase.technicalVerdict}
                  </p>
                  <div className="pt-2 border-t border-emerald-800/30 text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Lección Aprendida: {currentCase.lessonLearned}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
