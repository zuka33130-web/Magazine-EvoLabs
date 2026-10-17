import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import { SECTOR_12_TEST_BANK } from '../../../data/tomo02Sector12Data';

interface Tomo02Sector12TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector12TestView: React.FC<Tomo02Sector12TestViewProps> = ({
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
    SECTOR_12_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });
    const percentage = Math.round((score / SECTOR_12_TEST_BANK.length) * 100);
    const passed = percentage >= 80;
    return { score, total: SECTOR_12_TEST_BANK.length, percentage, passed };
  }, [selectedAnswers]);

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < SECTOR_12_TEST_BANK.length) {
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
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a las Investigaciones del Sector 12</span>
          </button>
          <h2 className="text-2xl font-bold text-slate-100">
            CERTIFICACIÓN TÉCNICA: DISCOS Y PARTICIONES
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Evaluación diagnóstica sobre LBA, GPT, MBR, sistemas de archivos y manipulación de volúmenes con DiskPart
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSubmitted && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          )}
        </div>
      </div>

      {isSubmitted && (
        <div
          className={`p-6 rounded-2xl border ${
            results.passed
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-rose-950/20 border-rose-500/40'
          } flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl animate-fadeIn`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-2xl ${
                results.passed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest block text-slate-400">
                Resultado de Certificación
              </span>
              <h3 className="text-xl font-bold text-slate-100">
                {results.passed
                  ? 'CERTIFICACIÓN APROBADA // ESPECIALISTA EN ALMACENAMIENTO'
                  : 'NIVEL INSUFICIENTE // REVISAR INVESTIGACIONES'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Puntaje obtenido: {results.score} de {results.total} ({results.percentage}%) • Requerido: 80%
              </p>
            </div>
          </div>
        </div>
      )}

      {validationError && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="space-y-6">
        {SECTOR_12_TEST_BANK.map((q, idx) => {
          const selectedOptId = selectedAnswers[q.id];
          const isCorrect = selectedOptId === q.correctOptionId;

          return (
            <div
              key={q.id}
              className={`bg-slate-900 border rounded-2xl p-6 transition-all shadow-lg ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  PREGUNTA {idx + 1} // {q.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Ref: Inv. {q.relatedInvestigationCode}
                </span>
              </div>

              <h4 className="text-base font-semibold text-slate-100 mb-4">{q.question}</h4>

              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const isSelected = selectedOptId === opt.id;
                  let optClass =
                    'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700';

                  if (isSubmitted) {
                    if (opt.id === q.correctOptionId) {
                      optClass = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'border-rose-500/80 bg-rose-950/30 text-rose-200';
                    }
                  } else if (isSelected) {
                    optClass = 'border-cyan-500 bg-cyan-950/30 text-cyan-200';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`p-3.5 rounded-xl border text-xs font-sans transition-all flex items-start gap-3 cursor-pointer ${optClass}`}
                    >
                      <span className="font-mono font-bold text-slate-400 mt-0.5">
                        {opt.id.toUpperCase()})
                      </span>
                      <p className="flex-1 leading-relaxed">{opt.text}</p>
                    </div>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcto
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Respuesta Incorrecta
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 font-sans">{q.technicalExplanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isSubmitted && (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold rounded-xl shadow-xl shadow-cyan-950 transition-all cursor-pointer"
          >
            Calificar Examen de Almacenamiento
          </button>
        </div>
      )}
    </div>
  );
};
