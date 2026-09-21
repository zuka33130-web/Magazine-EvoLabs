import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { SemaforoEvo } from './SemaforoEvo';
import { Activity, HardDrive, Cpu, Clock, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

export const DossierP01Checkpoint: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-27"
      pageNumber={27}
      totalPages={46}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 01 // EL CHECKPOINT INICIAL"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // PROTOCOLO DE PUESTA A PUNTO // PÁGINA 01 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Antes de Tocar: El Checkpoint Basal
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          METROLOGÍA PREVIA // SIN ADIVINANZAS
        </span>
      </div>

      {/* Intro Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2.5">
        <div className="md:col-span-8 space-y-1.5">
          <p className="magazine-dropcap text-zinc-200">
            La gran mayoría de los usuarios comete el mismo error fatal ante una PC lenta: descargar un limpiador de terceros, desactivar opciones al azar en foros y esperar un milagro. Cuando algo falla o el mouse empieza a tironear, no saben qué lo provocó porque jamás midieron el punto de partida.
          </p>
          <p className="text-zinc-400 text-[11px]">
            En EVO Labs no se toca un solo parámetro sin registrar antes el <strong>estado de partida de tu sistema</strong>. Este dossier no es una lista de trucos mágicos ni promesas universales: es una metodología estructurada para saber con certeza qué arranca, qué queda corriendo y qué podés ajustar o limpiar sin comprometer la estabilidad de Windows.
          </p>
        </div>

        <div className="md:col-span-4 bg-[#11141c] border border-yellow-500/30 rounded-lg p-2.5 flex flex-col justify-between font-mono-tech">
          <div>
            <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold uppercase mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>MÉTODO EVO // REGLA BÁSICA</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug">
              "Si no registraste el estado previo con métricas comprobables en tu propio equipo, cualquier sensación posterior no es optimización: es puro efecto placebo."
            </p>
          </div>
          <div className="text-[9px] text-zinc-500 pt-1.5 border-t border-zinc-800 flex justify-between">
            <span>REGISTRO REVERSIBLE</span>
            <span className="text-yellow-400">AUDITORÍA METÓDICA</span>
          </div>
        </div>
      </div>

      {/* The EVO Traffic Light Architecture */}
      <div className="bg-[#0b0d13] border border-zinc-800 rounded-lg p-2.5 mb-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 border-b border-zinc-800 pb-1 mb-2">
          <span className="text-white font-bold uppercase tracking-wider">EL SISTEMA SEMÁFORO EVO // CRITERIO TÉCNICO</span>
          <span className="text-zinc-500">APLICADO EN CADA PÁGINA DE ESTE DOSSIER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="p-2 bg-[#08130e] border border-emerald-500/40 rounded">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono-tech text-[11px] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>VERDE // BAJO RIESGO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight">
              Acción de bajo riesgo y fácil reversión. Deshabilitar lanzadores comerciales del inicio, purgar temporales obsoletos o retirar servicios de software ya desinstalado.
            </p>
          </div>

          <div className="p-2 bg-[#151108] border border-amber-500/40 rounded">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono-tech text-[11px] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>AMARILLO // CONDICIONAL</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight">
              Requiere conocer el uso del equipo, registrar el valor original de respaldo y medir antes y después. Ensayar SysMain según almacenamiento o evaluar efectos visuales.
            </p>
          </div>

          <div className="p-2 bg-[#160a0c] border border-rose-500/40 rounded">
            <div className="flex items-center gap-1.5 text-rose-400 font-mono-tech text-[11px] font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>ROJO // NO TOCAR POR RUTINA</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight">
              No realizar como optimización rutinaria. Borrar carpetas críticas del kernel (WinSxS a mano), apagar servicios criptográficos vitales o desinstalar runtimes esenciales.
            </p>
          </div>
        </div>
      </div>

      {/* Initial Checkpoint Scorecard */}
      <div className="bg-[#0e1118] border border-yellow-500/30 rounded-lg p-2.5 font-mono-tech">
        <div className="flex items-center justify-between text-[10px] text-yellow-400 border-b border-zinc-800 pb-1 mb-2">
          <span className="font-bold uppercase tracking-wider">TU FICHA DE ESTADO CERO // MEDIR Y ANOTAR EN TU PC</span>
          <span className="text-zinc-400 text-[9px]">HERRAMIENTAS NATIVAS: ADMIN. DE TAREAS + MONITOR DE RECURSOS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[10px]">
          <div className="p-1.5 bg-[#141824] border border-zinc-800 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[9px] mb-0.5">
              <Clock className="w-3 h-3 text-yellow-400" />
              <span>TIEMPO BIOS</span>
            </div>
            <span className="text-white font-bold text-xs block">____ seg</span>
            <span className="text-[8px] text-zinc-500">Pestaña Inicio</span>
          </div>

          <div className="p-1.5 bg-[#141824] border border-zinc-800 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[9px] mb-0.5">
              <HardDrive className="w-3 h-3 text-yellow-400" />
              <span>DISCO C: LIBRE</span>
            </div>
            <span className="text-white font-bold text-xs block">____ GB</span>
            <span className="text-[8px] text-zinc-500">Explorador / Este equipo</span>
          </div>

          <div className="p-1.5 bg-[#141824] border border-zinc-800 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[9px] mb-0.5">
              <Cpu className="w-3 h-3 text-yellow-400" />
              <span>RAM EN REPOSO</span>
            </div>
            <span className="text-white font-bold text-xs block">____ GB</span>
            <span className="text-[8px] text-zinc-500">Pestaña Rendimiento</span>
          </div>

          <div className="p-1.5 bg-[#141824] border border-zinc-800 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[9px] mb-0.5">
              <Activity className="w-3 h-3 text-yellow-400" />
              <span>CPU EN IDLE</span>
            </div>
            <span className="text-white font-bold text-xs block">____ %</span>
            <span className="text-[8px] text-zinc-500">Tras 5 min sin tocar</span>
          </div>

          <div className="p-1.5 bg-[#141824] border border-zinc-800 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[9px] mb-0.5">
              <HardDrive className="w-3 h-3 text-yellow-400" />
              <span>COLA DE DISCO</span>
            </div>
            <span className="text-white font-bold text-xs block">____ %</span>
            <span className="text-[8px] text-zinc-500">Actividad de disco idle</span>
          </div>

          <div className="p-1.5 bg-[#141824] border border-zinc-800 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[9px] mb-0.5">
              <CheckCircle className="w-3 h-3 text-yellow-400" />
              <span>APPS DE INICIO</span>
            </div>
            <span className="text-white font-bold text-xs block">____ apps</span>
            <span className="text-[8px] text-zinc-500">Habilitadas al boot</span>
          </div>
        </div>

        <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[9px] text-zinc-400">
          <span>COMO TOMARLO: Encendé el equipo, esperá 5 minutos en el escritorio sin abrir nada y anotá los valores basales.</span>
          <span className="text-yellow-400 font-bold">PASO 01 COMPLETO →</span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
