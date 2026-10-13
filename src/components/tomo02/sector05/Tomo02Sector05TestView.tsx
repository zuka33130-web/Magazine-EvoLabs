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
import { SECTOR_05_TEST_BANK, Sector05TestQuestion } from '../../../data/tomo02Sector05Data';

interface Tomo02Sector05TestViewProps {
  onBack: () => void;
}

export const Tomo02Sector05TestView: React.FC<Tomo02Sector05TestViewProps> = ({ onBack }) => {
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string }>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);

  const questions: Sector05TestQuestion[] = SECTOR_05_TEST_BANK;

  const score = useMemo(() => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionId) {
        correctCount += 1;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  }, [questions, userAnswers]);

  const handleSelectAnswer = (qId: string, optionId: string) => {
    if (isExamSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetExam = () => {
    setUserAnswers({});
    setIsExamSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isComplete = questions.every((q) => !!userAnswers[q.id]);

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0B0F19] border border-[#00A4EF]/30 shadow-[0_0_30px_rgba(0,164,239,0.15)]">
          <div className="space-y-1">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#60CDFF] hover:underline cursor-pointer mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>VOLVER AL SECTOR 05</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              EXAMEN DE CERTIFICACIÓN // SECTOR 05: PROCESOS QUE NO VES
            </h1>
            <p className="text-xs text-zinc-400">
              Evaluación pericial de arquitectura de procesos en segundo plano, background y servicios sin ventana.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {isExamSubmitted && (
              <div className="p-3 rounded-xl bg-[#0F172A] border border-[#00A4EF]/40 font-mono text-center">
                <span className="text-[10px] text-zinc-400 uppercase block">SCORE FINAL</span>
                <span
                  className={`text-xl font-bold ${score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}
                >
                  {score}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Results Banner */}
        {isExamSubmitted && (
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs ${score >= 80 ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' : 'bg-amber-950/30 border-amber-500/50 text-amber-200'}`}
          >
            <div className="flex items-center gap-3">
              <Award className={`w-8 h-8 ${score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <h3 className="font-bold text-sm">
                  {score >= 80 ? '¡CERTIFICACIÓN APROBADA EN SECTOR 05!' : 'EVALUACIÓN COMPLETADA - REQUIERE REVISIÓN'}
                </h3>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {score >= 80
                    ? 'Has demostrado dominio completo sobre los procesos en background y el motor Idle de Windows.'
                    : 'Revisá la retroalimentación técnica de las preguntas falladas antes de reintentar.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetExam}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REINTENTAR EXAMEN</span>
            </button>
          </div>
        )}

        {/* Question List */}
        <div className="space-y-4">
          {questions.map((q) => {
            const selectedOptId = userAnswers[q.id];
            const isCorrect = selectedOptId === q.correctOptionId;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-[#090D14] border border-zinc-800 space-y-4 text-xs font-sans"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-[#60CDFF] tracking-wider uppercase block">
                      PREGUNTA {q.questionNumber} // {q.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">{q.question}</h3>
                  </div>

                  {isExamSubmitted && (
                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>CORRECTO</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-mono text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>INCORRECTO</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;
                    let style =
                      'bg-[#0E131D] border-zinc-800 text-zinc-300 hover:border-sky-500/40 hover:bg-[#121824]';

                    if (isExamSubmitted) {
                      if (opt.id === q.correctOptionId) {
                        style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isSelected) {
                        style = 'bg-red-950/40 border-red-500 text-red-200';
                      }
                    } else if (isSelected) {
                      style =
                        'bg-[#0078D4]/20 border-[#00A4EF] text-white font-bold shadow-[0_0_12px_rgba(0,164,239,0.2)]';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${style}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#00A4EF] bg-[#00A4EF]' : 'border-zinc-600'}`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="leading-snug text-xs">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isExamSubmitted && (
                  <div className="p-3 rounded-xl bg-[#0C1017] border border-sky-500/20 text-zinc-300 font-mono text-[11px] space-y-1">
                    <span className="text-[#60CDFF] font-bold block">EXPLICACIÓN TÉCNICA:</span>
                    <p className="leading-relaxed">{q.technicalExplanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Action */}
        {!isExamSubmitted && (
          <button
            type="button"
            disabled={!isComplete}
            onClick={handleSubmitExam}
            className={`w-full py-3.5 rounded-2xl font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${isComplete ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white shadow-[0_0_24px_rgba(0,164,239,0.35)] hover:brightness-110' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
          >
            <span>EVALUAR RESPUESTAS Y OBTENER RESULTADO</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
