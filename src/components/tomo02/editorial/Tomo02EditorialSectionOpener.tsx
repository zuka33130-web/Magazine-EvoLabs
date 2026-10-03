import React from 'react';
import { TOMO_02_MODULES, TomoModuleItem } from '../../../data/tomo02Data';
import sec1Img from '../../../assets/images/cap_01_silicon_1789531835511.jpg';
import sec2Img from '../../../assets/images/cap_02_interconnect_1789531847526.jpg';
import sec3Img from '../../../assets/images/cap_05_kernel_1789531884339.jpg';
import sec4Img from '../../../assets/images/cap_03_frametime_1789531858625.jpg';
import sec5Img from '../../../assets/images/pcb_traces_detail_1789530447414.jpg';
import sec6Img from '../../../assets/images/cap_06_workshop_1789531894578.jpg';

export interface SectionOpenerMeta {
  romanNumber: string;
  sectionTitle: string;
  impactPhrase: string;
  image: string;
  imageAlt: string;
  whatYouWillUnderstand: string;
  whatYouWillVerify: string;
  moduleIds: string[];
}

export const SECTION_OPENERS_DATA: Record<string, SectionOpenerMeta> = {
  m00: {
    romanNumber: 'I',
    sectionTitle: 'ARQUITECTURA DE ARRANQUE & DESPLIEGUE',
    impactPhrase:
      'El encendido del silicio no es magia: es una cadena determinista de instrucciones desde el primer microvoltio en la placa madre.',
    image: sec1Img,
    imageAlt: 'Microfotografía editorial de arquitectura de silicio, pistas de cobre y socket de CPU',
    whatYouWillUnderstand:
      'Secuencia UEFI, tabla GPT, partición ESP, el almacén BCD y la transferencia al bootloader Winload.efi.',
    whatYouWillVerify:
      'Integridad del almacén BCD con bcdedit /enum y firmas de arranque seguro.',
    moduleIds: ['m00', 'm01', 'm02'],
  },
  m03: {
    romanNumber: 'II',
    sectionTitle: 'SISTEMA DE ARCHIVOS & ALMACENAMIENTO',
    impactPhrase:
      'El disco no almacena archivos: gestiona un árbol binario transaccional donde cada byte tiene un propietario y un registro de auditoría.',
    image: sec2Img,
    imageAlt: 'Fotografía macro de líneas de bus de datos y pistas de interconexión PCIe de alta velocidad',
    whatYouWillUnderstand:
      'La tabla maestra MFT de NTFS, el almacén inmutable WinSxS, la separación System32 vs SysWOW64 y la compresión Compact.',
    whatYouWillVerify:
      'Espacio real recuperable en WinSxS mediante DISM /AnalyzeComponentStore sin romper dependencias.',
    moduleIds: ['m03', 'm04', 'm05'],
  },
  m06: {
    romanNumber: 'III',
    sectionTitle: 'NÚCLEO, PROCESOS & MEMORIA VIRTUAL',
    impactPhrase:
      'La RAM libre es memoria desperdiciada. El Kernel NT no vacía: organiza, pagina y proyecta páginas de memoria bajo demanda física.',
    image: sec3Img,
    imageAlt: 'Fotografía editorial del encapsulado de silicio y substrato de alta densidad de compuertas lógicas',
    whatYouWillUnderstand:
      'Commit Charge vs Working Set, Standby List, Paged vs Non-Paged Pool, despachador de interrupciones y latencias DPC.',
    whatYouWillVerify:
      'Fugas de memoria en Non-Paged Pool con PoolMon y latencias de controladores con LatencyMon.',
    moduleIds: ['m06', 'm07', 'm08', 'm09'],
  },
  m10: {
    romanNumber: 'IV',
    sectionTitle: 'CONECTIVIDAD, SERVICIOS & AUTOMATIZACIÓN',
    impactPhrase:
      'Un proceso no es un programa: es un contenedor de hilos. Svchost agrupa servicios compartidos para ahorrar recursos, no para ocultar actividad.',
    image: sec4Img,
    imageAlt: 'Fotografía de osciloscopio y análisis de señales temporales y paquetes de red en tiempo real',
    whatYouWillUnderstand:
      'La arquitectura svchost.exe compartida, sockets TCP/UDP en escucha, SysMain, indexación inteligente y disparadores por eventos.',
    whatYouWillVerify:
      'Asociación unívoca entre servicios y PIDs con tasklist /svc y conexiones vivas con netstat -ano.',
    moduleIds: ['m10', 'm11', 'm12', 'm13'],
  },
  m14: {
    romanNumber: 'V',
    sectionTitle: 'TERMINAL, REGISTRO & CIBERSEGURIDAD',
    impactPhrase:
      'El Registro es una base de datos atómica en memoria. Desactivar el UAC no te hace técnico: le entrega la llave de Ring 0 a cualquier script.',
    image: sec5Img,
    imageAlt: 'Fotografía macro de trazas de circuito impreso PCB y capas conductoras de alta precisión',
    whatYouWillUnderstand:
      'Colmenas físicas del Registro (SAM, SYSTEM, SOFTWARE), permisos ACL, tokens de elevación UAC, directiva UIPI y telemetría.',
    whatYouWillVerify:
      'Vectores de persistencia en arranque con Autoruns y niveles de integridad de procesos con whoami /groups.',
    moduleIds: ['m14', 'm15', 'm16', 'm17', 'm18'],
  },
  m19: {
    romanNumber: 'VI',
    sectionTitle: 'METROLOGÍA, RECUPERACIÓN & CASOS DE TALLER',
    impactPhrase:
      'El mejor técnico no es el que formatea más rápido, sino el que rescata el sistema sin destruir un solo dato ni tocar la partición del usuario.',
    image: sec6Img,
    imageAlt: 'Fotografía editorial de instrumental forense de taller técnico, puntas de prueba y banco de trabajo',
    whatYouWillUnderstand:
      'El entorno de recuperación WinRE, reconstrucción de BCD, diagnóstico de volcados BSOD (Minidumps), triage en vivo y reparación in-place.',
    whatYouWillVerify:
      'Causa raíz exacta de caídas de hardware o controladores con WinDbg y telemetría de estabilidad con perfmon /rel.',
    moduleIds: ['m19', 'm20', 'm21', 'm22', 'm23', 'm24', 'm25', 'm26'],
  },
};

interface Tomo02EditorialSectionOpenerProps {
  moduleId: string;
  compact?: boolean;
}

export const Tomo02EditorialSectionOpener: React.FC<Tomo02EditorialSectionOpenerProps> = ({
  moduleId,
  compact = true,
}) => {
  const data = SECTION_OPENERS_DATA[moduleId] || SECTION_OPENERS_DATA.m00;

  // SOURCE OF TRUTH: Resolve module titles and numbers directly from TOMO_02_MODULES
  const sectionModules: TomoModuleItem[] = data.moduleIds
    .map((id) => TOMO_02_MODULES.find((m) => m.id === id))
    .filter(Boolean) as TomoModuleItem[];

  if (compact) {
    return (
      <header className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#030814] via-[#050B1B] to-black border border-cyan-500/40 shadow-xl font-sans-editorial">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Section Image thumbnail */}
          <div className="w-full md:w-36 h-24 rounded-xl overflow-hidden bg-black border border-cyan-900/80 shrink-0 relative shadow-md">
            <img
              src={data.image}
              alt={data.imageAlt}
              className="w-full h-full object-cover object-center filter contrast-[1.04] brightness-[0.96]"
            />
            <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/85 text-cyan-300 font-mono-tech text-[9px] font-black border border-cyan-800">
              SECCIÓN {data.romanNumber}
            </span>
          </div>

          {/* Section Title, Impact Quote & Metadata */}
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest font-bold">
              <span>SECCIÓN {data.romanNumber} // BLOQUE EDITORIAL MAESTRO</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">{sectionModules.length} MÓDULOS</span>
            </div>

            <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-tight leading-tight truncate">
              {data.sectionTitle}
            </h2>

            <p className="text-[11px] sm:text-xs text-cyan-200/90 italic font-sans-editorial line-clamp-1">
              “{data.impactPhrase}”
            </p>

            {/* Quick 2-Column Insight: Qué vas a entender / Qué vas a comprobar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[10.5px] font-mono-tech border-t border-cyan-950/70">
              <div className="truncate">
                <span className="text-cyan-400 font-bold">▸ ENTENDER: </span>
                <span className="text-zinc-300 font-sans-editorial">{data.whatYouWillUnderstand}</span>
              </div>
              <div className="truncate">
                <span className="text-emerald-400 font-bold">▸ COMPROBAR: </span>
                <span className="text-zinc-300 font-sans-editorial">{data.whatYouWillVerify}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Modules list resolved strictly from TOMO_02_MODULES */}
        <div className="mt-2.5 pt-2 border-t border-cyan-950/80 flex items-center gap-2 overflow-x-auto text-[10px] font-mono-tech scrollbar-none">
          <span className="text-zinc-500 uppercase tracking-wider shrink-0 font-bold">
            MÓDULOS SECCIÓN {data.romanNumber}:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {sectionModules.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-900/60 text-[10px]"
              >
                <span className="text-cyan-400 font-bold">{item.moduleNumber} —</span>
                <span className="text-zinc-200 font-medium truncate max-w-[220px]">{item.title}</span>
              </span>
            ))}
          </div>
        </div>
      </header>
    );
  }

  // Full-Page View (if ever used non-compact)
  return (
    <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
      <div className="border-b border-cyan-950/80 pb-2.5 flex items-baseline justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-2xl sm:text-3xl text-cyan-400">
            SECCIÓN {data.romanNumber}
          </span>
          <span className="text-zinc-600 font-mono-tech">/</span>
          <span className="text-xs font-mono-tech uppercase tracking-widest text-zinc-400 font-semibold">
            BLOQUE EDITORIAL MAESTRO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono-tech text-[10px] font-bold uppercase tracking-wider">
            {sectionModules.length} MÓDULOS DE INVESTIGACIÓN
          </span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight leading-[1.08]">
          {data.sectionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-cyan-300 font-sans-editorial italic font-medium leading-snug">
          “{data.impactPhrase}”
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 items-stretch min-h-0">
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="h-full rounded-2xl overflow-hidden bg-black border border-cyan-950/80 shadow-2xl relative">
            <img
              src={data.image}
              alt={data.imageAlt}
              className="w-full h-full object-cover object-center filter contrast-[1.04] brightness-[0.96]"
            />
          </div>
          <span className="text-[9.5px] font-mono-tech text-zinc-500 uppercase tracking-wider mt-1.5 block">
            {data.imageAlt}
          </span>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between space-y-2.5">
          <div className="p-3 rounded-xl bg-zinc-950/90 border border-cyan-950 space-y-1 text-xs">
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block">
              ▸ QUÉ VAS A ENTENDER EN ESTA SECCIÓN:
            </span>
            <p className="text-zinc-200 font-sans-editorial text-[11px] leading-snug">
              {data.whatYouWillUnderstand}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/90 border border-cyan-950 space-y-1 text-xs">
            <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider font-bold block">
              ▸ QUÉ VAS A COMPROBAR EN LABORATORIO:
            </span>
            <p className="text-zinc-200 font-sans-editorial text-[11px] leading-snug">
              {data.whatYouWillVerify}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-cyan-950/80 space-y-2 text-xs flex-1">
            <span className="text-[10px] font-mono-tech text-zinc-400 uppercase tracking-wider font-bold block border-b border-zinc-900 pb-1">
              MÓDULOS DE INVESTIGACIÓN INCLUIDOS:
            </span>
            <div className="space-y-1.5 font-mono-tech text-[10.5px]">
              {sectionModules.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-zinc-300">
                  <span className="w-4 h-4 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-[9px] border border-cyan-800">
                    {item.moduleNumber}
                  </span>
                  <span className="font-semibold text-white">
                    {item.moduleNumber} — {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
