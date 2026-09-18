import React, { useState } from 'react';
import {
  Cpu,
  Monitor,
  ArrowRight,
  RefreshCw,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Layers,
} from 'lucide-react';

export const Station02CpuGpuCadence: React.FC = () => {
  const [activeGameDemo, setActiveGameDemo] = useState<'cs2' | 'cyberpunk' | 'flight_sim'>('cs2');

  const demoCases = {
    cs2: {
      name: 'Counter-Strike 2 // Simulación 1080p Competitivo',
      engine: 'Source 2 // Carga secuencial y tasa alta de cuadros',
      cpuUsage: '42% (Hilo principal con alta carga)',
      gpuUsage: '54%',
      fps: '240 FPS',
      limiter: 'INVESTIGAR HILO CPU / LATENCIA',
      limiterColor: 'text-amber-400 bg-amber-500/10 border-amber-500/40',
      analysis:
        'La utilización de la GPU es moderada (54%). Esto indica que la tarjeta gráfica dispone de margen libre y está a la espera de que el procesador despache la lógica de la escena y las llamadas de dibujo.',
    },
    cyberpunk: {
      name: 'Cyberpunk 2077 // Simulación 1440p Calidad Ultra + Ray Tracing',
      engine: 'REDengine // Carga masiva de sombreado y rayos',
      cpuUsage: '65% (Distribuido)',
      gpuUsage: '99%',
      fps: '58 FPS',
      limiter: 'FACTOR LIMITANTE PROBABLE: GPU',
      limiterColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/40',
      analysis:
        'La utilización de la GPU es alta y sostenida (99%). La evidencia es consistente con una limitación predominantemente gráfica en esta resolución y calidad, donde la GPU demanda la mayor parte del tiempo por cuadro.',
    },
    flight_sim: {
      name: 'Microsoft Flight Simulator // Simulación Manhattan a 1080p',
      engine: 'Asobo Engine // Geometría procedural & fotogrametría',
      cpuUsage: '78% (Draw calls & bus de memoria)',
      gpuUsage: '62%',
      fps: '44 FPS',
      limiter: 'COMPLEJIDAD DE ESCENA & PLATAFORMA',
      limiterColor: 'text-rose-400 bg-rose-500/10 border-rose-500/40',
      analysis:
        'La escena demanda constante actualización de miles de objetos y transferencias de memoria. La GPU pasa ciclos a la espera de datos procesados por la plataforma y la CPU.',
    },
  };

  const currentCase = demoCases[activeGameDemo];

  return (
    <section id="estacion-02-dialogo-cpu-gpu" className="space-y-6 pt-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase">
          <span className="text-yellow-400 font-bold">ESTACIÓN 02 // CPU vs GPU</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">LA CADENCIA DE ENTREGA</span>
        </div>
        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
          ¿QUIÉN ESPERA A QUIÉN?
        </span>
      </div>

      {/* Intro Explanatory Card */}
      <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
        <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
          La cadena de montaje visual
        </h3>
        <p className="font-sans-editorial text-zinc-300 text-sm sm:text-base leading-relaxed">
          Cada cuadro que ves en el monitor es el producto de una carrera de relevos coordinada:
        </p>

        {/* 3 Step Sequence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-tech text-xs">
          <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-yellow-400 font-bold">PASO 01 // CPU</span>
              <span>LÓGICA</span>
            </div>
            <h4 className="font-display font-bold text-sm text-white uppercase">
              Simulación & Draw Calls
            </h4>
            <p className="font-sans-editorial text-zinc-400 text-xs leading-relaxed">
              La CPU calcula entradas de teclado/mouse, físicas, trayectorias de balas, inteligencia artificial y escribe las órdenes de dibujo (Draw Calls) en la API gráfica (DirectX / Vulkan).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-yellow-400 font-bold">PASO 02 // BUS PCIe</span>
              <span>TRANSFERENCIA</span>
            </div>
            <h4 className="font-display font-bold text-sm text-white uppercase">
              Envío a la VRAM
            </h4>
            <p className="font-sans-editorial text-zinc-400 text-xs leading-relaxed">
              Las órdenes y búferes de vértices viajan por las líneas PCIe hacia la memoria dedicada de la tarjeta de video sin retrasos ni pérdidas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-yellow-400 font-bold">PASO 03 // GPU</span>
              <span>RASTERIZADO</span>
            </div>
            <h4 className="font-display font-bold text-sm text-white uppercase">
              Shaders & Píxeles
            </h4>
            <p className="font-sans-editorial text-zinc-400 text-xs leading-relaxed">
              La GPU ejecuta millones de hilos paralelos para calcular texturas, sombras, iluminación y escribe el fotograma final en el búfer de pantalla para enviarlo al monitor.
            </p>
          </div>
        </div>
      </div>

      {/* Who Waits for Whom: Diagnostic Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* GPU Bound */}
        <div className="p-5 rounded-2xl bg-[#121318] border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-bold uppercase tracking-wider border border-cyan-500/40">
              SITUACIÓN A // GPU AL 97% - 100%
            </span>
            <span className="text-xs font-mono-tech text-cyan-400 font-semibold">ALTA OCUPACIÓN GRÁFICA</span>
          </div>
          <h4 className="font-display font-black text-lg text-white uppercase">
            Hipótesis de limitación gráfica
          </h4>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Una utilización GPU alta y sostenida, correlacionada con el frametime y con una respuesta sensible al reducir la carga gráfica, fortalece la hipótesis de limitación gráfica en esa configuración.
          </p>
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-xs font-mono-tech">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Diferenciar: <strong>GPU muy ocupada</strong> no es sinónimo de falla; indica aprovechamiento del silicio.</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Reducir la resolución suele correlacionar con un aumento medible de FPS.</span>
            </div>
          </div>
        </div>

        {/* CPU Bound */}
        <div className="p-5 rounded-2xl bg-[#121318] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider border border-amber-500/40">
              SITUACIÓN B // GPU AL 40% - 75%
            </span>
            <span className="text-xs font-mono-tech text-amber-400 font-semibold">INVESTIGAR CAUSAS</span>
          </div>
          <h4 className="font-display font-black text-lg text-white uppercase">
            Utilización moderada de GPU
          </h4>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Una GPU con utilización moderada no señala automáticamente a la CPU como culpable. Requiere investigar: limitador de FPS (cap o V-Sync), esperas de sincronización del motor, streaming de datos, carga ligera, limitación térmica/energética o telemetría incompleta.
          </p>
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-xs font-mono-tech">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Observación: La GPU dispone de ciclos desocupados entre fotogramas.</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Regla técnica: No sentenciar la CPU sin descartar límites de software y configuración.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Bottleneck Shifter: Same PC, 3 Different Engines */}
      <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-5">
        <div className="p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 text-xs font-mono-tech flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">
              DEMOSTRACIÓN EDUCATIVA // DATOS SIMULADOS (NO CORRESPONDE A TU PC)
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 uppercase hidden sm:inline">
            COMPARATIVA CONCEPTUAL
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
              DEMOSTRACIÓN COMPARATIVA // MISMA COMPUTADORA EXACTA
            </span>
            <h4 className="font-display font-black text-xl text-white uppercase mt-1">
              El límite se mueve con cada juego
            </h4>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono-tech">
            <button
              type="button"
              id="btn-demo-cs2"
              onClick={() => setActiveGameDemo('cs2')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeGameDemo === 'cs2'
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              1. CS2 (Esports)
            </button>
            <button
              type="button"
              id="btn-demo-cyberpunk"
              onClick={() => setActiveGameDemo('cyberpunk')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeGameDemo === 'cyberpunk'
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              2. Cyberpunk (Ray Tracing)
            </button>
            <button
              type="button"
              id="btn-demo-flight"
              onClick={() => setActiveGameDemo('flight_sim')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeGameDemo === 'flight_sim'
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              3. Flight Simulator (Fotogrametría)
            </button>
          </div>
        </div>

        {/* Dynamic Case Details Card */}
        <div className="p-5 rounded-xl bg-black/50 border border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
            <div>
              <span className="font-mono-tech text-xs text-yellow-400 font-bold uppercase block">
                {currentCase.name}
              </span>
              <span className="font-sans-editorial text-xs text-zinc-400">
                {currentCase.engine}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono-tech font-bold uppercase border ${currentCase.limiterColor}`}>
              {currentCase.limiter}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech text-center">
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase block">USO CPU</span>
              <span className="text-xl font-bold text-white">{currentCase.cpuUsage}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase block">USO GPU</span>
              <span className="text-xl font-bold text-cyan-400">{currentCase.gpuUsage}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase block">CADENCIA RESULTANTE</span>
              <span className="text-xl font-bold text-yellow-400">{currentCase.fps}</span>
            </div>
          </div>

          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
            {currentCase.analysis}
          </p>
        </div>
      </div>

      {/* Online Bottleneck Calculators: Why a generic percentage is not a diagnosis */}
      <div className="p-6 rounded-2xl bg-[#14151c] border border-zinc-700 space-y-4">
        <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono-tech font-bold uppercase">
          <AlertOctagon className="w-5 h-5 text-yellow-400" />
          <span>ADVERTENCIA METODOLÓGICA // ORIENTACIÓN VS DIAGNÓSTICO</span>
        </div>

        <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
          Calculadoras de cuello de botella: por qué un porcentaje genérico no es un diagnóstico
        </h3>

        <p className="font-sans-editorial text-zinc-300 text-sm leading-relaxed">
          Existen herramientas en línea donde se ingresa un procesador y una tarjeta de video para obtener un número estático (ej. <em>“27.4% de Bottleneck”</em>). Aunque pueden utilizar modelos simplificados y servir como una orientación muy aproximada de mercado, un porcentaje fijo no constituye un diagnóstico técnico pericial.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tech">
          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1.5">
            <span className="text-yellow-400 font-bold uppercase block">1. DEPENDEN DEL MOTOR Y LA ESCENA</span>
            <p className="font-sans-editorial text-zinc-300 leading-relaxed">
              Un cuello de botella no es una propiedad estática del silicio. La misma configuración física puede exhibir una utilización del 54% en un título con alta carga monohilo y superar el 99% en otro juego con pesada demanda gráfica.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1.5">
            <span className="text-yellow-400 font-bold uppercase block">2. FACTORES REALES OMITIDOS</span>
            <p className="font-sans-editorial text-zinc-300 leading-relaxed">
              Las calculadoras sintéticas no contemplan variables determinantes: resolución efectiva, perfil de memoria RAM (canales y frecuencia), térmicas reales, versiones de drivers, consistencia de frametime, procesos en segundo plano ni límites de fotogramas activados.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono-tech">
          <strong className="text-white font-bold">REGLA EVO LABS:</strong> Tomalo como una estimación referencial de mercado, nunca como un diagnóstico riguroso del comportamiento real de tu máquina.
        </div>
      </div>
    </section>
  );
};
