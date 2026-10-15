import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Award,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { SECTOR_22_TEST_BANK } from '../../../data/tomo02Sector22Data';

interface Tomo02Sector22TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector22TestView: React.FC<Tomo02Sector22TestViewProps> = ({
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
    SECTOR_22_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });
    const percentage = Math.round((score / SECTOR_22_TEST_BANK.length) * 100);
    const passed = percentage >= 80;
    return { score, total: SECTOR_22_TEST_BANK.length, percentage, passed };
  }, [selectedAnswers]);

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < SECTOR_22_TEST_BANK.length) {
      setValidationError('Por favor responde todas las preguntas antes de finalizar el examen.');
      return;
    }
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setValidationError(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans text-slate-200 max-w-4xl mx-auto">
      {/* Test Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToReader}
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Lector // Sector 22</span>
          </button>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Eye className="w-6 h-6 text-cyan-400" />
            <span>Evaluación Técnica: Sector 22 - Privacidad y Telemetría</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Examen oficial de certificación EVO sobre telemetría DiagTrack, sockets TCP, trazabilidad PID y SRUDB.dat
          </p>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-3 text-rose-200 text-xs font-mono">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Score Result Card (when submitted) */}
      {isSubmitted && (
        <div
          className={`p-6 rounded-2xl border shadow-2xl ${
            results.passed
              ? 'bg-emerald-950/40 border-emerald-500/50'
              : 'bg-rose-950/40 border-rose-500/50'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-2xl border ${
                  results.passed
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500 text-rose-400'
                }`}
              >
                <Award className="w-10 h-10" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Resultado de Evaluación Técnica
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mt-0.5">
                  {results.passed ? '¡Aprobado con Excelencia!' : 'Evaluación No Superada'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Puntaje obtenido: {results.score} / {results.total} ({results.percentage}%) - Requerido: 80%
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Examen</span>
            </button>
          </div>
        </div>
      )}

      {/* Questions Bank List */}
      <div className="space-y-6">
        {SECTOR_22_TEST_BANK.map((q, idx) => {
          const selectedOpt = selectedAnswers[q.id];

          return (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>PREGUNTA {idx + 1} DE {SECTOR_22_TEST_BANK.length}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{q.category}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  Ref: Inv {q.relatedInvestigationCode}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 leading-relaxed">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {q.options.map((opt) => {
                  const isSelected = selectedOpt === opt.id;
                  let optStyle =
                    'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700';

                  if (isSelected) {
                    optStyle = 'bg-cyan-500/10 border-cyan-500 text-cyan-200 font-medium';
                  }

                  if (isSubmitted) {
                    if (opt.id === q.correctOptionId) {
                      optStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && opt.id !== q.correctOptionId) {
                      optStyle = 'bg-rose-500/15 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-center gap-3 ${optStyle}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                          isSelected
                            ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                            : 'border-slate-700 text-slate-500'
                        }`}
                      >
                        {opt.id.toUpperCase()}
                      </div>
                      <span className="flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Technical Explanation when submitted */}
              {isSubmitted && (
                <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="font-mono text-cyan-400 font-bold text-[11px] uppercase">
                    Explicación Técnica Canónica:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {q.technicalExplanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl font-mono text-xs uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/10"
          >
            Finalizar y Calificar Examen Sector 22
          </button>
        </div>
      )}
    </div>
  );
};
