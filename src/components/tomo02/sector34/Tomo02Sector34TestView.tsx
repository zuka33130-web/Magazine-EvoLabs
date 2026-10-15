import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
} from "lucide-react";
import { SECTOR_34_TEST_BANK } from "../../../data/tomo02Sector34Data";

interface Tomo02Sector34TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector34TestView: React.FC<Tomo02Sector34TestViewProps> = ({
  onBackToReader,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const totalQuestions = SECTOR_34_TEST_BANK.length;

  const score = useMemo(() => {
    let count = 0;
    SECTOR_34_TEST_BANK.forEach((q) => {
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
    <div className="space-y-6 animate-fadeIn font-mono text-xs">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#080B10] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToReader}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                EXAMEN TÉCNICO · SECTOR 34
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
              Certificación de Component Store & CBS
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSubmitted && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          )}
          {!isSubmitted && (
            <button
              type="button"
              onClick={() => setIsSubmitted(true)}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              Calificar Examen
            </button>
          )}
        </div>
      </div>

      {/* Result banner */}
      {isSubmitted && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn ${
            percentage >= 80
              ? "bg-green-950/20 border-green-500/40 text-green-300"
              : "bg-amber-950/20 border-amber-500/40 text-amber-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="text-base font-bold uppercase">
                {percentage >= 80 ? "¡Certificación Aprobada!" : "Revisión Recomendada"}
              </h3>
              <p className="text-xs text-zinc-300">
                Puntaje obtenido: <span className="font-bold text-white">{score}</span> de{" "}
                <span className="font-bold text-white">{totalQuestions}</span> ({percentage}%)
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold font-mono">{percentage}%</span>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-4">
        {SECTOR_34_TEST_BANK.map((q) => {
          const userAnswer = selectedAnswers[q.id];
          const isCorrect = userAnswer === q.correctOptionId;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl bg-[#080B10] border transition-all space-y-4 ${
                isSubmitted
                  ? isCorrect
                    ? "border-green-500/40"
                    : "border-red-500/40"
                  : "border-cyan-500/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">
                    Pregunta {q.questionNumber} · {q.category}
                  </span>
                  <p className="text-sm text-white font-bold">{q.question}</p>
                </div>
                {isSubmitted && (
                  <span className="shrink-0 mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = userAnswer === opt.id;
                  let optStyle = "bg-[#0D121D] hover:bg-[#121926] border-zinc-800 text-zinc-300";

                  if (isSubmitted) {
                    if (opt.id === q.correctOptionId) {
                      optStyle = "bg-green-950/40 border-green-500/60 text-green-200 font-bold";
                    } else if (isSelected) {
                      optStyle = "bg-red-950/40 border-red-500/60 text-red-200";
                    }
                  } else if (isSelected) {
                    optStyle = "bg-cyan-950/40 border-cyan-500/60 text-cyan-200 font-bold";
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${optStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-black/40 border border-zinc-700 flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Technical rationale */}
              {isSubmitted && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-zinc-300 space-y-1">
                  <span className="font-bold text-cyan-300 block text-[11px] uppercase">
                    Explicación de Ingeniería:
                  </span>
                  <p className="text-xs leading-relaxed">{q.technicalExplanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
