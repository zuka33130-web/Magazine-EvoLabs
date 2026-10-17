import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Award,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { SECTOR_23_TEST_BANK } from '../../../data/tomo02Sector23Data';

interface Tomo02Sector23TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector23TestView: React.FC<Tomo02Sector23TestViewProps> = ({
  onBackToReader,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setValidationError(null);
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const results = useMemo(() => {
    let score = 0;
    SECTOR_23_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });
    const percentage = Math.round((score / SECTOR_23_TEST_BANK.length) * 100);
    const passed = percentage >= 80;
    return { score, total: SECTOR_23_TEST_BANK.length, percentage, passed };
  }, [selectedAnswers]);

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < SECTOR_23_TEST_BANK.length) {
      setValidationError('Por favor responde todas las preguntas antes de enviar la evaluación.');
      return;
    }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setValidationError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 space-y-6">
      {/* Top Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToReader}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Evaluación Técnica // Sector 23
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Mantenimiento Automático e Inactividad en Windows
            </h1>
          </div>
        </div>

        <button
          onClick={onBackToReader}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-xl font-bold transition-all"
        >
          Volver
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Banner if Submitted */}
        {isSubmitted && (
          <div
            className={`p-6 rounded-2xl border ${
              results.passed
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            } flex items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-4">
              <Award className="w-10 h-10 shrink-0 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold font-mono">
                  {results.passed ? '¡Acreditación Aprobada!' : 'Evaluación Incompleta / Reprobada'}
                </h3>
                <p className="text-xs mt-1 text-slate-300">
                  Obtuviste {results.score} de {results.total} respuestas correctas ({results.percentage}%).
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar</span>
            </button>
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {SECTOR_23_TEST_BANK.map((q) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = selectedOpt === q.correctOptionId;

            return (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>PREGUNTA #{q.questionNumber}</span>
                    <span>•</span>
                    <span className="text-slate-400 uppercase">{q.category}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">Ref: {q.relatedInvestigationCode}</span>
                </div>

                <p className="text-sm font-bold text-slate-100 font-sans leading-relaxed">
                  {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = selectedOpt === opt.id;

                    let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (isSubmitted) {
                      if (opt.id === q.correctOptionId) {
                        btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-cyan-950/40 border-cyan-500 text-slate-100 font-bold';
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center gap-3 ${btnStyle}`}
                      >
                        <span className="font-mono text-cyan-400 font-bold uppercase w-5">
                          {opt.id}.
                        </span>
                        <span className="leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1 font-mono">
                    <div className="text-cyan-400 font-bold">Explicación Técnica:</div>
                    <p className="text-slate-300 font-sans">{q.technicalExplanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-sm font-bold rounded-2xl transition-all shadow-xl"
          >
            Enviar y Calificar Examen
          </button>
        )}
      </div>
    </div>
  );
};
