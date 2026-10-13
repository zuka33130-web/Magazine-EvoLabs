import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { CheckSchema } from '../schema';

interface EvoAssessmentTemplateProps {
  check: CheckSchema;
  onCheckCompleted?: (isCorrect: boolean) => void;
}

export const EvoAssessmentTemplate: React.FC<EvoAssessmentTemplateProps> = ({ check, onCheckCompleted }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const selectedOption = check.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);
    onCheckCompleted?.(isCorrect);
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0b0e14] border border-amber-500/30 space-y-4 text-zinc-100 font-sans my-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            CHECKPOINT TÉCNICO // {check.checkType}
          </span>
          <span className="text-xs font-mono text-zinc-400">{check.id}</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">Ponderación: {check.weight}/10</span>
      </div>

      {/* Question */}
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white leading-relaxed">{check.question}</h4>
        <p className="text-xs text-zinc-400">{check.label}</p>
      </div>

      {/* Options */}
      <div className="space-y-2 pt-1">
        {check.options.map((opt) => {
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
                  <span className="text-[11px] opacity-80 block font-mono">{opt.feedbackText}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Epistemic Feedback on Submission */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in ${
            isCorrect
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold uppercase tracking-wide">
            {isCorrect ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <HelpCircle className="w-4 h-4 text-amber-400" />}
            {isCorrect ? 'Comprobación Exitosa' : 'Hipótesis Incorrecta'}
          </div>
          <p className="leading-relaxed text-zinc-300">
            {isCorrect ? check.explanation : check.failureFeedback}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
        <span className="text-[10px] font-mono text-zinc-500">
          Versión de Check: v{check.version}
        </span>

        {isSubmitted ? (
          <button
            onClick={handleReset}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-bold transition-colors"
          >
            Reintentar
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selectedOptionId}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:pointer-events-none text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Verificar Respuesta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
