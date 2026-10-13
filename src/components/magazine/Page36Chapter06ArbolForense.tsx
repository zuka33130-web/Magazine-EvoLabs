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
                <span className="font-mono-tech font-bold text-xs text-emerald-400 uppercase">PASO 01 // ENTORNO DE PRUEBA</span>
                <span className="text-[10px] font-mono-tech text-zinc-500">AISLAMIENTO</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase mb-1">
                Aislamiento por Entorno Seguro
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Iniciá Windows en Modo Seguro o probá un entorno limpio. Si el fallo desaparece en Modo Seguro o en otro entorno, aumenta la sospecha sobre drivers, servicios o software, pero esto NO descarta completamente una falla de hardware.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-emerald-400 font-semibold">
              REGLA: EL ENTORNO REDUCE EL RANGO DE VARIABLES.
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-[#0a1310] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-zinc-400 uppercase">PASO 02 // ANÁLISIS DE FALLO</span>
                <span className="text-[10px] font-mono-tech text-zinc-500">ANÁLISIS DE DUMP</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase mb-1">
                Decodificación de Pantalla Azul
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Los bugchecks son pistas. Cada código puede tener múltiples causas. Se debe analizar el archivo dump (minidump), los módulos implicados (.sys), los registros de eventos de Windows y el contexto operativo en el momento exacto de la falla.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-zinc-400 font-semibold">
              REGLA: EL CÓDIGO REDUCE EL CAMPO DE INVESTIGACIÓN; NO CONFIRMA POR SÍ SOLO LA CAUSA.
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-[#0a1310] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-zinc-400 uppercase">PASO 03 // CARGA SINTÉTICA AISLADA</span>
                <span className="text-[10px] font-mono-tech text-zinc-500">ESTRÉS CONTROLADO</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase mb-1">
                Estrés Específico por Componente
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Aplicá pruebas de carga focalizadas (CPU, memoria o GPU por separado). Una caída bajo una carga concreta aumenta la sospecha sobre ese subsistema, pero NO demuestra automáticamente que una única pieza sea culpable sin contrastar temperaturas, voltajes y estabilidad del bus.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-zinc-400 font-semibold">
              REGLA: UNA CARGA AISLADA PERMITE MEDIR RESPUESTAS FOCALIZADAS.
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-[#0a1310] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-zinc-400 uppercase">PASO 04 // EVENT ID 41</span>
                <span className="text-[10px] font-mono-tech text-zinc-500">KERNEL-POWER</span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase mb-1">
                Event ID 41 / Reinicio Inesperado
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Kernel-Power 41 indica que Windows detectó que el apagado o reinicio anterior no fue limpio. NO identifica la causa por sí mismo. Puede aparecer por pérdida de alimentación, PSU, reset manual, bugcheck previo, bloqueo, sobretemperatura, hardware, software u otros escenarios. Revisar además: BugcheckCode, eventos anteriores, dump, temperaturas, alimentación y condiciones en las que ocurrió.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-zinc-400 font-semibold">
              REGLA: EVENT ID 41 REGISTRA EL SÍNTOMA; LA CAUSA REQUIERE CORRELACIÓN.
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
