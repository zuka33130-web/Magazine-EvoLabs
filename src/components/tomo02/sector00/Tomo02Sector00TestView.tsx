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
} from 'lucide-react';
import { SECTOR_00_TEST_BANK, Sector00TestQuestion } from '../../../data/tomo02Sector00Data';

interface Tomo02Sector00TestViewProps {
  onBack: () => void;
  onPassTest: (score: number) => void;
}

export const Tomo02Sector00TestView: React.FC<Tomo02Sector00TestViewProps> = ({
  onBack,
  onPassTest,
}) => {
  // Select 8 randomized questions from bank of 16
  const [testSeed, setTestSeed] = useState(0);

  const selectedQuestions = useMemo(() => {
    const shuffled = [...SECTOR_00_TEST_BANK].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [testSeed]);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: Sector00TestQuestion = selectedQuestions[currentQIndex];
  const selectedOptId = userAnswers[currentQ.id];

  const handleSelectAnswer = (optId: string) => {
    if (isFinished) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleNext = () => {
    if (currentQIndex < selectedQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Calculate score
  const correctCount = useMemo(() => {
    let count = 0;
    selectedQuestions.forEach((q) => {
      const selected = userAnswers[q.id];
      const opt = q.options.find((o) => o.id === selected);
      if (opt && opt.isCorrect) count++;
    });
    return count;
  }, [selectedQuestions, userAnswers]);

  const scorePercent = Math.round((correctCount / selectedQuestions.length) * 100);
  const isPassed = scorePercent >= 70;

  const handleRestart = () => {
    setTestSeed((prev) => prev + 1);
    setUserAnswers({});
    setCurrentQIndex(0);
    setIsFinished(false);
  };

  const handleFinishAndSave = () => {
    if (isPassed) {
      onPassTest(scorePercent);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono-tech text-zinc-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER AL SECTOR 00</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-tech text-cyan-400 font-bold uppercase tracking-wider">
            EVALUACIÓN PERICIAL // SECTOR 00
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono-tech text-cyan-300">
            BANCO DE 16 // 8 REACTIVOS
          </span>
        </div>
      </div>

      {!isFinished ? (
        /* Quiz active view */
        <div className="p-6 rounded-2xl bg-[#090c12] border border-cyan-500/30 shadow-xl space-y-6">
          
          {/* Question progress */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-tech text-cyan-400 font-bold">
              PREGUNTA {currentQIndex + 1} DE {selectedQuestions.length} // {currentQ.category}
            </span>
            <span className="text-xs font-mono-tech text-zinc-400">
              APROBACIÓN: 70% MÍNIMO
            </span>
          </div>

          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / selectedQuestions.length) * 100}%` }}
            />
          </div>

          {/* Scenario & Question */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-xs font-mono-tech text-zinc-300">
              <span className="text-cyan-400 font-bold">ESCENARIO: </span>
              {currentQ.scenario}
            </div>

            <h3 className="text-base sm:text-lg font-display font-bold text-white leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,210,255,0.15)]'
                      : 'bg-[#0e131d] border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center text-xs font-mono-tech font-bold mt-0.5 ${
                      isSelected ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </div>

                  <span className="text-xs sm:text-sm font-sans-editorial leading-relaxed">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-zinc-300 disabled:opacity-40"
            >
              ← ANTERIOR
            </button>

            <button
              disabled={!selectedOptId}
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-mono-tech font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>{currentQIndex === selectedQuestions.length - 1 ? 'FINALIZAR TEST' : 'SIGUIENTE PREGUNTA'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Results View */
        <div className="p-6 rounded-2xl bg-[#090c12] border border-cyan-500/30 shadow-2xl space-y-6 animate-fadeIn">
          
          <div className="text-center space-y-3">
            <div
              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl font-mono-tech font-black ${
                isPassed ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' : 'bg-red-500/20 border border-red-500 text-red-400'
              }`}
            >
              {scorePercent}%
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
              {isPassed ? 'EVALUACIÓN PERICIAL APROBADA' : 'EVALUACIÓN PERICIAL NO ALCANZADA'}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial max-w-md mx-auto">
              {isPassed
                ? 'Has demostrado dominio conceptual de los 9 parámetros de identidad de Windows, el modelo de privilegios y las variables de entorno.'
                : 'Se requiere un mínimo de 70% (6/8 aciertos). Revisá las justificaciones técnicas a continuación y reintentá el test.'}
            </p>
          </div>

          {/* Detailed Review */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h4 className="text-xs font-mono-tech uppercase text-cyan-400 font-bold">
              DESGLOSE TÉCNICO Y JUSTIFICACIONES
            </h4>

            <div className="space-y-3">
              {selectedQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const optUser = q.options.find((o) => o.id === userAns);
                const optCorrect = q.options.find((o) => o.isCorrect);
                const isItemCorrect = optUser?.isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isItemCorrect ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-red-950/20 border-red-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-tech">
                      <span className="font-bold text-white">REACTIVO #{idx + 1}</span>
                      <span className={isItemCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {isItemCorrect ? 'CORRECTO ✓' : 'INCORRECTO ✕'}
                      </span>
                    </div>

                    <p className="text-zinc-200 font-sans-editorial">{q.question}</p>

                    <div className="p-2.5 rounded bg-black/50 space-y-1 font-mono-tech text-[11px]">
                      <div className="text-zinc-400">
                        Tu respuesta: <span className={isItemCorrect ? 'text-emerald-300' : 'text-red-300'}>{optUser?.text || 'Sin respuesta'}</span>
                      </div>
                      {!isItemCorrect && (
                        <div className="text-emerald-400">
                          Respuesta correcta: <span>{optCorrect?.text}</span>
                        </div>
                      )}
                      <div className="text-cyan-300/80 pt-1 border-t border-zinc-800 text-[10px]">
                        Justificación: {optCorrect?.technicalJustification}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono-tech text-zinc-300 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REINTENTAR NUEVO TEST ALEATORIO</span>
            </button>

            {isPassed ? (
              <button
                onClick={handleFinishAndSave}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono-tech font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>GUARDAR APROBACIÓN EN EXPEDIENTE</span>
              </button>
            ) : (
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech font-black text-xs uppercase tracking-wider transition-colors"
              >
                REPASAR CONTENIDO DEL SECTOR 00
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
