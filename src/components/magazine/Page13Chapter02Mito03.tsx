import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { Gauge, ShieldAlert } from 'lucide-react';

export const Page13Chapter02Mito03: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-13"
      pageNumber={13}
      totalPages={41}
      sectionTitle="DESCUBRIMIENTO METROLÓGICO"
      subSlug="EXPEDIENTE MITO-03 // ARQUITECTURA PCIE & VRAM"
      accentColor="#F59E0B"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Full-Page Dedicated Internet Dice // Evo Mide Section */}
        <InternetDiceEvoMide
          idMito="MITO-03"
          consejoPopular="Forzá 'Resizable BAR' (ReBAR / Smart Access Memory) en todos tus videojuegos mediante NVIDIA Profile Inspector o en el BIOS: ganarás un 15% de FPS gratis en cualquier título del mercado."
          fuentePopular="Guías de 'optimización competitiva' en foros de GPU y YouTube"
          realidadTecnica="El estándar PCIe tradicional limitaba los accesos de la CPU a la memoria gráfica (VRAM) a bloques de 256 MB. ReBAR permite al procesador mapear todo el búfer de video en un único espacio continuo. Sin embargo, en motores DirectX 9 o DirectX 11 antiguos sin perfil validado, forzar ReBAR inunda el bus PCIe con miles de pedidos pequeños y desordenados, generando congestión de cola de tráfico y micro-tirones severos (micro-stuttering)."
          experimento="Ensayo pericial con CapFrameX en dos escenarios extremos: A) Cyberpunk 2077 (motor DirectX 12 moderno con perfil oficial validado) y B) Dishonored 2 (motor DirectX 11 sin soporte oficial)."
          herramientaMedicion="CapFrameX v1.7.2 + MSI Afterburner Frame Tracking"
          resultado="condicional"
          resultadoDetalle="En Cyberpunk 2077: +9.4% en 1% Lows (Mejora comprobada). En Dishonored 2: -16.2% en 1% Lows con picos erráticos de frametime de hasta 28 ms (Empeoramiento notable). No es un interruptor mágico universal."
          riesgo="Inestabilidad de cuadros por segundo, latencia de entrada fluctuante y tirones bruscos en títulos heredados o no testeados por el fabricante."
          comoRevertirlo="Dejar ReBAR en 'Driver Profile Default' en el panel de control o activarlo exclusivamente en los juegos donde el fabricante del driver validó el perfil de compatibilidad."
          fullPage={true}
        />

        {/* Technical Callout */}
        <div className="p-3.5 bg-[#0e111a] border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-amber-400">
            <Gauge className="w-4 h-4 shrink-0" />
            <span className="font-bold uppercase tracking-wider">EL CRITERIO DE LABORATORIO EVO:</span>
          </div>
          <p className="text-zinc-300 font-sans-editorial text-[11px] leading-tight max-w-xl">
            La tecnología es excelente cuando el motor del juego agrupa sus texturas en bloques grandes; cuando hace llamadas fragmentadas, la cola de PCIe se convierte en un embotellamiento.
          </p>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
