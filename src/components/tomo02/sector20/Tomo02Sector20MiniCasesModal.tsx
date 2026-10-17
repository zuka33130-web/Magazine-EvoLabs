import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_20_MINICASES } from '../../../data/tomo02Sector20Data';

interface Tomo02Sector20MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector20MiniCasesModal: React.FC<Tomo02Sector20MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    SECTOR_20_MINICASES[0]?.id || ''
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showVerdicts, setShowVerdicts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentCase =
    SECTOR_20_MINICASES.find((c) => c.id === selectedCaseId) ||
    SECTOR_20_MINICASES[0];

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
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Sector 20</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-mono">Taller Forense de Windows Update</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Casos Prácticos de Windows Update y CBS</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            {SECTOR_20_MINICASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                  selectedCaseId === c.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.code}: {c.title.slice(0, 24)}...
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                ESCENARIO REAL // {currentCase.code}
              </span>
              <p className="text-sm text-slate-200">{currentCase.scenario}</p>
              <div className="pt-2 text-xs text-rose-300 font-mono">
                <strong>Declaración del cliente:</strong> &quot;{currentCase.userStatement}&quot;
              </div>
              <div className="text-xs text-amber-300 font-mono">
                <strong>Error inicial:</strong> {currentCase.initialMistake}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-300 font-bold">
                {currentCase.diagnosticQuestion}
              </div>
              <div className="space-y-2">
                {currentCase.options.map((opt) => {
                  const isSelected = selectedOptions[currentCase.id] === opt.id;
                  const showVerdict = showVerdicts[currentCase.id];

                  let cardStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850';
                  if (isSelected && !showVerdict) {
                    cardStyle = 'bg-cyan-950/40 border-cyan-500 text-cyan-200';
                  } else if (showVerdict) {
                    if (opt.isCorrect) {
                      cardStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentCase.id, opt.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${cardStyle}`}
                    >
                      <div className="font-semibold mb-1">{opt.text}</div>
                      {showVerdict && (
                        <div className="text-[11px] opacity-90 mt-1 font-mono">{opt.explanation}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {!showVerdicts[currentCase.id] ? (
              <button
                onClick={() => handleVerify(currentCase.id)}
                disabled={!selectedOptions[currentCase.id]}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
              >
                VERIFICAR DIAGNÓSTICO
              </button>
            ) : (
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VEREDICTO TÉCNICO OFICIAL</span>
                </div>
                <p className="text-emerald-200/90">{currentCase.technicalVerdict}</p>
                <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-emerald-900/40">
                  <strong className="text-slate-300">Lección aprendida:</strong> {currentCase.lessonLearned}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
