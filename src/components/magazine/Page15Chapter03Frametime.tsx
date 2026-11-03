import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { AntesDespuesCompare } from './AntesDespuesCompare';
import { Activity, Gauge, MousePointer, ShieldCheck } from 'lucide-react';

export const Page15Chapter03Frametime: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-19"
      pageNumber={19}
      totalPages={46}
      sectionTitle="CAPÍTULO 03"
      subSlug="TELEMETRÍA // LA COLA DE RENDERIZADO"
      accentColor="#EF4444"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono-tech tracking-widest text-red-400 uppercase font-bold">
              INVESTIGACIÓN METROLÓGICA // CAPÍTULO 03
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              La Cola de Renderizado al 99%
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            MEDICIÓN CON NVIDIA LDAT & CAPFRAMEX
          </span>
        </div>

        {/* Narrative Context */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            Existe la creencia de que la tarjeta gráfica debe operar obligatoriamente al 99% o 100% de carga continua para rendir al máximo. Sin embargo, en situaciones GPU-bound (donde la tarjeta es el cuello de botella), el pipeline gráfico puede acumular cuadros en el búfer del controlador. Esta cola de renderizado puede elevar la latencia entre el clic del mouse y la imagen visible. Tecnologías como NVIDIA Reflex, AMD Anti-Lag, limitadores de cuadros y monitores VRR permiten coordinar la entrega de fotogramas para mitigar este retraso.
          </p>
        </div>

        {/* Signature EVO LABS Before / After Comparison */}
        <div className="space-y-3">
          <AntesDespuesCompare
            title="ESCENARIO ILUSTRATIVO // COLA DE RENDERIZADO SATURADA VS. HOLGURA CONTROLADA"
            subtitle="ANÁLISIS CONCEPTUAL DE LATENCIA DE ENTRADA Y CONSISTENCIA DE CUADRO"
            testCase="Ejemplo ilustrativo de título competitivo en monitor VRR de 144 Hz (GPU dedicada)"
            beforeLabel="ESCENARIO A // FPS ILIMITADOS (GPU EN SATURACIÓN COMPLETA)"
            afterLabel="ESCENARIO B // CONTROL DE COLA (VRR + LOW LATENCY / CAP)"
            metrics={[
              {
                label: 'Carga de GPU',
                beforeVal: '99% saturado',
                afterVal: 'Holgura dinámica',
                delta: 'Menor retención en búfer',
                type: 'positive',
              },
              {
                label: 'Latencia Click-to-Photon',
                beforeVal: 'Elevada por cola',
                afterVal: 'Reducida y predecible',
                delta: 'Mayor inmediatez motriz',
                type: 'positive',
              },
              {
                label: 'Consistencia de Frametime',
                beforeVal: 'Fluctuaciones en picos',
                afterVal: 'Línea de tiempo plana',
                delta: 'Mayor estabilidad de 1% Low',
                type: 'positive',
              },
            ]}
            verdictNote="Al evitar la acumulación excesiva de fotogramas pendientes en el búfer del controlador, la cola de renderizado se mantiene ágil. El fotograma que contiene la acción del periférico se procesa con menor retraso acumulado."
          />

          {/* Guía Forense de Interpretación de Gráficos de Frametime */}
          <div className="p-3 bg-[#0d090d] border border-zinc-800 rounded-xl space-y-2 text-xs font-mono-tech">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
              <span className="text-red-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>DECODIFICADOR PERICIAL: CÓMO LEER EL GRÁFICO DE FRAMETIME (ms)</span>
              </span>
              <span className="text-[10px] text-zinc-500">CAPFRAMEX / PRESENTMON</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
                <span className="text-emerald-400 font-bold block">1. LÍNEA BASE (PACE PLANO)</span>
                <p className="text-zinc-300 font-sans-editorial leading-tight text-[10px]">
                  <strong>60 Hz = 16.6 ms</strong> | <strong>144 Hz = 6.94 ms</strong> | <strong>240 Hz = 4.16 ms</strong>. En un sistema fluido, la gráfica dibuja una línea horizontal perfecta sin oscilaciones superiores a ±1.5 ms.
                </p>
              </div>

              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
                <span className="text-amber-400 font-bold block">2. TIPOS DE PICOS (STUTTER)</span>
                <p className="text-zinc-300 font-sans-editorial leading-tight text-[10px]">
                  <strong>Pico aislado (40-60 ms):</strong> Compilación de shaders (PSO) o lectura de disco. <strong>Picos rítmicos cada 1s:</strong> Recolector de basura (GC) o polling de mouse. <strong>Picos masivos (&gt;100 ms):</strong> VRAM desbordada.
                </p>
              </div>

              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
                <span className="text-red-400 font-bold block">3. PERCENTILES 1% & 0.1% LOW</span>
                <p className="text-zinc-300 font-sans-editorial leading-tight text-[10px]">
                  El promedio de FPS es ciego a los tirones. El <strong>1% Low</strong> mide el percentil 99 más lento (fluidez real en combate). Si tu promedio es 120 FPS pero el 1% Low cae a 35 FPS, tu experiencia visual tartamudea.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrological Rule */}
        <div className="p-2.5 bg-[#130f14] border-l-3 border-red-500 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span className="text-[11px]">
            <strong className="text-red-400 font-bold">REGLA DE FLUIDEZ EVO:</strong> La estabilidad del tiempo entre cuadros (frametime) y un percentil 1% Low consistente determinan la fluidez real de juego más que cifras promedio de FPS infladas con micro-tirones intermitentes.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 04 // V-SYNC & FPS ILIMITADOS →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
