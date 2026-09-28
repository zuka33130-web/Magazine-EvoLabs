import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Cpu,
  Terminal,
  Activity,
  Zap,
  Gauge,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Server,
  Layers,
  ArrowRight,
  Maximize2,
  Radio,
  Flame,
  Clock,
  HardDrive,
  Lock,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { useEvoOperatingMode } from '../../../../hooks/useEvoOperatingMode';
import { EvoOperatingModeSelector } from '../../../common/EvoOperatingModeSelector';
import { useLabAestheticMode } from '../../../../utils/labAestheticMode';
import { EvoLabAestheticToggle } from '../../../common/EvoLabAestheticToggle';

export interface EvoWindowsMatrixLabProps {
  initialBuild?: 'win10-22h2' | 'win10-ltsc' | 'win11-23h2' | 'win11-24h2';
  initialSilicon?: 'hybrid' | 'vcache' | 'monolithic';
  initialScenario?: string;
  onNavigateToHardwareBench?: () => void;
  onOpenTomo?: (tomoId: string) => void;
}

// Windows Builds specifications
interface WindowsBuildData {
  id: string;
  name: string;
  buildNumber: string;
  codename: string;
  year: string;
  badgeColor: string;
  schedulerType: string;
  schedulerDesc: string;
  ramBasalMb: number;
  session0Count: number; // Services / Kernel
  session1Count: number; // User Desktop / Shell
  vbsDefault: boolean;
  syscallLatencyNs: number; // Base syscall overhead
  fastStartupDefault: boolean;
  avx512Optimization: string;
  threadDirectorLevel: 'Ninguno (SMP Clásico)' | 'EHGS v1 (Básico)' | 'Thread Director 2.0 (Dynamic QoS)';
  pros: string[];
  cons: string[];
}

const WINDOWS_BUILDS: Record<string, WindowsBuildData> = {
  'win10-22h2': {
    id: 'win10-22h2',
    name: 'Windows 10 22H2 Home/Pro',
    buildNumber: 'Build 19045.4500',
    codename: '22H2 (Vibranium Refreshed)',
    year: '2022-2025',
    badgeColor: '#38bdf8',
    schedulerType: 'Planificador Clásico SMP (Uniforme)',
    schedulerDesc: 'No distingue capacidades energéticas entre núcleos. Trata núcleos de alto rendimiento y bajo consumo como idénticos.',
    ramBasalMb: 2450,
    session0Count: 94,
    session1Count: 54,
    vbsDefault: false,
    syscallLatencyNs: 145,
    fastStartupDefault: true,
    avx512Optimization: 'Legacy x86 context-switching',
    threadDirectorLevel: 'Ninguno (SMP Clásico)',
    pros: [
      'Sin penalización obligatoria de seguridad VBS/HVCI',
      'Shell clásico de bajo consumo de GPU',
      'Ecosistema maduro de drivers legacy'
    ],
    cons: [
      'Asigna hilos críticos de juegos a E-Cores en CPUs híbridas',
      'No realiza Core Parking selectivo para 3D V-Cache sin software externo',
      'Servicios de telemetría y diagnósticos CEIP activos por defecto'
    ]
  },
  'win10-ltsc': {
    id: 'win10-ltsc',
    name: 'Windows 10 Enterprise LTSC 2021',
    buildNumber: 'Build 19044.3800',
    codename: '21H2 LTSC (Clean Industrial Kernel)',
    year: '2021-2031',
    badgeColor: '#10b981',
    schedulerType: 'Planificador SMP Minimalista',
    schedulerDesc: 'Kernel ultra limpio sin contenedor de aplicaciones UWP de fondo ni servicios publicitarios de Microsoft Store.',
    ramBasalMb: 1180,
    session0Count: 46,
    session1Count: 16,
    vbsDefault: false,
    syscallLatencyNs: 120,
    fastStartupDefault: false,
    avx512Optimization: 'Legacy x86 context-switching',
    threadDirectorLevel: 'Ninguno (SMP Clásico)',
    pros: [
      'Huella basal de RAM más baja del mercado (<1.2 GB)',
      'Cero aplicaciones UWP en segundo plano (sin Cortana/Edge/Xbox)',
      'Máxima estabilidad para estaciones de audio y simuladores de vuelo'
    ],
    cons: [
      'Requiere asignación manual de afinidad (Process Lasso) en Intel 12/13/14 Gen',
      'Sin soporte para DirectX 12 Agility SDK moderno'
    ]
  },
  'win11-23h2': {
    id: 'win11-23h2',
    name: 'Windows 11 23H2 (Moment 4)',
    buildNumber: 'Build 22631.3700',
    codename: 'Sun Valley 2 / Nickel',
    year: '2023-2024',
    badgeColor: '#a855f7',
    schedulerType: 'Heterogeneous Scheduler v1 (HGS+)',
    schedulerDesc: 'Soporte para Intel Thread Director. Incorpora aislamiento de núcleo HVCI y VBS forzado de fábrica.',
    ramBasalMb: 3150,
    session0Count: 116,
    session1Count: 78,
    vbsDefault: true,
    syscallLatencyNs: 285,
    fastStartupDefault: true,
    avx512Optimization: 'Standard NT Paging',
    threadDirectorLevel: 'EHGS v1 (Básico)',
    pros: [
      'Asignación inteligente de tareas de fondo a E-Cores',
      'HAGS (Hardware Accelerated GPU Scheduling) maduro',
      'Seguridad perimetral hipervisor-enforced contra exploits de memoria'
    ],
    cons: [
      'Penalización de +15-20% en syscalls por aislamiento de núcleo (HVCI)',
      'Consumo basal de RAM elevado por Windows Widgets, Teams y Edge Webview',
      'Bug conocido en predicción de ramas en arquitecturas Zen 3 / Zen 4'
    ]
  },
  'win11-24h2': {
    id: 'win11-24h2',
    name: 'Windows 11 24H2 (Germanium Kernel)',
    buildNumber: 'Build 26100.1150',
    codename: 'Germanium / 2024 Overhaul',
    year: '2024-2026',
    badgeColor: '#f59e0b',
    schedulerType: 'Thread Director 2.0 & Zen Branch Patcher',
    schedulerDesc: 'Reescritura completa del planificador NT para AVX-512, predicción de saltos branch-target en AMD Zen 4/5 y micro-QoS para Intel.',
    ramBasalMb: 2820,
    session0Count: 102,
    session1Count: 66,
    vbsDefault: true,
    syscallLatencyNs: 180,
    fastStartupDefault: true,
    avx512Optimization: 'AVX-512 & Vector Register Direct Context Routing',
    threadDirectorLevel: 'Thread Director 2.0 (Dynamic QoS)',
    pros: [
      'Elimina cuello de botella en CPU AMD Ryzen 7000/9000 (+3% a +11% en juegos)',
      'Core Parking nativo sin dependencia de Game Bar para chips dual CCD con 3D V-Cache',
      'Fast-path optimizado en hypervisor hypercalls que reduce penalización HVCI a <5%'
    ],
    cons: [
      'Exige CPU con instrucción SSE4.2 y POPCNT estricto para arrancar',
      'Telemetría Copilot integrada en subsistema de búsqueda'
    ]
  }
};

export const EvoWindowsMatrixLab: React.FC<EvoWindowsMatrixLabProps> = ({
  initialBuild = 'win11-24h2',
  initialSilicon = 'hybrid',
  initialScenario,
  onNavigateToHardwareBench,
  onOpenTomo,
}) => {
  const { isPericial } = useEvoOperatingMode();
  const { isElite } = useLabAestheticMode();

  // State: Windows Build Matrix
  const [selectedBuildId, setSelectedBuildId] = useState<string>(initialBuild);
  const [vbsEnabled, setVbsEnabled] = useState<boolean>(WINDOWS_BUILDS[initialBuild]?.vbsDefault ?? true);
  const [fastStartupEnabled, setFastStartupEnabled] = useState<boolean>(true);
  const [diagTrackEnabled, setDiagTrackEnabled] = useState<boolean>(true);
  const [hagsEnabled, setHagsEnabled] = useState<boolean>(true);

  // State: Silicon Scheduler Simulator
  const [selectedSilicon, setSelectedSilicon] = useState<'hybrid' | 'vcache' | 'monolithic'>(initialSilicon);
  const [gameRunning, setGameRunning] = useState<boolean>(true);
  const [backgroundLoadActive, setBackgroundLoadActive] = useState<boolean>(true);
  const [tdpTotalWatts, setTdpTotalWatts] = useState<number>(28); // 15W to 45W

  // State: DPC / ISR Oscilloscope
  const [driverProfile, setDriverProfile] = useState<'whql' | 'oem' | 'debloated' | 'conflict'>('whql');
  const [timerResolutionMs, setTimerResolutionMs] = useState<number>(0.5); // 0.5ms (EVO), 1.0ms, 15.625ms
  const [isInjectingConflict, setIsInjectingConflict] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Canvas ref for real-time oscilloscope
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const waveformHistoryRef = useRef<number[]>([]);

  // Pre-load scenario when prop changes
  useEffect(() => {
    if (initialScenario) {
      if (initialScenario === 'boot-sequence') {
        setSelectedBuildId('win10-22h2');
        setFastStartupEnabled(true);
      } else if (initialScenario === 'dpc-conflict') {
        setDriverProfile('conflict');
        setIsInjectingConflict(true);
      } else if (initialScenario === 'scheduler-hybrid') {
        setSelectedSilicon('hybrid');
        setSelectedBuildId('win10-22h2');
      } else if (initialScenario === 'timer-resolution') {
        setTimerResolutionMs(15.625);
      } else if (initialScenario === 'vcache-parking') {
        setSelectedSilicon('vcache');
        setSelectedBuildId('win11-24h2');
      }
    }
  }, [initialScenario]);

  // Synchronize VBS default when build changes unless manually overridden
  const currentBuild = WINDOWS_BUILDS[selectedBuildId] || WINDOWS_BUILDS['win11-24h2'];

  // Calculated reactive metrics
  const activeRamBasal = useMemo(() => {
    let ram = currentBuild.ramBasalMb;
    if (vbsEnabled) ram += 220; // Hypervisor isolation pool
    if (diagTrackEnabled) ram += 95; // Telemetry worker threads
    if (fastStartupEnabled) ram += 60; // Hibernate state cache
    return ram;
  }, [currentBuild, vbsEnabled, diagTrackEnabled, fastStartupEnabled]);

  const activeSyscallPenalty = useMemo(() => {
    let latency = currentBuild.syscallLatencyNs;
    if (vbsEnabled) {
      // 24H2 has hypercall fast path, 23H2 has heavier overhead
      latency += selectedBuildId === 'win11-24h2' ? 35 : selectedBuildId === 'win11-23h2' ? 140 : 90;
    }
    return latency;
  }, [currentBuild, vbsEnabled, selectedBuildId]);

  // =========================================================================
  // MOTOR A: THREAD DIRECTOR & SCHEDULER MATHEMATICAL MODEL
  // =========================================================================
  const schedulerMetrics = useMemo(() => {
    const baseFrameTime = 16.67; // 60 FPS Baseline target
    let frameTime = baseFrameTime;
    let jitterMs = 0.4;
    let isMisroutedToECore = false;
    let baseFps = 60.0;

    if (selectedSilicon === 'hybrid') {
      if (selectedBuildId.startsWith('win10')) {
        // Win10 lacks Thread Director 2.0 EHFI feedback: Heavy thread lands on E-Core (25% lower IPC)
        isMisroutedToECore = true;
        frameTime = +(baseFrameTime * 1.33).toFixed(2); // 22.17 ms
        jitterMs = 4.8; // Exponential jitter due to quantum starvation
        baseFps = +(1000 / frameTime).toFixed(1); // ~45.1 FPS
      } else if (selectedBuildId === 'win11-24h2') {
        // Win11 24H2 Thread Director 2.0 routes heavy game render loop directly to P-Cores
        isMisroutedToECore = false;
        frameTime = baseFrameTime;
        jitterMs = 0.4;
        baseFps = 60.0;
      } else {
        // Win11 23H2 (HGS+ v1)
        isMisroutedToECore = false;
        frameTime = +(baseFrameTime * 1.05).toFixed(2);
        jitterMs = 1.2;
        baseFps = +(1000 / frameTime).toFixed(1);
      }
    } else if (selectedSilicon === 'vcache') {
      if (selectedBuildId === 'win11-24h2') {
        frameTime = baseFrameTime;
        jitterMs = 0.3;
        baseFps = 60.0;
      } else {
        frameTime = +(baseFrameTime * 1.18).toFixed(2); // CCX hop penalty across Infinity Fabric
        jitterMs = 3.2;
        baseFps = +(1000 / frameTime).toFixed(1);
      }
    } else {
      // Monolithic
      frameTime = baseFrameTime;
      jitterMs = 0.6;
      baseFps = 60.0;
    }

    return {
      baseFrameTime,
      frameTime,
      jitterMs,
      isMisroutedToECore,
      baseFps
    };
  }, [selectedSilicon, selectedBuildId]);

  // =========================================================================
  // MOTOR B: SOC / MINI PC THERMAL CONTENTION MODEL
  // =========================================================================
  const thermalContentionMetrics = useMemo(() => {
    const cpuIdleWatts = 2.5;
    const serviciosFondoWatts = diagTrackEnabled ? 5.2 : 0.8;
    const presupuestoGpuWatts = +(tdpTotalWatts - (cpuIdleWatts + serviciosFondoWatts)).toFixed(1);
    const downclockGpu = serviciosFondoWatts > 4.5;
    
    // Base FPS before thermal throttling
    const baseFps = schedulerMetrics.baseFps;
    // If downclock is active: reduce projected FPS by 28%
    const projectedFps = downclockGpu ? +(baseFps * 0.72).toFixed(1) : baseFps;
    const gpuClockMhz = downclockGpu ? 1450 : 2700;

    return {
      cpuIdleWatts,
      serviciosFondoWatts,
      presupuestoGpuWatts,
      downclockGpu,
      projectedFps,
      gpuClockMhz,
      tdpTotalWatts
    };
  }, [tdpTotalWatts, diagTrackEnabled, schedulerMetrics.baseFps]);

  // =========================================================================
  // MOTOR C: REAL-TIME DPC LATENCY & 1% LOW STATISTICAL ENGINE
  // =========================================================================
  const dpcMetrics = useMemo(() => {
    let baseNvlddmkm = 75;
    let baseNdis = 35;
    let baseStorport = 30;
    let baseNtoskrnl = 20;

    if (driverProfile === 'oem') {
      baseNvlddmkm = 340;
      baseNdis = 180;
      baseStorport = 90;
    } else if (driverProfile === 'debloated') {
      baseNvlddmkm = 22;
      baseNdis = 16;
      baseStorport = 18;
    } else if (driverProfile === 'conflict' || isInjectingConflict) {
      baseNvlddmkm = 980;
      baseNdis = 420;
      baseStorport = 310;
    }

    // Timer resolution impact on quantum jitter
    const jitterFactor = timerResolutionMs === 0.5 ? 0.08 : timerResolutionMs === 1.0 ? 0.22 : 0.75;
    const peakDpc = +(baseNvlddmkm * (1 + jitterFactor)).toFixed(1);
    const avgIsr = +(baseNdis * 0.45).toFixed(1);

    const status = peakDpc < 100 
      ? 'OPTIMO' 
      : peakDpc <= 500 
      ? 'ADVERTENCIA' 
      : 'CRITICO';

    // Statistical 1% Low Percentile calculation using Standard Deviation:
    // Percentil_1Low = 1000 / (FrameTime_Medio + (2.33 * StDev_Jitter))
    const stDevJitter = (peakDpc / 100) * (timerResolutionMs === 0.5 ? 0.35 : timerResolutionMs === 1.0 ? 1.1 : 3.2);
    const frameTimeMedio = schedulerMetrics.frameTime;
    const percentil_1Low = +(1000 / (frameTimeMedio + (2.33 * stDevJitter))).toFixed(1);

    return {
      peakDpc,
      avgIsr,
      nvlddmkm: baseNvlddmkm,
      ndis: baseNdis,
      storport: baseStorport,
      ntoskrnl: baseNtoskrnl,
      status,
      jitterFactor,
      stDevJitter: +stDevJitter.toFixed(2),
      percentil_1Low
    };
  }, [driverProfile, isInjectingConflict, timerResolutionMs, schedulerMetrics.frameTime]);

  // Oscilloscope Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanX = 0;
    const bufferLength = 300;
    if (waveformHistoryRef.current.length === 0) {
      waveformHistoryRef.current = new Array(bufferLength).fill(50);
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark background with phosphor persistence fade
      ctx.fillStyle = 'rgba(8, 10, 13, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      ctx.lineWidth = 1;
      const gridSpacingX = 30;
      const gridSpacingY = 25;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSpacingX) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSpacingY) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Safe threshold line (< 100µs)
      const safeY = height - (100 / 1200) * height;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, safeY);
      ctx.lineTo(width, safeY);
      ctx.stroke();

      // Critical threshold line (> 800µs)
      const critY = height - (800 / 1200) * height;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, critY);
      ctx.lineTo(width, critY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Generate next waveform sample based on current DPC state
      const targetDpc = dpcMetrics.peakDpc;
      const randomNoise = (Math.random() - 0.5) * (targetDpc * dpcMetrics.jitterFactor * 0.6);
      let sample = targetDpc + randomNoise;
      if (driverProfile === 'conflict' && Math.random() > 0.85) {
        sample += 450; // Random massive DPC latency spikes
      }
      sample = Math.max(10, Math.min(1200, sample));

      // Push to history
      waveformHistoryRef.current.push(sample);
      if (waveformHistoryRef.current.length > bufferLength) {
        waveformHistoryRef.current.shift();
      }

      // Draw Waveform Line
      const history = waveformHistoryRef.current;
      const step = width / (bufferLength - 1);

      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;

      if (dpcMetrics.status === 'OPTIMO') {
        ctx.strokeStyle = '#10b981';
        ctx.shadowColor = '#10b981';
      } else if (dpcMetrics.status === 'ADVERTENCIA') {
        ctx.strokeStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
      } else {
        ctx.strokeStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
      }

      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const val = history[i];
        const y = height - (val / 1200) * height;
        const x = i * step;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // Draw active scanner head beam
      scanX = (scanX + 3) % width;
      ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.fillRect(scanX - 1, 0, 2, height);

      // Trigger next frame
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [dpcMetrics, driverProfile]);

  // Copy PowerShell diagnostic script
  const handleCopyDiagScript = () => {
    const cmd = `Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, BuildNumber, NumberOfProcesses; (Get-Process).Count; (Get-Service | Where-Object {$_.Status -eq 'Running'}).Count; bcdedit /enum {current} | findstr "useplatformclock hypervisorlaunchtype"`;
    navigator.clipboard.writeText(cmd);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="w-full bg-[#080a0d] text-[#f4f4f6] font-mono-tech select-none space-y-6">
      
      {/* Top Header Aero Glass Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0e14]/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider">
                KERNEL NT 10.0 // RING 0 FORENSICS
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                THREAD DIRECTOR 2.0 & DPC LAB
              </span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              MATRIZ DE VERSIONES & PLANIFICADOR DE KERNEL
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial max-w-3xl leading-relaxed">
              {isPericial
                ? 'Simulador determinista de planificadores NTOSKRNL, mitigaciones VBS/HVCI, direccionamiento de hilos heterogéneos y análisis oscilográfico de latencias diferidas DPC en microsegundos.'
                : 'Explorá cómo cada versión de Windows impacta tus FPS y latencia: descubrí por qué Windows 10 se traba con procesadores modernos y cómo reducir los micro-tirones en 1 clic.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0 flex-wrap">
            <EvoOperatingModeSelector compact />

            {/* Design & Typography Aesthetic Mode Toggle (Elite Engineering vs Classic) */}
            <EvoLabAestheticToggle />

            {onNavigateToHardwareBench && (
              <button
                type="button"
                onClick={onNavigateToHardwareBench}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)]"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>BANCO HOT-SWAP</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN A: SELECTOR MATRICIAL DE COMPILACIONES DE WINDOWS                */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0e14]/80 border border-zinc-800/90 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-tight">
                SECCIÓN A // SELECTOR MATRICIAL DE COMPILACIONES WINDOWS
              </h2>
              <span className="text-[10px] text-zinc-400 font-sans-editorial">
                Comparativa de huella basal de memoria, procesos en Sesión 0 y penalización por syscall
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 text-[10px]">COMPILACIÓN ACTIVA:</span>
            <span className="font-bold text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700">
              {currentBuild.buildNumber}
            </span>
          </div>
        </div>

        {/* Matrix Build Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(WINDOWS_BUILDS).map((b) => {
            const isSelected = b.id === selectedBuildId;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedBuildId(b.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-zinc-900/90 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-black/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-cyan-400 text-black text-[9px] font-black uppercase rounded-bl">
                    EN BANCO
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    {b.year} // {b.codename}
                  </span>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-white">
                    {b.name}
                  </h3>
                  <span className="text-[11px] text-cyan-300 font-mono block">
                    {b.buildNumber}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-zinc-800/80 space-y-1.5 text-[10px] font-mono">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>RAM Basal:</span>
                    <span className="font-bold text-white">{b.ramBasalMb} MB</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>Planificador:</span>
                    <span className="font-bold text-amber-300 truncate max-w-[120px]">{b.threadDirectorLevel}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>VBS/HVCI:</span>
                    <span className={b.vbsDefault ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {b.vbsDefault ? 'Activo (Seguro)' : 'Inactivo (Rápido)'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Basal RAM Consumption Box */}
          <div className="p-4 rounded-xl bg-black/60 border border-zinc-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                CONSUMO BASAL DE RAM
              </span>
              <span className="text-cyan-300 font-bold text-sm">{activeRamBasal} MB</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (activeRamBasal / 4000) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-sans-editorial">
              <span>LTSC Limpio (~1.1 GB)</span>
              <span>Windows 11 Bloat (~3.2 GB)</span>
            </div>
          </div>

          {/* Session 0 vs Session 1 Process Breakdown */}
          <div className="p-4 rounded-xl bg-black/60 border border-zinc-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                SESIÓN 0 (KERNEL) VS SESIÓN 1 (USER)
              </span>
              <span className="text-white font-bold">{currentBuild.session0Count + currentBuild.session1Count} proc</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-zinc-900">
              <div
                className="bg-amber-400"
                style={{ width: `${(currentBuild.session0Count / (currentBuild.session0Count + currentBuild.session1Count)) * 100}%` }}
                title={`Sesión 0 (Servicios de sistema): ${currentBuild.session0Count}`}
              />
              <div
                className="bg-cyan-400"
                style={{ width: `${(currentBuild.session1Count / (currentBuild.session0Count + currentBuild.session1Count)) * 100}%` }}
                title={`Sesión 1 (Shell de usuario y apps): ${currentBuild.session1Count}`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span className="text-amber-300">Sesión 0: {currentBuild.session0Count} servicios</span>
              <span className="text-cyan-300">Sesión 1: {currentBuild.session1Count} apps</span>
            </div>
          </div>

          {/* Syscall Latency & Core Isolation Penalty */}
          <div className="p-4 rounded-xl bg-black/60 border border-zinc-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                LATENCIA DE SYSCALL (RING 3 → RING 0)
              </span>
              <span className="text-emerald-300 font-bold text-sm">{activeSyscallPenalty} ns</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${activeSyscallPenalty > 220 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                style={{ width: `${Math.min(100, (activeSyscallPenalty / 350) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>Sobrecarga VBS/HVCI:</span>
              <span className={vbsEnabled ? 'text-amber-300 font-bold' : 'text-emerald-300 font-bold'}>
                {vbsEnabled ? '+14.2% (Hipervisor activo)' : '0% (Kernel nativo)'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Kernel Switches Bar */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
            INTERVENCIÓN DE KERNEL EN CALIENTE:
          </span>

          <div className="flex items-center gap-3 flex-wrap">
            {/* VBS / Core Isolation Toggle */}
            <button
              type="button"
              onClick={() => setVbsEnabled(!vbsEnabled)}
              className={`px-3 py-1 rounded-lg border font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all ${
                vbsEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>VBS / HVCI (Aislamiento de Núcleo): {vbsEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Fast Startup Toggle */}
            <button
              type="button"
              onClick={() => setFastStartupEnabled(!fastStartupEnabled)}
              className={`px-3 py-1 rounded-lg border font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all ${
                fastStartupEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fast Startup (hiberfil.sys): {fastStartupEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* DiagTrack Telemetry Toggle */}
            <button
              type="button"
              onClick={() => setDiagTrackEnabled(!diagTrackEnabled)}
              className={`px-3 py-1 rounded-lg border font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all ${
                diagTrackEnabled
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>DiagTrack Telemetría: {diagTrackEnabled ? 'ACTIVA' : 'DESACTIVADA'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN B: SIMULADOR DE PLANIFICADOR DE CPU (THREAD DIRECTOR & TOPOLOGÍA) */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0e14]/80 border border-zinc-800/90 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-tight">
                SECCIÓN B // SIMULADOR DE PLANIFICADOR DE CPU (THREAD DIRECTOR & TOPOLOGÍA)
              </h2>
              <span className="text-[10px] text-zinc-400 font-sans-editorial">
                Demostración gráfica de asignación de hilos, contienda térmica y estacionamiento de núcleos (Core Parking)
              </span>
            </div>
          </div>

          {/* Silicon Architecture Selector */}
          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedSilicon('hybrid')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedSilicon === 'hybrid' ? 'bg-amber-400 text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              CPU HÍBRIDA (P+E)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSilicon('vcache')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedSilicon === 'vcache' ? 'bg-amber-400 text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              AMD 3D V-CACHE
            </button>
            <button
              type="button"
              onClick={() => setSelectedSilicon('monolithic')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedSilicon === 'monolithic' ? 'bg-amber-400 text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              MINI PC / MONOLÍTICA
            </button>
          </div>
        </div>

        {/* ARCHITECTURE 1: CPU HÍBRIDA (INTEL 8P + 12E) */}
        {selectedSilicon === 'hybrid' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <span>ARQUITECTURA HÍBRIDA (8 PERFORMANCE CORES + 12 EFFICIENCY CORES)</span>
                    <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300">
                      INTEL CORE i7-14700K (28 THREADS)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial">
                    {schedulerMetrics.isMisroutedToECore
                      ? '⚠️ EN WINDOWS 10: El planificador SMP carece de Thread Director 2.0. Asigna el hilo crítico de render a un E-Core (IPC un 25% inferior). FrameTime = Base × 1.33 = 22.17ms. El jitter aumenta exponencialmente.'
                      : '✅ EN WINDOWS 11 24H2: EHFI (Enhanced Hardware Feedback Interface) rutea correctamente el hilo principal a P-Cores. FrameTime = Base = 16.67ms. Jitter estable en ±0.4ms.'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-zinc-500 block">MÉTRICAS DETERMINISTAS:</span>
                  <div className="space-y-0.5">
                    <span className={`text-sm font-black font-mono block ${schedulerMetrics.isMisroutedToECore ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {schedulerMetrics.baseFps} FPS ({schedulerMetrics.frameTime} ms)
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Jitter: ±{schedulerMetrics.jitterMs} ms {schedulerMetrics.isMisroutedToECore ? '(Degradación +33%)' : '(QoS Óptimo)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphical Core Map */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {/* P-Cores Group: Blue Blocks */}
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/40 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-blue-400">
                    <span>8× P-CORES (RAPTOR COVE // 5.6 GHz // L2 2MB c/u)</span>
                    <span className="text-[10px] text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/50">AZUL: RENDIMIENTO</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((coreNum) => {
                      const isMainGameThread = !schedulerMetrics.isMisroutedToECore && coreNum === 0;
                      return (
                        <div
                          key={coreNum}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            isMainGameThread
                              ? 'bg-blue-500 text-white border-blue-300 font-bold shadow-[0_0_16px_rgba(59,130,246,0.8)] ring-2 ring-blue-400 animate-pulse'
                              : 'bg-blue-950/40 border-blue-900/60 text-blue-200'
                          }`}
                        >
                          <div className="text-[9px] font-mono">P-CORE {coreNum}</div>
                          <div className="text-[10px] font-black">{isMainGameThread ? '⚡ JUEGO (5.6G)' : '9% CARGA'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* E-Cores Group: Green Blocks */}
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-emerald-400">
                    <span>12× E-CORES (GRACEMONT // 3.4 GHz // L2 COMPARTIDA)</span>
                    <span className="text-[10px] text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-700/50">VERDE: EFICIENCIA</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((coreNum) => {
                      const isMisassignedGameThread = schedulerMetrics.isMisroutedToECore && coreNum === 2;
                      return (
                        <div
                          key={coreNum}
                          className={`p-1.5 rounded-lg border text-center transition-all ${
                            isMisassignedGameThread
                              ? 'bg-rose-600 text-white border-rose-300 font-bold shadow-[0_0_16px_rgba(239,68,68,0.9)] ring-2 ring-rose-400 animate-bounce'
                              : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-200'
                          }`}
                        >
                          <div className="text-[8px] font-mono">E{coreNum}</div>
                          <div className="text-[9px] font-bold">
                            {isMisassignedGameThread ? '¡FALLO E-CORE!' : 'BACKGROUND'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARCHITECTURE 2: AMD 3D V-CACHE (RYZEN 9 7950X3D - DUAL CCD) */}
        {selectedSilicon === 'vcache' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <span>AMD 3D V-CACHE TOPOLOGÍA DUAL CCD (RYZEN 9 7950X3D / 16C 32T)</span>
                    <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-400/20 text-emerald-300">
                      96MB V-CACHE APILADA
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial">
                    {selectedBuildId === 'win11-24h2'
                      ? '✅ EN WIN11 24H2: El planificador activa Core Parking automático en CCD1 (Cores 8-15 en C6 sleep), ejecutando el juego en CCD0 con 96MB V-Cache a 0ns de penalización Infinity Fabric.'
                      : '⚠️ EN COMPILACIONES ANTERIORES: Los hilos saltan entre CCD0 y CCD1, pagando una penalización de 75 ns de latencia de interconexión CCX que arruina el 1% Low.'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-zinc-500 block">ESTADO DE CORE PARKING:</span>
                  <span className={`text-sm font-black font-mono ${selectedBuildId === 'win11-24h2' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedBuildId === 'win11-24h2' ? 'CCD1 APARCADO (ÓPTIMO)' : 'DESPARCADOS (LATENCIA CCX +75ns)'}
                  </span>
                </div>
              </div>

              {/* CCD0 vs CCD1 Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-emerald-500/40 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-emerald-400">
                    <span>CCD 0 (CORES 0-7 CON 96MB 3D V-CACHE)</span>
                    <span>100% ASIGNACIÓN JUEGO</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
                      <div key={c} className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-center">
                        <div className="text-[9px] text-zinc-400">CORE {c}</div>
                        <div className="text-[10px] font-bold text-emerald-300">5.0 GHz // V-CACHE</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-700 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-zinc-300">
                    <span>CCD 1 (CORES 8-15 DE ALTA FRECUENCIA 5.7 GHz // 32MB)</span>
                    <span className={selectedBuildId === 'win11-24h2' ? 'text-cyan-400' : 'text-amber-400'}>
                      {selectedBuildId === 'win11-24h2' ? 'PARKED (C6 STATE)' : 'ACTIVO (CONFLICTO)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[8, 9, 10, 11, 12, 13, 14, 15].map((c) => (
                      <div
                        key={c}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          selectedBuildId === 'win11-24h2'
                            ? 'bg-black/80 border-zinc-800 text-zinc-600 opacity-60'
                            : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                        }`}
                      >
                        <div className="text-[9px]">CORE {c}</div>
                        <div className="text-[10px] font-bold">
                          {selectedBuildId === 'win11-24h2' ? 'PARKED (0W)' : '5.7 GHz (CCX JITTER)'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARCHITECTURE 3: MINI PC / APU MONOLÍTICA (TDP 15-45W) & CONTIENDA TÉRMICA */}
        {selectedSilicon === 'monolithic' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <span>MINI PC / APU MONOLÍTICA (MODELO MATEMÁTICO DE CONTIENDA TÉRMICA TDP)</span>
                    <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-cyan-400/20 text-cyan-300">
                      AMD RYZEN 7 7840HS / RADEON 780M
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial">
                    Fórmula: <code>Presupuesto_GPU = TDP_Total - (CPU_Idle + Servicios_Fondo)</code>. Si Servicios_Fondo &gt; 4.5W continuos, el firmware activa <code>Downclock_GPU = true</code> recortando el rendimiento gráfico en un -28%.
                  </p>
                </div>

                {/* Thermal Contention Alert */}
                {thermalContentionMetrics.downclockGpu ? (
                  <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-bold text-right shadow-[0_0_16px_rgba(239,68,68,0.4)] animate-pulse">
                    <div className="flex items-center gap-1.5 justify-end text-rose-400">
                      <Flame className="w-4 h-4" />
                      <span>ALERTA TÉRMICA: DOWNCLOCK GPU ACTIVO</span>
                    </div>
                    <div className="text-[11px] font-mono text-rose-300">
                      -28% FPS PROYECTADOS ({thermalContentionMetrics.projectedFps} FPS @ {thermalContentionMetrics.gpuClockMhz} MHz)
                    </div>
                  </div>
                ) : (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-zinc-500 block">RELOJ iGPU INTEGRADA:</span>
                    <span className="text-sm font-black font-mono text-emerald-400">
                      {thermalContentionMetrics.gpuClockMhz} MHz (MAX BOOST // {thermalContentionMetrics.projectedFps} FPS)
                    </span>
                  </div>
                )}
              </div>

              {/* TDP Total Selector (15W a 45W) */}
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">
                  SELECTOR DE TDP TOTAL EN PAQUETE SOC:
                </span>
                <div className="flex items-center gap-2">
                  {[15, 28, 35, 45].map((watts) => (
                    <button
                      key={watts}
                      type="button"
                      onClick={() => setTdpTotalWatts(watts)}
                      className={`px-3 py-1 rounded-lg font-mono text-xs font-bold cursor-pointer transition-all ${
                        tdpTotalWatts === watts
                          ? 'bg-amber-400 text-black shadow'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                      }`}
                    >
                      {watts}W TDP
                    </button>
                  ))}
                </div>
              </div>

              {/* Power Allocation Bar */}
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>PRESUPUESTO ENERGÉTICO CALCULADO:</span>
                  <span className="font-bold text-cyan-300">
                    GPU: {thermalContentionMetrics.presupuestoGpuWatts}W / CPU Idle: {thermalContentionMetrics.cpuIdleWatts}W / Fondo: {thermalContentionMetrics.serviciosFondoWatts}W
                  </span>
                </div>

                <div className="flex h-3.5 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800">
                  <div
                    className="bg-rose-500 transition-all duration-300"
                    style={{ width: `${(thermalContentionMetrics.serviciosFondoWatts / tdpTotalWatts) * 100}%` }}
                    title={`Servicios Fondo: ${thermalContentionMetrics.serviciosFondoWatts}W`}
                  />
                  <div
                    className="bg-amber-400 transition-all duration-300"
                    style={{ width: `${(thermalContentionMetrics.cpuIdleWatts / tdpTotalWatts) * 100}%` }}
                    title={`CPU Idle: ${thermalContentionMetrics.cpuIdleWatts}W`}
                  />
                  <div
                    className={`${thermalContentionMetrics.downclockGpu ? 'bg-amber-600' : 'bg-cyan-400'} transition-all duration-300`}
                    style={{ width: `${Math.max(0, (thermalContentionMetrics.presupuestoGpuWatts / tdpTotalWatts) * 100)}%` }}
                    title={`Presupuesto GPU: ${thermalContentionMetrics.presupuestoGpuWatts}W`}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-zinc-400 pt-1">
                  <span className="text-rose-400">■ Servicios Fondo: {thermalContentionMetrics.serviciosFondoWatts}W {thermalContentionMetrics.serviciosFondoWatts > 4.5 ? '(CRÍTICO > 4.5W)' : '(LIMPIO)'}</span>
                  <span className="text-amber-400">■ CPU Idle: {thermalContentionMetrics.cpuIdleWatts}W</span>
                  <span className={thermalContentionMetrics.downclockGpu ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                    ■ Presupuesto GPU: {thermalContentionMetrics.presupuestoGpuWatts}W {thermalContentionMetrics.downclockGpu ? '(THROTTLING)' : '(BOOST)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN C: OSCILOSCOPIO DINÁMICO DE LATENCIA DPC / ISR                   */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0e14]/80 border border-zinc-800/90 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-400/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-tight">
                SECCIÓN C // OSCILOSCOPIO VECTORIAL DE LATENCIA DPC / ISR
              </h2>
              <span className="text-[10px] text-zinc-400 font-sans-editorial">
                Medición de colas diferidas en microsegundos (µs), colisiones de controladores e inyección de stuttering
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 text-[10px]">ESTADO DE COLA:</span>
            <span
              className={`px-2.5 py-0.5 rounded font-black text-[11px] border ${
                dpcMetrics.status === 'OPTIMO'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : dpcMetrics.status === 'ADVERTENCIA'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
              }`}
            >
              {dpcMetrics.status} ({dpcMetrics.peakDpc} µs)
            </span>
          </div>
        </div>

        {/* Live Vector Oscilloscope Canvas Screen */}
        <div className="relative w-full h-56 sm:h-64 rounded-xl bg-[#06080b] border border-cyan-500/30 overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
          <canvas
            ref={canvasRef}
            width={800}
            height={256}
            className="w-full h-full object-cover block"
          />

          {/* CRT Screen Overlays & Metadata Badges */}
          <div className="absolute top-2 left-3 flex items-center gap-3 text-[10px] font-mono text-cyan-400/90 pointer-events-none">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              OSCILOSCOPIO RIGOL DS1054Z // DPC TRACE
            </span>
            <span>TIMING: {timerResolutionMs} ms</span>
            <span>PEAK: {dpcMetrics.peakDpc} µs</span>
          </div>

          <div className="absolute top-2 right-3 text-[10px] font-mono pointer-events-none">
            <span className="px-2 py-0.5 rounded bg-black/80 border border-zinc-800 text-zinc-300">
              UMBRAL SEGURO: &lt; 100 µs
            </span>
          </div>

          {/* Audio Drop / Stutter Warning Banner if Critical */}
          {dpcMetrics.status === 'CRITICO' && (
            <div className="absolute inset-x-0 bottom-2 mx-auto max-w-md p-2 rounded-lg bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-2xl animate-bounce">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>COLISIÓN SEVERA: RUPTURA DE AUDIO Y MICRO-CONGELAMIENTO EN JUEGO</span>
            </div>
          )}
        </div>

        {/* Driver Matrix & Breakdown Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* Driver Evaluation Matrix */}
          <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                PERFIL DE CONTROLADOR EN EVALUACIÓN
              </span>
              <span className="text-[10px] text-zinc-500">SELECCIÓN ACTIVA</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setDriverProfile('whql'); setIsInjectingConflict(false); }}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  driverProfile === 'whql'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <div className="font-bold">1. WHQL OFICIAL</div>
                <div className="text-[10px] text-zinc-500">Estándar certificado (~140 µs)</div>
              </button>

              <button
                type="button"
                onClick={() => { setDriverProfile('oem'); setIsInjectingConflict(false); }}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  driverProfile === 'oem'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <div className="font-bold">2. OEM CON BLOAT</div>
                <div className="text-[10px] text-zinc-500">Telemetría y polling (~340 µs)</div>
              </button>

              <button
                type="button"
                onClick={() => { setDriverProfile('debloated'); setIsInjectingConflict(false); }}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  driverProfile === 'debloated'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <div className="font-bold">3. DEBLOATED + MSI</div>
                <div className="text-[10px] text-zinc-500">Message Signaled (&lt;40 µs)</div>
              </button>

              <button
                type="button"
                onClick={() => { setDriverProfile('conflict'); setIsInjectingConflict(true); }}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  driverProfile === 'conflict' || isInjectingConflict
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400 font-bold animate-pulse'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <div className="font-bold text-rose-400">4. CONFLICTO DPC</div>
                <div className="text-[10px] text-zinc-500">Tormenta de interrupciones (&gt;900 µs)</div>
              </button>
            </div>

            {/* Subsystem Driver Module Latency Bars */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800 text-[11px]">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="font-mono">nvlddmkm.sys (GPU Driver):</span>
                <span className={`font-bold ${dpcMetrics.nvlddmkm > 500 ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {dpcMetrics.nvlddmkm} µs
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="font-mono">ndis.sys (Network Stack):</span>
                <span className="font-bold text-emerald-400">{dpcMetrics.ndis} µs</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="font-mono">storport.sys (NVMe Controller):</span>
                <span className="font-bold text-zinc-300">{dpcMetrics.storport} µs</span>
              </div>
            </div>
          </div>

          {/* Timer Resolution & Sysinternals Commands */}
          <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  RESOLUCIÓN DEL TEMPORIZADOR DE WINDOWS (NtSetTimerResolution)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTimerResolutionMs(15.625)}
                  className={`p-2 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                    timerResolutionMs === 15.625
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <div className="font-bold">15.625 ms</div>
                  <div className="text-[9px] text-zinc-500">Default (64 Hz)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimerResolutionMs(1.0)}
                  className={`p-2 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                    timerResolutionMs === 1.0
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <div className="font-bold">1.000 ms</div>
                  <div className="text-[9px] text-zinc-500">Media (1000 Hz)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimerResolutionMs(0.5)}
                  className={`p-2 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                    timerResolutionMs === 0.5
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <div className="font-bold">0.500 ms</div>
                  <div className="text-[9px] text-zinc-500">Precisión EVO (2000 Hz)</div>
                </button>
              </div>

              <p className="text-[11px] text-zinc-400 font-sans-editorial leading-relaxed pt-1">
                La resolución forzada a 0.500 ms reduce la variabilidad del frametime entre un 40% y 65% en motores como Unreal Engine y Source 2, sincronizando las llamadas de renderizado con el escaneo de la GPU.
              </p>

              {/* Statistical 1% Low Math Box */}
              <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-1 text-[10px] font-mono">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-bold text-amber-300">MODELO ESTADÍSTICO 1% LOW:</span>
                  <span className="text-cyan-300 font-bold">{dpcMetrics.percentil_1Low} FPS</span>
                </div>
                <div className="text-zinc-500 text-[9px]">
                  Fórmula: <code>1000 / (FT_Medio + 2.33 × σ_Jitter)</code> = <code>1000 / ({schedulerMetrics.frameTime} + 2.33 × {dpcMetrics.stDevJitter})</code>
                </div>
              </div>
            </div>

            {/* Quick Diagnostic PowerShell Script Button */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-zinc-500 font-mono">
                AUDITORÍA EN TU PROPIA PC (SIN INSTALAR NADA):
              </span>
              <button
                type="button"
                onClick={handleCopyDiagScript}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedScript ? '¡COMANDO COPIADO!' : 'COPIAR SCRIPT POWERSHELL'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>EVO METROLOGY SUITE // CONECTADO CON TOMO 01 (SILICIO), TOMO 02 (KERNEL NT) Y TOMO 03 (BANCO FÍSICO)</span>
        </div>

        {onOpenTomo && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenTomo('tomo-02')}
              className="px-3 py-1 rounded-lg bg-cyan-400/20 hover:bg-cyan-400 text-cyan-300 hover:text-black border border-cyan-400/40 font-bold transition-all cursor-pointer"
            >
              ABRIR TOMO 02 (KERNEL NT) →
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
