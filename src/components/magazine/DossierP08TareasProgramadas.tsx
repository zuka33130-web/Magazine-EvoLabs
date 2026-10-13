import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Calendar, Terminal, ShieldCheck, AlertCircle, Clock, Copy, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const DossierP08TareasProgramadas: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-34"
      pageNumber={34}
      totalPages={46}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 08 // TAREAS PROGRAMADAS"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // EL PROGRAMADOR OCULTO // PÁGINA 08 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Tareas Programadas: Deshabilitar, No Eliminar
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          DISPARADORES SILENCIOSOS Y CONTROL DEL SISTEMA
        </span>
      </div>

      {/* Narrative Lead */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2.5">
        <div className="md:col-span-8 space-y-1.5">
          <p className="magazine-dropcap text-zinc-200">
            ¿Alguna vez notaste que al desbloquear la PC el disco o la CPU se aceleran durante unos segundos, o que se abren consolas negras efímeras? En muchos casos, la causa es el <strong className="text-white">Programador de Tareas (Task Scheduler)</strong> ejecutando rutinas automáticas en segundo plano.
          </p>
          <p className="text-zinc-400 text-[11px]">
            Ciertas aplicaciones instalan disparadores periódicos (updaters y telemetría). El principio rector es tajante: <strong className="text-yellow-400">DESHABILITAR, NUNCA ELIMINAR</strong>. Eliminar una tarea del programador puede ser difícil de recuperar si no se exportó previamente como XML; deshabilitar requiere un solo clic para apagar y un clic para reencender.
          </p>
        </div>

        <div className="md:col-span-4 bg-[#11141c] border border-yellow-500/30 rounded-lg p-2.5 font-mono-tech flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold uppercase mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>EL DISPARADOR OCULTO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug">
              Ciertas tareas tienen marcada la opción <em>"Reactivar el equipo para ejecutar esta tarea"</em>, una causa frecuente de equipos que despiertan de la suspensión.
            </p>
          </div>
          <span className="text-[9px] text-zinc-500 pt-1 border-t border-zinc-800 block">
            Consola nativa: Win+R → taskschd.msc
          </span>
        </div>
      </div>

      {/* Diagnostic Script (Read-Only PowerShell) */}
      <div className="bg-[#0b0e15] border border-yellow-500/40 rounded-lg p-2.5 mb-2 font-mono-tech">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-yellow-400 mb-1.5">
          <span className="font-bold uppercase flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            COMANDO DE DIAGNÓSTICO NATIVO // LECTURA SEGURA (POWERSHELL)
          </span>
          <span className="text-emerald-400 text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
            SOLO CONSULTA // NO MODIFICA NADA
          </span>
        </div>

        <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight mb-2">
          Abrí PowerShell como usuario estándar y pegá este comando. Aislará todas las tareas programadas activas que NO pertenecen al núcleo de Microsoft, permitiéndote auditar quién se ejecuta sin tocar archivos de sistema:
        </p>

        {/* Code Block with Tech Styling */}
        <div className="p-2.5 bg-black/80 rounded border border-zinc-800 text-[10px] text-emerald-300 overflow-x-auto select-all leading-relaxed font-mono-tech">
          <span className="text-zinc-500"># Listar tareas activas de terceros (excluye el árbol protegido de Microsoft)</span><br />
          <span className="text-yellow-400">Get-ScheduledTask</span> | <br />
          &nbsp;&nbsp;<span className="text-sky-300">Where-Object</span> &#123; $_.State <span className="text-rose-400">-ne</span> <span className="text-amber-300">'Disabled'</span> <span className="text-rose-400">-and</span> $_.TaskPath <span className="text-rose-400">-notlike</span> <span className="text-amber-300">'\Microsoft*'</span> &#125; | <br />
          &nbsp;&nbsp;<span className="text-sky-300">Select-Object</span> TaskName, TaskPath, State | <br />
          &nbsp;&nbsp;<span className="text-yellow-400">Format-Table</span> <span className="text-zinc-400">-AutoSize</span>
        </div>

        <div className="mt-2 pt-1 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] text-zinc-400">
          <div>
            <strong className="text-white block">QUÉ SÍ CONVIENE DESHABILITAR:</strong>
            <span>Updaters de programas secundarios que abrís de forma esporádica, y tareas huérfanas de programas que ya desinstalaste. Clic derecho en <code>taskschd.msc</code> → <strong>Deshabilitar</strong>.</span>
          </div>
          <div>
            <strong className="text-rose-400 block">QUÉ NUNCA TOCAR (BAJO \Microsoft\Windows\):</strong>
            <span>Tareas nativas del sistema como <code>Defrag / TRIM</code> para la salud de tus SSDs, el mantenimiento automático nocturno y los análisis programados de Windows Defender.</span>
          </div>
        </div>
      </div>

      {/* Common Culprits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] font-mono-tech">
        <div className="p-1.5 bg-[#12151f] rounded border border-zinc-800">
          <span className="text-yellow-400 font-bold block">1. Updaters Auxiliares de Navegador</span>
          <span className="text-zinc-400 text-[9px]">Disparador: Cada varias horas</span>
          <p className="text-zinc-500 text-[8px] mt-0.5 font-sans-editorial">Consultas recurrentes de versiones. Se pueden deshabilitar si actualizás tus navegadores manualmente desde su menú 'Acerca de'.</p>
        </div>

        <div className="p-1.5 bg-[#12151f] rounded border border-zinc-800">
          <span className="text-yellow-400 font-bold block">2. Updaters de Suites Ofimáticas / PDF</span>
          <span className="text-zinc-400 text-[9px]">Disparador: Fijo de madrugada</span>
          <p className="text-zinc-500 text-[8px] mt-0.5 font-sans-editorial">Lanzadores de fondo para lectores de documentos. Deshabilitar la tarea no impide abrir ni leer tus PDFs normalmente.</p>
        </div>

        <div className="p-1.5 bg-[#12151f] rounded border border-zinc-800">
          <span className="text-yellow-400 font-bold block">3. Telemetría de Aplicaciones OEM</span>
          <span className="text-zinc-400 text-[9px]">Disparador: Al iniciar sesión</span>
          <p className="text-zinc-500 text-[8px] mt-0.5 font-sans-editorial">Recopilación de estadísticas de fabricantes. Deshabilitable de forma segura sin afectar el funcionamiento del hardware.</p>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
