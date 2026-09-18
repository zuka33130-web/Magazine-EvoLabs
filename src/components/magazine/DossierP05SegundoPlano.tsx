import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { AppWindow, Cpu, HardDrive, Bell, Settings, XCircle, ArrowRight, Eye, Info } from 'lucide-react';

export const DossierP05SegundoPlano: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-27"
      pageNumber={27}
      totalPages={41}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 05 // SEGUNDO PLANO Y BANDEJA"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // LA BANDEJA DEL SISTEMA // PÁGINA 05 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Cerrar Ventana No Es Cerrar Programa
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          EL COMPORTAMIENTO DE LA 'X' Y EL CONSUMO EN BANDEJA
        </span>
      </div>

      {/* Narrative Lead */}
      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2.5">
        Hacés clic en la cruz superior derecha de Discord, Steam o Spotify y la ventana desaparece. Tu intuición te dice que el programa se cerró. <strong className="text-white">En muchos casos, el proceso sigue en ejecución</strong>: se minimizó en el área de notificación (System Tray o bandeja junto al reloj), conservando conexiones de red y reteniendo memoria de trabajo hasta que lo cerrás explícitamente desde su menú contextual.
      </p>

      {/* Graphic Section: Illustrative Values */}
      <div className="bg-[#0b0e15] border border-yellow-500/30 rounded-lg p-2.5 mb-2.5 font-mono-tech">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-yellow-400 mb-2">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            VALORES ILUSTRATIVOS // RANGOS TÍPICOS CON VENTANA MINIMIZADA
          </span>
          <span className="text-zinc-500 text-[9px]">EJEMPLO DIDÁCTICO // VARIABLE SEGÚN VERSIÓN Y PC</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-[#12151f] border-t-2 border-yellow-400 rounded">
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold block">DISCORD (FRAMEWORK ELECTRON)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xs text-white font-bold">~180 a 320 MB</span>
              <span className="text-[9px] text-amber-400">Varios procesos</span>
            </div>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-1 leading-tight">
              Instancias Chromium para interfaz, audio y servicios web que permanecen en caché.
            </p>
          </div>

          <div className="p-2 bg-[#12151f] border-t-2 border-yellow-400 rounded">
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold block">STEAM WEB HELPER</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xs text-white font-bold">~250 a 420 MB</span>
              <span className="text-[9px] text-amber-400">En bandeja</span>
            </div>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-1 leading-tight">
              Mantiene el cliente de chat, biblioteca y tienda precargados para respuesta rápida.
            </p>
          </div>

          <div className="p-2 bg-[#12151f] border-t-2 border-yellow-400 rounded">
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold block">SUITES RGB (iCUE / SYNAPSE)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xs text-white font-bold">~300 a 550 MB</span>
              <span className="text-[9px] text-rose-400">Sondeo activo</span>
            </div>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-1 leading-tight">
              Servicios de sincronización de luces y macros monitoreando entradas USB continuamente.
            </p>
          </div>

          <div className="p-2 bg-[#12151f] border-t-2 border-yellow-400 rounded">
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold block">SPOTIFY DESKTOP</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xs text-white font-bold">~150 a 260 MB</span>
              <span className="text-[9px] text-zinc-400">En reposo</span>
            </div>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-1 leading-tight">
              Caché de listas de reproducción y escucha activa para Spotify Connect en red local.
            </p>
          </div>
        </div>

        <div className="mt-2 pt-1 border-t border-zinc-800 text-[9px] text-zinc-400 flex flex-col sm:flex-row justify-between gap-1">
          <span className="flex items-center gap-1 text-zinc-500">
            <Info className="w-3 h-3 text-yellow-400" />
            El consumo real varía según tu hardware, memoria física total y pestañas internas abiertas.
          </span>
          <span className="text-yellow-400 font-bold">CONFIGURABLE DIRECTO EN CADA APP</span>
        </div>
      </div>

      {/* The Solution: Native App Preferences */}
      <div className="bg-[#0e1118] border border-zinc-800 rounded-lg p-2.5 flex-1 font-mono-tech flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-zinc-400 mb-1.5">
          <span className="text-white font-bold uppercase flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-yellow-400" />
            EL MÉTODO RECOMENDADO: CONFIGURAR EL COMPORTAMIENTO NATIVO
          </span>
          <span className="text-emerald-400">AJUSTES INTERNOS DE CADA APP</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-[#141824] rounded border border-zinc-800/80">
            <span className="text-white font-bold text-[11px] block">PASO 1 // DISCORD</span>
            <p className="text-[10px] text-zinc-400 font-sans-editorial mt-0.5">
              Ajustes de usuario → Ajustes de Windows → Desactivar <em>"Minimizar a la bandeja"</em>. Al presionar la X, Discord se cierra limpiamente.
            </p>
          </div>

          <div className="p-2 bg-[#141824] rounded border border-zinc-800/80">
            <span className="text-white font-bold text-[11px] block">PASO 2 // STEAM CLIENT</span>
            <p className="text-[10px] text-zinc-400 font-sans-editorial mt-0.5">
              Parámetros → Interfaz → Desmarcar <em>"Ejecutar Steam al iniciar el equipo"</em>. Para cerrar: Menú superior Steam → Salir.
            </p>
          </div>

          <div className="p-2 bg-[#141824] rounded border border-zinc-800/80">
            <span className="text-white font-bold text-[11px] block">PASO 3 // SUITES RGB</span>
            <p className="text-[10px] text-zinc-400 font-sans-editorial mt-0.5">
              Guardá tus DPIs y perfil de iluminación en la memoria integrada (On-board memory) del mouse y cerrá la suite cuando no personalices.
            </p>
          </div>
        </div>

        <div className="mt-2 pt-1 border-t border-zinc-800 text-[9px] text-zinc-400 flex items-center justify-between">
          <span>CONSEJO PRÁCTICO: Cerrar desde el menú nativo de la app o icono de bandeja en vez de matar tareas a la fuerza con scripts.</span>
          <span className="text-yellow-400 font-bold">AJUSTE LIMPIO & SEGURO</span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
