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
  const cpuDisplayName = passport?.cpuModel || 'Intel Core i3-1220P / AM5 Socket';
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

        <svg viewBox="0 0 1000 620" className="w-full h-full max-h-[540px] drop-shadow-2xl z-10">
          <defs>
            {/* Gradientes Industriales para componentes */}
            <linearGradient id="vrmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2230" />
              <stop offset="100%" stopColor="#111420" />
            </linearGradient>
            <linearGradient id="cpuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#252a38" />
              <stop offset="100%" stopColor="#141724" />
            </linearGradient>
            <linearGradient id="goldTraceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="cyanTraceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#a5f3fc" stopOpacity="1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
            </linearGradient>

            {/* Filtros de Resplandor (Glow) */}
            <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Plano de Circuito Impreso Base (PCB) */}
          <rect
            x="40"
            y="20"
            width="920"
            height="580"
            rx="16"
            fill="#090c14"
            stroke={hoveredPart ? '#334155' : '#1f293d'}
            strokeWidth="2.5"
            className="transition-colors duration-300"
          />

          {/* Tornillos de montaje y masa de chasis */}
          {[
            [65, 45],
            [935, 45],
            [65, 575],
            [935, 575],
            [500, 45],
            [500, 575],
          ].map(([cx, cy], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r="3" fill="#090c14" />
              <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} stroke="#64748b" strokeWidth="1.2" />
              <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} stroke="#64748b" strokeWidth="1.2" />
            </g>
          ))}

          {/* ======================================================================= */}
          {/* TRAZAS DE BUS INTERACTIVAS CON RESPLANDOR Y SIMULACIÓN DE FLUJO        */}
          {/* ======================================================================= */}

          {/* 1. FRONT SIDE BUS / BUS DE MEMORIA: CPU ↔ RAM (Canales A y B) */}
          <g className={`transition-opacity duration-300 ${activeComponent === 'ram' || activeComponent === 'cpu' ? 'opacity-100' : 'opacity-60'}`}>
            {/* Traza 1 */}
            <path
              d="M 450 170 L 590 170 L 590 110 L 610 110"
              fill="none"
              stroke={activeComponent === 'ram' ? '#eab308' : '#06b6d4'}
              strokeWidth={activeComponent === 'ram' ? '3.5' : '2'}
              strokeDasharray={busSimulationActive ? '6,4' : 'none'}
              className={busSimulationActive ? 'evo-trace-animated' : undefined}
              filter={activeComponent === 'ram' ? 'url(#glowGold)' : undefined}
            />
            {/* Traza 2 */}
            <path
              d="M 450 200 L 590 200 L 590 190 L 610 190"
              fill="none"
              stroke={activeComponent === 'ram' ? '#eab308' : '#06b6d4'}
              strokeWidth={activeComponent === 'ram' ? '3.5' : '2'}
              strokeDasharray={busSimulationActive ? '6,4' : 'none'}
              className={busSimulationActive ? 'evo-trace-animated' : undefined}
              filter={activeComponent === 'ram' ? 'url(#glowGold)' : undefined}
            />
            {/* Traza 3 */}
            <path
              d="M 450 230 L 590 230 L 590 270 L 610 270"
              fill="none"
              stroke={activeComponent === 'ram' ? '#eab308' : '#06b6d4'}
              strokeWidth={activeComponent === 'ram' ? '3.5' : '2'}
              strokeDasharray={busSimulationActive ? '6,4' : 'none'}
              className={busSimulationActive ? 'evo-trace-animated' : undefined}
              filter={activeComponent === 'ram' ? 'url(#glowGold)' : undefined}
            />
            {/* Indicador de bus de datos DDR */}
            <text x="490" y="160" fill={activeComponent === 'ram' ? '#fde047' : '#06b6d4'} fontSize="8" fontWeight="bold">
              128-BIT DDR5 BUS (IMC)
            </text>
          </g>

          {/* 2. DMI LINK: CPU ↔ CHIPSET PCH (Direct Media Interface 4.0 x8) */}
          <g className={`transition-opacity duration-300 ${activeComponent === 'pch' || activeComponent === 'cpu' ? 'opacity-100' : 'opacity-65'}`}>
            <path
              d="M 420 320 L 420 460 L 680 460 L 680 470"
              fill="none"
              stroke={activeComponent === 'pch' ? '#facc15' : '#a855f7'}
              strokeWidth={activeComponent === 'pch' ? '4.5' : '3'}
              strokeDasharray={busSimulationActive ? '8,4' : 'none'}
              className={busSimulationActive ? 'evo-trace-fast evo-dmi-active' : undefined}
              filter={activeComponent === 'pch' ? 'url(#glowGold)' : undefined}
            />
            <text x="480" y="452" fill={activeComponent === 'pch' ? '#fde047' : '#c084fc'} fontSize="8" fontWeight="bold">
              DMI 4.0 x8 LINK (15.75 GB/s)
            </text>
          </g>

          {/* 3. LÍNEAS DIRECTAS PCIE: CPU ↔ RANURA GRÁFICA PEG */}
          <g className={`transition-opacity duration-300 ${activeComponent === 'pcie' || activeComponent === 'cpu' ? 'opacity-100' : 'opacity-70'}`}>
            <path
              d="M 330 320 L 330 390 L 220 390 L 220 420"
              fill="none"
              stroke={isPcieSaturated ? '#ef4444' : activeComponent === 'pcie' ? '#facc15' : '#06b6d4'}
              strokeWidth={activeComponent === 'pcie' || isPcieSaturated ? '4' : '2.5'}
              strokeDasharray={isPcieSaturated ? '4,2' : busSimulationActive ? '7,4' : 'none'}
              className={busSimulationActive ? 'evo-trace-animated' : undefined}
              filter={activeComponent === 'pcie' ? 'url(#glowGold)' : undefined}
            />
            <path
              d="M 350 320 L 350 395 L 240 395 L 240 420"
              fill="none"
              stroke={isPcieSaturated ? '#ef4444' : activeComponent === 'pcie' ? '#facc15' : '#06b6d4'}
              strokeWidth={activeComponent === 'pcie' || isPcieSaturated ? '3.5' : '2'}
              strokeDasharray={isPcieSaturated ? '4,2' : busSimulationActive ? '7,4' : 'none'}
              className={busSimulationActive ? 'evo-trace-animated' : undefined}
              filter={activeComponent === 'pcie' ? 'url(#glowGold)' : undefined}
            />
            {pcieLanes === 'x16' && !isBifurcated && (
              <path
                d="M 370 320 L 370 400 L 260 400 L 260 420"
                fill="none"
                stroke={activeComponent === 'pcie' ? '#facc15' : '#06b6d4'}
                strokeWidth={activeComponent === 'pcie' ? '3.5' : '2'}
                strokeDasharray={busSimulationActive ? '7,4' : 'none'}
                className={busSimulationActive ? 'evo-trace-animated' : undefined}
                filter={activeComponent === 'pcie' ? 'url(#glowGold)' : undefined}
              />
            )}
            {isBifurcated && (
              <path
                d="M 370 320 L 370 345 L 340 345 L 340 355"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeDasharray="3,3"
                className="animate-pulse"
              />
            )}
          </g>

          {/* 4. RIELES DE POTENCIA VRM → SOCKET CPU */}
          <g className={`transition-opacity duration-300 ${activeComponent === 'vrm' || activeOverlay === 'power' ? 'opacity-100' : 'opacity-50'}`}>
            <path d="M 230 140 L 290 140" fill="none" stroke={activeComponent === 'vrm' ? '#eab308' : '#10b981'} strokeWidth="5" strokeLinecap="round" className={busSimulationActive ? 'evo-vrm-active' : undefined} />
            <path d="M 230 200 L 290 200" fill="none" stroke={activeComponent === 'vrm' ? '#eab308' : '#10b981'} strokeWidth="5" strokeLinecap="round" className={busSimulationActive ? 'evo-vrm-active' : undefined} />
            <path d="M 230 260 L 290 260" fill="none" stroke={activeComponent === 'vrm' ? '#eab308' : '#10b981'} strokeWidth="5" strokeLinecap="round" className={busSimulationActive ? 'evo-vrm-active' : undefined} />
            <path d="M 350 80 L 350 140" fill="none" stroke={activeComponent === 'vrm' ? '#eab308' : '#10b981'} strokeWidth="5" strokeLinecap="round" className={busSimulationActive ? 'evo-vrm-active' : undefined} />
            <text x="210" y="95" fill={activeComponent === 'vrm' ? '#fde047' : '#34d399'} fontSize="8" fontWeight="bold">
              VCORE POWER PLANES
            </text>
          </g>

          {/* 5. CPU A SLOT M.2 NVME PRIMARIO */}
          <path
            d="M 350 320 L 350 350 L 500 350 L 500 370"
            fill="none"
            stroke={activeComponent === 'm2' ? '#facc15' : '#38bdf8'}
            strokeWidth={activeComponent === 'm2' ? '3.5' : '2'}
            strokeDasharray={busSimulationActive ? '5,3' : 'none'}
            className={busSimulationActive ? 'evo-trace-animated' : undefined}
          />

          {/* ======================================================================= */}
          {/* COMPONENTE INTERACTIVO 1: CPU (SOCKET & RING BUS)                       */}
          {/* ======================================================================= */}
          <g
            onClick={() => handleSelectComponent('cpu')}
            onMouseEnter={() => setHoveredPart('cpu')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            {/* Soporte de retención exterior */}
            <rect
              x="280"
              y="130"
              width="170"
              height="170"
              rx="8"
              fill="url(#cpuGrad)"
              stroke={activeComponent === 'cpu' ? '#facc15' : hoveredPart === 'cpu' ? '#eab308' : '#4b5563'}
              strokeWidth={activeComponent === 'cpu' ? '3.5' : '2'}
              filter={activeComponent === 'cpu' ? 'url(#glowGold)' : undefined}
              className="transition-all duration-200"
            />

            {/* Die de Silicio Central */}
            <rect
              x="315"
              y="165"
              width="100"
              height="100"
              rx="4"
              fill={activeOverlay === 'thermal' ? thermalProfile.dieColor : '#0c0f17'}
              stroke={activeComponent === 'cpu' ? '#fde047' : activeOverlay === 'thermal' ? thermalProfile.dieGlow : '#eab308'}
              strokeWidth={activeComponent === 'cpu' ? '2.5' : '1.5'}
            />

            {/* Simulación visual de Ring Bus concéntrico en el interior del Die */}
            <circle
              cx="365"
              cy="215"
              r="34"
              fill="none"
              stroke={activeComponent === 'cpu' ? '#facc15' : '#eab308'}
              strokeWidth="2"
              strokeDasharray={busSimulationActive ? '5,3' : 'none'}
              className={busSimulationActive ? 'evo-ring-active' : undefined}
            />
            <circle cx="365" cy="215" r="18" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />

            {/* Microcondensadores de desacoplo */}
            <circle cx="330" cy="180" r="3.5" fill="#94a3b8" />
            <circle cx="400" cy="180" r="3.5" fill="#94a3b8" />
            <circle cx="330" cy="250" r="3.5" fill="#94a3b8" />
            <circle cx="400" cy="250" r="3.5" fill="#94a3b8" />

            <text x="338" y="212" fill="#fef08a" fontSize="10" fontWeight="bold">
              SOCKET
            </text>
            <text x="330" y="226" fill="#ffffff" fontSize="9" fontWeight="bold">
              RING BUS
            </text>
            <text x="325" y="292" fill={activeComponent === 'cpu' ? '#facc15' : '#94a3b8'} fontSize="8" fontWeight="bold">
              {activeOverlay === 'thermal' ? `DIE: ${thermalProfile.cpuTemp}°C` : 'CPU & DIE L3'}
            </text>

            {/* Baliza indicadora de selección */}
            {activeComponent === 'cpu' && (
              <circle cx="435" cy="145" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* ======================================================================= */}
          {/* COMPONENTE INTERACTIVO 2: MEMORIA RAM (SUB-SISTEMA DDR & IMC)           */}
          {/* ======================================================================= */}
          <g
            onClick={() => handleSelectComponent('ram')}
            onMouseEnter={() => setHoveredPart('ram')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            {[
              { id: 'A1', x: 610, active: false, label: 'SLOT 1 (A1)' },
              { id: 'A2', x: 635, active: true, label: 'SLOT 2 (A2) ✓' },
              { id: 'B1', x: 660, active: false, label: 'SLOT 3 (B1)' },
              { id: 'B2', x: 685, active: true, label: 'SLOT 4 (B2) ✓' },
            ].map((slot) => (
              <g key={slot.id}>
                <rect
                  x={slot.x}
                  y="70"
                  width="16"
                  height="250"
                  rx="3"
                  fill={slot.active ? (activeOverlay === 'thermal' ? '#ea580c' : '#1e2538') : '#0f121a'}
                  stroke={
                    activeComponent === 'ram'
                      ? '#facc15'
                      : hoveredPart === 'ram'
                      ? '#eab308'
                      : slot.active
                      ? '#3b82f6'
                      : '#27272a'
                  }
                  strokeWidth={activeComponent === 'ram' && slot.active ? '2.5' : '1.5'}
                  filter={activeComponent === 'ram' && slot.active ? 'url(#glowGold)' : undefined}
                />
                <text
                  x={slot.x + 11}
                  y="180"
                  fill={slot.active ? '#93c5fd' : '#52525b'}
                  fontSize="8"
                  fontWeight="bold"
                  transform={`rotate(90, ${slot.x + 11}, 180)`}
                >
                  {slot.label}
                </text>
              </g>
            ))}
            <text x="610" y="55" fill={activeComponent === 'ram' ? '#fde047' : '#facc15'} fontSize="10" fontWeight="bold">
              DDR5 CHANNELS (IMC)
            </text>
            {activeComponent === 'ram' && (
              <circle cx="705" cy="65" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* ======================================================================= */}
          {/* COMPONENTE INTERACTIVO 3: VRM (MÓDULO DE REGULACIÓN DE VOLTAJE)         */}
          {/* ======================================================================= */}
          <g
            onClick={() => handleSelectComponent('vrm')}
            onMouseEnter={() => setHoveredPart('vrm')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            {/* Disipador Superior */}
            <rect
              x="280"
              y="45"
              width="180"
              height="45"
              rx="4"
              fill={activeOverlay === 'thermal' ? thermalProfile.vrmColor : 'url(#vrmGrad)'}
              stroke={activeComponent === 'vrm' ? '#facc15' : hoveredPart === 'vrm' ? '#eab308' : '#3b4252'}
              strokeWidth={activeComponent === 'vrm' ? '3' : '2'}
              filter={activeComponent === 'vrm' ? 'url(#glowGold)' : undefined}
            />
            {/* Disipador Lateral */}
            <rect
              x="160"
              y="100"
              width="65"
              height="200"
              rx="4"
              fill={activeOverlay === 'thermal' ? thermalProfile.vrmColor : 'url(#vrmGrad)'}
              stroke={activeComponent === 'vrm' ? '#facc15' : hoveredPart === 'vrm' ? '#eab308' : '#3b4252'}
              strokeWidth={activeComponent === 'vrm' ? '3' : '2'}
              filter={activeComponent === 'vrm' ? 'url(#glowGold)' : undefined}
            />
            <text x="175" y="190" fill="#e2e8f0" fontSize="10" fontWeight="bold" transform="rotate(90, 175, 190)">
              {activeOverlay === 'thermal' ? `VRM: ${thermalProfile.vrmTemp}°C` : 'VRM POWER STAGES'}
            </text>
            <text x="310" y="72" fill="#cbd5e1" fontSize="10" fontWeight="bold">
              {activeOverlay === 'thermal' ? `16+2+1 PHASES (${thermalProfile.vrmTemp}°C)` : '16+2+1 DIGITAL PHASES'}
            </text>
            {activeComponent === 'vrm' && (
              <circle cx="450" cy="50" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* ======================================================================= */}
          {/* COMPONENTE INTERACTIVO 4: PCH (PLATFORM CONTROLLER HUB / CHIPSET)       */}
          {/* ======================================================================= */}
          <g
            onClick={() => handleSelectComponent('pch')}
            onMouseEnter={() => setHoveredPart('pch')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            <rect
              x="620"
              y="430"
              width="140"
              height="120"
              rx="8"
              fill={activeOverlay === 'thermal' ? '#b45309' : '#1a202c'}
              stroke={activeComponent === 'pch' ? '#facc15' : hoveredPart === 'pch' ? '#eab308' : '#475569'}
              strokeWidth={activeComponent === 'pch' ? '3.5' : '2'}
              filter={activeComponent === 'pch' ? 'url(#glowGold)' : undefined}
              className="transition-all duration-200"
            />
            <text x="645" y="480" fill={activeComponent === 'pch' ? '#fde047' : '#f8fafc'} fontSize="11" fontWeight="bold">
              CHIPSET PCH
            </text>
            <text x="645" y="500" fill="#94a3b8" fontSize="9">
              DMI 4.0 x8 LINK
            </text>
            <text x="645" y="520" fill="#64748b" fontSize="8">
              I/O, SATA & USB HOST
            </text>
            <circle cx="730" cy="455" r="4" fill="#eab308" />
            {activeComponent === 'pch' && (
              <circle cx="745" cy="445" r="4.5" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* ======================================================================= */}
          {/* COMPONENTE INTERACTIVO 5: BUS PCIE (LÍNEAS DIRECTAS)                    */}
          {/* ======================================================================= */}
          <g
            onClick={() => handleSelectComponent('pcie')}
            onMouseEnter={() => setHoveredPart('pcie')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            <rect
              x="180"
              y="410"
              width="340"
              height="30"
              rx="4"
              fill={
                isPcieSaturated
                  ? '#dc2626'
                  : activeOverlay === 'thermal'
                  ? '#b45309'
                  : '#182030'
              }
              stroke={
                activeComponent === 'pcie'
                  ? '#facc15'
                  : isPcieSaturated
                  ? '#f87171'
                  : hoveredPart === 'pcie'
                  ? '#eab308'
                  : '#eab308'
              }
              strokeWidth={activeComponent === 'pcie' ? '3.5' : isPcieSaturated ? '3' : '2'}
              filter={activeComponent === 'pcie' ? 'url(#glowGold)' : undefined}
            />
            <text x="200" y="430" fill={isPcieSaturated ? '#ffffff' : activeComponent === 'pcie' ? '#fde047' : '#facc15'} fontSize="10" fontWeight="bold">
              {isPcieSaturated
                ? `⚠️ PCIe ${pcieGen.replace('Gen ', '')}.0 ${pcieLanes} // ¡SATURADO POR BIFURCACIÓN M.2!`
                : `PCIe ${pcieGen.replace('Gen ', '')}.0 ${pcieLanes} SAFE-SLOT DIRECTO (REBAR ACTIVO)`}
            </text>

            {/* Baliza de saturación o selección */}
            {isPcieSaturated ? (
              <circle cx="505" cy="425" r="6" fill="#ef4444" className="animate-ping" />
            ) : activeComponent === 'pcie' ? (
              <circle cx="505" cy="425" r="4.5" fill="#facc15" className="animate-ping" />
            ) : null}
          </g>

          {/* Ranura Secundaria PCIe (vía Chipset PCH) */}
          <g className="opacity-60">
            <rect x="180" y="500" width="340" height="24" rx="4" fill="#10141d" stroke="#334155" strokeWidth="1.5" />
            <text x="200" y="516" fill="#64748b" fontSize="9">
              PCIe 4.0 x4 (VÍA CHIPSET PCH / LATENCIA INDIRECTA)
            </text>
          </g>

          {/* Ranura M.2 NVMe Primaria con Heatsink */}
          <g
            onClick={() => handleSelectComponent('m2')}
            onMouseEnter={() => setHoveredPart('m2')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            <rect
              x="260"
              y="340"
              width="240"
              height="35"
              rx="4"
              fill={activeOverlay === 'thermal' ? '#c2410c' : '#181e2b'}
              stroke={activeComponent === 'm2' ? '#facc15' : hoveredPart === 'm2' ? '#eab308' : '#334155'}
              strokeWidth={activeComponent === 'm2' ? '3' : '2'}
              filter={activeComponent === 'm2' ? 'url(#glowGold)' : undefined}
            />
            <text x="280" y="362" fill={activeComponent === 'm2' ? '#fde047' : '#38bdf8'} fontSize="10" fontWeight="bold">
              M.2 NVMe Gen4/5 DEDICADO (HEATSINK 42°C)
            </text>
            {activeComponent === 'm2' && (
              <circle cx="485" cy="358" r="4" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* Panel Trasero I/O & Aislamiento de Audio */}
          <g
            onClick={() => handleSelectComponent('io')}
            onMouseEnter={() => setHoveredPart('io')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer group"
          >
            <rect
              x="60"
              y="40"
              width="80"
              height="300"
              rx="8"
              fill="#131722"
              stroke={activeComponent === 'io' ? '#facc15' : hoveredPart === 'io' ? '#eab308' : '#2d3748'}
              strokeWidth={activeComponent === 'io' ? '3' : '2'}
              filter={activeComponent === 'io' ? 'url(#glowGold)' : undefined}
            />
            <text x="75" y="70" fill="#94a3b8" fontSize="10" fontWeight="bold" transform="rotate(90, 75, 70)">
              REAR I/O & USB HOST CONTROLLER
            </text>
            {/* Línea de aislamiento de audio */}
            <path
              d="M 60 360 L 140 360 L 140 540 L 60 540"
              fill="#0d111a"
              stroke={activeComponent === 'io' ? '#facc15' : '#f59e0b'}
              strokeWidth={activeComponent === 'io' ? '2.5' : '1.5'}
              strokeDasharray="4,2"
            />
            <text x="70" y="450" fill={activeComponent === 'io' ? '#fde047' : '#f59e0b'} fontSize="9" fontWeight="bold">
              AUDIO DPC ISOLATION
            </text>
            {activeComponent === 'io' && (
              <circle cx="125" cy="55" r="4" fill="#facc15" className="animate-ping" />
            )}
          </g>

          {/* Conector ATX 24 Pines & Puertos SATA */}
          <g className="opacity-75">
            <rect x="775" y="110" width="35" height="180" rx="4" fill="#141824" stroke="#334155" strokeWidth="2" />
            <text x="798" y="210" fill="#10b981" fontSize="9" fontWeight="bold" transform="rotate(90, 798, 210)">
              24-PIN ATX MAIN POWER
            </text>
            <rect x="800" y="440" width="30" height="50" rx="3" fill="#111520" stroke="#334155" />
            <rect x="800" y="500" width="30" height="50" rx="3" fill="#111520" stroke="#334155" />
            <text x="840" y="475" fill="#64748b" fontSize="8">
              4x SATA 6Gb/s
            </text>
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
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
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
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/40 font-bold">
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
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
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
