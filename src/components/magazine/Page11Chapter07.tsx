import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';

export const Page11Chapter07: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-23"
      pageNumber={23}
      totalPages={24}
      sectionTitle="CAPÍTULO 07"
      subSlug="EXPERIMENTO FINAL // MÉTODO CIENTÍFICO A/B"
      accentColor="#A855F7"
    >
      {/* Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-purple-400 uppercase font-bold">
            CAPÍTULO 07 // ENSAYO METROLÓGICO
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            El Método Científico en tu PC
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          PROTOCOLOS DE MEDICIÓN A/B SIN PLACEBO
        </span>
      </div>

      {/* A/B Testing Scorecard Graphic */}
      <div className="bg-[#0e0a14] border border-purple-900/40 rounded-lg p-2.5 mb-2">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 border-b border-zinc-800/80 pb-1 mb-2">
          <span className="text-purple-400 font-bold uppercase">MATRIZ DE ENSAYO CONTROLADO // PROTOCOLO A/B EVO</span>
          <span className="text-zinc-500">VALORES ILUSTRATIVOS // MEDÍ EN TU PROPIO EQUIPO</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-[#140e1e] border border-zinc-800 rounded">
            <span className="text-[9px] font-mono-tech text-zinc-400 font-bold uppercase block mb-0.5">
              ESTADO A: LÍNEA DE BASE (EXPO OFF // JEDEC 4800)
            </span>
            <div className="space-y-0.5 text-[10px] font-mono-tech">
              <div className="flex justify-between text-zinc-300">
                <span>FPS PROMEDIO:</span>
                <span className="text-white font-bold">112 FPS <span className="text-zinc-500 text-[8px]">(TU PC: _____)</span></span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>1% LOW:</span>
                <span className="text-amber-400 font-bold">64 FPS <span className="text-zinc-500 text-[8px]">(TU PC: _____)</span></span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>LATENCIA RAM:</span>
                <span className="text-zinc-300 font-bold">88.4 ns <span className="text-zinc-500 text-[8px]">(TU PC: _____)</span></span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-[#140e1e] border border-purple-500/40 rounded flex flex-col justify-between">
            <span className="text-[9px] font-mono-tech text-purple-400 font-bold uppercase block mb-0.5">
              INTERVENCIÓN: 1 SOLA VARIABLE AISLADA
            </span>
            <p className="text-[9px] text-zinc-300 font-sans-editorial leading-tight">
              <strong>Experimento A:</strong> Activar únicamente el perfil EXPO / XMP (DDR5-6000 CL30). Cero modificaciones en voltajes de CPU, cero tweaks de Windows y sin tocar Curve Optimizer.
            </p>
            <span className="text-[8px] font-mono-tech text-purple-300 mt-1 bg-black/40 px-1 py-0.5 rounded">
              VARIABLE AISLADA: VELOCIDAD Y TIMINGS DE MEMORIA
            </span>
          </div>

          <div className="p-2 bg-[#140e1e] border border-emerald-500/40 rounded">
            <span className="text-[9px] font-mono-tech text-emerald-400 font-bold uppercase block mb-0.5">
              ESTADO B: SEGUNDA MEDICIÓN (EXPO ON // DELTA)
            </span>
            <div className="space-y-0.5 text-[10px] font-mono-tech">
              <div className="flex justify-between text-zinc-300">
                <span>FPS PROMEDIO:</span>
                <span className="text-emerald-400 font-bold">118 FPS <span className="text-zinc-500 text-[8px]">(DELTA: _____)</span></span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>1% LOW:</span>
                <span className="text-emerald-400 font-bold">89 FPS <span className="text-zinc-500 text-[8px]">(DELTA: _____)</span></span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>LATENCIA RAM:</span>
                <span className="text-emerald-400 font-bold">66.2 ns <span className="text-zinc-500 text-[8px]">(DELTA: _____)</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
        <div className="md:col-span-7 space-y-1.5">
          <p className="magazine-dropcap text-zinc-200">
            El cerebro humano es extraordinariamente susceptible a la sugestión. Si pasaste tres horas limpiando el gabinete, cambiando la pasta térmica y aplicando comandos, tu mente <em>quiere creer</em> que la máquina vuela, incluso si el rendimiento empeoró.
          </p>
          <p className="text-zinc-400 text-[11px]">
            El método científico no requiere equipamiento de la NASA: requiere aislar variables, medir tres corridas en idénticas condiciones térmicas y contrastar percentiles con frialdad matemática.
          </p>
        </div>

        <div className="md:col-span-5 bg-[#0e0a14] border border-zinc-800 p-2.5 rounded-lg flex flex-col justify-between">
          <div className="space-y-1 text-[9px] font-mono-tech">
            <span className="text-purple-400 font-bold uppercase tracking-wider block border-b border-zinc-800 pb-0.5">
              LOS 3 MANDAMIENTOS A/B
            </span>
            <div className="text-zinc-300 space-y-0.5">
              <div><strong className="text-purple-300">1. Baseline previa:</strong> Tres corridas idénticas antes de tocar nada.</div>
              <div><strong className="text-purple-300">2. Una sola variable:</strong> Modificar solo un parámetro a la vez.</div>
              <div><strong className="text-purple-300">3. Control térmico:</strong> Medir siempre a misma temperatura ambiente.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section: INTERNET DICE // EVO MIDE (MITO-08) */}
      <InternetDiceEvoMide
        idMito="MITO-08"
        consejoPopular="Activá el plan de energía secreto 'Máximo Rendimiento' (Ultimate Performance) de Windows para que la CPU ande siempre al 100% y no tenga caídas de FPS."
        fuentePopular="Comando 'powercfg -duplicatescheme' repetido en tutoriales"
        realidadTecnica="Los procesadores modernos regulan su frecuencia cada 1 milisegundo mediante estados de reposo autónomos en hardware (CPPC2). El plan 'Máximo Rendimiento' deshabilita los C-States (C1E/C6), forzando los núcleos a estar calientes en reposo (consumiendo hasta 45W innecesarios en el escritorio). Al abrir un juego, la CPU ya viene arrastrando calor acumulado, por lo que el algoritmo dinámico de Boost alcanza antes el límite térmico y entrega frecuencias pico MONOHILO INFERIORES a las del plan Equilibrado."
        experimento="Pruebas térmicas y de reloj monohilo sostenido en Cinebench 2024 y Cyberpunk con Ryzen 7000 / Intel 14ª Gen bajo plan Equilibrado vs Máximo Rendimiento."
        herramientaMedicion="HWiNFO64 (CPU Package Power + Effective Clocks)"
        resultado="empeoro"
        resultadoDetalle="En reposo: +16°C más de temperatura y +38W de consumo inútil. En juego: frecuencia monohilo pico 150 MHz más baja debido a saturación térmica acumulada."
        riesgo="Mayor degradación por electromigración en reposo, ventiladores ruidosos constantes y menor rendimiento monohilo."
        comoRevertirlo="Seleccionar el plan 'Equilibrado (Recomendado)' en Windows y permitir que el microprocesador duerma sus núcleos inactivos de forma autónoma."
      />
    </MagazineMasterPage>
  );
};
