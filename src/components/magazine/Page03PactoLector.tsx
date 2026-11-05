import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Users, Compass, Gauge, Shield, Award, CheckCircle } from 'lucide-react';

export const Page03PactoLector: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-03"
      pageNumber={3}
      totalPages={46}
      sectionTitle="PACTO EDITORIAL"
      subSlug="RELACIÓN CON EL LECTOR // COMPROMISO ÉTICO"
      accentColor="#EAB308"
    >
      {/* Top Banner / Section Header */}
      <div className="mb-3 pb-1 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="evo-label-badge text-yellow-400 block mb-0.5">
            PRINCIPIO FUNDACIONAL // COMPROMISO PEDAGÓGICO
          </span>
          <h2 className="evo-page-title mt-0.5">
            Pacto con el Lector
          </h2>
        </div>
        <span className="evo-metadata-tech uppercase tracking-wider hidden sm:inline">
          REF: EVO-PACT-001
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* Left 8 cols: El Pacto Editorial */}
        <div className="lg:col-span-8 space-y-3 editorial-prose">
          
          {/* Main Statement Banner */}
          <div className="p-4 bg-gradient-to-r from-yellow-400/10 via-[#10131b] to-transparent border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span className="evo-label-badge text-yellow-400 block">
                DECLARACIÓN PRINCIPAL
              </span>
            </div>
            <h3 className="evo-card-title text-white">
              NO ESTÁS SOLO.
            </h3>
            <p className="evo-body-primary mt-1">
              La informática moderna ha creado una barrera innecesaria de jerga incomprensible, foros hostiles y tutoriales veloces que asumen que ya sabés todo. Nuestro compromiso es derribar esa barrera con rigor, respeto y claridad absoluta.
            </p>
          </div>

          {/* El Método de Construcción */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 evo-body-primary">
              <div className="p-3 bg-[#0d1017] border border-zinc-800 rounded-md">
                <span className="evo-label-badge text-yellow-400 block mb-1">
                  MANDAMIENTO 01
                </span>
                <p className="text-white font-semibold text-xs leading-snug">
                  EVO NO PRESUPONE CONOCIMIENTO. LO CONSTRUYE.
                </p>
                <p className="text-zinc-400 text-[11px] mt-1">
                  No usamos términos complejos sin definirlos cuando aparecen por primera vez. Cada concepto de silicio, bus o ciclo de reloj se explica desde sus bases físicas.
                </p>
              </div>

              <p>
                Ningún paso es considerado “obvio”. El error más común de los manuales técnicos es omitir el clic intermedio que para el experto es reflejo inconsciente, pero para el principiante representa un abismo insalvable.
              </p>
            </div>

            <div className="space-y-2 evo-body-primary">
              <div className="p-3 bg-[#0d1017] border border-zinc-800 rounded-md">
                <span className="evo-label-badge text-yellow-400 block mb-1">
                  MANDAMIENTO 02
                </span>
                <p className="text-white font-semibold text-xs leading-snug">
                  UNA RUTA. DOS VELOCIDADES.
                </p>
                <p className="text-zinc-400 text-[11px] mt-1">
                  El principiante puede leer cada línea con tranquilidad. El lector experimentado puede avanzar directamente a las tablas de telemetría y peritajes avanzados.
                </p>
              </div>

              <p>
                Nunca eliminamos información necesaria simplemente porque a un técnico le parezca elemental. Diseñamos páginas modulares donde los fundamentos y la telemetría profunda conviven armónicamente.
              </p>
            </div>
          </div>

          {/* Los 5 Compromisos Inviolables */}
          <div className="p-3 bg-[#0e1119] border border-zinc-800 rounded-lg">
            <span className="evo-label-badge text-yellow-400 block mb-2">
              LOS 5 COMPROMISOS INVIOLABLES DE EVO LABS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <div className="p-2 bg-black/40 border border-zinc-800/80 rounded">
                <span className="evo-label-badge text-yellow-400 block mb-0.5">01 // CERO PLACEBO</span>
                <p className="evo-metadata-tech text-zinc-400">Si un ajuste no produce un cambio medible, no existe.</p>
              </div>
              <div className="p-2 bg-black/40 border border-zinc-800/80 rounded">
                <span className="evo-label-badge text-yellow-400 block mb-0.5">02 // CERO RIESGO CIEGO</span>
                <p className="evo-metadata-tech text-zinc-400">Siempre enseñamos a crear un punto de retorno antes de tocar.</p>
              </div>
              <div className="p-2 bg-black/40 border border-zinc-800/80 rounded">
                <span className="evo-label-badge text-yellow-400 block mb-0.5">03 // SIN MAGIA</span>
                <p className="evo-metadata-tech text-zinc-400">No usamos scripts oscuros de un clic que rompen dependencias.</p>
              </div>
              <div className="p-2 bg-black/40 border border-zinc-800/80 rounded">
                <span className="evo-label-badge text-yellow-400 block mb-0.5">04 // RIGOR OFICIAL</span>
                <p className="evo-metadata-tech text-zinc-400">Documentación directa de Intel, AMD, NVIDIA y Microsoft.</p>
              </div>
              <div className="p-2 bg-black/40 border border-zinc-800/80 rounded">
                <span className="evo-label-badge text-yellow-400 block mb-0.5">05 // TU EXPEDIENTE</span>
                <p className="evo-metadata-tech text-zinc-400">Toda la evidencia y registros quedan en tu poder, en tu máquina.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right 4 cols: Cuadro Editorial Oficial */}
        <div className="lg:col-span-4 bg-[#0d0f15] border border-zinc-800/90 rounded-lg p-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
              <span className="font-mono-tech text-[10px] font-black text-yellow-400 uppercase tracking-wider">
                DIVISIÓN EDITORIAL // CRÉDITOS
              </span>
              <span className="text-[9px] font-mono-tech text-zinc-500">
                TOMO 01 // 2026
              </span>
            </div>

            <div className="space-y-3 font-mono-tech text-xs">
              <div className="p-2.5 bg-black/50 border border-zinc-800/80 rounded">
                <span className="text-[8.5px] text-zinc-500 uppercase tracking-widest block">DIRECCIÓN TÉCNICA & METROLOGÍA</span>
                <p className="text-white font-bold text-xs mt-0.5">EVO LABS ENGINEERING CORE</p>
                <p className="text-[10px] text-yellow-400/90 font-sans-editorial mt-0.5">Peritaje de silicio y banco de pruebas</p>
              </div>

              <div className="p-2.5 bg-black/50 border border-zinc-800/80 rounded">
                <span className="text-[8.5px] text-zinc-500 uppercase tracking-widest block">ARQUITECTURA DE SISTEMAS & WINDOWS</span>
                <p className="text-white font-bold text-xs mt-0.5">LABORATORIO DE RENDIMIENTO BASAL</p>
                <p className="text-[10px] text-zinc-400 font-sans-editorial mt-0.5">Análisis de kernel Ring 0, DPC latency y servicios</p>
              </div>

              <div className="p-2.5 bg-black/50 border border-zinc-800/80 rounded">
                <span className="text-[8.5px] text-zinc-500 uppercase tracking-widest block">DIRECCIÓN PEDAGÓGICA & GUIÓN</span>
                <p className="text-white font-bold text-xs mt-0.5">CÁTEDRA DE DIVULGACIÓN TÉCNICA</p>
                <p className="text-[10px] text-zinc-400 font-sans-editorial mt-0.5">Metodología de una ruta y dos velocidades</p>
              </div>

              <div className="p-2.5 bg-black/50 border border-zinc-800/80 rounded">
                <span className="text-[8.5px] text-zinc-500 uppercase tracking-widest block">DISEÑO EDITORIAL & INFOGRAFÍA</span>
                <p className="text-white font-bold text-xs mt-0.5">EVO DESIGN DIVISION</p>
                <p className="text-[10px] text-zinc-400 font-sans-editorial mt-0.5">Doctrina visual de alta precisión A4</p>
              </div>
            </div>
          </div>

          {/* Sello de Autenticidad */}
          <div className="p-3 bg-yellow-400/5 border border-yellow-400/30 rounded-lg text-center font-mono-tech">
            <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest block">
              COMPROMISO DE RIGOR
            </span>
            <p className="text-[10.5px] text-zinc-200 mt-0.5 font-sans-editorial leading-tight">
              Cada prueba incluida en esta publicación fue ejecutada y medida en bancos reales de laboratorio.
            </p>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};
