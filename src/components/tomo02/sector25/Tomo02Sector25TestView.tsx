import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Award,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { SECTOR_25_TEST_BANK } from '../../../data/tomo02Sector25Data';

interface Tomo02Sector25TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector25TestView: React.FC<Tomo02Sector25TestViewProps> = ({
  onBackToReader,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const score = useMemo(() => {
    if (!isSubmitted) return 0;
    let correctCount = 0;
    SECTOR_25_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });
    return correctCount;
  }, [isSubmitted, selectedAnswers]);

  const percentage = Math.round((score / SECTOR_25_TEST_BANK.length) * 100);

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          onClick={onBackToReader}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a las Investigaciones</span>
        </button>

        <div className="flex items-center justify-between bg-slate-900/90 p-6 rounded-2xl border border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                EVALUACIÓN PERICIAL TÉCNICA // SECTOR 25
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Examen de Validación RDP & Escritorio Remoto
              </h1>
            </div>
          </div>
        </div>

        {isSubmitted && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Resultado Final:</div>
              <div className="text-2xl font-bold text-white">
                {score} / {SECTOR_25_TEST_BANK.length} Respuestas Correctas ({percentage}%)
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Examen</span>
            </button>
          </div>
        )}

        <div className="space-y-6">
          {SECTOR_25_TEST_BANK.map((item, idx) => {
            const userAnswer = selectedAnswers[item.id];
            const isCorrect = userAnswer === item.correctOptionId;

            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                      Pregunta #{idx + 1} // {item.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100">{item.question}</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  {item.options.map((opt) => {
                    const isOptionSelected = userAnswer === opt.id;
                    let optionStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (isSubmitted) {
                      if (opt.id === item.correctOptionId) {
                        optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isOptionSelected && !isCorrect) {
                        optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                      }
                    } else if (isOptionSelected) {
                      optionStyle = 'bg-cyan-950/40 border-cyan-500 text-cyan-200 font-bold';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(item.id, opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-cyan-400 uppercase">{opt.id})</span>
                          <span>{opt.text}</span>
                        </div>
                        {isSubmitted && opt.id === item.correctOptionId && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isSubmitted && isOptionSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-mono font-bold text-cyan-400 block uppercase">
                      Explicación Técnica:
                    </span>
                    <p className="leading-relaxed">{item.technicalExplanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!isSubmitted && (
          <button
            type="button"
            disabled={Object.keys(selectedAnswers).length < SECTOR_25_TEST_BANK.length}
            onClick={() => setIsSubmitted(true)}
            className={`w-full py-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              Object.keys(selectedAnswers).length === SECTOR_25_TEST_BANK.length
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-xl'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Enviar Evaluación ({Object.keys(selectedAnswers).length}/{SECTOR_25_TEST_BANK.length})
          </button>
        )}
      </div>
    </div>
  );
};
