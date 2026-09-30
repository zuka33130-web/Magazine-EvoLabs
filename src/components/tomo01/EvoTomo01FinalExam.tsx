import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Check,
  X,
  Sparkles,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export interface FinalExamQuestion {
  id: number;
  chapterNumber: string;
  chapterTitle: string;
  topic: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    rationale: string;
  }[];
}

export interface EvoTomo01FinalExamProps {
  onBackToIndex: () => void;
  onGoToChapter: (chapterNumber: string) => void;
  onCompleteExam: (score: number, total: number) => void;
}

const EXAM_QUESTIONS: FinalExamQuestion[] = [
  {
    id: 1,
    chapterNumber: '01',
    chapterTitle: 'CONOCÉ TU PC',
    topic: 'Identidad del Silicio',
    question: '¿Por qué la consulta directa en PowerShell (Get-CimInstance) o el Administrador de tareas supera a la etiqueta comercial del fabricante para conocer tu hardware?',
    options: [
      {
        text: 'Porque consulta directamente las tablas ACPI y descriptores de hardware del bus PCIe/SMBus, revelando frecuencias base, núcleos y modelos exactos sin marketing.',
        isCorrect: true,
        rationale: 'El firmware del silicio reporta sus IDs de hardware directos, desenmascarando nombres de fantasía comerciales.',
      },
      {
        text: 'Porque Windows inventa especificaciones superiores para acelerar la computadora.',
        isCorrect: false,
        rationale: 'Windows no altera las especificaciones del silicio; lee los registros del hardware.',
      },
      {
        text: 'Porque los fabricantes nunca ponen etiquetas en las computadoras.',
        isCorrect: false,
        rationale: 'Las etiquetas existen, pero suelen omitir datos técnicos cruciales como velocidad de bus, canales de memoria o stepping.',
      },
    ],
  },
  {
    id: 2,
    chapterNumber: '02',
    chapterTitle: 'CÓMO TRABAJAN JUNTOS',
    topic: 'Jerarquía de Latencias y Flujo de Datos',
    question: 'En la cadena de datos desde el almacenamiento hasta la pantalla, ¿cuál es el motivo físico por el que la RAM es indispensable y no puede ser sustituida por el SSD?',
    options: [
      {
        text: 'La RAM se comunica con el controlador de memoria de la CPU en nanosegundos (10 a 60 ns), mientras que un SSD NVMe responde en microsegundos (30 a 100 µs), lo que paralizaría el procesador.',
        isCorrect: true,
        rationale: 'Una diferencia de tres órdenes de magnitud en latencia provocaría tirones masivos e insoportables.',
      },
      {
        text: 'Porque los SSD solo pueden almacenar archivos de texto y música.',
        isCorrect: false,
        rationale: 'Los SSD almacenan cualquier tipo de binario, pero su celda NAND es lenta comparada con los capacitores de la DRAM.',
      },
      {
        text: 'Porque la CPU no tiene cables que la unan al zócalo de la placa.',
        isCorrect: false,
        rationale: 'Existen pistas de cobre directas en la placa madre para ambas interfaces, pero las velocidades de bus son muy dispares.',
      },
    ],
  },
  {
    id: 3,
    chapterNumber: '03',
    chapterTitle: 'CUANDO LOS FPS MIENTEN',
    topic: 'Métricas de Fluidez Real (Frametimes)',
    question: 'Si una placa gráfica entrega 144 FPS promedio pero su percentil 1% Low cae a 18 FPS, ¿qué experimenta el usuario en pantalla?',
    options: [
      {
        text: 'Micro-congelamientos y tirones bruscos (stuttering), debido a que varios fotogramas tardaron más de 55 ms en generarse mientras el resto tardó apenas 6 ms.',
        isCorrect: true,
        rationale: 'El promedio oculta la irregularidad. La consistencia temporal (línea plana de frametime) es la verdadera fluidez visual.',
      },
      {
        text: 'Una experiencia perfectamente sedosa porque 144 FPS es una cifra alta.',
        isCorrect: false,
        rationale: 'El promedio aritmético es engañoso cuando la desviación estándar y los picos de frametime son elevados.',
      },
      {
        text: 'Que el monitor se apaga para descansar.',
        isCorrect: false,
        rationale: 'El monitor sigue actualizando según su tasa de refresco, mostrando fotogramas duplicados o desfasados.',
      },
    ],
  },
  {
    id: 4,
    chapterNumber: '04',
    chapterTitle: 'ENCONTRÁ EL LÍMITE',
    topic: 'Identificación Empírica de Limitaciones',
    question: '¿Por qué observar una CPU al "100% de uso" no siempre indica que la CPU sea el único freno de tu sistema?',
    options: [
      {
        text: 'Porque la CPU puede estar saturada ejecutando procesos parásitos de fondo en Windows, esperando datos lentos de la RAM o sufriendo estrangulamiento térmico por calor.',
        isCorrect: true,
        rationale: 'El porcentaje de uso en el Administrador de Tareas combina tiempo de cómputo útil con tiempo de espera de buses e hilos colaterales.',
      },
      {
        text: 'Porque el 100% en Windows en realidad significa que el procesador está apagado.',
        isCorrect: false,
        rationale: 'El 100% significa que todos los núcleos lógicos están ocupados atendiendo instrucciones en ese intervalo de muestreo.',
      },
    ],
  },
  {
    id: 5,
    chapterNumber: '05',
    chapterTitle: 'WINDOWS TAMBIÉN ES HARDWARE',
    topic: 'Optimización y Servicios de Sistema',
    question: '¿Cuál es la regla de oro pericial antes de deshabilitar cualquier servicio o proceso en Windows?',
    options: [
      {
        text: 'Auditar su propósito exacto y dependencias en services.msc, midiendo su consumo real en reposo antes y después, en lugar de ejecutar scripts masivos de terceros.',
        isCorrect: true,
        rationale: 'La mayoría de servicios en estado "Manual" no consumen ciclos de reloj cuando no se usan; romperlos desestabiliza Windows a cambio de ganancia nula.',
      },
      {
        text: 'Borrar la carpeta System32 completa para ganar espacio.',
        isCorrect: false,
        rationale: 'Borrar componentes del sistema destruye el arranque de Windows de manera inmediata.',
      },
    ],
  },
  {
    id: 6,
    chapterNumber: '07',
    chapterTitle: 'LABORATORIO FINAL',
    topic: 'Protocolo Científico A/B',
    question: '¿Qué distingue una intervención pericial EVO de un mito o placebo informático?',
    options: [
      {
        text: 'El método comparativo A/B: registrar una línea base objetiva (A), aplicar una única modificación aislada, volver a medir en idénticas condiciones (B) y comparar deltas numéricos reales.',
        isCorrect: true,
        rationale: 'Si los números no muestran mejora estadística en percentiles o latencias, no hay optimización: solo hubo una ilusión sensorial.',
      },
      {
        text: 'Creer firmemente que la computadora anda más rápida porque se cambió el fondo de pantalla.',
        isCorrect: false,
        rationale: 'El lema fundamental de EVO LABS lo resume con claridad pericial: "No lo creas. Comprobalo."',
      },
    ],
  },
];

export const EvoTomo01FinalExam: React.FC<EvoTomo01FinalExamProps> = ({
  onBackToIndex,
  onGoToChapter,
  onCompleteExam,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('evo_tomo01_quiz_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('evo_tomo01_quiz_result'));
    } catch {
      return false;
    }
  });

  const [savedResult, setSavedResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
  } | null>(() => {
    try {
      const raw = localStorage.getItem('evo_tomo01_quiz_result');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const allAnswered = EXAM_QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSubmit = () => {
    let score = 0;
    EXAM_QUESTIONS.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        score += 1;
      }
    });

    const total = EXAM_QUESTIONS.length;
    const passed = score >= 5; // 5 out of 6 needed (83%)

    const resultData = {
      score,
      total,
      passed,
      date: new Date().toISOString(),
    };

    try {
      localStorage.setItem('evo_tomo01_quiz_result', JSON.stringify(resultData));
      localStorage.setItem('evo_tomo01_quiz_answers', JSON.stringify(selectedAnswers));
      if (passed) {
        localStorage.setItem('evo_tomo01_completed', 'true');
      }
    } catch {
      // ignore
    }

    setSavedResult(resultData);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onCompleteExam(score, total);
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    try {
      localStorage.removeItem('evo_tomo01_quiz_result');
      localStorage.removeItem('evo_tomo01_quiz_answers');
    } catch {
      // ignore
    }
    setSavedResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentScore = savedResult ? savedResult.score : 0;
  const isPassed = savedResult ? savedResult.passed : false;

  // Find missed chapters
  const missedQuestions = isSubmitted
    ? EXAM_QUESTIONS.filter((q) => {
        const selected = selectedAnswers[q.id];
        return selected === undefined || !q.options[selected]?.isCorrect;
      })
    : [];

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 text-[#f4f4f6]">
      {/* Top Header / Breadcrumbs */}
      <nav className="flex items-center justify-between pb-5 mb-8 border-b border-zinc-800/60 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
          <span>← VOLVER AL ÍNDICE DEL TOMO 01</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <span className="w-2 h-2 bg-yellow-400 inline-block" />
          <span className="tracking-widest uppercase text-white font-bold">
            TOMO 01 // EVALUACIÓN
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-yellow-400 font-semibold tracking-wider">PRUEBA FINAL EVO</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Title Banner */}
        <header className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#151720] via-[#10121a] to-[#0a0b10] border border-yellow-400/50 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 uppercase font-bold tracking-widest">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>CERTIFICACIÓN DE FUNDAMENTOS PERICIALES</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-tight">
            TOMO 01 // PRUEBA FINAL EVO
          </h1>

          <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
            Evaluá si incorporaste el razonamiento científico y los conceptos clave del Tomo 01:
            desde la lectura veraz del silicio hasta el diseño de un experimento A/B con telemetría.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono-tech text-zinc-400">
            <span>• 6 PREGUNTAS CLAVE</span>
            <span>• BASADO 100% EN TOMO 01</span>
            <span>• APROBACIÓN CON 5/6 O SUPERIOR</span>
          </div>
        </header>

        {/* Results Banner if Submitted */}
        {isSubmitted && savedResult && (
          <div
            className={`p-6 sm:p-8 rounded-2xl border-2 space-y-6 ${
              isPassed
                ? 'border-emerald-500/80 bg-emerald-950/20 text-emerald-100'
                : 'border-yellow-400/80 bg-yellow-950/20 text-yellow-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <span className="text-xs font-mono-tech font-bold uppercase tracking-widest opacity-80 block">
                  DICTAMEN TÉCNICO DE LA EVALUACIÓN
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
                  {isPassed ? 'COMPROBACIÓN SUPERADA' : 'TODAVÍA HAY CONCEPTOS PARA REPASAR'}
                </h2>
                <p className="font-sans-editorial text-sm opacity-90 max-w-2xl">
                  {isPassed
                    ? 'Has demostrado rigurosidad metodológica y comprensión sólida de los componentes, latencias y optimizaciones empíricas.'
                    : 'En EVO LABS no hay fracasos, hay diagnósticos. Los conceptos no fijados son datos que nos indican qué capítulos conviene releer.'}
                </p>
              </div>

              <div className="flex items-baseline gap-2 shrink-0 p-4 rounded-xl bg-black/50 border border-white/10">
                <span className="font-mono-tech font-black text-4xl sm:text-5xl text-yellow-400">
                  {currentScore}
                </span>
                <span className="font-mono-tech text-lg text-zinc-400 font-bold">
                  / {savedResult.total}
                </span>
              </div>
            </div>

            {/* List of Concepts to Review if any missed */}
            {missedQuestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono-tech uppercase font-bold tracking-widest text-yellow-400 block">
                  CONCEPTOS A REPASAR & CAPÍTULOS RELACIONADOS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {missedQuestions.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onGoToChapter(q.chapterNumber)}
                      className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 hover:border-yellow-400/60 transition-all text-left group cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="font-mono-tech text-[10px] text-yellow-400 uppercase font-bold block">
                          CAPÍTULO {q.chapterNumber} // {q.chapterTitle}
                        </span>
                        <span className="font-sans-editorial text-xs text-white font-medium block">
                          Tema: {q.topic}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Result Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleRetry}
                className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:border-yellow-400 font-mono-tech font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>REPETIR PRUEBA</span>
              </button>

              <button
                type="button"
                onClick={onBackToIndex}
                className="px-6 py-3 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 font-mono-tech font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>REPASAR CONTENIDO (ÍNDICE)</span>
              </button>

              {isPassed && (
                <button
                  type="button"
                  onClick={() => onCompleteExam(currentScore, savedResult.total)}
                  className="px-8 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xl hover:shadow-yellow-400/25 cursor-pointer transition-all ml-auto"
                >
                  <span>IR AL CIERRE DEL TOMO 01 →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Questions List */}
        <section aria-label="Preguntas de la prueba" className="space-y-6">
          {EXAM_QUESTIONS.map((q, idx) => {
            const selectedIdx = selectedAnswers[q.id];
            const hasSelected = selectedIdx !== undefined;

            return (
              <article
                key={q.id}
                className="p-6 rounded-2xl bg-[#10121a] border border-zinc-800/80 space-y-4 shadow-xl"
              >
                {/* Meta header */}
                <div className="flex items-center justify-between text-xs font-mono-tech pb-3 border-b border-zinc-850">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-yellow-400 font-bold">
                      0{idx + 1}
                    </span>
                    <span className="text-zinc-400 uppercase tracking-wider">
                      CAP {q.chapterNumber} • {q.topic}
                    </span>
                  </div>

                  {isSubmitted && hasSelected && (
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        q.options[selectedIdx]?.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {q.options[selectedIdx]?.isCorrect ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>CORRECTA</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>INCORRECTA</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Question Prompt */}
                <h3 className="font-sans-editorial font-bold text-base sm:text-lg text-white leading-snug">
                  {q.question}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selectedIdx === optIdx;
                    let optionStyle =
                      'border-zinc-800 bg-[#141620] text-zinc-300 hover:border-zinc-700 hover:bg-[#181a26]';

                    if (isSubmitted) {
                      if (opt.isCorrect) {
                        optionStyle =
                          'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-medium';
                      } else if (isOptionSelected && !opt.isCorrect) {
                        optionStyle =
                          'border-rose-500/80 bg-rose-950/40 text-rose-200 font-medium';
                      } else {
                        optionStyle = 'border-zinc-900 bg-black/30 text-zinc-600 opacity-60';
                      }
                    } else if (isOptionSelected) {
                      optionStyle =
                        'border-yellow-400 bg-yellow-400/10 text-white font-medium shadow';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-sans-editorial transition-all flex items-start gap-3.5 ${optionStyle} ${
                          isSubmitted ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono-tech">
                          {isOptionSelected ? '●' : String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Rationale if submitted */}
                {isSubmitted && hasSelected && (
                  <div className="mt-3 p-4 rounded-xl bg-black/40 border border-zinc-800 text-xs font-sans-editorial space-y-1">
                    <span className="font-mono-tech text-[10px] text-yellow-400 uppercase font-bold tracking-wider block">
                      DICTAMEN PEDAGÓGICO EVO:
                    </span>
                    <p className="text-zinc-300 leading-relaxed">
                      {q.options[selectedIdx]?.rationale}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        {/* Bottom Submission Action */}
        {!isSubmitted && (
          <div className="p-6 rounded-2xl bg-[#0f1016] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-xs">
            <span className="text-zinc-400">
              {!allAnswered
                ? `Te faltan responder ${
                    EXAM_QUESTIONS.filter((q) => selectedAnswers[q.id] === undefined).length
                  } preguntas.`
                : 'Todas las preguntas han sido respondidas. Listo para certificar.'}
            </span>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-8 py-3.5 rounded-xl font-mono-tech font-black text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 ${
                allAnswered
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-xl hover:shadow-yellow-400/25 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>FINALIZAR Y COMPROBAR EVALUACIÓN</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
