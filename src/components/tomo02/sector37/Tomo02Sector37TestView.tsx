import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
} from "lucide-react";
import { SECTOR_37_TEST_BANK } from "../../../data/tomo02Sector37Data";

interface Tomo02Sector37TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector37TestView: React.FC<Tomo02Sector37TestViewProps> = ({
  onBackToReader,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const totalQuestions = SECTOR_37_TEST_BANK.length;

  const score = useMemo(() => {
    let count = 0;
    SECTOR_37_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        count++;
      }
    });
    return count;
  }, [selectedAnswers]);

  const percentage = Math.round((score / totalQuestions) * 100);

  const handleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToReader}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                <span>EVALUACIÓN PERICIAL // SECTOR 37</span>
                <span>•</span>
                <span>NIVEL V</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-cyan-400" />
                <span>Examen Teórico-Práctico: Base de Problemas Resueltos</span>
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToReader}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            Volver
          </button>
        </header>

        {/* Results Banner */}
        {isSubmitted && (
          <div
            className={`p-6 rounded-2xl border ${
              percentage >= 80
                ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-300"
                : "bg-amber-950/30 border-amber-500/50 text-amber-300"
            } flex flex-col sm:flex-row items-center justify-between gap-4 font-mono shadow-[0_0_30px_rgba(6,182,212,0.1)]`}
          >
            <div className="flex items-center gap-4">
              <Award className="w-10 h-10 shrink-0 text-cyan-400" />
              <div>
                <div className="text-sm font-bold uppercase tracking-wider">
                  {percentage >= 80 ? "Certificación Aprobada" : "Revisión Recomendada"}
                </div>
                <div className="text-xs text-zinc-300 mt-1">
                  Obtuviste {score} de {totalQuestions} respuestas correctas ({percentage}%).
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Test</span>
            </button>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {SECTOR_37_TEST_BANK.map((q) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = isSubmitted && userAnswer === q.correctOptionId;
            const isWrong = isSubmitted && userAnswer && userAnswer !== q.correctOptionId;

            return (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-cyan-500/20 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 font-mono text-[10px] text-cyan-300 font-bold uppercase">
                    Pregunta {q.questionNumber} // {q.category}
                  </span>
                  {isSubmitted && (
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                      {isCorrect && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correcto
                        </span>
                      )}
                      {isWrong && (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Incorrecto
                        </span>
                      )}
                      {!userAnswer && (
                        <span className="text-zinc-500">Sin responder</span>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {q.question}
                </p>

                {/* Options */}
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    let optStyle = "bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800 text-zinc-300";

                    if (isSubmitted) {
                      if (opt.id === q.correctOptionId) {
                        optStyle = "bg-emerald-950/40 border-emerald-500/60 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        optStyle = "bg-rose-950/40 border-rose-500/60 text-rose-300";
                      }
                    } else if (isSelected) {
                      optStyle = "bg-cyan-950/40 border-cyan-500/60 text-cyan-200 font-bold";
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelect(q.id, opt.id)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                      >
                        <span className="font-mono font-bold shrink-0 mt-0.5">
                          [{opt.id}]
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isSubmitted && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-xs space-y-1">
                    <span className="text-cyan-400 font-bold uppercase block">
                      Fundamento Pericial:
                    </span>
                    <p className="text-zinc-300 leading-relaxed">{q.technicalExplanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {!isSubmitted && (
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsSubmitted(true)}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              Calificar Examen ({Object.keys(selectedAnswers).length}/{totalQuestions})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
