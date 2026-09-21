import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { GitBranch, AlertOctagon, Terminal, Search, CheckCircle2 } from 'lucide-react';

export const Page36Chapter06ArbolForense: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-40"
      pageNumber={40}
      totalPages={46}
      sectionTitle="CAPÍTULO 06"
      subSlug="PROTOCOLO PERICIAL // ÁRBOL DE AISLAMIENTO"
      accentColor="#10B981"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono-tech tracking-widest text-emerald-400 uppercase font-bold">
              PROTOCOLO PERICIAL // CAPÍTULO 06
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Árbol Forense de Aislamiento
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            4 PASOS SECUENCIALES
          </span>
        </div>

        {/* Narrative Context */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            Jamás cambies dos cosas al mismo tiempo. Si modificás el voltaje y al mismo tiempo actualizás el driver de video, nunca sabrás cuál de las dos acciones solucionó el problema o introdujo un nuevo error. Seguí este camino deductivo en orden estricto:
          </p>
        </div>

        {/* 4 Clean Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          
          {/* Step 1 */}
          <div className="p-4 bg-[#0a1310] border border-emerald-500/30 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-emerald-400 uppercase">PASO 01 // SOFTWARE O HARDWARE</span>
                <span className="text-[10px] font-mono-tech text-zinc-500">BOOT LIMPIO</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase mb-1">
                Aislamiento por Entorno Seguro
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Iniciá Windows en Modo Seguro o cargá un Live USB de Ubuntu. Si la anomalía desaparece por completo en este entorno, tu silicio y tu fuente están físicamente sanos: la causa es un driver, servicio o software en conflicto.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-emerald-400 font-semibold">
              REGLA: DESCARTA EL HARDWARE EN 5 MINUTOS.
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-[#0a1310] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-zinc-400 uppercase">PASO 02 // FIRMA DEL COLAPSO</span>
                <span className="text-[10px] font-mono-tech text-zinc-500">ANÁLISIS DE DUMP</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase mb-1">
                Decodificación de Pantalla Azul
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Abrí la herramienta gratuita <strong className="text-white">WhoCrashed</strong> o <strong className="text-white">BlueScreenView</strong>. Identificá el código de bugcheck: <code className="text-yellow-400">WHEA_UNCORRECTABLE_ERROR</code> indica inestabilidad de voltaje o CPU; <code className="text-sky-400">MEMORY_MANAGEMENT</code> apunta a timings de RAM o slots; <code className="text-emerald-400">DPC_WATCHDOG_VIOLATION</code> apunta a drivers de SSD o GPU.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-zinc-400 font-semibold">
              REGLA: EL CÓDIGO TE DICE EL SUBSISTEMA EXACTO.
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-[#0a1310] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-zinc-400 uppercase">PASO 03 // CARGA SINTÉTICA AISLADA</span>
                <span className="text-[10px] font-mono-tech text-zinc-500">ESTRÉS SEPARADO</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase mb-1">
                Tortura por Componente
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                No uses un juego para diagnosticar: los juegos usan todo a la vez. Ejecutá <strong className="text-white">Prime95 Small FFTs</strong> durante 20 minutos (estrés 100% CPU/VRM). Si es estable, pasá a <strong className="text-white">MemTest86</strong> (RAM). Luego a <strong className="text-white">FurMark</strong> (GPU pura). En el momento en que se caiga, habrás aislado el culpable.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-zinc-400 font-semibold">
              REGLA: UNA SOLA PIEZA BAJO CARGA A LA VEZ.
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-[#0a1310] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-zinc-400 uppercase">PASO 04 // REINICIO EN SECO</span>
                <span className="text-[10px] font-mono-tech text-zinc-500">EVENTO ID 41</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase mb-1">
                Diagnóstico de Fuente de Poder
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Si la computadora se apaga o reinicia instantáneamente en negro sin pantalla azul (como si le hubieran quitado el cable de repente), se activó la protección OCP/OPP de la fuente de poder ante un transitorio de la GPU, o las temperaturas de la CPU cruzaron los 105°C de corte térmico directo.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-zinc-400 font-semibold">
              REGLA: CORTE TOTAL = SUMINISTRO O TEMPERATURA CRÍTICA.
            </div>
          </div>

        </div>

        {/* Bottom Rule */}
        <div className="p-3 bg-[#0a1410] border-l-3 border-emerald-500 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
            <strong className="text-emerald-400 font-bold">MANDAMIENTO EVO:</strong> Primero recolectar evidencia en reposo, luego reproducir el fallo bajo carga aislada, y recién entonces aplicar la solución quirúrgica.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 07 // PASAR DDU DE RUTINA →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
