import React, { useState } from 'react';
import {
  AlertTriangle,
  Cpu,
  Gauge,
  HelpCircle,
  CheckCircle2,
  Info,
  Sliders,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface CoreLoad {
  coreId: number;
  label: string;
  usage: number;
  isMainThread?: boolean;
}

export const Station01WrongSuspect: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'single_thread' | 'multithread' | 'gpu_heavy'>('single_thread');

  // Realistic educational core data per scenario for an 8-core CPU (Datos simulados)
  const scenariosData = {
    single_thread: {
      title: 'Juego Esports / Motor Monohilo (ej. Simulación CS2 / Valorant)',
      description: 'El bucle principal del juego y el hilo de renderizado concentran gran parte del trabajo secuencial en un núcleo lógico.',
      cores: [
        { coreId: 0, label: 'Núcleo 0 (Hilo Principal)', usage: 98, isMainThread: true },
        { coreId: 1, label: 'Núcleo 1 (Render API)', usage: 48 },
        { coreId: 2, label: 'Núcleo 2 (Audio & IO)', usage: 22 },
        { coreId: 3, label: 'Núcleo 3 (Física simple)', usage: 18 },
        { coreId: 4, label: 'Núcleo 4 (Fondo Windows)', usage: 12 },
        { coreId: 5, label: 'Núcleo 5 (Inactivo)', usage: 8 },
        { coreId: 6, label: 'Núcleo 6 (Inactivo)', usage: 6 },
        { coreId: 7, label: 'Núcleo 7 (Inactivo)', usage: 5 },
      ],
      totalCpu: 27,
      gpuUsage: 58,
      fps: 135,
      verdictTitle: 'INDICIO FUERTE DE LIMITACIÓN EN HILO DE CPU',
      verdictText: 'El Administrador de Tareas dice "CPU al 27%". El promedio global oculta que un hilo crítico está operando cerca de su techo (~98%). Esto constituye un indicio fuerte de limitación del lado CPU bajo estas condiciones, obligando a la GPU a registrar momentos de espera.',
      badgeColor: 'border-amber-500/60 text-amber-400 bg-amber-500/10',
    },
    multithread: {
      title: 'Motor Moderno Multihilo (ej. Simulación Cyberpunk / Unreal Engine)',
      description: 'El motor divide tareas de animación, física, streaming y comandos gráficos entre múltiples procesadores lógicos de forma distribuida.',
      cores: [
        { coreId: 0, label: 'Núcleo 0 (Frame Coordinator)', usage: 82 },
        { coreId: 1, label: 'Núcleo 1 (Render Worker 1)', usage: 78 },
        { coreId: 2, label: 'Núcleo 2 (Render Worker 2)', usage: 74 },
        { coreId: 3, label: 'Núcleo 3 (Physics Solver)', usage: 71 },
        { coreId: 4, label: 'Núcleo 4 (Asset Decomp)', usage: 69 },
        { coreId: 5, label: 'Núcleo 5 (Audio Spatial)', usage: 65 },
        { coreId: 6, label: 'Núcleo 6 (AI & Logic)', usage: 62 },
        { coreId: 7, label: 'Núcleo 7 (Background IO)', usage: 59 },
      ],
      totalCpu: 70,
      gpuUsage: 99,
      fps: 195,
      verdictTitle: 'REPARTO MULTINÚCLEO // EVIDENCIA CONSISTENTE CON PLENO RENDERIZADO',
      verdictText: 'La carga está distribuida de manera homogénea. Ningún hilo individual satura y la GPU mantiene utilización alta y sostenida, correlacionada con una entrega continua de instrucciones.',
      badgeColor: 'border-emerald-500/60 text-emerald-400 bg-emerald-500/10',
    },
    gpu_heavy: {
      title: 'Resolución Alta / Carga Gráfica Intensa (Simulación 1440p / 4K)',
      description: 'El rasterizado y cálculo de sombreado de millones de píxeles demanda mayor tiempo a la GPU entre fotogramas.',
      cores: [
        { coreId: 0, label: 'Núcleo 0 (Main Loop)', usage: 38 },
        { coreId: 1, label: 'Núcleo 1 (API Command)', usage: 28 },
        { coreId: 2, label: 'Núcleo 2 (Physics)', usage: 16 },
        { coreId: 3, label: 'Núcleo 3 (Audio)', usage: 12 },
        { coreId: 4, label: 'Núcleo 4 (Background)', usage: 9 },
        { coreId: 5, label: 'Núcleo 5 (Inactivo)', usage: 6 },
        { coreId: 6, label: 'Núcleo 6 (Inactivo)', usage: 5 },
        { coreId: 7, label: 'Núcleo 7 (Inactivo)', usage: 4 },
      ],
      totalCpu: 15,
      gpuUsage: 99,
      fps: 64,
      verdictTitle: 'FACTOR LIMITANTE PROBABLE: RENDERIZADO GRÁFICO',
      verdictText: 'En esta configuración y bajo estas condiciones de prueba, la alta ocupación sostenida de la GPU indica que el trabajo gráfico es el factor limitante principal. La CPU dispone de margen suficiente entre fotogramas.',
      badgeColor: 'border-cyan-500/60 text-cyan-400 bg-cyan-500/10',
    },
  };

  const activeData = scenariosData[selectedScenario];

  return (
    <section id="estacion-01-sospechoso" className="space-y-6 pt-4">
      {/* Station Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase">
          <span className="text-yellow-400 font-bold">ESTACIÓN 01 // EL SOSPECHOSO EQUIVOCADO</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">LA FALACIA DEL 100%</span>
        </div>
        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
          LECCIÓN METODOLÓGICA BÁSICA
        </span>
      </div>

      {/* Core Principle Headline Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161720] via-[#121318] to-[#0c0d10] border-l-4 border-yellow-400 border-y border-r border-zinc-800 space-y-3">
        <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
          PRINCIPIO CARDINAL DE EVO LABS
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-snug">
          “El componente más ocupado no siempre es el componente que está limitando.”
        </h2>
        <p className="font-sans-editorial text-zinc-300 text-sm sm:text-base leading-relaxed">
          Diagnosticar una computadora no consiste en abrir una ventana, buscar quién tiene el porcentaje más alto y culparlo.
          <br />
          <strong className="text-white">
            Diagnosticar es descubrir quién está obligando a los demás componentes a esperar con las manos vacías.
          </strong>
        </p>
      </div>

      {/* Two Column Section: The Task Manager Lie vs Reality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-[#121318] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-rose-400 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>EL ERROR COMÚN DEL USUARIO</span>
          </div>
          <h3 className="font-display font-bold text-lg text-white uppercase">
            Mirar el número global del Administrador de Tareas
          </h3>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Windows promedia el uso de todos los núcleos lógicos. Si tenés un procesador moderno de 8 núcleos y 16 hilos, y el hilo principal del juego corre al 100%, ese único hilo representa apenas el <strong>6.25%</strong> del total de tu CPU.
          </p>
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 font-mono-tech text-xs text-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>Lectura en pantalla:</span>
              <span className="text-emerald-400 font-bold">“CPU: 30% // GPU: 60%”</span>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
              <span>Interpretación errónea:</span>
              <span className="text-rose-300">“Le sobra procesador, debe ser la GPU”</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121318] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 font-bold">
            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
            <span>LA REALIDAD FÍSICA EN EL SILICIO</span>
          </div>
          <h3 className="font-display font-bold text-lg text-white uppercase">
            La cola secuencial del motor gráfico
          </h3>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Un hilo crítico con alta ocupación puede constituir un indicio relevante de limitación del lado CPU, especialmente si coincide con caídas de FPS o aumentos del frametime. Sin embargo, no debe concluirse apresuradamente: un hilo de software puede migrar dinámicamente entre núcleos lógicos por acción del programador del sistema operativo, y factores como esperas de sincronización, I/O o drivers también intervienen.
          </p>
          <div className="p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/30 font-mono-tech text-xs text-yellow-300/90 leading-relaxed">
            <strong>Principio metodológico:</strong> La lectura por núcleo de Windows es una <em>observación empírica</em> útil, no un trazado estático e inmutable de un único hilo fijado en el silicio.
          </div>
        </div>
      </div>

      {/* Interactive Thread Simulator */}
      <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 text-xs font-mono-tech flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">
              DEMOSTRACIÓN EDUCATIVA // DATOS SIMULADOS (NO CORRESPONDE A TU PC)
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 uppercase hidden sm:inline">
            MODELO PEDAGÓGICO DE REFERENCIA
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-xs font-mono-tech text-yellow-400 uppercase font-bold tracking-wider">
                SIMULADOR INTERACTIVO // REPARTO DE CARGA POR NÚCLEO
              </span>
            </div>
            <h3 className="font-display font-black text-xl text-white uppercase mt-1">
              ¿Quién está frenando la línea de montaje?
            </h3>
          </div>

          {/* Scenario Selectors */}
          <div className="flex flex-wrap gap-1.5 bg-black/60 p-1.5 rounded-xl border border-zinc-800 text-xs font-mono-tech">
            <button
              type="button"
              id="btn-escenario-monohilo"
              onClick={() => setSelectedScenario('single_thread')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedScenario === 'single_thread'
                  ? 'bg-amber-400 text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              1 Hilo al 100% (Esports)
            </button>
            <button
              type="button"
              id="btn-escenario-multihilo"
              onClick={() => setSelectedScenario('multithread')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedScenario === 'multithread'
                  ? 'bg-emerald-400 text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Multihilo Balanceado
            </button>
            <button
              type="button"
              id="btn-escenario-gpu-heavy"
              onClick={() => setSelectedScenario('gpu_heavy')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedScenario === 'gpu_heavy'
                  ? 'bg-cyan-400 text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              GPU al 100% (4K / Ultra)
            </button>
          </div>
        </div>

        {/* Selected Scenario Headline */}
        <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1">
          <span className="text-[10px] font-mono-tech text-zinc-400 uppercase tracking-wider block font-bold">
            ESCENARIO SELECCIONADO:
          </span>
          <h4 className="font-display font-bold text-white uppercase text-base">
            {activeData.title}
          </h4>
          <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
            {activeData.description}
          </p>
        </div>

        {/* Global Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech text-center">
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-zinc-400 block text-[10px] uppercase">USO CPU TOTAL (PROMEDIO)</span>
            <span className={`text-2xl font-black ${activeData.totalCpu > 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {activeData.totalCpu}%
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Lo que muestra Windows</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-zinc-400 block text-[10px] uppercase">USO DE GPU EN RENDER</span>
            <span className={`text-2xl font-black ${activeData.gpuUsage > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {activeData.gpuUsage}%
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">
              {activeData.gpuUsage > 90 ? 'Aprovechamiento pleno' : `${100 - activeData.gpuUsage}% esperando CPU`}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-zinc-400 block text-[10px] uppercase">FOTOGRAMAS POR SEGUNDO</span>
            <span className="text-2xl font-black text-white">
              {activeData.fps} <span className="text-xs text-zinc-400 font-normal">FPS</span>
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Cadencia en pantalla</span>
          </div>
        </div>

        {/* 8 Cores Heatmap Bars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
            <span>DISTRIBUCIÓN EN SILICIO // 8 NÚCLEOS FÍSICOS</span>
            <span className="text-yellow-400">CARGA INDIVIDUAL (%)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeData.cores.map((core) => {
              const isBottleneckThread = core.usage >= 95;
              return (
                <div
                  key={core.coreId}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between space-y-1.5 transition-all ${
                    isBottleneckThread
                      ? 'bg-rose-950/30 border-rose-500/80 shadow-lg shadow-rose-900/20'
                      : 'bg-black/40 border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className={`font-semibold ${isBottleneckThread ? 'text-rose-300' : 'text-zinc-300'}`}>
                      {core.label}
                    </span>
                    <span className={`font-mono font-bold ${isBottleneckThread ? 'text-rose-400' : 'text-zinc-400'}`}>
                      {core.usage}%
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isBottleneckThread
                          ? 'bg-rose-500'
                          : core.usage > 70
                          ? 'bg-emerald-400'
                          : core.usage > 30
                          ? 'bg-amber-400'
                          : 'bg-zinc-600'
                      }`}
                      style={{ width: `${core.usage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verdict Box */}
        <div className={`p-4 rounded-xl border ${activeData.badgeColor} space-y-1.5`}>
          <div className="flex items-center gap-2 text-xs font-mono-tech font-bold uppercase">
            <Info className="w-4 h-4" />
            <span>DICTAMEN PERICIAL // {activeData.verdictTitle}</span>
          </div>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
            {activeData.verdictText}
          </p>
        </div>
      </div>
    </section>
  );
};
