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
          realidadTecnica="El plan Ultimate Performance fue creado por Microsoft para servidores o estaciones de trabajo donde los microsegundos de conmutación de estados de energía (P-States) son inaceptables. Desactivar estados de ahorro y mantener frecuencias altas en reposo eleva el consumo y las temperaturas sin traducirse necesariamente en una mejora apreciable durante cargas reales."
          experimento="PROTOCOLOS DE MEDICIÓN EVO: Compará Equilibrado contra Alto Rendimiento o Ultimate Performance usando HWiNFO64 para registrar consumo (Package Power) y temperaturas en reposo; Cinebench o 3DMark para evaluar rendimiento real sostenido; y CapFrameX o PresentMon para analizar si los percentiles 1% y 0.1% low muestran cambios."
          herramientaMedicion="HWiNFO64 (Package Power & temps) + Cinebench / 3DMark + CapFrameX / PresentMon"
          resultado="empeoro"
          resultadoDetalle="Desactivar estados de ahorro y mantener frecuencias altas en reposo eleva el consumo y las temperaturas basales sin traducirse necesariamente en una mejora apreciable durante cargas de trabajo reales."
          riesgo="Mayor consumo energético continuo, temperaturas basales innecesariamente más altas y ventiladores girando a mayor régimen en reposo."
          comoRevertirlo="Seleccionar en Opciones de energía de Windows el plan 'Equilibrado' (recomendado). La conmutación de frecuencias nativa por hardware (Speed Shift en Intel / CPPC2 en AMD) responde en milisegundos ante cualquier demanda de carga."
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
