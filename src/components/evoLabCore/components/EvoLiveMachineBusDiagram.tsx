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
} from 'lucide-react';
import { Machine, EpistemicProvenance } from '../types';
import { DigitalTwinFrame, BusState } from '../services/digitalTwin/types';

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

  const activeSubsystem = externalSelectedComponent || internalSelected;

  const handleSelect = (sub: SubsystemIdentifier) => {
    setInternalSelected(sub);
    setIsInspectorOpen(true);
    if (onSelectComponent) {
      onSelectComponent(sub);
    }
  };

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
        if (sub === 'GPU' || sub === 'VRAM') return machine.gpu.isDedicated ? 'HIGH_LOAD' : 'LIMITING';
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
  // FLOW STYLING & ANIMATION SPEED DERIVATION
  // --------------------------------------------------------------------------
  const getBusFlowStyles = (
    utilizationPct: number,
    limitingKind: 'NONE' | 'LIMITING' | 'FAULT' = 'NONE'
  ) => {
    if (!isPoweredOn || utilizationPct < 5) {
      return {
        color: '#3f3f46',
        strokeDash: '4,4',
        duration: '15s',
        glow: 'none',
        opacity: 0.35,
        flowIntensity: 'quiet',
      };
    }

    if (limitingKind === 'FAULT' || utilizationPct >= 95) {
      return {
        color: '#f43f5e', // Rose/Red Pulsing
        strokeDash: '6,6',
        duration: '0.6s',
        glow: '0 0 14px rgba(244,63,94,0.95)',
        opacity: 1,
        flowIntensity: 'throttling',
      };
    }

    if (limitingKind === 'LIMITING' || utilizationPct >= 85) {
      return {
        color: '#f59e0b', // Amber/Orange Limiting
        strokeDash: '8,6',
        duration: '1.0s',
        glow: '0 0 12px rgba(245,158,11,0.9)',
        opacity: 1,
        flowIntensity: 'limiting',
      };
    }

    if (utilizationPct >= 65) {
      return {
        color: '#eab308', // Cyber Yellow Heavy Load
        strokeDash: '8,6',
        duration: '1.4s',
        glow: '0 0 10px rgba(234,179,8,0.8)',
        opacity: 0.95,
        flowIntensity: 'high',
      };
    }

    if (utilizationPct >= 25) {
      return {
        color: '#06b6d4', // Cyan Active Load
        strokeDash: '8,6',
        duration: '2.5s',
        glow: '0 0 8px rgba(6,182,212,0.7)',
        opacity: 0.85,
        flowIntensity: 'normal',
      };
    }

    return {
      color: '#10b981', // Emerald Idle/Smooth
      strokeDash: '6,8',
      duration: '5.0s',
      glow: '0 0 6px rgba(16,185,129,0.5)',
      opacity: 0.65,
      flowIntensity: 'smooth',
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

  const cpuRamFlow = getBusFlowStyles(cpuRamUtil, ramState === 'FAULT' ? 'FAULT' : ramState === 'LIMITING' ? 'LIMITING' : 'NONE');
  const cpuGpuFlow = getBusFlowStyles(cpuGpuUtil, gpuState === 'FAULT' ? 'FAULT' : gpuState === 'LIMITING' ? 'LIMITING' : 'NONE');
  const gpuVramFlow = getBusFlowStyles(gpuVramUtil, vramState === 'LIMITING' || vramState === 'SATURATED' ? 'LIMITING' : 'NONE');
  const cpuStorageFlow = getBusFlowStyles(cpuStorageUtil, storageState === 'LIMITING' ? 'LIMITING' : 'NONE');
  const networkFlow = getBusFlowStyles(networkUtil);
  const psuFlow = getBusFlowStyles(psuLoadUtil, psuState === 'FAULT' ? 'FAULT' : psuState === 'LIMITING' ? 'LIMITING' : 'NONE');

  const isHighlighted = (sub: string) => {
    if (!highlightedSubsystem) return false;
    const normalized = highlightedSubsystem.toLowerCase();
    const target = sub.toLowerCase();
    return normalized === target || (target === 'vram' && normalized === 'gpu');
  };

  const getBadgePill = (state: SubsystemOperationalState) => {
    switch (state) {
      case 'NORMAL':
        return <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">NORMAL</span>;
      case 'HIGH_LOAD':
        return <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">CARGA ALTA</span>;
      case 'LIMITING':
        return <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse">LIMITANDO</span>;
      case 'SATURATED':
        return <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">SATURADO</span>;
      case 'FAULT':
        return <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-red-600/30 text-red-300 border border-red-500 animate-ping">THROTTLING</span>;
      case 'IDLE':
      default:
        return <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-zinc-800/80 text-zinc-400 border border-zinc-700">REPOSO</span>;
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
    <div className="w-full rounded-2xl border border-zinc-800 bg-[#07090e] p-4 sm:p-5 font-mono-tech relative overflow-hidden shadow-2xl space-y-4">
      {/* Top Header: Power Switch & High-Level Telemetry */}
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
              FLUIDO INTERNO DE HARDWARE & BUSES
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
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[10px]">
            {machine.motherboard?.chipset || 'Placa Base ATX'} // {machine.ram.type}
          </span>
          <button
            type="button"
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all cursor-pointer flex items-center gap-1 text-[11px] px-2"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isInspectorOpen ? 'Ocultar Panel' : 'Ver Inspector'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Motherboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Motherboard Canvas (Lg: 8 or 12 Cols) */}
        <div
          className={`${
            isInspectorOpen ? 'lg:col-span-8' : 'lg:col-span-12'
          } transition-all duration-300 rounded-2xl border border-zinc-800/90 bg-[#05070c] p-4 sm:p-5 relative overflow-x-auto shadow-inner`}
        >
          {/* Subtle PCB Tech Traces Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#22d3ee 1px, transparent 1px), radial-gradient(#a855f7 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}
          />

          <div className="min-w-[700px] relative z-10 space-y-6">
            {/* SVG BUS OVERLAY LAYER (Connecting traces dynamically) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="trace-cpu-ram" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor={cpuRamFlow.color} />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>

                <linearGradient id="trace-cpu-gpu" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor={cpuGpuFlow.color} />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>

                <linearGradient id="trace-gpu-vram" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor={gpuVramFlow.color} />
                </linearGradient>

                <linearGradient id="trace-cpu-storage" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                <linearGradient id="trace-psu-cpu" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>

                <linearGradient id="trace-cooling" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>

              {/* Dynamic SVG Animated Circuit Lines will be drawn behind blocks */}
            </svg>

            {/* ROW 1: COOLING / CPU SOCKET / DDR MEMORY CHANNELS */}
            <div className="grid grid-cols-12 gap-3.5 items-stretch relative">
              {/* Cooling / Fans Module (Top-Left) */}
              <div
                onClick={() => handleSelect('COOLING')}
                className={`col-span-3 p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  activeSubsystem === 'COOLING'
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : isHighlighted('cooling')
                    ? 'border-cyan-400 bg-cyan-950/30 animate-pulse'
                    : 'border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700'
                }`}
              >
                {/* HUD Header */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-cyan-400 flex items-center gap-1.5">
                    <Fan className={`w-3.5 h-3.5 ${isPoweredOn ? 'animate-spin' : ''}`} />
                    COOLING & AIRFLOW
                  </span>
                  {getBadgePill(coolingState)}
                </div>

                <div className="my-2">
                  <div className="text-[11px] font-bold text-white truncate">
                    {frame?.cooling.cpuFanRpm ? `${frame.cooling.cpuFanRpm} RPM` : 'Disipación Activa'}
                  </div>
                  <div className="text-[9px] text-zinc-400">
                    PWM: {frame?.cooling.fanSpeedPct ?? 65}% • Soak: {frame?.cooling.thermalSoakFactorPct ?? 30}%
                  </div>
                </div>

                {/* HUD Provenance Tag */}
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/70">
                  <span>DISIPACIÓN TÉRMICA</span>
                  <span className="text-cyan-400 font-bold">SIMULATED</span>
                </div>
              </div>

              {/* Central CPU Die & Socket Hub (Cols 4..8) */}
              <div
                onClick={() => handleSelect('CPU')}
                className={`col-span-5 p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  activeSubsystem === 'CPU'
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(251,191,36,0.35)] ring-1 ring-amber-400'
                    : isHighlighted('cpu')
                    ? 'border-amber-400 bg-amber-950/30 animate-pulse ring-2 ring-amber-400'
                    : 'border-zinc-800/90 bg-zinc-900/70 hover:border-zinc-700'
                } ${frame?.cpu.isThrottling ? 'ring-2 ring-rose-500 animate-pulse' : ''}`}
              >
                {/* HUD Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span className="font-black text-xs text-amber-400 tracking-wide">
                      CPU DIE & IMC ROOT
                    </span>
                  </div>
                  {getBadgePill(cpuState)}
                </div>

                <div className="font-bold text-white text-xs truncate mb-2">
                  {machine.cpu.model.split('@')[0]}
                </div>

                {/* Live Digital Twin Metric HUD */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">USO</div>
                    <div className="text-amber-300 font-black font-mono">
                      {frame ? `${frame.cpu.loadPct}%` : '0%'}
                    </div>
                  </div>
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">TEMP</div>
                    <div
                      className={`font-black font-mono ${
                        (frame?.cpu.temperatureC || 45) >= 85 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {frame?.cpu.temperatureC ?? 45}°C
                    </div>
                  </div>
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">CLOCK</div>
                    <div className="text-cyan-300 font-black font-mono">
                      {frame ? `${(frame.cpu.effectiveClockMhz / 1000).toFixed(2)}G` : '3.8G'}
                    </div>
                  </div>
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">POWER</div>
                    <div className="text-yellow-300 font-black font-mono">
                      {frame ? `${frame.cpu.powerW}W` : `${machine.cpu.tdpW}W`}
                    </div>
                  </div>
                </div>

                {/* Sub-strip: Core Architecture & Provenance */}
                <div className="flex items-center justify-between text-[9px] text-zinc-400 mt-2 pt-1.5 border-t border-zinc-800/80">
                  <span>
                    {machine.cpu.cores} Cores / {machine.cpu.threads} Hilos
                  </span>
                  <span className="text-amber-400/90 font-bold uppercase text-[8px]">
                    PROV: {frame?.cpu.provenance || 'MEASURED / SIM'}
                  </span>
                </div>
              </div>

              {/* Memory Controller Bus (CPU ↔ RAM Interconnect) */}
              <div
                onClick={() => handleSelect('RAM')}
                className={`col-span-4 p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  activeSubsystem === 'RAM'
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                    : isHighlighted('ram')
                    ? 'border-cyan-400 bg-cyan-950/30 animate-pulse'
                    : 'border-zinc-800/90 bg-zinc-900/70 hover:border-zinc-700'
                }`}
              >
                {/* HUD Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold text-xs text-cyan-400">RAM / DIMM SLOTS</span>
                  </div>
                  {getBadgePill(ramState)}
                </div>

                <div className="font-bold text-white text-xs truncate">
                  {machine.ram.sizeGb} GB {machine.ram.type} @ {machine.ram.configuredSpeedMts} MT/s
                </div>

                {/* Live DIMM HUD */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] my-1.5">
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">OCUPACIÓN</div>
                    <div className="text-cyan-300 font-black font-mono">
                      {frame ? `${frame.ram.usedGb} GB` : '4.2 GB'}
                    </div>
                  </div>
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">PRESIÓN</div>
                    <div
                      className={`font-black font-mono ${
                        (frame?.ram.pressurePct || 30) >= 85 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {frame?.ram.pressurePct ?? 35}%
                    </div>
                  </div>
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">BUS B/W</div>
                    <div className="text-zinc-300 font-black font-mono">
                      {frame ? `${frame.ram.bandwidthUsagePct}%` : '20%'}
                    </div>
                  </div>
                </div>

                {/* Provenance and Channels */}
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/80">
                  <span>{machine.ram.channels === 2 ? 'Dual Channel (128-bit)' : 'Single Channel'}</span>
                  <span className="text-cyan-400 font-bold uppercase">
                    PROV: {frame?.ram.provenance || 'SYSTEM_REPORTED'}
                  </span>
                </div>
              </div>
            </div>

            {/* ROW 2: ACTIVE BUS INTERCONNECT LINES (Animated Traces) */}
            <div className="grid grid-cols-12 gap-3 items-center py-1">
              {/* PSU Power Lines to CPU & Motherboard */}
              <div
                onClick={() => handleSelect('PSU')}
                className="col-span-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-[9px] text-yellow-400 font-bold">
                  <Zap className="w-3 h-3 animate-pulse" />
                  <span>EPS 12V 8-PIN</span>
                </div>
                <div
                  className="h-1.5 flex-1 mx-2 rounded-full overflow-hidden bg-zinc-800 relative"
                  title="Riel de alimentación EPS 12V"
                >
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 animate-pulse"
                    style={{
                      width: `${psuLoadUtil}%`,
                      boxShadow: psuFlow.glow,
                    }}
                  />
                </div>
                <span className="text-[8px] font-mono text-zinc-400">{frame?.cpu.powerW ?? 65}W</span>
              </div>

              {/* Main PCIe 4.0/5.0 x16 Link (CPU ↔ GPU) */}
              <div
                onClick={() => handleSelect('BUS')}
                className="col-span-6 flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 cursor-pointer group hover:border-emerald-500/50"
              >
                <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold">
                  <Activity className="w-3 h-3" />
                  <span>PCIe x16 ROOT LINK</span>
                </div>
                <div
                  className="h-2 flex-1 mx-3 rounded-full overflow-hidden bg-zinc-800 relative"
                  title="Bus PCIe Directo de CPU a GPU"
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(15, cpuGpuUtil)}%`,
                      backgroundColor: cpuGpuFlow.color,
                      boxShadow: cpuGpuFlow.glow,
                    }}
                  />
                </div>
                <span className="text-[9px] font-mono text-emerald-300 font-bold">
                  {frame ? `${frame.buses.cpuGpu.effectiveDemandGbps} GB/s` : 'PCIe 4.0'}
                </span>
              </div>

              {/* Memory Controller Interconnect (CPU ↔ RAM bus rate) */}
              <div
                onClick={() => handleSelect('BUS')}
                className="col-span-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-bold">
                  <span>DDR BUS</span>
                </div>
                <div className="h-1.5 flex-1 mx-2 rounded-full overflow-hidden bg-zinc-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(15, cpuRamUtil)}%`,
                      backgroundColor: cpuRamFlow.color,
                      boxShadow: cpuRamFlow.glow,
                    }}
                  />
                </div>
                <span className="text-[8px] font-mono text-zinc-300">
                  {frame ? `${frame.buses.cpuRam.effectiveDemandGbps} GB/s` : `${machine.ram.configuredSpeedMts} MT/s`}
                </span>
              </div>
            </div>

            {/* ROW 3: GPU DIE & DEDICATED VRAM (GDDR MODULES) */}
            <div className="grid grid-cols-12 gap-3.5 items-stretch">
              {/* GPU Subsystem (Cols 1..8) */}
              <div
                onClick={() => handleSelect('GPU')}
                className={`col-span-8 p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  activeSubsystem === 'GPU'
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400'
                    : isHighlighted('gpu')
                    ? 'border-emerald-400 bg-emerald-950/30 animate-pulse ring-2 ring-emerald-400'
                    : 'border-zinc-800/90 bg-zinc-900/70 hover:border-zinc-700'
                } ${frame?.gpu.isThermalLimiting ? 'ring-2 ring-rose-500 animate-pulse' : ''}`}
              >
                {/* HUD Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-emerald-400" />
                    <span className="font-black text-xs text-emerald-400 tracking-wide">
                      GPU DIE (RASTER & SHADER CORES)
                    </span>
                  </div>
                  {getBadgePill(gpuState)}
                </div>

                <div className="font-bold text-white text-xs truncate mb-2" title={machine.gpu.model}>
                  {machine.gpu.model}
                </div>

                {/* Live GPU HUD Metrics */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">USO GPU</div>
                    <div className="text-emerald-300 font-black font-mono">
                      {frame ? `${frame.gpu.loadPct}%` : '0%'}
                    </div>
                  </div>
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">TEMP</div>
                    <div
                      className={`font-black font-mono ${
                        (frame?.gpu.temperatureC || 40) >= 80 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {frame?.gpu.temperatureC ?? 42}°C
                    </div>
                  </div>
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">CLOCK</div>
                    <div className="text-cyan-300 font-black font-mono">
                      {frame ? `${frame.gpu.effectiveClockMhz} MHz` : 'Base'}
                    </div>
                  </div>
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">POWER</div>
                    <div className="text-yellow-300 font-black font-mono">
                      {frame ? `${frame.gpu.powerW}W` : `${machine.gpu.powerW}W`}
                    </div>
                  </div>
                </div>

                {/* Sub-strip: Architecture & Provenance */}
                <div className="flex items-center justify-between text-[9px] text-zinc-400 mt-2 pt-1.5 border-t border-zinc-800/80">
                  <span>
                    {machine.gpu.isDedicated ? 'GPU Dedicada en Ranura PCIe' : 'Gráficos Integrados en SoC'}
                  </span>
                  <span className="text-emerald-400/90 font-bold uppercase text-[8px]">
                    PROV: {frame?.gpu.provenance || 'MEASURED / SIM'}
                  </span>
                </div>
              </div>

              {/* Dedicated VRAM GDDR Modules (Cols 9..12) */}
              <div
                onClick={() => handleSelect('VRAM')}
                className={`col-span-4 p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  activeSubsystem === 'VRAM'
                    ? 'border-purple-400 bg-purple-950/40 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                    : isHighlighted('vram')
                    ? 'border-purple-400 bg-purple-950/30 animate-pulse'
                    : 'border-zinc-800/90 bg-zinc-900/70 hover:border-zinc-700'
                }`}
              >
                {/* HUD Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-bold text-xs text-purple-400">VRAM DEDICADA</span>
                  </div>
                  {getBadgePill(vramState)}
                </div>

                <div className="font-bold text-white text-xs truncate">
                  {machine.gpu.vramGb} GB VRAM Buffer
                </div>

                {/* Live VRAM HUD */}
                <div className="grid grid-cols-2 gap-1.5 text-center text-[10px] my-1.5">
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">VRAM EN USO</div>
                    <div className="text-purple-300 font-black font-mono">
                      {frame ? `${frame.gpu.vramUsedGb} / ${frame.gpu.vramTotalGb}GB` : `${machine.gpu.vramGb} GB`}
                    </div>
                  </div>
                  <div className="bg-black/50 p-1 rounded-lg border border-zinc-800">
                    <div className="text-zinc-500 text-[8px] font-bold">PRESIÓN</div>
                    <div
                      className={`font-black font-mono ${
                        (frame?.gpu.vramPressurePct || 25) >= 90 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {frame?.gpu.vramPressurePct ?? 25}%
                    </div>
                  </div>
                </div>

                {/* Sub-strip */}
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/80">
                  <span>BUS GDDR6/X</span>
                  <span className="text-purple-400 font-bold uppercase">PROV: SIMULATED</span>
                </div>
              </div>
            </div>

            {/* ROW 4: STORAGE / CHIPSET / NETWORK / PSU (Bottom Foundation) */}
            <div className="grid grid-cols-12 gap-3.5 items-stretch">
              {/* PSU Power Supply (Cols 1..3) */}
              <div
                onClick={() => handleSelect('PSU')}
                className={`col-span-3 p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  activeSubsystem === 'PSU'
                    ? 'border-yellow-400 bg-yellow-950/40 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                    : isHighlighted('psu')
                    ? 'border-yellow-400 bg-yellow-950/30 animate-pulse'
                    : 'border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-yellow-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> PSU POWER
                  </span>
                  {getBadgePill(psuState)}
                </div>

                <div className="my-1">
                  <div className="text-xs font-black text-white font-mono">
                    {frame ? `${frame.psu.estimatedLoadW}W` : '120W'} / {frame?.psu.ratedWattageW ?? machine.psu.wattageW}W
                  </div>
                  <div className="text-[9px] text-zinc-400">
                    Margen: {frame?.psu.headroomW ?? (machine.psu.wattageW - 120)}W ({frame?.psu.headroomPct ?? 75}%)
                  </div>
                </div>

                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/70">
                  <span>RIEL +12V ATX</span>
                  <span className="text-yellow-400 font-bold">DERIVED</span>
                </div>
              </div>

              {/* NVMe / Storage M.2 Slot (Cols 4..6) */}
              <div
                onClick={() => handleSelect('STORAGE')}
                className={`col-span-3 p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  activeSubsystem === 'STORAGE'
                    ? 'border-purple-400 bg-purple-950/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : isHighlighted('storage')
                    ? 'border-purple-400 bg-purple-950/30 animate-pulse'
                    : 'border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-purple-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" /> STORAGE NVME
                  </span>
                  {getBadgePill(storageState)}
                </div>

                <div className="my-1">
                  <div className="text-xs font-bold text-white truncate">
                    {machine.storage.capacityGb} GB {machine.storage.type}
                  </div>
                  <div className="text-[9px] text-zinc-400">
                    Lectura: {frame ? `${frame.storage.readSpeedMBps} MB/s` : '0 MB/s'} • {frame?.storage.temperatureC ?? 41}°C
                  </div>
                </div>

                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/70">
                  <span>PCIe M.2 LINK</span>
                  <span className="text-purple-400 font-bold">MEASURED</span>
                </div>
              </div>

              {/* Chipset / PCH Hub (Cols 7..9) */}
              <div
                onClick={() => handleSelect('CHIPSET')}
                className={`col-span-3 p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  activeSubsystem === 'CHIPSET'
                    ? 'border-blue-400 bg-blue-950/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : isHighlighted('chipset')
                    ? 'border-blue-400 bg-blue-950/30 animate-pulse'
                    : 'border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-blue-400 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" /> CHIPSET PCH
                  </span>
                  {getBadgePill(chipsetState)}
                </div>

                <div className="my-1">
                  <div className="text-xs font-bold text-white truncate">
                    {machine.motherboard?.chipset || 'Southbridge Hub'}
                  </div>
                  <div className="text-[9px] text-zinc-400">
                    DMI Link x8 • I/O Lanes activas
                  </div>
                </div>

                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/70">
                  <span>BUS DE INTERCONEXIÓN</span>
                  <span className="text-blue-400 font-bold">SYSTEM_REPORTED</span>
                </div>
              </div>

              {/* Network NIC Controller (Cols 10..12) */}
              <div
                onClick={() => handleSelect('NETWORK')}
                className={`col-span-3 p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  activeSubsystem === 'NETWORK'
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : isHighlighted('network')
                    ? 'border-emerald-400 bg-emerald-950/30 animate-pulse'
                    : 'border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-emerald-400 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" /> NETWORK PHY
                  </span>
                  {getBadgePill(networkState)}
                </div>

                <div className="my-1">
                  <div className="text-xs font-bold text-white">
                    Ethernet 2.5G / Wi-Fi 6E
                  </div>
                  <div className="text-[9px] text-zinc-400">
                    Tráfico: {frame ? `${frame.buses.chipsetNetwork.effectiveDemandGbps} Mbps` : '1.2 Mbps'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/70">
                  <span>PAQUETES / BUFFER</span>
                  <span className="text-emerald-400 font-bold">DERIVED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPONENT DEEP INSPECTION SIDEBAR DRAWER (Lg: 4 Cols) */}
        {isInspectorOpen && (
          <div className="lg:col-span-4 rounded-2xl border border-zinc-800 bg-[#0a0d14] p-4.5 space-y-4 shadow-2xl relative">
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
              {/* Metric Breakdown Cards */}
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

              {/* Deep Technical Analysis / Root Cause */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
                <div className="text-[10px] text-zinc-400 font-bold uppercase flex items-center justify-between">
                  <span>DIAGNÓSTICO PERICIAL</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-cyan-400 font-bold">
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
                    (frame?.gpu.vramPressurePct && frame.gpu.vramPressurePct > 90
                      ? 'Buffer de texturas y shaders al límite de capacidad. Riesgo de caídas bruscas de 1% Low FPS.'
                      : 'Memoria de video suficiente para la resolución y preset gráfico seleccionados.')}

                  {activeSubsystem === 'PSU' &&
                    (frame?.psu.headroomPct && frame.psu.headroomPct < 20
                      ? 'Margen de potencia en la fuente de alimentación reducido. Riesgo de picos transitorios (power spikes).'
                      : 'La fuente entrega potencia estable en rieles de 12V con margen de seguridad adecuado.')}

                  {activeSubsystem === 'STORAGE' &&
                    'Las colas de lectura I/O del NVMe no presentan bloqueos en streaming de texturas pesadas.'}

                  {activeSubsystem === 'COOLING' &&
                    'El factor de absorción térmica del chasis disipa el calor generado por CPU y GPU sin saturación.'}

                  {activeSubsystem === 'CHIPSET' &&
                    'El puente sur (PCH) distribuye el ancho de banda PCIe secundario sin cuellos de botella.'}

                  {activeSubsystem === 'NETWORK' &&
                    'Buffer de paquetes con baja latencia y sin pérdida de frames por contención de red.'}

                  {activeSubsystem === 'BUS' &&
                    'La topología PCIe / DDR garantiza comunicación directa entre procesador y acelerador gráfico.'}
                </p>

                {/* Provenance Badge breakdown */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-bold">Procedencia de datos:</span>
                  <span className="font-mono text-cyan-400 font-black">
                    {activeSubsystem === 'CPU' && (frame?.cpu.provenance || 'MEASURED / SIM')}
                    {activeSubsystem === 'GPU' && (frame?.gpu.provenance || 'MEASURED / SIM')}
                    {activeSubsystem === 'RAM' && (frame?.ram.provenance || 'SYSTEM_REPORTED')}
                    {activeSubsystem === 'VRAM' && 'SIMULATED'}
                    {activeSubsystem === 'STORAGE' && 'MEASURED'}
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
    </div>
  );
};
