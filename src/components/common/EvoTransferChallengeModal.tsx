import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Zap,
} from 'lucide-react';
import {
  EvoMethodEngine,
  TransferChallenge,
  TRANSFER_CHALLENGES,
} from '../../services/evoMethodEngine';

interface EvoTransferChallengeModalProps {
  challenge?: TransferChallenge;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EvoTransferChallengeModal: React.FC<EvoTransferChallengeModalProps> = ({
  challenge = TRANSFER_CHALLENGES[0],
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen || !challenge) return null;

  const selectedOption = challenge.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);
    if (isCorrect) {
      onSuccess?.();
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090c13] border border-amber-500/40 rounded-2xl shadow-2xl text-zinc-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ETAPA 9 // TRANSFERENCIA COGNITIVA
                </span>
                <span className="text-xs font-mono text-zinc-400">{challenge.domain.toUpperCase()}</span>
              </div>
              <h3 className="text-base font-bold text-white font-mono">¿Podés aplicar lo aprendido a un problema nuevo?</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs font-sans">
          {/* Principle Learned Banner */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">
              Principio Fundamental Demostrado Previamente:
            </span>
            <p className="text-xs text-zinc-300 italic">{challenge.originalLearnedPrinciple}</p>
          </div>

          {/* Unseen Scenario Card */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-300 uppercase">
              <Zap className="w-4 h-4 text-amber-400" />
              Escenario No Visto (Nuevo Desafío):
            </div>
            <p className="text-zinc-200 leading-relaxed text-xs">
              {challenge.unseenScenario}
            </p>
          </div>

          {/* Transfer Question */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white font-mono">{challenge.transferQuestion}</h4>

            {/* Options */}
            <div className="space-y-2">
              {challenge.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let borderStyle = 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700';

                if (isSubmitted) {
                  if (opt.isCorrect) {
                    borderStyle = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200';
                  } else if (isSelected && !opt.isCorrect) {
                    borderStyle = 'border-red-500/80 bg-red-950/30 text-red-200';
                  }
                } else if (isSelected) {
                  borderStyle = 'border-amber-400 bg-amber-950/30 text-amber-100';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => !isSubmitted && setSelectedOptionId(opt.id)}
                    disabled={isSubmitted}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${borderStyle}`}
                  >
                    <div className="mt-0.5">
                      {isSubmitted ? (
                        opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isSelected ? (
                          <XCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-700" />
                        )
                      ) : (
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-400 bg-amber-400' : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="font-medium block">{opt.text}</span>
                      {isSubmitted && (opt.isCorrect || isSelected) && (
                        <span className="text-[11px] opacity-80 block font-mono">{opt.feedback}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission Feedback */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-1.5 animate-in fade-in ${
                isCorrect
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-mono font-bold uppercase">
                {isCorrect ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <HelpCircle className="w-4 h-4 text-amber-400" />}
                {isCorrect ? 'Transferencia Exitosa // Principio Consolidado' : 'Transferencia No Lograda'}
              </div>
              <p className="leading-relaxed text-zinc-300">
                {challenge.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#07090e] border-t border-zinc-800">
          <span className="text-[10px] font-mono text-zinc-500">
            Competencia: {challenge.demonstratedCompetency}
          </span>

          <div className="flex items-center gap-2">
            {isSubmitted ? (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-bold transition-colors"
              >
                Reintentar
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!selectedOptionId}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 disabled:pointer-events-none text-black font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Comprobar Transferencia</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
