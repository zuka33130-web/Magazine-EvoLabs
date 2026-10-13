import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';

export const Page09Chapter05: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-09"
      pageNumber={9}
      totalPages={24}
      sectionTitle="CAPÍTULO 05"
      subSlug="SISTEMA OPERATIVO // EL SOFTWARE ES HARDWARE"
      accentColor="#38BDF8"
    >
      {/* Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-sky-400 uppercase font-bold">
            CAPÍTULO 05 // KERNEL & SERVICIOS
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Windows También es Hardware
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          ANILLOS DE EJECUCIÓN // DPC LATENCY
        </span>
      </div>

      {/* Ring 0 vs Ring 3 Architecture Graphic */}
      <div className="bg-[#090e14] border border-sky-900/40 rounded-lg p-2.5 mb-2">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 border-b border-zinc-800/80 pb-1 mb-1.5">
          <span className="text-sky-400 font-bold uppercase">LOS ANILLOS DE PRIVILEGIO DE LA CPU (X86/X64)</span>
          <span>AISLAMIENTO DE PROCESOS // CONTROLADORES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-[#0e1724] border border-sky-500/40 rounded">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-sky-400 font-mono-tech font-bold text-[11px]">RING 0 // MODO KERNEL (NÚCLEO)</span>
              <span className="text-[8px] font-mono-tech text-sky-300">ACCESO TOTAL A HARDWARE</span>
            </div>
            <p className="text-[9px] text-zinc-300 font-sans-editorial leading-tight">
              Controladores gráficos (nvlddmkm.sys, amdkmdag.sys), drivers de red y módulos de audio. Un bug en Ring 0 provoca congelamiento o BSOD.
            </p>
          </div>

          <div className="p-2 bg-[#0e1724] border border-zinc-800 rounded">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-zinc-300 font-mono-tech font-bold text-[11px]">RING 3 // MODO USUARIO</span>
              <span className="text-[8px] font-mono-tech text-zinc-500">ACCESO RESTRINGIDO</span>
            </div>
            <p className="text-[9px] text-zinc-300 font-sans-editorial leading-tight">
              Tus aplicaciones cotidianas: juegos, navegadores, Discord. Si una app colapsa en Ring 3, el kernel protege al sistema y no se cae la máquina.
            </p>
          </div>
        </div>
      </div>

      {/* Article 2 Cols */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
        <div className="md:col-span-7 space-y-1.5">
          <p className="magazine-dropcap text-zinc-200">
            Existe la creencia de que el software es algo abstracto e inmaterial, mientras que el hardware es lo tangible. Pero cada línea de código ejecutada es simplemente la conmutación física de millones de transistores alternando entre 0 y 1. Windows no flota en el aire: es hardware en movimiento.
          </p>
          <p className="text-zinc-400 text-[11px]">
            Cuando experimentás chasquidos en Discord o pequeños tirones mientras jugás, casi nunca es culpa de la tarjeta gráfica: casi siempre es una rutina de servicio de interrupción diferida (<strong>DPC - Deferred Procedure Call</strong>) bloqueada en Ring 0.
          </p>
        </div>

        <div className="md:col-span-5 bg-[#090e14] border border-zinc-800 p-2.5 rounded-lg flex flex-col justify-between">
          <div className="space-y-1 text-[9px] font-mono-tech">
            <span className="text-sky-400 font-bold uppercase tracking-wider block border-b border-zinc-800 pb-0.5">
              DIAGNÓSTICO CON LATENCYMON
            </span>
            <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded">
              <strong className="text-zinc-200 block text-[10px]">LÍMITE SEGURO DE DPC: &lt; 500 µs</strong>
              <p className="text-zinc-400">Si un driver supera los 1000 µs (1 ms), el planificador de Windows se atrasa y el buffer de audio o video pierde fotogramas irremediablemente.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section: INTERNET DICE // EVO MIDE (MITO-06) */}
      <InternetDiceEvoMide
        idMito="MITO-06"
        consejoPopular="Descargá y ejecutá scripts de 'Windows Debloater' masivos de GitHub que apagan 60 servicios: duplicarás tus FPS y limpiarás la memoria RAM."
        fuentePopular="Videos virales de 'optimización extrema' en TikTok y YouTube"
        realidadTecnica="Los servicios en segundo plano de Windows modernos usan memoria paginada 'Trigger-Start' que se duerme y cede sus recursos al abrir un juego. Los scripts no oficiales mutilan dependencias críticas (CryptSvc, WMI, servicios de red). Cuando el sistema busca una dependencia rota, entra en bucles de reintento en Ring 0 que disparan la latencia DPC y saturan el visor de eventos con miles de errores por segundo."
        experimento="Evaluación con LatencyMon y CapFrameX antes y después de ejecutar un script popular de 'debloat agresivo'."
        herramientaMedicion="LatencyMon v7.31 + CapFrameX + Visor de Eventos de Windows"
        resultado="empeoro"
        resultadoDetalle="FPS promedio: +0.4% (irrelevante). DPC Latency máxima: saltó de 180 µs a 1.640 µs con micro-stutters severos y errores de autenticación en Steam/Xbox app."
        riesgo="Alto riesgo de corromper la tienda de Windows, actualizaciones de seguridad y drivers de audio."
        comoRevertirlo="Crear siempre un Punto de Restauración antes de modificar servicios. Para telemetría, usar únicamente herramientas auditadas (como O&O ShutUp10++) en modo recomendado."
      />
    </MagazineMasterPage>
  );
};
