import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  ChevronRight,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import { SECTOR_09_TEST_BANK } from '../../../data/tomo02Sector09Data';

interface Tomo02Sector09TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector09TestView: React.FC<Tomo02Sector09TestViewProps> = ({
  onBackToReader,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const results = useMemo(() => {
    let score = 0;
    SECTOR_09_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });
    const percentage = Math.round((score / SECTOR_09_TEST_BANK.length) * 100);
    const passed = percentage >= 80;
    return { score, total: SECTOR_09_TEST_BANK.length, percentage, passed };
  }, [selectedAnswers]);

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < SECTOR_09_TEST_BANK.length) {
      alert('Por favor responde todas las preguntas del examen antes de enviar.');
      return;
    }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-200 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToReader}
            className="text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Investigaciones
          </button>
          <h2 className="text-2xl font-bold text-slate-100">
            EXAMEN DE CERTIFICACIÓN CMD & BATCH SCRIPTING // SECTOR 09
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Evaluación técnica sobre Sintaxis, Redirección, Tuberías, Control de Procesos y Comandos de Diagnóstico
          </p>
        </div>

        {isSubmitted && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${
              results.passed
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                PUNTAJE FINAL
              </span>
              <span className="text-xl font-bold font-mono text-slate-100">
                {results.percentage}% ({results.score}/{results.total})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {SECTOR_09_TEST_BANK.map((q, idx) => {
          const selectedOptionId = selectedAnswers[q.id];
          const isCorrect = selectedOptionId === q.correctOptionId;

          return (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  PREGUNTA 0{idx + 1} // {q.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Ref: {q.relatedInvestigationCode}
                </span>
              </div>

              <h3 className="text-base font-medium text-slate-100">{q.question}</h3>

              <div className="space-y-2 mt-3">
                {q.options.map((opt) => {
                  const isOptSelected = selectedOptionId === opt.id;
                  let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isSubmitted) {
                    if (opt.id === q.correctOptionId) {
                      optStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
                    } else if (isOptSelected && !isCorrect) {
                      optStyle = 'bg-rose-950/40 border-rose-500/60 text-rose-200';
                    }
                  } else if (isOptSelected) {
                    optStyle = 'bg-amber-950/40 border-amber-500/60 text-amber-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer flex items-center justify-between gap-3 ${optStyle}`}
                    >
                      <span>{opt.text}</span>
                      <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center text-[10px] ${
                        isOptSelected ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold' : 'border-slate-700'
                      }`}>
                        {isOptSelected && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed mt-4 ${
                  isCorrect
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                }`}>
                  <strong className="block mb-1">
                    {isCorrect ? '✓ RESPUESTA CORRECTA' : '✕ RESPUESTA INCORRECTA'}
                  </strong>
                  <p className="text-slate-300 font-sans">{q.technicalExplanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="pt-4 flex items-center justify-between">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
          >
            Finalizar y Evaluar Examen
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reintentar Examen
          </button>
        )}
      </div>
    </div>
  );
};
