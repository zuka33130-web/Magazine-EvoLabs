import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Folder, Key, Calendar, Cpu, Bell, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';

export const DossierP02PuertasArranque: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-24"
      pageNumber={24}
      totalPages={41}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 flex-1 mb-2 font-mono-tech">
        
        {/* Door 1: Startup Folders */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                <Folder className="w-3.5 h-3.5" />
                <span>PUERTA 01 // CARPETAS DE INICIO</span>
              </div>
              <span className="text-[8px] bg-yellow-400/10 text-yellow-300 px-1 py-0.5 rounded border border-yellow-400/20">TRADICIONAL</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              La compuerta histórica más antigua. Cualquier acceso directo colocado aquí se lanza automáticamente al iniciar sesión en el escritorio.
            </p>
            <div className="space-y-1 text-[9px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block">RUTA DE ACCESO RÁPIDO (Win+R):</span>
              <code className="text-emerald-400 block font-bold">shell:startup</code>
              <code className="text-zinc-400 block text-[8px] truncate">shell:common startup (Todos los usuarios)</code>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 pt-1.5 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Alta</span>
            <span className="text-emerald-400">Fácil de auditar</span>
          </div>
        </div>

        {/* Door 2: Windows Registry Run Keys */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                <Key className="w-3.5 h-3.5" />
                <span>PUERTA 02 // CLAVES DE REGISTRO</span>
              </div>
              <span className="text-[8px] bg-amber-400/10 text-amber-300 px-1 py-0.5 rounded border border-amber-400/20">SISTÉMICO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              El Registro de Windows alberga las ramas <em>Run</em> y <em>RunOnce</em>. Todo ejecutable listado en estas claves se invoca silenciosamente antes de mostrar iconos.
            </p>
            <div className="space-y-1 text-[9px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block">CLAVES CRÍTICAS (regedit.exe):</span>
              <code className="text-amber-300 block text-[8px] truncate">HKCU\Software\Microsoft\Windows\CurrentVersion\Run</code>
              <code className="text-amber-300 block text-[8px] truncate">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run</code>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 pt-1.5 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Media</span>
            <span className="text-amber-400">Usado por 80% apps</span>
          </div>
        </div>

        {/* Door 3: Task Scheduler */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>PUERTA 03 // TAREAS PROGRAMADAS</span>
              </div>
              <span className="text-[8px] bg-sky-400/10 text-sky-300 px-1 py-0.5 rounded border border-sky-400/20">SILENCIOSO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              El Programador de Tareas contiene disparadores como <em>"Al iniciar sesión"</em> o <em>"Al desbloquear el equipo"</em> con privilegios elevados de SYSTEM.
            </p>
            <div className="space-y-1 text-[9px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block">CONSOLA NATIVA (Win+R):</span>
              <code className="text-sky-300 block font-bold">taskschd.msc</code>
              <span className="text-zinc-400 text-[8px] block">Biblioteca del programador → Tareas de terceros</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 pt-1.5 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Baja</span>
            <span className="text-yellow-400">Oculta telemetría</span>
          </div>
        </div>

        {/* Door 4: Windows Services */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>PUERTA 04 // SERVICIOS EN AUTO</span>
              </div>
              <span className="text-[8px] bg-purple-400/10 text-purple-300 px-1 py-0.5 rounded border border-purple-400/20">KERNEL / RING 0-3</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              Procesos que arrancan antes de que ingreses tu contraseña. Si tienen tipo de inicio <em>"Automático"</em>, consumen memoria y ciclos desde el encendido.
            </p>
            <div className="space-y-1 text-[9px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block">CONSOLA DE SERVICIOS (Win+R):</span>
              <code className="text-purple-300 block font-bold">services.msc</code>
              <span className="text-zinc-400 text-[8px] block">Filtro clave: Ordenar por "Tipo de inicio"</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 pt-1.5 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Oculta</span>
            <span className="text-rose-400">Peligro si se toca mal</span>
          </div>
        </div>

        {/* Door 5: System Tray & Minimized Launchers */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                <Bell className="w-3.5 h-3.5" />
                <span>PUERTA 05 // BANDEJA DE SISTEMA</span>
              </div>
              <span className="text-[8px] bg-emerald-400/10 text-emerald-300 px-1 py-0.5 rounded border border-emerald-400/20">TRAY ICONS</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              Junto al reloj de Windows. Las aplicaciones con interfaz gráfica minimizada quedan ancladas en memoria lista para responder, consumiendo RAM sin aviso.
            </p>
            <div className="space-y-1 text-[9px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block">UBICACIÓN VISUAL:</span>
              <span className="text-emerald-300 block font-bold">Flecha inferior derecha (^ junto a reloj)</span>
              <span className="text-zinc-400 text-[8px] block">Discord, Steam, periféricos RGB, OneDrive</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 pt-1.5 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Visible</span>
            <span className="text-emerald-400">Fácil de desactivar</span>
          </div>
        </div>

        {/* Door 6: Updaters & Background Helpers */}
        <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>PUERTA 06 // UPDATERS AUXILIARES</span>
              </div>
              <span className="text-[8px] bg-rose-400/10 text-rose-300 px-1 py-0.5 rounded border border-rose-400/20">PARÁSITO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              Procesos satélites instalados por navegadores o clientes (Google Update, Edge Update, Adobe Helper). Consultan servidores externos al boot de forma persistente.
            </p>
            <div className="space-y-1 text-[9px] bg-black/40 p-1.5 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block">ORIGEN HABITUAL:</span>
              <span className="text-rose-300 block font-bold">Servicios independientes + Tareas combinadas</span>
              <span className="text-zinc-400 text-[8px] block">Verifican versiones sin que abras el programa</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 pt-1.5 mt-1 border-t border-zinc-800/60 flex justify-between items-center">
            <span>Visibilidad: Oculta</span>
            <span className="text-amber-400">Optimizable</span>
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
