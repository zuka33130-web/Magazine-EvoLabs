import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { SECTOR_04_TEST_BANK, Sector04TestQuestion } from '../../../data/tomo02Sector04Data';

interface Tomo02Sector04TestViewProps {
  onBack: () => void;
  onPassTest: (score: number) => void;
}

export const Tomo02Sector04TestView: React.FC<Tomo02Sector04TestViewProps> = ({
  onBack,
  onPassTest,
}) => {
  const [testSeed, setTestSeed] = useState(0);

  const selectedQuestions = useMemo(() => {
    return [...SECTOR_04_TEST_BANK];
  }, [testSeed]);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: Sector04TestQuestion = selectedQuestions[currentQIndex];
  const selectedOptId = userAnswers[currentQ?.id];

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
  const isPassed = scorePercent >= 80;

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentQIndex(0);
    setIsFinished(false);
    setTestSeed((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between font-mono">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-[#11161D] hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-2 border border-sky-500/20 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#00A4EF]" />
          <span>VOLVER A INVESTIGACIONES</span>
        </button>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-400">SECTOR 04 · EXAMEN DE INVESTIGACIÓN</span>
          <span className="px-3 py-1 rounded-full bg-[#11161D] border border-sky-500/30 text-[#60CDFF] font-bold">
            EVALUACIÓN DE MÉTRICAS Y PROCESOS
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-[#080B10] border border-[#00A4EF]/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(0,164,239,0.1)]">
          {/* Question Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#60CDFF] font-bold uppercase tracking-wider block">
                PREGUNTA {currentQIndex + 1} DE {selectedQuestions.length} // CATEGORÍA: {currentQ?.category}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {currentQ?.question}
              </h2>
            </div>
          </div>

          {/* Scenario */}
          {currentQ?.scenario && (
            <div className="p-4 rounded-xl bg-[#11161D] border border-sky-500/20 text-xs font-mono text-zinc-300">
              <span className="text-[10px] text-amber-400 font-bold block mb-1">ESCENARIO OBSERVADO:</span>
              <p className="font-sans text-sm text-zinc-200">{currentQ.scenario}</p>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3 font-mono text-xs">
            {currentQ?.options.map((opt) => {
              const isSelected = selectedOptId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectAnswer(opt.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0078D4]/20 border-[#00A4EF] text-white shadow-[0_0_15px_rgba(0,164,239,0.2)]'
                      : 'bg-[#11161D] border-sky-500/10 text-zinc-300 hover:border-sky-500/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${isSelected ? 'border-[#00A4EF] bg-[#00A4EF]' : 'border-zinc-600'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>{opt.text}</div>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800 font-mono text-xs">
            <span className="text-zinc-500">
              Mínimo requerido para aprobar: 80% (4 / 5 preguntas)
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedOptId}
              className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                selectedOptId
                  ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white shadow-[0_0_20px_rgba(0,164,239,0.3)]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <span>{currentQIndex < selectedQuestions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Examen'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-[#080B10] border border-[#00A4EF]/30 rounded-2xl p-6 sm:p-8 space-y-6 text-center font-sans shadow-[0_0_40px_rgba(0,164,239,0.15)] animate-fadeIn">
          <div className="inline-flex p-4 rounded-full bg-[#11161D] border border-sky-500/30 text-[#60CDFF] mb-2">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white uppercase font-mono tracking-tight">
              {isPassed ? '¡CERTIFICACIÓN DE INVESTIGACIÓN APROBADA!' : 'EVALUACIÓN NO SUPERADA'}
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              {isPassed
                ? 'Has demostrado dominio completo del Administrador de Tareas de Verdad, identificando métricas de memoria, hilos, PID/PPID y protocolos defensivos.'
                : 'Revisá las 23 investigaciones del Sector 04 y volvé a rendir para afianzar el análisis pericial.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#05070A] border border-sky-500/20 max-w-sm mx-auto space-y-2 font-mono">
            <div className="text-xs text-zinc-400">PUNTAJE OBTENIDO</div>
            <div className="text-4xl font-bold text-white">
              {correctCount} / {selectedQuestions.length}
            </div>
            <div className={`text-xs font-bold ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
              EFECTIVIDAD: {scorePercent}%
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 font-mono text-xs">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-[#11161D] hover:bg-zinc-800 text-zinc-300 font-bold border border-sky-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4 text-[#00A4EF]" />
              <span>REINTENTAR EXAMEN</span>
            </button>

            {isPassed && (
              <button
                type="button"
                onClick={() => onPassTest(scorePercent)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>REGISTRAR EN EXPEDIENTE</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
