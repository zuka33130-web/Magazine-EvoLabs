import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
} from "lucide-react";
import { SECTOR_28_TEST_BANK } from "../../../data/tomo02Sector28Data";

interface Tomo02Sector28TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector28TestView: React.FC<Tomo02Sector28TestViewProps> = ({
  onBackToReader,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    let count = 0;
    SECTOR_28_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        count++;
      }
    });
    return count;
  }, [selectedAnswers]);

  const percentage = Math.round((score / SECTOR_28_TEST_BANK.length) * 100);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080B10]/95 backdrop-blur border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToReader}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              <span>NIVEL IV // DIAGNOSTICAR WINDOWS</span>
              <span>•</span>
              <span>SECTOR 28: BSOD</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>Examen de Certificación Forense BSOD</span>
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToReader}
          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          Volver a Investigaciones
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Results banner if submitted */}
        {submitted && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#080B10] to-[#0A1018] border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.25)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-7 h-7 text-cyan-400" />
                <div>
                  <h2 className="text-lg font-bold text-white font-mono">
                    Resultado de la Evaluación Forense
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {score} de {SECTOR_28_TEST_BANK.length} respuestas correctas ({percentage}%)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reintentar</span>
              </button>
            </div>
          </div>
        )}

        {/* Questions list */}
        <div className="space-y-6">
          {SECTOR_28_TEST_BANK.map((q) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correctOptionId;

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 rounded-2xl bg-[#080B10] border transition-all ${
                  submitted
                    ? isCorrect
                      ? "border-emerald-500/50 bg-emerald-950/10"
                      : "border-red-500/50 bg-red-950/10"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-cyan-400 font-bold">
                    PREGUNTA {q.questionNumber} // {q.category}
                  </span>
                  {submitted && (
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">CORRECTO</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400">INCORRECTO</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-white mb-4 leading-relaxed font-mono">
                  {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    const isTargetCorrect = submitted && opt.id === q.correctOptionId;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                          isSelected
                            ? isTargetCorrect || !submitted
                              ? "bg-cyan-950/40 border-cyan-500 text-cyan-200"
                              : "bg-red-950/40 border-red-500 text-red-200"
                            : isTargetCorrect
                            ? "bg-emerald-950/40 border-emerald-500 text-emerald-200"
                            : "bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 cursor-pointer"
                        }`}
                      >
                        <span className="font-mono font-bold text-cyan-400 shrink-0">
                          [{opt.id}]
                        </span>
                        <span className="flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase block">
                      Fundamento Arquitectónico:
                    </span>
                    <p className="leading-relaxed">{q.technicalExplanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit action */}
        {!submitted && (
          <div className="flex justify-end pt-4">
            <button
              type="button"
              disabled={Object.keys(selectedAnswers).length === 0}
              onClick={() => {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              Finalizar y Calificar ({Object.keys(selectedAnswers).length}/{SECTOR_28_TEST_BANK.length})
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
