import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_26_MINICASES } from '../../../data/tomo02Sector26Data';

interface Tomo02Sector26MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector26MiniCasesModal: React.FC<Tomo02Sector26MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentCase = SECTOR_26_MINICASES[selectedCaseIndex];

  const handleSelectOption = (id: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(id);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setHasSubmitted(true);
  };

  const handleNextCase = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setSelectedCaseIndex((prev) => (prev + 1) % SECTOR_26_MINICASES.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#0A0E17] border border-cyan-500/30 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative space-y-6 my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
              EXPEDIENTES Y CASOS PRÁCTICOS // SECTOR 26
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {currentCase.title} ({currentCase.code})
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Escenario Pericial:</span>
            <p className="text-sm text-slate-300 leading-relaxed">{currentCase.scenario}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 font-mono">
            <span className="font-bold">Aseveración errónea del cliente:</span> "{currentCase.userStatement}"
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-bold uppercase block">
              {currentCase.diagnosticQuestion}
            </label>
            <div className="space-y-2">
              {currentCase.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700';

                if (hasSubmitted) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-cyan-950/40 border-cyan-500 text-cyan-200';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="font-mono font-bold text-cyan-400 shrink-0 uppercase">{opt.id})</span>
                    <span className="leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {!hasSubmitted ? (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleSubmit}
              className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedOptionId
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Emitir Veredicto Pericial
            </button>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Veredicto Técnico EVO:</span>
                </div>
                <p className="text-xs text-slate-300">{currentCase.technicalVerdict}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 pt-2 border-t border-slate-800">
                  <Lightbulb className="w-4 h-4" />
                  <span>Lección Aprendida: {currentCase.lessonLearned}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextCase}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Siguiente Expediente ({selectedCaseIndex + 1}/{SECTOR_26_MINICASES.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
