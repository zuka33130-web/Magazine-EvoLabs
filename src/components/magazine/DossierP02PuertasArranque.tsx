import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Folder, Key, Calendar, Cpu, Bell, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';

export const DossierP02PuertasArranque: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-28"
      pageNumber={28}
      totalPages={46}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 02 // INFOGRAFÍA TÉCNICA"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // MAPA DEL ARRANQUE // PÁGINA 02 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Las Puertas del Arranque
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          DÓNDE SE ESCONDE EL SOFTWARE AL ENCENDER
        </span>
      </div>

      {/* Intro text */}
      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2.5">
        Cuando pulsás el botón de encendido de tu PC y colocás tu contraseña, Windows no ejecuta simplemente tu fondo de pantalla: atraviesa una secuencia de <strong className="text-white">6 compuertas de inicio paralelas</strong>. Muchos desarrolladores configuran sus procesos en el Registro, en Tareas Programadas o como Servicios en segundo plano. Este es el mapa técnico para ubicarlos y entender exactamente qué rol cumple cada uno.
      </p>

      {/* Main Infographic Grid: 6 Startup Doors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 mb-2 font-mono-tech">
        
        {/* Door 1: Startup Folders */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[11px] font-bold">
                <Folder className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">PUERTA 01 // CARPETAS</span>
              </div>
              <span className="text-[7.5px] bg-yellow-400/10 text-yellow-300 px-1 py-0.5 rounded border border-yellow-400/20 shrink-0">INICIO</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Accesos directos en carpetas de usuario que se abren al iniciar sesión.
            </p>
            <div className="space-y-0.5 text-[8.5px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[7.5px]">RUTA RÁPIDA (Win+R):</span>
              <code className="text-emerald-400 block font-bold truncate">shell:startup</code>
              <code className="text-zinc-400 block text-[7.5px] truncate">shell:common startup</code>
            </div>
          </div>
          <div className="text-[8px] text-zinc-500 pt-1 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Alta</span>
            <span className="text-emerald-400 font-bold">Fácil auditar</span>
          </div>
        </div>

        {/* Door 2: Windows Registry Run Keys */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[11px] font-bold">
                <Key className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">PUERTA 02 // REGISTRO</span>
              </div>
              <span className="text-[7.5px] bg-amber-400/10 text-amber-300 px-1 py-0.5 rounded border border-amber-400/20 shrink-0">RUN KEYS</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Ramas Run y RunOnce del Registro que ejecutan apps al cargar sesión.
            </p>
            <div className="space-y-0.5 text-[8.5px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[7.5px]">CLAVES PRINCIPALES:</span>
              <code className="text-amber-300 block text-[7.5px] truncate">HKCU\...\Run</code>
              <code className="text-amber-300 block text-[7.5px] truncate">HKLM\...\Run</code>
            </div>
          </div>
          <div className="text-[8px] text-zinc-500 pt-1 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Media</span>
            <span className="text-amber-400 font-bold">Uso habitual</span>
          </div>
        </div>

        {/* Door 3: Task Scheduler */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[11px] font-bold">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">PUERTA 03 // TAREAS</span>
              </div>
              <span className="text-[7.5px] bg-sky-400/10 text-sky-300 px-1 py-0.5 rounded border border-sky-400/20 shrink-0">SCHEDULER</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Disparadores configurados para ejecutarse al logueo o por evento.
            </p>
            <div className="space-y-0.5 text-[8.5px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[7.5px]">CONSOLA NATIVA (Win+R):</span>
              <code className="text-sky-300 block font-bold">taskschd.msc</code>
              <span className="text-zinc-400 text-[7.5px] block truncate">Biblioteca del programador</span>
            </div>
          </div>
          <div className="text-[8px] text-zinc-500 pt-1 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Media</span>
            <span className="text-sky-400 font-bold">Segundo plano</span>
          </div>
        </div>

        {/* Door 4: Windows Services */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[11px] font-bold">
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">PUERTA 04 // SERVICIOS</span>
              </div>
              <span className="text-[7.5px] bg-purple-400/10 text-purple-300 px-1 py-0.5 rounded border border-purple-400/20 shrink-0">SERVICES</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Procesos de fondo iniciados automáticamente antes o durante el login.
            </p>
            <div className="space-y-0.5 text-[8.5px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[7.5px]">CONSOLA (Win+R):</span>
              <code className="text-purple-300 block font-bold">services.msc</code>
              <span className="text-zinc-400 text-[7.5px] block truncate">Filtrar por 'Automático'</span>
            </div>
          </div>
          <div className="text-[8px] text-zinc-500 pt-1 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Sistémica</span>
            <span className="text-purple-400 font-bold">Auditar con rigor</span>
          </div>
        </div>

        {/* Door 5: System Tray & Minimized Launchers */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[11px] font-bold">
                <Bell className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">PUERTA 05 // BANDEJA</span>
              </div>
              <span className="text-[7.5px] bg-emerald-400/10 text-emerald-300 px-1 py-0.5 rounded border border-emerald-400/20 shrink-0">TRAY ICONS</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Iconos junto al reloj que mantienen interfaces listas en memoria.
            </p>
            <div className="space-y-0.5 text-[8.5px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[7.5px]">UBICACIÓN VISUAL:</span>
              <span className="text-emerald-300 block font-bold text-[8px] truncate">Flecha de bandeja (^ reloj)</span>
              <span className="text-zinc-400 text-[7.5px] block truncate">Lanzadores, chats, audio</span>
            </div>
          </div>
          <div className="text-[8px] text-zinc-500 pt-1 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Visible</span>
            <span className="text-emerald-400 font-bold">Configurable</span>
          </div>
        </div>

        {/* Door 6: Updaters & Background Helpers */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[11px] font-bold">
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">PUERTA 06 // UPDATERS</span>
              </div>
              <span className="text-[7.5px] bg-amber-400/10 text-amber-300 px-1 py-0.5 rounded border border-amber-400/20 shrink-0">AUXILIARES</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Procesos auxiliares instalados por navegadores o clientes. Actividad legítima no significa necesariamente que deba ejecutarse en cada arranque.
            </p>
            <div className="space-y-0.5 text-[8.5px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[7.5px]">MECANISMO HABITUAL:</span>
              <span className="text-amber-300 block font-bold text-[8px] truncate">Servicios manuales / Tareas</span>
              <span className="text-zinc-400 text-[7.5px] block truncate">Actualización bajo demanda</span>
            </div>
          </div>
          <div className="text-[8px] text-zinc-500 pt-1 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Oculta</span>
            <span className="text-amber-400 font-bold">Optimizable</span>
          </div>
        </div>

      </div>

      {/* Forensic Tip Footer */}
      <div className="p-2 bg-[#12151e] border border-yellow-500/30 rounded flex items-center justify-between text-[10px] font-mono-tech text-zinc-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>
            <strong className="text-white">CONSEJO TÉCNICO EVO:</strong> El Administrador de Tareas (Ctrl+Shift+Esc) solo te muestra la Puerta 01 y parte de la Puerta 02. Para las Puertas 03, 04 y 06, la herramienta avanzada de diagnóstico oficial de referencia es <strong className="text-yellow-400">Sysinternals Autoruns</strong> de Microsoft.
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
