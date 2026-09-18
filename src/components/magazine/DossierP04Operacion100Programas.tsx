import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { CheckSquare, ShieldBan, Trash2, Search, Zap, AlertTriangle, Layers } from 'lucide-react';

export const DossierP04Operacion100Programas: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-26"
      pageNumber={26}
      totalPages={41}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 04 // OPERACIÓN 100 PROGRAMAS"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // AUDITORÍA SIN PÁNICO // PÁGINA 04 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Operación 100 Programas
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          MÉTODO DE CLASIFICACIÓN EN 5 CANASTOS
        </span>
      </div>

      {/* Narrative Lead */}
      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2.5">
        Al abrir <em>Configuración → Aplicaciones → Aplicaciones instaladas</em>, el usuario promedio se asusta al ver más de 90 o 120 programas listados. El error impulsivo es empezar a desinstalar a ciegas por nombres que suenan raros, rompiendo librerías críticas de las que dependen juegos y herramientas de trabajo. La <strong className="text-white">Operación 100 Programas</strong> establece un protocolo técnico de orden en 5 categorías claras.
      </p>

      {/* The 5 Sorting Baskets (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 flex-1 mb-2 font-mono-tech">
        
        {/* Basket 1: Conservar */}
        <div className="bg-[#0e1118] border border-emerald-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>01 // CONSERVAR</span>
              </div>
              <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded">USO ACTIVO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Software que utilizás semanalmente: navegadores principales, suites de trabajo, software de edición y tus juegos activos.
            </p>
            <div className="bg-black/40 p-1.5 rounded border border-zinc-800/80 text-[9px] text-zinc-400 space-y-0.5">
              <span className="text-emerald-400 font-bold block">EJEMPLOS TÍPICOS:</span>
              <span>• Chrome / Firefox / Brave</span>
              <span>• OBS Studio / DaVinci Resolve</span>
              <span>• Juegos instalados y jugados actualmente</span>
            </div>
          </div>
          <span className="text-[9px] text-zinc-500 pt-1 border-t border-zinc-800/60 mt-1 block">
            ACCIÓN: Mantener actualizados y configurados.
          </span>
        </div>

        {/* Basket 2: Deshabilitar del Inicio */}
        <div className="bg-[#0e1118] border border-sky-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>02 // APAGAR DEL INICIO</span>
              </div>
              <span className="text-[8px] bg-sky-500/20 text-sky-300 px-1 py-0.2 rounded">BAJO DEMANDA</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Programas legítimos y útiles que NO necesitás que arranquen con Windows secuestrando recursos al encender.
            </p>
            <div className="bg-black/40 p-1.5 rounded border border-zinc-800/80 text-[9px] text-zinc-400 space-y-0.5">
              <span className="text-sky-400 font-bold block">EJEMPLOS TÍPICOS:</span>
              <span>• Steam / Epic Games / EA App</span>
              <span>• Spotify / Discord / Telegram</span>
              <span>• qBittorrent / AnyDesk / TeamViewer</span>
            </div>
          </div>
          <span className="text-[9px] text-zinc-500 pt-1 border-t border-zinc-800/60 mt-1 block">
            ACCIÓN: Desactivar en Administrador de Tareas.
          </span>
        </div>

        {/* Basket 3: Desinstalar */}
        <div className="bg-[#0e1118] border border-amber-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <Trash2 className="w-3.5 h-3.5" />
                <span>03 // DESINSTALAR</span>
              </div>
              <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded">PURGA LIMPIA</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Software que no usás hace más de 6 meses, bloatware preinstalado por la marca de tu motherboard o antivirus de prueba vencidos.
            </p>
            <div className="bg-black/40 p-1.5 rounded border border-zinc-800/80 text-[9px] text-zinc-400 space-y-0.5">
              <span className="text-amber-400 font-bold block">EJEMPLOS TÍPICOS:</span>
              <span>• Antivirus de prueba (McAfee, Norton)</span>
              <span>• Suites OEM (Armoury Crate, Dragon Center)</span>
              <span>• Juegos terminados que ocupan 100 GB</span>
            </div>
          </div>
          <span className="text-[9px] text-zinc-500 pt-1 border-t border-zinc-800/60 mt-1 block">
            ACCIÓN: Desinstalar desde Configuración nativa.
          </span>
        </div>

        {/* Basket 4: Investigar */}
        <div className="bg-[#0e1118] border border-purple-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                <Search className="w-3.5 h-3.5" />
                <span>04 // INVESTIGAR</span>
              </div>
              <span className="text-[8px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded">DUDA TÉCNICA</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Nombres crípticos que no reconocés de inmediato pero que podrían pertenecer a un periférico, tarjeta de audio o hardware.
            </p>
            <div className="bg-black/40 p-1.5 rounded border border-zinc-800/80 text-[9px] text-zinc-400 space-y-0.5">
              <span className="text-purple-400 font-bold block">EJEMPLOS TÍPICOS:</span>
              <span>• "Bonjour" (Servicio de red de Apple/iTunes)</span>
              <span>• "Nahimic" (Motor DSP de audio de placa madre)</span>
              <span>• "CPUID HWMonitor Engine" (Driver de sensor)</span>
            </div>
          </div>
          <span className="text-[9px] text-zinc-500 pt-1 border-t border-zinc-800/60 mt-1 block">
            ACCIÓN: Buscar el nombre exacto antes de borrar.
          </span>
        </div>

        {/* Basket 5: NO TOCAR (CRÍTICO) */}
        <div className="bg-[#160a0d] border border-rose-500/50 rounded-lg p-2.5 flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-rose-500/30">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                <ShieldBan className="w-3.5 h-3.5" />
                <span>05 // NO TOCAR BAJO NINGÚN CONCEPTO</span>
              </div>
              <span className="text-[8px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-bold">CRÍTICO DEL SISTEMA</span>
            </div>
            <p className="text-[10px] text-zinc-200 font-sans-editorial leading-snug mb-1.5">
              Librerías compartidas de ejecución, controladores oficiales y componentes de compilación que el sistema operativo y los videojuegos necesitan para funcionar. Borrarlos provoca errores tipo <em>MSVCP140.dll missing</em> o cuelgues del audio.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-black/60 p-1.5 rounded border border-rose-500/30 text-[9px] text-zinc-300">
              <div>
                <strong className="text-rose-400 block">MICROSOFT VISUAL C++ REDISTRIBUTABLES:</strong>
                <span className="text-zinc-400">Verás versiones 2008, 2010, 2012, 2013, 2015-2022 en x86 y x64. Son independientes y cada juego exige su versión específica. NO las toques.</span>
              </div>
              <div>
                <strong className="text-rose-400 block">CONTROLADORES Y RUNTIMES:</strong>
                <span className="text-zinc-400">Vulkan Run Time Libraries, Microsoft .NET Framework, Realtek High Definition Audio Driver, AMD Chipset Software, Intel Management Engine.</span>
              </div>
            </div>
          </div>
          <span className="text-[9px] text-rose-400 pt-1 border-t border-rose-500/30 mt-1 block font-bold">
            LEY EVO: Si un elemento tiene nombre de librería o runtime oficial, se queda donde está.
          </span>
        </div>

      </div>

      {/* Bottom Summary Bar */}
      <div className="p-2 bg-[#10131c] border border-zinc-800 rounded flex items-center justify-between text-[9px] font-mono-tech text-zinc-400">
        <span>EJEMPLO DIDÁCTICO TÍPICO: Múltiples apps innecesarias desinstaladas con criterio, servicios secundarios apagados del arranque y CERO librerías del sistema rotas.</span>
        <span className="text-yellow-400 font-bold">AUDITORÍA SIN PÁNICO →</span>
      </div>
    </MagazineMasterPage>
  );
};
