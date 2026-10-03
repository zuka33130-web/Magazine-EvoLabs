import React from 'react';
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { TomoModuleItem } from '../../../data/tomo02Data';
import sec1Img from '../../../assets/images/cap_01_silicon_1789531835511.jpg';
import sec2Img from '../../../assets/images/cap_02_interconnect_1789531847526.jpg';
import sec3Img from '../../../assets/images/cap_05_kernel_1789531884339.jpg';
import sec4Img from '../../../assets/images/cap_03_frametime_1789531858625.jpg';
import sec5Img from '../../../assets/images/pcb_traces_detail_1789530447414.jpg';
import sec6Img from '../../../assets/images/cap_06_workshop_1789531894578.jpg';

interface SectionOpenerMeta {
  romanNumber: string;
  sectionTitle: string;
  impactPhrase: string;
  image: string;
  imageAlt: string;
  whatYouWillUnderstand: string;
  whatYouWillVerify: string;
  includedModules: { number: string; title: string }[];
}

const SECTION_OPENERS_DATA: Record<string, SectionOpenerMeta> = {
  m00: {
    romanNumber: 'I',
    sectionTitle: 'ARQUITECTURA DE ARRANQUE & DESPLIEGUE',
    impactPhrase:
      'El encendido del silicio no es magia: es una cadena determinista de instrucciones desde el primer microvoltio en la placa madre hasta el primer píxel del shell.',
    image: sec1Img,
    imageAlt: 'Microfotografía editorial de arquitectura de silicio, pistas de cobre y socket de CPU',
    whatYouWillUnderstand:
      'La secuencia exacta desde UEFI, partición ESP, el almacén de configuración de arranque (BCD) y la transferencia de control a Winload.efi.',
    whatYouWillVerify:
      'Integridad del almacén BCD con bcdedit /enum y firmas digitales de los binarios de inicio sin conjeturas.',
    includedModules: [
      { number: '00', title: 'Apertura Metodológica & Pasaporte' },
      { number: '01', title: 'Ring 0 vs Ring 3 & Compuertas Syscall' },
      { number: '02', title: 'Jerarquía de Memoria & Boot Pipeline' },
    ],
  },
  m03: {
    romanNumber: 'II',
    sectionTitle: 'SISTEMA DE ARCHIVOS & ALMACENAMIENTO',
    impactPhrase:
      'El disco no almacena archivos: gestiona un árbol binario transaccional donde cada byte tiene un propietario, descriptores de seguridad y un registro de auditoría.',
    image: sec2Img,
    imageAlt: 'Fotografía macro de líneas de bus de datos y pistas de interconexión PCIe de alta velocidad',
    whatYouWillUnderstand:
      'La tabla maestra MFT de NTFS, el almacén inmutable WinSxS, la separación System32 vs SysWOW64 y la compresión Compact nativa.',
    whatYouWillVerify:
      'Espacio real recuperable en el almacén de componentes mediante DISM /AnalyzeComponentStore sin romper dependencias.',
    includedModules: [
      { number: '03', title: 'Árbol de Procesos, Hilos & Handles' },
      { number: '04', title: 'Latencias DPC/ISR & Controladores' },
      { number: '05', title: 'NTFS Master File Table ($MFT)' },
    ],
  },
  m06: {
    romanNumber: 'III',
    sectionTitle: 'NÚCLEO, PROCESOS & MEMORIA VIRTUAL',
    impactPhrase:
      'La RAM libre es memoria desperdiciada. El Kernel NT no vacía: organiza, pagina y proyecta páginas de memoria bajo demanda física determinista.',
    image: sec3Img,
    imageAlt: 'Fotografía editorial del encapsulado de silicio y substrato de alta densidad de compuertas lógicas',
    whatYouWillUnderstand:
      'Commit Charge vs Working Set, Standby List, Paged vs Non-Paged Pool, despachador de interrupciones y latencias DPC de controladores.',
    whatYouWillVerify:
      'Fugas de memoria en modo kernel mediante PoolMon (tag Thrd) y microcongelamientos de controladores con LatencyMon.',
    includedModules: [
      { number: '06', title: 'Pipeline NVMe & E/S de Almacenamiento' },
      { number: '07', title: 'Cadena de Booteo UEFI & Winload.efi' },
      { number: '08', title: 'Colmenas Binarias del Registro (Hives)' },
      { number: '09', title: 'Event Log & Telemetría ETW Nativa' },
    ],
  },
  m10: {
    romanNumber: 'IV',
    sectionTitle: 'CONECTIVIDAD, SERVICIOS & AUTOMATIZACIÓN',
    impactPhrase:
      'Un proceso no es un programa: es un contenedor de hilos. Svchost agrupa servicios compartidos para ahorrar recursos, no para ocultar actividad.',
    image: sec4Img,
    imageAlt: 'Fotografía de osciloscopio y análisis de señales temporales y paquetes de red en tiempo real',
    whatYouWillUnderstand:
      'La arquitectura svchost.exe compartida, sockets TCP/UDP en escucha, SysMain, indexación inteligente y disparadores por eventos de hardware.',
    whatYouWillVerify:
      'Asociación unívoca entre servicios y PIDs con tasklist /svc y conexiones vivas con netstat -ano.',
    includedModules: [
      { number: '10', title: 'Sockets de Red & Netstat en Escucha' },
      { number: '11', title: 'Service Control Manager & Svchost' },
      { number: '12', title: 'Pipeline Gráfico WDDM & DWM' },
      { number: '13', title: 'Programador de Tareas & Desencadenadores' },
    ],
  },
  m14: {
    romanNumber: 'V',
    sectionTitle: 'TERMINAL, REGISTRO & CIBERSEGURIDAD',
    impactPhrase:
      'El Registro es una base de datos atómica en memoria. Desactivar el UAC no te hace técnico: le entrega la llave de Ring 0 a cualquier script intruso.',
    image: sec5Img,
    imageAlt: 'Fotografía macro de trazas de circuito impreso PCB y capas conductoras de alta precisión',
    whatYouWillUnderstand:
      'Colmenas físicas del Registro (SAM, SYSTEM, SOFTWARE), permisos ACL, tokens de elevación UAC, directiva UIPI y telemetría racional.',
    whatYouWillVerify:
      'Vectores de persistencia en arranque mediante Autoruns y niveles de integridad de proceso con whoami /groups.',
    includedModules: [
      { number: '14', title: 'Persistencia en Arranque & Autoruns' },
      { number: '15', title: 'Estructura Hexadecimal del Registro' },
      { number: '16', title: 'Telemetría de Diagnóstico & ETW' },
      { number: '17', title: 'Servicing Stack CBS & Almacén WinSxS' },
      { number: '18', title: 'UAC, Tokens & Secure Desktop' },
    ],
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
    includedModules: [
      { number: '19', title: 'WinRE & Rescate de Arranque BCD' },
      { number: '20', title: 'Metrología DPC con LatencyMon' },
      { number: '21', title: 'Optimización E/S en Bajos Recursos' },
      { number: '22', title: 'Protocolos de Emergencia & Safe Mode' },
      { number: '23', title: 'Expedientes Forenses de Taller' },
      { number: '24', title: 'Matriz de Herramientas de Élite' },
      { number: '25', title: 'Glosario & Reparación In-Place' },
      { number: '26', title: 'Pasaporte del Investigador & Auditoría' },
    ],
  },
};

interface Tomo02EditorialSectionOpenerProps {
  module: TomoModuleItem;
  onSelectModule?: (index: number) => void;
  moduleIndex: number;
}

export const Tomo02EditorialSectionOpener: React.FC<Tomo02EditorialSectionOpenerProps> = ({
  module,
  onSelectModule,
  moduleIndex,
}) => {
  const data = SECTION_OPENERS_DATA[module.id] || SECTION_OPENERS_DATA.m00;

  return (
    <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
      {/* Top Section Header with Roman Numeral */}
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
            {data.includedModules.length} MÓDULOS DE INVESTIGACIÓN
          </span>
        </div>
      </div>

      {/* Title & Impact Phrase */}
      <div className="space-y-1.5 pt-1">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight leading-[1.08]">
          {data.sectionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-cyan-300 font-sans-editorial italic font-medium leading-snug">
          “{data.impactPhrase}”
        </p>
      </div>

      {/* Main 2-Column Split: Editorial Photograph (Left) + Pedagogical Roadmap (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 items-stretch min-h-0">
        {/* Left Column (6 cols): Pure Editorial Photograph */}
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

        {/* Right Column (6 cols): Qué vas a entender, Qué vas a comprobar, Módulos incluidos */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-2.5">
          {/* Qué vas a entender */}
          <div className="p-3 rounded-xl bg-zinc-950/90 border border-cyan-950 space-y-1 text-xs">
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block">
              ▸ QUÉ VAS A ENTENDER EN ESTA SECCIÓN:
            </span>
            <p className="text-zinc-200 font-sans-editorial text-[11px] leading-snug">
              {data.whatYouWillUnderstand}
            </p>
          </div>

          {/* Qué vas a comprobar */}
          <div className="p-3 rounded-xl bg-zinc-950/90 border border-cyan-950 space-y-1 text-xs">
            <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider font-bold block">
              ▸ QUÉ VAS A COMPROBAR EN LABORATORIO:
            </span>
            <p className="text-zinc-200 font-sans-editorial text-[11px] leading-snug">
              {data.whatYouWillVerify}
            </p>
          </div>

          {/* Módulos incluidos */}
          <div className="p-3 rounded-xl bg-black/60 border border-cyan-950/80 space-y-2 text-xs flex-1">
            <span className="text-[10px] font-mono-tech text-zinc-400 uppercase tracking-wider font-bold block border-b border-zinc-900 pb-1">
              MÓDULOS DE INVESTIGACIÓN INCLUIDOS:
            </span>
            <div className="space-y-1.5 font-mono-tech text-[10.5px]">
              {data.includedModules.map((item) => (
                <div key={item.number} className="flex items-center gap-2 text-zinc-300">
                  <span className="w-4 h-4 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-[9px] border border-cyan-800">
                    {item.number}
                  </span>
                  <span className="font-semibold text-white">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
