import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { HardDrive, Cpu, FlaskConical, ArrowLeftRight, CheckCircle2, RotateCcw, Timer, Info } from 'lucide-react';

export const DossierP07SysMainExperimento: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-33"
      pageNumber={33}
      totalPages={46}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 07 // ENSAYO A/B SYSMAIN"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // EXPERIMENTO CONTROLADO // PÁGINA 07 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            SysMain: Qué Hace y Cómo Medirlo
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          EXPERIMENTO A/B REVERSIBLE // DECIDÍ CON TUS PROPIOS DATOS
        </span>
      </div>

      {/* Narrative Lead: What SysMain Really Does */}
      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2.5">
        Pocos servicios generan tanto debate como <strong className="text-white">SysMain</strong> (anteriormente conocido como <em>SuperFetch</em>). ¿Qué hace realmente Windows con este servicio? <strong>Analiza tus patrones de uso y precarga en la memoria RAM libre los ejecutables y librerías que más abrís</strong>, para que cuando hagas clic inicien casi al instante. En lugar de adoptar recetas fijas de internet, entendamos cómo se comporta en cada tecnología de almacenamiento:
      </p>

      {/* Technical Reality: HDD vs Modern SSD/NVMe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-2.5 font-mono-tech text-xs">
        
        {/* Scenario 1: HDD */}
        <div className="bg-[#12151e] border border-amber-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800 mb-1.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                EN DISCO MECÁNICO (HDD)
              </span>
              <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold">SÍNDROME 100% DISCO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              En un disco mecánico de platos giratorios, la precarga de cientos de megabytes tras encender la PC suele saturar el uso de disco al <strong>100% continuo durante los primeros 5 a 15 minutos</strong>.
            </p>
            <div className="p-1.5 bg-black/40 rounded text-[9px] text-zinc-300 border border-zinc-800">
              <span className="text-amber-400 font-bold block">CRITERIO TÉCNICO EN HDD:</span>
              <span>Aquí <strong>sí tiene sentido evaluar pasarlo a Manual o deshabilitarlo</strong> si tu arranque se congela por lectura intensiva del disco.</span>
            </div>
          </div>
          <span className="text-[8px] text-zinc-500 pt-1 border-t border-zinc-800 mt-1 block">
            Impacto: Alivia cuellos de botella de lectura física en platos magnéticos.
          </span>
        </div>

        {/* Scenario 2: NVMe / SSD */}
        <div className="bg-[#12151e] border border-zinc-800 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800 mb-1.5">
              <span className="text-[10px] text-yellow-400 font-bold uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                EN SSD SATA O NVME
              </span>
              <span className="text-[8px] bg-zinc-700 text-zinc-300 px-1 py-0.2 rounded font-bold">IMPACTO IMPERCEPTIBLE</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
              Un SSD SATA entrega ~500 MB/s y un NVMe moderno entre 3.500 y 7.000 MB/s con tiempos de acceso casi instantáneos (0.02 ms). El almacenamiento ya es sumamente veloz por naturaleza física.
            </p>
            <div className="p-1.5 bg-black/40 rounded text-[9px] text-zinc-300 border border-zinc-800">
              <span className="text-yellow-400 font-bold block">CRITERIO TÉCNICO EN SSD:</span>
              <span>El beneficio de SysMain en SSD es <strong>prácticamente imperceptible</strong> en la práctica cotidiana y su desactivación no produce mejoras milagrosas de FPS.</span>
            </div>
          </div>
          <span className="text-[8px] text-zinc-500 pt-1 border-t border-zinc-800 mt-1 block">
            Impacto: Variaciones imperceptibles en tiempos de carga.
          </span>
        </div>

      </div>

      {/* The Scientific A/B Protocol with Reader Matrix */}
      <div className="bg-[#0b0e15] border border-yellow-500/30 rounded-lg p-2.5 flex-1 font-mono-tech flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-yellow-400 mb-1.5">
          <span className="font-bold uppercase flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5" />
            EL EXPERIMENTO A/B: MEDÍ EN TU PROPIA PC
          </span>
          <span className="text-zinc-400 text-[9px]">ISOLACIÓN DE VARIABLE: SOLO SYSMAIN</span>
        </div>

        <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-2">
          Elegí 3 programas de uso frecuente (por ejemplo: tu navegador habitual, Photoshop o un juego pesado). Cronometrá los segundos desde el clic hasta la interfaz interactiva.
        </p>

        {/* Reader Measurement Table */}
        <div className="bg-[#12151e] border border-zinc-800 rounded p-1.5 mb-2 overflow-x-auto text-[9px]">
          <div className="grid grid-cols-12 gap-1 pb-1 border-b border-zinc-700 text-zinc-400 font-bold">
            <span className="col-span-4">PROGRAMA A TESTEAR</span>
            <span className="col-span-3 text-center">SYSMAIN ACTIVO (A)</span>
            <span className="col-span-3 text-center">SYSMAIN APAGADO (B)</span>
            <span className="col-span-2 text-right">TU VEREDICTO</span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-1 border-b border-zinc-800 items-center text-zinc-300">
            <span className="col-span-4 font-bold text-white">1. Navegador (Chrome/Edge/Brave)</span>
            <span className="col-span-3 text-center text-yellow-400 font-mono-tech">____ seg</span>
            <span className="col-span-3 text-center text-yellow-400 font-mono-tech">____ seg</span>
            <span className="col-span-2 text-right text-zinc-400">Igual / Mejor</span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-1 border-b border-zinc-800 items-center text-zinc-300">
            <span className="col-span-4 font-bold text-white">2. Suite Creativa o Editor (ej. Premiere)</span>
            <span className="col-span-3 text-center text-yellow-400 font-mono-tech">____ seg</span>
            <span className="col-span-3 text-center text-yellow-400 font-mono-tech">____ seg</span>
            <span className="col-span-2 text-right text-zinc-400">Igual / Mejor</span>
          </div>
          <div className="grid grid-cols-12 gap-1 py-1 items-center text-zinc-300">
            <span className="col-span-4 font-bold text-white">3. Juego habitual (tiempo al menú)</span>
            <span className="col-span-3 text-center text-yellow-400 font-mono-tech">____ seg</span>
            <span className="col-span-3 text-center text-yellow-400 font-mono-tech">____ seg</span>
            <span className="col-span-2 text-right text-zinc-400">Igual / Mejor</span>
          </div>
        </div>

        <div className="p-1.5 bg-[#141824] rounded border border-zinc-800/80 text-[9px] text-zinc-400 flex flex-col sm:flex-row justify-between items-center gap-1">
          <span className="flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3 text-emerald-400 shrink-0" />
            <span><strong>CÓMO REVERTIR:</strong> Win+R → <code>services.msc</code> → SysMain → Tipo de inicio: <em>Automático</em> → Iniciar.</span>
          </span>
          <span className="text-emerald-400 font-bold">FÁCIL REVERSIÓN</span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
