import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_23_MINICASES } from '../../../data/tomo02Sector23Data';

interface Tomo02Sector23MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector23MiniCasesModal: React.FC<Tomo02Sector23MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    SECTOR_23_MINICASES[0]?.id || ''
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showVerdicts, setShowVerdicts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentCase =
    SECTOR_23_MINICASES.find((c) => c.id === selectedCaseId) ||
    SECTOR_23_MINICASES[0];

  const handleSelectOption = (caseId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [caseId]: optionId }));
  };

  const handleVerify = (caseId: string) => {
    if (selectedOptions[caseId]) {
      setShowVerdicts((prev) => ({ ...prev, [caseId]: true }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Casos Prácticos Periciales // Sector 23
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Casos Reales: Mantenimiento e Inactividad de Windows
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Case Navigation Tabs */}
          <div className="flex gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
            {SECTOR_23_MINICASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  selectedCaseId === c.id
                    ? 'bg-cyan-500 text-slate-950 shadow-lg'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{c.code}</span>
                <span>•</span>
                <span className="truncate max-w-[150px]">{c.title}</span>
              </button>
            ))}
          </div>

          {currentCase && (
            <div className="space-y-6">
              {/* Scenario */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Escenario de Diagnóstico</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentCase.scenario}
                </p>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
                  <span className="text-amber-300 font-bold">Declaración del Usuario: </span>
                  "{currentCase.userStatement}"
                </div>
              </div>

              {/* Diagnostic Question & Options */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200 font-mono">
                  {currentCase.diagnosticQuestion}
                </h3>

                <div className="space-y-2">
                  {currentCase.options.map((opt) => {
                    const isSelected = selectedOptions[currentCase.id] === opt.id;
                    const isVerified = showVerdicts[currentCase.id];

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(currentCase.id, opt.id)}
                        disabled={isVerified}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-slate-100'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                              : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {!showVerdicts[currentCase.id] ? (
                  <button
                    onClick={() => handleVerify(currentCase.id)}
                    disabled={!selectedOptions[currentCase.id]}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold rounded-xl transition-all"
                  >
                    Emitir Dictamen Pericial
                  </button>
                ) : (
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>{currentCase.technicalVerdict}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {
                        currentCase.options.find(
                          (o) => o.id === selectedOptions[currentCase.id]
                        )?.explanation
                      }
                    </p>
                    <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-400">
                      <span className="text-cyan-400 font-bold">Lección Aprendida: </span>
                      {currentCase.lessonLearned}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
