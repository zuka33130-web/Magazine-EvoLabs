import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Check,
  X,
  Sparkles,
  ChevronRight,
  Shield,
  Activity,
  Zap,
  HelpCircle,
  FileText,
  Clock,
  CheckSquare,
  Square,
  Layers,
  Terminal,
  AlertTriangle,
  MoveUp,
  MoveDown,
  ExternalLink,
  FlaskConical,
} from 'lucide-react';
import {
  EvoTomeExamEngineProps,
  ExamQuestion,
  UserExamAnswer,
  ExamResultTier,
  CategoryBreakdown,
  ExamAttemptRecord,
  SequenceStep,
} from './types';
import { getExamBankForTomo } from './data';
import { EvoExamVisualRenderer } from './EvoExamVisualRenderer';
import {
  getExamHistory,
  saveExamAttempt,
  getBestAttempt,
} from './utils/examStorage';

type EngineViewMode =
  | 'intro'
  | 'taking'
  | 'review_before_submit'
  | 'results'
  | 'under_development';

export const EvoTomeExamEngine: React.FC<EvoTomeExamEngineProps> = ({
  tomoId,
  onBackToTomoCover,
  onBackToIndex,
  onGoToChapter,
  onGoToModule,
  onContinueToLab,
  onOpenCompletionScreen,
  onExamPassed,
}) => {
  const bank = useMemo(() => getExamBankForTomo(tomoId), [tomoId]);

  const [viewMode, setViewMode] = useState<EngineViewMode>(() => {
    if (!bank || bank.isUnderDevelopment || bank.questions.length === 0) {
      return 'under_development';
    }
    return 'intro';
  });

  const [activeQuestions, setActiveQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserExamAnswer>>({});
  const [attemptHistory, setAttemptHistory] = useState<ExamAttemptRecord[]>([]);
  const [lastAttemptRecord, setLastAttemptRecord] = useState<ExamAttemptRecord | null>(null);

  // Load history on mount or tomoId change
  useEffect(() => {
    if (bank) {
      const history = getExamHistory(bank.tomoId);
      setAttemptHistory(history);
    }
  }, [bank]);

  // Handle under development check
  useEffect(() => {
    if (!bank || bank.isUnderDevelopment || bank.questions.length === 0) {
      setViewMode('under_development');
    }
  }, [bank]);

  // Start Exam: select questions (e.g. 15 randomized from bank or all if < 15)
  const handleStartExam = () => {
    if (!bank || bank.questions.length === 0) return;

    // Shuffle and pick questionsPerAttempt
    const shuffled = [...bank.questions].sort(() => Math.random() - 0.5);
    const count = Math.min(bank.questionsPerAttempt || 15, shuffled.length);
    const selected = shuffled.slice(0, count);

    // Initialize sequence questions default order
    const initialAnswers: Record<string, UserExamAnswer> = {};
    selected.forEach((q) => {
      if (q.type === 'SEQUENCE' && q.sequenceSteps) {
        // Scramble steps slightly so user has to order them
        const stepsShuffled = [...q.sequenceSteps].sort(() => Math.random() - 0.5);
        initialAnswers[q.id] = {
          questionId: q.id,
          orderedStepIds: stepsShuffled.map((s) => s.id),
        };
      }
    });

    setActiveQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserAnswers(initialAnswers);
    setViewMode('taking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Current Question
  const currentQuestion = activeQuestions[currentQuestionIndex];

  // Helper for single choice answer
  const handleSelectSingleOption = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOptionIds: [optionId],
      },
    }));
  };

  // Helper for multiple choice answer (toggle)
  const handleToggleMultipleOption = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => {
      const current = prev[questionId]?.selectedOptionIds || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return {
        ...prev,
        [questionId]: {
          questionId,
          selectedOptionIds: updated,
        },
      };
    });
  };

  // Helper for sequence reordering (move step up/down)
  const handleMoveSequenceStep = (
    questionId: string,
    stepId: string,
    direction: 'up' | 'down'
  ) => {
    setUserAnswers((prev) => {
      const currentOrder = prev[questionId]?.orderedStepIds || [];
      const index = currentOrder.indexOf(stepId);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentOrder.length) return prev;

      const newOrder = [...currentOrder];
      const temp = newOrder[index];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = temp;

      return {
        ...prev,
        [questionId]: {
          questionId,
          orderedStepIds: newOrder,
        },
      };
    });
  };

  // Calculate if a question has been answered
  const isQuestionAnswered = (q: ExamQuestion): boolean => {
    const ans = userAnswers[q.id];
    if (!ans) return false;
    if (q.type === 'SEQUENCE') {
      return Boolean(ans.orderedStepIds && ans.orderedStepIds.length > 0);
    }
    return Boolean(ans.selectedOptionIds && ans.selectedOptionIds.length > 0);
  };

  // Total answered questions count
  const answeredCount = useMemo(() => {
    return activeQuestions.filter((q) => isQuestionAnswered(q)).length;
  }, [activeQuestions, userAnswers]);

  // Submit and Grade the exam
  const handleSubmitExam = () => {
    if (!bank) return;

    let correctCount = 0;
    const categoryStats: Record<string, { correct: number; total: number }> = {};
    const incorrectIds: string[] = [];

    activeQuestions.forEach((q) => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, total: 0 };
      }
      categoryStats[q.category].total += 1;

      const ans = userAnswers[q.id];
      let isCorrect = false;

      if (q.type === 'SEQUENCE' && q.sequenceSteps) {
        const userOrder = ans?.orderedStepIds || [];
        const correctOrder = [...q.sequenceSteps]
          .sort((a, b) => a.correctIndex - b.correctIndex)
          .map((s) => s.id);
        isCorrect =
          userOrder.length === correctOrder.length &&
          userOrder.every((id, idx) => id === correctOrder[idx]);
      } else if (q.type === 'MULTIPLE_CHOICE' && q.options) {
        const userSelected = ans?.selectedOptionIds || [];
        const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
        const incorrectSelected = userSelected.some((id) => !correctIds.includes(id));
        const allCorrectSelected = correctIds.every((id) => userSelected.includes(id));
        isCorrect = !incorrectSelected && allCorrectSelected;
      } else if (q.options) {
        const selectedId = ans?.selectedOptionIds?.[0];
        const chosenOption = q.options.find((o) => o.id === selectedId);
        isCorrect = Boolean(chosenOption?.isCorrect);
      }

      if (isCorrect) {
        correctCount += 1;
        categoryStats[q.category].correct += 1;
      } else {
        incorrectIds.push(q.id);
      }
    });

    const total = activeQuestions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed = percentage >= (bank.passingScorePercent || 70);

    let tier: ExamResultTier = 'CRITICAL_REVIEW';
    if (percentage >= 85) {
      tier = 'SOLID_MASTERY';
    } else if (percentage >= 70) {
      tier = 'THEORY_VERIFIED';
    } else if (percentage >= 50) {
      tier = 'NEAR_PASS';
    }

    const categoryBreakdown: CategoryBreakdown[] = Object.entries(categoryStats).map(
      ([category, stats]) => ({
        category,
        correct: stats.correct,
        total: stats.total,
        percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      })
    );

    const now = new Date();
    const record: ExamAttemptRecord = {
      id: `attempt_${Date.now()}`,
      tomoId: bank.tomoId,
      tomoNumber: bank.tomoNumber,
      timestamp: now.toISOString(),
      formattedDate: `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      attemptNumber: attemptHistory.length + 1,
      score: correctCount,
      totalQuestions: total,
      percentage,
      tier,
      passed,
      categoryBreakdown,
      incorrectQuestionIds: incorrectIds,
    };

    saveExamAttempt(record);
    setLastAttemptRecord(record);
    setAttemptHistory((prev) => [record, ...prev]);

    if (passed && onExamPassed) {
      onExamPassed(correctCount, total);
    }

    setViewMode('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const accentColor = bank?.accentColor || '#EAB308';

  // ---------------------------------------------------------------------------
  // VIEW: UNDER DEVELOPMENT
  // ---------------------------------------------------------------------------
  if (viewMode === 'under_development' || !bank) {
    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="max-w-xl w-full bg-[#0d1117] border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div
            className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto mb-6">
            <Layers className="w-8 h-8 text-amber-400" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            TOMO {bank?.tomoNumber || tomoId} // EVALUACIÓN TÉCNICA
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            EXAMEN EN DESARROLLO
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed mb-8">
            {bank?.developmentNote ||
              'El banco de preguntas periciales para este Tomo se encuentra actualmente en fase de redacción técnica y validación de laboratorio. La habilitación ocurrirá con la publicación del contenido fuente correspondiente.'}
          </p>

          <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800/80 text-left mb-8 text-xs text-zinc-400 space-y-2">
            <div className="font-bold text-zinc-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>PROTOCOLO OFICIAL DE EVALUACIÓN EVO LABS</span>
            </div>
            <p>
              Ningún examen de la colección EVO se publica sin basarse en contenido real verificado. Las preguntas evalúan diagnóstico, evidencia y razonamiento pericial.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onBackToTomoCover && (
              <button
                onClick={onBackToTomoCover}
                className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a la Ficha del Tomo</span>
              </button>
            )}
            {onBackToIndex && (
              <button
                onClick={onBackToIndex}
                className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-sm transition-all border border-zinc-700"
              >
                Índice de Módulos
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: INTRO SCREEN
  // ---------------------------------------------------------------------------
  if (viewMode === 'intro') {
    const bestAttempt = getBestAttempt(bank.tomoId);

    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col p-4 sm:p-8">
        {/* Top bar navigation */}
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
          <button
            onClick={onBackToTomoCover || onBackToIndex}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-mono transition-all border border-zinc-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLVER AL TOMO {bank.tomoNumber}</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              SISTEMA DE EVALUACIÓN OFICIAL
            </span>
          </div>
        </div>

        {/* Main Hero Card */}
        <div className="max-w-4xl w-full mx-auto bg-gradient-to-b from-[#0f1420] to-[#0a0d14] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-xs font-mono font-bold mb-6">
            <Award className="w-4 h-4" style={{ color: accentColor }} />
            <span className="text-zinc-300">EXAMEN FINAL // TOMO {bank.tomoNumber}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            {bank.tomoTitle}
          </h1>

          <p className="text-lg text-zinc-300 font-light mb-8 max-w-2xl leading-relaxed">
            {bank.tomoTagline}
          </p>

          {/* Rules & Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                <FileText className="w-4 h-4" style={{ color: accentColor }} />
                <span>CANTIDAD</span>
              </div>
              <div className="text-2xl font-black text-white">15 Preguntas</div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Seleccionadas al azar de un banco de {bank.questions.length} preguntas
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>APROBACIÓN</span>
              </div>
              <div className="text-2xl font-black text-emerald-400">70 % Mínimo</div>
              <div className="text-[11px] text-zinc-500 mt-1">
                11 respuestas correctas para verificar teoría
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>HISTORIAL</span>
              </div>
              <div className="text-2xl font-black text-white">
                {bestAttempt ? `${bestAttempt.percentage}% Max` : 'Sin intentos'}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                {attemptHistory.length} intento(s) registrado(s) localmente
              </div>
            </div>
          </div>

          {/* EVO Evaluation Method Notice */}
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800 mb-8 space-y-2 text-xs text-zinc-300 leading-relaxed">
            <div className="font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
              <span>METODOLOGÍA DE EVALUACIÓN EVO LABS</span>
            </div>
            <p>
              Este examen evalúa razonamiento deductivo, interpretación de evidencias, métricas de telemetría y diagnósticos de taller real. No es un cuestionario de memoria superficial: cada pregunta mide si comprendés los principios físicos y de software detrás del hardware.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleStartExam}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base text-black transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 30px ${accentColor}40`,
              }}
            >
              <span>COMENZAR EXAMEN FINAL</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {onBackToIndex && (
              <button
                onClick={onBackToIndex}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-sm transition-all border border-zinc-800 text-center"
              >
                Repasar Módulos Antes de Rendir
              </button>
            )}
          </div>
        </div>

        {/* Previous Attempts Log */}
        {attemptHistory.length > 0 && (
          <div className="max-w-4xl w-full mx-auto mt-8 bg-[#0a0d14] border border-zinc-800/80 rounded-2xl p-6">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>HISTORIAL DE INTENTOS LOCAL</span>
            </h3>

            <div className="space-y-2">
              {attemptHistory.slice(0, 5).map((att) => (
                <div
                  key={att.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-xs gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        att.passed ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                    <span className="font-bold text-white">Intento #{att.attemptNumber}</span>
                    <span className="text-zinc-500">{att.formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400">
                      {att.score} / {att.totalQuestions} ({att.percentage}%)
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        att.passed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-950 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {att.passed ? 'TEORÍA COMPROBADA' : 'NECESITA REPASO'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: TAKING EXAM
  // ---------------------------------------------------------------------------
  if (viewMode === 'taking' && currentQuestion) {
    const currentAnswer = userAnswers[currentQuestion.id];
    const isAnswered = isQuestionAnswered(currentQuestion);

    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col">
        {/* Top Examination Status Bar */}
        <header className="sticky top-0 z-40 bg-[#07090e]/95 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-8 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-black"
                style={{ backgroundColor: accentColor }}
              >
                {bank.tomoNumber}
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  PREGUNTA {currentQuestionIndex + 1} DE {activeQuestions.length}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">
                  {currentQuestion.category}
                </div>
              </div>
            </div>

            {/* Answered Counter & Review Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                {answeredCount}/{activeQuestions.length} respondidas
              </span>

              <button
                onClick={() => setViewMode('review_before_submit')}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span>Revisar ({answeredCount})</span>
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      '¿Querés salir del examen? Las respuestas no guardadas se perderán.'
                    )
                  ) {
                    setViewMode('intro');
                  }
                }}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
                title="Salir del examen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar with Question Jump Dots */}
          <div className="max-w-4xl mx-auto mt-2.5">
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden flex">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>

            {/* Micro Question Jump Dots */}
            <div className="flex items-center justify-between gap-1 mt-1.5 overflow-x-auto pb-1 no-scrollbar">
              {activeQuestions.map((q, idx) => {
                const ans = isQuestionAnswered(q);
                const isCur = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-5 min-w-[20px] rounded text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isCur
                        ? 'bg-white text-black shadow-md'
                        : ans
                        ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                        : 'bg-zinc-950 text-zinc-600 border border-zinc-900 hover:text-zinc-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Question Body */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-between">
          <div className="bg-[#0b0e17] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-400 text-[10px] font-mono font-bold border border-zinc-800">
                TIPO: {currentQuestion.type.replace('_', ' ')}
              </span>
              <span
                className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                  border: `1px solid ${accentColor}30`,
                }}
              >
                ÁREA: {currentQuestion.competencyArea.replace('_', ' ')}
              </span>
              <span className="text-zinc-500 text-[11px] ml-auto">
                Capítulo {currentQuestion.relatedChapterNumber}: {currentQuestion.relatedChapterTitle}
              </span>
            </div>

            {/* Prompt */}
            <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed mb-4">
              {currentQuestion.prompt}
            </h2>

            {/* Optional Context Note */}
            {currentQuestion.contextNote && (
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 italic mb-4">
                {currentQuestion.contextNote}
              </div>
            )}

            {/* Optional Visual Resource Renderer */}
            {currentQuestion.visualResource && (
              <EvoExamVisualRenderer
                resourceKey={currentQuestion.visualResource}
                caption={currentQuestion.visualCaption}
                accentColor={accentColor}
              />
            )}

            {/* INPUT TYPE 1: SEQUENCE QUESTION */}
            {currentQuestion.type === 'SEQUENCE' && currentQuestion.sequenceSteps && (
              <div className="mt-6 space-y-2">
                <div className="text-xs font-mono text-cyan-400 font-bold mb-3 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>USÁ LOS BOTONES PARA ORDENAR LOS PASOS EN LA SECUENCIA TÉCNICA CORRECTA:</span>
                </div>

                {(() => {
                  const stepOrder =
                    currentAnswer?.orderedStepIds ||
                    currentQuestion.sequenceSteps.map((s) => s.id);

                  return stepOrder.map((stepId, index) => {
                    const step = currentQuestion.sequenceSteps?.find((s) => s.id === stepId);
                    if (!step) return null;

                    return (
                      <div
                        key={step.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs"
                            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                          >
                            {index + 1}
                          </span>
                          <span className="text-zinc-200">{step.text}</span>
                        </div>

                        <div className="flex items-center gap-1 ml-3">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() =>
                              handleMoveSequenceStep(currentQuestion.id, step.id, 'up')
                            }
                            className={`p-1.5 rounded-lg border border-zinc-800 ${
                              index === 0
                                ? 'opacity-30 cursor-not-allowed text-zinc-600'
                                : 'hover:bg-zinc-800 text-zinc-300'
                            }`}
                            title="Subir paso"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={index === stepOrder.length - 1}
                            onClick={() =>
                              handleMoveSequenceStep(currentQuestion.id, step.id, 'down')
                            }
                            className={`p-1.5 rounded-lg border border-zinc-800 ${
                              index === stepOrder.length - 1
                                ? 'opacity-30 cursor-not-allowed text-zinc-600'
                                : 'hover:bg-zinc-800 text-zinc-300'
                            }`}
                            title="Bajar paso"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {/* INPUT TYPE 2: MULTIPLE CHOICE QUESTION */}
            {currentQuestion.type === 'MULTIPLE_CHOICE' && currentQuestion.options && (
              <div className="mt-6 space-y-2.5">
                <div className="text-xs font-mono text-amber-400 font-bold mb-2">
                  * Seleccioná todas las opciones que correspondan:
                </div>

                {currentQuestion.options.map((opt) => {
                  const isSelected =
                    currentAnswer?.selectedOptionIds?.includes(opt.id) || false;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleMultipleOption(currentQuestion.id, opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-900/90 border-white/40 text-white shadow-lg'
                          : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900/60 hover:border-zinc-700'
                      }`}
                    >
                      <div className="mt-0.5 text-zinc-400">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5" style={{ color: accentColor }} />
                        ) : (
                          <Square className="w-5 h-5 text-zinc-600" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* INPUT TYPE 3: SINGLE CHOICE & OTHERS */}
            {currentQuestion.type !== 'SEQUENCE' &&
              currentQuestion.type !== 'MULTIPLE_CHOICE' &&
              currentQuestion.options && (
                <div className="mt-6 space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected =
                      currentAnswer?.selectedOptionIds?.[0] === opt.id;

                    const letter = String.fromCharCode(65 + idx); // A, B, C, D

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectSingleOption(currentQuestion.id, opt.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-900/90 text-white shadow-lg'
                            : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900/60 hover:border-zinc-700'
                        }`}
                        style={{
                          borderColor: isSelected ? accentColor : undefined,
                        }}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'text-black'
                              : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                          }`}
                          style={{
                            backgroundColor: isSelected ? accentColor : undefined,
                          }}
                        >
                          {letter}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed pt-0.5">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
          </div>

          {/* Bottom Nav Controls */}
          <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => {
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                currentQuestionIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-zinc-600 bg-zinc-950'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentQuestionIndex((prev) =>
                    Math.min(activeQuestions.length - 1, prev + 1)
                  );
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-black transition-all flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setViewMode('review_before_submit')}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>Revisar y Entregar</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: REVIEW BEFORE SUBMIT
  // ---------------------------------------------------------------------------
  if (viewMode === 'review_before_submit') {
    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 p-4 sm:p-8 flex flex-col justify-between">
        <div className="max-w-4xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-6">
            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                HOJA DE REVISIÓN
              </div>
              <h1 className="text-2xl font-bold text-white">
                Revisá tus respuestas antes de entregar
              </h1>
            </div>

            <button
              onClick={() => setViewMode('taking')}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-800 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la prueba</span>
            </button>
          </div>

          {/* Status summary banner */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-black"
                style={{ backgroundColor: accentColor }}
              >
                {answeredCount}/{activeQuestions.length}
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {answeredCount === activeQuestions.length
                    ? '¡Completaste todas las preguntas!'
                    : `Faltan responder ${activeQuestions.length - answeredCount} preguntas`}
                </div>
                <div className="text-xs text-zinc-500">
                  Podés hacer clic en cualquier pregunta para ir a editar tu respuesta.
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitExam}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              CONFIRMAR Y ENTREGAR AHORA
            </button>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {activeQuestions.map((q, idx) => {
              const answered = isQuestionAnswered(q);
              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setViewMode('taking');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    answered
                      ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs text-zinc-400">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-500">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {q.prompt}
                    </p>
                  </div>

                  <div className="shrink-0 mt-1">
                    {answered ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        <span>Lista</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        <span>Pendiente</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-4xl w-full mx-auto flex justify-between items-center pt-4 border-t border-zinc-800">
          <button
            onClick={() => setViewMode('taking')}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold"
          >
            ← Volver a la pregunta actual
          </button>

          <button
            onClick={handleSubmitExam}
            className="px-8 py-3 rounded-xl font-black text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20"
          >
            CONFIRMAR Y ENTREGAR EXAMEN
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: RESULTS & SMART REVIEW
  // ---------------------------------------------------------------------------
  if (viewMode === 'results' && lastAttemptRecord) {
    const record = lastAttemptRecord;

    const tierBadges: Record<
      ExamResultTier,
      { label: string; color: string; bg: string; border: string; desc: string }
    > = {
      SOLID_MASTERY: {
        label: 'DOMINIO SÓLIDO DEL CONTENIDO EVALUADO',
        color: 'text-emerald-300',
        bg: 'bg-emerald-950/60',
        border: 'border-emerald-500/40',
        desc: 'Demostraste un dominio integral de los fundamentos, diagnósticos y comprobaciones periciales de este Tomo.',
      },
      THEORY_VERIFIED: {
        label: 'TEORÍA COMPROBADA',
        color: 'text-cyan-300',
        bg: 'bg-cyan-950/60',
        border: 'border-cyan-500/40',
        desc: 'Alcanzaste el estándar de aprobación de EVO LABS (70%+). Tu comprensión conceptual y pericial ha sido verificada.',
      },
      NEAR_PASS: {
        label: 'CERCA DE COMPROBARLO',
        color: 'text-amber-300',
        bg: 'bg-amber-950/60',
        border: 'border-amber-500/40',
        desc: 'Tenés buena base conceptual pero quedaron lagunas en diagnósticos específicos o seguridad de taller.',
      },
      CRITICAL_REVIEW: {
        label: 'NECESITA REPASO IMPORTANTE',
        color: 'text-red-300',
        bg: 'bg-red-950/60',
        border: 'border-red-500/40',
        desc: 'Se detectaron errores en conceptos fundamentales de hardware/software. Te sugerimos repasar los módulos recomendados abajo antes de volver a rendir.',
      },
    };

    const currentTier = tierBadges[record.tier];

    // Smart Review: Categorize Strong vs Needs Review
    const strongCategories = record.categoryBreakdown.filter((c) => c.percentage >= 70);
    const reviewCategories = record.categoryBreakdown.filter((c) => c.percentage < 70);

    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 p-4 sm:p-8 flex flex-col">
        {/* Results Hero Card */}
        <div className="max-w-4xl w-full mx-auto bg-gradient-to-b from-[#0f1420] to-[#0a0d14] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-8">
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: record.passed ? '#10B981' : '#EF4444' }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-xs font-mono font-bold">
              <Award className="w-4 h-4" style={{ color: accentColor }} />
              <span>RESULTADO // TOMO {bank.tomoNumber}</span>
            </div>
            <div className="text-xs font-mono text-zinc-400">{record.formattedDate}</div>
          </div>

          {/* Big Score Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center mb-8">
            <div className="sm:col-span-2">
              <div
                className={`inline-block px-3.5 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider mb-3 ${currentTier.bg} ${currentTier.color} border ${currentTier.border}`}
              >
                {currentTier.label}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">
                {record.passed ? '¡Evaluación Aprobada!' : 'Evaluación Pendiente de Repaso'}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {currentTier.desc}
              </p>
            </div>

            {/* Score Ring / Box */}
            <div className="p-6 rounded-2xl bg-black/60 border border-zinc-800 text-center flex flex-col items-center justify-center">
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {record.percentage}%
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                {record.score} de {record.totalQuestions} correctas
              </div>
              <div
                className="mt-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: record.passed ? '#10B98120' : '#EF444420',
                  color: record.passed ? '#10B981' : '#EF4444',
                }}
              >
                {record.passed ? 'Teoría Comprobada' : 'Mínimo Requerido: 70%'}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-zinc-800/80">
            <button
              onClick={handleStartExam}
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetir Examen (Nuevas Preguntas)</span>
            </button>

            {record.passed && onOpenCompletionScreen && (
              <button
                onClick={onOpenCompletionScreen}
                className="px-6 py-3 rounded-xl font-black text-xs text-black bg-yellow-400 hover:bg-yellow-300 transition-all flex items-center gap-2 shadow-lg shadow-yellow-400/20 cursor-pointer"
              >
                <Award className="w-4 h-4 text-black" />
                <span>Ver Acreditación Oficial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {record.passed && onContinueToLab && (
              <button
                onClick={onContinueToLab}
                className="px-6 py-3 rounded-xl font-bold text-xs text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/50 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <span>Continuar al Laboratorio Asociado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {onBackToTomoCover && (
              <button
                onClick={onBackToTomoCover}
                className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs transition-all border border-zinc-800"
              >
                Volver a la Ficha del Tomo
              </button>
            )}
          </div>
        </div>

        {/* SMART REVIEW // ÁREAS & CATEGORÍAS */}
        <div className="max-w-4xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Category Progress Bars */}
          <div className="bg-[#0b0e17] border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>DESGLOSE POR ÁREAS EVALUADAS</span>
            </h3>

            <div className="space-y-3.5">
              {record.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span className="font-semibold">{cat.category}</span>
                    <span className="font-mono text-zinc-400">
                      {cat.correct}/{cat.total} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cat.percentage >= 70 ? 'bg-emerald-400' : 'bg-amber-500'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="bg-[#0b0e17] border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
                <span>REPASO INTELIGENTE EVO</span>
              </h3>

              {strongCategories.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ÁREAS FUERTES</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {strongCategories.map((c) => (
                      <span
                        key={c.category}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium"
                      >
                        {c.category} ({c.percentage}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {reviewCategories.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>ÁREAS RECOMENDADAS PARA REPASAR</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {reviewCategories.map((c) => (
                      <span
                        key={c.category}
                        className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-medium"
                      >
                        {c.category} ({c.percentage}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {onBackToIndex && (
              <button
                onClick={onBackToIndex}
                className="mt-6 w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Abrir Índice y Módulos de Estudio</span>
              </button>
            )}
          </div>
        </div>

        {/* QUESTION-BY-QUESTION PERICIAL FEEDBACK */}
        <div className="max-w-4xl w-full mx-auto bg-[#0b0e17] border border-zinc-800 rounded-3xl p-6 sm:p-8">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>DEVOLUCIÓN PERICIAL PREGUNTA POR PREGUNTA</span>
          </h3>

          <div className="space-y-6">
            {activeQuestions.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isIncorrect = record.incorrectQuestionIds.includes(q.id);

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border text-xs ${
                    isIncorrect
                      ? 'bg-red-950/10 border-red-500/30'
                      : 'bg-emerald-950/10 border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-zinc-400">
                      PREGUNTA #{idx + 1} // {q.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                        isIncorrect
                          ? 'bg-red-950 text-red-300 border border-red-500/40'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isIncorrect ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      <span>{isIncorrect ? 'Incorrecta' : 'Correcta'}</span>
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white mb-3">{q.prompt}</p>

                  {/* Technical Rationale */}
                  <div className="p-3 bg-black/50 rounded-xl border border-zinc-800/80 mb-3 space-y-1">
                    <div className="font-bold text-zinc-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>JUSTIFICACIÓN PERICIAL TÉCNICA:</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">{q.technicalRationale}</p>
                  </div>

                  {/* Link to chapter/module if user wants to review */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-zinc-500">
                    <span>
                      Capítulo evaluado: {q.relatedChapterNumber} — {q.relatedChapterTitle}
                    </span>

                    {(onGoToChapter || onGoToModule) && (
                      <button
                        onClick={() => {
                          if (q.relatedModuleIndex !== undefined && onGoToModule) {
                            onGoToModule(q.relatedModuleIndex);
                          } else if (q.relatedChapterNumber && onGoToChapter) {
                            onGoToChapter(q.relatedChapterNumber);
                          } else if (onBackToIndex) {
                            onBackToIndex();
                          }
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                      >
                        <span>Ir a este capítulo</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
