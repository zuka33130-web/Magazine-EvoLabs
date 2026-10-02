import React, { useState } from 'react';
import {
  HelpCircle,
  Terminal,
  FolderArchive,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  FolderTree,
  BookOpen,
} from 'lucide-react';

interface Tomo02ComoUsarElTomoProps {
  onCopySnippet?: (text: string) => void;
  copiedSnippet?: string | null;
}

export const Tomo02ComoUsarElTomo: React.FC<Tomo02ComoUsarElTomoProps> = ({
  onCopySnippet,
  copiedSnippet,
}) => {
  const [localCopied, setLocalCopied] = useState<boolean>(false);
  const initCommand =
    'New-Item -ItemType Directory -Path "C:\\EVO_LABS\\Telemetria","C:\\EVO_LABS\\Dumps","C:\\EVO_LABS\\Backups_Registro","C:\\EVO_LABS\\Scripts","C:\\EVO_LABS\\Informes" -Force';

  const isCopied = copiedSnippet === initCommand || localCopied;

  const handleCopy = (text: string) => {
    if (onCopySnippet) {
      onCopySnippet(text);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setLocalCopied(true);
      setTimeout(() => setLocalCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
      {/* Top Banner / Section Header */}
      <div className="border-b border-cyan-950 pb-2.5 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-cyan-400 uppercase font-bold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            MANIFIESTO EDITORIAL // CONVENCIONES Y REVERSIBILIDAD
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Cómo leer este tomo y tu Archivo EVO
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono-tech text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider block">
            LEMA: SI NO PODÉS REVERTIRLO, NO LO TOQUES
          </span>
          <span className="font-mono-tech text-[9px] text-zinc-500 uppercase tracking-wider">
            REF: EVO-T02-SYS-001
          </span>
        </div>
      </div>

      {/* Main Grid: 2 Columns (Sistema de Lectura + Archivo Forense EVO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 items-stretch min-h-0">
        {/* Left Column (7 cols): Las 2 Velocidades & Los 4 Niveles de Riesgo */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-2.5">
          {/* 1. Las 2 Velocidades de Lectura */}
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-2">
            <span className="text-[10px] font-mono-tech font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              UNA RUTA, DOS VELOCIDADES DE APRENDIZAJE
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-black/60 border border-zinc-900 space-y-1">
                <span className="text-white font-mono-tech text-[11px] font-bold block text-cyan-300">
                  VELOCIDAD 1: MAGAZINE A4
                </span>
                <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                  Lectura continua y conceptual. Entendé cómo interactúan los anillos de kernel, la memoria virtual y el registro sin temor a romper el sistema.
                </p>
              </div>
              <div className="p-2 rounded bg-black/60 border border-cyan-950 space-y-1">
                <span className="text-white font-mono-tech text-[11px] font-bold block text-cyan-400">
                  VELOCIDAD 2: MODULE READER & LAB
                </span>
                <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                  Intervención pericial guiada. Medí la latencia con LatencyMon, ejecutá scripts PowerShell y comprobá diagnósticos paso a paso con reversión.
                </p>
              </div>
            </div>
          </div>

          {/* 2. El Semáforo de Riesgo EVO */}
          <div className="p-3 rounded-xl bg-black/70 border border-cyan-900/60 space-y-2 text-xs flex-1">
            <span className="text-[10px] font-mono-tech font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-zinc-900 pb-1">
              <span>EL SEMÁFORO DE RIESGO DE WINDOWS</span>
              <span className="text-zinc-500 text-[9px]">CLASIFICACIÓN OFICIAL EVO</span>
            </span>
            <div className="space-y-1.5 font-mono-tech text-[10px]">
              <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-[0_0_6px_#10B981]" />
                <div>
                  <strong className="text-emerald-300 block font-bold">NIVEL VERDE // MANTENIMIENTO LIBRE:</strong>
                  <p className="text-zinc-400 font-sans-editorial text-[10px]">
                    Archivos temporales (%TEMP%), caché de Windows Update (SoftwareDistribution\Download) y volcados Minidump. Purgable sin reiniciar el equipo.
                  </p>
                </div>
              </div>
              <div className="p-2 rounded bg-amber-950/20 border border-amber-500/30 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0 shadow-[0_0_6px_#F59E0B]" />
                <div>
                  <strong className="text-amber-300 block font-bold">NIVEL AMARILLO // PRECAUCIÓN METÓDICA:</strong>
                  <p className="text-zinc-400 font-sans-editorial text-[10px]">
                    Almacén WinSxS, repositorio DriverStore, ProgramData y servicios no esenciales. Requiere herramienta oficial (DISM, RAPR) y respaldo previo.
                  </p>
                </div>
              </div>
              <div className="p-2 rounded bg-rose-950/20 border border-rose-500/30 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-1 shrink-0 shadow-[0_0_6px_#F43F5E]" />
                <div>
                  <strong className="text-rose-300 block font-bold">NIVEL ROJO // NÚCLEO CRÍTICO RING 0 (INTOCABLE):</strong>
                  <p className="text-zinc-400 font-sans-editorial text-[10px]">
                    System32, SysWOW64, colmenas del Registro (config), bootmgr y partición EFI. Jamás borrar ni renombrar a mano; se repara con SFC y BCDBoot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): El Archivo Forense EVO (C:\EVO_LABS) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#060D1A] via-zinc-950 to-black border border-cyan-900/80 space-y-2.5 text-xs flex-1">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-1.5">
              <span className="text-[10px] font-mono-tech font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderArchive className="w-3.5 h-3.5 text-cyan-400" />
                TU ARCHIVO FORENSE EVO
              </span>
              <span className="text-[9px] font-mono-tech text-zinc-500">
                C:\EVO_LABS
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-sans-editorial leading-tight">
              Todo perito informático mantiene una carpeta aislada en la raíz del disco donde almacena evidencias, volcados de memoria y copias de seguridad antes de modificar una sola clave del sistema.
            </p>

            <div className="space-y-1.5 font-mono-tech text-[10px]">
              <div className="p-1.5 rounded bg-black/60 border border-cyan-950/80 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">📁 \Telemetria</span>
                <span className="text-zinc-400 font-sans-editorial text-[9px]">Líneas base de DPC, tiempos LastBIOS y latencias.</span>
              </div>
              <div className="p-1.5 rounded bg-black/60 border border-cyan-950/80 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">📁 \Dumps</span>
                <span className="text-zinc-400 font-sans-editorial text-[9px]">Volcados Minidump de BSOD para análisis WinDbg.</span>
              </div>
              <div className="p-1.5 rounded bg-black/60 border border-cyan-950/80 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">📁 \Backups_Registro</span>
                <span className="text-zinc-400 font-sans-editorial text-[9px]">Exportaciones .reg previas a modificaciones.</span>
              </div>
              <div className="p-1.5 rounded bg-black/60 border border-cyan-950/80 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">📁 \Scripts</span>
                <span className="text-zinc-400 font-sans-editorial text-[9px]">Comandos PowerShell de auditoría y diagnóstico.</span>
              </div>
              <div className="p-1.5 rounded bg-black/60 border border-cyan-950/80 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">📁 \Informes</span>
                <span className="text-zinc-400 font-sans-editorial text-[9px]">Actas periciales de intervención y pasaporte.</span>
              </div>
            </div>

            {/* Init Command */}
            <div className="p-2 rounded-lg bg-[#060910] border border-cyan-900/60 font-mono-tech text-[9px]">
              <div className="flex items-center justify-between text-cyan-400 mb-1">
                <span>COMANDO PARA CREAR EL ÁRBOL:</span>
                <button
                  type="button"
                  onClick={() => handleCopy(initCommand)}
                  className="px-1.5 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      <span className="text-emerald-400">COPIADO</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5" />
                      <span>COPIAR</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-1 rounded bg-black text-cyan-300 overflow-x-auto text-[9px] leading-tight select-all">
                <code>{initCommand}</code>
              </pre>
            </div>
          </div>

          {/* Regla de Reversibilidad */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-black border-l-2 border-cyan-400 border-t border-r border-b border-cyan-950/60 text-xs font-mono-tech flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-zinc-300 text-[10px] leading-tight">
              <strong className="text-cyan-400 font-bold">REGLA DE ORO PERICIAL:</strong> Si no disponés de la orden de reversión documentada, no toques el parámetro.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Callout */}
      <div className="pt-2 border-t border-cyan-950/60 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500">
        <span>EVO LABS // GUÍA METODOLÓGICA Y ARQUITECTURA FORENSE</span>
        <span className="text-cyan-400 font-bold">PÁGINA 03 DE 37</span>
      </div>
    </div>
  );
};
