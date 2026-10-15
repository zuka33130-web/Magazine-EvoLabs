import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  ArrowLeft,
  Globe,
} from 'lucide-react';
import { SECTOR_17_TEST_BANK } from '../../../data/tomo02Sector17Data';

interface Tomo02Sector17TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector17TestView: React.FC<Tomo02Sector17TestViewProps> = ({
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
    SECTOR_17_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });
    const percentage = Math.round((score / SECTOR_17_TEST_BANK.length) * 100);
    const passed = percentage >= 80;
    return { score, total: SECTOR_17_TEST_BANK.length, percentage, passed };
  }, [selectedAnswers]);

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < SECTOR_17_TEST_BANK.length) {
      setValidationError('Por favor responde todas las preguntas del examen antes de calificar.');
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
    <div className="max-w-4xl mx-auto space-y-8 text-slate-200 py-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToReader}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Investigaciones</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-mono text-[10px] font-bold">
              SECTOR 17
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              EXAMEN DE CERTIFICACIÓN PERICIAL: REDES Y TELECOMUNICACIONES
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Evaluación técnica de 10 reactivos sobre DORA, APIPA, NCSI, Autonegotiation, UDP/TCP y perfiles de Firewall
          </p>
        </div>

        {isSubmitted && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Reiniciar Examen</span>
          </button>
        )}
      </div>

      {/* Results banner if submitted */}
      {isSubmitted && (
        <div
          className={`p-6 rounded-2xl border ${
            results.passed
              ? 'bg-emerald-950/30 border-emerald-500/40'
              : 'bg-rose-950/30 border-rose-500/40'
          } space-y-3 font-sans`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  results.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                  Dictamen Final de Evaluación
                </span>
                <h3 className="text-xl font-bold text-slate-100">
                  {results.passed
                    ? '¡CERTIFICACIÓN PERICIAL EN REDES APROBADA!'
                    : 'PUNTAJE INSUFICIENTE PARA CERTIFICACIÓN'}
                </h3>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-3xl font-extrabold text-cyan-400">{results.percentage}%</span>
              <span className="text-xs text-slate-400 block">
                {results.score} de {results.total} aciertos (Mínimo: 80%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 flex items-center gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {SECTOR_17_TEST_BANK.map((q, idx) => {
          const selectedOpt = selectedAnswers[q.id];
          const isCorrect = isSubmitted && selectedOpt === q.correctOptionId;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-slate-900/90 border-emerald-500/40'
                    : 'bg-slate-900/90 border-rose-500/40'
                  : 'bg-slate-900/70 border-slate-800'
              } space-y-4`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                      CATEGORÍA: {q.category} · REF [{q.relatedInvestigationCode}]
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100 leading-snug">{q.question}</h4>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {q.options.map((opt) => {
                  const isOptSelected = selectedOpt === opt.id;
                  let optStyle = 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/40 text-slate-300';

                  if (isOptSelected) {
                    optStyle = 'border-cyan-500 bg-cyan-950/40 text-cyan-200';
                  }

                  if (isSubmitted) {
                    if (opt.id === q.correctOptionId) {
                      optStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium';
                    } else if (isOptSelected && !isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-950/40 text-rose-200 line-through';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isSubmitted && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs pt-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>EXPLICACIÓN TÉCNICA OFICIAL</span>
                  </div>
                  <p className="text-slate-300 font-sans leading-relaxed">{q.technicalExplanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit footer button */}
      {!isSubmitted && (
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Calificar Examen del Sector 17</span>
          </button>
        </div>
      )}
    </div>
  );
};
