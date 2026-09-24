import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { Gauge, ShieldAlert } from 'lucide-react';

export const Page13Chapter02Mito03: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-17"
      pageNumber={17}
      totalPages={46}
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
          realidadTecnica="El estándar PCIe base dividía históricamente los accesos de la CPU a la memoria gráfica (VRAM) en ventanas de 256 MB. Resizable BAR (y AMD Smart Access Memory) permite al procesador negociar bloques de asignación mucho mayores de la memoria de video. Sin embargo, su impacto real depende de la combinación de GPU, CPU, versión del controlador, motor gráfico y firmware. En juegos con perfiles validados por los fabricantes de GPUs puede mejorar la fluidez y la consistencia de fotogramas, mientras que en otros títulos puede no mostrar variación o incluso generar regresiones en el 1% Low si el motor no gestiona eficientemente las transferencias directas."
          experimento="Protocolo EVO: medición comparativa de frametime y percentiles 1% Low con ReBAR activo frente a configuración base del controlador en diferentes motores y perfiles de juego."
          herramientaMedicion="Monitor de frametime por hardware/API (CapFrameX o PresentMon) + telemetría de GPU"
          resultado="condicional"
          resultadoDetalle="Comportamiento condicional por título: títulos con perfiles validados muestran estabilidad o ganancias en percentiles mínimos, mientras que forzar ReBAR en títulos sin certificación oficial del driver puede arrojar pérdidas de consistencia o variaciones negativas en el frametime."
          riesgo="Posibles regresiones de fluidez, fluctuaciones de frametime o inestabilidad si se fuerza ReBAR de manera global en juegos no soportados por el perfil del controlador."
          comoRevertirlo="Mantener la gestión de ReBAR según el perfil oficial del controlador de la GPU (o desactivar la bandera forzada en herramientas externas), dejando la función activa en UEFI pero gobernada por el driver oficial."
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
