import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Tv,
  HardDrive,
  Activity,
  Layers,
  Zap,
  Fan,
  Flame,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Gauge,
  Thermometer,
  ShieldAlert,
  Info,
  ChevronRight,
  Wifi,
  Server,
  Radio,
  Sliders,
  X,
  TrendingUp,
  BarChart3,
  Minimize2,
  Maximize2,
  ShieldCheck,
  Disc,
  ArrowUpRight,
  Play,
  RotateCw,
  Maximize,
  Compass,
} from 'lucide-react';
import { Machine, EpistemicProvenance } from '../types';
import { DigitalTwinFrame, BusState } from '../services/digitalTwin/types';
import { EvoMachineIntegrityModal } from './EvoMachineIntegrityModal';

export type SubsystemIdentifier =
  | 'CPU'
  | 'RAM'
  | 'GPU'
  | 'VRAM'
  | 'STORAGE'
  | 'CHIPSET'
  | 'PSU'
  | 'COOLING'
  | 'NETWORK'
  | 'BUS';

export type SubsystemOperationalState =
  | 'IDLE'
  | 'NORMAL'
  | 'HIGH_LOAD'
  | 'LIMITING'
  | 'SATURATED'
  | 'FAULT'
  | 'UNKNOWN';

export interface EvoLiveMachineBusDiagramProps {
  machine: Machine;
  isPoweredOn?: boolean;
  onTogglePower?: () => void;
  workloadState?: 'IDLE' | 'GAMING' | 'STRESS_TEST' | 'BENCHMARK';
  frame?: DigitalTwinFrame | null;
  selectedComponent?: SubsystemIdentifier;
  onSelectComponent?: (subsystem: SubsystemIdentifier) => void;
  highlightedSubsystem?: string | null;
  framesHistory?: DigitalTwinFrame[];
  showSideInspector?: boolean;
}

export const EvoLiveMachineBusDiagram: React.FC<EvoLiveMachineBusDiagramProps> = ({
  machine,
  isPoweredOn = true,
  onTogglePower,
  workloadState = 'IDLE',
  frame,
  selectedComponent: externalSelectedComponent,
  onSelectComponent,
  highlightedSubsystem,
  framesHistory = [],
  showSideInspector = true,
}) => {
  const [internalSelected, setInternalSelected] = useState<SubsystemIdentifier>('CPU');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isFullScreenBoard, setIsFullScreenBoard] = useState<boolean>(false);
  const [showIntegrityModal, setShowIntegrityModal] = useState<boolean>(false);

  const activeSubsystem = externalSelectedComponent || internalSelected;

  const handleSelect = (sub: SubsystemIdentifier) => {
    setInternalSelected(sub);
    setIsInspectorOpen(true);
    if (onSelectComponent) {
      onSelectComponent(sub);
    }
  };

  // --------------------------------------------------------------------------
  // HARDWARE ARCHITECTURE FLAGS (Machine fidelity enforcement)
  // --------------------------------------------------------------------------
  const hasDedicatedGpu = Boolean(machine.gpu && machine.gpu.isDedicated && machine.gpu.model !== 'UNKNOWN');
  const hasDedicatedVram = hasDedicatedGpu && (machine.gpu.vramGb ?? 0) > 0 && machine.gpu.provenance !== 'UNKNOWN';
  const isNvmeStorage = machine.storage.type.toLowerCase().includes('nvme') || machine.storage.type.toLowerCase().includes('m.2');
  const isDualChannel = machine.ram.channels === 2;

  // --------------------------------------------------------------------------
  // SUBSYSTEM STATUS DERIVATIONS
  // --------------------------------------------------------------------------
  const getSubsystemState = (sub: SubsystemIdentifier): SubsystemOperationalState => {
    if (!isPoweredOn) return 'IDLE';

    if (frame) {
      if (sub === 'CPU') {
        if (frame.cpu.isThrottling || frame.cpu.status === 'FAULT') return 'FAULT';
        if (frame.cpu.isThermalLimiting || frame.cpu.status === 'LIMITING') return 'LIMITING';
        if (frame.cpu.loadPct >= 90) return 'SATURATED';
        if (frame.cpu.loadPct >= 65) return 'HIGH_LOAD';
        return frame.cpu.loadPct >= 10 ? 'NORMAL' : 'IDLE';
      }
      if (sub === 'GPU') {
        if (frame.gpu.isThrottling || frame.gpu.status === 'FAULT') return 'FAULT';
        if (frame.gpu.isThermalLimiting || frame.gpu.status === 'LIMITING') return 'LIMITING';
        if (frame.gpu.loadPct >= 95) return 'SATURATED';
        if (frame.gpu.loadPct >= 70) return 'HIGH_LOAD';
        return frame.gpu.loadPct >= 10 ? 'NORMAL' : 'IDLE';
      }
      if (sub === 'VRAM') {
        if (!hasDedicatedVram) return 'NORMAL';
        if (frame.gpu.vramPressurePct >= 96) return 'SATURATED';
        if (frame.gpu.vramPressurePct >= 88) return 'LIMITING';
        if (frame.gpu.vramPressurePct >= 75) return 'HIGH_LOAD';
        return 'NORMAL';
      }
      if (sub === 'RAM') {
        if (frame.ram.status === 'SATURATED') return 'SATURATED';
        if (frame.ram.status === 'LIMITING' || frame.ram.pressurePct >= 92) return 'LIMITING';
        if (frame.ram.pressurePct >= 75 || frame.ram.bandwidthUsagePct >= 75) return 'HIGH_LOAD';
        return 'NORMAL';
      }
      if (sub === 'STORAGE') {
        if (frame.storage.status === 'SATURATED') return 'SATURATED';
        if (frame.storage.status === 'LIMITING' || frame.storage.queuePressurePct >= 85) return 'LIMITING';
        if (frame.storage.queuePressurePct >= 60 || frame.storage.readSpeedMBps > 2000) return 'HIGH_LOAD';
        return 'NORMAL';
      }
      if (sub === 'CHIPSET') {
        if (frame.buses.cpuStorage.utilizationEstimatePct >= 85) return 'HIGH_LOAD';
        return 'NORMAL';
      }
      if (sub === 'PSU') {
        if (frame.psu.stressState === 'CRITICAL_HEADROOM') return 'FAULT';
        if (frame.psu.stressState === 'HEAVY') return 'LIMITING';
        if (frame.psu.stressState === 'MODERATE') return 'HIGH_LOAD';
        return 'NORMAL';
      }
      if (sub === 'COOLING') {
        if (frame.cooling.thermalSoakFactorPct >= 80 || frame.cooling.fanSpeedPct >= 90) return 'HIGH_LOAD';
        return 'NORMAL';
      }
      if (sub === 'NETWORK') {
        if (frame.buses.chipsetNetwork.utilizationEstimatePct >= 80) return 'HIGH_LOAD';
        return 'NORMAL';
      }
      if (sub === 'BUS') {
        if (
          frame.buses.cpuRam.utilizationEstimatePct >= 85 ||
          frame.buses.cpuGpu.utilizationEstimatePct >= 85
        )
          return 'HIGH_LOAD';
        return 'NORMAL';
      }
    }

    switch (workloadState) {
      case 'GAMING':
        if (sub === 'GPU' || sub === 'VRAM') return hasDedicatedGpu ? 'HIGH_LOAD' : 'LIMITING';
        if (sub === 'RAM') return 'HIGH_LOAD';
        return 'NORMAL';
      case 'STRESS_TEST':
        return sub === 'CPU' || sub === 'GPU' ? 'SATURATED' : 'HIGH_LOAD';
      case 'BENCHMARK':
        return sub === 'CPU' ? 'HIGH_LOAD' : 'NORMAL';
      default:
        return 'IDLE';
    }
  };

  // --------------------------------------------------------------------------
  // FLOW STYLING & ANIMATION DYNAMICS DERIVATION
  // --------------------------------------------------------------------------
  const getBusFlowStyles = (
    utilizationPct: number,
    limitingKind: 'NONE' | 'LIMITING' | 'FAULT' = 'NONE'
  ) => {
    if (!isPoweredOn || utilizationPct < 5) {
      return {
        color: '#3f3f46',
        dashArray: '3 6',
        animationDuration: '14s',
        glow: 'none',
        opacity: 0.35,
        flowState: 'IDLE',
      };
    }

    if (limitingKind === 'FAULT' || utilizationPct >= 95) {
      return {
        color: '#f43f5e', // Crimson Throttling
        dashArray: '6 4',
        animationDuration: '0.45s',
        glow: '0 0 16px rgba(244,63,94,0.95)',
        opacity: 1,
        flowState: 'THROTTLING',
      };
    }

    if (limitingKind === 'LIMITING' || utilizationPct >= 85) {
      return {
        color: '#f59e0b', // Amber Limiting
        dashArray: '8 5',
        animationDuration: '0.8s',
        glow: '0 0 12px rgba(245,158,11,0.9)',
        opacity: 1,
        flowState: 'LIMITING',
      };
    }

    if (utilizationPct >= 65) {
      return {
        color: '#eab308', // Cyber Yellow Heavy Load
        dashArray: '8 5',
        animationDuration: '1.2s',
        glow: '0 0 10px rgba(234,179,8,0.8)',
        opacity: 0.95,
        flowState: 'HIGH_LOAD',
      };
    }

    if (utilizationPct >= 25) {
      return {
        color: '#06b6d4', // Cyan Active Normal
        dashArray: '8 6',
        animationDuration: '2.5s',
        glow: '0 0 8px rgba(6,182,212,0.7)',
        opacity: 0.85,
        flowState: 'NORMAL',
      };
    }

    return {
      color: '#10b981', // Emerald Quiet/Smooth
      dashArray: '5 7',
      animationDuration: '5.0s',
      glow: '0 0 6px rgba(16,185,129,0.5)',
      opacity: 0.65,
      flowState: 'SMOOTH',
    };
  };

  const cpuState = getSubsystemState('CPU');
  const ramState = getSubsystemState('RAM');
  const gpuState = getSubsystemState('GPU');
  const vramState = getSubsystemState('VRAM');
  const storageState = getSubsystemState('STORAGE');
  const chipsetState = getSubsystemState('CHIPSET');
  const psuState = getSubsystemState('PSU');
  const coolingState = getSubsystemState('COOLING');
  const networkState = getSubsystemState('NETWORK');

  // Bus Utilizations
  const cpuRamUtil = frame?.buses.cpuRam.utilizationEstimatePct ?? (workloadState === 'GAMING' ? 68 : 20);
  const cpuGpuUtil = frame?.buses.cpuGpu.utilizationEstimatePct ?? (workloadState === 'GAMING' ? 82 : 15);
  const gpuVramUtil = frame?.buses.gpuVram.utilizationEstimatePct ?? (workloadState === 'GAMING' ? 89 : 10);
  const cpuStorageUtil = frame?.buses.cpuStorage.utilizationEstimatePct ?? (workloadState === 'GAMING' ? 35 : 5);
  const networkUtil = frame?.buses.chipsetNetwork.utilizationEstimatePct ?? (workloadState === 'GAMING' ? 25 : 5);
  const psuLoadUtil = frame ? Math.round((frame.psu.estimatedLoadW / Math.max(1, frame.psu.ratedWattageW)) * 100) : 40;
  const coolingLoadUtil = frame ? frame.cooling.fanSpeedPct : 50;
  const cpuPchUtil = frame?.buses.cpuStorage.utilizationEstimatePct ?? (workloadState === 'GAMING' ? 45 : 15);

  const cpuRamFlow = getBusFlowStyles(cpuRamUtil, ramState === 'FAULT' ? 'FAULT' : ramState === 'LIMITING' ? 'LIMITING' : 'NONE');
  const cpuGpuFlow = getBusFlowStyles(cpuGpuUtil, gpuState === 'FAULT' ? 'FAULT' : gpuState === 'LIMITING' ? 'LIMITING' : 'NONE');
  const gpuVramFlow = getBusFlowStyles(gpuVramUtil, vramState === 'LIMITING' || vramState === 'SATURATED' ? 'LIMITING' : 'NONE');
  const cpuStorageFlow = getBusFlowStyles(cpuStorageUtil, storageState === 'LIMITING' ? 'LIMITING' : 'NONE');
  const cpuPchFlow = getBusFlowStyles(cpuPchUtil, chipsetState === 'FAULT' ? 'FAULT' : chipsetState === 'LIMITING' ? 'LIMITING' : 'NONE');
  const networkFlow = getBusFlowStyles(networkUtil);
  const psuFlow = getBusFlowStyles(psuLoadUtil, psuState === 'FAULT' ? 'FAULT' : psuState === 'LIMITING' ? 'LIMITING' : 'NONE');
  const coolingFlow = getBusFlowStyles(coolingLoadUtil, cpuState === 'FAULT' || gpuState === 'FAULT' ? 'FAULT' : 'NONE');

  // Load-reactive pulse animation speeds (in seconds)
  // Higher load -> shorter period -> faster pulses traveling along SVG paths
  const ramPulseDur = useMemo(() => {
    if (!isPoweredOn) return '15s';
    const sec = Math.max(0.32, 3.2 - (cpuRamUtil / 100) * 2.85);
    return `${sec.toFixed(2)}s`;
  }, [isPoweredOn, cpuRamUtil]);

  const gpuPulseDur = useMemo(() => {
    if (!isPoweredOn) return '15s';
    const sec = Math.max(0.25, 3.0 - (cpuGpuUtil / 100) * 2.7);
    return `${sec.toFixed(2)}s`;
  }, [isPoweredOn, cpuGpuUtil]);

  const pchPulseDur = useMemo(() => {
    if (!isPoweredOn) return '15s';
    const sec = Math.max(0.38, 3.5 - (cpuPchUtil / 100) * 3.05);
    return `${sec.toFixed(2)}s`;
  }, [isPoweredOn, cpuPchUtil]);

  const vramPulseDur = useMemo(() => {
    if (!isPoweredOn) return '15s';
    const sec = Math.max(0.22, 2.5 - (gpuVramUtil / 100) * 2.25);
    return `${sec.toFixed(2)}s`;
  }, [isPoweredOn, gpuVramUtil]);

  const storagePulseDur = useMemo(() => {
    if (!isPoweredOn) return '15s';
    const sec = Math.max(0.35, 3.2 - (cpuStorageUtil / 100) * 2.75);
    return `${sec.toFixed(2)}s`;
  }, [isPoweredOn, cpuStorageUtil]);

  const networkPulseDur = useMemo(() => {
    if (!isPoweredOn) return '15s';
    const sec = Math.max(0.4, 3.5 - (networkUtil / 100) * 2.95);
    return `${sec.toFixed(2)}s`;
  }, [isPoweredOn, networkUtil]);

  const psuPulseDur = useMemo(() => {
    if (!isPoweredOn) return '15s';
    const sec = Math.max(0.45, 3.5 - (psuLoadUtil / 100) * 2.9);
    return `${sec.toFixed(2)}s`;
  }, [isPoweredOn, psuLoadUtil]);

  const coolingPulseDur = useMemo(() => {
    if (!isPoweredOn) return '15s';
    const sec = Math.max(0.4, 3.2 - (coolingLoadUtil / 100) * 2.65);
    return `${sec.toFixed(2)}s`;
  }, [isPoweredOn, coolingLoadUtil]);

  // Component Live Temperatures (°C)
  const cpuTemp = frame?.cpu.temperatureC ?? (workloadState === 'STRESS_TEST' ? 88 : workloadState === 'GAMING' ? 76 : 45);
  const gpuTemp = frame?.gpu.temperatureC ?? (workloadState === 'STRESS_TEST' ? 82 : workloadState === 'GAMING' ? 72 : 42);
  const storageTemp = frame?.storage.temperatureC ?? (workloadState === 'STRESS_TEST' ? 68 : 41);
  const chipsetTemp = (frame as any)?.chipset?.temperatureC ?? (workloadState === 'STRESS_TEST' ? 77 : 48);
  const vrmTemp = cpuTemp > 75 ? Math.round(cpuTemp + 3) : Math.round(cpuTemp - 8);

  // Radial Thermal Ripple Hotspots (expands across PCB from components when temperature > 75°C)
  interface ThermalHotspot {
    id: string;
    label: string;
    subsystem: SubsystemIdentifier;
    cx: number;
    cy: number;
    temperatureC: number;
    maxRadius: number;
    color: string;
    glowColor: string;
  }

  const thermalHotspots = useMemo<ThermalHotspot[]>(() => {
    if (!isPoweredOn) return [];
    const spots: ThermalHotspot[] = [];

    const getThermalVisuals = (temp: number) => {
      if (temp >= 90) {
        return { color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.7)' }; // Critical thermal crimson
      }
      if (temp >= 82) {
        return { color: '#f97316', glowColor: 'rgba(249, 115, 22, 0.65)' }; // Radiant thermal orange
      }
      return { color: '#fb923c', glowColor: 'rgba(251, 146, 60, 0.55)' }; // Amber-orange warning
    };

    if (cpuTemp > 75) {
      const visuals = getThermalVisuals(cpuTemp);
      spots.push({
        id: 'cpu',
        label: 'CPU DIE',
        subsystem: 'CPU',
        cx: 400,
        cy: 200,
        temperatureC: cpuTemp,
        maxRadius: Math.min(185, 95 + (cpuTemp - 75) * 4.5),
        ...visuals,
      });
    }

    if (gpuTemp > 75) {
      const visuals = getThermalVisuals(gpuTemp);
      spots.push({
        id: 'gpu',
        label: hasDedicatedGpu ? 'GPU DIE' : 'iGPU DIE',
        subsystem: 'GPU',
        cx: hasDedicatedGpu ? 327 : 400,
        cy: hasDedicatedGpu ? 515 : 250,
        temperatureC: gpuTemp,
        maxRadius: Math.min(170, 90 + (gpuTemp - 75) * 4),
        ...visuals,
      });
    }

    if (vrmTemp > 75) {
      const visuals = getThermalVisuals(vrmTemp);
      spots.push({
        id: 'vrm',
        label: 'VRM MOSFETS',
        subsystem: 'PSU',
        cx: 275,
        cy: 52,
        temperatureC: vrmTemp,
        maxRadius: 85,
        ...visuals,
      });
    }

    if (storageTemp > 75) {
      const visuals = getThermalVisuals(storageTemp);
      spots.push({
        id: 'storage',
        label: 'NVMe SSD',
        subsystem: 'STORAGE',
        cx: 620,
        cy: 367,
        temperatureC: storageTemp,
        maxRadius: 105,
        ...visuals,
      });
    }

    if (chipsetTemp > 75) {
      const visuals = getThermalVisuals(chipsetTemp);
      spots.push({
        id: 'chipset',
        label: 'PCH CHIPSET',
        subsystem: 'CHIPSET',
        cx: 790,
        cy: 530,
        temperatureC: chipsetTemp,
        maxRadius: 110,
        ...visuals,
      });
    }

    return spots;
  }, [isPoweredOn, cpuTemp, gpuTemp, vrmTemp, storageTemp, chipsetTemp, hasDedicatedGpu]);

  const isHighlighted = (sub: string) => {
    if (!highlightedSubsystem) return false;
    const normalized = highlightedSubsystem.toLowerCase();
    const target = sub.toLowerCase();
    return normalized === target || (target === 'vram' && normalized === 'gpu');
  };

  const getBadgePill = (state: SubsystemOperationalState) => {
    switch (state) {
      case 'NORMAL':
        return <span className="px-1.5 py-0.2 rounded text-[7.5px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">NORMAL</span>;
      case 'HIGH_LOAD':
        return <span className="px-1.5 py-0.2 rounded text-[7.5px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">CARGA ALTA</span>;
      case 'LIMITING':
        return <span className="px-1.5 py-0.2 rounded text-[7.5px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse">LIMITANDO</span>;
      case 'SATURATED':
        return <span className="px-1.5 py-0.2 rounded text-[7.5px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">SATURADO</span>;
      case 'FAULT':
        return <span className="px-1.5 py-0.2 rounded text-[7.5px] font-black bg-red-600/30 text-red-300 border border-red-500 animate-ping">THROTTLING</span>;
      case 'IDLE':
      default:
        return <span className="px-1.5 py-0.2 rounded text-[7.5px] font-bold bg-zinc-800/80 text-zinc-400 border border-zinc-700">REPOSO</span>;
    }
  };

  // --------------------------------------------------------------------------
  // HISTORICAL SPARKLINE GENERATOR (SVG MINI CHART)
  // --------------------------------------------------------------------------
  const renderSparkline = (
    dataExtractor: (f: DigitalTwinFrame) => number,
    color: string = '#06b6d4',
    maxVal: number = 100
  ) => {
    if (!framesHistory || framesHistory.length < 2) {
      return (
        <div className="h-14 w-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
          Recopilando telemetría...
        </div>
      );
    }

    const points = framesHistory.slice(-30);
    const width = 240;
    const height = 48;
    const stepX = width / Math.max(1, points.length - 1);

    const coords = points.map((f, i) => {
      const val = dataExtractor(f);
      const normalizedY = height - Math.max(2, Math.min(height - 2, (val / Math.max(1, maxVal)) * height));
      return `${i * stepX},${normalizedY}`;
    });

    const pathD = `M ${coords.join(' L ')}`;
    const areaD = `M 0,${height} L ${coords.join(' L ')} L ${width},${height} Z`;

    return (
      <svg className="w-full h-14 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-[#04060b] p-4 sm:p-5 font-mono-tech relative overflow-hidden shadow-2xl space-y-4">
      {/* CSS hardware-accelerated animations for bus traces */}
      <style>{`
        @keyframes traceFlowForward {
          from { stroke-dashoffset: 80; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes traceFlowReverse {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 80; }
        }
        @keyframes boardPulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; filter: drop-shadow(0 0 6px currentColor); }
        }
        @keyframes socketFanSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes thermalHazePulse {
          0%, 100% { opacity: 0.35; transform: scale(0.97); }
          50% { opacity: 0.7; transform: scale(1.03); }
        }
        @keyframes thermalGlowBorder {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.5)); }
          50% { filter: drop-shadow(0 0 18px rgba(239, 68, 68, 0.85)); }
        }
      `}</style>

      {/* Top Header: Power Switch & Motherboard Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-3 flex-wrap">
          {onTogglePower && (
            <button
              type="button"
              onClick={onTogglePower}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                isPoweredOn
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-[0_0_16px_rgba(52,211,153,0.35)]'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isPoweredOn ? 'fill-current animate-pulse' : ''}`} />
              <span>{isPoweredOn ? 'SISTEMA ENERGIZADO' : 'INICIAR ENERGÍA'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPoweredOn ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
              }`}
            />
            <span className="font-bold text-white uppercase text-[11px] tracking-wide">
              TOPOLOGÍA DE PLACA BASE // {machine.motherboard?.model || 'Placa Base ATX'}
            </span>
          </div>

          {frame && (
            <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-2">
              <span className="text-zinc-500 font-bold">RÉGIMEN:</span>
              <span className="text-amber-400 font-black truncate max-w-[140px]">
                {frame.activeWorkloadNames[0] || workloadState}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-500 font-bold">FPS:</span>
              <span className="text-emerald-400 font-black font-mono">
                {frame.fpsEstimate.averageFps}
              </span>
            </div>
          )}

          {thermalHotspots.length > 0 && (
            <div className="px-2.5 py-1 rounded-lg bg-orange-950/70 border border-orange-500/70 text-[11px] text-orange-200 flex items-center gap-1.5 shadow-[0_0_12px_rgba(249,115,22,0.4)] animate-pulse">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span className="font-black text-orange-400">DISIPACIÓN &gt;75°C ACTIVA:</span>
              <span className="text-white font-mono font-bold">
                {thermalHotspots.map((h) => `${h.label} ${h.temperatureC}°C`).join(' • ')}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <button
            type="button"
            onClick={() => setShowIntegrityModal(true)}
            className="p-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] px-2.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            title="Auditoría Epistémica: Hardware Real vs Machine Activa"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">Auditoría de Integridad</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreenBoard(!isFullScreenBoard)}
            className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all cursor-pointer flex items-center gap-1 text-[11px] px-2.5"
            title="Alternar vista panorámica de la motherboard"
          >
            <Maximize className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFullScreenBoard ? 'Modo Normal' : 'Placa Completa'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all cursor-pointer flex items-center gap-1 text-[11px] px-2.5"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isInspectorOpen ? 'Ocultar Inspector' : 'Ver Inspector'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Motherboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* =================================================================== */}
        {/* TRUE MOTHERBOARD PCB CANVAS (Occupies majority of the screen) */}
        {/* =================================================================== */}
        <div
          className={`${
            isFullScreenBoard || !isInspectorOpen ? 'lg:col-span-12' : 'lg:col-span-8'
          } transition-all duration-300 rounded-2xl border border-blue-900/40 bg-[#060911] p-3 sm:p-4 relative overflow-x-auto shadow-2xl`}
        >
          {/* Silkscreen & PCB Solder Mask Details */}
          <div className="min-w-[850px] relative select-none">
            {/* SVG Interactive PCB Canvas */}
            <svg
              className="w-full h-auto drop-shadow-2xl overflow-visible"
              viewBox="0 0 1000 710"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Copper ground plane pattern */}
                <pattern id="pcb-copper-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.8" fill="#1e293b" opacity="0.6" />
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                </pattern>

                {/* Gradients */}
                <linearGradient id="heatsink-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>

                <linearGradient id="cpu-silicon-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e1e24" />
                  <stop offset="100%" stopColor="#111116" />
                </linearGradient>

                {/* Glow filters for varying load state pulses */}
                <filter id="glow-pulse-cyan" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-pulse-emerald" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-pulse-amber" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-pulse-rose" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-pulse-purple" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Radial Thermal Dissipation Haze Gradients (>75°C) */}
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
                x="10"
                y="10"
                width="980"
                height="690"
                rx="18"
                fill="#070a12"
                stroke="#1e3a8a"
                strokeWidth="2.5"
                opacity="0.95"
              />
              <rect
                x="15"
                y="15"
                width="970"
                height="680"
                rx="14"
                fill="url(#pcb-copper-grid)"
                opacity="0.75"
              />

              {/* ATX Mounting Standoff Screws */}
              {[
                [40, 40], [500, 40], [955, 40],
                [40, 355], [500, 355], [955, 355],
                [40, 665], [500, 665], [955, 665],
              ].map(([sx, sy], i) => (
                <g key={`screw-${i}`}>
                  <circle cx={sx} cy={sy} r="9" fill="#18181b" stroke="#e4e4e7" strokeWidth="1.5" />
                  <circle cx={sx} cy={sy} r="4" fill="#3f3f46" />
                  <line x1={sx - 3} y1={sy} x2={sx + 3} y2={sy} stroke="#e4e4e7" strokeWidth="1.5" />
                  <line x1={sx} y1={sy - 3} x2={sx} y2={sy + 3} stroke="#e4e4e7" strokeWidth="1.5" />
                </g>
              ))}

              {/* PCB Silkscreen Markings */}
              <text x="35" y="692" fill="#334155" fontSize="9" fontWeight="900" fontFamily="monospace">
                EVO ATX FORM FACTOR // ULTRA DURABLE PCB LAYER // DESIGNED FOR DIGITAL TWIN REAL-TIME BUS TELEMETRY
              </text>
              <text x="740" y="692" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                SOCKET: {machine.cpu.socket} • CHIPSET: {machine.motherboard?.chipset || 'INTEL/AMD ATX'}
              </text>

              {/* Rear I/O Backplate (Left Edge) */}
              <rect x="12" y="60" width="30" height="420" fill="#0f172a" stroke="#334155" strokeWidth="1.5" rx="3" />
              <text x="18" y="270" fill="#64748b" fontSize="8" fontWeight="bold" transform="rotate(-90 18 270)" letterSpacing="2">
                REAR I/O SHIELD (DP • HDMI • USB 3.2 • LAN • AUDIO)
              </text>

              {/* ============================================================= */}
              {/* RADIAL THERMAL RIPPLE DISSIPATION LAYER (Active when > 75°C)  */}
              {/* Expands across the PCB surface representing thermal radiation */}
              {/* ============================================================= */}
              {isPoweredOn && thermalHotspots.length > 0 && (
                <g id="pcb-thermal-dissipation-field">
                  {thermalHotspots.map((spot) => {
                    const isCritical = spot.temperatureC >= 90;
                    const gradId = isCritical ? 'thermal-field-crit' : 'thermal-field-warn';
                    return (
                      <g
                        key={`thermal-ripple-${spot.id}`}
                        className="cursor-pointer"
                        onClick={() => handleSelect(spot.subsystem)}
                      >
                        {/* Thermal background radiant heat haze across PCB */}
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r={spot.maxRadius}
                          fill={`url(#${gradId})`}
                          className="pointer-events-none"
                        />

                        {/* Ripple Wave 1 (Inner expanding outward across motherboard copper) */}
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r="25"
                          fill="none"
                          stroke={spot.color}
                          strokeWidth="2.5"
                          opacity="0.8"
                          className="pointer-events-none"
                        >
                          <animate
                            attributeName="r"
                            from="25"
                            to={spot.maxRadius}
                            dur="2.4s"
                            begin="0s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.85"
                            to="0"
                            dur="2.4s"
                            begin="0s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="stroke-width"
                            from="3"
                            to="0.5"
                            dur="2.4s"
                            begin="0s"
                            repeatCount="indefinite"
                          />
                        </circle>

                        {/* Ripple Wave 2 (Middle staggered ripple) */}
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r="25"
                          fill="none"
                          stroke={spot.color}
                          strokeWidth="2.2"
                          opacity="0.75"
                          className="pointer-events-none"
                        >
                          <animate
                            attributeName="r"
                            from="25"
                            to={spot.maxRadius}
                            dur="2.4s"
                            begin="0.8s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.85"
                            to="0"
                            dur="2.4s"
                            begin="0.8s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="stroke-width"
                            from="2.8"
                            to="0.5"
                            dur="2.4s"
                            begin="0.8s"
                            repeatCount="indefinite"
                          />
                        </circle>

                        {/* Ripple Wave 3 (Outer staggered ripple) */}
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r="25"
                          fill="none"
                          stroke={spot.color}
                          strokeWidth="2"
                          opacity="0.7"
                          className="pointer-events-none"
                        >
                          <animate
                            attributeName="r"
                            from="25"
                            to={spot.maxRadius}
                            dur="2.4s"
                            begin="1.6s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.85"
                            to="0"
                            dur="2.4s"
                            begin="1.6s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="stroke-width"
                            from="2.5"
                            to="0.5"
                            dur="2.4s"
                            begin="1.6s"
                            repeatCount="indefinite"
                          />
                        </circle>

                        {/* Isotherm dashed wavefront for PCB copper conduction */}
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r="30"
                          fill="none"
                          stroke={spot.color}
                          strokeWidth="1.5"
                          strokeDasharray="6 4"
                          opacity="0.65"
                          className="pointer-events-none"
                        >
                          <animate
                            attributeName="r"
                            from="30"
                            to={spot.maxRadius * 0.9}
                            dur="3.2s"
                            begin="0.4s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.75"
                            to="0"
                            dur="3.2s"
                            begin="0.4s"
                            repeatCount="indefinite"
                          />
                        </circle>

                        {/* Thermal Silkscreen HUD Pill on Motherboard */}
                        <g
                          transform={`translate(${spot.cx - 65}, ${
                            spot.cy - (spot.id === 'cpu' ? 112 : spot.id === 'vrm' ? 32 : 72)
                          })`}
                        >
                          <rect
                            x="0"
                            y="0"
                            width="130"
                            height="20"
                            rx="5"
                            fill="#090d16"
                            stroke={spot.color}
                            strokeWidth="1.5"
                            filter="drop-shadow(0 0 8px rgba(249,115,22,0.5))"
                          />
                          <circle cx="12" cy="10" r="4.5" fill={spot.color}>
                            <animate
                              attributeName="opacity"
                              values="1;0.3;1"
                              dur="0.9s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <text
                            x="22"
                            y="13.5"
                            fill="#ffffff"
                            fontSize="8"
                            fontWeight="900"
                            letterSpacing="0.5"
                          >
                            DISIPACIÓN {spot.temperatureC}°C (&gt;75°C)
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* ============================================================= */}
              {/* DYNAMIC BUS TRACES PRINTED DIRECTLY ON MOTHERBOARD COPPER */}
              {/* ============================================================= */}

              {/* Trace 1: CPU ↔ RAM (DDR Dual-Channel Traces) */}
              <g className="cursor-pointer" onClick={() => handleSelect('RAM')}>
                {/* Physical Copper Track Ground */}
                <path d="M 495 135 L 590 135 M 495 155 L 590 155 M 495 175 L 590 175 M 495 195 L 590 195" stroke="#1e293b" strokeWidth="4" />
                {/* Serpentine active pulse tracks */}
                <path
                  d="M 495 135 L 590 135 M 495 155 L 590 155 M 495 175 L 590 175 M 495 195 L 590 195"
                  stroke={cpuRamFlow.color}
                  strokeWidth="2.5"
                  strokeDasharray={cpuRamFlow.dashArray}
                  style={{
                    animation: `traceFlowForward ${cpuRamFlow.animationDuration} linear infinite`,
                    filter: `drop-shadow(${cpuRamFlow.glow})`,
                  }}
                />

                {/* Moving SVG pulses visualizing RAM data flow (varying speeds & colors) */}
                {isPoweredOn && (
                  <>
                    {/* Lane 0: CPU -> RAM Write Command / Address */}
                    <circle r="3.5" fill="#ffffff" stroke={cpuRamFlow.color} strokeWidth="1.5">
                      <animateMotion path="M 495 135 L 590 135" dur={ramPulseDur} repeatCount="indefinite" />
                    </circle>
                    <circle r="2.2" fill={cpuRamFlow.color} opacity="0.8">
                      <animateMotion path="M 495 135 L 590 135" dur={ramPulseDur} begin="0.25s" repeatCount="indefinite" />
                    </circle>

                    {/* Lane 1: RAM -> CPU Read Data Inbound */}
                    <circle r="3.5" fill="#ffffff" stroke={cpuRamFlow.color} strokeWidth="1.5">
                      <animateMotion path="M 590 155 L 495 155" dur={ramPulseDur} repeatCount="indefinite" />
                    </circle>
                    <circle r="2.2" fill={cpuRamFlow.color} opacity="0.8">
                      <animateMotion path="M 590 155 L 495 155" dur={ramPulseDur} begin="0.3s" repeatCount="indefinite" />
                    </circle>

                    {/* Lane 2: CPU -> RAM Write Data Stream */}
                    <circle r="3.2" fill={cpuRamFlow.color}>
                      <animateMotion path="M 495 175 L 590 175" dur={ramPulseDur} begin="0.15s" repeatCount="indefinite" />
                    </circle>

                    {/* Lane 3: RAM -> CPU High-Speed Burst */}
                    <circle r="3.2" fill="#ffffff" stroke={cpuRamFlow.color} strokeWidth="1.2">
                      <animateMotion path="M 590 195 L 495 195" dur={ramPulseDur} begin="0.45s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </g>

              {/* Trace 2: CPU ↔ GPU / iGPU */}
              <g className="cursor-pointer" onClick={() => handleSelect('GPU')}>
                {hasDedicatedGpu ? (
                  // PCIe x16 Differential Pairs connecting CPU to PCIe Slot & GPU Die
                  <>
                    {/* Base copper PCIe tracks */}
                    <path
                      d="M 350 305 L 350 420 M 370 305 L 370 420 M 390 305 L 390 420 M 410 305 L 410 420"
                      stroke="#18181b"
                      strokeWidth="4.5"
                    />
                    {/* GPU Internal Board Extension Traces to GPU Die */}
                    <path
                      d="M 350 420 L 330 470 M 390 420 L 360 470"
                      stroke="#18181b"
                      strokeWidth="3.5"
                    />

                    {/* Flowing animated PCIe highway tracks */}
                    <path
                      d="M 350 305 L 350 420 M 370 305 L 370 420 M 390 305 L 390 420 M 410 305 L 410 420 M 350 420 L 330 470 M 390 420 L 360 470"
                      stroke={cpuGpuFlow.color}
                      strokeWidth="2.5"
                      strokeDasharray={cpuGpuFlow.dashArray}
                      style={{
                        animation: `traceFlowForward ${cpuGpuFlow.animationDuration} linear infinite`,
                        filter: `drop-shadow(${cpuGpuFlow.glow})`,
                      }}
                    />

                    {/* Moving SVG pulses visualizing PCIe 4.0/5.0 Frame Packets */}
                    {isPoweredOn && (
                      <>
                        {/* Downstream: CPU -> GPU Render Commands & Shaders */}
                        <circle r="3.5" fill="#ffffff" stroke={cpuGpuFlow.color} strokeWidth="1.5">
                          <animateMotion path="M 350 305 L 350 420 L 330 470" dur={gpuPulseDur} repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill={cpuGpuFlow.color} opacity="0.8">
                          <animateMotion path="M 350 305 L 350 420 L 330 470" dur={gpuPulseDur} begin="0.35s" repeatCount="indefinite" />
                        </circle>

                        {/* Upstream: GPU -> CPU Frame Sync & Status */}
                        <circle r="3.5" fill="#ffffff" stroke={cpuGpuFlow.color} strokeWidth="1.5">
                          <animateMotion path="M 370 420 L 370 305" dur={gpuPulseDur} repeatCount="indefinite" />
                        </circle>

                        {/* Parallel PCIe Lane Packets */}
                        <circle r="3.2" fill={cpuGpuFlow.color}>
                          <animateMotion path="M 390 305 L 390 420 L 360 470" dur={gpuPulseDur} begin="0.18s" repeatCount="indefinite" />
                        </circle>
                        <circle r="3" fill="#ffffff" stroke={cpuGpuFlow.color} strokeWidth="1.2">
                          <animateMotion path="M 410 420 L 410 305" dur={gpuPulseDur} begin="0.5s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                  </>
                ) : (
                  // Internal SoC Direct Ring Bus inside CPU die
                  <>
                    <path
                      d="M 340 235 C 340 215, 460 215, 460 250 C 460 285, 340 285, 340 235"
                      fill="none"
                      stroke="#0f766e"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M 340 235 C 340 215, 460 215, 460 250 C 460 285, 340 285, 340 235"
                      fill="none"
                      stroke={cpuGpuFlow.color}
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      style={{
                        animation: `traceFlowForward ${cpuGpuFlow.animationDuration} linear infinite`,
                        filter: `drop-shadow(${cpuGpuFlow.glow})`,
                      }}
                    />
                    {isPoweredOn && (
                      <>
                        <circle r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="1.5">
                          <animateMotion
                            path="M 340 235 C 340 215, 460 215, 460 250 C 460 285, 340 285, 340 235"
                            dur={gpuPulseDur}
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle r="2.5" fill="#2dd4bf">
                          <animateMotion
                            path="M 340 235 C 340 215, 460 215, 460 250 C 460 285, 340 285, 340 235"
                            dur={gpuPulseDur}
                            begin="0.4s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </>
                    )}
                  </>
                )}
              </g>

              {/* Trace 3: CPU ↔ PCH (Chipset DMI 4.0 / 5.0 High-Speed Bus) */}
              <g className="cursor-pointer" onClick={() => handleSelect('CHIPSET')}>
                {/* Physical Copper Track Ground */}
                <path
                  d="M 470 305 L 470 355 L 720 355 L 720 450 M 490 305 L 490 370 L 740 370 L 740 450"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="4"
                />
                {/* Active DMI Bus Flow Tracks */}
                <path
                  d="M 470 305 L 470 355 L 720 355 L 720 450 M 490 305 L 490 370 L 740 370 L 740 450"
                  fill="none"
                  stroke={cpuPchFlow.color}
                  strokeWidth="2.5"
                  strokeDasharray={cpuPchFlow.dashArray}
                  style={{
                    animation: `traceFlowForward ${cpuPchFlow.animationDuration} linear infinite`,
                    filter: `drop-shadow(${cpuPchFlow.glow})`,
                  }}
                />

                {/* Moving SVG pulses visualizing CPU ↔ PCH Chipset I/O Bus */}
                {isPoweredOn && (
                  <>
                    {/* Downstream I/O Commands: CPU -> PCH */}
                    <circle r="3.5" fill="#ffffff" stroke={cpuPchFlow.color} strokeWidth="1.5">
                      <animateMotion
                        path="M 470 305 L 470 355 L 720 355 L 720 450"
                        dur={pchPulseDur}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="2.5" fill={cpuPchFlow.color} opacity="0.8">
                      <animateMotion
                        path="M 470 305 L 470 355 L 720 355 L 720 450"
                        dur={pchPulseDur}
                        begin="0.3s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Upstream Interrupts & Inbound I/O: PCH -> CPU */}
                    <circle r="3.5" fill="#ffffff" stroke={cpuPchFlow.color} strokeWidth="1.5">
                      <animateMotion
                        path="M 740 450 L 740 370 L 490 370 L 490 305"
                        dur={pchPulseDur}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="2.5" fill={cpuPchFlow.color} opacity="0.8">
                      <animateMotion
                        path="M 740 450 L 740 370 L 490 370 L 490 305"
                        dur={pchPulseDur}
                        begin="0.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}
              </g>

              {/* Trace 4: GPU ↔ VRAM (Radial GDDR Ring Interconnect) */}
              {hasDedicatedVram && (
                <g className="cursor-pointer" onClick={() => handleSelect('VRAM')}>
                  {/* GDDR Radial Interconnect Lines around GPU die */}
                  <path
                    d="M 270 485 L 245 485 M 270 535 L 245 535 M 385 485 L 410 485 M 385 535 L 410 535"
                    stroke="#1e293b"
                    strokeWidth="4"
                  />
                  <path
                    d="M 270 485 L 245 485 M 270 535 L 245 535 M 385 485 L 410 485 M 385 535 L 410 535"
                    stroke={gpuVramFlow.color}
                    strokeWidth="2.5"
                    strokeDasharray={gpuVramFlow.dashArray}
                    style={{
                      animation: `traceFlowForward ${gpuVramFlow.animationDuration} linear infinite`,
                      filter: `drop-shadow(${gpuVramFlow.glow})`,
                    }}
                  />

                  {/* High-frequency GDDR memory pulses */}
                  {isPoweredOn && (
                    <>
                      <circle r="3" fill="#ffffff" stroke={gpuVramFlow.color} strokeWidth="1.2">
                        <animateMotion path="M 270 485 L 245 485" dur={vramPulseDur} repeatCount="indefinite" />
                      </circle>
                      <circle r="3" fill="#ffffff" stroke={gpuVramFlow.color} strokeWidth="1.2">
                        <animateMotion path="M 245 535 L 270 535" dur={vramPulseDur} repeatCount="indefinite" />
                      </circle>
                      <circle r="3" fill="#ffffff" stroke={gpuVramFlow.color} strokeWidth="1.2">
                        <animateMotion path="M 385 485 L 410 485" dur={vramPulseDur} repeatCount="indefinite" />
                      </circle>
                      <circle r="3" fill="#ffffff" stroke={gpuVramFlow.color} strokeWidth="1.2">
                        <animateMotion path="M 410 535 L 385 535" dur={vramPulseDur} repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                </g>
              )}

              {/* Trace 5: CPU / PCH ↔ Storage (M.2 NVMe Slot) */}
              <g className="cursor-pointer" onClick={() => handleSelect('STORAGE')}>
                <path d="M 470 335 L 530 335 M 650 400 L 650 450 L 710 450" stroke="#1e293b" strokeWidth="4" fill="none" />
                <path
                  d="M 470 335 L 530 335 M 650 400 L 650 450 L 710 450"
                  stroke={cpuStorageFlow.color}
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray={cpuStorageFlow.dashArray}
                  style={{
                    animation: `traceFlowForward ${cpuStorageFlow.animationDuration} linear infinite`,
                    filter: `drop-shadow(${cpuStorageFlow.glow})`,
                  }}
                />

                {/* NVMe Read/Write Data Pulses */}
                {isPoweredOn && (
                  <>
                    <circle r="3.2" fill="#ffffff" stroke={cpuStorageFlow.color} strokeWidth="1.2">
                      <animateMotion path="M 470 335 L 530 335" dur={storagePulseDur} repeatCount="indefinite" />
                    </circle>
                    <circle r="3.2" fill="#ffffff" stroke={cpuStorageFlow.color} strokeWidth="1.2">
                      <animateMotion path="M 650 400 L 650 450 L 710 450" dur={storagePulseDur} repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </g>

              {/* Trace 6: Chipset PCH ↔ Network PHY */}
              <g className="cursor-pointer" onClick={() => handleSelect('NETWORK')}>
                <path d="M 700 560 L 150 560 L 150 240 L 140 240" stroke="#1e293b" strokeWidth="3.5" fill="none" />
                <path
                  d="M 700 560 L 150 560 L 150 240 L 140 240"
                  stroke={networkFlow.color}
                  strokeWidth="2.2"
                  fill="none"
                  strokeDasharray={networkFlow.dashArray}
                  style={{
                    animation: `traceFlowForward ${networkFlow.animationDuration} linear infinite`,
                    filter: `drop-shadow(${networkFlow.glow})`,
                  }}
                />

                {/* Network Packet Pulses */}
                {isPoweredOn && (
                  <circle r="3" fill="#ffffff" stroke={networkFlow.color} strokeWidth="1.2">
                    <animateMotion
                      path="M 700 560 L 150 560 L 150 240 L 140 240"
                      dur={networkPulseDur}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>

              {/* Trace 7: Power Delivery Rails from PSU to CPU & Motherboard */}
              <g className="cursor-pointer" onClick={() => handleSelect('PSU')}>
                {/* 12V EPS to CPU VRM */}
                <path d="M 125 600 L 125 60 L 175 60" stroke="#854d0e" strokeWidth="4" fill="none" />
                <path
                  d="M 125 600 L 125 60 L 175 60"
                  stroke={psuFlow.color}
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray={psuFlow.dashArray}
                  style={{
                    animation: `traceFlowForward ${psuFlow.animationDuration} linear infinite`,
                    filter: `drop-shadow(${psuFlow.glow})`,
                  }}
                />
                {/* Main 24-Pin ATX Power Rail to Right Edge */}
                <path d="M 230 650 L 935 650 L 935 290" stroke="#854d0e" strokeWidth="4" fill="none" />
                <path
                  d="M 230 650 L 935 650 L 935 290"
                  stroke="#eab308"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="6 4"
                  style={{ animation: 'traceFlowForward 2s linear infinite' }}
                />

                {/* Energy Pulses */}
                {isPoweredOn && (
                  <>
                    <circle r="3.5" fill="#fef08a" stroke="#eab308" strokeWidth="1.5">
                      <animateMotion path="M 125 600 L 125 60 L 175 60" dur={psuPulseDur} repeatCount="indefinite" />
                    </circle>
                    <circle r="3.5" fill="#fef08a" stroke="#eab308" strokeWidth="1.5">
                      <animateMotion path="M 230 650 L 935 650 L 935 290" dur={psuPulseDur} repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </g>

              {/* Trace 8: Thermal & Cooling Paths (Cooling to CPU) */}
              <g className="cursor-pointer" onClick={() => handleSelect('COOLING')}>
                <path d="M 260 170 L 305 170" stroke="#0e7490" strokeWidth="4" />
                <path
                  d="M 260 170 L 305 170"
                  stroke={coolingFlow.color}
                  strokeWidth="2.5"
                  strokeDasharray={coolingFlow.dashArray}
                  style={{
                    animation: `traceFlowForward ${coolingFlow.animationDuration} linear infinite`,
                    filter: `drop-shadow(${coolingFlow.glow})`,
                  }}
                />
                {isPoweredOn && (
                  <circle r="3" fill="#ffffff" stroke={coolingFlow.color} strokeWidth="1.2">
                    <animateMotion path="M 260 170 L 305 170" dur={coolingPulseDur} repeatCount="indefinite" />
                  </circle>
                )}
              </g>

              {/* ============================================================= */}
              {/* PHYSICAL HARDWARE COMPONENTS ON THE MOTHERBOARD */}
              {/* ============================================================= */}

              {/* 1. VRM POWER DELIVERY & 8-PIN EPS 12V (Top Left) */}
              <g id="component-vrm" className="cursor-pointer" onClick={() => handleSelect('PSU')}>
                {/* 8-Pin EPS Connector */}
                <rect x="175" y="35" width="60" height="35" fill="#18181b" stroke="#eab308" strokeWidth="1.5" rx="3" />
                <text x="180" y="47" fill="#facc15" fontSize="7" fontWeight="bold">EPS 12V</text>
                <text x="180" y="58" fill="#a1a1aa" fontSize="6">8-PIN CPU</text>

                {/* VRM Inductors / Chokes */}
                {[245, 265, 285, 305].map((vx, i) => (
                  <rect key={`vrm-${i}`} x={vx} y="40" width="16" height="25" fill="#27272a" stroke="#71717a" strokeWidth="1" rx="2" />
                ))}
              </g>

              {/* 2. COOLING SYSTEM / CPU FAN & AIO (Mounted on CPU Socket) */}
              <g
                id="component-cooling"
                className="cursor-pointer"
                onClick={() => handleSelect('COOLING')}
              >
                <rect
                  x="180"
                  y="120"
                  width="85"
                  height="110"
                  fill="#0c1929"
                  stroke={activeSubsystem === 'COOLING' || isHighlighted('cooling') ? '#22d3ee' : '#0369a1'}
                  strokeWidth={activeSubsystem === 'COOLING' ? '2.5' : '1.5'}
                  rx="8"
                />
                {/* Fan Blades Icon spinning */}
                <circle cx="222" cy="165" r="28" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
                <g transform="translate(222, 165)">
                  <g style={{ transformOrigin: '0 0', animation: isPoweredOn ? 'socketFanSpin 2.5s linear infinite' : 'none' }}>
                    <path d="M 0 0 L 18 -8 Q 22 0 16 8 Z" fill="#38bdf8" opacity="0.8" />
                    <path d="M 0 0 L -8 -18 Q 0 -22 8 -16 Z" fill="#38bdf8" opacity="0.8" />
                    <path d="M 0 0 L -18 8 Q -22 0 -16 -8 Z" fill="#38bdf8" opacity="0.8" />
                    <path d="M 0 0 L 8 18 Q 0 22 -8 16 Z" fill="#38bdf8" opacity="0.8" />
                  </g>
                </g>

                {/* Compact HUD for Cooling */}
                <text x="187" y="134" fill="#38bdf8" fontSize="8" fontWeight="black">COOLING PWM</text>
                <text x="187" y="210" fill="#ffffff" fontSize="9" fontWeight="bold">
                  {frame?.cooling.fanSpeedPct ?? 65}% • {frame?.cooling.cpuFanRpm ?? 1850} RPM
                </text>
                <text x="187" y="222" fill="#94a3b8" fontSize="7">
                  SIMULATED • {coolingState}
                </text>
              </g>

              {/* 3. CPU SOCKET (LGA/AM5) & CPU SILICON DIE (Center-Top) */}
              <g
                id="component-cpu"
                className="cursor-pointer"
                onClick={() => handleSelect('CPU')}
              >
                {/* Outer Metal Retention Frame */}
                <rect
                  x="305"
                  y="95"
                  width="190"
                  height="210"
                  fill="#18181b"
                  stroke={activeSubsystem === 'CPU' || isHighlighted('cpu') ? '#fbbf24' : '#52525b'}
                  strokeWidth={activeSubsystem === 'CPU' ? '3' : '1.8'}
                  rx="10"
                  style={{ filter: activeSubsystem === 'CPU' ? 'drop-shadow(0 0 12px rgba(251,191,36,0.6))' : 'none' }}
                />
                {/* Metal Retention Lever */}
                <line x1="500" y1="105" x2="500" y2="280" stroke="#d4d4d8" strokeWidth="4" strokeLinecap="round" />
                <circle cx="500" cy="285" r="4.5" fill="#f59e0b" />

                {/* Central CPU IHS / Silicon Die */}
                <rect
                  x="320"
                  y="110"
                  width="160"
                  height="180"
                  fill="url(#cpu-silicon-grad)"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  rx="6"
                />

                {/* Cores Cluster */}
                <rect x="330" y="145" width="140" height={hasDedicatedGpu ? '110' : '70'} fill="#09090b" stroke="#3f3f46" strokeWidth="1" rx="4" />
                <text x="338" y="162" fill="#fbbf24" fontSize="10" fontWeight="900" letterSpacing="1">
                  CPU: {machine.cpu.cores}C / {machine.cpu.threads}T
                </text>
                <text
                  x="338"
                  y="176"
                  fill={cpuTemp > 75 ? (cpuTemp >= 90 ? '#f43f5e' : '#fb923c') : '#ffffff'}
                  fontSize="9"
                  fontWeight="bold"
                >
                  {frame ? `${frame.cpu.loadPct}%` : '0%'} • {frame?.cpu.temperatureC ?? cpuTemp}°C
                  {cpuTemp > 75 ? ' 🔥 (>75°C)' : ''}
                </text>
                <text x="338" y="190" fill="#38bdf8" fontSize="8" fontWeight="bold">
                  {frame ? `${(frame.cpu.effectiveClockMhz / 1000).toFixed(2)} GHz` : '3.8 GHz'} • {frame?.cpu.powerW ?? machine.cpu.tdpW}W
                </text>
                <text x="338" y="202" fill="#a1a1aa" fontSize="7.5" fontFamily="monospace">
                  {frame?.cpu.provenance || 'SYSTEM_REPORTED'} • {cpuState}
                </text>

                {/* INTEGRATED GRAPHICS iGPU (Only if machine has NO dedicated GPU!) */}
                {!hasDedicatedGpu && (
                  <g>
                    <rect x="330" y="222" width="140" height="58" fill="#042f2e" stroke="#14b8a6" strokeWidth="1.5" rx="4" />
                    <text x="338" y="236" fill="#2dd4bf" fontSize="8.5" fontWeight="black">
                      iGPU: {machine.gpu.model}
                    </text>
                    <text
                      x="338"
                      y="250"
                      fill={gpuTemp > 75 ? '#fb923c' : '#ffffff'}
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {frame ? `${frame.gpu.loadPct}%` : '0%'} • {frame?.gpu.temperatureC ?? gpuTemp}°C
                      {gpuTemp > 75 ? ' 🔥' : ''}
                    </text>
                    <text x="338" y="264" fill="#a1a1aa" fontSize="7">
                      SOC INTEGRADO • UMA SHARED RAM
                    </text>
                  </g>
                )}

                {/* Subsystem Name Silkscreen */}
                <text x="330" y="124" fill="#71717a" fontSize="7.5" fontWeight="bold">
                  SOCKET {machine.cpu.socket} // LGA PINS
                </text>
              </g>

              {/* 4. RAM / DIMM SLOTS (DIMM A1, A2, B1, B2) (Top Right) */}
              <g
                id="component-ram"
                className="cursor-pointer"
                onClick={() => handleSelect('RAM')}
              >
                {/* DIMM Bank Background */}
                <rect
                  x="590"
                  y="85"
                  width="160"
                  height="225"
                  fill="#0c1322"
                  stroke={activeSubsystem === 'RAM' || isHighlighted('ram') ? '#22d3ee' : '#334155'}
                  strokeWidth={activeSubsystem === 'RAM' ? '2.5' : '1.5'}
                  rx="6"
                  style={{ filter: activeSubsystem === 'RAM' ? 'drop-shadow(0 0 12px rgba(34,211,238,0.5))' : 'none' }}
                />

                {/* Silkscreen text */}
                <text x="598" y="100" fill="#38bdf8" fontSize="8" fontWeight="black">
                  DDR DIMM SLOTS ({machine.ram.type})
                </text>

                {/* 4 Physical Slots */}
                {[
                  { id: 'DIMM_A1', x: 605, pop: isDualChannel, name: 'A1' },
                  { id: 'DIMM_A2', x: 640, pop: true, name: 'A2' },
                  { id: 'DIMM_B1', x: 675, pop: false, name: 'B1' },
                  { id: 'DIMM_B2', x: 710, pop: isDualChannel, name: 'B2' },
                ].map((slot) => (
                  <g key={slot.id}>
                    {/* Slot casing */}
                    <rect x={slot.x} y="110" width="24" height="160" fill="#18181b" stroke="#3f3f46" strokeWidth="1" rx="2" />
                    {/* Top & Bottom Latches */}
                    <rect x={slot.x - 1} y="106" width="26" height="6" fill="#e4e4e7" rx="1" />
                    <rect x={slot.x - 1} y="268" width="26" height="6" fill="#e4e4e7" rx="1" />

                    {/* Installed Stick */}
                    {slot.pop ? (
                      <g>
                        <rect x={slot.x + 2} y="114" width="20" height="152" fill="#042f2e" stroke="#10b981" strokeWidth="1" rx="2" />
                        <line x1={slot.x + 12} y1="120" x2={slot.x + 12} y2="260" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" />
                        <text x={slot.x + 4} y="190" fill="#6ee7b7" fontSize="7" fontWeight="black" transform={`rotate(-90 ${slot.x + 4} 190)`}>
                          {machine.ram.sizeGb / (isDualChannel ? 2 : 1)}GB
                        </text>
                      </g>
                    ) : (
                      <text x={slot.x + 6} y="195" fill="#52525b" fontSize="6" transform={`rotate(-90 ${slot.x + 6} 195)`}>
                        VACÍO
                      </text>
                    )}
                    <text x={slot.x + 5} y="285" fill="#94a3b8" fontSize="7" fontWeight="bold">
                      {slot.name}
                    </text>
                  </g>
                ))}

                {/* Compact HUD for RAM */}
                <text x="598" y="300" fill="#ffffff" fontSize="8" fontWeight="bold">
                  {frame ? `${frame.ram.usedGb}GB (${frame.ram.pressurePct}%)` : `${machine.ram.sizeGb}GB`} • {machine.ram.configuredSpeedMts} MT/s
                </text>
              </g>

              {/* 5. 24-PIN ATX MAIN POWER CONNECTOR (Right Edge) */}
              <g id="component-atx-power" className="cursor-pointer" onClick={() => handleSelect('PSU')}>
                <rect x="925" y="160" width="45" height="140" fill="#18181b" stroke="#eab308" strokeWidth="1.8" rx="4" />
                <text x="930" y="175" fill="#facc15" fontSize="7" fontWeight="black">ATX 24P</text>
                {/* Pin Grid 2x12 */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((p) => (
                  <g key={`atxpin-${p}`}>
                    <circle cx="936" cy={185 + p * 9} r="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                    <circle cx="952" cy={185 + p * 9} r="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                  </g>
                ))}
              </g>

              {/* 6. STORAGE: M.2 NVMe SSD / SATA (Between CPU and Chipset) */}
              <g
                id="component-storage"
                className="cursor-pointer"
                onClick={() => handleSelect('STORAGE')}
              >
                <rect
                  x="530"
                  y="335"
                  width="180"
                  height="65"
                  fill="#111827"
                  stroke={activeSubsystem === 'STORAGE' || isHighlighted('storage') ? '#a855f7' : '#4b5563'}
                  strokeWidth={activeSubsystem === 'STORAGE' ? '2.5' : '1.5'}
                  rx="6"
                  style={{ filter: activeSubsystem === 'STORAGE' ? 'drop-shadow(0 0 10px rgba(168,85,247,0.5))' : 'none' }}
                />
                {/* M.2 Gold Pins */}
                <rect x="532" y="340" width="12" height="55" fill="#ca8a04" rx="1" />
                {/* Standoff screw */}
                <circle cx="700" cy="367" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                <line x1="698" y1="367" x2="702" y2="367" stroke="#1e293b" />

                {/* Storage text & HUD */}
                <text x="550" y="352" fill="#c084fc" fontSize="8" fontWeight="black">
                  {isNvmeStorage ? 'M.2 NVMe SSD (PCIe Gen4 x4)' : 'SATA 6Gbps STORAGE'}
                </text>
                <text x="550" y="367" fill="#ffffff" fontSize="8" fontWeight="bold">
                  {machine.storage.capacityGb} GB • {frame?.storage.temperatureC ?? 41}°C
                </text>
                <text x="550" y="381" fill="#cbd5e1" fontSize="7.5">
                  Lectura: {frame ? `${frame.storage.readSpeedMBps} MB/s` : '0 MB/s'} • {frame?.storage.provenance || 'MEASURED'}
                </text>
              </g>

              {/* 7. PCIE X16 SLOT & DEDICATED GPU (Middle/Lower-Left) */}
              {/* Note: ONLY drawn as discrete card if Machine actually has dedicated GPU! */}
              <g id="component-pcie-slot">
                {/* Motherboard PCIe Slot Housing */}
                <rect x="120" y="420" width="480" height="28" fill="#18181b" stroke="#475569" strokeWidth="1.5" rx="3" />
                {/* Retaining latch at end */}
                <rect x="590" y="416" width="18" height="36" fill="#3b82f6" rx="2" />
                <text x="130" y="438" fill="#94a3b8" fontSize="8" fontWeight="bold">
                  PCIe 4.0 / 5.0 x16 SLOT
                </text>

                {hasDedicatedGpu ? (
                  // Dedicated GPU Card installed into slot
                  <g
                    className="cursor-pointer"
                    onClick={() => handleSelect('GPU')}
                  >
                    {/* GPU PCB Board */}
                    <rect
                      x="130"
                      y="455"
                      width="450"
                      height="145"
                      fill="#091410"
                      stroke={activeSubsystem === 'GPU' || isHighlighted('gpu') ? '#34d399' : '#059669'}
                      strokeWidth={activeSubsystem === 'GPU' ? '2.5' : '1.8'}
                      rx="8"
                      style={{ filter: activeSubsystem === 'GPU' ? 'drop-shadow(0 0 14px rgba(52,211,153,0.5))' : 'none' }}
                    />
                    {/* Bracket on left */}
                    <rect x="120" y="450" width="12" height="155" fill="#94a3b8" rx="2" />

                    {/* GPU Silicon Die */}
                    <rect
                      x="270"
                      y="470"
                      width="115"
                      height="90"
                      fill="#022c22"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      rx="4"
                    />
                    <text x="280" y="488" fill="#34d399" fontSize="9" fontWeight="black">
                      GPU DIE
                    </text>
                    <text
                      x="280"
                      y="504"
                      fill={gpuTemp > 75 ? (gpuTemp >= 90 ? '#f43f5e' : '#fb923c') : '#ffffff'}
                      fontSize="8.5"
                      fontWeight="bold"
                    >
                      {frame ? `${frame.gpu.loadPct}%` : '0%'} • {frame?.gpu.temperatureC ?? gpuTemp}°C
                      {gpuTemp > 75 ? ' 🔥 (>75°C)' : ''}
                    </text>
                    <text x="280" y="519" fill="#38bdf8" fontSize="8">
                      {frame ? `${frame.gpu.effectiveClockMhz} MHz` : 'Base'} • {frame?.gpu.powerW ?? machine.gpu.powerW}W
                    </text>
                    <text x="280" y="534" fill="#94a3b8" fontSize="7.5">
                      {frame?.gpu.provenance || 'SYSTEM_REPORTED'} • {gpuState}
                    </text>

                    {/* GPU Model title */}
                    <text x="145" y="475" fill="#a7f3d0" fontSize="8.5" fontWeight="bold">
                      {machine.gpu.model}
                    </text>

                    {/* Dedicated VRAM Chips (Surrounding GPU Die) */}
                    {hasDedicatedVram && (
                      <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSelect('VRAM'); }}>
                        {[
                          { id: 'v1', x: 220, y: 475 },
                          { id: 'v2', x: 220, y: 520 },
                          { id: 'v3', x: 395, y: 475 },
                          { id: 'v4', x: 395, y: 520 },
                        ].map((vm) => (
                          <rect
                            key={vm.id}
                            x={vm.x}
                            y={vm.y}
                            width="38"
                            height="32"
                            fill="#3b0764"
                            stroke={activeSubsystem === 'VRAM' || isHighlighted('vram') ? '#c084fc' : '#7e22ce'}
                            strokeWidth={activeSubsystem === 'VRAM' ? '2' : '1'}
                            rx="3"
                          />
                        ))}
                        <text x="145" y="585" fill="#e9d5ff" fontSize="8" fontWeight="bold">
                          VRAM: {frame ? `${frame.gpu.vramUsedGb} / ${machine.gpu.vramGb} GB` : `${machine.gpu.vramGb} GB`} ({frame?.gpu.vramPressurePct ?? 25}%) • GDDR6
                        </text>
                      </g>
                    )}
                  </g>
                ) : (
                  // EMPTY SLOT SILKSCREEN IF MACHINE HAS NO DEDICATED GPU
                  <text x="180" y="440" fill="#71717a" fontSize="8" fontWeight="bold" letterSpacing="1">
                    [RANURA DESOCUPADA — USANDO GRÁFICOS INTEGRADOS iGPU EN CPU]
                  </text>
                )}
              </g>

              {/* 8. CHIPSET / PCH PLATFORM CONTROLLER HUB (Bottom Right) */}
              <g
                id="component-chipset"
                className="cursor-pointer"
                onClick={() => handleSelect('CHIPSET')}
              >
                {/* Aluminum Finned Heatsink */}
                <rect
                  x="700"
                  y="450"
                  width="180"
                  height="160"
                  fill="url(#heatsink-grad)"
                  stroke={activeSubsystem === 'CHIPSET' || isHighlighted('chipset') ? '#60a5fa' : '#334155'}
                  strokeWidth={activeSubsystem === 'CHIPSET' ? '2.5' : '1.5'}
                  rx="8"
                  style={{ filter: activeSubsystem === 'CHIPSET' ? 'drop-shadow(0 0 12px rgba(96,165,250,0.5))' : 'none' }}
                />
                {/* Heatsink fin slats */}
                {[465, 485, 505, 525, 545, 565, 585].map((fy, i) => (
                  <line key={`fin-${i}`} x1="710" y1={fy} x2="870" y2={fy} stroke="#334155" strokeWidth="2" />
                ))}

                {/* Chipset Badge */}
                <rect x="720" y="500" width="140" height="60" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" rx="5" />
                <text x="730" y="518" fill="#60a5fa" fontSize="9" fontWeight="black">
                  CHIPSET PCH HUB
                </text>
                <text x="730" y="534" fill="#ffffff" fontSize="8" fontWeight="bold">
                  {machine.motherboard?.chipset || 'Southbridge'} • DMI 4.0 x8
                </text>
                <text x="730" y="548" fill="#94a3b8" fontSize="7.5">
                  I/O CARGA: {frame ? `${frame.buses.cpuStorage.utilizationEstimatePct}%` : '15%'} • SYSTEM_REPORTED
                </text>
              </g>

              {/* 9. NETWORK PHY (Ethernet 2.5G & Wi-Fi Module) (Left I/O area) */}
              <g
                id="component-network"
                className="cursor-pointer"
                onClick={() => handleSelect('NETWORK')}
              >
                <rect
                  x="65"
                  y="180"
                  width="75"
                  height="70"
                  fill="#06281e"
                  stroke={activeSubsystem === 'NETWORK' || isHighlighted('network') ? '#34d399' : '#059669'}
                  strokeWidth={activeSubsystem === 'NETWORK' ? '2' : '1.2'}
                  rx="5"
                />
                <text x="72" y="196" fill="#34d399" fontSize="8" fontWeight="black">NET PHY</text>
                <text x="72" y="210" fill="#ffffff" fontSize="7.5" fontWeight="bold">2.5G LAN</text>
                <text x="72" y="224" fill="#a7f3d0" fontSize="7">Wi-Fi 6E</text>
                <text x="72" y="238" fill="#6ee7b7" fontSize="7">
                  {frame ? `${frame.buses.chipsetNetwork.effectiveDemandGbps}M` : '1.2M'}
                </text>
              </g>

              {/* 10. POWER SUPPLY PSU (Bottom Left Corner) */}
              <g
                id="component-psu"
                className="cursor-pointer"
                onClick={() => handleSelect('PSU')}
              >
                <rect
                  x="60"
                  y="600"
                  width="170"
                  height="85"
                  fill="#1c1917"
                  stroke={activeSubsystem === 'PSU' || isHighlighted('psu') ? '#facc15' : '#78716c'}
                  strokeWidth={activeSubsystem === 'PSU' ? '2.5' : '1.5'}
                  rx="8"
                  style={{ filter: activeSubsystem === 'PSU' ? 'drop-shadow(0 0 12px rgba(250,204,21,0.5))' : 'none' }}
                />
                <circle cx="95" cy="642" r="22" fill="#292524" stroke="#a8a29e" strokeWidth="1" />
                <text x="125" y="625" fill="#facc15" fontSize="9" fontWeight="black">
                  PSU POWER ATX
                </text>
                <text x="125" y="642" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                  {machine.psu.wattageW > 0
                    ? `${frame ? `${frame.psu.estimatedLoadW}W` : '120W'} / ${frame?.psu.ratedWattageW ?? machine.psu.wattageW}W`
                    : 'PSU: UNKNOWN'}
                </text>
                <text x="125" y="658" fill={machine.psu.wattageW > 0 ? '#cbd5e1' : '#facc15'} fontSize="7.5">
                  {machine.psu.wattageW > 0
                    ? `Margen: ${frame?.psu.headroomW ?? 450}W (${frame?.psu.headroomPct ?? 75}%)`
                    : 'CARGA MANUAL REQUERIDA'}
                </text>
                <text x="125" y="672" fill="#a1a1aa" fontSize="7">
                  {machine.psu.provenance} • {machine.psu.wattageW === 0 ? 'NO DETECTABLE POR SO' : psuState}
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* =================================================================== */}
        {/* COMPONENT DEEP INSPECTION SIDEBAR DRAWER (Lg: 4 Cols) */}
        {/* =================================================================== */}
        {isInspectorOpen && !isFullScreenBoard && (
          <div className="lg:col-span-4 rounded-2xl border border-zinc-800 bg-[#090c13] p-4.5 space-y-4 shadow-2xl relative">
            {/* Header with selected component name & close button */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                  {activeSubsystem === 'CPU' && <Cpu className="w-4 h-4 text-amber-400" />}
                  {activeSubsystem === 'RAM' && <Activity className="w-4 h-4 text-cyan-400" />}
                  {activeSubsystem === 'GPU' && <Tv className="w-4 h-4 text-emerald-400" />}
                  {activeSubsystem === 'VRAM' && <Layers className="w-4 h-4 text-purple-400" />}
                  {activeSubsystem === 'STORAGE' && <HardDrive className="w-4 h-4 text-purple-400" />}
                  {activeSubsystem === 'CHIPSET' && <Server className="w-4 h-4 text-blue-400" />}
                  {activeSubsystem === 'PSU' && <Zap className="w-4 h-4 text-yellow-400" />}
                  {activeSubsystem === 'COOLING' && <Fan className="w-4 h-4 text-cyan-400" />}
                  {activeSubsystem === 'NETWORK' && <Wifi className="w-4 h-4 text-emerald-400" />}
                  {activeSubsystem === 'BUS' && <Activity className="w-4 h-4 text-amber-400" />}
                </span>
                <div>
                  <div className="font-black text-xs text-white uppercase tracking-wider">
                    PANEL TÉCNICO // {activeSubsystem}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Inspección profunda de señales & telemetría
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current State & Forensic Diagnosis */}
            <div className="space-y-3">
              {/* Metric Breakdown Cards: Valor Actual & Headroom */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase">VALOR ACTUAL</div>
                  <div className="text-sm font-black text-white font-mono mt-0.5">
                    {activeSubsystem === 'CPU' && (frame ? `${frame.cpu.loadPct}%` : 'Reposo')}
                    {activeSubsystem === 'RAM' && (frame ? `${frame.ram.usedGb} GB` : `${machine.ram.sizeGb} GB`)}
                    {activeSubsystem === 'GPU' && (frame ? `${frame.gpu.loadPct}%` : 'Reposo')}
                    {activeSubsystem === 'VRAM' && (frame ? `${frame.gpu.vramUsedGb} GB` : `${machine.gpu.vramGb} GB`)}
                    {activeSubsystem === 'STORAGE' && (frame ? `${frame.storage.readSpeedMBps} MB/s` : '0 MB/s')}
                    {activeSubsystem === 'PSU' && (frame ? `${frame.psu.estimatedLoadW}W` : '120W')}
                    {activeSubsystem === 'COOLING' && (frame?.cooling.cpuFanRpm ? `${frame.cooling.cpuFanRpm} RPM` : 'PWM')}
                    {activeSubsystem === 'CHIPSET' && 'DMI 4.0 x8'}
                    {activeSubsystem === 'NETWORK' && (frame ? `${frame.buses.chipsetNetwork.effectiveDemandGbps} Mbps` : '1 Gbps')}
                    {activeSubsystem === 'BUS' && (frame ? `${frame.buses.cpuGpu.effectiveDemandGbps} GB/s` : 'PCIe 4.0')}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase">MARGEN / HEADROOM</div>
                  <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                    {activeSubsystem === 'CPU' && (frame ? `${frame.cpu.thermalHeadroomC}°C térmico` : '55°C')}
                    {activeSubsystem === 'RAM' && (frame ? `${(frame.ram.totalGb - frame.ram.usedGb).toFixed(1)} GB libre` : 'Nativo')}
                    {activeSubsystem === 'GPU' && (frame ? `${frame.gpu.thermalHeadroomC}°C térmico` : '42°C')}
                    {activeSubsystem === 'VRAM' && (frame ? `${(frame.gpu.vramTotalGb - frame.gpu.vramUsedGb).toFixed(1)} GB libre` : 'Capacidad')}
                    {activeSubsystem === 'STORAGE' && (frame ? `${100 - frame.storage.queuePressurePct}% cola` : '100%')}
                    {activeSubsystem === 'PSU' && (frame ? `${frame.psu.headroomW}W (${frame.psu.headroomPct}%)` : '450W')}
                    {activeSubsystem === 'COOLING' && `${100 - (frame?.cooling.thermalSoakFactorPct ?? 30)}% capacidad`}
                    {activeSubsystem === 'CHIPSET' && 'Margen Óptimo'}
                    {activeSubsystem === 'NETWORK' && '95% ancho libre'}
                    {activeSubsystem === 'BUS' && 'Headroom PCIe'}
                  </div>
                </div>
              </div>

              {/* Capacidad Nominal vs Demanda Instantánea */}
              <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-850 text-[11px] space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Capacidad nominal:</span>
                  <span className="font-mono text-white font-bold">
                    {activeSubsystem === 'CPU' && `${machine.cpu.cores} Cores / ${machine.cpu.tdpW}W TDP`}
                    {activeSubsystem === 'RAM' && `${machine.ram.sizeGb} GB @ ${machine.ram.configuredSpeedMts} MT/s`}
                    {activeSubsystem === 'GPU' && `${machine.gpu.model.split(' ')[0]} ${machine.gpu.vramGb}GB`}
                    {activeSubsystem === 'VRAM' && `${machine.gpu.vramGb} GB GDDR6/X`}
                    {activeSubsystem === 'STORAGE' && `${machine.storage.capacityGb} GB NVMe`}
                    {activeSubsystem === 'PSU' && `${machine.psu.wattageW}W Certificada`}
                    {activeSubsystem === 'COOLING' && 'Chasis ATX Flujo Positivo'}
                    {activeSubsystem === 'CHIPSET' && 'Placa Base ATX Bus Directo'}
                    {activeSubsystem === 'NETWORK' && '2.5 Gbps Enlace'}
                    {activeSubsystem === 'BUS' && 'PCIe 4.0 x16 (64 GB/s bi-dir)'}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Demanda actual:</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {activeSubsystem === 'CPU' && (frame ? `${frame.cpu.powerW}W (${frame.cpu.loadPct}% carga)` : 'Baja')}
                    {activeSubsystem === 'RAM' && (frame ? `${frame.ram.usedGb} GB asignados` : 'Baja')}
                    {activeSubsystem === 'GPU' && (frame ? `${frame.gpu.powerW}W (${frame.gpu.loadPct}% carga)` : 'Baja')}
                    {activeSubsystem === 'VRAM' && (frame ? `${frame.gpu.vramUsedGb} GB texturas/shaders` : 'Baja')}
                    {activeSubsystem === 'STORAGE' && (frame ? `${frame.storage.readSpeedMBps} MB/s I/O` : '0 MB/s')}
                    {activeSubsystem === 'PSU' && (frame ? `${frame.psu.estimatedLoadW}W consumo total` : '120W')}
                    {activeSubsystem === 'COOLING' && (frame ? `${frame.cooling.fanSpeedPct}% ciclo PWM` : 'Reposo')}
                    {activeSubsystem === 'CHIPSET' && 'I/O balanceado'}
                    {activeSubsystem === 'NETWORK' && (frame ? `${frame.buses.chipsetNetwork.effectiveDemandGbps} Mbps` : 'Baja')}
                    {activeSubsystem === 'BUS' && (frame ? `${frame.buses.cpuGpu.effectiveDemandGbps} GB/s` : 'Nominal')}
                  </span>
                </div>
              </div>

              {/* Real-Time Temporal Sparkline */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-cyan-400" />
                    TENDENCIA TEMPORAL RECIENTE
                  </span>
                  <span className="font-mono text-zinc-500">Últimos frames</span>
                </div>
                {activeSubsystem === 'CPU' && renderSparkline((f) => f.cpu.loadPct, '#f59e0b', 100)}
                {activeSubsystem === 'GPU' && renderSparkline((f) => f.gpu.loadPct, '#10b981', 100)}
                {activeSubsystem === 'RAM' && renderSparkline((f) => f.ram.pressurePct, '#06b6d4', 100)}
                {activeSubsystem === 'VRAM' && renderSparkline((f) => f.gpu.vramPressurePct, '#a855f7', 100)}
                {activeSubsystem === 'PSU' && renderSparkline((f) => f.psu.estimatedLoadW, '#eab308', machine.psu.wattageW)}
                {(activeSubsystem === 'STORAGE' ||
                  activeSubsystem === 'COOLING' ||
                  activeSubsystem === 'CHIPSET' ||
                  activeSubsystem === 'NETWORK' ||
                  activeSubsystem === 'BUS') &&
                  renderSparkline((f) => f.buses.cpuGpu.utilizationEstimatePct, '#38bdf8', 100)}
              </div>

              {/* Deep Technical Analysis / Causa Raíz & Bottleneck Relacionado */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
                <div className="text-[10px] text-zinc-400 font-bold uppercase flex items-center justify-between">
                  <span>DIAGNÓSTICO PERICIAL & BOTTLENECK</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-cyan-400 font-bold">
                    {activeSubsystem}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {activeSubsystem === 'CPU' &&
                    (frame?.cpu.isThrottling
                      ? 'Throttling térmico crítico detectado. La CPU redujo su reloj efectivo para evitar daños por sobrecalentamiento.'
                      : frame?.cpu.loadPct && frame.cpu.loadPct > 85
                      ? 'Alta saturación en el hilo primario (Main Thread). Podría condicionar el framerate mínimo del juego.'
                      : 'Funcionamiento térmico y de frecuencias nominal. Sin contención en el planificador de Windows.')}

                  {activeSubsystem === 'GPU' &&
                    (frame?.gpu.isThermalLimiting
                      ? 'La GPU está alcanzando su curva límite de temperatura de silicio, modulando el Boost Clock dinámicamente.'
                      : frame?.gpu.loadPct && frame.gpu.loadPct > 90
                      ? 'Régimen ideal de renderizado (GPU-bound saludable). Los shaders están completamente aprovechados.'
                      : 'Carga moderada de rasterización. No constituye cuello de botella en esta resolución.')}

                  {activeSubsystem === 'RAM' &&
                    (frame?.ram.pressurePct && frame.ram.pressurePct > 90
                      ? 'Presión extrema de memoria RAM. El sistema puede estar paginando datos en el disco (swap).'
                      : 'Canales de memoria DDR con ancho de banda y latencias dentro de márgenes aceptables.')}

                  {activeSubsystem === 'VRAM' &&
                    (hasDedicatedVram && frame?.gpu.vramPressurePct && frame.gpu.vramPressurePct > 90
                      ? 'Buffer de texturas y shaders al límite de capacidad. Riesgo de caídas bruscas de 1% Low FPS.'
                      : 'Memoria de video suficiente para la resolución y preset gráfico seleccionados.')}

                  {activeSubsystem === 'PSU' &&
                    (frame?.psu.headroomPct && frame.psu.headroomPct < 20
                      ? 'Margen de potencia en la fuente de alimentación reducido. Riesgo de picos transitorios (power spikes).'
                      : 'La fuente entrega potencia estable en rieles de 12V con margen de seguridad adecuado.')}

                  {activeSubsystem === 'STORAGE' &&
                    'Las colas de lectura I/O del almacenamiento no presentan bloqueos en streaming de texturas.'}

                  {activeSubsystem === 'COOLING' &&
                    'El factor de absorción térmica del disipador transfiere el calor generado sin saturación.'}

                  {activeSubsystem === 'CHIPSET' &&
                    'El puente sur (PCH) distribuye el ancho de banda PCIe secundario sin cuellos de botella.'}

                  {activeSubsystem === 'NETWORK' &&
                    'Buffer de paquetes con baja latencia y sin pérdida de frames por contención de red.'}

                  {activeSubsystem === 'BUS' &&
                    'La topología de pistas garantiza comunicación directa entre procesador y acelerador.'}
                </p>

                {/* Provenance Badge breakdown */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-bold">Procedencia de datos:</span>
                  <span className="font-mono text-cyan-400 font-black">
                    {activeSubsystem === 'CPU' && (frame?.cpu.provenance || 'SYSTEM_REPORTED / SIM')}
                    {activeSubsystem === 'GPU' && (frame?.gpu.provenance || 'SYSTEM_REPORTED / SIM')}
                    {activeSubsystem === 'RAM' && (frame?.ram.provenance || 'SYSTEM_REPORTED')}
                    {activeSubsystem === 'VRAM' && 'SIMULATED'}
                    {activeSubsystem === 'STORAGE' && (frame?.storage.provenance || 'MEASURED')}
                    {activeSubsystem === 'PSU' && 'DERIVED'}
                    {activeSubsystem === 'COOLING' && 'SIMULATED'}
                    {activeSubsystem === 'CHIPSET' && 'SYSTEM_REPORTED'}
                    {activeSubsystem === 'NETWORK' && 'DERIVED'}
                    {activeSubsystem === 'BUS' && 'DERIVED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Epistemic Hardware Integrity Audit Modal */}
      <EvoMachineIntegrityModal
        isOpen={showIntegrityModal}
        onClose={() => setShowIntegrityModal(false)}
        activeMachine={machine}
      />
    </div>
  );
};
