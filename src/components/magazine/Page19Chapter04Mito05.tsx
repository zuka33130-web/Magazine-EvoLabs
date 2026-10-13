import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { Wind, Volume2, ShieldCheck } from 'lucide-react';

export const Page19Chapter04Mito05: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-23"
      pageNumber={23}
      totalPages={46}
      sectionTitle="DESCUBRIMIENTO METROLÓGICO"
      subSlug="EXPEDIENTE MITO-05 // GESTIÓN ACÚSTICA & TÉRMICA"
      accentColor="#F97316"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Full-Page Dedicated Internet Dice // Evo Mide Section */}
        <InternetDiceEvoMide
          idMito="MITO-05"
          consejoPopular="Poné los ventiladores de la caja y del cooler al 100% de velocidad fija o configurá curvas ultra agresivas que salten a máxima potencia apenas la CPU toque los 65°C: el frío extremo te dará más FPS."
          fuentePopular="Costumbre extendida en foros de overclocking amateur"
          realidadTecnica="Los microprocesadores modernos tienen algoritmos de boost dinámico (Precision Boost 2 en AMD, Thermal Velocity Boost en Intel) diseñados para operar de forma totalmente segura a 80°C–90°C. El cobre del disipador tarda varios segundos en absorber el calor de un pico transitorio. Acelerar los ventiladores de 800 RPM a 2200 RPM en 200 milisegundos destruye la acústica del ambiente sin dar tiempo físico a transferir el calor hacia las aletas del radiador."
          experimento="Ensayo comparativo en banco sonométrico calibrado: A) Curva lineal agresiva de fábrica vs. B) Curva escalonada suave con retardo de histéresis de 3 segundos (step-up delay) + Undervolting suave de -25 mV (Curve Optimizer)."
          herramientaMedicion="Sonómetro digital calibrado clase 2 a 50 cm del chasis + HWiNFO64"
          resultado="mejoro"
          resultadoDetalle="Nivel sonoro cae de 48.2 dBA (ruido de turbina molesto) a 33.6 dBA (silencio absoluto de biblioteca). Frecuencia sostenida del CPU idéntica (+15 MHz por menor calor del undervolt) y temperatura de régimen exactamente igual (76°C vs 75°C)."
          riesgo="Fatiga prematura de los rodamientos de los ventiladores y cansancio psicofísico por oscilaciones constantes de tono acústico."
          comoRevertirlo="Configurar en el BIOS o con la app de código abierto 'Fan Control' un retardo de histéresis (Step Up Time) de 2 a 3 segundos, evitando que los ventiladores reaccionen histéricamente ante tareas de 1 segundo como abrir Chrome."
          fullPage={true}
        />

        {/* Technical Callout */}
        <div className="p-3.5 bg-[#14100c] border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-orange-400">
            <Volume2 className="w-4 h-4 shrink-0" />
            <span className="font-bold uppercase tracking-wider">LA LECCIÓN DE METROLOGÍA ACÚSTICA:</span>
          </div>
          <p className="text-zinc-300 font-sans-editorial text-[11px] leading-tight max-w-xl">
            La masa térmica del disipador de cobre y el líquido del radiador tienen inercia física. No necesitás alterar las RPM por un micro-pico de milisegundos.
          </p>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
