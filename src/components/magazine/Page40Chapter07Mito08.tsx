import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { Zap, ShieldCheck } from 'lucide-react';

export const Page40Chapter07Mito08: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-44"
      pageNumber={44}
      totalPages={46}
      sectionTitle="DESCUBRIMIENTO METROLÓGICO"
      subSlug="EXPEDIENTE MITO-08 // PLANES DE ENERGÍA DE WINDOWS"
      accentColor="#06B6D4"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Full-Page Dedicated Internet Dice // Evo Mide Section */}
        <InternetDiceEvoMide
          idMito="MITO-08"
          consejoPopular="Desbloqueá el plan oculto 'Máximo Rendimiento' (Ultimate Performance) mediante un comando en CMD: tu procesador funcionará siempre a su máxima frecuencia de GHz sin bajar jamás, eliminando el lag."
          fuentePopular="Videos virales de 'desbloquear trucos secretos de Windows'"
          realidadTecnica="El plan Ultimate Performance fue creado por Microsoft exclusivamente para servidores sin baterías o estaciones de trabajo donde los microsegundos de conmutación de estado de energía (P-States) son inaceptables. En una PC moderna, este plan bloquea los núcleos de la CPU al 100% de frecuencia incluso cuando estás leyendo un PDF o con la máquina bloqueada. Esto desactiva los estados de reposo profundo (C-States, como C6 y C7), provocando que la CPU consuma 40-50W adicionales en reposo, eleve las temperaturas basales 10°C-15°C y agote el presupuesto térmico (TDP headroom) antes de que abras un juego, reduciendo los picos de frecuencia turbo máxima cuando realmente los necesitás."
          experimento="Medición pericial con vatímetro en toma de pared y HWiNFO64 en reposo y bajo carga: A) Plan 'Equilibrado' (Balanced por defecto) vs. B) Plan 'Máximo Rendimiento' forzado."
          herramientaMedicion="Vatímetro digital de pared de precisión + HWiNFO64 Package Power"
          resultado="empeoro"
          resultadoDetalle="Consumo en reposo en la pared: sube de 14 Watts a 68 Watts (+385% de gasto eléctrico inútil). Temperatura en reposo: sube de 38°C a 52°C. Rendimiento en juegos y benchmarks 3D: 0.0% de ganancia en FPS promedio y 1% Lows idénticos."
          riesgo="Mayor degradación por electromigración en el silicio, mayor calentamiento del ambiente y ventiladores girando a mayor velocidad sin motivo alguno."
          comoRevertirlo="Seleccionar en Opciones de energía de Windows el plan 'Equilibrado' (recomendado). La conmutación de frecuencias por hardware (Speed Shift en Intel / CPPC2 en AMD) responde en menos de 1 milisegundo ante cualquier carga de trabajo."
          fullPage={true}
        />

        {/* Technical Callout */}
        <div className="p-3.5 bg-[#081216] border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-cyan-400">
            <Zap className="w-4 h-4 shrink-0" />
            <span className="font-bold uppercase tracking-wider">EL PRINCIPIO DE EFICIENCIA EVO:</span>
          </div>
          <p className="text-zinc-300 font-sans-editorial text-[11px] leading-tight max-w-xl">
            Un procesador frío en reposo es un procesador con margen térmico para alcanzar su boost de reloj más alto en el instante exacto en que lanzás una carga pesada.
          </p>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
