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
      <div className="mb-3 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            PRINCIPIO FUNDACIONAL // COMPROMISO PEDAGÓGICO
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-0.5">
            Pacto con el Lector
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          REF: EVO-PACT-001
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        
        {/* Left 8 cols: El Pacto Editorial */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Main Statement Banner */}
          <div className="p-3.5 bg-gradient-to-br from-yellow-400/10 via-[#10131c] to-[#0a0c12] border border-yellow-400/30 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="font-mono-tech text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
                DECLARACIÓN PRINCIPAL
              </span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
              NO ESTÁS SOLO.
            </h3>
            <p className="font-sans-editorial text-xs sm:text-[13px] text-zinc-300 mt-1 leading-relaxed">
              La informática moderna ha creado una barrera innecesaria de jerga incomprensible, foros hostiles y tutoriales veloces que asumen que ya sabés todo. Nuestro compromiso es derribar esa barrera con rigor, respeto y claridad absoluta.
            </p>
          </div>

          {/* El Método de Construcción */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
            <div className="space-y-2.5">
              <div className="p-2.5 bg-[#0d1017] border border-zinc-800 rounded-md">
                <span className="text-[9.5px] font-mono-tech text-yellow-400 uppercase font-black block tracking-wider mb-0.5">
                  MANDAMIENTO 01
                </span>
                <p className="text-white font-semibold text-xs leading-snug">
                  EVO NO PRESUPONE CONOCIMIENTO. LO CONSTRUYE.
                </p>
                <p className="text-zinc-400 text-[10.5px] mt-0.5">
                  No usamos términos complejos sin definirlos cuando aparecen por primera vez. Cada concepto de silicio, bus o ciclo de reloj se explica desde sus bases físicas.
                </p>
              </div>

              <p>
                Ningún paso es considerado “obvio”. El error más común de los manuales técnicos es omitir el clic intermedio que para el experto es reflejo inconsciente, pero para el principiante representa un abismo insalvable.
              </p>
              <p className="text-zinc-400">
                Aquí nadie tiene que fingir que entiende. Si un concepto requiere descomponerse en una analogía visual, lo descomponemos sin temor a perder seriedad: la pedagogía no compite con la exactitud técnica.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 bg-[#0d1017] border border-zinc-800 rounded-md">
                <span className="text-[9.5px] font-mono-tech text-yellow-400 uppercase font-black block tracking-wider mb-0.5">
                  MANDAMIENTO 02
                </span>
                <p className="text-white font-semibold text-xs leading-snug">
                  UNA RUTA. DOS VELOCIDADES.
                </p>
                <p className="text-zinc-400 text-[10.5px] mt-0.5">
                  El principiante puede leer cada línea con tranquilidad. El lector experimentado puede avanzar directamente a las tablas de telemetría y peritajes avanzados.
                </p>
              </div>

              <p>
                Nunca eliminamos información necesaria simplemente porque a un técnico le parezca elemental. Diseñamos páginas modulares donde los fundamentos y la telemetría profunda conviven armónicamente.
              </p>
              <p className="text-zinc-400">
                El usuario avanzado encontrará datos exactos: tiempos de acceso en nanosegundos, registros de memoria, estructuras del kernel de Windows y metodologías científicas A/B para corroborar cada afirmación.
              </p>
            </div>
          </div>

          {/* Los 5 Compromisos Inviolables */}
          <div className="p-3 bg-[#0e1119] border border-zinc-800 rounded-lg">
            <span className="text-[9.5px] font-mono-tech font-bold text-yellow-400 uppercase tracking-widest block mb-1.5">
              LOS 5 COMPROMISOS INVIOLABLES DE EVO LABS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 text-[10px] font-sans-editorial">
              <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded">
                <span className="font-mono-tech text-yellow-400 font-bold block text-[9px]">01 // CERO PLACEBO</span>
                <p className="text-zinc-400 text-[9.5px] mt-0.5">Si un ajuste no produce un cambio medible, no existe.</p>
              </div>
              <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded">
                <span className="font-mono-tech text-yellow-400 font-bold block text-[9px]">02 // CERO RIESGO CIEGO</span>
                <p className="text-zinc-400 text-[9.5px] mt-0.5">Siempre enseñamos a crear un punto de retorno antes de tocar.</p>
              </div>
              <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded">
                <span className="font-mono-tech text-yellow-400 font-bold block text-[9px]">03 // SIN MAGIA</span>
                <p className="text-zinc-400 text-[9.5px] mt-0.5">No usamos scripts oscuros de un clic que rompen dependencias.</p>
              </div>
              <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded">
                <span className="font-mono-tech text-yellow-400 font-bold block text-[9px]">04 // RIGOR OFICIAL</span>
                <p className="text-zinc-400 text-[9.5px] mt-0.5">Documentación directa de Intel, AMD, NVIDIA y Microsoft.</p>
              </div>
              <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded">
                <span className="font-mono-tech text-yellow-400 font-bold block text-[9px]">05 // TU EXPEDIENTE</span>
                <p className="text-zinc-400 text-[9.5px] mt-0.5">Toda la evidencia y registros quedan en tu poder, en tu máquina.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right 4 cols: Cuadro Editorial Oficial */}
        <div className="lg:col-span-4 bg-[#0d0f15] border border-zinc-800/90 rounded-lg p-4 flex flex-col justify-between h-full space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
              <span className="font-mono-tech text-[9.5px] font-black text-yellow-400 uppercase tracking-wider">
                DIVISIÓN EDITORIAL // CRÉDITOS
              </span>
              <span className="text-[9px] font-mono-tech text-zinc-500">
                TOMO 01 // 2026
              </span>
            </div>

            <div className="space-y-2.5 font-mono-tech text-xs">
              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded">
                <span className="text-[8.5px] text-zinc-500 uppercase tracking-widest block">DIRECCIÓN TÉCNICA & METROLOGÍA</span>
                <p className="text-white font-bold text-xs mt-0.5">EVO LABS ENGINEERING CORE</p>
                <p className="text-[10px] text-yellow-400/90 font-sans-editorial mt-0.5">Peritaje de silicio y banco de pruebas</p>
              </div>

              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded">
                <span className="text-[8.5px] text-zinc-500 uppercase tracking-widest block">ARQUITECTURA DE SISTEMAS & WINDOWS</span>
                <p className="text-white font-bold text-xs mt-0.5">LABORATORIO DE RENDIMIENTO BASAL</p>
                <p className="text-[10px] text-zinc-400 font-sans-editorial mt-0.5">Análisis de kernel Ring 0, DPC latency y servicios</p>
              </div>

              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded">
                <span className="text-[8.5px] text-zinc-500 uppercase tracking-widest block">DIRECCIÓN PEDAGÓGICA & GUIÓN</span>
                <p className="text-white font-bold text-xs mt-0.5">CÁTEDRA DE DIVULGACIÓN TÉCNICA</p>
                <p className="text-[10px] text-zinc-400 font-sans-editorial mt-0.5">Metodología de una ruta y dos velocidades</p>
              </div>

              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded">
                <span className="text-[8.5px] text-zinc-500 uppercase tracking-widest block">DISEÑO EDITORIAL & INFOGRAFÍA</span>
                <p className="text-white font-bold text-xs mt-0.5">EVO DESIGN DIVISION</p>
                <p className="text-[10px] text-zinc-400 font-sans-editorial mt-0.5">Doctrina visual de alta precisión A4</p>
              </div>
            </div>
          </div>

          {/* Sello de Autenticidad */}
          <div className="p-2.5 bg-yellow-400/5 border border-yellow-400/30 rounded-lg text-center font-mono-tech">
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
