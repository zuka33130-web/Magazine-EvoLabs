import React, { useState } from 'react';
import {
  Cpu,
  Monitor,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { UserPcSpec } from '../../types';

interface Station03GraphicsProps {
  specs: UserPcSpec;
  onComplete: () => void;
  isCompleted: boolean;
}

export const Station03Graphics: React.FC<Station03GraphicsProps> = ({
  specs,
  onComplete,
  isCompleted,
}) => {
  const [frameStep, setFrameStep] = useState<number>(0);
  const [revealedWait, setRevealedWait] = useState<boolean>(false);

  const cpuText = specs.cpu?.trim() || 'tu CPU';
  const rawGpu = specs.gpu || '';
  const hasMultipleGpus = rawGpu.includes('/') || rawGpu.includes('\n') || rawGpu.includes(';');
  const gpuList = hasMultipleGpus
    ? rawGpu
        .split(/[\/\n;]+/)
        .map((g) => g.trim())
        .filter(Boolean)
    : [specs.gpu?.trim() || 'tu GPU'];

  const frameJourneySteps = [
    {
      actor: 'MOTOR DE JUEGO',
      title: '01. SIMULACIÓN & ENTRADA',
      desc: 'El motor calcula la posición de la cámara, los impactos de físicas y la inteligencia artificial de los objetos.',
    },
    {
      actor: 'CPU (PROCESADOR)',
      title: '02. PREPARACIÓN DE COMANDOS',
      desc: `${cpuText} compila la lista de llamadas de dibujo (Draw Calls) indicando qué mallas 3D y texturas pintar.`,
    },
    {
      actor: 'LÍNEAS PCIE / BUS',
      title: '03. ENVÍO DE DATOS Y BÚFERES',
      desc: 'Las órdenes, transformaciones de matrices y estados de shaders viajan a través del bus PCI Express hacia la GPU.',
    },
    {
      actor: 'GPU (RENDER)',
      title: '04. RASTERIZACIÓN Y SHADERS',
      desc: 'Los miles de núcleos de sombreado calculan iluminación, sombras, reflejos y colorean los píxeles en el framebuffer.',
    },
    {
      actor: 'FRAMEBUFFER / MONITOR',
      title: '05. ENTREGA VISUAL',
      desc: 'El cuadro completo se vuelca al buffer frontal y se transmite al cable de video a la frecuencia del monitor.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-xs font-mono-tech tracking-wider uppercase font-bold">
          <span>ESTACIÓN 03 // CPU + GPU</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase leading-tight">
          DOS PROCESADORES, DOS TRABAJOS
        </h2>

        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl">
          Tanto la CPU como la GPU son procesadores de silicio de extrema complejidad, pero están construidos con filosofías diametralmente opuestas: uno es un director de orquesta ultrarrápido; el otro, un ejército de miles de operarios coordinados.
        </p>
      </div>

      {/* Roles comparison: CPU vs GPU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Card */}
        <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <Cpu className="w-5 h-5" />
              <span className="font-mono-tech font-bold text-sm tracking-wider uppercase">
                CPU // EL GENERAL Y LA LÓGICA
              </span>
            </div>
            <span className="text-[10px] font-mono-tech text-zinc-400 uppercase">
              POCOS NÚCLEOS, MÁXIMA VELOCIDAD
            </span>
          </div>

          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
            En un videojuego o software interactivo, la CPU se encarga de:
          </p>

          <ul className="space-y-2 text-xs font-mono-tech text-zinc-200">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Lógica de la aplicación y respuesta a controles</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Simulación física y detección de colisiones</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Inteligencia artificial (IA) y comportamiento de NPCs</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Preparación de comandos gráficos (Draw Calls)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Gestión del mundo, audio e hilos del sistema</span>
            </li>
          </ul>
        </div>

        {/* GPU Card */}
        <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <Monitor className="w-5 h-5" />
              <span className="font-mono-tech font-bold text-sm tracking-wider uppercase">
                GPU // EL EJÉRCITO PARALELO
              </span>
            </div>
            <span className="text-[10px] font-mono-tech text-zinc-400 uppercase">
              MILES DE NÚCLEOS SIMD
            </span>
          </div>

          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Por su parte, la GPU se ocupa del trabajo matemático masivo:
          </p>

          <ul className="space-y-2 text-xs font-mono-tech text-zinc-200">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Transformación de geometrías y mallas de polígonos</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Ejecución de Vertex Shaders y Fragment / Pixel Shaders</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Mapeo, filtrado y compresión de texturas</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Rasterización: convertir vectores 3D en píxeles coloreados</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
              <span>Post-procesado, anti-aliasing y cálculo de iluminación</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-[11px] font-mono-tech text-zinc-400 text-center">
        * La división exacta del trabajo depende de la arquitectura de cada motor (Unreal, Unity, motores propios) y de la optimización del código.
      </div>

      {/* EL VIAJE DE UN FRAME (DIAGRAMA EDITORIAL) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-zinc-300">
            EL VIAJE DE UN FRAME // LA CADENA DE PRODUCCIÓN
          </span>
          <span className="text-[11px] font-mono-tech text-zinc-400">
            Paso a paso de cada imagen que ves en pantalla
          </span>
        </div>

        {/* Interactive Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs font-mono-tech">
          {frameJourneySteps.map((step, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFrameStep(idx)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                frameStep === idx
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold shadow-md'
                  : 'bg-black/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider block opacity-70 mb-1">
                {step.actor}
              </span>
              <span className="text-xs uppercase block font-bold leading-tight">
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Current Step Explanation */}
        <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
          <div className="text-yellow-400 font-mono-tech text-xs uppercase font-bold">
            {frameJourneySteps[frameStep].title} — {frameJourneySteps[frameStep].actor}
          </div>
          <p className="font-sans-editorial text-sm text-zinc-200 leading-relaxed">
            {frameJourneySteps[frameStep].desc}
          </p>
        </div>

        {/* LA PREGUNTA CRUCIAL: ¿QUÉ PASA SI UNO TERMINA ANTES QUE EL OTRO? */}
        <div className="p-5 sm:p-6 rounded-xl bg-zinc-950 border border-yellow-400/40 space-y-4">
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono-tech font-bold uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>LA PREGUNTA CRUCIAL DE LA ARQUITECTURA</span>
          </div>

          <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
            “¿QUÉ PASA SI LA CPU O LA GPU TERMINA SU TRABAJO ANTES QUE EL OTRO?”
          </h3>

          {!revealedWait ? (
            <button
              type="button"
              onClick={() => setRevealedWait(true)}
              className="px-5 py-2.5 rounded-lg bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 cursor-pointer transition-colors shadow"
            >
              REVELAR LA RESPUESTA
            </button>
          ) : (
            <div className="p-4 rounded-lg bg-black/80 border border-yellow-400/60 space-y-2 animate-in fade-in duration-300">
              <span className="font-mono-tech font-black text-2xl text-yellow-400 tracking-wider uppercase block">
                ESPERA.
              </span>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Si la CPU tarda 16 milisegundos en preparar el fotograma y la GPU tarda sólo 6 milisegundos en dibujarlo, la GPU se queda <strong>10 milisegundos sin nada que hacer</strong>, esperando que la CPU le envíe nuevas órdenes.
                <br />
                A la inversa, si la GPU tarda 25 milisegundos en renderizar una escena compleja en 4K, la CPU no puede continuar enviando fotogramas indefinidamente sin desbordar las colas de memoria, por lo que entra en un estado de espera (<em>wait for vsync/render</em>).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DESCUBRIMIENTO 02 // PORCENTAJES ENGAÑOSOS */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-yellow-400/10 via-zinc-900 to-black border-2 border-yellow-400/70 space-y-4">
        <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono-tech tracking-widest uppercase font-bold">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>DESCUBRIMIENTO 02 // LA TRAMPA DE LOS PORCENTAJES GLOBALES</span>
        </div>

        <div className="space-y-3 font-display font-black text-lg sm:text-xl md:text-2xl text-white uppercase tracking-tight">
          <p className="border-l-4 border-yellow-400 pl-4 py-1">
            “UNA GPU AL 60 % NO DEMUESTRA POR SÍ SOLA QUE LA GPU SEA EL PROBLEMA.”
          </p>
          <p className="border-l-4 border-yellow-400 pl-4 py-1">
            “UNA CPU AL 35 % TAMPOCO DEMUESTRA QUE LE SOBRE POTENCIA.”
          </p>
        </div>

        <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2 text-xs font-mono-tech text-zinc-300">
          <span className="text-yellow-400 font-bold uppercase block text-[11px]">¿POR QUÉ OCURRE ESTO?</span>
          <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
            Windows y el Administrador de tareas calculan el uso de CPU como un promedio matemático de todos los hilos del procesador. Si tenés una CPU de 8 núcleos y 16 hilos, y el hilo principal del juego (el <em>main render thread</em>) está saturado al 100% en un solo núcleo, el uso global reportado en pantalla puede ser apenas del <strong>25% al 35%</strong>, a pesar de que el juego no pueda dar un solo fotograma más porque ese núcleo ya no da abasto.
          </p>
        </div>
      </div>

      {/* INTEGRADA VS DEDICADA & MULTI-GPU */}
      <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <span className="font-mono-tech text-xs uppercase font-bold text-white tracking-wider">
            CONFIGURACIÓN GRÁFICA DE TU PC // INTEGRADA VS DEDICADA
          </span>
          <span className="text-[10px] font-mono-tech text-yellow-400 uppercase">
            {gpuList.length > 1 ? `${gpuList.length} GPUS IDENTIFICADAS` : 'UNIDAD GRÁFICA'}
          </span>
        </div>

        {gpuList.length > 1 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gpuList.map((gpuName, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1 text-xs font-mono-tech">
                  <span className="text-yellow-400 font-bold block text-[10px] uppercase">
                    GPU {idx}
                  </span>
                  <span className="text-white font-bold block truncate">{gpuName}</span>
                </div>
              ))}
            </div>
            <p className="font-sans-editorial text-xs text-zinc-400 italic">
              * En sistemas con gráficos híbridos (típico en notebooks con procesador Intel/AMD y GPU NVIDIA dedicada), una GPU maneja el escritorio de bajo consumo y la otra toma los juegos pesados. Más adelante investigaremos cuál trabaja en cada aplicación.
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono-tech text-zinc-300">
            <span className="text-zinc-500 uppercase text-[10px] block">DISPOSITIVO GRÁFICO REGISTRADO:</span>
            <span className="text-white font-bold">{gpuList[0]}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-mono-tech">
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-white font-bold block uppercase text-[10px]">GPU DEDICADA</span>
            <p className="font-sans-editorial text-zinc-300 text-xs leading-relaxed">
              Posee su propio silicio independiente y memoria gráfica ultrarrápida propia (VRAM GDDR6/GDDR6X) conectada a través de un bus dedicado de alto ancho de banda (128 a 384 bits).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-white font-bold block uppercase text-[10px]">GPU INTEGRADA</span>
            <p className="font-sans-editorial text-zinc-300 text-xs leading-relaxed">
              Comparte el mismo silicio que la CPU y utiliza la memoria RAM del sistema, requiriendo que CPU y gráficos coordinen su acceso al mismo bus de datos.
            </p>
          </div>
        </div>
      </div>

      {/* Advance Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <div className="text-xs font-mono-tech text-zinc-400">
          Ya entendés la sincronización entre CPU y gráficos. Ahora: ¿de dónde nacieron esos datos?
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-white text-black hover:bg-yellow-400 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group shrink-0"
        >
          <span>{isCompleted ? 'REVISADO • AVANZAR A ALMACENAMIENTO' : 'SEGUIR EL FLUJO: ALMACENAMIENTO + RAM'}</span>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
