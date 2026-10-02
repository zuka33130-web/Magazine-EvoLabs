import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  BookOpen,
  Layers,
  Activity,
  CheckCircle2,
  Award,
  FlaskConical,
  Eye,
  Check,
} from 'lucide-react';

interface TutorTomo01TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishTour: () => void;
  onStartChapter01?: () => void;
}

interface TourStop {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  whatIs: string;
  whatFor: string;
  whatToDo: string;
  tip: string;
  icon: React.ElementType;
  badgeColor: string;
}

const TOUR_STOPS: TourStop[] = [
  {
    id: 'portada',
    number: '01 / 09',
    name: 'PORTADA DEL TOMO',
    subtitle: 'La presentación oficial y acceso a los 3 modos',
    whatIs: 'Es la portada editorial de "TOMO 01 // CONOCÉ TU PC", con el manifiesto y el resumen del tomo.',
    whatFor: 'Te permite entender la tesis pedagógica y elegir si querés leer el Magazine A4 descargable, entrar al Tomo Interactivo o al Laboratorio.',
    whatToDo: 'Hacé clic en "ABRIR TOMO INTERACTIVO" para comenzar tu formación guiada paso a paso.',
    tip: 'Podés descargar el PDF en cualquier momento para guardarlo en tu biblioteca offline.',
    icon: BookOpen,
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
  },
  {
    id: 'indice',
    number: '02 / 09',
    name: 'ÍNDICE DE 7 CAPÍTULOS',
    subtitle: 'El mapa de ruta correlativo',
    whatIs: 'La lista de los 7 capítulos estructurados en secuencia lógica desde lo más básico hasta el análisis avanzado.',
    whatFor: 'Evita que saltes pasos indispensables: cada capítulo completado desbloquea el siguiente de forma natural.',
    whatToDo: 'Comenzá siempre por el Capítulo 01. Los capítulos con candado se desbloquean al completar la comprobación del anterior.',
    tip: 'Podés ver el estado de cada capítulo: TERMINADO ✓, EN CURSO o DISPONIBLE.',
    icon: Layers,
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
  },
  {
    id: 'capitulos',
    number: '03 / 09',
    name: 'CAPÍTULOS INTERACTIVOS',
    subtitle: 'El espacio de aprendizaje guiado',
    whatIs: 'El núcleo de cada capítulo, donde la teoría se explica de manera clara, visual y sin dar nada por entendido.',
    whatFor: 'Aprender cómo funciona el silicio, la memoria, la placa madre y los sistemas sin aburrirte ni perderte.',
    whatToDo: 'Leé los bloques temáticos, navegá las estaciones didácticas y consultá los términos que no conozcas.',
    tip: 'Si encontrás una palabra difícil, hacé clic en [? ¿QUÉ ES?] para ver su significado simple.',
    icon: BookOpen,
    badgeColor: 'text-yellow-400 border-yellow-500/40 bg-yellow-950/40',
  },
  {
    id: 'visuales',
    number: '04 / 09',
    name: 'VISUALES Y TELEMETRÍA DIDÁCTICA',
    subtitle: 'Esquemas interactivos explicados',
    whatIs: 'Gráficos interactivos de silicio, frecuencias de reloj, voltajes y líneas de tiempo de cuadros (frametimes).',
    whatFor: 'Ver con tus propios ojos lo que pasa adentro de la máquina en lugar de imaginarlo a ciegas.',
    whatToDo: 'Tutor EVO te indicará: "MIRÁ ACÁ" (elemento clave), "BUSCÁ ESTO" y "ESTO SIGNIFICA".',
    tip: 'Podés tocar los controles de simulación para ver cómo cambian los números en vivo.',
    icon: Eye,
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
  },
  {
    id: 'practicas',
    number: '05 / 09',
    name: 'PRÁCTICAS PASO A PASO',
    subtitle: 'Ejercicios reales de una acción a la vez',
    whatIs: 'Talleres prácticos donde aplicás lo aprendido en tu propia computadora o en simuladores seguros.',
    whatFor: 'Aprender a auditar procesador, memoria y discos sin miedo a romper o desconfigurar nada.',
    whatToDo: 'Seguí el "PASO 1 DE X", realizá la acción indicada y hacé clic en continuar cuando estés listo.',
    tip: 'Al terminar, Tutor EVO te ayudará a interpretar si tu resultado es el esperado.',
    icon: Activity,
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
  },
  {
    id: 'comprobaciones',
    number: '06 / 09',
    name: 'COMPROBACIONES DE CAPÍTULO',
    subtitle: 'Autoevaluación inmediata para afianzar',
    whatIs: 'Una pequeña comprobación interactiva al final de cada capítulo para verificar que entendiste los conceptos.',
    whatFor: 'Confirmar tu aprendizaje antes de avanzar y desbloquear formalmente el siguiente capítulo.',
    whatToDo: 'Respondé la pregunta. Si te equivocás, Tutor EVO te da una pista y te explica por qué sin penalizarte.',
    tip: 'El objetivo es aprender y razonar, no memorizar de memoria.',
    icon: CheckCircle2,
    badgeColor: 'text-teal-400 border-teal-500/40 bg-teal-950/40',
  },
  {
    id: 'progreso',
    number: '07 / 09',
    name: 'MI PROGRESO & PASAPORTE TÉCNICO',
    subtitle: 'Tu expediente real de aprendizaje',
    whatIs: 'El panel que registra los capítulos terminados, los datos reales de tu máquina y tu historial.',
    whatFor: 'Tener una constancia fidedigna de tus competencias sin inventar porcentajes falsos.',
    whatToDo: 'Consultá tu pasaporte para ver el resumen de tu hardware identificado y tus logros periciales.',
    tip: 'Tus avances quedan guardados automáticamente en tu navegador.',
    icon: Award,
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
  },
  {
    id: 'examen',
    number: '08 / 09',
    name: 'EXAMEN FINAL INTERACTIVO',
    subtitle: 'Comprobación de 15 preguntas periciales',
    whatIs: 'La evaluación final del Tomo con 15 preguntas variadas (diagramas, casos de taller, secuencias y lógica).',
    whatFor: 'Obtener la distinción oficial "TEORÍA COMPROBADA" del Tomo 01.',
    whatToDo: 'Leé cada consigna con tranquilidad, revisá tus respuestas antes de entregar y analizá la devolución.',
    tip: 'Podés rendir el examen tantas veces como quieras para perfeccionar tus conocimientos.',
    icon: Award,
    badgeColor: 'text-yellow-400 border-yellow-500/40 bg-yellow-950/40',
  },
  {
    id: 'laboratorio',
    number: '09 / 09',
    name: 'LABORATORIO ASOCIADO',
    subtitle: 'Banco virtual de hardware e intercambio libre',
    whatIs: 'El Laboratorio Virtual de Identidad y Hardware exclusivo del Tomo 01.',
    whatFor: 'Intercambiar procesadores, placas de video y memorias en una PC virtual para experimentar cuellos de botella.',
    whatToDo: 'Armá configuraciones extremas, observá la telemetría y comprobá empíricamente la teoría.',
    tip: 'Es la tercera fase del Método EVO: "Experimentar y diagnosticar".',
    icon: FlaskConical,
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
  },
];

export const TutorTomo01TourModal: React.FC<TutorTomo01TourModalProps> = ({
  isOpen,
  onClose,
  onFinishTour,
  onStartChapter01,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentStop = TOUR_STOPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STOPS.length - 1;
  const StopIcon = currentStop.icon;

  const handleNext = () => {
    if (isLast) {
      onFinishTour();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tour Real de la Interfaz - Tutor EVO"
      className="fixed inset-0 z-[145] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 font-sans-editorial select-none"
    >
      <div className="bg-[#0b0f19] border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Top Bar: Progress & Close */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-mono font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>TOUR REAL DE LA INTERFAZ</span>
            </span>
            <span className="text-zinc-600 font-mono text-xs">•</span>
            <span className="text-zinc-400 font-mono text-xs font-bold">
              {currentStop.number}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
          >
            Omitir Tour
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex gap-1.5 mb-6 shrink-0">
          {TOUR_STOPS.map((stop, idx) => (
            <button
              key={stop.id}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex-1 h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                  : idx < currentStepIndex
                  ? 'bg-amber-400/50'
                  : 'bg-zinc-800'
              }`}
              title={`Ir a parada: ${stop.name}`}
            />
          ))}
        </div>

        {/* Tour Stop Card */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${currentStop.badgeColor}`}
            >
              <StopIcon className="w-6 h-6" />
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-wider uppercase block">
                PARADA {currentStepIndex + 1} DE {TOUR_STOPS.length}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {currentStop.name}
              </h3>
              <p className="text-xs text-amber-300 font-mono font-semibold">
                {currentStop.subtitle}
              </p>
            </div>
          </div>

          {/* 3 Core Points */}
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
              <strong className="text-amber-400 font-mono text-[11px] block uppercase">
                ¿QUÉ ES?
              </strong>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
                {currentStop.whatIs}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
              <strong className="text-cyan-400 font-mono text-[11px] block uppercase">
                ¿PARA QUÉ SIRVE?
              </strong>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
                {currentStop.whatFor}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
              <strong className="text-emerald-400 font-mono text-[11px] block uppercase">
                ¿QUÉ HACÉS AHÍ?
              </strong>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
                {currentStop.whatToDo}
              </p>
            </div>
          </div>

          {/* Tutor Pro Tip Box */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-mono text-[11px]">CONSEJO DE TUTOR EVO: </strong>
              <span>{currentStop.tip}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-5 mt-4 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isFirst
                ? 'text-zinc-600 bg-zinc-900/40 cursor-not-allowed border border-transparent'
                : 'text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ANTERIOR</span>
          </button>

          <div className="flex items-center gap-2">
            {!isLast ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>SIGUIENTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onFinishTour();
                  if (onStartChapter01) onStartChapter01();
                }}
                className="px-6 py-2.5 rounded-xl font-black text-xs text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 animate-pulse"
              >
                <span>COMENZAR CAPÍTULO 01</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
