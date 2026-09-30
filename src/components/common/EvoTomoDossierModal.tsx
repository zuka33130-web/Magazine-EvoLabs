import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  FileText,
  CheckCircle2,
  Terminal,
  Shield,
  Server,
  Layers,
  Printer,
  ArrowRight,
  Sparkles,
  Cpu,
  Activity,
  Wrench,
  Laptop,
  Radio,
  Lock,
  Zap,
  Power,
} from 'lucide-react';
import { VOLUMES_COLLECTION } from '../../data/collections';
import { EvoBootLab } from '../tomo08/EvoBootLab';

export interface ForensicBenchTarget {
  tomoId: string;
  moduleNumber: string;
  labView: 'hotswap-lab' | 'windows-matrix' | 'motherboard-canvas' | 'incident-central' | 'boot-lab';
  scenario?: string;
  station?: string;
}

interface EvoTomoDossierModalProps {
  tomoId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTomoView?: (id: string) => void;
  onOpenForensicBench?: (target: ForensicBenchTarget) => void;
}

export interface TomoEditorialCoverMeta {
  tomoKey: string;
  number: string;
  volumeLabel: string;
  editionLabel: string;
  primaryColor: string;
  accentGradient: string;
  glowShadow: string;
  tagline: string;
  title: string;
  editorialSubtitle: string;
  pagesBadge: string;
  systemStandard: string;
  keyTopics: {
    num: string;
    title: string;
    description: string;
  }[];
  heroGraphic: {
    badge: string;
    chipName: string;
    frequencyOrSpec: string;
    statusLabel: string;
    features: string[];
    bgPattern: string;
  };
}

export const TOMOS_EDITORIAL_COVERS: Record<string, TomoEditorialCoverMeta> = {
  'tomo-01': {
    tomoKey: 'tomo-01',
    number: '01',
    volumeLabel: 'TOMO 01',
    editionLabel: 'EDICIÓN 01 // HARDWARE',
    primaryColor: '#f59e0b',
    accentGradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    glowShadow: 'rgba(245, 158, 11, 0.28)',
    tagline: '“Entendé tu máquina desde adentro.”',
    title: 'EVO LABS // CONOCÉ TU PC',
    editorialSubtitle:
      'La velocidad real se define en el silicio y la sincronía de buses mucho antes de que se renderice un fotograma. Análisis forense de topología de componentes y límites de diseño.',
    pagesBadge: '46 PÁGINAS A4',
    systemStandard: 'MICROELECTRÓNICA & BUS TOPOLOGY',
    keyTopics: [
      {
        num: '01',
        title: 'Microarquitectura & Ciclos de Reloj',
        description: 'Jerarquía de memorias caché L1/L2/L3, ancho de palabra y ejecución especulativa.',
      },
      {
        num: '02',
        title: 'Topología PCIe & Ancho de Banda Real',
        description: 'Bifurcación de líneas, carriles directos a CPU vs. Chipset y latencia de acceso.',
      },
      {
        num: '03',
        title: 'Límites Térmicos & Curvas VRM',
        description: 'Vdroop, conmutación MOSFET, resistencia térmica y degradación de silicio por electromigración.',
      },
    ],
    heroGraphic: {
      badge: 'TOPOLOGÍA DE SILICIO // RING 0 BUS',
      chipName: 'EVO CORE X-SILICON // 3nm DIE',
      frequencyOrSpec: '0.00 ns absolute base latency',
      statusLabel: 'INTERCONEXIÓN DETERMINISTA ACTIVA',
      features: ['Infinity Fabric / Mesh Link', 'IMC Dual Channel DDR5', 'PCIe 5.0 Direct Lanes x16'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(245,158,11,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-02': {
    tomoKey: 'tomo-02',
    number: '02',
    volumeLabel: 'TOMO 02',
    editionLabel: 'EDICIÓN MAESTRA 2026 // WINDOWS KERNEL',
    primaryColor: '#00d2ff',
    accentGradient: 'from-cyan-500/20 via-blue-600/10 to-transparent',
    glowShadow: 'rgba(0, 210, 255, 0.28)',
    tagline: '“El lado oculto de Windows. Descubrilo.”',
    title: 'EVO LABS // LA BIBLIA NEGRA DE WINDOWS',
    editorialSubtitle:
      'Desmitificación absoluta del sistema operativo Windows: arquitectura NTOSKRNL, colas DPC diferidas, temporizadores de alta precisión y control total de la telemetría.',
    pagesBadge: '48 PÁGINAS A4 // 26 ÁREAS',
    systemStandard: 'MICROSOFT SYSINTERNALS & RING 0 ARCHITECTURE',
    keyTopics: [
      {
        num: '01',
        title: 'Anatomía de una interrupción ISR/DPC',
        description: 'Colas de procesamiento diferido, contención en controladores y latencias en microsegundos.',
      },
      {
        num: '02',
        title: 'Desmantelando telemetría de Windows',
        description: 'Servicios DiagTrack, Registro profundo, ETW (Event Tracing) y políticas de grupo GPO sin romper dependencias.',
      },
      {
        num: '03',
        title: 'Temporizadores de alta precisión y micro-stuttering',
        description: 'HPET vs TSC invariable, resolución del quantum de hilo (0.5ms) y pacing uniforme de cuadros.',
      },
    ],
    heroGraphic: {
      badge: 'TRAZA DE RING 0 // NTOSKRNL.EXE',
      chipName: 'KERNEL DISPATCHER INTERRUPT CONTROLLER',
      frequencyOrSpec: 'ISR/DPC budget: < 15.0 µs target',
      statusLabel: 'ESTADO: RING 0 DESACOPLADO & AUDITADO',
      features: ['Non-Maskable Interrupts (NMI)', 'Direct Memory Access Guard', 'High Precision QPC (TSC Sync)'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(0,210,255,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-03': {
    tomoKey: 'tomo-03',
    number: '03',
    volumeLabel: 'TOMO 03',
    editionLabel: 'EDICIÓN DE TALLER 2026 // MANUAL DE BANCO',
    primaryColor: '#10b981',
    accentGradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    glowShadow: 'rgba(16, 185, 129, 0.28)',
    tagline: '“Nunca estuviste mejor guiado.”',
    title: 'REPARACIÓN DE PC // SISTEMA EVO LABS',
    editorialSubtitle:
      'Protocolos periciales de laboratorio para PC de escritorio: multímetro en fuentes ATX, diagnóstico oscilográfico de rieles, estados de POST y triaje deductivo de BugChecks.',
    pagesBadge: '122 PÁGINAS A4 // 35 MÓDULOS',
    systemStandard: 'METROLOGÍA INDUSTRIAL & OSCILOSCOPIO RIGOL/KEYSIGHT',
    keyTopics: [
      {
        num: '01',
        title: 'Medición de caídas de tensión (Vdroop)',
        description: 'Evaluación del rizado de alterna (ripple) bajo carga y compensación Load-Line Calibration (LLC).',
      },
      {
        num: '02',
        title: 'El lenguaje del osciloscopio',
        description: 'Inspección de señales de reloj (CLK), flancos de subida en bus SPI de BIOS y rieles de alimentación ATX.',
      },
      {
        num: '03',
        title: 'Triage pericial de BSOD y BugChecks',
        description: 'Análisis de volcados MiniDump con WinDbg: WHEA_UNCORRECTABLE, CRITICAL_PROCESS_DIED y PAGE_FAULT.',
      },
    ],
    heroGraphic: {
      badge: 'CADENA FÍSICA // METROLOGÍA EN CALIENTE',
      chipName: 'ATX12VO & EPS POWER STAGES BENCH',
      frequencyOrSpec: 'Ripple RMS < 18mV // VRM Response < 10µs',
      statusLabel: 'PROTOCOLO DEDUCTIVO SIN REEMPLAZO A CIEGAS',
      features: ['Sonda Diferencial 100MHz', 'Buzzer Hexadecimal Debug', 'Post Code Display SPI Analyzer'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(16,185,129,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-04': {
    tomoKey: 'tomo-04',
    number: '04',
    volumeLabel: 'TOMO 04',
    editionLabel: 'EDICIÓN PORTÁTILES 2026 // MICROMECÁNICA',
    primaryColor: '#d946ef',
    accentGradient: 'from-pink-500/20 via-purple-600/10 to-transparent',
    glowShadow: 'rgba(217, 70, 239, 0.28)',
    tagline: '“Diagnóstico real, paso a paso.”',
    title: 'REPARACIÓN DE NOTEBOOKS // SISTEMA EVO LABS',
    editorialSubtitle:
      'Ingeniería inversa de placas portátiles: mapas Boardview, inyección de corriente térmica, lectura de esquemáticos PDF, circuitos integrados de carga y líneas Always-On.',
    pagesBadge: '22 PÁGINAS // ROADMAP INTEGRAL',
    systemStandard: 'MICROSOLDADURA SMD/BGA & BOARDVIEW FORENSE',
    keyTopics: [
      {
        num: '01',
        title: 'Inyección de tensión y termografía',
        description: 'Localización microscópica de condensadores MLCC en corto mediante cámara térmica infrarroja.',
      },
      {
        num: '02',
        title: 'Lectura forense de esquemáticos boardview',
        description: 'Seguimiento de señales de Enable, Gate de MOSFETs de conmutación y chips Charger de batería.',
      },
      {
        num: '03',
        title: 'Secuencias de encendido y líneas Always-On',
        description: 'Validación de 3.3V_ALW, 5V_ALW, estados S5 a S0 y comunicación del Embedded Controller (KBC/EC).',
      },
    ],
    heroGraphic: {
      badge: 'MAPEO BOARDVIEW // EMBEDDED CONTROLLER',
      chipName: 'ITE / ENE EC CONTROLLER & CHARGER IC',
      frequencyOrSpec: '19.5V Rail -> Buck Step-Down 3.3V/5V',
      statusLabel: 'RIELES DE ENERGÍA Y SECUENCIA DE ARRANQUE',
      features: ['Sensor Infrarrojo FLIR Thermal', 'Estación de Retrabajo JBC Micro', 'Programador SPI RT809H'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(217,70,239,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-05': {
    tomoKey: 'tomo-05',
    number: '05',
    volumeLabel: 'TOMO 05',
    editionLabel: 'EDICIÓN REDES 2026 // TRÁFICO Y PROTOCOLOS',
    primaryColor: '#06b6d4',
    accentGradient: 'from-cyan-500/20 via-sky-600/10 to-transparent',
    glowShadow: 'rgba(6, 182, 212, 0.28)',
    tagline: '“Entendé cómo se comunica tu PC, cómo viaja Internet y descubrí secretos PRO.”',
    title: 'SISTEMA EVO LABS DE REDES',
    editorialSubtitle:
      'De cero a entender y dominar cómo viajan los datos. Redes, Ethernet, Wi-Fi, IP, DNS, TCP/UDP, routing, puertos, Wireshark, paquetes y análisis de tráfico.',
    pagesBadge: '190 PÁGINAS A4 // 7 MÓDULOS',
    systemStandard: 'RFC PROTOCOL COMPLIANCE & OSI/TCP STACK AUDITING',
    keyTopics: [
      {
        num: '01',
        title: 'Inspección de paquetes a bajo nivel',
        description: 'Análisis de ventanas TCP, handshakes TLS 1.3, retransmisiones, DNS y latencia de ida y vuelta (RTT).',
      },
      {
        num: '02',
        title: 'Topología física & conmutación Ethernet',
        description: 'Switches gestionables, segmentación de tráfico 802.1Q VLANs, STP y agregación LACP.',
      },
      {
        num: '03',
        title: 'Filtrado de tráfico, puertos & enrutamiento',
        description: 'Reglas NFTables, Stateful Inspection, NAT, tablas de enrutamiento IPv4/IPv6 y túneles cifrados WireGuard.',
      },
    ],
    heroGraphic: {
      badge: 'TOPOLOGÍA OSI // ANÁLISIS DE TRÁFICO',
      chipName: 'WIRESHARK RAW DEEP PACKET ENGINE',
      frequencyOrSpec: 'Ethernet 10GbE // Wi-Fi 6E/7 // TCP BBR',
      statusLabel: 'CAPTURA PERICIAL & DECODIFICACIÓN DE FLUJOS',
      features: ['Wireshark Deep Packet Inspection', 'DNS & Routing Triage Table', 'Stateful Packet Filtering'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(6,182,212,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-06': {
    tomoKey: 'tomo-06',
    number: '06',
    volumeLabel: 'TOMO 06',
    editionLabel: 'EDICIÓN CIBERSEGURIDAD 2026 // LABS VIRTUALES',
    primaryColor: '#ef4444',
    accentGradient: 'from-rose-600/25 via-red-600/10 to-transparent',
    glowShadow: 'rgba(239, 68, 68, 0.28)',
    tagline: '“Desde cero hasta dominar tu red.”',
    title: 'CIBERSEGURIDAD // SISTEMA EVO LABS',
    editorialSubtitle:
      'Laboratorios virtuales incluidos por niveles. Aprendizaje progresivo, prácticas y ejercicios virtuales desde base hasta avanzado. Metodología de ataque y defensa, análisis dinámico y mitigación.',
    pagesBadge: 'LABORATORIOS VIRTUALES POR NIVELES',
    systemStandard: 'MITRE ATT&CK FRAMEWORK & DEFENSIVE HARDENING',
    keyTopics: [
      {
        num: '01',
        title: 'Nivel 01: Metodología del Ataque y Defensa',
        description: 'Matriz táctica MITRE ATT&CK: desde el reconocimiento y acceso inicial hasta la contención defensiva.',
      },
      {
        num: '02',
        title: 'Nivel 02: Laboratorio Dinámico en Sandbox Aislada',
        description: 'Monitoreo de comportamiento en tiempo real con Procmon, Regshot e interceptación de tráfico simulado.',
      },
      {
        num: '03',
        title: 'Nivel 03: Hardening Defensivo y Arquitectura Zero-Trust',
        description: 'Políticas ASR, AppLocker, Sysmon calibrado, mitigación de ransomware y segmentación de privilegios.',
      },
    ],
    heroGraphic: {
      badge: 'CIBERSEGURIDAD // LABS VIRTUALES POR NIVELES',
      chipName: 'EVO CYBER LABS // MITRE DEFENSIVE SUITE',
      frequencyOrSpec: 'Zero-Trust Sandbox // Dynamic Behavioral Triage',
      statusLabel: 'APRENDIZAJE PROGRESIVO & LABORATORIOS PRÁCTICOS',
      features: ['Laboratorios Virtuales Progresivos', 'Sandbox de Contención Segura', 'Mitigación Zero-Trust Calibrada'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(239,68,68,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-07': {
    tomoKey: 'tomo-07',
    number: '07',
    volumeLabel: 'TOMO 07',
    editionLabel: 'EN DESARROLLO // EDICIÓN GAMING 2026',
    primaryColor: '#f59e0b',
    accentGradient: 'from-amber-500/25 via-orange-600/10 to-transparent',
    glowShadow: 'rgba(245, 158, 11, 0.28)',
    tagline: '“Optimizamos de verdad. Sin secretos.”',
    title: 'SISTEMA EVO LABS // GAMING PRO',
    editorialSubtitle:
      'FPS, frametime, latencia, estabilidad y rendimiento medido.',
    pagesBadge: 'EN DESARROLLO // INVESTIGACIÓN TÉCNICA',
    systemStandard: 'FRAME PACING & HARDWARE TIMING SPEC',
    keyTopics: [
      {
        num: '01',
        title: 'Frametime & Consistencia de Renderizado',
        description: 'Análisis de percentiles 1% low, 0.1% low, micro-stuttering y consistencia entre fotogramas sucesivos.',
      },
      {
        num: '02',
        title: 'Cadena de Latencia & Input Lag',
        description: 'Muestreo de periféricos, colas del renderizador de Windows, tecnologías anti-lag y tasa de refresco.',
      },
      {
        num: '03',
        title: 'Estabilidad Térmica & Sostenibilidad de Frecuencia',
        description: 'Curvas de voltaje/frecuencia bajo carga pesada continua versus picos sintéticos transitorios.',
      },
    ],
    heroGraphic: {
      badge: 'METROLOGÍA // FRAME PACING',
      chipName: 'EVO GAMING BENCHMARK & TELEMETRY',
      frequencyOrSpec: 'Frametimes μs // 1% Low Percentiles // CapFrameX Protocol',
      statusLabel: 'MEDICIÓN CIENTÍFICA DE RENDIMIENTO BAJO CARGA',
      features: ['Frametime Pacing Analysis', 'Input Lag Pipeline Triage', 'Clock Throttling Verification'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(245,158,11,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-08': {
    tomoKey: 'tomo-08',
    number: '08',
    volumeLabel: 'TOMO 08',
    editionLabel: 'EDICIÓN MAESTRA // ARRANQUE & FALLAS 2026',
    primaryColor: '#10b981',
    accentGradient: 'from-emerald-500/25 via-teal-600/10 to-transparent',
    glowShadow: 'rgba(16, 185, 129, 0.28)',
    tagline: '“Del botón POWER al escritorio: arranque, diagnóstico y reparación como nunca te lo explicaron.”',
    title: 'SISTEMA EVO LABS DE ARRANQUE Y FALLAS',
    editorialSubtitle:
      'Laboratorio Virtual de Arranque y Diagnóstico EVO. Recorrido visual, guiado y paso a paso desde presionar POWER hasta llegar al escritorio de Windows, atravesando hardware, firmware, POST, BIOS/UEFI, memoria, GPU, almacenamiento, bootloader, kernel, drivers, servicios y sesión.',
    pagesBadge: '16 PÁGINAS A4 // EDICIÓN TÉCNICA MAESTRA',
    systemStandard: 'UEFI SPECIFICATION & WINDOWS BOOT EXECUTION PATH',
    keyTopics: [
      {
        num: '01',
        title: 'Hardware, Firmware & POST Inicial',
        description: 'Señales eléctricas Power Good, fases VRM, POST de placa madre y entrenamiento de memoria RAM.',
      },
      {
        num: '02',
        title: 'Bootloader, BCD & Carga del Kernel',
        description: 'Partición ESP, winload.efi, ntoskrnl.exe, inicialización de HAL y verificación Secure Boot.',
      },
      {
        num: '03',
        title: 'Drivers, Servicios & Sesión de Usuario',
        description: 'Drivers boot-start, subsistema SMSS/CSRSS, autenticación Winlogon y renderizado final de Explorer.',
      },
    ],
    heroGraphic: {
      badge: 'ARQUITECTURA DE ARRANQUE // SECUENCIA POST A KERNEL',
      chipName: 'EVO BOOT SEQUENCE LAB & TRACER',
      frequencyOrSpec: 'POST → UEFI → Winload → NT Kernel → User Session',
      statusLabel: 'RECORRIDO VISUAL PASO A PASO GUIADO',
      features: ['Etapas de Secuencia de Energía', 'Puntos Críticos de Falla en Boot', 'Auditoría de Drivers y Servicios'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(16,185,129,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-09': {
    tomoKey: 'tomo-09',
    number: '09',
    volumeLabel: 'TOMO 09',
    editionLabel: 'EN DESARROLLO // KERNEL & SISTEMAS 2026',
    primaryColor: '#38bdf8',
    accentGradient: 'from-sky-500/25 via-blue-600/10 to-transparent',
    glowShadow: 'rgba(56, 189, 248, 0.28)',
    tagline: '“Entendé qué pasa debajo del sistema operativo.”',
    title: 'SISTEMA EVO LABS DE SISTEMAS Y KERNEL',
    editorialSubtitle:
      'Procesos, memoria, virtualización y funcionamiento interno del sistema.',
    pagesBadge: 'EN DESARROLLO // ARQUITECTURA DE SISTEMAS',
    systemStandard: 'POSIX / LINUX KERNEL SUBSYSTEM SPEC',
    keyTopics: [
      {
        num: '01',
        title: 'Arquitectura del Kernel Linux & Subsistemas',
        description: 'Estructura monolithic modular, sysfs, procfs, systemd, llamadas de sistema y control de procesos.',
      },
      {
        num: '02',
        title: 'Gestión de Memoria & Almacenamiento ZFS',
        description: 'Paginación virtual, TLB, pools RAID-Z, snapshots atómicos y compresión ZSTD.',
      },
      {
        num: '03',
        title: 'Hipervisores KVM & Contenedores OCI',
        description: 'Virtualización Tipo 1 por hardware, passthrough PCIe con VFIO, cgroups v2 y namespaces aislados.',
      },
    ],
    heroGraphic: {
      badge: 'SUBSISTEMAS KERNEL // KVM HYPERVISOR',
      chipName: 'LINUX KERNEL MONOLITHIC & CGROUPS V2',
      frequencyOrSpec: 'KVM VFIO Passthrough // ZFS RAID-Z // eBPF',
      statusLabel: 'FUNCIONAMIENTO INTERNO DEL SISTEMA OPERATIVO',
      features: ['Sysfs & Procfs Governance', 'KVM / VFIO Hardware Passthrough', 'ZFS Atomic CoW Resiliency'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(56,189,248,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-10': {
    tomoKey: 'tomo-10',
    number: '10',
    volumeLabel: 'TOMO 10',
    editionLabel: 'EN DESARROLLO // INGENIERÍA INVERSA & FORENSE',
    primaryColor: '#a855f7',
    accentGradient: 'from-purple-600/25 via-fuchsia-600/10 to-transparent',
    glowShadow: 'rgba(168, 85, 247, 0.28)',
    tagline: '“No mires sólo el resultado. Reconstruí lo que pasó.”',
    title: 'SISTEMA EVO LABS // FORENSE E INGENIERÍA INVERSA',
    editorialSubtitle:
      'Análisis profundo, evidencia, memoria, binarios e investigación técnica.',
    pagesBadge: 'EN DESARROLLO // PERITAJE TÉCNICO',
    systemStandard: 'VOLATILITY 3 & DISASSEMBLER SRE STANDARDS',
    keyTopics: [
      {
        num: '01',
        title: 'Análisis Estático de Binarios con Ghidra',
        description: 'Desensamblado x86/x64, cabeceras PE/ELF, tablas IAT, grafos de flujo de control y firmas YARA.',
      },
      {
        num: '02',
        title: 'Análisis Forense de Memoria Volátil',
        description: 'Extracción de volcados RAM con Volatility 3, inyección DLL reflectiva y reconstrucción de procesos ocultos.',
      },
      {
        num: '03',
        title: 'Rootkits de Kernel (Ring 0) & EDR Bypass',
        description: 'DKOM (Direct Kernel Object Manipulation), hook de IRPs, evasión de sandboxes y cadena de custodia pericial.',
      },
    ],
    heroGraphic: {
      badge: 'INGENIERÍA INVERSA // FORENSE DE MEMORIA',
      chipName: 'GHIDRA SRE // VOLATILITY 3 SUITE',
      frequencyOrSpec: 'PE/ELF Disassembly // Ring 0 DKOM // SHA-256 Custodia',
      statusLabel: 'PERITAJE TÉCNICO & EXTRACCIÓN DE EVIDENCIA',
      features: ['Desensamblado x86/x64 Ghidra', 'Forense de RAM Volatility 3', 'Auditoría DKOM & Cadena de Custodia'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(168,85,247,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },
};

const TOMO_EXTENDED_DATA: Record<
  string,
  {
    pages: string;
    modulesCount: string;
    targetAudience: string;
    modules: {
      number: string;
      title: string;
      desc: string;
      benchConfig?: {
        labView: 'hotswap-lab' | 'windows-matrix' | 'motherboard-canvas' | 'incident-central' | 'boot-lab';
        scenario?: string;
        station?: string;
        badgeLabel?: string;
      };
    }[];
  }
> = {
  'tomo-01': {
    pages: '46 páginas A4',
    modulesCount: '7 capítulos de investigación física',
    targetAudience: 'Ingenieros de hardware, ensambladores de precisión y entusiastas de la arquitectura de PC',
    modules: [
      {
        number: 'C01',
        title: 'Pasaporte de Hardware & Topología de Silicio',
        desc: 'Identificación de microarquitectura, stepping, litografía y capacidades nativas del procesador.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'TOPOLOGÍA DE SILICIO' }
      },
      {
        number: 'C02',
        title: 'Mapa de Flujo de Recursos & Buses PCIe (Latencia RAM)',
        desc: 'Interconexión de CPU con memoria RAM DDR5 CL30 vs CL40, NVMe directo vs líneas DMI del Chipset.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'ram-ddr5-cl30-cl40', station: 'station-ram', badgeLabel: 'DDR5 CL30 VS CL40' }
      },
      {
        number: 'C03',
        title: 'Perfil de Fluidez & Frametimes a 60 FPS (Jitter Vectorial)',
        desc: 'Desmitificando el promedio de FPS: variabilidad cuadro a cuadro, percentil 99% / 99.9% y osciloscopio de jitter.',
        benchConfig: { labView: 'windows-matrix', scenario: 'timer-resolution', badgeLabel: 'OSCILOSCOPIO JITTER' }
      },
      {
        number: 'C04',
        title: 'Matriz de Limitaciones Físicas y Cuellos de Botella',
        desc: 'Análisis simultáneo de contención en CPU, saturación de GPU y latencia de memoria RAM.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'bottleneck-matrix', station: 'station-gpu', badgeLabel: 'MATRIZ CUELLO BOTELLA' }
      },
      {
        number: 'C05',
        title: 'Mapa de Actividad Oculta de Windows',
        desc: 'Servicios en segundo plano, indexación de archivos, Windows Defender e interrupciones de sistema.',
        benchConfig: { labView: 'windows-matrix', scenario: 'telemetry-diagtrack', badgeLabel: 'ACTIVIDAD OCULTA' }
      },
      {
        number: 'C06',
        title: 'Bitácora de Optimización Medida',
        desc: 'Registro formal de cambios con medición antes/después: latencias, térmicas y estabilidad.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'ab-bench', badgeLabel: 'MEDICIÓN A/B' }
      },
      {
        number: 'C07',
        title: 'Diagnóstico de Caso Anómalo de Hardware',
        desc: 'Resolución metódica de fallas intermitentes, caídas bruscas de reloj y microtirones de frametime.',
        benchConfig: { labView: 'windows-matrix', scenario: 'vcache-parking', badgeLabel: '3D V-CACHE PARKING' }
      },
    ],
  },
  'tomo-02': {
    pages: '48 páginas A4',
    modulesCount: '26 áreas forenses de Windows',
    targetAudience: 'Administradores de sistemas, desarrolladores de kernel y técnicos de soporte avanzado',
    modules: [
      {
        number: 'A01',
        title: 'Arquitectura NTOSKRNL & Secuencia Boot / Fast Startup',
        desc: 'Espacio de memoria de usuario vs kernel, transiciones por Syscalls y análisis de arranque rápido con hiberfil.sys.',
        benchConfig: { labView: 'windows-matrix', scenario: 'boot-sequence', badgeLabel: 'KERNEL NT & BOOT' }
      },
      {
        number: 'A02',
        title: 'Colas DPC (Deferred Procedure Calls) & Drivers',
        desc: 'Latencias en controladores StorAHCI, Nvlddmkm y NDIS con LatencyMon, osciloscopio vectorial e inyector de conflictos.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'OSCILOSCOPIO DPC' }
      },
      {
        number: 'A03',
        title: 'Desmantelamiento de Telemetría sin Romper el SO',
        desc: 'Políticas de grupo, bloqueo de telemetría DiagTrack y neutralización de recopilación CEIP.',
        benchConfig: { labView: 'windows-matrix', scenario: 'telemetry-diagtrack', badgeLabel: 'TELEMETRÍA KERNEL' }
      },
      {
        number: 'A04',
        title: 'Temporizadores del Sistema (HPET vs NtSetTimerResolution)',
        desc: 'Resolución de reloj a 0.500 ms (2000 Hz), sincronía multi-core y eliminación de jitter en audio y renderizado.',
        benchConfig: { labView: 'windows-matrix', scenario: 'timer-resolution', badgeLabel: 'TEMPORIZADORES NT' }
      },
      {
        number: 'A05',
        title: 'Gestor de Memoria y Paginación (Working Sets & LTSC)',
        desc: 'Standby list, archivos de paginación Pagefile.sys, compresión de memoria en RAM y huella de Windows 10 LTSC.',
        benchConfig: { labView: 'windows-matrix', scenario: 'win10-ltsc', badgeLabel: 'HUELLA BASAL LTSC' }
      },
      {
        number: 'A06',
        title: 'Auditoría con Herramientas Sysinternals (Procmon & Process Explorer)',
        desc: 'Trazas de hilos, llamadas I/O a disco y depuración de controladores huérfanos.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'TRAZAS RING 0' }
      },
    ],
  },
  'tomo-03': {
    pages: '122 páginas A4',
    modulesCount: '35 módulos de cadena física de taller',
    targetAudience: 'Técnicos de reparación de PC, peritos de laboratorio y reconstructores de hardware',
    modules: [
      {
        number: 'M01',
        title: 'Protocolo de Seguridad Eléctrica y Puesta a Tierra',
        desc: 'Descargas electrostáticas (ESD), aislamiento galvánico y diferencial de taller.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'esd-safety', badgeLabel: 'SEGURIDAD ESD' }
      },
      {
        number: 'M02',
        title: 'Medición de Rieles ATX con Carga Falsa & Ripple',
        desc: 'Tolerancias de rieles +12V, +5V, +3.3V, señal Power_Good y ruido ripple pico a pico con sonda diferencial.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'atx-rails-ripple', station: 'station-psu', badgeLabel: 'RIELES ATX & RIPPLE' }
      },
      {
        number: 'M03',
        title: 'Secuencia de Estados de POST y Códigos de Buzzer',
        desc: 'Interpretación de beeps según BIOS AMI/Award/Insyde y tarjetas de diagnóstico PCIe.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'post-codes', badgeLabel: 'CÓDIGOS POST SPI' }
      },
      {
        number: 'M04',
        title: 'Cortos en VRM, Etapas de Potencia & Protección SCP',
        desc: 'Controladores PWM multifásicos, MOSFETs High/Low en corto y colapso preventivo por protección de cortocircuito.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'vrm-short-scp', station: 'station-vrm', badgeLabel: 'COLAPSO CORTO VRM' }
      },
      {
        number: 'M05',
        title: 'Uso del Osciloscopio en el Taller de PC',
        desc: 'Configuración de sondas 10X, muestreo en rieles de memoria y detección de oscilaciones parásitas.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'SONDA OSCILOSCOPIO' }
      },
      {
        number: 'M06',
        title: 'Triage de Volcados de Memoria BSOD con WinDbg',
        desc: 'Identificación pericial de la dirección causante del fallo en controladores de terceros.',
        benchConfig: { labView: 'windows-matrix', scenario: 'boot-sequence', badgeLabel: 'TRIAGE WINDBG' }
      },
    ],
  },
  'tomo-04': {
    pages: '22 páginas A4',
    modulesCount: 'Roadmap y micromecánica de portátiles',
    targetAudience: 'Especialistas en microsoldadura, técnicos de portátiles y restauradores de placas',
    modules: [
      {
        number: 'N01',
        title: 'Desmontaje Quirúrgico y Preservación de Flex',
        desc: 'Protocolos de apertura sin deformar chasis de magnesio/aluminio y desconexión de batería.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'boardview-schematic', badgeLabel: 'BANCO PORTÁTILES' }
      },
      {
        number: 'N02',
        title: 'Línea de Entrada 19V / 20V (DC Jack y Conmutadores)',
        desc: 'Detección de MOSFETs de entrada en corto y fusible cerámico de protección abierta.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'boardview-schematic', badgeLabel: 'LÍNEAS 19V DC' }
      },
      {
        number: 'N03',
        title: 'Inyección de Tensión y Termografía Infrarroja',
        desc: 'Alimentación a corriente controlada para descubrir componentes en cortocircuito térmico.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'boardview-schematic', badgeLabel: 'CÁMARA FLIR' }
      },
      {
        number: 'N04',
        title: 'Lectura de Esquemáticos y Software Boardview',
        desc: 'Interpretación de diagramas OpenBoardView, líneas Always-On y señales de Enable.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'boardview-schematic', badgeLabel: 'BOARDVIEW PCB' }
      },
      {
        number: 'N05',
        title: 'Reballing y Reflujo de Silicio BGA',
        desc: 'Curvas de calentamiento térmico, perfil Sn-Pb vs libre de plomo y flujo de no-clean.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'boardview-schematic', badgeLabel: 'REBALLING BGA' }
      },
      {
        number: 'N06',
        title: 'Mantenimiento del Sistema de Heatpipe y Conductividad',
        desc: 'Inspección de cámaras de vapor agrietadas y aplicación de metal líquido / thermal pads.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'boardview-schematic', badgeLabel: 'CONDUCTIVIDAD' }
      },
    ],
  },
  'tomo-05': {
    pages: '190 páginas A4',
    modulesCount: '7 módulos de análisis de red y tráfico',
    targetAudience: 'Administradores de red, analistas de tráfico y especialistas en conectividad',
    modules: [
      {
        number: 'M01',
        title: 'Topología TCP/IP & Modelo OSI a Fondo',
        desc: 'Análisis de capas, direccionamiento IPv4/IPv6, subredes y tablas de enrutamiento.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'CLÚSTER DE RED' }
      },
      {
        number: 'M02',
        title: 'Captura Pericial con Wireshark',
        desc: 'Filtrado de tramas, inspección de TLS/SSL, análisis de DNS y latencia de ida y vuelta (RTT).',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'WIRESHARK RAW' }
      },
      {
        number: 'M03',
        title: 'Switches Gestionables & VLANs',
        desc: 'Segmentación de tráfico 802.1Q, STP, agregación de enlaces LACP y QoS.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'VLAN TRUNKING' }
      },
      {
        number: 'M04',
        title: 'Servicios de Red Esenciales',
        desc: 'Resolución de nombres DNS, DHCP, asignación de puertos y servicios de red perimetrales.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'SERVICIOS DE RED' }
      },
      {
        number: 'M05',
        title: 'Firewalls e IPTables / NFTables',
        desc: 'Reglas de filtrado de paquetes, NAT, Stateful Inspection y control de flujo de puertos.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'NFTABLES RULESET' }
      },
      {
        number: 'M06',
        title: 'VPNs Modernas: WireGuard vs OpenVPN',
        desc: 'Criptografía Curve25519, túneles punto a punto y topologías de enrutamiento seguro.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'WIREGUARD P2P' }
      },
      {
        number: 'M07',
        title: 'Monitorización y Métricas de Tráfico',
        desc: 'Telemetría de interfaces de red, análisis de throughput, pérdida de paquetes y latencias.',
        benchConfig: { labView: 'windows-matrix', scenario: 'timer-resolution', badgeLabel: 'TELEMETRÍA DE RED' }
      },
    ],
  },
  'tomo-06': {
    pages: '220 páginas A4',
    modulesCount: '7 niveles de laboratorios progresivos',
    targetAudience: 'Estudiantes, analistas de seguridad, operadores SOC y defensores de sistemas',
    modules: [
      {
        number: 'Nivel 01',
        title: 'Metodología del Ataque y Defensa (MITRE ATT&CK)',
        desc: 'Matriz táctica: desde el reconocimiento y acceso inicial hasta la contención defensiva.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'NIVEL 1 // MITRE' }
      },
      {
        number: 'Nivel 02',
        title: 'Reconocimiento Pasivo y Activo (OSINT & Scanning)',
        desc: 'Enumeración de puertos, escaneos Nmap, detección de servicios y cartografía de superficie de ataque.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'NIVEL 2 // SCANNING' }
      },
      {
        number: 'Nivel 03',
        title: 'Análisis Dinámico en Sandbox Aislada',
        desc: 'Laboratorio virtual: monitoreo con Procmon, Regshot y análisis de comportamiento en entorno seguro.',
        benchConfig: { labView: 'windows-matrix', scenario: 'telemetry-diagtrack', badgeLabel: 'NIVEL 3 // SANDBOX' }
      },
      {
        number: 'Nivel 04',
        title: 'Morfología de Ransomware & Persistencia',
        desc: 'Criptografía de extorsión, mecanismos de persistencia en el sistema y protección de sombras VSS.',
        benchConfig: { labView: 'windows-matrix', scenario: 'win10-ltsc', badgeLabel: 'NIVEL 4 // RESILIENCIA' }
      },
      {
        number: 'Nivel 05',
        title: 'Explotación Web y Auditoría (OWASP Top 10)',
        desc: 'Laboratorio interactivo de vulnerabilidades: inyecciones, rotura de control de acceso y remediación.',
        benchConfig: { labView: 'windows-matrix', scenario: 'telemetry-diagtrack', badgeLabel: 'NIVEL 5 // WEB LAB' }
      },
      {
        number: 'Nivel 06',
        title: 'Seguridad en Directorio Activo & Credenciales',
        desc: 'Ataques a Kerberos, extracción de credenciales, escalada de privilegios y contramedidas.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'NIVEL 6 // AD DEFENSE' }
      },
      {
        number: 'Nivel 07',
        title: 'Hardening Defensivo y Arquitectura Zero-Trust',
        desc: 'Control total: políticas AppLocker, reglas ASR, Sysmon calibrado y aislamiento de privilegios.',
        benchConfig: { labView: 'windows-matrix', scenario: 'win10-ltsc', badgeLabel: 'NIVEL 7 // CONTROL TOTAL' }
      },
    ],
  },
  'tomo-07': {
    pages: 'En desarrollo',
    modulesCount: 'En fase de investigación técnica',
    targetAudience: 'Entusiastas del rendimiento, gamers competitivos e ingenieros de benchmarking',
    modules: [],
  },
  'tomo-08': {
    pages: '16 páginas A4',
    modulesCount: '10 módulos de secuencia de energía, POST, firmware y kernel',
    targetAudience: 'Técnicos de diagnóstico, especialistas en firmware, reparadores de placas y depuradores de arranque',
    modules: [
      {
        number: 'M01',
        title: 'Standby, +5VSB & Circuito de Encendido',
        desc: 'El estado de reposo activo, medición en pin 9 ATX y detección del pulso de panel frontal en el Super I/O.',
        benchConfig: { labView: 'boot-lab', scenario: 'step-01', badgeLabel: 'STANDBY +5VSB' },
      },
      {
        number: 'M02',
        title: 'Arranque de PSU, PS_ON# & Rieles Principales',
        desc: 'Negociación entre motherboard y fuente: caída de PS_ON#, estabilización de rieles y confirmación Power Good (PWR_OK).',
        benchConfig: { labView: 'boot-lab', scenario: 'step-03', badgeLabel: 'PS_ON & PWR_OK' },
      },
      {
        number: 'M03',
        title: 'Despertar del CPU, Vector de Reset & Lectura SPI',
        desc: 'Liberación de CPU_RESET#, salto al vector 0xFFFFFFF0 y primeros pulsos de lectura en el bus SPI de la flash BIOS.',
        benchConfig: { labView: 'boot-lab', scenario: 'step-06', badgeLabel: 'CPU RESET & SPI' },
      },
      {
        number: 'M04',
        title: 'Secuencia POST & Diagnóstico por Q-LED',
        desc: 'El escaneo secuencial de subsistemas críticos mediante código SEC/PEI y códigos hexadecimales de Port 80h.',
        benchConfig: { labView: 'boot-lab', scenario: 'step-07', badgeLabel: 'POST & Q-LEDS' },
      },
      {
        number: 'M05',
        title: 'Entrenamiento de Memoria RAM & Memory Reference Code',
        desc: 'Lectura de EEPROM SPD, calibración eléctrica MRC, ajustes de impedancia ODT y reinicios controlados.',
        benchConfig: { labView: 'boot-lab', scenario: 'step-08', badgeLabel: 'ENTRENAMIENTO RAM' },
      },
      {
        number: 'M06',
        title: 'Inicialización de Video, PCIe & GOP / VBIOS',
        desc: 'Handshake en bus PCI Express, carga del Graphics Output Protocol (GOP) y primer cuadro de video en pantalla.',
        benchConfig: { labView: 'boot-lab', scenario: 'step-09', badgeLabel: 'SALIDA DE VIDEO' },
      },
      {
        number: 'M07',
        title: 'Hand-off UEFI, Búsqueda de Disco & Partición ESP',
        desc: 'Selección de dispositivo de arranque (BDS), lectura de tabla GPT y localización de bootmgfw.efi en partición EFI.',
        benchConfig: { labView: 'boot-lab', scenario: 'step-10', badgeLabel: 'DISCO & ESP' },
      },
      {
        number: 'M08',
        title: 'Bootloader Winload, BCD & Verificación Secure Boot',
        desc: 'Validación de firmas digitales con TPM 2.0, lectura del hive BCD y descarte de manipulaciones por bootkits.',
        benchConfig: { labView: 'boot-lab', scenario: 'step-10', badgeLabel: 'WINLOAD & BCD' },
      },
      {
        number: 'M09',
        title: 'Carga del Kernel NT, HAL & Drivers Boot-Start',
        desc: 'Inicialización de ntoskrnl.exe y hal.dll, carga de drivers Start=0 y llamada a ExitBootServices().',
        benchConfig: { labView: 'boot-lab', scenario: 'step-10', badgeLabel: 'KERNEL NT' },
      },
      {
        number: 'M10',
        title: 'Inicialización de Subsistemas, SMSS, Winlogon & Sesión',
        desc: 'Lanzamiento de smss.exe, csrss.exe, winlogon.exe, LogonUI y renderizado final del escritorio Explorer.',
        benchConfig: { labView: 'boot-lab', scenario: 'step-10', badgeLabel: 'SESIÓN DE USUARIO' },
      },
    ],
  },
  'tomo-09': {
    pages: 'En desarrollo',
    modulesCount: '5 módulos de arquitectura interna y sistemas',
    targetAudience: 'Administradores de sistemas Linux, desarrolladores de sistemas y entusiastas del kernel',
    modules: [
      {
        number: 'M01',
        title: 'Arquitectura del Kernel Linux & Subsistemas',
        desc: 'Estructura monolithic modular, sysfs, procfs, systemd e inicialización de servicios.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'LINUX KERNEL SYSFS' }
      },
      {
        number: 'M02',
        title: 'Administración de Almacenamiento ZFS & Btrfs',
        desc: 'Pools RAID-Z, snapshots atómicos, compresión ZSTD y reparación por paridad.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'ab-bench', badgeLabel: 'ZFS ATOMIC' }
      },
      {
        number: 'M03',
        title: 'Fundamentos de Hipervisores Tipo 1 vs Tipo 2',
        desc: 'Virtualización KVM/QEMU por hardware (Intel VT-x / AMD-V) y passthrough de PCI.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'KVM VFIO PASSTHROUGH' }
      },
      {
        number: 'M04',
        title: 'Despliegue de Clúster Proxmox VE',
        desc: 'Alta disponibilidad (HA), almacenamiento compartido Ceph y migración en caliente.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'PROXMOX CLUSTER' }
      },
      {
        number: 'M05',
        title: 'Contenedores Docker & Arquitectura OCI',
        desc: 'Cgroups v2, namespaces, procesos y aislamiento de subsistemas.',
        benchConfig: { labView: 'windows-matrix', scenario: 'win10-ltsc', badgeLabel: 'DOCKER CGROUPS' }
      },
    ],
  },
  'tomo-10': {
    pages: 'En desarrollo',
    modulesCount: '5 módulos de peritaje e ingeniería inversa',
    targetAudience: 'Peritos forenses, analistas de binarios, investigadores de malware e ingenieros inversos',
    modules: [
      {
        number: 'M01',
        title: 'Análisis Estático de Binarios con Ghidra',
        desc: 'Desensamblado x86/x64, PE headers, tablas de importación (IAT) y firmas YARA.',
        benchConfig: { labView: 'windows-matrix', scenario: 'boot-sequence', badgeLabel: 'GHIDRA SRE' }
      },
      {
        number: 'M02',
        title: 'Técnicas de Evasión y Desofuscación',
        desc: 'Detección de hipervisor/sandbox, timing attacks, packers UPX y strings cifradas con XOR.',
        benchConfig: { labView: 'windows-matrix', scenario: 'timer-resolution', badgeLabel: 'TIMING ATTACKS' }
      },
      {
        number: 'M03',
        title: 'Análisis Forense de Memoria con Volatility 3',
        desc: 'Extracción de volcados RAM, pslist, malfind, inyección DLL y dump de procesos.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'VOLATILITY 3 DUMP' }
      },
      {
        number: 'M04',
        title: 'Rootkits de Kernel (Ring 0) & EDR Bypass',
        desc: 'DKOM (Direct Kernel Object Manipulation), hook de IRPs y anulación de callbacks.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'RING 0 DKOM' }
      },
      {
        number: 'M05',
        title: 'Respuesta ante Incidentes & Cadena de Custodia',
        desc: 'Adquisición forense de discos (dd/E01), hashing SHA-256 y reporte pericial judicial.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'ab-bench', badgeLabel: 'SHA-256 CUSTODIA' }
      },
    ],
  },
};

export const EvoTomoDossierModal: React.FC<EvoTomoDossierModalProps> = ({
  tomoId,
  isOpen,
  onClose,
  onOpenTomoView,
  onOpenForensicBench,
}) => {
  // CRITICAL DIRECTIVE: The modal MUST ALWAYS open in 'portada' (cover) view by default
  const [modalView, setModalView] = useState<'portada' | 'indice'>('portada');
  const [isBootLabOpen, setIsBootLabOpen] = useState<boolean>(false);

  // Reset to 'portada' whenever the modal opens or tomoId changes
  useEffect(() => {
    if (isOpen) {
      setModalView('portada');
      setIsBootLabOpen(false);
    }
  }, [isOpen, tomoId]);

  if (!isOpen || !tomoId) return null;

  if (isBootLabOpen && tomoId === 'tomo-08') {
    return (
      <div className="fixed inset-0 z-[120] bg-black animate-in fade-in duration-200">
        <EvoBootLab onClose={() => setIsBootLabOpen(false)} />
      </div>
    );
  }

  const volume = VOLUMES_COLLECTION.find((v) => v.id === tomoId);
  const coverMeta = TOMOS_EDITORIAL_COVERS[tomoId] || TOMOS_EDITORIAL_COVERS['tomo-01'];
  const extended = TOMO_EXTENDED_DATA[tomoId];

  if (!volume) return null;

  const handlePrintOrPdf = () => {
    window.print();
  };

  const handleOpenInteractive = () => {
    if (onOpenTomoView) {
      onOpenTomoView(tomoId);
    } else {
      // Fallback: switch to internal syllabus index
      setModalView('indice');
    }
  };

  /**
   * Navegación bidireccional determinista desde el Tomo al Banco Forense de Laboratorio
   */
  const handleNavigateToLab = (chapterIdOrTarget: string | ForensicBenchTarget) => {
    let target: ForensicBenchTarget;
    if (typeof chapterIdOrTarget === 'string') {
      const id = chapterIdOrTarget.toLowerCase();
      if (id.includes('c02') || id.includes('02') || id.includes('ram')) {
        target = { tomoId: tomoId || 'tomo-01', moduleNumber: 'Cap 02', labView: 'hotswap-lab', scenario: 'ab-bench', station: 'station-ram' };
      } else if (id.includes('c05') || id.includes('05') || id.includes('c01') || id.includes('kernel') || tomoId === 'tomo-02') {
        target = { tomoId: tomoId || 'tomo-02', moduleNumber: 'Cap 01', labView: 'windows-matrix', scenario: 'scheduler-hybrid' };
      } else if (id.includes('c36') || id.includes('36') || id.includes('vrm') || tomoId === 'tomo-03') {
        target = { tomoId: tomoId || 'tomo-03', moduleNumber: 'Cap 36', labView: 'hotswap-lab', scenario: 'vrm-short' };
      } else {
        target = { tomoId: tomoId || 'tomo-01', moduleNumber: 'Cap 01', labView: 'hotswap-lab' };
      }
    } else {
      target = chapterIdOrTarget;
    }

    if (target.labView === 'boot-lab') {
      if (onOpenForensicBench) {
        onOpenForensicBench(target);
        onClose();
      } else {
        setIsBootLabOpen(true);
      }
      return;
    }

    if (onOpenForensicBench) {
      onOpenForensicBench(target);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 lg:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-5xl rounded-2xl border shadow-2xl overflow-hidden font-mono-tech relative flex flex-col max-h-[94vh] transition-all"
        style={{
          background: 'rgba(8, 10, 13, 0.98)',
          backdropFilter: 'blur(24px)',
          borderColor: `${coverMeta.primaryColor}55`,
          boxShadow: `0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 45px ${coverMeta.glowShadow}`,
        }}
      >
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 border-b border-zinc-800/90 bg-[#06080b]/95 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold font-display text-black text-xs shadow-md"
              style={{ background: coverMeta.primaryColor }}
            >
              T{coverMeta.number}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: coverMeta.primaryColor }}
              >
                EVO LABS MAGAZINE // {coverMeta.volumeLabel}
              </span>
              <span className="hidden sm:inline text-zinc-600">//</span>
              <span className="hidden sm:inline px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-900 text-zinc-300 border border-zinc-800">
                {coverMeta.pagesBadge}
              </span>
            </div>
          </div>

          {/* View Mode Switcher + Close */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-zinc-900/90 p-0.5 border border-zinc-800 text-[10px] font-mono-tech">
              <button
                type="button"
                onClick={() => setModalView('portada')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold ${
                  modalView === 'portada'
                    ? 'text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                style={{
                  background: modalView === 'portada' ? coverMeta.primaryColor : 'transparent',
                }}
              >
                PORTADA
              </button>
              <button
                type="button"
                onClick={() => setModalView('indice')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold ${
                  modalView === 'indice'
                    ? 'text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                style={{
                  background: modalView === 'indice' ? coverMeta.primaryColor : 'transparent',
                }}
              >
                ÍNDICE / PLAN
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: PORTADA EDITORIAL GRÁFICA COMPLETA                   */}
        {/* ============================================================ */}
        {modalView === 'portada' && (
          <div className="p-5 sm:p-7 lg:p-8 overflow-y-auto space-y-7 text-xs text-zinc-300">
            {/* Editorial Meta Sub-Header */}
            <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400 pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full inline-block animate-pulse"
                  style={{ background: coverMeta.primaryColor }}
                />
                <span className="tracking-widest uppercase font-bold text-white text-[11px]">
                  {coverMeta.volumeLabel} // {coverMeta.editionLabel}
                </span>
              </div>
              <span className="tracking-widest uppercase text-zinc-400 hidden sm:inline text-[10px]">
                ESTÁNDAR: {coverMeta.systemStandard}
              </span>
            </div>

            {/* Grid 2 Columnas de Portada Editorial (Estilo MagazineCover) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* Left Column: Título, Bajada y Temas Clave */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div
                    className="inline-block text-[10px] font-mono-tech tracking-widest uppercase px-2 py-0.5 rounded border"
                    style={{
                      color: coverMeta.primaryColor,
                      borderColor: `${coverMeta.primaryColor}40`,
                      background: `${coverMeta.primaryColor}12`,
                    }}
                  >
                    {coverMeta.tagline}
                  </div>

                  <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[0.96] uppercase">
                    {coverMeta.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-xl">
                    {coverMeta.editorialSubtitle}
                  </p>
                </div>

                {/* Bloque: EN ESTA EDICIÓN (3 Temas Clave Específicos) */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-tech tracking-widest text-zinc-400 uppercase font-semibold block">
                      EN ESTA EDICIÓN // 3 INVESTIGACIONES MAESTRAS
                    </span>
                    <span
                      className="text-[10px] font-mono-tech font-bold"
                      style={{ color: coverMeta.primaryColor }}
                    >
                      {coverMeta.pagesBadge}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {coverMeta.keyTopics.map((topic) => (
                      <article
                        key={topic.num}
                        className="p-2.5 rounded-xl bg-black/40 border border-zinc-800/70 hover:border-zinc-700 transition-all"
                      >
                        <div className="flex items-baseline gap-2.5">
                          <span
                            className="font-mono-tech text-xs font-bold shrink-0"
                            style={{ color: coverMeta.primaryColor }}
                          >
                            {topic.num}.
                          </span>
                          <h3 className="font-display font-bold text-xs sm:text-sm text-white">
                            {topic.title}
                          </h3>
                        </div>
                        <p className="mt-0.5 pl-5 text-[11px] text-zinc-400 font-sans-editorial leading-relaxed">
                          {topic.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Botones de Acción de Portada */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {tomoId === 'tomo-08' ? (
                    <>
                      <button
                        type="button"
                        onClick={handleOpenInteractive}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech font-black text-xs tracking-wider uppercase text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <BookOpen className="w-4 h-4 text-black" />
                        <span>ABRIR REVISTA TOMO 08</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsBootLabOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 shadow-lg transition-all cursor-pointer"
                      >
                        <Power className="w-4 h-4 text-emerald-400" />
                        <span>LABORATORIO DE ARRANQUE</span>
                      </button>
                    </>
                  ) : ['tomo-07', 'tomo-09', 'tomo-10'].includes(tomoId) ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase border border-amber-400/40 bg-amber-400/10 text-amber-300 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>EDICIÓN EN DESARROLLO</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenInteractive}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase text-black transition-all duration-200 cursor-pointer shadow-xl hover:brightness-110"
                      style={{
                        background: coverMeta.primaryColor,
                        boxShadow: `0 8px 24px -6px ${coverMeta.primaryColor}40`,
                      }}
                    >
                      <span>ABRIR EDICIÓN INTERACTIVA</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handlePrintOrPdf}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 transition-all duration-200 cursor-pointer shadow-lg"
                  >
                    <Printer className="w-4 h-4" style={{ color: coverMeta.primaryColor }} />
                    <span>REVISTA EDITORIAL A4 (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalView('indice')}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-transparent text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>VER ÍNDICE DE CAPÍTULOS →</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Gráfica Técnica Central y Telemetría del Tomo */}
              <div className="lg:col-span-5 flex flex-col">
                <div
                  className="w-full h-full min-h-[300px] rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl"
                  style={{
                    borderColor: `${coverMeta.primaryColor}40`,
                    background: coverMeta.heroGraphic.bgPattern,
                  }}
                >
                  {/* Decorative circuit lines */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Graphic Header */}
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-bold font-mono-tech uppercase border"
                        style={{
                          color: coverMeta.primaryColor,
                          borderColor: `${coverMeta.primaryColor}50`,
                          background: `${coverMeta.primaryColor}18`,
                        }}
                      >
                        {coverMeta.heroGraphic.badge}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-mono-tech">
                        REV. 2026 // EVO LABS
                      </span>
                    </div>

                    <div className="pt-2">
                      <div className="text-[10px] text-zinc-400 font-mono-tech uppercase">
                        SISTEMA EN MEDICIÓN:
                      </div>
                      <div className="text-white font-mono-tech font-bold text-sm">
                        {coverMeta.heroGraphic.chipName}
                      </div>
                    </div>
                  </div>

                  {/* Graphic Center Micro-Schematic Badge */}
                  <div className="relative z-10 py-5 my-auto">
                    <div className="p-4 rounded-xl bg-[#06080b]/90 border border-white/10 shadow-inner space-y-2.5 backdrop-blur-md">
                      <div className="flex items-center justify-between text-[11px] font-mono-tech">
                        <span className="text-zinc-400">BENCHMARK / ESPEC:</span>
                        <span
                          className="font-bold font-mono-tech"
                          style={{ color: coverMeta.primaryColor }}
                        >
                          {coverMeta.heroGraphic.frequencyOrSpec}
                        </span>
                      </div>

                      {/* Diagnostic status bar */}
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full animate-pulse"
                          style={{
                            width: '88%',
                            background: coverMeta.primaryColor,
                          }}
                        />
                      </div>

                      <div className="text-[10px] text-emerald-400 font-mono-tech flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{coverMeta.heroGraphic.statusLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Graphic Features List */}
                  <div className="relative z-10 pt-3 border-t border-white/10 space-y-1.5 text-[10px] font-mono-tech text-zinc-300">
                    <div className="text-[9px] text-zinc-400 uppercase tracking-wider">
                      VECTORES ANALÍTICOS:
                    </div>
                    {coverMeta.heroGraphic.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: coverMeta.primaryColor }}
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-mono-tech text-zinc-500 text-right uppercase">
                  Diagrama Metrológico // Vectorial 2026
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: ÍNDICE MODULAR Y PLAN DE ESTUDIO COMPLETO           */}
        {/* ============================================================ */}
        {modalView === 'indice' && (
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-zinc-300">
            {/* Summary Banner */}
            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans-editorial">
              <div className="space-y-1">
                <span className="font-mono-tech font-bold text-white text-xs uppercase block">
                  {volume.tagline}
                </span>
                <p className="text-zinc-300 text-xs leading-relaxed max-w-2xl">
                  {volume.description}
                </p>
                {extended?.targetAudience && (
                  <div className="text-[11px] text-zinc-400 pt-1">
                    <strong>Público Objetivo:</strong> {extended.targetAudience}
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrintOrPdf}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono-tech text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Imprimir o Guardar como PDF"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>DESCARGAR PDF (A4)</span>
                </button>
              </div>
            </div>

            {/* Module Index */}
            {extended?.modules && extended.modules.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-mono-tech font-bold text-white uppercase text-xs flex items-center gap-2">
                    <Layers className="w-4 h-4" style={{ color: coverMeta.primaryColor }} />
                    PLAN DE ESTUDIO TÉCNICO // {extended.modulesCount}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono-tech">
                    100% AUDITADO EVO LABS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {extended.modules.map((mod) => (
                    <div
                      key={mod.number}
                      className="p-3.5 rounded-xl bg-[#080a0d] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between gap-2.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono-tech shrink-0 mt-0.5"
                          style={{
                            backgroundColor: `${coverMeta.primaryColor}20`,
                            color: coverMeta.primaryColor,
                            border: `1px solid ${coverMeta.primaryColor}40`,
                          }}
                        >
                          {mod.number}
                        </span>
                        <div className="space-y-0.5">
                          <div className="font-bold text-white text-xs font-mono-tech">
                            {mod.title}
                          </div>
                          <p className="text-[11px] text-zinc-400 font-sans-editorial leading-relaxed">
                            {mod.desc}
                          </p>
                        </div>
                      </div>

                      {/* Botón de Acción Directa al Laboratorio / Banco Forense */}
                      {mod.benchConfig && (
                        <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between gap-2 mt-auto">
                          <span className="text-[9px] text-zinc-500 font-mono-tech uppercase truncate max-w-[140px]">
                            {mod.benchConfig.badgeLabel || 'BANCO DE PRUEBAS'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (mod.benchConfig) {
                                handleNavigateToLab({
                                   tomoId,
                                   moduleNumber: mod.number,
                                   labView: mod.benchConfig.labView,
                                   scenario: mod.benchConfig.scenario,
                                   station: mod.benchConfig.station,
                                });
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400/20 via-cyan-400/20 to-amber-400/20 hover:from-amber-400 hover:to-cyan-400 text-amber-300 hover:text-black border border-amber-400/50 hover:border-cyan-400 text-[10px] font-mono-tech font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] group shrink-0"
                            title={`Probar ${mod.title} directamente en el banco de pruebas`}
                          >
                            <Zap className="w-3 h-3 text-amber-400 group-hover:text-black transition-colors" />
                            <span>⚡ PROBAR EN BANCO FORENSE</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-zinc-800/80 bg-[#080a0d] flex flex-col items-center justify-center text-center space-y-4 my-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg"
                  style={{
                    backgroundColor: `${coverMeta.primaryColor}15`,
                    borderColor: `${coverMeta.primaryColor}40`,
                    color: coverMeta.primaryColor,
                  }}
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 max-w-lg">
                  <div className="font-bold text-white text-sm font-mono-tech uppercase tracking-wider">
                    {coverMeta.volumeLabel} — EN DESARROLLO
                  </div>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                    {coverMeta.editorialSubtitle}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-[11px] font-mono-tech">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>En fase activa de investigación técnica y preparación de laboratorios</span>
                </div>

                {tomoId === 'tomo-08' && (
                  <button
                    type="button"
                    onClick={() => setIsBootLabOpen(true)}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech font-black text-xs tracking-wider uppercase text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
                  >
                    <Power className="w-4 h-4 text-black" />
                    <span>INICIAR LABORATORIO DE ARRANQUE EVO</span>
                  </button>
                )}
              </div>
            )}

            {/* Laboratory Integration Note */}
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-[11px] font-sans-editorial flex items-start gap-2.5 text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200">Integración con el Laboratorio Vivo:</strong> Las lecciones de este
                tomo se acoplan directamente a las terminales interactivas y banco Hot-Swap de EVO LABS. Cada ejercicio
                se valida mediante pruebas deterministas en tu propio entorno o máquinas de prueba.
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-[#06080b]/95 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: coverMeta.primaryColor }}
            />
            <span className="text-[11px] text-zinc-400 font-mono-tech">
              EVO LABS PUBLICACIONES // REV. 2026 // ESTÁNDAR {coverMeta.systemStandard}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {modalView === 'portada' ? (
              <button
                type="button"
                onClick={() => setModalView('indice')}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono-tech text-xs font-bold transition-all cursor-pointer"
              >
                VER ÍNDICE COMPLETO
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setModalView('portada')}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono-tech text-xs font-bold transition-all cursor-pointer"
              >
                ← VOLVER A PORTADA
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer"
            >
              CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
