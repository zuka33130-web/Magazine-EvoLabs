import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { SECTOR_20_TEST_BANK } from '../../../data/tomo02Sector20Data';

interface Tomo02Sector20TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector20TestView: React.FC<Tomo02Sector20TestViewProps> = ({
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
    SECTOR_20_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });
    const percentage = Math.round((score / SECTOR_20_TEST_BANK.length) * 100);
    const passed = percentage >= 80;
    return { score, total: SECTOR_20_TEST_BANK.length, percentage, passed };
  }, [selectedAnswers]);

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < SECTOR_20_TEST_BANK.length) {
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
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-sans pb-16">
      <header className="sticky top-0 z-30 bg-[#080B10]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBackToReader}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VOLVER A LA TEORÍA</span>
          </button>
          <div className="flex items-center gap-2 font-mono text-xs">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span className="text-zinc-300 font-bold">CERTIFICACIÓN SECTOR 20: WINDOWS UPDATE</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Evaluación Oficial de Dominio</div>
          <h2 className="text-2xl font-bold text-white">Examen de Certificación: Windows Update y Servicing</h2>
          <p className="text-xs text-zinc-400">
            Responde las 10 preguntas técnicas sobre Servicing Stack (SSU), Component Store (WinSxS), CBS.log, SoftwareDistribution, rollback y decodificación HRESULT.
          </p>
        </div>

        {validationError && (
          <div className="p-4 bg-amber-950/40 border border-amber-800 rounded-xl text-amber-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="space-y-6">
          {SECTOR_20_TEST_BANK.map((q, idx) => {
            const selectedOpt = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl space-y-4"
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-cyan-400 font-bold">PREGUNTA {idx + 1} DE {SECTOR_20_TEST_BANK.length}</span>
                  <span className="text-zinc-500 font-mono">{q.category} // Inv {q.relatedInvestigationCode}</span>
                </div>

                <div className="text-sm font-semibold text-zinc-100">{q.question}</div>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = selectedOpt === opt.id;
                    let style = 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800/50';

                    if (isSelected && !isSubmitted) {
                      style = 'bg-cyan-950/50 border-cyan-500 text-cyan-200';
                    } else if (isSubmitted) {
                      if (opt.id === q.correctOptionId) {
                        style = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
                      } else if (isSelected && opt.id !== q.correctOptionId) {
                        style = 'bg-rose-950/50 border-rose-500 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${style}`}
                      >
                        <span>{opt.text}</span>
                        {isSelected && !isSubmitted && (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-400">
                    <strong className="text-cyan-400">Explicación:</strong> {q.technicalExplanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!isSubmitted ? (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              ENVIAR RESPUESTAS Y CALIFICAR
            </button>
          </div>
        ) : (
          <div className="p-6 bg-zinc-900 border border-cyan-500/40 rounded-2xl space-y-4 text-center">
            <div className="inline-flex p-3 bg-cyan-500/10 rounded-full text-cyan-400 mb-2">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Puntuación Final: {results.score} / {results.total} ({results.percentage}%)
            </h3>
            <p className="text-xs font-mono text-zinc-300">
              {results.passed
                ? '¡FELICITACIONES! Has demostrado dominio completo del Servicing Stack y mantenimiento de Windows Update.'
                : 'Puntuación insuficiente. Repasa las investigaciones teóricas y vuelve a intentar el test.'}
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REINTENTAR EXAMEN</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
