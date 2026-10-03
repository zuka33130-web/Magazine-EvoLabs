import React from 'react';
import { TOMO_02_MODULES, TomoModuleItem } from '../../../data/tomo02Data';
import { Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Tomo02ModuleVisual } from '../Tomo02VisualEngine';

export interface SectionOpenerMeta {
  romanNumber: string;
  sectionTitle: string;
  subtitle: string;
  impactPhrase: string;
  architectureBadge: string;
  heroVisualModuleId: string;
  imageCaption: string;
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
    heroVisualModuleId: 'm01',
    imageCaption: 'PIPELINE CRONOLÓGICO: SECUENCIA POST ➔ ESP (FAT32) ➔ BCD STORE ➔ WINLOAD.EFI ➔ NTOSKRNL',
    whatYouWillUnderstand:
      'Secuencia UEFI, tabla GPT, partición ESP, el almacén BCD y la transferencia de control al bootloader Winload.efi.',
    whatYouWillVerify:
      'Integridad del almacén BCD con bcdedit /enum y firmas digitales de arranque seguro.',
    moduleIds: ['m00', 'm01', 'm02'],
  },
  m03: {
    romanNumber: 'II',
    sectionTitle: 'SISTEMA DE ARCHIVOS & ALMACENAMIENTO',
    subtitle: 'Árbol transaccional NTFS, almacén inmutable y jerarquía física NVMe',
    impactPhrase:
      'El disco no almacena archivos: gestiona un árbol binario transaccional donde cada byte tiene un propietario y un registro de auditoría.',
    architectureBadge: 'ESTRUCTURA DE ALMACENAMIENTO // MFT TRANSACCIONAL Y WINSXS',
    heroVisualModuleId: 'm03',
    imageCaption: 'ANATOMÍA NTFS: REGISTROS MFT DE 1024 BYTES, DIARIO TRANSACCIONAL $LogFile Y PROYECCIÓN HARDLINKS WINSXS',
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
    heroVisualModuleId: 'm06',
    imageCaption: 'ARQUITECTURA DE PRIVILEGIOS: ESPACIO DE MEMORIA DE USUARIO (RING 3) VS KERNEL NT HYBRID (RING 0)',
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
    heroVisualModuleId: 'm12',
    imageCaption: 'MATRIZ DE AISLAMIENTO: SERVICE CONTROL MANAGER (SCM) Y ASIGNACIÓN DE GRUPOS SVCHOST POR CUENTA',
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
    heroVisualModuleId: 'm15',
    imageCaption: 'ESTRUCTURA DE COLMENAS: ARCHIVOS FÍSICOS SYSTEM/SOFTWARE EN DISCO VS BLOQUES HBIN DE 4096 BYTES EN RAM',
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
    heroVisualModuleId: 'm19',
    imageCaption: 'PIPELINE DE RESCATE: DETECCIÓN DE REPARACIÓN AUTOMÁTICA EN BUCLE ➔ ASIGNACIÓN ESP ➔ REGENERACIÓN BCDBOOT',
    whatYouWillUnderstand:
      'El entorno de recuperación WinRE, reconstrucción de BCD, diagnóstico de volcados BSOD (Minidumps), triage en vivo y reparación in-place.',
    whatYouWillVerify:
      'Causa raíz exacta de caídas de hardware o controladores con WinDbg y telemetría de estabilidad con perfmon /rel.',
    moduleIds: ['m19', 'm20', 'm21', 'm22', 'm23', 'm24', 'm25', 'm26'],
  },
};

// ============================================================================
// MAIN COMPONENT: TOMO 02 EDITORIAL SECTION OPENER
// Premium ChapterHeroOpener Parity: Meta + Grand Title + Hero Visual (220-300px)
// + Caption + Editorial Lead/Pillars + Module Sequence Ribbon
// ============================================================================

interface Tomo02EditorialSectionOpenerProps {
  moduleId: string;
  integrated?: boolean;
}

export const Tomo02EditorialSectionOpener: React.FC<Tomo02EditorialSectionOpenerProps> = ({
  moduleId,
  integrated = false,
}) => {
  const data = SECTION_OPENERS_DATA[moduleId] || SECTION_OPENERS_DATA.m00;

  // Resolve opening module and section modules strictly from TOMO_02_MODULES
  const sectionModules: TomoModuleItem[] = data.moduleIds
    .map((id) => TOMO_02_MODULES.find((m) => m.id === id))
    .filter(Boolean) as TomoModuleItem[];

  const heroModule: TomoModuleItem =
    TOMO_02_MODULES.find((m) => m.id === data.heroVisualModuleId) ||
    TOMO_02_MODULES.find((m) => m.id === moduleId) ||
    sectionModules[0];

  if (integrated) {
    return (
      <div className="flex flex-col gap-2 font-sans-editorial shrink-0 pb-1">
        {/* 1. Top Section Metadata Bar */}
        <div className="border-b border-cyan-950/80 pb-1.5 flex items-baseline justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono-tech tracking-widest uppercase font-black px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/50 text-cyan-300">
              SECCIÓN {data.romanNumber}
            </span>
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-zinc-300 font-bold">
              APERTURA EDITORIAL MAESTRA
            </span>
          </div>
          <span className="text-[9.5px] font-mono-tech text-cyan-400 uppercase tracking-wider hidden sm:inline font-bold">
            DIVISIÓN DE INGENIERÍA & KERNEL NT
          </span>
        </div>

        {/* 2. Main Grand Title & Subtitle */}
        <div className="space-y-0.5 shrink-0">
          <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white uppercase tracking-tight leading-[1.08]">
            {data.sectionTitle}
          </h2>
          <p className="font-mono-tech text-xs uppercase tracking-wider font-semibold text-cyan-400">
            {data.subtitle}
          </p>
        </div>

        {/* 3. Hero Visual Stage (Dominant Centerpiece 180-220px) */}
        <div className="relative rounded-xl overflow-hidden border border-cyan-900/80 bg-[#040812] shadow-xl h-[180px] sm:h-[200px] shrink-0 flex flex-col justify-between group">
          {/* Visual Engine Graphic */}
          <div className="flex-1 w-full h-full relative overflow-hidden">
            <Tomo02ModuleVisual module={heroModule} compact={true} />
          </div>

          {/* Technical Caption Overlay with Pulsing Status Indicator */}
          <div className="relative z-20 px-3 py-1.5 backdrop-blur-md bg-black/80 border-t border-cyan-500/30 flex items-center justify-between text-xs font-mono-tech select-none shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 shrink-0 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#00D2FF]" />
              <span className="text-[10px] sm:text-[11px] text-cyan-200 tracking-wide font-medium">
                {data.imageCaption}
              </span>
            </div>
            <span className="text-[9px] text-cyan-400/80 uppercase tracking-widest hidden sm:inline font-bold">
              INFOGRAFÍA DE ARQUITECTURA NT
            </span>
          </div>
        </div>

        {/* 4. Principle Callout Banner */}
        <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-black border-l-2 border-cyan-400 border border-cyan-950/60 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase shrink-0">
              PRINCIPIO:
            </span>
            <span className="text-[11px] text-zinc-200 font-sans-editorial italic font-medium truncate">
              “{data.impactPhrase}”
            </span>
          </div>
          <span className="text-[9.5px] font-mono-tech text-zinc-400 uppercase tracking-wider shrink-0 hidden md:inline">
            {sectionModules.length} MÓDULOS EN ESTA SECCIÓN
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between space-y-3.5 font-sans-editorial">
      {/* 1. Top Section Metadata Bar */}
      <div className="border-b border-cyan-950/80 pb-2.5 flex items-baseline justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-tech tracking-widest uppercase font-black px-2.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/50 text-cyan-300">
            SECCIÓN {data.romanNumber}
          </span>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-zinc-300 font-bold">
            BLOQUE EDITORIAL MAESTRO
          </span>
        </div>
        <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider hidden sm:inline font-bold">
          DIVISIÓN DE INGENIERÍA & KERNEL NT
        </span>
      </div>

      {/* 2. Main Grand Title & Subtitle */}
      <div className="space-y-1">
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight leading-[1.05]">
          {data.sectionTitle}
        </h2>
        <p className="font-mono-tech text-xs sm:text-sm uppercase tracking-wider font-semibold text-cyan-400">
          {data.subtitle}
        </p>
      </div>

      {/* 3. Hero Visual Stage (Dominant Centerpiece 40-50% visual weight: 240px - 300px) */}
      <div className="relative rounded-xl overflow-hidden border border-cyan-900/80 bg-[#040812] shadow-2xl flex-1 min-h-[230px] max-h-[300px] group flex flex-col justify-between">
        {/* Visual Engine Graphic */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
          <Tomo02ModuleVisual module={heroModule} compact={true} />
        </div>

        {/* Technical Caption Overlay with Pulsing Status Indicator */}
        <div className="relative z-20 px-3.5 py-2 backdrop-blur-md bg-black/75 border-t border-cyan-500/30 flex items-center justify-between text-xs font-mono-tech select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 shrink-0 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#00D2FF]" />
            <span className="text-[10.5px] sm:text-[11px] text-cyan-200 tracking-wide font-medium">
              {data.imageCaption}
            </span>
          </div>
          <span className="text-[9.5px] text-cyan-400/80 uppercase tracking-widest hidden sm:inline font-bold">
            INFOGRAFÍA DE ARQUITECTURA NT
          </span>
        </div>
      </div>

      {/* 4. Editorial Lead + Key Provocative Principle & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-0.5 items-start">
        {/* Left: Principle Callout */}
        <div className="md:col-span-6 p-3 rounded-xl bg-gradient-to-br from-cyan-950/30 via-zinc-950 to-black border-l-3 border-cyan-400 border-t border-r border-b border-cyan-950/60 shadow-lg">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRINCIPIO DETERMINISTA DE LA SECCIÓN:</span>
          </div>
          <blockquote className="font-sans-editorial text-xs sm:text-[12.5px] text-zinc-100 leading-snug italic font-medium">
            “{data.impactPhrase}”
          </blockquote>
        </div>

        {/* Right: Technical Insights (Understand + Verify) */}
        <div className="md:col-span-6 space-y-1.5 font-sans-editorial text-xs">
          <div className="p-2.5 rounded-lg bg-[#070D1C] border border-cyan-950/90 shadow-md">
            <span className="text-[10px] font-mono-tech text-cyan-300 font-bold uppercase tracking-wide block mb-0.5">
              ▸ ARQUITECTURA CLAVE:
            </span>
            <p className="text-zinc-200 text-[11px] leading-tight">
              {data.whatYouWillUnderstand}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1C] border border-emerald-950/90 shadow-md">
            <span className="text-[10px] font-mono-tech text-emerald-400 font-bold uppercase tracking-wide block mb-0.5">
              ▸ COMPROBACIÓN EN LABORATORIO:
            </span>
            <p className="text-zinc-200 text-[11px] leading-tight">
              {data.whatYouWillVerify}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Module Sequence Strip */}
      <div className="pt-2 border-t border-cyan-950/80 flex items-center justify-between text-xs font-mono-tech">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-zinc-400 uppercase tracking-wider shrink-0 font-bold text-[10px]">
            SECUENCIA SECCIÓN {data.romanNumber}:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {sectionModules.map((item, idx) => (
              <div
                key={item.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 text-[11px]"
              >
                <span className="text-cyan-400 font-black">#{item.moduleNumber}</span>
                <span className="text-white font-semibold truncate max-w-[200px]">{item.title}</span>
                {idx < sectionModules.length - 1 && (
                  <span className="text-cyan-600 font-bold ml-0.5">➔</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <span className="text-cyan-400 font-bold text-[10px] shrink-0 hidden lg:inline">
          {sectionModules.length} MÓDULOS EN ESTE BLOQUE
        </span>
      </div>
    </div>
  );
};
