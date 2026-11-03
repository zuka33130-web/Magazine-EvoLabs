import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { LabEvoCommand } from './LabEvoCommand';
import { ShieldCheck, Terminal, HelpCircle } from 'lucide-react';

export const Page08Chapter01PowerShell: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-12"
      pageNumber={12}
      totalPages={46}
      sectionTitle="0x07 LABORATORIO DIY"
      subSlug="AUDITORÍA NATIVA // CIM, WMI & POWERSHELL"
      accentColor="#EAB308"
    >
      <div className="flex-1 flex flex-col justify-between space-y-2.5">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-2 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
              0x07 // CRÉALO VOS MISMO: LABORATORIO DIY (HERRAMIENTAS NATIVAS)
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Construcción de Auditoría Nativa con PowerShell
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            CONSUMO CERO EN SEGUNDO PLANO
          </span>
        </div>

        {/* Narrative Context */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            No necesitás instalar aplicaciones desconocidas para una primera inspección del hardware. Windows incluye subsistemas WMI y CIM que consultan las tablas SMBIOS proporcionadas por la placa madre. Con este comando de PowerShell podés consultar los parámetros reportados por el firmware (capacidad, frecuencia declarada, fabricante y código de parte) para verificar si la velocidad configurada coincide con el perfil esperado o si opera en valores base de seguridad.
          </p>
        </div>

        {/* Lab Command Feature Component */}
        <div className="flex-1 space-y-2.5">
          <LabEvoCommand
            compact={true}
            title="INSPECCIÓN DE DATOS REPORTADOS POR SMBIOS"
            subtitle="CONSULTA A LA CLASE WIN32_PHYSICALMEMORY MEDIANTE CIM"
            shellType="POWERSHELL"
            command="Get-CimInstance Win32_PhysicalMemory | Select-Object DeviceLocator, Capacity, Speed, ConfiguredClockSpeed, Manufacturer, PartNumber"
            queHace="Interroga a la interfaz CIM/SMBIOS del sistema operativo para leer los parámetros identificatorios y de frecuencia reportados por los módulos de memoria instalados."
            queDevuelve="Una tabla con los módulos detectados, indicando el zócalo reportado, capacidad en bytes, frecuencia nominal (Speed), frecuencia en uso (ConfiguredClockSpeed) y número de parte."
            queDatoMirar="Compará 'ConfiguredClockSpeed' (o 'Speed' según versión): si tus memorias fueron adquiridas para 3200 o 6000 MT/s pero aquí reportan 2133 o 4800, el perfil XMP/EXPO no está aplicado en el firmware UEFI."
            queSignifica="La memoria opera con los parámetros base JEDEC de arranque seguro. El ancho de banda potencial queda desaprovechado respecto al perfil comercial hasta configurarlo en la BIOS. Nota pericial: este comando muestra datos declarados; para confirmar canal activo (Single/Dual Channel), timings o tasa de transferencia real, consultá el BIOS o herramientas de medición dedicada."
            outputSample="DeviceLocator: DIMM_A2 | Speed: 6000 | ConfiguredClockSpeed: 6000 | Manufacturer: Corsair | PartNumber: CMK32GX5M2B6000C30"
            tip="Si tenés dos módulos en una placa de 4 ranuras, revisá en DeviceLocator qué zócalos figuran poblados frente al manual de la placa."
          />

          {/* Triada Forense Complementaria: CPU, GPU y Almacenamiento */}
          <div className="p-3 bg-[#0a0d14] border border-zinc-800 rounded-lg text-xs font-mono-tech space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
              <span className="text-yellow-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>SUITE DE IDENTIFICACIÓN PERICIAL DE HARDWARE EN WINDOWS (WMI/CIM)</span>
              </span>
              <span className="text-[10px] text-zinc-500">AUDITORÍA SIN INSTALADORES</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
                <span className="text-amber-300 font-bold block">1. NÚCLEOS & CACHÉ L3 (CPU)</span>
                <code className="text-emerald-400 block break-all font-mono-tech">
                  Get-CimInstance Win32_Processor | Select Name, NumberOfCores, NumberOfLogicalProcessors, L3CacheSize
                </code>
                <p className="text-zinc-400 text-[9px] font-sans-editorial leading-tight">
                  Verifica que Windows no tenga hilos ocultos por configuraciones restrictivas de boot y certifica el pool de caché L3 real.
                </p>
              </div>
              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
                <span className="text-sky-300 font-bold block">2. DRIVER & VRAM REAL (GPU)</span>
                <code className="text-emerald-400 block break-all font-mono-tech">
                  Get-CimInstance Win32_VideoController | Select Name, DriverVersion, AdapterRAM, VideoProcessor
                </code>
                <p className="text-zinc-400 text-[9px] font-sans-editorial leading-tight">
                  Identifica la versión exacta de controlador reportada al kernel y el adaptador activo para descartar el uso involuntario de iGPU.
                </p>
              </div>
              <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
                <span className="text-emerald-300 font-bold block">3. BUS & PROTOCOLO (DISCO)</span>
                <code className="text-emerald-400 block break-all font-mono-tech">
                  Get-PhysicalDisk | Select FriendlyName, MediaType, BusType, HealthStatus
                </code>
                <p className="text-zinc-400 text-[9px] font-sans-editorial leading-tight">
                  Verifica si tu unidad opera en bus NVMe directo (PCIe) o SATA degradado, garantizando que el disco principal esté en estado saludable.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Safety Box */}
        <div className="p-2.5 bg-[#0d1017] border border-zinc-800 rounded-lg flex items-center justify-between text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-zinc-300 text-[11px]">
              <strong className="text-emerald-400 font-bold">GARANTÍA FORENSE:</strong> Todas las consultas CIM/WMI operan en modo solo lectura de estructuras SMBIOS/ACPI; no modifican registros ni consumen ciclos de cómputo en tu sistema.
            </span>
          </div>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 02 // NÚCLEOS EN MSCONFIG →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
