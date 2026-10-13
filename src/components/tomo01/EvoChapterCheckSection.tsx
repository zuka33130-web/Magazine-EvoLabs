import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, Check, X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export interface ChapterCheckQuestion {
  id: string;
  prompt: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface EvoChapterCheckSectionProps {
  chapterNumber: string; // '01' to '07'
  chapterTitle: string;
  onPassCheck?: () => void;
  isAlreadyCompleted?: boolean;
}

const CHAPTER_CHECKS: Record<string, ChapterCheckQuestion[]> = {
  '01': [
    {
      id: 'c01-q1',
      prompt: '¿Por qué la cantidad de memoria de una GPU (ej. 8 GB vs 12 GB) no indica por sí sola qué tan potente es?',
      options: [
        {
          label: 'Porque el rendimiento depende de la arquitectura del silicio, núcleos de cómputo y ancho de banda del bus, no solo de la capacidad del búfer de texturas.',
          isCorrect: true,
          explanation: '¡Exacto! El tamaño en GB solo indica cuántas texturas caben a la vez; la velocidad real la determinan los núcleos de cómputo (Shaders/SM), frecuencias y ancho de banda.',
        },
        {
          label: 'Porque la memoria de la GPU se comparte automáticamente con la RAM de la placa base sin límite alguno.',
          isCorrect: false,
          explanation: 'La memoria dedicada (VRAM) es física y separada. Compartir con RAM del sistema a través del bus PCIe es una medida de emergencia que degrada fuertemente la velocidad.',
        },
        {
          label: 'Porque la potencia la define exclusivamente la marca de la computadora y la fuente de alimentación.',
          isCorrect: false,
          explanation: 'La fuente alimenta energía pero el silicio y su diseño interno ejecutan las instrucciones matemáticas.',
        },
      ],
    },
    {
      id: 'c01-q2',
      prompt: 'En Windows, ¿en qué herramienta nativa podés verificar sin instalar nada el modelo real de CPU, cantidad de núcleos físicos, lógicos y velocidad actual?',
      options: [
        {
          label: 'Administrador de tareas → pestaña Rendimiento → CPU (o comando Get-CimInstance en PowerShell).',
          isCorrect: true,
          explanation: '¡Correcto! El Administrador de Tareas expone telemetría directa del kernel con zócalos, núcleos físicos y procesadores lógicos activos.',
        },
        {
          label: 'En el Bloc de notas abriendo cualquier archivo ejecutable.',
          isCorrect: false,
          explanation: 'Un editor de texto no tiene conexión con los sensores ni el kernel del hardware.',
        },
        {
          label: 'En la papelera de reciclaje presionando propiedades.',
          isCorrect: false,
          explanation: 'La papelera solo administra archivos eliminados en los sistemas de archivos NTFS.',
        },
      ],
    },
  ],
  '02': [
    {
      id: 'c02-q1',
      prompt: 'Cuando abrís un juego o programa pesado, ¿cuál es el orden real en que viajan los datos antes de aparecer en pantalla?',
      options: [
        {
          label: 'Almacenamiento (SSD/HDD) → Memoria RAM → CPU (prepara geometrías y lógica) → GPU (renderiza píxeles) → Monitor.',
          isCorrect: true,
          explanation: '¡Correcto! El disco es lento y retiene datos; la RAM los aloja para acceso veloz; la CPU decide qué se muestra y la GPU dibuja los fotogramas finales.',
        },
        {
          label: 'Monitor → GPU → RAM → Almacenamiento.',
          isCorrect: false,
          explanation: 'El flujo de salida va hacia el monitor; el monitor recibe la señal final de video procesada.',
        },
        {
          label: 'Directamente del SSD a los píxeles del monitor sin pasar por la CPU ni por la memoria RAM.',
          isCorrect: false,
          explanation: 'El almacenamiento secundario carece de la velocidad y lógica para dibujar directamente en un display.',
        },
      ],
    },
    {
      id: 'c02-q2',
      prompt: '¿Por qué un SSD NVMe ultra veloz no compensa tener poca memoria RAM si el sistema se queda sin espacio en memoria?',
      options: [
        {
          label: 'Porque incluso el SSD NVMe más rápido opera en microsegundos, mientras la RAM opera en nanosegundos (miles de veces más rápida).',
          isCorrect: true,
          explanation: '¡Exacto! Cuando Windows acude al archivo de paginación en disco para suplir RAM, la latencia se dispara y surgen congelamientos notorios (stutter).',
        },
        {
          label: 'Porque el SSD se desconecta eléctricamente cuando se llena la RAM.',
          isCorrect: false,
          explanation: 'El SSD sigue encendido, pero la diferencia abismal de latencias provoca la pérdida de fluidez.',
        },
      ],
    },
  ],
  '03': [
    {
      id: 'c03-q1',
      prompt: 'Un juego reporta "120 FPS promedio" pero se siente entrecortado y con tirones molestos. ¿Qué métrica explica la verdad técnica?',
      options: [
        {
          label: 'El percentil 1% Low y la estabilidad de frametimes en milisegundos (ms).',
          isCorrect: true,
          explanation: '¡Correcto! El promedio oculta caídas abruptas. Si 115 cuadros tardan 6 ms pero 5 cuadros tardan 90 ms, el ojo humano percibe tirones evidentes.',
        },
        {
          label: 'La cantidad de ventiladores que tiene el gabinete girando.',
          isCorrect: false,
          explanation: 'La refrigeración afecta las temperaturas sostenidas, pero la métrica objetiva de fluidez es el frametime.',
        },
      ],
    },
    {
      id: 'c03-q2',
      prompt: 'Para una experiencia a 60 FPS perfectamente uniforme, ¿cuántos milisegundos exactos debe tardar cada fotograma en entregarse?',
      options: [
        {
          label: '16.6 ms continuos por cada cuadro (1000 ms ÷ 60 cuadros).',
          isCorrect: true,
          explanation: '¡Exacto! 1000 ms dividido 60 cuadros da exactamente 16.66 ms. Una línea plana a 16.6 ms es el ideal de fluidez absoluta en 60 Hz.',
        },
        {
          label: '50 ms continuos por cada cuadro.',
          isCorrect: false,
          explanation: '50 ms por cuadro equivalen a solo 20 FPS (1000 ÷ 50 = 20), lo que resulta en una experiencia muy entrecortada.',
        },
      ],
    },
  ],
  '04': [
    {
      id: 'c04-q1',
      prompt: 'Si al jugar la GPU está al 99% de uso continuo y la CPU al 38%, ¿cuál es el componente que está determinando el techo de rendimiento actual?',
      options: [
        {
          label: 'La GPU (el procesador gráfico está entregando su máximo potencial para la resolución y calidad seleccionadas).',
          isCorrect: true,
          explanation: '¡Correcto! El 99% en GPU significa que el procesador gráfico es el factor limitante (y el escenario ideal en juegos exigentes para aprovechar la inversión).',
        },
        {
          label: 'La CPU está rota porque solo llega al 38%.',
          isCorrect: false,
          explanation: 'La CPU solo necesita procesar la física y llamadas de dibujo; si la GPU no puede pintar más rápido, la CPU se queda esperando sin saturarse.',
        },
      ],
    },
    {
      id: 'c04-q2',
      prompt: '¿Cómo comprobás con método científico si tu límite actual es de CPU o de GPU sin gastar dinero en piezas nuevas?',
      options: [
        {
          label: 'Bajando drásticamente la resolución gráfica (ej. de 1080p a 720p): si los FPS suben proporcionalmente, limitaba la GPU; si los FPS se quedan iguales, limitaba la CPU.',
          isCorrect: true,
          explanation: '¡Excelente razonamiento pericial! Bajar la resolución alivia el trabajo de píxeles de la GPU pero mantiene intacta la carga de lógica y llamadas en la CPU.',
        },
        {
          label: 'Cambiando la fuente de poder por una de 1200 Watts para ver qué pasa.',
          isCorrect: false,
          explanation: 'Cambiar hardware al azar sin aislar variables viola el principio fundamental de EVO LABS: no suponemos, medimos.',
        },
      ],
    },
  ],
  '05': [
    {
      id: 'c05-q1',
      prompt: '¿Cuál es el peligro de usar "optimizadores" mágicos o scripts de internet que desactivan docenas de servicios de Windows a ciegas?',
      options: [
        {
          label: 'Pueden romper dependencias críticas del sistema (impresión, audio, actualizaciones, red, perfiles) ahorrando apenas megabytes insignificantes de memoria.',
          isCorrect: true,
          explanation: '¡Exacto! Los servicios en reposo no consumen ciclos de cómputo salvo que sean invocados; apagarlos a ciegas rompe subsistemas de Windows.',
        },
        {
          label: 'Que Windows se transforme en una consola de juegos antigua.',
          isCorrect: false,
          explanation: 'Windows sigue siendo un sistema operativo NT de propósito general con miles de llamadas cruzadas.',
        },
      ],
    },
    {
      id: 'c05-q2',
      prompt: '¿Qué herramienta nativa del Administrador de tareas permite auditar qué aplicaciones se ejecutan automáticamente cada vez que encendés tu equipo?',
      options: [
        {
          label: 'La pestaña "Aplicaciones de inicio" (Startup apps) con su columna de Impacto en el inicio.',
          isCorrect: true,
          explanation: '¡Correcto! Te muestra exactamente qué binarios se ejecutan al iniciar sesión y el impacto que tienen en el tiempo de arranque.',
        },
        {
          label: 'El reproductor de Windows Media.',
          isCorrect: false,
          explanation: 'Ese software reproduce audio y video, no administra la inicialización de procesos en el registro del sistema.',
        },
      ],
    },
  ],
  '06': [
    {
      id: 'c06-q1',
      prompt: 'Una computadora se apaga de golpe a los 10 minutos de empezar a exigirle carga térmica. ¿Cuál es el primer paso según la metodología deductiva EVO?',
      options: [
        {
          label: 'Medir telemetría de temperaturas con sensores (HWiNFO / MSI Afterburner) para verificar si la CPU o GPU alcanzan el umbral de estrangulamiento térmico (Thermal Throttling / TJMax).',
          isCorrect: true,
          explanation: '¡Correcto! Observar y medir la evidencia térmica antes de formular conjeturas o sustituir componentes.',
        },
        {
          label: 'Comprar una placa madre nueva de inmediato.',
          isCorrect: false,
          explanation: 'Nunca se reemplazan piezas caras sin haber diagnosticado y aislado la causa raíz con mediciones.',
        },
      ],
    },
    {
      id: 'c06-q2',
      prompt: '¿Cuál es la diferencia entre un "síntoma" y la "causa raíz" en diagnóstico informático?',
      options: [
        {
          label: 'El síntoma es lo visible (ej. pantalla azul o reinicio), mientras que la causa raíz es el origen físico o lógico real (ej. pasta térmica degradada, driver corrupto o capacitor seco).',
          isCorrect: true,
          explanation: '¡Exacto! Atacar el síntoma sin corregir la causa hace que la falla reaparezca indefectiblemente.',
        },
        {
          label: 'Son exactamente lo mismo; cualquier anomalía es la causa.',
          isCorrect: false,
          explanation: 'Confundir síntoma con causa es el error más recurrente de los aficionados.',
        },
      ],
    },
  ],
  '07': [
    {
      id: 'c07-q1',
      prompt: 'En un experimento de optimización científica A/B, ¿por qué es una regla estricta modificar únicamente UNA variable a la vez?',
      options: [
        {
          label: 'Porque si modificás dos o más cosas al mismo tiempo (ej. driver y resolución y perfil de energía), es imposible saber cuál provocó el cambio en los resultados.',
          isCorrect: true,
          explanation: '¡Absolutamente! Si tocás varias variables en simultáneo, perdés el control del experimento y no podés atribuir causa y efecto con rigor.',
        },
        {
          label: 'Porque Windows se bloquea si se cambia más de un ajuste en el mismo día.',
          isCorrect: false,
          explanation: 'Windows lo permite sin problemas, pero el método científico pierde toda validez estadística.',
        },
      ],
    },
    {
      id: 'c07-q2',
      prompt: 'Si tras aplicar una supuesta "optimización" tu medición B muestra exactamente los mismos FPS y frametimes que la línea base A, ¿qué dictamina el método EVO?',
      options: [
        {
          label: 'Revertir el cambio a su estado original para no agregar capas innecesarias de modificación que no aportan beneficio medible.',
          isCorrect: true,
          explanation: '¡Totalmente! Si no hay mejora demostrable en las métricas objetivas, el ajuste no aportó nada y debe revertirse. No lo creas: comprobalo.',
        },
        {
          label: 'Dejar el cambio porque "seguro en el fondo mejoró algo aunque no se vea en los números".',
          isCorrect: false,
          explanation: 'En EVO LABS no nos guiamos por sensaciones ni fe ciega: nos guiamos por evidencia empírica contrastada.',
        },
      ],
    },
  ],
};

export const EvoChapterCheckSection: React.FC<EvoChapterCheckSectionProps> = ({
  chapterNumber,
  chapterTitle,
  onPassCheck,
  isAlreadyCompleted = false,
}) => {
  const questions = CHAPTER_CHECKS[chapterNumber] || [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState<boolean>(isAlreadyCompleted);

  if (questions.length === 0) {
    return null;
  }

  const handleSelect = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);
  const allCorrect = questions.every((q) => {
    const selectedIdx = selectedAnswers[q.id];
    return selectedIdx !== undefined && q.options[selectedIdx]?.isCorrect;
  });

  const handleVerify = () => {
    setShowFeedback(true);
    if (allCorrect && onPassCheck) {
      onPassCheck();
    }
  };

  return (
    <section
      aria-label="Comprobá lo que aprendiste"
      className="mt-12 rounded-2xl border-2 border-yellow-400/40 bg-[#0e1017] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 uppercase font-bold tracking-widest">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>COMPROBÁ LO QUE APRENDISTE // CAPÍTULO {chapterNumber}</span>
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
            OBSERVAR → RAZONAR → COMPROBAR
          </h3>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300">
            En EVO LABS no pasamos de página sin validar la comprensión de los fundamentos técnicos.
          </p>
        </div>

        {isAlreadyCompleted && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-tech uppercase font-bold tracking-widest bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 self-start sm:self-auto">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>COMPROBACIÓN REGISTRADA</span>
          </span>
        )}
      </div>

      {/* Questions Stream */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selectedOptionIdx = selectedAnswers[q.id];
          const hasSelected = selectedOptionIdx !== undefined;

          return (
            <div
              key={q.id}
              className="p-5 rounded-xl bg-black/40 border border-zinc-800/80 space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono-tech text-xs text-yellow-400 font-bold shrink-0 mt-0.5">
                  0{qIdx + 1}
                </span>
                <h4 className="font-sans-editorial font-bold text-sm sm:text-base text-white leading-snug">
                  {q.prompt}
                </h4>
              </div>

              <div className="space-y-2.5 pt-1 pl-0 sm:pl-9">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selectedOptionIdx === optIdx;
                  let optionClass =
                    'border-zinc-800 bg-[#12141c] text-zinc-300 hover:border-zinc-700 hover:bg-[#151822]';

                  if (showFeedback && isThisSelected) {
                    if (opt.isCorrect) {
                      optionClass = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200';
                    } else {
                      optionClass = 'border-rose-500/80 bg-rose-950/40 text-rose-200';
                    }
                  } else if (isThisSelected) {
                    optionClass = 'border-yellow-400 bg-yellow-400/10 text-white font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-sans-editorial transition-all cursor-pointer flex items-start gap-3 ${optionClass}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono-tech">
                        {isThisSelected ? '●' : String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed flex-1">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant feedback explanation */}
              {showFeedback && hasSelected && (
                <div
                  className={`mt-3 p-3.5 rounded-xl text-xs font-sans-editorial leading-relaxed border ${
                    q.options[selectedOptionIdx]?.isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <p className="font-mono-tech text-[11px] font-bold uppercase tracking-wider mb-1">
                    {q.options[selectedOptionIdx]?.isCorrect
                      ? '✓ RAZONAMIENTO CORRECTO'
                      : '⚠ DATO PARA REVISAR'}
                  </p>
                  <p>{q.options[selectedOptionIdx]?.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Verification Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-zinc-850">
        <span className="text-xs font-mono-tech text-zinc-400">
          {!allAnswered
            ? 'Respondé todas las preguntas para comprobar tu aprendizaje.'
            : allCorrect && showFeedback
            ? '¡Comprobación superada con éxito! Fundamentos asimilados.'
            : 'Revisá tus respuestas y presioná Comprobar.'}
        </span>

        <button
          type="button"
          onClick={handleVerify}
          disabled={!allAnswered}
          className={`px-6 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center justify-center gap-2 ${
            allAnswered
              ? 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-xl'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>COMPROBAR RESPUESTAS</span>
        </button>
      </div>
    </section>
  );
};
