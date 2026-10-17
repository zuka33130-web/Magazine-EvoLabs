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
  ShieldAlert,
  Terminal,
  Activity,
} from 'lucide-react';
import { SECTOR_01_TEST_BANK, Sector01TestQuestion } from '../../../data/tomo02Sector01CasesAndTests';

interface Tomo02Sector01TestViewProps {
  onPassTest?: (percentage: number) => void;
  onBackToReader: () => void;
  onOpenExpediente: () => void;
}

export const Tomo02Sector01TestView: React.FC<Tomo02Sector01TestViewProps> = ({
  onBackToReader,
  onPassTest,
  onOpenExpediente,
}) => {
  // Select 10 random questions from the 24 question bank on mount
  const selectedQuestions = useMemo(() => {
    const shuffled = [...SECTOR_01_TEST_BANK].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQ: Sector01TestQuestion = selectedQuestions[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  // Calculate score
  const scoreData = useMemo(() => {
    let correctCount = 0;
    selectedQuestions.forEach((q) => {
      const chosenOptId = selectedAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (chosenOptId && correctOpt && chosenOptId === correctOpt.id) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / selectedQuestions.length) * 100);
    const passed = percentage >= 70;

    return { correctCount, total: selectedQuestions.length, percentage, passed };
  }, [selectedAnswers, selectedQuestions]);

  const allAnswered = selectedQuestions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-6 px-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-zinc-900/90 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToReader}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Investigaciones
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                EVALUACIÓN DE BANCO
              </span>
              <span className="text-xs font-mono text-zinc-400">SECTOR 01: ANTES DEL LOGO</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">Test de Vector de Arranque y Firmware</h2>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono text-zinc-400">PREGUNTA</div>
          <div className="text-lg font-mono font-bold text-amber-400">
            {currentIndex + 1} <span className="text-zinc-500 text-sm">/ {selectedQuestions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      {!submitted ? (
        <div className="p-6 md:p-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-6">
          {/* Category & Scenario */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                CATEGORÍA: {currentQ.category}
              </span>
            </div>
            <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed italic mb-4">
              “{currentQ.scenario}”
            </div>
            <h3 className="text-base md:text-lg font-bold text-white leading-snug">{currentQ.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs md:text-sm flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${
                      isSelected ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {opt.id.toUpperCase()}
                  </div>
                  <div className="leading-relaxed">{opt.text}</div>
                </button>
              );
            })}
          </div>

          {/* Question Nav & Submit */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Anterior
            </button>

            {currentIndex < selectedQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(selectedQuestions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => { setSubmitted(true); onPassTest?.(scoreData.percentage); }}
                disabled={!allAnswered}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-bold transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                Finalizar y Evaluar
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="p-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-6">
          <div className="text-center space-y-3 pb-6 border-b border-zinc-800">
            <div
              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                scoreData.passed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
            >
              {scoreData.passed ? <Award className="w-9 h-9" /> : <ShieldAlert className="w-9 h-9" />}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {scoreData.passed ? '¡Evaluación Aprobada!' : 'Evaluación Insuficiente'}
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              {scoreData.passed
                ? 'Demostraste dominio pericial del proceso de arranque pre-boot, firmware UEFI y arquitectura BCD.'
                : 'Revisá las justificaciones técnicas y volvé a intentar para consolidar el diagnóstico de arranque.'}
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-xl bg-zinc-950 border border-zinc-800 font-mono">
              <span className="text-xs text-zinc-400">Puntaje Final:</span>
              <span
                className={`text-xl font-bold ${
                  scoreData.passed ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {scoreData.percentage}% ({scoreData.correctCount} / {scoreData.total})
              </span>
            </div>
          </div>

          {/* Breakdown by question */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              Desglose Técnico de Respuestas
            </h3>

            <div className="space-y-3">
              {selectedQuestions.map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const correctOpt = q.options.find((o) => o.isCorrect);
                const isCorrect = userChoice === correctOpt?.id;
                const chosenOpt = q.options.find((o) => o.id === userChoice);

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-200'
                        : 'bg-red-950/20 border-red-500/30 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white">
                        {idx + 1}. {q.question}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                          isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {isCorrect ? 'CORRECTO' : 'INCORRECTO'}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400">
                      <strong>Tu respuesta:</strong> {chosenOpt?.text || 'Sin responder'}
                    </div>

                    {!isCorrect && correctOpt && (
                      <div className="text-[11px] text-emerald-400">
                        <strong>Respuesta correcta:</strong> {correctOpt.text}
                      </div>
                    )}

                    <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-300">
                      <strong>Justificación pericial:</strong> {correctOpt?.technicalJustification}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setSelectedAnswers({});
                setSubmitted(false);
                setCurrentIndex(0);
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reintentar Test (Nuevas Preguntas)
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenExpediente}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Ver Expediente de Arranque
              </button>
              <button
                onClick={onBackToReader}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors shadow-lg shadow-amber-500/20"
              >
                Finalizar y Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
