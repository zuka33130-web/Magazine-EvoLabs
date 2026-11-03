import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Microscope, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Page02Manifesto: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-02"
      pageNumber={2}
      totalPages={46}
      sectionTitle="MANIFIESTO FUNDACIONAL"
      subSlug="FILOSOFÍA EDITORIAL // TOMO 01"
      accentColor="#EAB308"
    >
      {/* Top Banner / Section Header */}
      <div className="mb-3 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            0x01 // MANIFIESTO UNDERGROUND & PASAPORTE BASAL
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-0.5">
            No adivines. Comprobalo.
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          EXPEDIENTE NIVEL 0x01 // EDICIÓN INTEGRAL
        </span>
      </div>

      {/* Main Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        
        {/* Left 8 cols: Human Truth & Narrative Body */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Main Provocative Quote */}
          <div className="p-3.5 bg-gradient-to-br from-yellow-400/10 via-[#10131c] to-[#0a0c12] border border-yellow-400/30 rounded-lg shadow-md">
            <span className="text-[9px] font-mono-tech text-yellow-400 uppercase tracking-widest font-black block mb-0.5">
              LA MÁXIMA DE LABORATORIO
            </span>
            <p className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight leading-snug">
              “HACEMOS MILAGROS, PERO LOS MEDIMOS.”
            </p>
            <p className="font-sans-editorial text-xs text-zinc-300 mt-1 leading-relaxed">
              La promesa suena a magia publicitaria, pero nuestra respuesta es exactamente la contraria: no existe el milagro si no puede demostrarse en un osciloscopio, en un sensor térmico o en una gráfica de frametimes.
            </p>
          </div>

          {/* 2 Narrative Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
            <div>
              <p className="magazine-dropcap text-zinc-200">
                Muchísima gente utiliza una computadora todos los días sin saber realmente qué máquina tiene delante. Sabe que compró “16 GB”. Sabe que el microprocesador “es Intel o AMD”. Sabe que tiene “un SSD”. Y sabe, con frustración, que “Windows anda lento o los juegos pegan tirones”.
              </p>
              <p className="mt-2 text-zinc-400">
                Pero todavía no sabe qué significan realmente esos datos en tiempo real, qué componente está saturado al 100%, qué cuello de botella está estrangulando al equipo, qué está funcionando en perfectas condiciones y qué <strong className="text-zinc-200 font-semibold">no debería tocar bajo ningún concepto</strong>.
              </p>
              <p className="mt-2 text-zinc-400">
                El software comercial de optimización y los supuestos "boosters de un clic" representan la mayor estafa psicológica de la informática. La memoria RAM vacía es memoria desperdiciada, y la asignación de prioridades responde a estrictos algoritmos de interrupción que ningún script genérico puede alterar sin colapsar la estabilidad del sistema.
              </p>
            </div>

            <div>
              <div className="p-2.5 bg-[#0d1017] border border-zinc-800 rounded-md mb-2">
                <span className="text-[9.5px] font-mono-tech text-yellow-400 font-bold uppercase block tracking-wider mb-0.5">
                  LA REGLA FUNDACIONAL
                </span>
                <p className="text-white font-display font-black text-xs sm:text-[13px] uppercase tracking-tight leading-tight">
                  TU PC NO ES MAGIA. ES UN SISTEMA. Y TODO SISTEMA DEJA PISTAS.
                </p>
              </div>

              <p className="text-zinc-200">
                Una computadora es una estructura electromagnética y térmica gobernada por leyes físicas deterministas. La corriente fluye a velocidades mensurables, la memoria intercambia paquetes en nanosegundos y los transistores disipan calor proporcional al voltaje.
              </p>
              <p className="mt-2 text-zinc-400">
                Cuando tu sistema se congela por doscientos milisegundos o un programa tarda en abrir, no es por mala suerte ni por un misterio inexplicable: <span className="text-white font-medium">una causa concreta provocó ese efecto</span>.
              </p>
              <p className="mt-2 text-zinc-200 font-medium">
                En <strong>EVO LABS</strong> no venimos a pedirte que creas. Venimos a enseñarte a <strong>observar</strong>, <strong>medir</strong> y <strong>comprobar</strong> con la precisión de un perito forense.
              </p>
            </div>
          </div>

          {/* Bottom Callout: Las 4 Pistas del Sistema */}
          <div className="mt-3 pt-2.5 border-t border-zinc-800/80">
            <span className="text-[9.5px] font-mono-tech font-bold uppercase tracking-widest text-zinc-400 block mb-2">
              QUÉ VAS A APRENDER A INTERPRETAR EN ESTE TOMO 01
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono-tech">
              <div className="p-2 bg-[#12151c] border border-zinc-800 rounded">
                <span className="text-yellow-400 font-bold block mb-0.5">01 // QUÉ TENÉS</span>
                <span className="text-zinc-400 text-[9.5px]">Desmonte comercial: hardware real vs etiquetas de marketing.</span>
              </div>
              <div className="p-2 bg-[#12151c] border border-zinc-800 rounded">
                <span className="text-yellow-400 font-bold block mb-0.5">02 // CÓMO TRABAJA</span>
                <span className="text-zinc-400 text-[9.5px]">Buses, jerarquía de nanosegundos y movimiento de datos.</span>
              </div>
              <div className="p-2 bg-[#12151c] border border-zinc-800 rounded">
                <span className="text-yellow-400 font-bold block mb-0.5">03 // CÓMO MEDIRLO</span>
                <span className="text-zinc-400 text-[9.5px]">Frametime, percentiles 1% Low, DPC Latency y sensores térmicos.</span>
              </div>
              <div className="p-2 bg-[#12151c] border border-zinc-800 rounded">
                <span className="text-yellow-400 font-bold block mb-0.5">04 // QUÉ TE LIMITA</span>
                <span className="text-zinc-400 text-[9.5px]">Identificación inequívoca del cuello de botella real de tu equipo.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 4 cols: Side Column Visual & Philosophy Card */}
        <div className="lg:col-span-4 bg-[#0d0f15] border border-zinc-800/90 rounded-lg p-4 flex flex-col justify-between h-full space-y-3">
          <div>
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-2.5">
              <span className="w-2 h-2 bg-yellow-400 inline-block shadow-[0_0_8px_rgba(234,179,8,0.7)]" />
              <h3 className="font-display font-black text-xs tracking-wider uppercase text-white">
                LA PROMESA EDITORIAL
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-sans-editorial text-zinc-300 leading-relaxed">
              <p>
                Este Tomo 01 es el punto de partida de toda la colección. Está diseñado para que cualquier persona, sin importar su nivel de partida, pueda sentarse frente a su teclado y auditar su computadora paso a paso.
              </p>
              
              <div className="p-2.5 bg-[#08090d] border border-yellow-400/30 rounded text-[10.5px] font-mono-tech space-y-1">
                <span className="text-yellow-400 font-bold block uppercase tracking-wider text-[9px]">
                  EL CAMBIO DE ESTADO:
                </span>
                <p className="text-zinc-400">
                  <span className="text-red-400 font-bold">ANTES:</span> “Tengo una computadora que anda lenta y no sé por qué.”
                </p>
                <p className="text-zinc-200">
                  <span className="text-yellow-400 font-bold">DESPUÉS:</span> “Sé exactamente qué máquina tengo, cómo fluyen sus datos, qué la limita y cómo comprobar cada cambio.”
                </p>
              </div>

              <p className="text-zinc-400 text-[11px]">
                No te pediremos que instales programas milagrosos de dudosa procedencia. Cada comando, cada prueba y cada auditoría que realizaremos utiliza instrumental nativo de Windows o herramientas técnicas de referencia mundial.
              </p>
            </div>
          </div>

          {/* Official Seal */}
          <div className="p-2.5 bg-black/60 border border-yellow-400/30 rounded-lg text-center font-mono-tech">
            <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest block">
              POSTURA METROLÓGICA EVO
            </span>
            <p className="text-[11px] text-white font-bold mt-0.5 uppercase">
              LA EVIDENCIA MATA A LA OPINIÓN
            </p>
            <span className="text-[8.5px] text-zinc-500 block mt-0.5">
              VOLUMEN I // EDICIÓN ANUAL 2026
            </span>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};
