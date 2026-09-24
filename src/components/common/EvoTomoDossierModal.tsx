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
} from 'lucide-react';
import { VOLUMES_COLLECTION } from '../../data/collections';

export interface ForensicBenchTarget {
  tomoId: string;
  moduleNumber: string;
  labView: 'hotswap-lab' | 'windows-matrix' | 'motherboard-canvas' | 'incident-central';
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
    tagline: 'ARQUITECTURA DE COMPUTADORAS // TOPOLOGÍA FÍSICA',
    title: 'TU PC NO ES LO QUE DICEN LOS FPS',
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
    tagline: 'INGENIERÍA DE SISTEMAS KERNEL // MICROSOFT SYSINTERNALS',
    title: 'EL KERNEL AL DESNUDO: RING 0, DPC Y SOBERANÍA DEL SISTEMA',
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
    tagline: 'SERVICIO TÉCNICO DE ESCRITORIO // METROLOGÍA DE BANCO',
    title: 'DIAGNÓSTICO EN BANCO: LA CADENA FÍSICA DE FALLAS',
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
    tagline: 'REPARACIÓN DE NOTEBOOKS // MICROELECTRÓNICA APLICADA',
    title: 'CIRUGÍA DE SILICIO: RIELES DE PODER Y MICROSOLDADURA',
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
    editionLabel: 'EDICIÓN INFRAESTRUCTURA 2026 // REDES Y KERNEL',
    primaryColor: '#06b6d4',
    accentGradient: 'from-cyan-500/20 via-purple-600/10 to-transparent',
    glowShadow: 'rgba(6, 182, 212, 0.28)',
    tagline: 'REDES AVANZADAS, LINUX SYSADMIN & VIRTUALIZACIÓN TIPO 1',
    title: 'INFRAESTRUCTURA INVISIBLE: TRÁFICO CRUDO Y KERNEL LINUX',
    editorialSubtitle:
      'Topología TCP/IP pericial, disección de paquetes Wireshark a nivel de bit, gobernanza del kernel monolítico Linux, almacenamiento resiliente ZFS y clústeres hipervisores KVM/Proxmox.',
    pagesBadge: '210 PÁGINAS A4 // 12 MÓDULOS',
    systemStandard: 'RFC PROTOCOL COMPLIANCE & LINUX KERNEL SUBSYSTEM',
    keyTopics: [
      {
        num: '01',
        title: 'Inspección de paquetes a bajo nivel',
        description: 'Análisis de ventanas TCP, retraso de ida y vuelta (RTT), handshakes TLS 1.3 y retransmisiones anómalas.',
      },
      {
        num: '02',
        title: 'Virtualización tipo 1 con passthrough PCIe',
        description: 'IOMMU groups, VFIO driver bonding y aislamiento de tarjetas gráficas dedicadas sin penalización de CPU.',
      },
      {
        num: '03',
        title: 'Optimización del stack TCP/IP',
        description: 'BBR Congestion Control, MTU/Jumbo Frames, mitigación SYN Flood con cookies de kernel y colas eBPF.',
      },
    ],
    heroGraphic: {
      badge: 'TOPOLOGÍA OSI // KERNEL SYSFS & NFTABLES',
      chipName: 'PROXMOX VE HYPERVISOR & CEPH CLUSTER',
      frequencyOrSpec: '10GbE SFP+ Direct Attach // WireGuard Curve25519',
      statusLabel: 'RED DE BAJA LATENCIA & VIRTUALIZACIÓN AISLADA',
      features: ['Wireshark Deep Packet Engine', 'ZFS Atomic Snapshots RAID-Z', 'Docker OCI Namespaces Hardened'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(6,182,212,0.18) 0%, rgba(8,10,13,0.95) 75%)',
    },
  },

  'tomo-06': {
    tomoKey: 'tomo-06',
    number: '06',
    volumeLabel: 'TOMO 06',
    editionLabel: 'EDICIÓN CIBERSEGURIDAD 2026 // ANÁLISIS FORENSE',
    primaryColor: '#ef4444',
    accentGradient: 'from-rose-600/25 via-red-600/10 to-transparent',
    glowShadow: 'rgba(239, 68, 68, 0.28)',
    tagline: 'ANÁLISIS DE MALWARE // INGENIERÍA INVERSA // ZERO-TRUST',
    title: 'EL ARTE DE LA INFILTRACIÓN: INGENIERÍA INVERSA Y RING -1',
    editorialSubtitle:
      'La ciencia de la seguridad ofensiva y defensiva profunda: desensamblado estático con Ghidra, análisis de comportamiento dinámico en sandboxes selladas, detección de rootkits y auditoría de memoria volátil.',
    pagesBadge: '220 PÁGINAS A4 // 12 MÓDULOS',
    systemStandard: 'MITRE ATT&CK FRAMEWORK & VOLATILITY MEMORY FORENSICS',
    keyTopics: [
      {
        num: '01',
        title: 'Volcados forenses de memoria volátil',
        description: 'Extracción de estructuras VAD, inyección DLL reflectiva y reconstrucción de procesos ocultos con Volatility 3.',
      },
      {
        num: '02',
        title: 'Desensamblado x86/x64',
        description: 'Lectura de descompilador Ghidra, control flow graphs, evasión de llamadas de sistema (direct Syscalls) y firmas YARA.',
      },
      {
        num: '03',
        title: 'Análisis de artefactos y exploits',
        description: 'Deconstrucción de rootkits de kernel (DKOM), evasión de EDR de última generación y persistencia mediante sombras VSS.',
      },
    ],
    heroGraphic: {
      badge: 'INGENIERÍA INVERSA // PE DISASSEMBLER',
      chipName: 'GHIDRA SRE // RING -1 HYPERVISOR PROBE',
      frequencyOrSpec: 'SHA-256 Verified // Zero-Trust Sandbox Isolation',
      statusLabel: 'FORENSE DE MEMORIA VOLÁTIL & ANÁLISIS DE KERNEL',
      features: ['Volatility 3 Profile Engine', 'Kernel Callback Audit (DKOM)', 'MITRE ATT&CK Matrix Triage'],
      bgPattern: 'radial-gradient(ellipse at center, rgba(239,68,68,0.18) 0%, rgba(8,10,13,0.95) 75%)',
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
        labView: 'hotswap-lab' | 'windows-matrix' | 'motherboard-canvas' | 'incident-central';
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
    pages: '210 páginas A4',
    modulesCount: '12 módulos técnicos de infraestructura',
    targetAudience: 'Administradores de sistemas, ingenieros de redes y entusiastas de Linux',
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
        title: 'Arquitectura del Kernel Linux',
        desc: 'Estructura monolithic modular, sysfs, procfs, systemd e inicialización de servicios.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'LINUX KERNEL SYSFS' }
      },
      {
        number: 'M05',
        title: 'Administración de Almacenamiento ZFS & Btrfs',
        desc: 'Pools RAID-Z, snapshots atómicos, compresión ZSTD y reparación por paridad.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'ab-bench', badgeLabel: 'ZFS ATOMIC' }
      },
      {
        number: 'M06',
        title: 'Servicios de Red Esenciales en Debian/Ubuntu',
        desc: 'Configuración endurecida de NGINX, Bind9, DHCP, SSH con claves ED25519.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'HARDENED SERVICES' }
      },
      {
        number: 'M07',
        title: 'Firewalls e IPTables / NFTables',
        desc: 'Reglas de filtrado de paquetes, NAT, Stateful Inspection y prevención de DoS.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'NFTABLES RULESET' }
      },
      {
        number: 'M08',
        title: 'Fundamentos de Hipervisores Tipo 1 vs Tipo 2',
        desc: 'Virtualización KVM/QEMU por hardware (Intel VT-x / AMD-V) y passthrough de PCI.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'KVM VFIO PASSTHROUGH' }
      },
      {
        number: 'M09',
        title: 'Despliegue de Clúster Proxmox VE',
        desc: 'Alta disponibilidad (HA), almacenamiento compartido Ceph y migración en caliente.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'PROXMOX CLUSTER' }
      },
      {
        number: 'M10',
        title: 'Contenedores Docker & Arquitectura OCI',
        desc: 'Cgroups v2, namespaces, Dockerfile hardening y redes internas bridge/macvlan.',
        benchConfig: { labView: 'windows-matrix', scenario: 'win10-ltsc', badgeLabel: 'DOCKER CGROUPS' }
      },
      {
        number: 'M11',
        title: 'VPNs Modernas: WireGuard vs OpenVPN',
        desc: 'Criptografía Curve25519, túneles punto a punto y topologías hub-and-spoke.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'WIREGUARD P2P' }
      },
      {
        number: 'M12',
        title: 'Monitorización y Métricas con Prometheus & Grafana',
        desc: 'Exporters de nodo, dashboards de telemetría de red y alertas automatizadas.',
        benchConfig: { labView: 'windows-matrix', scenario: 'timer-resolution', badgeLabel: 'PROMETHEUS METRICS' }
      },
    ],
  },
  'tomo-06': {
    pages: '220 páginas A4',
    modulesCount: '12 módulos forenses de ciberseguridad',
    targetAudience: 'Analistas SOC, investigadores de malware, pentesters y auditores de seguridad',
    modules: [
      {
        number: 'M01',
        title: 'Metodología del Ataque y Defensa (MITRE ATT&CK)',
        desc: 'Matriz táctica: desde el acceso inicial hasta la exfiltración e impacto.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'MITRE ATT&CK' }
      },
      {
        number: 'M02',
        title: 'Reconocimiento Pasivo y Activo (OSINT & Scanning)',
        desc: 'Nmap avanzado, NSE scripts, banners, enumeración de servicios y shodan.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'NMAP RAW SCAN' }
      },
      {
        number: 'M03',
        title: 'Análisis Estático de Binarios con Ghidra',
        desc: 'Desensamblado x86/x64, PE headers, tablas de importación (IAT) y firmas YARA.',
        benchConfig: { labView: 'windows-matrix', scenario: 'boot-sequence', badgeLabel: 'GHIDRA SRE' }
      },
      {
        number: 'M04',
        title: 'Análisis Dinámico en Sandbox Aislada',
        desc: 'Monitoreo con Procmon, Regshot, Wireshark y emulación de red con INetSim.',
        benchConfig: { labView: 'windows-matrix', scenario: 'telemetry-diagtrack', badgeLabel: 'SANDBOX ISOLATION' }
      },
      {
        number: 'M05',
        title: 'Técnicas de Evasión y Desofuscación',
        desc: 'Detección de hypervisor/sandbox, timing attacks, packers UPX y strings cifradas con XOR.',
        benchConfig: { labView: 'windows-matrix', scenario: 'timer-resolution', badgeLabel: 'TIMING ATTACKS' }
      },
      {
        number: 'M06',
        title: 'Morfología de Ransomware & Persistencia',
        desc: 'Criptografía asimétrica/simétrica híbrida, sombras de volumen (VSS) y Run keys.',
        benchConfig: { labView: 'windows-matrix', scenario: 'win10-ltsc', badgeLabel: 'VSS SHADOW AUDIT' }
      },
      {
        number: 'M07',
        title: 'Análisis Forense de Memoria con Volatility 3',
        desc: 'Extracción de dumps RAM, pslist, malfind, inyección DLL y dump de procesos.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'VOLATILITY 3 DUMP' }
      },
      {
        number: 'M08',
        title: 'Rootkits de Kernel (Ring 0) & EDR Bypass',
        desc: 'DKOM (Direct Kernel Object Manipulation), hook de IRPs y anulación de callbacks.',
        benchConfig: { labView: 'windows-matrix', scenario: 'dpc-conflict', badgeLabel: 'RING 0 DKOM' }
      },
      {
        number: 'M09',
        title: 'Explotación Web (OWASP Top 10)',
        desc: 'SQLi, XSS, SSRF, IDOR y rotura de autenticación mediante proxies Burp Suite.',
        benchConfig: { labView: 'windows-matrix', scenario: 'telemetry-diagtrack', badgeLabel: 'BURP SUITE PROXY' }
      },
      {
        number: 'M10',
        title: 'Seguridad en Directorio Activo (AD Attacks)',
        desc: 'Kerberoasting, AS-REP Roasting, Pass-the-Hash y escalada de privilegios.',
        benchConfig: { labView: 'windows-matrix', scenario: 'scheduler-hybrid', badgeLabel: 'KERBEROASTING' }
      },
      {
        number: 'M11',
        title: 'Respuesta ante Incidentes & Cadena de Custodia',
        desc: 'Adquisición forense de discos (dd/E01), hashing SHA-256 y reporte pericial judicial.',
        benchConfig: { labView: 'hotswap-lab', scenario: 'ab-bench', badgeLabel: 'SHA-256 CUSTODIA' }
      },
      {
        number: 'M12',
        title: 'Hardening Defensivo y Arquitectura Zero-Trust',
        desc: 'Políticas AppLocker, ASR rules, LAPS, Sysmon calibrado y segmentación de privilegios.',
        benchConfig: { labView: 'windows-matrix', scenario: 'win10-ltsc', badgeLabel: 'ZERO-TRUST KERNEL' }
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

  // Reset to 'portada' whenever the modal opens or tomoId changes
  useEffect(() => {
    if (isOpen) {
      setModalView('portada');
    }
  }, [isOpen, tomoId]);

  if (!isOpen || !tomoId) return null;

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
            {extended?.modules && (
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
