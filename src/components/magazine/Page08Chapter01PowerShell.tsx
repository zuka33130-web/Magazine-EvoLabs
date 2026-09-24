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
      sectionTitle="LABORATORIO PRÁCTICO"
      subSlug="PROBALO EN TU PC // AUDITORÍA DIRECTA DE SILICIO"
      accentColor="#EAB308"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
              PROBALO EN TU PC // AUDITORÍA SIN SOFTWARE DE TERCEROS
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Inspección de Memoria con PowerShell
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            CAPÍTULO 01 // LABORATORIO
          </span>
        </div>

        {/* Narrative Context */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            No necesitás instalar aplicaciones desconocidas para una primera inspección del hardware. Windows incluye subsistemas WMI y CIM que consultan las tablas SMBIOS proporcionadas por la placa madre. Con este comando de PowerShell podés consultar los parámetros reportados por el firmware (capacidad, frecuencia declarada, fabricante y código de parte) para verificar si la velocidad configurada coincide con el perfil esperado o si opera en valores base de seguridad.
          </p>
        </div>

        {/* Lab Command Feature Component */}
        <div className="flex-1">
          <LabEvoCommand
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
        </div>

        {/* Bottom Safety Box */}
        <div className="p-3 bg-[#0d1017] border border-zinc-800 rounded-lg flex items-center justify-between text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-zinc-300">
              <strong className="text-emerald-400 font-bold">GARANTÍA FORENSE:</strong> Este comando es de solo lectura (DQL/CIM). No modifica ningún registro ni altera ninguna configuración de tu sistema.
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
