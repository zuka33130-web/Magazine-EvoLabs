import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { SemaforoEvo } from './SemaforoEvo';
import { HardDrive, AlertTriangle, ShieldCheck, Trash, Sparkles, FolderX, Info } from 'lucide-react';

export const DossierP09TemporalesLimpieza: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-35"
      pageNumber={35}
      totalPages={46}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 09 // HIGIENE DEL ALMACENAMIENTO"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // HIGIENE NATIVA // PÁGINA 09 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Temporales y Limpieza Nativa
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          SIN PROGRAMAS MILAGROSOS // EL MITO DE PREFETCH
        </span>
      </div>

      {/* Narrative Lead: Reality of disk space */}
      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2.5">
        No necesitás instalar limpiadores de terceros que prometen acelerar la PC o tocan el registro. Windows cuenta con <strong className="text-white">herramientas nativas de almacenamiento</strong>. Recuperar espacio en disco <strong className="text-yellow-400">no equivale a ganar velocidad de procesamiento en la CPU o GPU</strong>: su verdadero beneficio es evitar la saturación de la unidad (crucial para el funcionamiento de SSDs y archivos de paginación) y eliminar restos obsoletos tras parches mayores del sistema operativo.
      </p>

      {/* Comparison Grid: Storage Settings vs Cleanmgr vs %TEMP% */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-2.5 font-mono-tech text-xs">
        
        <div className="bg-[#0e1118] border border-emerald-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <span className="text-emerald-400 font-bold text-[11px]">01 // SENSOR DE ALMACENAMIENTO</span>
              <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-bold">CONFIGURACIÓN</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              <em>Configuración → Sistema → Almacenamiento → Archivos temporales</em>. La interfaz moderna de Windows.
            </p>
            <div className="space-y-1 text-[9px] bg-black/40 p-1.5 rounded border border-zinc-800">
              <div className="text-emerald-400 font-bold">SEGURO DE MARCAR:</div>
              <span className="text-zinc-300 block">• Caché de miniaturas (Thumbnails)</span>
              <span className="text-zinc-300 block">• Caché de sombreadores DirectX</span>
              <span className="text-zinc-300 block">• Archivos temporales de internet</span>
            </div>
          </div>
          <div className="mt-2 p-1 bg-rose-500/10 border border-rose-500/30 rounded text-[9px] text-rose-300 font-bold">
            ⚠ PRECAUCIÓN: No tildes "Descargas" si guardás instaladores o documentos allí.
          </div>
        </div>

        <div className="bg-[#0e1118] border border-sky-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <span className="text-sky-400 font-bold text-[11px]">02 // LIBERADOR DE ESPACIO (CLEANMGR)</span>
              <span className="text-[8px] bg-sky-500/20 text-sky-300 px-1 py-0.2 rounded font-bold">SISTÉMICO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              Ejecutá <code className="text-white">cleanmgr.exe</code> (Win+R). Clic en <em>"Limpiar archivos de sistema"</em>.
            </p>
            <div className="space-y-1 text-[9px] bg-black/40 p-1.5 rounded border border-zinc-800">
              <div className="text-sky-300 font-bold">ESPACIO RESIDUAL GRANDE:</div>
              <span className="text-zinc-300 block">• Limpieza de Windows Update (si el sistema ya está estable)</span>
              <span className="text-zinc-300 block">• Instalaciones previas (Windows.old)</span>
              <span className="text-zinc-300 block">• Informes de depuración antiguos</span>
            </div>
          </div>
          <span className="text-[8px] text-zinc-500 pt-1 border-t border-zinc-800 mt-2 block">
            Permite purgar gigabytes acumulados tras parches mayores del sistema operativo.
          </span>
        </div>

        <div className="bg-[#0e1118] border border-amber-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <span className="text-amber-400 font-bold text-[11px]">03 // CARPETAS TEMP Y %TEMP%</span>
              <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold">MANUAL</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              Presioná <code className="text-white">Win+R</code> y escribí <code className="text-yellow-400">%temp%</code> (o <code className="text-yellow-400">temp</code>).
            </p>
            <div className="space-y-1 text-[9px] bg-black/40 p-1.5 rounded border border-zinc-800">
              <div className="text-amber-400 font-bold">ARCHIVOS TEMPORALES DE USUARIO:</div>
              <span className="text-zinc-300 block">Restos de descompresiones, instaladores ya ejecutados y logs.</span>
              <span className="text-zinc-400 text-[8px] block">Si algún archivo está "en uso", marcá "Hacer esto para todos" y elegí <em>Omitir</em>.</span>
            </div>
          </div>
          <span className="text-[8px] text-zinc-500 pt-1 border-t border-zinc-800 mt-2 block">
            Acción segura: Windows bloquea automáticamente cualquier archivo que esté en uso activo.
          </span>
        </div>

      </div>

      {/* Signature Myth Section: Prefetch */}
      <div className="bg-[#120f18] border border-purple-500/40 rounded-lg p-2.5 flex-1 font-mono-tech flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-purple-400 mb-1.5">
          <span className="font-bold uppercase flex items-center gap-1.5">
            <FolderX className="w-3.5 h-3.5" />
            EL MITO DESMONTADO: ¿BORRAR LA CARPETA PREFETCH HACE MÁS RÁPIDA LA PC?
          </span>
            <span className="text-rose-400 text-[9px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30 font-bold">
            NO BORRAR POR RUTINA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <strong className="text-white text-[11px] block">QUÉ DICE EL MITO POPULAR:</strong>
            <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-relaxed">
              Cientos de videos recomiendan entrar a <code className="text-purple-300 font-mono-tech">C:\Windows\Prefetch</code> y vaciar su contenido para "limpiar basura y acelerar el arranque". <strong>Es un error conceptual</strong>.
            </p>
            <p className="text-[10px] text-zinc-400 font-sans-editorial mt-1 leading-relaxed">
              Prefetch no es basura acumulada: es una caché de metadatos donde el kernel de Windows analiza qué páginas de memoria y librerías necesita cada programa. Esto permite que el sistema las organice y cargue de forma eficiente y contigua al iniciar, reduciendo accesos redundantes.
            </p>
          </div>

          <div className="p-2 bg-black/40 rounded border border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-yellow-400 font-bold text-[10px] block">EFECTO DE UN BORRADO MANUAL:</span>
              <p className="text-[9px] text-zinc-300 font-sans-editorial mt-0.5 leading-tight">
                Borrar la carpeta libera una cantidad insignificante de megabytes y fuerza un "arranque en frío": la primera apertura de tus aplicaciones habituales demorará más tiempo mientras el subsistema SysMain recompila los patrones de precarga.
              </p>
              <div className="mt-1.5 p-1 bg-[#1a1322] border border-purple-500/20 rounded text-[8.5px] text-purple-200">
                <span>Comportamiento: Mayor tiempo de primer lanzamiento y escrituras adicionales innecesarias para regenerar la caché.</span>
              </div>
            </div>
            <span className="text-[8px] text-zinc-400 mt-1 pt-1 border-t border-zinc-800/80 block">
              Veredicto EVO: Windows administra de manera autónoma el directorio Prefetch. No requiere borrado manual periódico.
            </span>
          </div>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
