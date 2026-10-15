import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { SECTOR_27_TEST_BANK } from '../../../data/tomo02Sector27Data';

interface Tomo02Sector27TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector27TestView: React.FC<Tomo02Sector27TestViewProps> = ({
  onBackToReader,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    let count = 0;
    SECTOR_27_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        count++;
      }
    });
    return count;
  }, [selectedAnswers]);

  const percentage = Math.round((score / SECTOR_27_TEST_BANK.length) * 100);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6 font-mono text-xs max-w-4xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between bg-[#080B10] p-4 rounded-xl border border-cyan-500/30">
        <button
          type="button"
          onClick={onBackToReader}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-400 font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Temario Sector 27</span>
        </button>
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-zinc-300 font-bold uppercase">
            EVALUACIÓN PERICIAL TÉCNICA // SECTOR 27
          </span>
        </div>
      </div>

      {/* Score Header if submitted */}
      {submitted && (
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
            percentage >= 70
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          }`}
        >
          <div>
            <h3 className="text-base font-bold">
              Resultado de Evaluación: {percentage >= 70 ? 'APROBADO' : 'REQUIERE REVISIÓN'}
            </h3>
            <p className="text-xs mt-1 opacity-80">
              {score} / {SECTOR_27_TEST_BANK.length} Respuestas Correctas ({percentage}%)
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-4">
        {SECTOR_27_TEST_BANK.map((item, idx) => {
          const selected = selectedAnswers[item.id];
          const isCorrect = selected === item.correctIndex;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#080B10] border border-cyan-500/20 space-y-3"
            >
              <p className="font-bold text-white text-sm">
                {idx + 1}. {item.question}
              </p>

              <div className="space-y-2 pt-1">
                {item.options.map((opt, optIdx) => {
                  let btnClass =
                    'p-3 rounded-xl border text-left w-full transition-all cursor-pointer font-mono text-xs flex items-center justify-between ';

                  if (submitted) {
                    if (optIdx === item.correctIndex) {
                      btnClass += 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                    } else if (selected === optIdx) {
                      btnClass += 'bg-rose-950/60 border-rose-500 text-rose-200';
                    } else {
                      btnClass += 'bg-[#030508] border-zinc-800 text-zinc-500 opacity-50';
                    }
                  } else {
                    if (selected === optIdx) {
                      btnClass += 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-bold';
                    } else {
                      btnClass += 'bg-[#030508] border-zinc-800 text-zinc-300 hover:border-zinc-700';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(item.id, optIdx)}
                      className={btnClass}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === item.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {submitted && selected === optIdx && optIdx !== item.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-zinc-300 font-sans text-xs mt-2">
                  <span className="font-mono text-cyan-400 font-bold block mb-0.5">
                    Fundamento Técnico:
                  </span>
                  {item.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={Object.keys(selectedAnswers).length < SECTOR_27_TEST_BANK.length}
            onClick={handleSubmit}
            className={`px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] ${
              Object.keys(selectedAnswers).length === SECTOR_27_TEST_BANK.length
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
            }`}
          >
            Enviar Evaluación ({Object.keys(selectedAnswers).length}/{SECTOR_27_TEST_BANK.length})
          </button>
        </div>
      )}
    </div>
  );
};
