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
import { SECTOR_11_TEST_BANK } from '../../../data/tomo02Sector11Data';

interface Tomo02Sector11TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector11TestView: React.FC<Tomo02Sector11TestViewProps> = ({
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
    SECTOR_11_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });
    const percentage = Math.round((score / SECTOR_11_TEST_BANK.length) * 100);
    const passed = percentage >= 80;
    return { score, total: SECTOR_11_TEST_BANK.length, percentage, passed };
  }, [selectedAnswers]);

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < SECTOR_11_TEST_BANK.length) {
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
            className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Investigaciones
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>EXAMEN DE CERTIFICACIÓN // SECTOR 11</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            TEST DE ARQUITECTURA DEL REGISTRO DE WINDOWS
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Evaluación oficial sobre colmenas, ControlSets, persistencia, CLI y operaciones atómicas
          </p>
        </div>

        {isSubmitted && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              results.passed
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}
          >
            <Award className="w-6 h-6 shrink-0" />
            <div>
              <div className="text-xs font-mono uppercase tracking-wider">
                {results.passed ? 'SECTOR 11 APROBADO' : 'NO ALCANZADO (REQ 80%)'}
              </div>
              <div className="text-lg font-bold font-mono">
                {results.score} / {results.total} ({results.percentage}%)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {SECTOR_11_TEST_BANK.map((q) => {
          const selected = selectedAnswers[q.id];
          return (
            <div
              key={q.id}
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4"
            >
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-cyan-400 font-bold">
                  PREGUNTA #{q.questionNumber} [{q.category}]
                </span>
                <span className="text-slate-500">REF: {q.relatedInvestigationCode}</span>
              </div>

              <p className="text-sm text-slate-100 font-medium leading-relaxed">{q.question}</p>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {q.options.map((opt) => {
                  const isChecked = selected === opt.id;
                  const isCorrect = q.correctOptionId === opt.id;

                  let optionStyle =
                    'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-300';
                  if (isChecked) {
                    optionStyle = 'border-cyan-500 bg-cyan-950/20 text-cyan-200';
                  }
                  if (isSubmitted && isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-200 font-semibold';
                  } else if (isSubmitted && isChecked && !isCorrect) {
                    optionStyle = 'border-rose-500 bg-rose-950/30 text-rose-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="font-mono font-bold uppercase shrink-0 mt-0.5">
                        [{opt.id}]
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Technical Explanation when submitted */}
              {isSubmitted && (
                <div className="pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider block">
                    Fundamento Técnico:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{q.technicalExplanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reiniciar Respuestas</span>
        </button>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-900/30 flex items-center gap-2"
          >
            <span>Enviar Examen</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onBackToReader}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Volver a Investigaciones
          </button>
        )}
      </div>
    </div>
  );
};
