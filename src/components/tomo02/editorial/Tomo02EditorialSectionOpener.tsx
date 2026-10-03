import React from 'react';
import { TOMO_02_MODULES, TomoModuleItem } from '../../../data/tomo02Data';
import {
  Sparkles,
  Zap,
  Layers,
  Database,
  Cpu,
  Network,
  Lock,
  Wrench,
  ShieldCheck,
  Activity,
  Compass,
} from 'lucide-react';

export interface SectionOpenerMeta {
  romanNumber: string;
  sectionTitle: string;
  subtitle: string;
  impactPhrase: string;
  architectureBadge: string;
  whatYouWillUnderstand: string;
  whatYouWillVerify: string;
  moduleIds: string[];
}

export const SECTION_OPENERS_DATA: Record<string, SectionOpenerMeta> = {
  m00: {
    romanNumber: 'I',
    sectionTitle: 'ARQUITECTURA DE ARRANQUE & DESPLIEGUE',
    subtitle: 'Cadena de confianza determinista y transición de firmware a kernel',
    impactPhrase:
      'El encendido del silicio no es magia: es una cadena determinista de instrucciones desde el primer microvoltio en la placa madre.',
    architectureBadge: 'CADENA DE ARRANQUE // DE UEFI Y PARTICIÓN ESP AL KERNEL NT',
    whatYouWillUnderstand:
      'Secuencia UEFI, tabla GPT, partición ESP, el almacén BCD y la transferencia al bootloader Winload.efi.',
    whatYouWillVerify:
      'Integridad del almacén BCD con bcdedit /enum y firmas de arranque seguro.',
    moduleIds: ['m00', 'm01', 'm02'],
  },
  m03: {
    romanNumber: 'II',
    sectionTitle: 'SISTEMA DE ARCHIVOS & ALMACENAMIENTO',
    subtitle: 'Árbol transaccional NTFS, almacén inmutable y jerarquía física NVMe',
    impactPhrase:
      'El disco no almacena archivos: gestiona un árbol binario transaccional donde cada byte tiene un propietario y un registro de auditoría.',
    architectureBadge: 'ESTRUCTURA DE ALMACENAMIENTO // MFT TRANSACCIONAL Y WINSXS',
    whatYouWillUnderstand:
      'La tabla maestra MFT de NTFS, el almacén inmutable WinSxS, la separación System32 vs SysWOW64 y la compresión Compact.',
    whatYouWillVerify:
      'Espacio real recuperable en WinSxS mediante DISM /AnalyzeComponentStore sin romper dependencias.',
    moduleIds: ['m03', 'm04', 'm05'],
  },
  m06: {
    romanNumber: 'III',
    sectionTitle: 'NÚCLEO, PROCESOS & MEMORIA VIRTUAL',
    subtitle: 'Arquitectura híbrida NT, aislamiento Ring 0/Ring 3 y gestión de páginas',
    impactPhrase:
      'La RAM libre es memoria desperdiciada. El Kernel NT no vacía: organiza, pagina y proyecta páginas de memoria bajo demanda física.',
    architectureBadge: 'ARQUITECTURA NT // FRONTERA RING 3/RING 0 Y COMMIT CHARGE',
    whatYouWillUnderstand:
      'Commit Charge vs Working Set, Standby List, Paged vs Non-Paged Pool, despachador de interrupciones y latencias DPC.',
    whatYouWillVerify:
      'Fugas de memoria en Non-Paged Pool con PoolMon y latencias de controladores con LatencyMon.',
    moduleIds: ['m06', 'm07', 'm08', 'm09'],
  },
  m10: {
    romanNumber: 'IV',
    sectionTitle: 'CONECTIVIDAD, SERVICIOS & AUTOMATIZACIÓN',
    subtitle: 'Matriz de aislamiento svchost, sockets en escucha y eventos de servicio',
    impactPhrase:
      'Un proceso no es un programa: es un contenedor de hilos. Svchost agrupa servicios compartidos para ahorrar recursos, no para ocultar actividad.',
    architectureBadge: 'MATRIZ DE SERVICIOS // SCM, SVCHOST Y SOCKETS DE RED',
    whatYouWillUnderstand:
      'La arquitectura svchost.exe compartida, sockets TCP/UDP en escucha, SysMain, indexación inteligente y disparadores por eventos.',
    whatYouWillVerify:
      'Asociación unívoca entre servicios y PIDs con tasklist /svc y conexiones vivas con netstat -ano.',
    moduleIds: ['m10', 'm11', 'm12', 'm13'],
  },
  m14: {
    romanNumber: 'V',
    sectionTitle: 'TERMINAL, REGISTRO & CIBERSEGURIDAD',
    subtitle: 'Colmenas binarias atómicas, tokens de elevación y barreras UIPI',
    impactPhrase:
      'El Registro es una base de datos atómica en memoria. Desactivar el UAC no te hace técnico: le entrega la llave de Ring 0 a cualquier script.',
    architectureBadge: 'COLMENAS DEL REGISTRO // TOKENS UAC Y BARRERAS UIPI',
    whatYouWillUnderstand:
      'Colmenas físicas del Registro (SAM, SYSTEM, SOFTWARE), permisos ACL, tokens de elevación UAC, directiva UIPI y telemetría.',
    whatYouWillVerify:
      'Vectores de persistencia en arranque con Autoruns y niveles de integridad de procesos con whoami /groups.',
    moduleIds: ['m14', 'm15', 'm16', 'm17', 'm18'],
  },
  m19: {
    romanNumber: 'VI',
    sectionTitle: 'METROLOGÍA, RECUPERACIÓN & CASOS DE TALLER',
    subtitle: 'Triangulación de fallos, volcados BSOD, WinRE y reparación in-place',
    impactPhrase:
      'El mejor técnico no es el que formatea más rápido, sino el que rescata el sistema sin destruir un solo dato ni tocar la partición del usuario.',
    architectureBadge: 'TRIANGULACIÓN FORENSE // WINRE, DUMPS BSOD Y PERFMON',
    whatYouWillUnderstand:
      'El entorno de recuperación WinRE, reconstrucción de BCD, diagnóstico de volcados BSOD (Minidumps), triage en vivo y reparación in-place.',
    whatYouWillVerify:
      'Causa raíz exacta de caídas de hardware o controladores con WinDbg y telemetría de estabilidad con perfmon /rel.',
    moduleIds: ['m19', 'm20', 'm21', 'm22', 'm23', 'm24', 'm25', 'm26'],
  },
};

// ============================================================================
// MAIN COMPONENT: TOMO 02 EDITORIAL SECTION OPENER
// High-Fidelity Editorial Section Header (Parity with Tomo 01 ChapterHeroOpener)
// ============================================================================

interface Tomo02EditorialSectionOpenerProps {
  moduleId: string;
  compact?: boolean;
}

export const Tomo02EditorialSectionOpener: React.FC<Tomo02EditorialSectionOpenerProps> = ({
  moduleId,
}) => {
  const data = SECTION_OPENERS_DATA[moduleId] || SECTION_OPENERS_DATA.m00;

  // SOURCE OF TRUTH: Resolve module titles and numbers directly from TOMO_02_MODULES
  const sectionModules: TomoModuleItem[] = data.moduleIds
    .map((id) => TOMO_02_MODULES.find((m) => m.id === id))
    .filter(Boolean) as TomoModuleItem[];

  return (
    <header className="mb-3.5 p-3.5 rounded-xl bg-gradient-to-r from-[#030814] via-[#051026] to-[#02050D] border border-cyan-500/40 shadow-2xl font-sans-editorial h-auto space-y-2.5">
      {/* 1. Top Metadata Bar */}
      <div className="flex items-center justify-between pb-1.5 border-b border-cyan-950/80">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono-tech tracking-widest uppercase font-black px-2.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/50 text-cyan-300">
            SECCIÓN {data.romanNumber}
          </span>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-zinc-300 font-bold">
            BLOQUE EDITORIAL MAESTRO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase tracking-wider">
            {sectionModules.length} MÓDULOS DE INVESTIGACIÓN
          </span>
        </div>
      </div>

      {/* 2. Main Title & Subtitle */}
      <div className="space-y-0.5">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight leading-[1.05]">
          {data.sectionTitle}
        </h2>
        <p className="font-mono-tech text-xs sm:text-[12.5px] uppercase tracking-wider text-cyan-400 font-bold">
          {data.subtitle}
        </p>
      </div>

      {/* 3. Editorial Lead & Key Insights (No microboxes, pure editorial typography) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1 border-t border-cyan-950/70 items-start">
        {/* Provocative Quote / Impact Statement */}
        <div className="md:col-span-6 p-3 rounded-lg bg-black/60 border-l-3 border-cyan-400 border-t border-r border-b border-cyan-950/60">
          <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            PRINCIPIO DETERMINISTA:
          </span>
          <p className="text-xs sm:text-[12.5px] text-zinc-100 font-sans-editorial leading-snug italic font-medium">
            “{data.impactPhrase}”
          </p>
        </div>

        {/* Understand & Verify Editorial Columns */}
        <div className="md:col-span-6 space-y-1.5 font-sans-editorial text-xs">
          <div className="p-2 rounded-lg bg-[#070D1C] border border-cyan-950">
            <span className="text-[10px] font-mono-tech text-cyan-300 font-bold uppercase tracking-wide block mb-0.5">
              ▸ ARQUITECTURA CLAVE:
            </span>
            <p className="text-zinc-200 text-[11px] leading-tight">
              {data.whatYouWillUnderstand}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#070D1C] border border-emerald-950">
            <span className="text-[10px] font-mono-tech text-emerald-400 font-bold uppercase tracking-wide block mb-0.5">
              ▸ COMPROBACIÓN EN LABORATORIO:
            </span>
            <p className="text-zinc-200 text-[11px] leading-tight">
              {data.whatYouWillVerify}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Clean Module Sequence Navigation Strip */}
      <div className="pt-1.5 border-t border-cyan-950/80 flex items-center gap-2 overflow-x-auto text-xs font-mono-tech scrollbar-none h-auto">
        <span className="text-zinc-400 uppercase tracking-wider shrink-0 font-bold text-[10.5px]">
          SECUENCIA SECCIÓN {data.romanNumber}:
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {sectionModules.map((item, idx) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-800/80 text-xs font-mono-tech"
            >
              <span className="text-cyan-400 font-black">#{item.moduleNumber}</span>
              <span className="text-white font-semibold truncate max-w-[220px]">{item.title}</span>
              {idx < sectionModules.length - 1 && (
                <span className="text-cyan-600 font-bold ml-0.5">➔</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};
