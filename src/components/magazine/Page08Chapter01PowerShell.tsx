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
            No necesitás instalar aplicaciones desconocidas ni ejecutables dudosos para auditar las tripas de tu hardware. Windows incluye subsistemas WMI y CIM que consultan directamente las tablas SMBIOS de la placa madre. Con un único comando de PowerShell podés auditar si tu memoria RAM está rindiendo al 100% de lo que pagaste o si funciona a velocidad de fábrica reducida.
          </p>
        </div>

        {/* Lab Command Feature Component */}
        <div className="flex-1">
          <LabEvoCommand
            title="AUDITORÍA DE BANCOS Y RELOJ DE MEMORIA"
            subtitle="CONSULTA A LA TABLA SMBIOS MEDIANTE CIMINSTANCE"
            shellType="POWERSHELL"
            command="Get-CimInstance Win32_PhysicalMemory | Select BankLabel, Capacity, Speed, Manufacturer, PartNumber"
            queHace="Interroga directamente al firmware del sistema operativo para obtener la telemetría grabada en el módulo SPD de cada banco de memoria física instalado."
            queDevuelve="Una tabla con tantas filas como ranuras pobladas tengas en tu placa madre, indicando capacidad en bytes, frecuencia de reloj en MHz y fabricante real del silicio."
            queDatoMirar="Prestá especial atención a la columna 'Speed': si compraste memorias de 3200 o 6000 MT/s pero aquí figura 2133 o 4800, tu perfil XMP/EXPO está apagado en el BIOS."
            queSignifica="La memoria funciona a velocidad JEDEC de arranque seguro. Perdiste entre un 20% y un 35% de ancho de banda efectivo hasta que actives el perfil en el menú de la placa."
            outputSample="BankLabel: BANK 0 | Speed: 6000 | Manufacturer: 04CD (Corsair) | PartNumber: CMK32GX5M2B6000C30"
            tip="Si ves BANK 0 y BANK 1 pero tenés cuatro zócalos, verificá si están en ranuras contiguas o alternadas A2/B2."
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
