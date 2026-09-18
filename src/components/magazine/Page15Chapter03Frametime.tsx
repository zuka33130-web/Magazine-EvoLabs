import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { AntesDespuesCompare } from './AntesDespuesCompare';
import { Activity, Gauge, MousePointer, ShieldCheck } from 'lucide-react';

export const Page15Chapter03Frametime: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-15"
      pageNumber={15}
      totalPages={41}
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
            Existe un dogma popular que afirma que la tarjeta gráfica debe operar siempre al 99% o 100% de uso para 'aprovecharla al máximo'. Lo que la mayoría ignora es que, al saturar la GPU al 99%, el controlador de video acumula entre 1 y 3 fotogramas completos en una cola intermedia (buffer de pre-renderizado). Cada cuadro retenido retrasa la respuesta de tu mouse en la pantalla.
          </p>
        </div>

        {/* Signature EVO LABS Before / After Comparison */}
        <div className="flex-1 flex flex-col justify-center">
          <AntesDespuesCompare
            title="ENSAYO DE BANCO // COLA DE RENDERIZADO SATURADA VS. HOLGURA CONTROLADA"
            subtitle="PRUEBA CONTROLADA CON SENSOR FÍSICO NVIDIA LDAT V2"
            testCase="Apex Legends / Warzone en monitor de 144 Hz (GPU RTX 4070 / Ryzen 7)"
            beforeLabel="ESTADO ANTERIOR // FPS ILIMITADOS (GPU AL 99%)"
            afterLabel="OPTIMIZACIÓN EVO // CAP 141 FPS + LOW LATENCY REFLEX"
            metrics={[
              {
                label: 'Uso de GPU',
                beforeVal: '99% saturado',
                afterVal: '92% holgura',
                delta: '-7% carga',
                type: 'positive',
              },
              {
                label: 'Latencia Click-to-Photon',
                beforeVal: '44.8 ms',
                afterVal: '18.4 ms',
                delta: '-59% de demora',
                type: 'positive',
              },
              {
                label: 'Percentil 1% Low',
                beforeVal: '88 FPS',
                afterVal: '138 FPS',
                delta: '+56% estabilidad',
                type: 'positive',
              },
            ]}
            verdictNote="Al evitar que la GPU sature su búfer interno al 99%, la cola del controlador se vacía instantáneamente. El clic del mouse se dibuja en el fotograma inmediato sin esperar en fila."
          />
        </div>

        {/* Bottom Metrological Rule */}
        <div className="p-3 bg-[#130f14] border-l-3 border-red-500 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
            <strong className="text-red-400 font-bold">REGLA DE FLUIDEZ EVO:</strong> Un 1% Low estable a 138 FPS ofrece una experiencia infinitamente más competitiva y precisa que picos de 220 FPS que caen abruptamente a 70 ms.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 04 // V-SYNC & FPS ILIMITADOS →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
