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
        <div className="flex-1 flex flex-col justify-center">
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
        </div>

        {/* Bottom Metrological Rule */}
        <div className="p-3 bg-[#130f14] border-l-3 border-red-500 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
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
