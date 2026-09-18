import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { AlertOctagon, Terminal, HardDrive, ShieldAlert, CheckCircle, Info, Database, MonitorPlay, WifiOff, AlertTriangle } from 'lucide-react';

export const DossierP10LimpiezaProfunda: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-32"
      pageNumber={32}
      totalPages={41}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 10 // CIRUGÍA DEL SISTEMA"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // REGISTRO, DRIVERS Y COMPONENTES // PÁGINA 10 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Limpieza Profunda: Registro, DDU y WinSxS
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          CRITERIO ESTRICTO DE SEGURIDAD // CUÁNDO SÍ Y CUÁNDO NUNCA
        </span>
      </div>

      {/* Intro Lead */}
      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2">
        La "limpieza profunda" es el área donde más instalaciones de Windows se arruinan por seguir mitos de foros. Dos programas suelen encabezar las malas prácticas: los limpiadores automáticos de registro y el abuso innecesario de desinstaladores de controladores de video. Este es el protocolo técnico real:
      </p>

      {/* Block 1: Registry Cleaners vs DDU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-2 font-mono-tech text-xs">
        
        {/* Module A: Registry Cleaners Myth */}
        <div className="bg-[#160a0c] border border-rose-500/50 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-rose-500/30">
              <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold">
                <Database className="w-3.5 h-3.5" />
                <span>LIMPIADORES AUTOMÁTICOS DE REGISTRO</span>
              </div>
              <span className="text-[8px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-bold">DESACONSEJADO</span>
            </div>

            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              Desaconsejamos taxativamente los "limpiadores de registro automáticos" (estilo CCleaner o similares). He aquí la realidad arquitectónica:
            </p>

            <div className="space-y-1.5 text-[9px] bg-black/50 p-2 rounded border border-rose-500/30 text-zinc-300">
              <div>
                <strong className="text-yellow-400 block">• Base de datos indexada (B-Tree):</strong>
                <span className="text-zinc-400 font-sans-editorial">Tener 1.000 claves huérfanas de programas desinstalados <strong>NO ralentiza Windows</strong>. Una clave no consultada no consume ciclos de CPU ni memoria RAM.</span>
              </div>
              <div>
                <strong className="text-rose-400 block">• Riesgo asimétrico inaceptable:</strong>
                <span className="text-zinc-400 font-sans-editorial">El peligro de que el limpiador borre por error una clave que un driver o programa todavía necesita es infinitamente mayor que cualquier beneficio teórico.</span>
              </div>
            </div>
          </div>
          <span className="text-[8px] text-rose-400 pt-1 border-t border-rose-500/30 mt-1.5 block font-bold">
            REGLA DE ORO: El registro de Windows se deja en paz salvo edición manual puntual.
          </span>
        </div>

        {/* Module B: DDU Display Driver Uninstaller */}
        <div className="bg-[#0b0e15] border border-yellow-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-yellow-500/30">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[11px] font-bold">
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>DDU (DISPLAY DRIVER UNINSTALLER)</span>
              </div>
              <span className="text-[8px] bg-yellow-500/20 text-yellow-300 px-1 py-0.2 rounded font-bold">CONDICIONAL</span>
            </div>

            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              DDU es una herramienta de <strong>resolución de problemas</strong>, NO de mantenimiento rutinario. No la uses cada vez que salga un driver nuevo: la actualización limpia del instalador oficial (NVIDIA/AMD) es suficiente.
            </p>

            <div className="space-y-1 text-[9px] bg-black/50 p-1.5 rounded border border-zinc-800 text-zinc-300">
              <div className="flex justify-between">
                <strong className="text-emerald-400">CUÁNDO SÍ USARLO:</strong>
                <span className="text-zinc-400">Cambio de GPU (NVIDIA a AMD o viceversa) o BSOD en nvlddmkm/amdkmdag.</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800/60 pt-1">
                <strong className="text-rose-400">CUÁNDO NO USARLO:</strong>
                <span className="text-zinc-400">Actualizaciones normales periódicas de drivers.</span>
              </div>
            </div>
          </div>

          <div className="p-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded mt-1 text-[8.5px] text-yellow-300">
            <strong>PROTOCOLO SEGURO DDU:</strong> 1. Descargar driver oficial previamente → 2. Desconectar internet (evita que Windows Update instale driver genérico) → 3. Modo Seguro → 4. Limpiar y reiniciar → 5. Instalar driver descargado.
          </div>
        </div>

      </div>

      {/* Block 2: WinSxS and DISM Component Cleanup */}
      <div className="bg-[#0e1118] border border-zinc-800 rounded-lg p-2 flex-1 font-mono-tech flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-zinc-400 mb-1">
          <span className="text-white font-bold uppercase flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-yellow-400" />
            WINSXS Y COMANDO NATIVO DISM: CERO BORRADO A MANO
          </span>
          <span className="text-emerald-400">COMANDO NATIVO MICROSOFT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
          <div className="sm:col-span-6 text-[9.5px] text-zinc-300 font-sans-editorial leading-snug">
            <strong className="text-white block font-mono-tech text-[10px] mb-0.5">¿Qué es WinSxS y los Hardlinks?</strong>
            La carpeta <code>C:\Windows\WinSxS</code> contiene los componentes base del sistema. Casi todos los archivos en <code>System32</code> son en realidad <strong>enlaces duros (hardlinks)</strong> hacia ella. Si la borrás a mano, destruís el sistema de archivos de Windows.
          </div>

          <div className="sm:col-span-6 bg-black/60 p-2 rounded border border-zinc-800 text-[9px]">
            <span className="text-zinc-400 font-mono-tech block mb-0.5">Limpieza legítima de actualizaciones anteriores:</span>
            <code className="text-yellow-400 font-bold block bg-zinc-900/80 p-1 rounded mb-1">
              DISM.exe /Online /Cleanup-Image /StartComponentCleanup
            </code>
            <span className="text-zinc-400 font-sans-editorial text-[8.5px] block">
              Purga versiones reemplazadas de parches acumulativos con total seguridad de integridad.
            </span>
          </div>
        </div>

        <div className="mt-1 pt-1 border-t border-zinc-800 text-[9px] text-zinc-400 flex items-center justify-between">
          <span>WINDOWS.OLD: Si pasaron 7 días y todo funciona, eliminala desde Sensor de almacenamiento → Instalaciones anteriores.</span>
          <span className="text-yellow-400 font-bold">CIRUGÍA SEGURA & CONTROLADA →</span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
