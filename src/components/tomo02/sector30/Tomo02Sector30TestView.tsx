import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
} from "lucide-react";
import { SECTOR_30_TEST_BANK } from "../../../data/tomo02Sector30Data";

interface Tomo02Sector30TestViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector30TestView: React.FC<Tomo02Sector30TestViewProps> = ({
  onBackToReader,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    let count = 0;
    SECTOR_30_TEST_BANK.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        count++;
      }
    });
    return count;
  }, [selectedAnswers]);

  const percentage = Math.round((score / SECTOR_30_TEST_BANK.length) * 100);

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
              <span>EVALUACIÓN FORENSE</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>Sector 30: Examen de Performance Forensics y ETW</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {submitted ? (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reintentar Examen</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              Evaluar Respuestas
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
        {/* Banner with progress or final score */}
        <div className="p-6 rounded-2xl bg-[#080B10] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
              Certificación de Dominio Técnico
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Test de Auditoría PerfMon, ETW y PresentMon
            </h2>
            <p className="text-xs text-zinc-400">
              {SECTOR_30_TEST_BANK.length} preguntas de rigor forense. Aprobación con 80% o superior.
            </p>
          </div>

          {submitted && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-700 shrink-0">
              <Award className={`w-8 h-8 ${percentage >= 80 ? "text-emerald-400" : "text-amber-400"}`} />
              <div>
                <div className="text-xl font-bold font-mono text-white">
                  {score} / {SECTOR_30_TEST_BANK.length} ({percentage}%)
                </div>
                <div className={`text-[10px] font-mono font-bold uppercase ${percentage >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                  {percentage >= 80 ? "Certificado Aprobado" : "Revisar Fundamentos"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Questions list */}
        <div className="space-y-5">
          {SECTOR_30_TEST_BANK.map((q, idx) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correctOptionId;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl bg-[#080B10] border transition-all ${
                  submitted
                    ? isCorrect
                      ? "border-emerald-500/40 bg-emerald-950/10"
                      : "border-red-500/40 bg-red-950/10"
                    : "border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                  <span className="text-cyan-400 font-bold">PREGUNTA {q.questionNumber || idx + 1}</span>
                  <span className="text-zinc-500 text-[10px] uppercase">{q.category}</span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-white mb-4">
                  {q.question}
                </h3>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    const isRightOption = opt.id === q.correctOptionId;

                    let optionStyle = "bg-[#0B0F17] border-zinc-800 text-zinc-300 hover:border-zinc-700";

                    if (submitted) {
                      if (isRightOption) {
                        optionStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium";
                      } else if (isSelected && !isRightOption) {
                        optionStyle = "bg-red-950/40 border-red-500 text-red-200";
                      } else {
                        optionStyle = "bg-[#0B0F17]/50 border-zinc-900 text-zinc-500";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-cyan-950/40 border-cyan-400 text-cyan-200 font-medium shadow-[0_0_15px_rgba(6,182,212,0.2)]";
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        disabled={submitted}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${optionStyle} ${
                          submitted ? "cursor-default" : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-md bg-black/60 border border-zinc-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {submitted && (
                          <div className="shrink-0">
                            {isRightOption ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : isSelected ? (
                              <XCircle className="w-4 h-4 text-red-400" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 p-3.5 rounded-xl bg-black border border-zinc-800 text-xs font-mono leading-relaxed">
                    <span className="text-cyan-400 font-bold block mb-1">Fundamento Forense:</span>
                    <span className="text-zinc-300">{q.technicalExplanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom submit */}
        {!submitted && (
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer"
            >
              Finalizar y Calificar Examen
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
