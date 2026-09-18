import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';

export const Page02Welcome: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-02"
      pageNumber={2}
      totalPages={41}
      sectionTitle="EDITORIAL & MANIFIESTO"
      subSlug="BIENVENIDA // FILOSOFÍA DE LABORATORIO"
      accentColor="#EAB308"
    >
      {/* Top Banner / Section Indicator */}
      <div className="mb-4 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            CARTA DEL DIRECTOR // VOLUMEN I
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-0.5">
            Tu PC no es una caja negra
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          REF: EVO-EDITORIAL-001
        </span>
      </div>

      {/* Grid: 2 Editorial Columns (Left) + Staff Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* Left: 2 Columns of Narrative Text */}
        <div className="lg:col-span-8 space-y-4">
          {/* Highlighted Lead Quote */}
          <div className="p-4 bg-gradient-to-r from-yellow-400/10 via-[#181a20] to-transparent border-l-4 border-yellow-400 rounded-r">
            <p className="font-display font-bold text-base sm:text-lg text-yellow-300 leading-snug">
              "Hacemos milagros, pero los medimos. Si una mejora no puede comprobarse en una gráfica de frametime o en un osciloscopio térmico, no existió."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-[13px] text-zinc-300 font-sans-editorial leading-relaxed">
            <div>
              <p className="magazine-dropcap text-zinc-200">
                Vivimos rodeados de recomendaciones superficiales. Videos de YouTube que prometen "triplicar tus FPS con este truco secreto de Windows", foros donde se repiten recetas mágicas de hace una década y marcas que venden placas madre con disipadores gigantes pero pistas de cobre de calibre mínimo.
              </p>
              <p className="mt-3 text-zinc-400">
                La industria del hardware aprendió a vender números grandes: frecuencias boost alcanzadas por fracciones de segundo, anchos de banda teóricos que jamás se saturan en el mundo real y luces RGB que ocultan fases de alimentación estranguladas térmicamente.
              </p>
              <p className="mt-3 text-zinc-400">
                En <strong>EVO LABS</strong> decidimos crear esta publicación porque nos cansamos de la adivinación. Esta revista no es un catálogo de compras ni un manual de instrucciones condescendiente: es un laboratorio pericial transferido al papel.
              </p>
            </div>

            <div>
              <p className="text-zinc-200">
                Tu computadora es, en última instancia, una máquina térmica y electromagnética. Cada dato que viaja entre el silicio del procesador y las memorias DDR5 está gobernado por leyes físicas implacables: la velocidad de propagación de la señal, la resistencia eléctrica de las pistas y la disipación del calor en los transistores.
              </p>
              <p className="mt-3 text-zinc-400">
                Cuando tu sistema pega un tirón, no es por "mala suerte" ni por un misterio inexplicable: una variable cambió. Un hilo del sistema operativo interrumpió el renderizado, un componente alcanzó su límite de potencia o la memoria tuvo que esperar ciclos ociosos para recibir una línea de caché.
              </p>
              <p className="mt-3 text-zinc-200 font-medium">
                En este Tomo 01 te entregamos las herramientas y el criterio analítico para auditar tu máquina con tus propios ojos, entender la topología de tu hardware y aprender a pensar como un ingeniero de laboratorio.
              </p>
            </div>
          </div>

          {/* 4 Inviolable Laboratory Principles */}
          <div className="mt-4 pt-4 border-t border-zinc-800/80">
            <span className="text-[10px] font-mono-tech font-bold uppercase tracking-widest text-zinc-400 block mb-2">
              LOS CUATRO PRINCIPIOS DE METROLOGÍA EVO
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10px] font-mono-tech">
              <div className="p-2.5 bg-[#12151c] border border-zinc-800 rounded">
                <span className="text-yellow-400 font-bold block mb-1">01 // SILICIO REAL</span>
                <span className="text-zinc-400">El silicio responde a la física, no a las etiquetas de marketing.</span>
              </div>
              <div className="p-2.5 bg-[#12151c] border border-zinc-800 rounded">
                <span className="text-yellow-400 font-bold block mb-1">02 // LATENCIA PURA</span>
                <span className="text-zinc-400">El promedio de FPS es ciego; la estabilidad vive en los percentiles.</span>
              </div>
              <div className="p-2.5 bg-[#12151c] border border-zinc-800 rounded">
                <span className="text-yellow-400 font-bold block mb-1">03 // CAUSA FORENSE</span>
                <span className="text-zinc-400">No existen los fallos espontáneos: todo síntoma tiene un culpable.</span>
              </div>
              <div className="p-2.5 bg-[#12151c] border border-zinc-800 rounded">
                <span className="text-yellow-400 font-bold block mb-1">04 // MÉTODO A/B</span>
                <span className="text-zinc-400">Si cambiás dos cosas al mismo tiempo, aprendiste cero.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Masthead / Staff Colophon / Laboratory Badge */}
        <div className="lg:col-span-4 bg-[#0d0f15] border border-zinc-800/90 rounded-lg p-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5 mb-3">
              <span className="w-2 h-2 bg-yellow-400 inline-block" />
              <h3 className="font-display font-black text-sm tracking-wider uppercase text-white">
                CRÉDITOS & CUADRO EDITORIAL
              </h3>
            </div>

            <div className="space-y-3 text-[11px] font-mono-tech">
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">DIRECCIÓN TÉCNICA & METROLOGÍA</span>
                <span className="text-zinc-200 font-bold">Laboratorio de Ingeniería EVO</span>
                <span className="text-zinc-500 block text-[10px]">Cátedra de Arquitectura & Silicio</span>
              </div>

              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">PERITAJE FORENSE DE FALLAS</span>
                <span className="text-zinc-200 font-bold">División Central de Incidentes</span>
                <span className="text-zinc-500 block text-[10px]">Auditoría de Kernel & DPC Latency</span>
              </div>

              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">TERMODINÁMICA & FLUJO DE AIRE</span>
                <span className="text-zinc-200 font-bold">Banco de Ensayos Físicos</span>
                <span className="text-zinc-500 block text-[10px]">Análisis de Fases VRM y Throttling</span>
              </div>

              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">DIRECCIÓN DE ARTE & DIAGRAMACIÓN</span>
                <span className="text-zinc-200 font-bold">EVO Visual Studio</span>
                <span className="text-zinc-500 block text-[10px]">Estética Editorial Tecnológica A4</span>
              </div>
            </div>
          </div>

          {/* Official Laboratory Stamp Box */}
          <div className="p-3.5 bg-black/60 border border-yellow-400/30 rounded text-center">
            <div className="text-[9px] font-mono-tech text-yellow-400 uppercase tracking-widest font-bold">
              ★ CERTIFICACIÓN EDITORIAL EVO ★
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
              Edición revisada y contrastada contra instrumental de laboratorio de hardware.
            </p>
            <div className="mt-2 text-[9px] font-mono-tech text-zinc-500">
              EXPEDIENTE METROLÓGICO REGISTRADO // 2026
            </div>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};
