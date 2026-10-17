import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Cpu,
  Layers,
  Zap,
  Activity,
  Flame,
  Radio,
  Gauge,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Monitor,
  Volume2,
  ShieldAlert,
  Thermometer,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  CornerDownRight,
  BarChart2,
  Info,
  Terminal,
} from 'lucide-react';
import { UserHardwarePassport } from '../../types';

// ============================================================================
// HARDWARE TOPOLOGY COMPONENT IDENTIFIERS
// ============================================================================
export type MotherboardComponentId =
  | 'cpu'
  | 'ram'
  | 'vrm'
  | 'pch'
  | 'pcie'
  | 'm2'
  | 'io';

export interface ComponentTechnicalDossier {
  id: MotherboardComponentId;
  name: string;
  subsystem: string;
  busType: string;
  academicDescription: string;
  latencyImpact: string;
  metrics: {
    temperature: {
      value: number | string;
      unit: string;
      status: 'nominal' | 'warning' | 'critical';
      label: string;
      details: string;
    };
    voltage: {
      value: number | string;
      unit: string;
      label: string;
      details: string;
      droopDeltaMv: number;
    };
    bandwidth: {
      value: number | string;
      unit: string;
      label: string;
      busWidth: string;
      saturationPct: number;
    };
    latency: {
      value: number | string;
      unit: string;
      label: string;
      dpcSpikeRisk: 'optimal' | 'moderate' | 'spike';
      queueDelay: string;
    };
  };
  evoDiagnosis: {
    bottleneckRisk: string;
    dpcIsrImpact: string;
    forensicRemediation: string;
  };
  provenance: 'ESTIMATED' | 'ESTIMATED';
}

// ============================================================================
// MANDATORY TECHNICAL DATA DICTIONARY (RIGOROUS SILICON ARCHITECTURE)
// ============================================================================
export const MOTHERBOARD_DATA_DICTIONARY: Record<MotherboardComponentId, ComponentTechnicalDossier> = {
  cpu: {
    id: 'cpu',
    name: 'CPU (Socket & Ring Bus)',
    subsystem: 'Microarquitectura Central & Interconexión de Silicio',
    busType: 'Ring Bus / Mesh Interconnect (Direct L3 Cache)',
    academicDescription:
      'El microprocesador central y su arquitectura de interconexión interna (Ring Bus o Mesh). Gestiona el dispatch de llamadas de dibujado (Draw Calls) hacia la GPU y procesa la lógica del motor físico.',
    latencyImpact:
      'Las fluctuaciones en los estados de energía (C-States) y las transiciones de frecuencia del Ring Bus introducen micro-latencias perjudiciales en el frametime del 1% Low. Un Ring Bus sincronizado reduce el retraso de intercomunicación entre los núcleos y la memoria caché L3.',
    metrics: {
      temperature: {
        value: 68,
        unit: '°C',
        status: 'nominal',
        label: 'Temperatura del Die (Tj)',
        details: 'TjMax: 100°C // Margen térmico: 32°C',
      },
      voltage: {
        value: '1.245',
        unit: 'V',
        label: 'Voltaje de Núcleo (VCore)',
        details: 'Curva V/F adaptativa // LLC Nivel 6',
        droopDeltaMv: 14,
      },
      bandwidth: {
        value: '418.6',
        unit: 'GB/s',
        label: 'Ancho de Banda Ring Bus L3',
        busWidth: 'Ring bidireccional de 32 bytes/ciclo',
        saturationPct: 62,
      },
      latency: {
        value: '0.85',
        unit: 'ns',
        label: 'Latencia L1/L2 a Ring Interconnect',
        dpcSpikeRisk: 'optimal',
        queueDelay: '< 0.05 ms en cola de despacho',
      },
    },
    evoDiagnosis: {
      bottleneckRisk: 'Contención en desbalance P-Core vs E-Core bajo Windows Thread Director.',
      dpcIsrImpact: 'Bajo en stock. Las transiciones de reloj abruptas elevan el jitter de frametimes.',
      forensicRemediation:
        'Sincronizar el multiplicador Ring/Uncore al reloj sostenido y fijar estados de energía C-States para eliminar el retraso de reactivación de núcleos.',
    },
    provenance: 'ESTIMATED',
  },
  ram: {
    id: 'ram',
    name: 'Memoria RAM (Sub-sistema DDR & IMC)',
    subsystem: 'Controlador de Memoria Integrado (IMC) & Bus Dual-Channel',
    busType: 'DDR5 128-bit Bus (2x 64-bit Sub-canales por DIMM)',
    academicDescription:
      'Enlace de memoria principal gestionado por el Controlador de Memoria Integrado (IMC) del CPU. Define la velocidad de transferencia y los tiempos de acceso a las instrucciones precargadas.',
    latencyImpact:
      'La discrepancia entre la velocidad nominal (SPD) y la velocidad efectiva impuesta por el IMC genera latencia de acceso (medida en nanosegundos). Operar en Gear 1 (1:1) en configuraciones de alta frecuencia es crítico para minimizar la latencia de ida y vuelta en motores gráficos competitivos.',
    metrics: {
      temperature: {
        value: 48,
        unit: '°C',
        status: 'nominal',
        label: 'Temperatura Módulos DIMM',
        details: 'PMIC Térmicamente controlado // Sensor SPD',
      },
      voltage: {
        value: '1.350',
        unit: 'V',
        label: 'Voltaje DRAM (VDD / VDDQ)',
        details: 'Perfil XMP / EXPO estable // VCCSA: 1.150V',
        droopDeltaMv: 6,
      },
      bandwidth: {
        value: '89.6',
        unit: 'GB/s',
        label: 'Ancho de Banda Efectivo Teórico',
        busWidth: 'Dual-Channel (128 bits total @ 5600 MT/s)',
        saturationPct: 78,
      },
      latency: {
        value: '62.4',
        unit: 'ns',
        label: 'Latencia Round-Trip (AIDA64 / MLC)',
        dpcSpikeRisk: 'optimal',
        queueDelay: 'Gear 2: Frecuencia de controlador 1:2',
      },
    },
    evoDiagnosis: {
      bottleneckRisk: 'Latencia secundaria por descalibración de sub-timings (tRFC, tREFI, tFAW).',
      dpcIsrImpact: 'La saturación de cola en el IMC retrasa el DMA de buffers gráficos compartidos.',
      forensicRemediation:
        'Verificar que los módulos estén situados en los slots A2/B2 (2 y 4) para maximizar la integridad de señal y activar Gear 1 o ajustar tREFI para reducir el ciclo de refresco.',
    },
    provenance: 'ESTIMATED',
  },
  vrm: {
    id: 'vrm',
    name: 'VRM (Módulo de Regulación de Voltaje)',
    subsystem: 'Etapas de Potencia Multifase (Smart Power Stages) & PWM Digital',
    busType: 'Línea de Entrada EPS 12V → Conversión Buck Multifase',
    academicDescription:
      'Red de fases de poder compuesta por MOSFETs, choques y capacitores. Transforma los 12V de la fuente de alimentación a los voltajes operativos precisos (VCore, VCCSA, VCCIO) requeridos por el CPU.',
    latencyImpact:
      'El Thermal Throttling de las fases de poder o un Vdroop agresivo bajo cargas transitorias obligan al procesador a reducir su frecuencia de reloj dinámicamente, provocando stutters (tirones) inmediatos e impredecibles durante el renderizado.',
    metrics: {
      temperature: {
        value: 64,
        unit: '°C',
        status: 'nominal',
        label: 'Temperatura Disipador VRM',
        details: 'Límite de estrangulamiento: 105°C // Mosfets a 71°C',
      },
      voltage: {
        value: '12.08 → 1.220',
        unit: 'V',
        label: 'Conversión EPS 12V a VCore',
        details: 'PWM Digital a 600 kHz // 16+2+1 Fases de 90A',
        droopDeltaMv: 28,
      },
      bandwidth: {
        value: '240.0',
        unit: 'A',
        label: 'Capacidad de Corriente Transitoria',
        busWidth: '16 Fases paralelas directas sin duplicadores',
        saturationPct: 45,
      },
      latency: {
        value: '< 15.0',
        unit: 'µs',
        label: 'Tiempo de Respuesta Transitoria (LLC)',
        dpcSpikeRisk: 'optimal',
        queueDelay: 'Calibración de línea de carga (Load-Line) nivel 6',
      },
    },
    evoDiagnosis: {
      bottleneckRisk: 'Vdroop transitorio severo en cargas AVX2/AVX-512 que provoca inestabilidad de reloj.',
      dpcIsrImpact: 'Las caídas de voltaje forzan al reloj interno a variar frecuencias, generando jitter.',
      forensicRemediation:
        'Ajustar la calibración de línea de carga (Load-Line Calibration) a un nivel intermedio para compensar caídas de tensión sin generar overshoot peligroso.',
    },
    provenance: 'ESTIMATED',
  },
  pch: {
    id: 'pch',
    name: 'PCH (Platform Controller Hub / Chipset)',
    subsystem: 'Distribuidor Secundario I/O & Enlace DMI 4.0 x8',
    busType: 'Direct Media Interface (DMI 4.0 x8 = 15.75 GB/s)',
    academicDescription:
      'El nodo distribuidor secundario que gestiona las interfaces de entrada/salida de menor ancho de banda (SATA, USB, Audio, Red). Se comunica con el CPU a través del enlace DMI (Direct Media Interface).',
    latencyImpact:
      'Es el origen principal de los picos de latencia DPC y rutinas de servicio de interrupción (ISR). Un polling rate alto en periféricos USB o controladores de red ineficientes (ej. ndis.sys) saturan el PCH, retrasando la capacidad del núcleo de Windows para ejecutar hilos de renderizado en tiempo real.',
    metrics: {
      temperature: {
        value: 54,
        unit: '°C',
        status: 'nominal',
        label: 'Temperatura Chipset PCH',
        details: 'Disipador pasivo de aluminio // TDP: 6.0W',
      },
      voltage: {
        value: '1.050',
        unit: 'V',
        label: 'Voltaje Lógico VCC_PCH',
        details: 'Línea de alimentación de bus PCIe auxiliar',
        droopDeltaMv: 4,
      },
      bandwidth: {
        value: '15.75',
        unit: 'GB/s',
        label: 'Ancho de Banda Enlace DMI 4.0 x8',
        busWidth: '8 Carriles DMI full duplex directo al CPU',
        saturationPct: 58,
      },
      latency: {
        value: '0.32',
        unit: 'ms',
        label: 'Pico de Ejecución DPC / Rutinas ISR',
        dpcSpikeRisk: 'moderate',
        queueDelay: 'Pico medido en controlador dxgkrnl.sys / ndis.sys',
      },
    },
    evoDiagnosis: {
      bottleneckRisk: 'Saturación del bus DMI cuando múltiples SSDs NVMe secundarios y red transfieren simultáneamente.',
      dpcIsrImpact: 'ALTO. Controladores USB defectuosos o tarjetas WiFi PCIe generan tormentas de interrupciones (ISR).',
      forensicRemediation:
        'Conectar periféricos críticos de entrada (mouse/teclado de 8000Hz) en puertos USB conectados a líneas directas de CPU y aislar controladores de red con MSI (Message Signaled Interrupts).',
    },
    provenance: 'ESTIMATED',
  },
  pcie: {
    id: 'pcie',
    name: 'Bus PCIe (Líneas Directas)',
    subsystem: 'Carriles Directos de Silicio PEG (PCIe Graphics Dedicated Lanes)',
    busType: 'PCIe 5.0 / 4.0 x16 Conexión Física Nativa al Socket',
    academicDescription:
      'Protocolo de interconexión de componentes periféricos de alta velocidad. Proporciona carriles dedicados (Lanes) directos al CPU, eludiendo el PCH para hardware de misión crítica.',
    latencyImpact:
      'La saturación del ancho de banda PCIe (ej. forzar una GPU x16 en un slot físico cableado a x4) estrangula la transferencia de texturas a la VRAM, incrementando severamente el retraso en la presentación de cuadros (PresentMon).',
    metrics: {
      temperature: {
        value: 51,
        unit: '°C',
        status: 'nominal',
        label: 'Temperatura Slot & Controladora ReBAR',
        details: 'SafeSlot Reforzado de Acero // Resizable BAR Activo',
      },
      voltage: {
        value: '3.300',
        unit: 'V',
        label: 'Voltaje de Señalización PCIe',
        details: 'Línea de 12V auxiliar + 3.3V lógica de bus',
        droopDeltaMv: 8,
      },
      bandwidth: {
        value: '63.0',
        unit: 'GB/s',
        label: 'Ancho de Banda PCIe 5.0 x16 (Bidi)',
        busWidth: '16 Carriles físicos directos sin pasar por PCH',
        saturationPct: 34,
      },
      latency: {
        value: '< 120.0',
        unit: 'ns',
        label: 'Transacción Directa BAR0 (ReBAR)',
        dpcSpikeRisk: 'optimal',
        queueDelay: 'Acceso total de CPU a la totalidad de la VRAM',
      },
    },
    evoDiagnosis: {
      bottleneckRisk: 'Bifurcación involuntaria (x16 degradado a x8 o x4) si se comparte con slots M.2 ultra-rápidos.',
      dpcIsrImpact: 'Moderado. Tasa de transferencia insuficiente infla el tiempo de despacho en dxgkrnl.sys.',
      forensicRemediation:
        'Asegurar en UEFI que el slot principal opere en modo x16 nativo y habilitar "Above 4G Decoding" junto con "Resizable BAR" para acceso directo a toda la memoria de video.',
    },
    provenance: 'ESTIMATED',
  },
  m2: {
    id: 'm2',
    name: 'Slot M.2 NVMe (Líneas Directas de CPU)',
    subsystem: 'Almacenamiento Primario NVMe de Ultra-Baja Latencia',
    busType: 'PCIe 4.0 / 5.0 x4 Dedicado de Silicio',
    academicDescription:
      'Puerto de almacenamiento ultrarrápido conectado a 4 carriles PCIe dedicados que van directamente al microprocesador sin intermediarios.',
    latencyImpact:
      'El thermal throttling en controladores NVMe o la contención de ancho de banda durante la carga de shaders en segundo plano incrementa la micro-latencia de streaming de texturas, causando tartamudeo (stutter) en títulos de mundo abierto.',
    metrics: {
      temperature: {
        value: 42,
        unit: '°C',
        status: 'nominal',
        label: 'Temperatura Controlador SSD',
        details: 'Disipador M.2 de Doble Cara con thermal pad 6 W/mK',
      },
      voltage: {
        value: '3.300',
        unit: 'V',
        label: 'Voltaje Lógico NAND & PMIC',
        details: 'Regulación lineal de ultra-bajo rizado',
        droopDeltaMv: 3,
      },
      bandwidth: {
        value: '7.88',
        unit: 'GB/s',
        label: 'Lectura Secuencial Teórica (Gen4 x4)',
        busWidth: '4 Carriles PCIe directos dedicados',
        saturationPct: 52,
      },
      latency: {
        value: '0.04',
        unit: 'ms',
        label: 'Latencia de Acceso Aleatorio QD1',
        dpcSpikeRisk: 'optimal',
        queueDelay: 'Cola NVMe 1.4 con 64K sub-colas de comandos',
      },
    },
    evoDiagnosis: {
      bottleneckRisk: 'Pérdida de rendimiento si se comparte carril con la ranura PCIe x16 (Bifurcación).',
      dpcIsrImpact: 'Bajo. Controladores stornvme.sys de Microsoft optimizados en modo polling.',
      forensicRemediation:
        'Instalar la unidad del sistema operativo en el slot M.2_1 (conectado al CPU) y nunca poblar slots que fuercen la división de carriles de la tarjeta gráfica.',
    },
    provenance: 'ESTIMATED',
  },
  io: {
    id: 'io',
    name: 'Panel Trasero I/O & Aislamiento de Audio',
    subsystem: 'Controlador USB xHCI, Interfaz de Red 2.5GbE & Códec de Audio HD',
    busType: 'Buses Auxiliares de Interrupción (USB / I2S / PCIe x1)',
    academicDescription:
      'Zona perimetral que aloja el puente de controladores USB, interfaz física de red Ethernet/WiFi y circuito de audio de alta fidelidad aislado del plano de tierra digital.',
    latencyImpact:
      'Controladores de audio deficientes o la saturación de los controladores de host USB por ratones de 8000 Hz disparan rutinas ISR desbordadas en el Kernel de Windows, desplazando los hilos críticos de renderizado del motor gráfico.',
    metrics: {
      temperature: {
        value: 46,
        unit: '°C',
        status: 'nominal',
        label: 'Temperatura Blindaje I/O',
        details: 'Disipador térmico integrado en la armadura',
      },
      voltage: {
        value: '5.050',
        unit: 'V',
        label: 'Voltaje VBUS USB',
        details: 'Líneas filtradas con capacitores de tantalio',
        droopDeltaMv: 12,
      },
      bandwidth: {
        value: '2.50',
        unit: 'Gbps',
        label: 'Tasa Ethernet 2.5G + USB 3.2 Gen2',
        busWidth: 'Buses multiplexados sobre plano de PCH',
        saturationPct: 41,
      },
      latency: {
        value: '0.18',
        unit: 'ms',
        label: 'Latencia de Interrupción ISR de Audio',
        dpcSpikeRisk: 'optimal',
        queueDelay: 'Códec aislado sin interferencia electromagnética (EMI)',
      },
    },
    evoDiagnosis: {
      bottleneckRisk: 'Tormentas de interrupción generadas por controladores de red Realtek antiguos o audio sin firmar.',
      dpcIsrImpact: 'CRÍTICO si se instalan suites de software de audio con procesamiento espacial invasivo en Ring 0.',
      forensicRemediation:
        'Deshabilitar en BIOS códecs de audio no utilizados, forzar modo MSI en el controlador de red y calibrar el buffer de sondeo USB.',
    },
    provenance: 'ESTIMATED',
  },
};

// ============================================================================
// COMPONENT PROPS
// ============================================================================
export interface EvoMotherboardCanvasProps {
  passport?: UserHardwarePassport | null;
  onSelectComponent?: (componentId: string, name: string, detail: string) => void;
  activeOverlay?: 'default' | 'thermal' | 'signals' | 'power';
  setActiveOverlay?: (overlay: 'default' | 'thermal' | 'signals' | 'power') => void;
  activeLoadProfile?: 'idle' | 'shaders' | 'gaming' | 'torture';
  pcieConfig?: {
    generation: 'Gen 3' | 'Gen 4' | 'Gen 5';
    lanes: 'x4' | 'x8' | 'x16';
    isBifurcatedWithM2: boolean;
  };
  initialComponent?: MotherboardComponentId;
  className?: string;
}

export const EvoMotherboardCanvas: React.FC<EvoMotherboardCanvasProps> = ({
  passport,
  onSelectComponent,
  activeOverlay: externalOverlay,
  setActiveOverlay: externalSetOverlay,
  activeLoadProfile: externalLoadProfile,
  pcieConfig: externalPcieConfig,
  initialComponent = 'pch',
  className = '',
}) => {
  // Estado del componente activo inspeccionado
  const [activeComponent, setActiveComponent] = useState<MotherboardComponentId>(initialComponent);
  const [hoveredPart, setHoveredPart] = useState<MotherboardComponentId | null>(null);
  const [busSimulationActive, setBusSimulationActive] = useState<boolean>(true);

  // Estados de Overlay y Perfiles de Carga (compatibilidad bidireccional)
  const [internalOverlay, setInternalOverlay] = useState<'default' | 'thermal' | 'signals' | 'power'>('default');
  const activeOverlay = externalOverlay || internalOverlay;
  const setActiveOverlay = externalSetOverlay || setInternalOverlay;

  const [internalLoadProfile, setInternalLoadProfile] = useState<'idle' | 'shaders' | 'gaming' | 'torture'>('gaming');
  const activeLoad = externalLoadProfile || internalLoadProfile;

  const [internalPcieGen, setInternalPcieGen] = useState<'Gen 3' | 'Gen 4' | 'Gen 5'>('Gen 4');
  const [internalPcieLanes, setInternalPcieLanes] = useState<'x4' | 'x8' | 'x16'>('x16');
  const [internalIsBifurcated, setInternalIsBifurcated] = useState<boolean>(false);

  const pcieGen = externalPcieConfig?.generation || internalPcieGen;
  const pcieLanes = externalPcieConfig?.lanes || internalPcieLanes;
  const isBifurcated = externalPcieConfig?.isBifurcatedWithM2 !== undefined ? externalPcieConfig.isBifurcatedWithM2 : internalIsBifurcated;

  const isPcieSaturated = isBifurcated && (pcieLanes === 'x8' || pcieLanes === 'x4');

  // Mapeo térmico dinámico según carga
  const thermalProfile = useMemo(() => {
    switch (activeLoad) {
      case 'idle':
        return {
          cpuTemp: 38,
          vrmTemp: 44,
          dieColor: '#10b981',
          dieGlow: '#059669',
          vrmColor: '#059669',
          label: 'IDLE / REPOSO (38°C)',
          description: 'Carga básica de escritorio: Núcleos en C-States C6/C7 con consumo < 18W.',
        };
      case 'shaders':
        return {
          cpuTemp: 68,
          vrmTemp: 64,
          dieColor: '#f59e0b',
          dieGlow: '#d97706',
          vrmColor: '#d97706',
          label: 'COMPILACIÓN SHADERS (68°C)',
          description: 'Carga multihilo AVX2 en precarga de assets: Clocks sostenidos y Ring Bus activo.',
        };
      case 'torture':
        return {
          cpuTemp: 96,
          vrmTemp: 98,
          dieColor: '#ef4444',
          dieGlow: '#dc2626',
          vrmColor: '#b91c1c',
          label: 'TORTURA 100% AVX-512 (96°C+)',
          description: 'Carga sintética máxima: Thermal throttling inminente y fases VRM al límite.',
        };
      case 'gaming':
      default:
        return {
          cpuTemp: 76,
          vrmTemp: 72,
          dieColor: '#f97316',
          dieGlow: '#ea580c',
          vrmColor: '#ea580c',
          label: 'GAMING 144Hz (76°C)',
          description: 'Carga típica de juego competitivo con frametimes estables y ráfagas monohilo.',
        };
    }
  }, [activeLoad]);

  // Selección de componente activo y notificación externa
  const handleSelectComponent = useCallback(
    (componentId: MotherboardComponentId) => {
      setActiveComponent(componentId);
      const dossier = MOTHERBOARD_DATA_DICTIONARY[componentId];
      if (onSelectComponent && dossier) {
        onSelectComponent(
          componentId,
          dossier.name,
          `${dossier.academicDescription} ${dossier.latencyImpact}`
        );
      }
    },
    [onSelectComponent]
  );

  const currentDossier = MOTHERBOARD_DATA_DICTIONARY[activeComponent] || MOTHERBOARD_DATA_DICTIONARY.cpu;

  // Datos reales inyectados desde el hardware passport si existen
  const cpuDisplayName = passport?.cpuModel || 'Intel Core i3-1220P (FCBGA1744)';
  const ramDisplayName = passport?.ramCapacityGb
    ? `${passport.ramCapacityGb} GB DDR5 @ ${passport.ramSpeedMhz || 5600} MT/s`
    : '16 GB DDR5 5600 MT/s Dual-Channel';
  const gpuDisplayName = passport?.gpuModel || `PCIe ${pcieGen.replace('Gen ', '')}.0 ${pcieLanes} Direct Link`;

  return (
    <div className={`relative w-full rounded-3xl bg-[#06080d] border border-gray-800 shadow-[0_0_60px_rgba(0,0,0,0.85)] overflow-hidden font-mono text-slate-100 select-none ${className}`}>
      
      {/* Estilos CSS inyectados para animación de trazas de silicio con aceleración por hardware */}
      <style>{`
        @keyframes evoTraceFlow {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes evoDmiPulseGlow {
          0%, 100% { stroke: #ca8a04; filter: drop-shadow(0 0 2px #ca8a04); }
          50% { stroke: #fde047; filter: drop-shadow(0 0 10px #facc15); }
        }
        @keyframes evoRingGlow {
          0%, 100% { stroke: #f59e0b; opacity: 0.75; }
          50% { stroke: #fef08a; opacity: 1; filter: drop-shadow(0 0 8px #f59e0b); }
        }
        @keyframes evoVrmPulse {
          0%, 100% { opacity: 0.6; stroke: #10b981; }
          50% { opacity: 1; stroke: #34d399; filter: drop-shadow(0 0 8px #10b981); }
        }
        .evo-trace-animated {
          animation: evoTraceFlow 1.4s linear infinite;
        }
        .evo-trace-fast {
          animation: evoTraceFlow 0.7s linear infinite;
        }
        .evo-dmi-active {
          animation: evoDmiPulseGlow 2.2s ease-in-out infinite;
        }
        .evo-ring-active {
          animation: evoRingGlow 1.8s ease-in-out infinite;
        }
        .evo-vrm-active {
          animation: evoVrmPulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* ========================================================================= */}
      {/* HEADER DE CONTROL SUPERIOR (HUD DE TELEMETRÍA FORENSE)                     */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#090d15] border-b border-gray-800 text-xs z-20 relative">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-[0_0_10px_#eab308] animate-pulse" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-widest text-[11px] uppercase">
              VISOR DE TOPOLOGÍA ESTRUCTURAL Y LATENCIA
            </span>
            <span className="text-gray-600 hidden sm:inline">//</span>
            <span className="text-yellow-500 text-[10px] hidden md:inline font-bold">
              PCB DE 8 CAPAS DE COBRE (2oz COPPER)
            </span>
          </div>
        </div>

        {/* Selector de Modos de Diagnóstico y Simulación */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Botón de Animación de Trazas */}
          <button
            type="button"
            onClick={() => setBusSimulationActive(!busSimulationActive)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              busSimulationActive
                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/40 shadow-sm'
                : 'bg-black/40 text-gray-500 border-gray-800 hover:text-gray-300'
            }`}
            title="Activar o pausar el flujo visual de paquetes sobre las trazas de cobre"
          >
            <Radio className={`w-3 h-3 ${busSimulationActive ? 'animate-pulse text-yellow-500' : ''}`} />
            <span>{busSimulationActive ? 'TRAZAS ACTIVAS' : 'TRAZAS PAUSADAS'}</span>
          </button>

          {/* Selector de Capa de Diagnóstico */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => setActiveOverlay('default')}
              className={`px-2.5 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeOverlay === 'default'
                  ? 'bg-yellow-500 text-black shadow font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>ESTRUCTURAL</span>
            </button>

            <button
              onClick={() => setActiveOverlay('thermal')}
              className={`px-2.5 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeOverlay === 'thermal'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'text-gray-400 hover:text-rose-400'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>TÉRMICO</span>
            </button>

            <button
              onClick={() => setActiveOverlay('signals')}
              className={`px-2.5 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeOverlay === 'signals'
                  ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>SEÑALES</span>
            </button>

            <button
              onClick={() => setActiveOverlay('power')}
              className={`px-2.5 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeOverlay === 'power'
                  ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-gray-400 hover:text-emerald-300'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>POTENCIA</span>
            </button>
          </div>

          {/* Controles de Carga Térmica (modo térmico) */}
          {activeOverlay === 'thermal' && (
            <div className="flex items-center gap-1 bg-rose-950/30 p-1 rounded-lg border border-rose-500/40 text-[10px]">
              {(['idle', 'shaders', 'gaming', 'torture'] as const).map((load) => (
                <button
                  key={load}
                  onClick={() => setInternalLoadProfile(load)}
                  className={`px-2 py-0.5 rounded font-bold uppercase transition-all cursor-pointer ${
                    activeLoad === load
                      ? 'bg-rose-500 text-white shadow'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {load === 'idle'
                    ? '38°C'
                    : load === 'shaders'
                    ? '68°C'
                    : load === 'gaming'
                    ? '76°C'
                    : '96°C'}
                </button>
              ))}
            </div>
          )}

          {/* Configuración PCIe (modo señales) */}
          {activeOverlay === 'signals' && (
            <div className="flex items-center gap-1.5 bg-cyan-950/30 p-1 rounded-lg border border-cyan-500/40 text-[10px]">
              <select
                value={pcieLanes}
                onChange={(e) => setInternalPcieLanes(e.target.value as any)}
                className="bg-black/80 text-yellow-500 border border-yellow-500/40 rounded px-1.5 py-0.5 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="x16">x16 Carriles</option>
                <option value="x8">x8 Carriles</option>
                <option value="x4">x4 Carriles</option>
              </select>

              <button
                type="button"
                onClick={() => setInternalIsBifurcated(!isBifurcated)}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer border ${
                  isBifurcated
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-200'
                }`}
                title="Simular saturación de carril por SSD bifurcado"
              >
                {isBifurcated ? '⚠️ BIFURCADO' : 'DEDICADO'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DIAGRAMA INTERACTIVO SVG: PLACA BASE FORENSE CON TRAZAS DINÁMICAS        */}
      {/* ========================================================================= */}
      <div className="relative w-full aspect-[16/9] min-h-[460px] sm:min-h-[520px] p-2 sm:p-6 bg-[#07090e] flex items-center justify-center overflow-hidden border-b border-gray-800">
        {/* Trama sutil de cuadrícula de circuito impreso */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

        <svg viewBox="0 0 1000 620" className="w-full h-full max-h-[560px] drop-shadow-2xl z-10 select-none overflow-visible">
          <defs>
            {/* Copper ground plane pattern */}
            <pattern id="pcb-copper-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill="#1e293b" opacity="0.65" />
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f172a" strokeWidth="0.5" />
            </pattern>

            {/* Industrial Heatsink & Metal Gradients */}
            <linearGradient id="heatsink-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="vrmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#222738" />
              <stop offset="50%" stopColor="#151926" />
              <stop offset="100%" stopColor="#0c0f18" />
            </linearGradient>
            <linearGradient id="cpu-silicon-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#252a38" />
              <stop offset="100%" stopColor="#10131d" />
            </linearGradient>
            <linearGradient id="io-shield-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="30%" stopColor="#0f172a" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>

            {/* Signal Bus Glow Filters */}
            <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowRose" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial Thermal Dissipation Gradients */}
            <radialGradient id="thermal-field-crit" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#fb923c" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="thermal-field-warn" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#fb923c" stopOpacity="0.25" />
              <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. MOTHERBOARD ATX PCB BASE PLATE */}
          <rect
            x="20"
            y="15"
            width="960"
            height="590"
            rx="16"
            fill="#060911"
            stroke={hoveredPart ? '#3b82f6' : '#1e3a8a'}
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />
          <rect
            x="25"
            y="20"
            width="950"
            height="580"
            rx="12"
            fill="url(#pcb-copper-grid)"
            opacity="0.8"
          />

          {/* ATX Mounting Standoff Screws (High-detail zinc crosshead) */}
          {[
            [45, 35], [500, 35], [955, 35],
            [45, 310], [500, 310], [955, 310],
            [45, 585], [500, 585], [955, 585],
          ].map(([sx, sy], i) => (
            <g key={`screw-${i}`}>
              <circle cx={sx} cy={sy} r="9" fill="#18181b" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx={sx} cy={sy} r="4.5" fill="#3f3f46" />
              <line x1={sx - 3} y1={sy} x2={sx + 3} y2={sy} stroke="#e4e4e7" strokeWidth="1.5" />
              <line x1={sx} y1={sy - 3} x2={sx} y2={sy + 3} stroke="#e4e4e7" strokeWidth="1.5" />
            </g>
          ))}

          {/* PCB Technical Silkscreen Markings */}
          <text x="35" y="600" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace">
            EVO LABS // TOPOLOGY & SIGNAL INTEGRITY // 8-LAYER HIGH-SPEED DIELECTRIC (2oz COPPER GROUND)
          </text>
          <text x="700" y="600" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
            SOCKET: LGA1700 • CHIPSET: DMI 4.0 x8 • PCIe 5.0 PEG
          </text>

          {/* ======================================================================= */}
          {/* RADIAL THERMAL RIPPLE DISSIPATION LAYER (Active in Thermal Mode/Torture) */}
          {/* ======================================================================= */}
          {(activeOverlay === 'thermal' || activeLoad === 'torture' || activeLoad === 'gaming') && (
            <g id="pcb-thermal-dissipation-field">
              {/* CPU Die Hotspot Dissipation */}
              <circle
                cx="375"
                cy="195"
                r={activeLoad === 'torture' ? 140 : 100}
                fill={activeLoad === 'torture' ? 'url(#thermal-field-crit)' : 'url(#thermal-field-warn)'}
                className="pointer-events-none"
              />
              <circle cx="375" cy="195" r="28" fill="none" stroke={thermalProfile.dieGlow} strokeWidth="2.5" opacity="0.8" className="pointer-events-none">
                <animate attributeName="r" from="28" to={activeLoad === 'torture' ? "140" : "100"} dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.9" to="0" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" from="3" to="0.5" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="375" cy="195" r="28" fill="none" stroke={thermalProfile.dieGlow} strokeWidth="2" opacity="0.7" className="pointer-events-none">
                <animate attributeName="r" from="28" to={activeLoad === 'torture' ? "140" : "100"} dur="2.2s" begin="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="2.2s" begin="0.8s" repeatCount="indefinite" />
              </circle>

              {/* VRM Hotspot Dissipation */}
              <circle
                cx="210"
                cy="165"
                r={activeLoad === 'torture' ? 110 : 75}
                fill={activeLoad === 'torture' ? 'url(#thermal-field-crit)' : 'url(#thermal-field-warn)'}
                className="pointer-events-none"
              />
              <circle cx="210" cy="165" r="20" fill="none" stroke={thermalProfile.vrmColor} strokeWidth="2" opacity="0.7" className="pointer-events-none">
                <animate attributeName="r" from="20" to={activeLoad === 'torture' ? "110" : "75"} dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* ======================================================================= */}
          {/* DYNAMIC BUS TRACES WITH COPPER SUBSTRATE & ANIMATED PACKET PULSES       */}
          {/* ======================================================================= */}

          {/* 1. CPU ↔ RAM: 128-BIT DDR5 DUAL-CHANNEL HIGH-SPEED MEMORY BUS */}
          <g
            className={`cursor-pointer transition-opacity duration-300 ${activeComponent === 'ram' || activeComponent === 'cpu' ? 'opacity-100' : 'opacity-65'}`}
            onClick={() => handleSelectComponent('ram')}
          >
            {/* Ground copper tracks */}
            <path d="M 465 140 L 575 140 M 465 165 L 575 165 M 465 190 L 575 190 M 465 215 L 575 215" stroke="#1e293b" strokeWidth="4" />
            {/* Active signal traces */}
            <path
              d="M 465 140 L 575 140 M 465 165 L 575 165 M 465 190 L 575 190 M 465 215 L 575 215"
              stroke={activeComponent === 'ram' ? '#eab308' : '#06b6d4'}
              strokeWidth={activeComponent === 'ram' ? '3' : '2'}
              strokeDasharray={busSimulationActive ? '6,4' : 'none'}
              className={busSimulationActive ? 'evo-trace-animated' : undefined}
              filter={activeComponent === 'ram' ? 'url(#glowGold)' : undefined}
            />
            {/* SVG moving packet pulses */}
            {busSimulationActive && (
              <>
                <circle r="3.2" fill="#ffffff" stroke="#eab308" strokeWidth="1.5">
                  <animateMotion path="M 465 140 L 575 140" dur="1.2s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.2">
                  <animateMotion path="M 575 165 L 465 165" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
                </circle>
                <circle r="2.8" fill="#eab308">
                  <animateMotion path="M 465 190 L 575 190" dur="1.2s" begin="0.15s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.2">
                  <animateMotion path="M 575 215 L 465 215" dur="1.2s" begin="0.45s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            <text x="475" y="132" fill={activeComponent === 'ram' ? '#fde047' : '#06b6d4'} fontSize="7.5" fontWeight="bold">
              128-BIT DDR5 BUS (IMC)
            </text>
          </g>

          {/* 2. CPU ↔ CHIPSET PCH: DMI 4.0 x8 LINK (15.75 GB/s) */}
          <g
            className={`cursor-pointer transition-opacity duration-300 ${activeComponent === 'pch' || activeComponent === 'cpu' ? 'opacity-100' : 'opacity-70'}`}
            onClick={() => handleSelectComponent('pch')}
          >
            {/* Ground copper tracks */}
            <path d="M 430 295 L 430 355 L 670 355 L 670 375 M 445 295 L 445 365 L 685 365 L 685 375" fill="none" stroke="#1e293b" strokeWidth="4" />
            <path
              d="M 430 295 L 430 355 L 670 355 L 670 375 M 445 295 L 445 365 L 685 365 L 685 375"
              fill="none"
              stroke={activeComponent === 'pch' ? '#facc15' : '#a855f7'}
              strokeWidth={activeComponent === 'pch' ? '3.5' : '2.5'}
              strokeDasharray={busSimulationActive ? '8,4' : 'none'}
              className={busSimulationActive ? 'evo-trace-fast evo-dmi-active' : undefined}
              filter={activeComponent === 'pch' ? 'url(#glowGold)' : undefined}
            />
            {busSimulationActive && (
              <>
                <circle r="3.2" fill="#ffffff" stroke="#a855f7" strokeWidth="1.5">
                  <animateMotion path="M 430 295 L 430 355 L 670 355 L 670 375" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#ffffff" stroke="#facc15" strokeWidth="1.2">
                  <animateMotion path="M 685 375 L 685 365 L 445 365 L 445 295" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            <text x="495" y="348" fill={activeComponent === 'pch' ? '#fde047' : '#c084fc'} fontSize="7.5" fontWeight="bold">
              DMI 4.0 x8 LINK (15.75 GB/s)
            </text>
          </g>

          {/* 3. CPU ↔ PCIE X16 PEG: DIRECT HIGH-SPEED DIFFERENTIAL PAIRS */}
          <g
            className={`cursor-pointer transition-opacity duration-300 ${activeComponent === 'pcie' || activeComponent === 'cpu' ? 'opacity-100' : 'opacity-70'}`}
            onClick={() => handleSelectComponent('pcie')}
          >
            {/* Ground copper tracks */}
            <path d="M 330 295 L 330 380 M 350 295 L 350 380 M 370 295 L 370 380 M 390 295 L 390 380" stroke="#18181b" strokeWidth="4" />
            <path
              d="M 330 295 L 330 380 M 350 295 L 350 380 M 370 295 L 370 380 M 390 295 L 390 380"
              stroke={isPcieSaturated ? '#ef4444' : activeComponent === 'pcie' ? '#facc15' : '#06b6d4'}
              strokeWidth={activeComponent === 'pcie' || isPcieSaturated ? '3.5' : '2'}
              strokeDasharray={isPcieSaturated ? '4,2' : busSimulationActive ? '7,4' : 'none'}
              className={busSimulationActive ? 'evo-trace-animated' : undefined}
              filter={activeComponent === 'pcie' ? 'url(#glowGold)' : undefined}
            />
            {busSimulationActive && (
              <>
                <circle r="3.2" fill="#ffffff" stroke={isPcieSaturated ? '#ef4444' : '#06b6d4'} strokeWidth="1.5">
                  <animateMotion path="M 330 295 L 330 380" dur="1.1s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#ffffff" stroke={isPcieSaturated ? '#ef4444' : '#facc15'} strokeWidth="1.2">
                  <animateMotion path="M 370 380 L 370 295" dur="1.1s" begin="0.3s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            <text x="325" y="375" fill={isPcieSaturated ? '#f87171' : activeComponent === 'pcie' ? '#fde047' : '#38bdf8'} fontSize="7" fontWeight="bold">
              PCIe PEG DIRECT LANES
            </text>
          </g>

          {/* 4. CPU ↔ M.2 NVME PRIMARY DIRECT LINK (Gen4/Gen5 x4) */}
          <g
            className={`cursor-pointer transition-opacity duration-300 ${activeComponent === 'm2' || activeComponent === 'cpu' ? 'opacity-100' : 'opacity-65'}`}
            onClick={() => handleSelectComponent('m2')}
          >
            <path d="M 405 295 L 405 320" stroke="#1e293b" strokeWidth="4" />
            <path
              d="M 405 295 L 405 320"
              stroke={activeComponent === 'm2' ? '#facc15' : '#38bdf8'}
              strokeWidth={activeComponent === 'm2' ? '3.5' : '2'}
              strokeDasharray={busSimulationActive ? '5,3' : 'none'}
              className={busSimulationActive ? 'evo-trace-animated' : undefined}
            />
            {busSimulationActive && (
              <circle r="3" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.2">
                <animateMotion path="M 405 295 L 405 320" dur="0.9s" repeatCount="indefinite" />
              </circle>
            )}
          </g>

          {/* 5. VRM POWER DELIVERY PLANES TO CPU SOCKET */}
          <g
            className={`cursor-pointer transition-opacity duration-300 ${activeComponent === 'vrm' || activeOverlay === 'power' ? 'opacity-100' : 'opacity-55'}`}
            onClick={() => handleSelectComponent('vrm')}
          >
            <path d="M 220 130 L 285 130 M 220 170 L 285 170 M 220 210 L 285 210 M 220 250 L 285 250" fill="none" stroke={activeComponent === 'vrm' ? '#eab308' : '#10b981'} strokeWidth="4" strokeLinecap="round" className={busSimulationActive ? 'evo-vrm-active' : undefined} />
            <path d="M 330 74 L 330 100 M 375 74 L 375 100 M 420 74 L 420 100" fill="none" stroke={activeComponent === 'vrm' ? '#eab308' : '#10b981'} strokeWidth="4" strokeLinecap="round" className={busSimulationActive ? 'evo-vrm-active' : undefined} />
            <text x="210" y="70" fill={activeComponent === 'vrm' ? '#fde047' : '#34d399'} fontSize="7" fontWeight="bold">
              VCORE POWER PLANES (16+2 PHASES)
            </text>
          </g>

          {/* ======================================================================= */}
          {/* COMPONENTES FÍSICOS DE PLACA BASE (REALISMO ATX PROFESIONAL)           */}
          {/* ======================================================================= */}

          {/* 1. REAR I/O SHIELD & AUDIO ISOLATION SECTION (Left Edge) */}
          <g
            id="comp-io"
            onClick={() => handleSelectComponent('io')}
            onMouseEnter={() => setHoveredPart('io')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            {/* Metallic Rear I/O Backplate */}
            <rect
              x="22"
              y="40"
              width="45"
              height="340"
              rx="4"
              fill="url(#io-shield-grad)"
              stroke={activeComponent === 'io' ? '#facc15' : hoveredPart === 'io' ? '#eab308' : '#334155'}
              strokeWidth={activeComponent === 'io' ? '2.5' : '1.5'}
              filter={activeComponent === 'io' ? 'url(#glowGold)' : undefined}
            />

            {/* Individual Rear Ports */}
            {/* DisplayPort & HDMI */}
            <rect x="28" y="55" width="33" height="18" rx="2" fill="#090d16" stroke="#475569" strokeWidth="1" />
            <rect x="28" y="80" width="33" height="16" rx="2" fill="#090d16" stroke="#475569" strokeWidth="1" />
            <text x="32" y="67" fill="#94a3b8" fontSize="6" fontWeight="bold">DP 1.4</text>
            <text x="32" y="91" fill="#94a3b8" fontSize="6" fontWeight="bold">HDMI</text>

            {/* USB 3.2 Ports (Blue Inserts) */}
            <rect x="28" y="105" width="33" height="24" rx="2" fill="#090d16" stroke="#2563eb" strokeWidth="1" />
            <rect x="30" y="110" width="29" height="5" fill="#3b82f6" />
            <rect x="30" y="120" width="29" height="5" fill="#3b82f6" />

            {/* USB Type-C & Type-A */}
            <rect x="32" y="140" width="25" height="10" rx="4" fill="#090d16" stroke="#60a5fa" strokeWidth="1" />
            <rect x="28" y="160" width="33" height="24" rx="2" fill="#090d16" stroke="#2563eb" strokeWidth="1" />
            <rect x="30" y="165" width="29" height="5" fill="#3b82f6" />
            <rect x="30" y="175" width="29" height="5" fill="#3b82f6" />

            {/* 2.5G LAN RJ45 Port */}
            <rect x="28" y="195" width="33" height="32" rx="2" fill="#022c22" stroke="#10b981" strokeWidth="1" />
            <circle cx="34" cy="202" r="1.5" fill="#22c55e" className="animate-pulse" />
            <circle cx="55" cy="202" r="1.5" fill="#eab308" />
            <text x="32" y="220" fill="#6ee7b7" fontSize="6" fontWeight="bold">2.5G LAN</text>

            {/* Wi-Fi Antenna SMA Connectors */}
            <circle cx="36" cy="245" r="4.5" fill="#ca8a04" stroke="#eab308" />
            <circle cx="52" cy="245" r="4.5" fill="#ca8a04" stroke="#eab308" />

            {/* Audio Jack Cluster */}
            <rect x="28" y="265" width="33" height="90" rx="3" fill="#090d16" stroke="#475569" strokeWidth="1" />
            {[280, 305, 330].map((jy, idx) => (
              <g key={`audio-jack-${idx}`}>
                <circle cx="44" cy={jy} r="7" fill="#18181b" stroke="#ca8a04" strokeWidth="1" />
                <circle cx="44" cy={jy} r="3" fill="#090d16" />
              </g>
            ))}

            <text x="30" y="370" fill="#94a3b8" fontSize="6.5" fontWeight="bold" transform="rotate(-90 30 370)">
              REAR I/O & USB HOST
            </text>

            {/* Audio Section with Dedicated Isolation Trench */}
            <path
              d="M 22 395 L 115 395 L 115 580 L 22 580"
              fill="#090e17"
              stroke={activeComponent === 'io' ? '#facc15' : '#f59e0b'}
              strokeWidth={activeComponent === 'io' ? '2.5' : '1.5'}
              strokeDasharray="4 2"
              className={activeComponent === 'io' ? 'animate-pulse' : undefined}
            />
            {/* Nichicon Gold Audio Capacitors */}
            {[415, 435, 455, 475].map((cy, idx) => (
              <g key={`audiocap-${idx}`}>
                <circle cx="45" cy={cy} r="6" fill="#1c1917" stroke="#ca8a04" strokeWidth="1.5" />
                <circle cx="45" cy={cy} r="2" fill="#ca8a04" />
              </g>
            ))}
            {/* Audio Codec Chip */}
            <rect x="65" y="420" width="38" height="38" rx="2" fill="#18181b" stroke="#71717a" strokeWidth="1" />
            <text x="70" y="438" fill="#e2e8f0" fontSize="6" fontWeight="bold">ALC4080</text>
            <text x="70" y="448" fill="#ca8a04" fontSize="5.5">DPC SHIELD</text>

            <text x="30" y="520" fill={activeComponent === 'io' ? '#fde047' : '#f59e0b'} fontSize="7.5" fontWeight="bold">
              AUDIO DPC ISOLATION
            </text>
            {activeComponent === 'io' && (
              <circle cx="60" cy="50" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* 2. VRM POWER DELIVERY SYSTEM & 8-PIN EPS 12V (Top Left) */}
          <g
            id="comp-vrm"
            onClick={() => handleSelectComponent('vrm')}
            onMouseEnter={() => setHoveredPart('vrm')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            {/* 8-Pin EPS CPU 12V Connector */}
            <rect x="155" y="30" width="60" height="36" rx="3" fill="#18181b" stroke="#eab308" strokeWidth="1.5" />
            <text x="160" y="43" fill="#facc15" fontSize="7" fontWeight="black">EPS 12V</text>
            <text x="160" y="54" fill="#a1a1aa" fontSize="6">8-PIN CPU</text>
            {/* 8 Pin gold squares */}
            {[0, 1, 2, 3].map((col) => (
              <g key={`epspin-${col}`}>
                <rect x={188 + col * 6} y="34" width="4.5" height="4.5" fill="#ca8a04" />
                <rect x={188 + col * 6} y="41" width="4.5" height="4.5" fill="#ca8a04" />
              </g>
            ))}

            {/* Top VRM Aluminum Heatsink */}
            <rect
              x="235"
              y="28"
              width="230"
              height="46"
              rx="4"
              fill={activeOverlay === 'thermal' ? thermalProfile.vrmColor : 'url(#vrmGrad)'}
              stroke={activeComponent === 'vrm' ? '#facc15' : hoveredPart === 'vrm' ? '#eab308' : '#3b4252'}
              strokeWidth={activeComponent === 'vrm' ? '3' : '1.8'}
              filter={activeComponent === 'vrm' ? 'url(#glowGold)' : undefined}
            />
            {/* Milled Heatsink cooling fins */}
            {[38, 48, 58].map((fy, i) => (
              <line key={`vrm-top-fin-${i}`} x1="245" y1={fy} x2="455" y2={fy} stroke="#334155" strokeWidth="1.5" />
            ))}

            {/* Left VRM Aluminum Heatsink */}
            <rect
              x="145"
              y="80"
              width="70"
              height="205"
              rx="4"
              fill={activeOverlay === 'thermal' ? thermalProfile.vrmColor : 'url(#vrmGrad)'}
              stroke={activeComponent === 'vrm' ? '#facc15' : hoveredPart === 'vrm' ? '#eab308' : '#3b4252'}
              strokeWidth={activeComponent === 'vrm' ? '3' : '1.8'}
              filter={activeComponent === 'vrm' ? 'url(#glowGold)' : undefined}
            />
            {[105, 130, 155, 180, 205, 230, 255].map((fy, i) => (
              <line key={`vrm-left-fin-${i}`} x1="155" y1={fy} x2="205" y2={fy} stroke="#334155" strokeWidth="1.5" />
            ))}

            {/* Connecting Heatpipe between heatsinks */}
            <path d="M 175 90 L 175 52 Q 175 42 190 42 L 235 42" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

            {/* Ferrite Chokes (R15 / R22) & Polymer Capacitors */}
            {[245, 272, 299, 326, 353, 380, 407, 434].map((vx, i) => (
              <rect key={`choke-top-${i}`} x={vx} y="76" width="18" height="16" rx="2" fill="#27272a" stroke="#71717a" strokeWidth="1" />
            ))}
            {[90, 115, 140, 165, 190, 215, 240, 265].map((vy, i) => (
              <g key={`choke-left-${i}`}>
                <rect x="218" y={vy} width="16" height="18" rx="2" fill="#27272a" stroke="#71717a" strokeWidth="1" />
                <circle cx="210" cy={vy + 9} r="4.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />
              </g>
            ))}

            <text x="250" y="45" fill="#e2e8f0" fontSize="9" fontWeight="bold">
              {activeOverlay === 'thermal' ? `VRM: ${thermalProfile.vrmTemp}°C` : '16+2+1 DIGITAL VRM POWER STAGES'}
            </text>
            <text x="150" y="275" fill="#94a3b8" fontSize="7.5" fontWeight="bold" transform="rotate(-90 150 275)">
              SPS 90A POWER STAGES
            </text>
            {activeComponent === 'vrm' && (
              <circle cx="455" cy="40" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* 3. CPU SOCKET LGA1700 & SILICON DIE (Center-Top) */}
          <g
            id="comp-cpu"
            onClick={() => handleSelectComponent('cpu')}
            onMouseEnter={() => setHoveredPart('cpu')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            {/* Outer Metal Retention Frame */}
            <rect
              x="285"
              y="100"
              width="180"
              height="195"
              rx="10"
              fill="#18181b"
              stroke={activeComponent === 'cpu' ? '#facc15' : hoveredPart === 'cpu' ? '#eab308' : '#52525b'}
              strokeWidth={activeComponent === 'cpu' ? '3.5' : '1.8'}
              filter={activeComponent === 'cpu' ? 'url(#glowGold)' : undefined}
            />

            {/* Metal Retention Lever */}
            <line x1="472" y1="110" x2="472" y2="280" stroke="#d4d4d8" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="472" cy="285" r="5" fill="#f59e0b" />

            {/* Socket Bevel & Pin Array (LGA Pins Bed) */}
            <rect x="300" y="115" width="150" height="165" rx="6" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />
            {/* Gold Pin 1 alignment triangle */}
            <polygon points="305,120 315,120 305,130" fill="#facc15" />

            {/* Central CPU Die / Integrated Heat Spreader (IHS) */}
            <rect
              x="320"
              y="135"
              width="110"
              height="125"
              rx="5"
              fill={activeOverlay === 'thermal' ? thermalProfile.dieColor : 'url(#cpu-silicon-grad)'}
              stroke={activeComponent === 'cpu' ? '#fde047' : activeOverlay === 'thermal' ? thermalProfile.dieGlow : '#eab308'}
              strokeWidth={activeComponent === 'cpu' ? '2.5' : '1.5'}
            />

            {/* Ring Bus Concentric Simulation inside Die */}
            <circle
              cx="375"
              cy="197"
              r="36"
              fill="none"
              stroke={activeComponent === 'cpu' ? '#facc15' : '#eab308'}
              strokeWidth="2"
              strokeDasharray={busSimulationActive ? '6,3' : 'none'}
              className={busSimulationActive ? 'evo-ring-active' : undefined}
            />
            <circle cx="375" cy="197" r="20" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />

            {/* Silicon Cores Matrix */}
            <text x="340" y="172" fill="#fef08a" fontSize="10" fontWeight="bold">
              SOCKET
            </text>
            <text x="335" y="186" fill="#ffffff" fontSize="9" fontWeight="bold">
              RING BUS
            </text>
            <text x="330" y="245" fill={activeComponent === 'cpu' ? '#facc15' : '#94a3b8'} fontSize="8" fontWeight="bold">
              {activeOverlay === 'thermal' ? `DIE: ${thermalProfile.cpuTemp}°C` : 'LGA1700 / DIE L3'}
            </text>
            {activeComponent === 'cpu' && (
              <circle cx="450" cy="115" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* 4. RAM / DDR5 DIMM SLOTS (A1, A2, B1, B2) (Top Right) */}
          <g
            id="comp-ram"
            onClick={() => handleSelectComponent('ram')}
            onMouseEnter={() => setHoveredPart('ram')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            {/* DIMM Bank Background Plate */}
            <rect
              x="565"
              y="65"
              width="185"
              height="245"
              rx="6"
              fill="#0c1322"
              stroke={activeComponent === 'ram' ? '#facc15' : hoveredPart === 'ram' ? '#eab308' : '#334155'}
              strokeWidth={activeComponent === 'ram' ? '2.8' : '1.5'}
              filter={activeComponent === 'ram' ? 'url(#glowGold)' : undefined}
            />
            <text x="575" y="80" fill="#38bdf8" fontSize="8" fontWeight="black">
              128-BIT DDR5 DUAL-CHANNEL (IMC)
            </text>

            {/* 4 Physical Slots */}
            {[
              { id: 'A1', x: 578, pop: false, name: 'A1' },
              { id: 'A2', x: 622, pop: true, name: 'A2 (CH-A) ✓' },
              { id: 'B1', x: 666, pop: false, name: 'B1' },
              { id: 'B2', x: 710, pop: true, name: 'B2 (CH-B) ✓' },
            ].map((slot) => (
              <g key={`dimm-${slot.id}`}>
                {/* Slot casing with center key notch */}
                <rect x={slot.x} y="90" width="26" height="190" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
                {/* Top & Bottom white retention latches */}
                <rect x={slot.x - 1} y="86" width="28" height="6" fill="#e4e4e7" rx="1" />
                <rect x={slot.x - 1} y="278" width="28" height="6" fill="#e4e4e7" rx="1" />

                {/* Populated RAM Stick (Green/Dark PCB with chips) */}
                {slot.pop ? (
                  <g>
                    <rect x={slot.x + 3} y="94" width="20" height="182" rx="2" fill="#042f2e" stroke="#10b981" strokeWidth="1" />
                    {/* SMD memory chips on stick */}
                    {[105, 125, 145, 165, 195, 215, 235, 255].map((my, idx) => (
                      <rect key={`dram-chip-${idx}`} x={slot.x + 5} y={my} width="16" height="14" rx="1" fill="#021f1d" stroke="#059669" strokeWidth="0.8" />
                    ))}
                    {/* PMIC chip in center */}
                    <rect x={slot.x + 8} y="182" width="10" height="8" rx="1" fill="#09090b" stroke="#ca8a04" strokeWidth="0.8" />
                    <text x={slot.x + 4} y="200" fill="#6ee7b7" fontSize="7" fontWeight="black" transform={`rotate(-90 ${slot.x + 4} 200)`}>
                      DDR5 5600 MT/s
                    </text>
                  </g>
                ) : (
                  <text x={slot.x + 7} y="195" fill="#52525b" fontSize="6.5" transform={`rotate(-90 ${slot.x + 7} 195)`}>
                    VACÍO
                  </text>
                )}
                <text x={slot.x + 3} y="295" fill="#94a3b8" fontSize="7" fontWeight="bold">
                  {slot.name}
                </text>
              </g>
            ))}
            {activeComponent === 'ram' && (
              <circle cx="735" cy="75" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* 5. 24-PIN ATX MAIN POWER & SATA 6Gb/s CONNECTORS (Right Edge) */}
          <g id="comp-atx-sata" className="opacity-90">
            {/* 24-Pin ATX Main Power Connector */}
            <rect x="780" y="80" width="46" height="175" rx="4" fill="#18181b" stroke="#eab308" strokeWidth="1.8" />
            <text x="785" y="94" fill="#facc15" fontSize="7.5" fontWeight="black">ATX 24P</text>
            {/* 2x12 Gold Pin Grid with square contact sockets */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((p) => (
              <g key={`atx24pin-${p}`}>
                <circle cx="793" cy={105 + p * 12} r="2.8" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                <circle cx="811" cy={105 + p * 12} r="2.8" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
              </g>
            ))}

            {/* Dual Stacked SATA 6Gb/s Ports */}
            <g>
              <rect x="775" y="365" width="52" height="55" rx="3" fill="#18181b" stroke="#475569" strokeWidth="1.2" />
              <rect x="782" y="375" width="38" height="15" fill="#090d16" stroke="#ca8a04" strokeWidth="1" />
              <rect x="782" y="395" width="38" height="15" fill="#090d16" stroke="#ca8a04" strokeWidth="1" />
              <text x="785" y="372" fill="#94a3b8" fontSize="6.5" fontWeight="bold">SATA 1 & 2</text>

              <rect x="775" y="435" width="52" height="55" rx="3" fill="#18181b" stroke="#475569" strokeWidth="1.2" />
              <rect x="782" y="445" width="38" height="15" fill="#090d16" stroke="#ca8a04" strokeWidth="1" />
              <rect x="782" y="465" width="38" height="15" fill="#090d16" stroke="#ca8a04" strokeWidth="1" />
              <text x="785" y="442" fill="#94a3b8" fontSize="6.5" fontWeight="bold">SATA 3 & 4</text>
              <text x="780" y="505" fill="#64748b" fontSize="7" fontWeight="bold">4x 6Gbps SATA</text>
            </g>
          </g>

          {/* 6. M.2 NVME PRIMARY SLOT (Direct CPU Gen4/5 x4 with Heatsink) */}
          <g
            id="comp-m2"
            onClick={() => handleSelectComponent('m2')}
            onMouseEnter={() => setHoveredPart('m2')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            <rect
              x="275"
              y="315"
              width="245"
              height="42"
              rx="4"
              fill={activeOverlay === 'thermal' ? '#c2410c' : '#111827'}
              stroke={activeComponent === 'm2' ? '#facc15' : hoveredPart === 'm2' ? '#eab308' : '#475569'}
              strokeWidth={activeComponent === 'm2' ? '3' : '1.8'}
              filter={activeComponent === 'm2' ? 'url(#glowGold)' : undefined}
            />
            {/* Gold connector contact fingers on left */}
            <rect x="278" y="320" width="10" height="32" rx="1" fill="#ca8a04" />
            {/* Standoff screw with spring clip on right */}
            <circle cx="505" cy="336" r="5.5" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
            <line x1="503" y1="336" x2="507" y2="336" stroke="#1e293b" />

            <text x="295" y="335" fill={activeComponent === 'm2' ? '#fde047' : '#38bdf8'} fontSize="9" fontWeight="bold">
              M.2 NVMe PCIe 5.0/4.0 x4 (DIRECT CPU BUS)
            </text>
            <text x="295" y="348" fill="#94a3b8" fontSize="7.5">
              HEATSINK ARMOR // DISIPACIÓN ACTIVA
            </text>
            {activeComponent === 'm2' && (
              <circle cx="490" cy="325" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* 7. PCIE EXPANSION SLOTS: PRIMARY PCIE X16 & SECONDARY PCIE X4 */}
          <g
            id="comp-pcie"
            onClick={() => handleSelectComponent('pcie')}
            onMouseEnter={() => setHoveredPart('pcie')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            {/* Primary PCIe 5.0 x16 Slot (Metal armored SafeSlot) */}
            <rect
              x="145"
              y="380"
              width="455"
              height="34"
              rx="4"
              fill={
                isPcieSaturated
                  ? '#450a0a'
                  : activeOverlay === 'thermal'
                  ? '#b45309'
                  : '#131b2b'
              }
              stroke={
                activeComponent === 'pcie'
                  ? '#facc15'
                  : isPcieSaturated
                  ? '#ef4444'
                  : hoveredPart === 'pcie'
                  ? '#eab308'
                  : '#3b82f6'
              }
              strokeWidth={activeComponent === 'pcie' || isPcieSaturated ? '3.5' : '2'}
              filter={activeComponent === 'pcie' ? 'url(#glowGold)' : undefined}
            />

            {/* PCIe Pins and Key divider */}
            <rect x="150" y="388" width="60" height="18" fill="#09090b" />
            <rect x="220" y="388" width="370" height="18" fill="#09090b" />
            {/* Q-Release retention lock latch */}
            <rect x="596" y="374" width="18" height="46" rx="2" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1" />

            <text x="160" y="401" fill={isPcieSaturated ? '#ffffff' : activeComponent === 'pcie' ? '#fde047' : '#facc15'} fontSize="9.5" fontWeight="bold">
              {isPcieSaturated
                ? `⚠️ PCIe ${pcieGen.replace('Gen ', '')}.0 ${pcieLanes} // ¡SATURADO POR BIFURCACIÓN M.2!`
                : `PCIe ${pcieGen.replace('Gen ', '')}.0 ${pcieLanes} SAFESLOT DEDICADO (REBAR ACTIVO)`}
            </text>

            {/* Baliza de saturación o selección */}
            {isPcieSaturated ? (
              <circle cx="585" cy="397" r="6" fill="#ef4444" className="animate-ping" />
            ) : activeComponent === 'pcie' ? (
              <circle cx="585" cy="397" r="4.5" fill="#facc15" className="animate-ping" />
            ) : null}

            {/* Secondary PCIe 4.0 x4 Slot (via Chipset PCH) */}
            <g className="opacity-70">
              <rect x="145" y="470" width="320" height="26" rx="3" fill="#10141d" stroke="#334155" strokeWidth="1.5" />
              <rect x="150" y="476" width="45" height="14" fill="#09090b" />
              <rect x="202" y="476" width="255" height="14" fill="#09090b" />
              <text x="160" y="487" fill="#64748b" fontSize="8" fontWeight="bold">
                PCIe 4.0 x4 (VÍA CHIPSET PCH / EXTENSIÓN)
              </text>
            </g>
          </g>

          {/* 8. CHIPSET PCH PLATFORM CONTROLLER HUB (Bottom Right) */}
          <g
            id="comp-pch"
            onClick={() => handleSelectComponent('pch')}
            onMouseEnter={() => setHoveredPart('pch')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            {/* Aluminum Finned Heatsink */}
            <rect
              x="595"
              y="355"
              width="170"
              height="165"
              rx="8"
              fill={activeOverlay === 'thermal' ? '#b45309' : 'url(#heatsink-grad)'}
              stroke={activeComponent === 'pch' ? '#facc15' : hoveredPart === 'pch' ? '#eab308' : '#475569'}
              strokeWidth={activeComponent === 'pch' ? '3.5' : '2'}
              filter={activeComponent === 'pch' ? 'url(#glowGold)' : undefined}
            />
            {/* Heatsink Milled Cooling Fin Slats */}
            {[375, 395, 415, 435, 455, 475, 495].map((fy, i) => (
              <line key={`pch-fin-${i}`} x1="605" y1={fy} x2="755" y2={fy} stroke="#334155" strokeWidth="2" />
            ))}

            {/* Centered Chipset Badge Plate */}
            <rect x="610" y="405" width="140" height="65" rx="5" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="620" y="425" fill={activeComponent === 'pch' ? '#fde047' : '#60a5fa'} fontSize="10" fontWeight="black">
              CHIPSET PCH HUB
            </text>
            <text x="620" y="442" fill="#ffffff" fontSize="8.5" fontWeight="bold">
              DMI 4.0 x8 LINK (15.75 GB/s)
            </text>
            <text x="620" y="458" fill="#94a3b8" fontSize="7.5">
              USB 3.2 • SATA • AUDIO HOST
            </text>

            <circle cx="735" cy="375" r="4.5" fill="#eab308" />
            {activeComponent === 'pch' && (
              <circle cx="745" cy="365" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>
        </svg>

        {/* Marca de agua de leyenda técnica */}
        <div className="absolute bottom-3 left-5 z-20 flex items-center gap-3 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-gray-800 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
          <span className="text-gray-400">
            NODO SELECCIONADO:{' '}
            <strong className="text-yellow-500 uppercase tracking-wider font-bold">
              {currentDossier.name}
            </strong>
          </span>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden md:inline text-[10.5px]">
            Hacé clic en cualquier componente o pestaña inferior para auditar su latencia DPC
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PANEL DE INFORMACIÓN EXTENDIDO: DOSSIER TÉCNICO DE TELEMETRÍA Y LATENCIA   */}
      {/* (DISEÑO EN GRILLA PROFUNDO DE LABORATORIO DE INGENIERÍA)                 */}
      {/* ========================================================================= */}
      <div className="p-6 md:p-8 bg-[#080b12] flex flex-col gap-6">
        
        {/* Barra de Pestañas de Acceso Rápido a Componentes */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-gray-800/90">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-yellow-500" />
            <span className="text-xs uppercase tracking-widest text-yellow-500 font-bold">
              DOSSIER TÉCNICO ESTRUCTURAL // EXPEDIENTE DE SILICIO
            </span>
          </div>

          {/* Botonera de Nodos */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'cpu', label: 'CPU (Ring Bus)' },
              { id: 'ram', label: 'RAM (IMC & Bus)' },
              { id: 'vrm', label: 'VRM (Fases)' },
              { id: 'pch', label: 'PCH (Chipset DMI)' },
              { id: 'pcie', label: 'PCIe (Carriles)' },
              { id: 'm2', label: 'M.2 NVMe' },
              { id: 'io', label: 'I/O & Audio' },
            ].map((node) => (
              <button
                key={node.id}
                onClick={() => handleSelectComponent(node.id as MotherboardComponentId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                  activeComponent === node.id
                    ? 'bg-yellow-500/15 text-yellow-500 border-yellow-500 font-bold shadow-[0_0_12px_rgba(234,179,8,0.2)]'
                    : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:text-gray-200 hover:border-gray-700'
                }`}
              >
                {node.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cabecera del Dossier con Identificación de Silicio */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-950/80 p-5 rounded-2xl border border-gray-800/90 shadow-inner">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/40">
                {currentDossier.subsystem}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                [{currentDossier.provenance}]
              </span>
              <span className="text-xs text-gray-500 font-mono hidden lg:inline">
                BUS: {currentDossier.busType}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{currentDossier.name}</span>
            </h2>
          </div>

          <div className="text-right font-mono text-xs text-gray-400">
            <div className="text-slate-300">
              Mapeo de Hardware:{' '}
              <strong className="text-yellow-500">
                {activeComponent === 'cpu'
                  ? cpuDisplayName
                  : activeComponent === 'ram'
                  ? ramDisplayName
                  : activeComponent === 'pcie'
                  ? gpuDisplayName
                  : 'Circuito Integrado en PCB'}
              </strong>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Protocolo de Enlace: {currentDossier.busType}
            </div>
          </div>
        </div>

        {/* EXPLICACIÓN SIMPLE PARA PRINCIPIANTES */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#14120a] to-[#0c0d12] border border-amber-400/20 space-y-1">
          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono-tech flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>EXPLICACIÓN SIMPLE PARA PRINCIPIANTES: ¿QUÉ SIGNIFICA {activeComponent.toUpperCase()}?</span>
          </div>
          <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
            {activeComponent === 'vrm' && 'Regula y entrega energía estable al procesador para que funcione sin apagarse ni recalentar.'}
            {activeComponent === 'cpu' && 'El microprocesador central, el cerebro de la PC que procesa toda la lógica e instrucciones.'}
            {activeComponent === 'ram' && 'Memoria de acceso rápido temporal donde se guardan los datos activos de tus juegos o programas.'}
            {activeComponent === 'pch' && 'Chipset de la placa madre que intercomunica puertos USB, discos SSD y periféricos con el CPU.'}
            {activeComponent === 'pcie' && 'Bus de expansión ultra rápido donde se conecta la placa de video para procesar gráficos 3D.'}
            {activeComponent === 'm2' && 'Zócalo de alta velocidad para discos de almacenamiento sólido SSD NVMe ultrarrápidos.'}
            {activeComponent === 'io' && 'Panel de entrada/salida trasero donde se conectan pantallas, auriculares y redes externas.'}
          </p>
        </div>

        {/* ======================================================================= */}
        {/* GRILLA 1: MÉTRICAS DE TELEMETRÍA (PREPARADAS PARA ESTADO EN TIEMPO REAL)*/}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Métrica 1: Temperatura */}
          <div className="p-5 rounded-2xl bg-gray-950/90 border border-gray-800/90 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-yellow-500/40 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-yellow-500" />
                {currentDossier.metrics.temperature.label}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold whitespace-nowrap shrink-0">
                NOMINAL
              </span>
            </div>
            <div className="my-3">
              <span className="text-3xl font-light text-white font-mono">
                {currentDossier.metrics.temperature.value}{' '}
                <span className="text-sm text-yellow-500 font-bold">
                  {currentDossier.metrics.temperature.unit}
                </span>
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              {currentDossier.metrics.temperature.details}
            </div>
          </div>

          {/* Métrica 2: Voltaje */}
          <div className="p-5 rounded-2xl bg-gray-950/90 border border-gray-800/90 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-yellow-500/40 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                {currentDossier.metrics.voltage.label}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/40 font-bold whitespace-nowrap shrink-0">
                ESTABLE
              </span>
            </div>
            <div className="my-3">
              <span className="text-3xl font-light text-white font-mono">
                {currentDossier.metrics.voltage.value}{' '}
                <span className="text-sm text-yellow-500 font-bold">
                  {currentDossier.metrics.voltage.unit}
                </span>
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              Vdroop: -{currentDossier.metrics.voltage.droopDeltaMv} mV // {currentDossier.metrics.voltage.details}
            </div>
          </div>

          {/* Métrica 3: Ancho de Banda */}
          <div className="p-5 rounded-2xl bg-gray-950/90 border border-gray-800/90 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-yellow-500/40 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-yellow-500" />
                {currentDossier.metrics.bandwidth.label}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {currentDossier.metrics.bandwidth.saturationPct}% SATURADO
              </span>
            </div>
            <div className="my-2">
              <span className="text-3xl font-light text-white font-mono">
                {currentDossier.metrics.bandwidth.value}{' '}
                <span className="text-sm text-yellow-500 font-bold">
                  {currentDossier.metrics.bandwidth.unit}
                </span>
              </span>
              {/* Barra de progreso de saturación */}
              <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentDossier.metrics.bandwidth.saturationPct}%` }}
                />
              </div>
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              {currentDossier.metrics.bandwidth.busWidth}
            </div>
          </div>

          {/* Métrica 4: Latencia & DPC */}
          <div className="p-5 rounded-2xl bg-gray-950/90 border border-gray-800/90 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-yellow-500/40 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-yellow-500" />
                {currentDossier.metrics.latency.label}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold border whitespace-nowrap shrink-0 ${
                  currentDossier.metrics.latency.dpcSpikeRisk === 'optimal'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {currentDossier.metrics.latency.dpcSpikeRisk === 'optimal' ? 'ÓPTIMO' : 'MODERADO'}
              </span>
            </div>
            <div className="my-3">
              <span className="text-3xl font-light text-yellow-500 font-mono">
                {currentDossier.metrics.latency.value}{' '}
                <span className="text-sm text-white font-bold">
                  {currentDossier.metrics.latency.unit}
                </span>
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              {currentDossier.metrics.latency.queueDelay}
            </div>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* GRILLA 2: EXPLICACIÓN TÉCNICA ACADÉMICA & IMPACTO EN LATENCIA (EVO)    */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Columna Izquierda: Explicación Técnica Académica */}
          <div className="p-6 rounded-2xl bg-gray-950/90 border border-gray-800 flex flex-col justify-between gap-4 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
                <Terminal className="w-4 h-4 text-yellow-500" />
                <span className="text-xs uppercase font-bold text-yellow-500 tracking-wider">
                  EXPLICACIÓN TÉCNICA ACADÉMICA // ARQUITECTURA DE HARDWARE
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans font-light">
                {currentDossier.academicDescription}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span className="flex items-center gap-1.5 text-gray-300">
                <Info className="w-3.5 h-3.5 text-yellow-500" />
                Topología: <strong className="text-white">{currentDossier.busType}</strong>
              </span>
              <span className="text-yellow-500 font-bold">LAB-GRADE AUDIT</span>
            </div>
          </div>

          {/* Columna Derecha: Impacto EVO en Latencia & DPC */}
          <div className="p-6 rounded-2xl bg-gray-950/90 border border-gray-800 flex flex-col justify-between gap-4 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
                <ShieldAlert className="w-4 h-4 text-yellow-500" />
                <span className="text-xs uppercase font-bold text-yellow-500 tracking-wider">
                  IMPACTO EVO // DIAGNÓSTICO DE LATENCIA, DPC & 1% LOW
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans font-light">
                {currentDossier.latencyImpact}
              </p>
            </div>

            {/* Cuadro de recomendación forense */}
            <div className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-200 font-mono leading-relaxed">
              <strong className="text-yellow-400 block mb-1">
                ⚡ DICTAMEN DE REMEDIACIÓN DE TALLER:
              </strong>
              {currentDossier.evoDiagnosis.forensicRemediation}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default EvoMotherboardCanvas;
