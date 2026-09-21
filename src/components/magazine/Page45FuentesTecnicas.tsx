import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { BookOpen, ExternalLink, ShieldCheck, Cpu, Terminal, Layers } from 'lucide-react';

export const Page45FuentesTecnicas: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-45"
      pageNumber={45}
      totalPages={46}
      sectionTitle="APÉNDICE TÉCNICO"
      subSlug="METROLOGÍA OFICIAL // FUENTES DE INVESTIGACIÓN"
      accentColor="#EAB308"
    >
      {/* Top Banner / Section Header */}
      <div className="mb-3.5 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOCUMENTACIÓN DE REFERENCIA // INGENIERÍA Y ARQUITECTURA
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-0.5">
            Fuentes & Documentación Técnica
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          REF: EVO-SOURCES-001
        </span>
      </div>

      {/* Main Narrative Lead */}
      <div className="p-3.5 bg-gradient-to-r from-yellow-400/10 via-[#0e121a] to-transparent border-l-4 border-yellow-400 rounded-r-lg mb-4">
        <p className="font-sans-editorial text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
          En <strong className="text-white">EVO LABS</strong> cada afirmación sobre silicio, latencias, planificación del kernel de Windows o límites térmicos proviene de especificaciones de ingeniería y documentación de los organismos normativos oficiales. Si querés profundizar en la investigación de tu propio equipo, estos son los repositorios técnicos de referencia que debés consultar.
        </p>
      </div>

      {/* Grid of Official Technical Authorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1">
        
        {/* 1. Microsoft Learn & Windows Internals */}
        <div className="p-3.5 bg-[#0b0e14] border border-zinc-800 rounded-lg flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech text-yellow-400 font-bold uppercase tracking-wider">
                SISTEMA OPERATIVO & KERNEL
              </span>
              <span className="text-[9px] font-mono-tech bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                MICROSOFT
              </span>
            </div>
            <h3 className="font-display font-black text-sm text-white uppercase tracking-tight">
              Microsoft Learn & Sysinternals
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans-editorial leading-snug">
              Documentación técnica de arquitectura del sistema operativo:
            </p>
            <ul className="text-[10px] font-mono-tech text-zinc-300 space-y-1 pt-1 list-disc list-inside">
              <li><strong className="text-zinc-200">Windows Internals</strong> (Mark Russinovich, David Solomon y Alex Ionescu).</li>
              <li><strong className="text-zinc-200">DPC/ISR Architecture</strong>: Deferred Procedure Calls y análisis de latencia en Ring 0.</li>
              <li><strong className="text-zinc-200">DISM & SFC Technical Reference</strong>: Mantenimiento y reparación de la tienda de componentes WinSxS.</li>
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[9px] font-mono-tech text-zinc-500">
            learn.microsoft.com // Documentation
          </div>
        </div>

        {/* 2. Intel Corporation */}
        <div className="p-3.5 bg-[#0b0e14] border border-zinc-800 rounded-lg flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech text-yellow-400 font-bold uppercase tracking-wider">
                MICROARQUITECTURA X86-64
              </span>
              <span className="text-[9px] font-mono-tech bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded border border-sky-500/30">
                INTEL
              </span>
            </div>
            <h3 className="font-display font-black text-sm text-white uppercase tracking-tight">
              Intel 64 and IA-32 Architectures
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans-editorial leading-snug">
              Manuales del desarrollador de software y especificaciones de silicio:
            </p>
            <ul className="text-[10px] font-mono-tech text-zinc-300 space-y-1 pt-1 list-disc list-inside">
              <li><strong className="text-zinc-200">Intel SDM Volume 3</strong>: System Programming Guide (Gestión de energía y C-States).</li>
              <li><strong className="text-zinc-200">Thermal & Mechanical Design Guides</strong>: Especificaciones de TjMax y límites PL1/PL2.</li>
              <li><strong className="text-zinc-200">Intel Thread Director</strong>: Asignación de cargas en arquitecturas híbridas P-Core y E-Core.</li>
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[9px] font-mono-tech text-zinc-500">
            intel.com/content/www/us/en/developer // Manuals
          </div>
        </div>

        {/* 3. AMD Technical Documentation */}
        <div className="p-3.5 bg-[#0b0e14] border border-zinc-800 rounded-lg flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech text-yellow-400 font-bold uppercase tracking-wider">
                INTERCONEXIÓN & TOPOLOGÍA CHIPLET
              </span>
              <span className="text-[9px] font-mono-tech bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                AMD
              </span>
            </div>
            <h3 className="font-display font-black text-sm text-white uppercase tracking-tight">
              AMD Technical Whitepapers
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans-editorial leading-snug">
              Microarquitectura Zen y administración de buses:
            </p>
            <ul className="text-[10px] font-mono-tech text-zinc-300 space-y-1 pt-1 list-disc list-inside">
              <li><strong className="text-zinc-200">AMD Zen Core Architecture</strong>: Interconexión Infinity Fabric (FCLK, UCLK, MCLK).</li>
              <li><strong className="text-zinc-200">Precision Boost 2 & FIT</strong>: Algoritmos de escalado de voltaje y frecuencia por corriente.</li>
              <li><strong className="text-zinc-200">AGESA BIOS Specifications</strong>: Control de módulos de memoria y configuración PCI Express.</li>
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[9px] font-mono-tech text-zinc-500">
            amd.com/en/developer/resources // Whitepapers
          </div>
        </div>

        {/* 4. NVIDIA Developer & Metrología de Gráficos */}
        <div className="p-3.5 bg-[#0b0e14] border border-zinc-800 rounded-lg flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech text-yellow-400 font-bold uppercase tracking-wider">
                PIPELINE GRÁFICO & LATENCIA DE ENTRADA
              </span>
              <span className="text-[9px] font-mono-tech bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/30">
                NVIDIA & PRESENTMON
              </span>
            </div>
            <h3 className="font-display font-black text-sm text-white uppercase tracking-tight">
              NVIDIA Developer & Frame Pacing
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans-editorial leading-snug">
              Metrología de renderizado y sincronización:
            </p>
            <ul className="text-[10px] font-mono-tech text-zinc-300 space-y-1 pt-1 list-disc list-inside">
              <li><strong className="text-zinc-200">Reflex SDK Documentation</strong>: Desacople de la cola de renderizado en saturación de GPU.</li>
              <li><strong className="text-zinc-200">PresentMon Library</strong>: Seguimiento de llamadas a eventos DXGI y tiempos de composición DWM.</li>
              <li><strong className="text-zinc-200">Resizable BAR Technical Implementation</strong>: Asignación de búfer de VRAM sobre buses PCIe.</li>
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[9px] font-mono-tech text-zinc-500">
            developer.nvidia.com // Documentation
          </div>
        </div>

      </div>

      {/* Standards Organizations (JEDEC & PCI-SIG) */}
      <div className="mt-3.5 p-3 bg-[#0d1017] border border-zinc-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[9.5px] font-mono-tech text-yellow-400 font-bold uppercase tracking-wider block">
            ESTÁNDARES GLOBALES DE LA INDUSTRIA
          </span>
          <p className="text-[11px] text-zinc-300 font-sans-editorial">
            <strong className="text-white">JEDEC (JESD79)</strong> para memorias DDR4/DDR5 y <strong className="text-white">PCI-SIG</strong> para el estándar de interconexión PCI Express Base Specification.
          </p>
        </div>
        <div className="font-mono-tech text-[9.5px] text-zinc-400 bg-black/60 px-3 py-1.5 rounded border border-zinc-800 shrink-0">
          DOCUMENTACIÓN AUDITADA POR EVO LABS
        </div>
      </div>
    </MagazineMasterPage>
  );
};
