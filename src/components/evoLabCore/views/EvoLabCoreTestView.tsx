import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Gamepad2,
  Briefcase,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Tv,
  HardDrive,
  Layers,
  Thermometer,
  Sparkles,
  Search,
  Plus,
  Trash2,
  FastForward,
  Pause,
  Clock,
  Flame,
  Info,
  Sliders,
  Settings,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Radio,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  Machine,
  WorkloadDomain,
  SubsystemType,
  EvoCase,
  EpistemicProvenance,
  TechnicalEvidence,
} from '../types';
import { EvoCaseRepository } from '../services/caseRepository';
import { EvoMachinePreparedCard } from '../components/EvoMachinePreparedCard';
import { EvoTechnicalEvidenceModal } from '../components/EvoTechnicalEvidenceModal';
import { EvoLearnMoreCallout } from '../components/EvoLearnMoreCallout';
import { EvoLiveMachineBusDiagram, SubsystemIdentifier } from '../components/EvoLiveMachineBusDiagram';
import { GameWorkloadRegistry } from '../services/digitalTwin/gameWorkloadRegistry';
import { EvoDigitalTwinEngine } from '../services/digitalTwin/evoDigitalTwinEngine';
import {
  GameWorkloadItem,
  WorkloadStack,
  ActiveWorkloadInstance,
  DigitalTwinFrame,
  DigitalTwinEventMarker,
  DigitalTwinSessionReport,
  LimitingFactorKind,
} from '../services/digitalTwin/types';
import { DynamicBottleneckEngine } from '../services/digitalTwin/dynamicBottleneckEngine';
import { ThermalSimulationState } from '../services/digitalTwin/thermalSimulationEngine';

interface EvoLabCoreTestViewProps {
  machine: Machine;
  onNavigateHome: () => void;
  onNavigateToTomo?: (tomoId: '01' | '02' | '03' | '04') => void;
  onChangeMachineRequested?: () => void;
}

export const EvoLabCoreTestView: React.FC<EvoLabCoreTestViewProps> = ({
  machine,
  onNavigateHome,
  onNavigateToTomo,
  onChangeMachineRequested,
}) => {
  // Navigation / Phase: 'CONFIG_LOAD' | 'LIVE_SIMULATION' | 'SESSION_REPORT' | 'UPGRADE_COMPARISON'
  const [phase, setPhase] = useState<'CONFIG_LOAD' | 'LIVE_SIMULATION' | 'SESSION_REPORT' | 'UPGRADE_COMPARISON'>('CONFIG_LOAD');

  // Workload Selection State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'JUEGOS' | 'STREAMING' | 'MULTITAREA' | 'TODOS'>('JUEGOS');
  const [selectedPrimaryGame, setSelectedPrimaryGame] = useState<GameWorkloadItem>(() => {
    GameWorkloadRegistry.init();
    return GameWorkloadRegistry.get('battlefield_6') || GameWorkloadRegistry.getAll()[0];
  });

  const [selectedSecondaries, setSelectedSecondaries] = useState<GameWorkloadItem[]>([]);
  const [resolution, setResolution] = useState<'1080p' | '1440p' | '4K'>('1440p');
  const [quality, setQuality] = useState<'LOW_COMPETITIVE' | 'MEDIUM' | 'HIGH' | 'ULTRA_RAYTRACING'>('HIGH');
  const [targetFps, setTargetFps] = useState<number>(144);
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [psuAgeYears, setPsuAgeYears] = useState<number | undefined>(undefined);
  const [lastMaintenanceMonths, setLastMaintenanceMonths] = useState<number | undefined>(undefined);

  // Live Simulation State
  const [simulatedSecond, setSimulatedSecond] = useState<number>(0);
  const simulatedSecondRef = useRef<number>(0);
  const currentFrameRef = useRef<DigitalTwinFrame | null>(null);
  const thermalStateInternalRef = useRef<ThermalSimulationState | null>(null);

  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5 | 10>(2);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeStack, setActiveStack] = useState<WorkloadStack | null>(null);
  const [currentFrame, setCurrentFrame] = useState<DigitalTwinFrame | null>(null);
  const [framesHistory, setFramesHistory] = useState<DigitalTwinFrame[]>([]);
  const [eventsHistory, setEventsHistory] = useState<DigitalTwinEventMarker[]>([]);
  const [thermalStateRef, setThermalStateRef] = useState<ThermalSimulationState | null>(null);
  const [finalReport, setFinalReport] = useState<DigitalTwinSessionReport | null>(null);

  // Subsystem selection & interactive highlight state
  const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemIdentifier>('CPU');
  const [highlightedSubsystem, setHighlightedSubsystem] = useState<string | null>(null);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'ALL_METRICS' | 'LOADS' | 'THERMAL_CLOCKS' | 'POWER_FPS' | 'BOTTLENECK'>('ALL_METRICS');

  // Upgrade Comparison State
  const [upgradeGpuModel, setUpgradeGpuModel] = useState<string>('NVIDIA GeForce RTX 4070 Ti SUPER 16GB');
  const [upgradeReport, setUpgradeReport] = useState<DigitalTwinSessionReport | null>(null);
  const [isComparingUpgrade, setIsComparingUpgrade] = useState<boolean>(false);

  // Technical Evidence Modal
  const [showTechnicalModal, setShowTechnicalModal] = useState<boolean>(false);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Available games list
  const availableWorkloads = GameWorkloadRegistry.getByCategory(selectedCategoryTab);

  // Filtered by search
  const displayedWorkloads = searchQuery.trim()
    ? GameWorkloadRegistry.getAll().filter((w) =>
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.publisher.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableWorkloads;

  // --------------------------------------------------------------------------
  // INITIATE LIVE LOAD LAB
  // --------------------------------------------------------------------------
  const handleStartLiveLoadLab = () => {
    const primaryInstance: ActiveWorkloadInstance = {
      instanceId: `inst-pri-${Date.now()}`,
      workload: selectedPrimaryGame,
      role: 'PRIMARY',
      addedAtSeconds: 0,
      resolution,
      quality,
      targetFps,
      isStreamingObs: selectedSecondaries.some((s) => s.id === 'obs_studio'),
      isRecording: false,
    };

    const secondaryInstances: ActiveWorkloadInstance[] = selectedSecondaries.map((sec, idx) => ({
      instanceId: `inst-sec-${idx}-${Date.now()}`,
      workload: sec,
      role: 'SECONDARY',
      addedAtSeconds: 0,
    }));

    const backgroundInstance: ActiveWorkloadInstance = {
      instanceId: 'inst-bg-windows',
      workload: {
        id: 'windows_services',
        title: 'Servicios de Windows & Drivers',
        publisher: 'Microsoft Windows',
        category: 'BACKGROUND_SERVICE',
        engine: 'Windows NT Kernel',
        executableNames: ['System', 'dwm.exe'],
        demandProfile: {
          cpuSingleThreadDemand: { value: 6, source: 'Windows Scheduler Model', confidencePct: 95, provenance: 'DERIVED' },
          cpuMultiThreadDemand: { value: 8, source: 'DWM Composite Model', confidencePct: 95, provenance: 'DERIVED' },
          recommendedCpuCores: 2,
          gpuRasterDemand: { value: 2, source: 'DWM Shell GUI', confidencePct: 95, provenance: 'DERIVED' },
          gpuComputeDemand: { value: 0, source: 'None', confidencePct: 100, provenance: 'DERIVED' },
          vramDemandGb: { value: 0.5, source: 'Surface Cache Allocation', confidencePct: 95, provenance: 'DERIVED' },
          ramDemandGb: { value: 3.5, source: 'System Working Set Baseline', confidencePct: 95, provenance: 'DERIVED' },
          ramBandwidthSensitivity: 'LOW',
          storageReadMBps: { value: 2, source: 'Pagefile Reads', confidencePct: 90, provenance: 'DERIVED' },
          storageWriteMBps: { value: 2, source: 'System Log Writes', confidencePct: 90, provenance: 'DERIVED' },
          networkBandwidthMbps: { value: 0.1, source: 'Telemetry', confidencePct: 90, provenance: 'DERIVED' },
          encoderDemandPct: { value: 0, source: 'None', confidencePct: 100, provenance: 'DERIVED' },
          decoderDemandPct: { value: 0, source: 'None', confidencePct: 100, provenance: 'DERIVED' },
        },
        resolutionScaleFactors: { '1080p': 1.0, '1440p': 1.0, '4K': 1.0 },
        qualityScaleFactors: { 'LOW_COMPETITIVE': 1.0, 'MEDIUM': 1.0, 'HIGH': 1.0, 'ULTRA_RAYTRACING': 1.0 },
      },
      role: 'BACKGROUND',
      addedAtSeconds: 0,
    };

    const initialStack: WorkloadStack = {
      primary: primaryInstance,
      secondaries: secondaryInstances,
      backgrounds: [backgroundInstance],
      isSyntheticCombined: selectedSecondaries.length >= 2,
    };

    setActiveStack(initialStack);
    simulatedSecondRef.current = 0;
    setSimulatedSecond(0);
    setFramesHistory([]);
    setEventsHistory([]);
    thermalStateInternalRef.current = null;
    setThermalStateRef(null);
    setPhase('LIVE_SIMULATION');
    setIsPaused(false);

    // Initial frame
    const { frame, thermalState } = EvoDigitalTwinEngine.generateFrame(
      machine,
      initialStack,
      0,
      null,
      psuAgeYears,
      lastMaintenanceMonths
    );
    currentFrameRef.current = frame;
    thermalStateInternalRef.current = thermalState;
    setCurrentFrame(frame);
    setFramesHistory([frame]);
    setThermalStateRef(thermalState);

    const startEvent: DigitalTwinEventMarker = {
      id: `ev-start-0`,
      timestampSeconds: 0,
      timeFormatted: '00:00',
      type: 'WORKLOAD_ADDED',
      title: `Inicio de Carga: ${selectedPrimaryGame.title}`,
      description: `Comienza la simulación pericial bajo ${resolution} preset ${quality}.`,
      affectedSubsystem: 'gpu',
      severity: 'INFO',
    };
    setEventsHistory([startEvent]);
  };

  // --------------------------------------------------------------------------
  // SIMULATION TICK LOOP
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'LIVE_SIMULATION' || isPaused || !activeStack) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const totalTargetSeconds = durationMinutes * 60;

    // Real-time interval scaled by simSpeed (1000ms / simSpeed)
    const intervalMs = Math.max(50, 1000 / simSpeed);

    timerRef.current = setInterval(() => {
      const nextSec = simulatedSecondRef.current + 1;

      if (nextSec > totalTargetSeconds) {
        // Simulation complete
        if (timerRef.current) clearInterval(timerRef.current);
        handleFinishSimulation();
        return;
      }

      const { frame, thermalState } = EvoDigitalTwinEngine.generateFrame(
        machine,
        activeStack,
        nextSec,
        thermalStateInternalRef.current,
        psuAgeYears,
        lastMaintenanceMonths
      );

      simulatedSecondRef.current = nextSec;
      thermalStateInternalRef.current = thermalState;
      const prevFrame = currentFrameRef.current;
      currentFrameRef.current = frame;

      setSimulatedSecond(nextSec);
      setCurrentFrame(frame);
      setThermalStateRef(thermalState);
      setFramesHistory((prev) => [...prev, frame]);

      // Detect dynamic event triggers without duplicates
      if (prevFrame && frame.limitingFactor !== prevFrame.limitingFactor) {
        const evId = `ev-bottle-${nextSec}-${Date.now()}`;
        const ev: DigitalTwinEventMarker = {
          id: evId,
          timestampSeconds: nextSec,
          timeFormatted: frame.timeFormatted,
          type: 'BOTTLENECK_CHANGED',
          title: `Cambio de Régimen: ${DynamicBottleneckEngine.getFactorLabel(frame.limitingFactor)}`,
          description: frame.limitingFactorReasonEs,
          affectedSubsystem: frame.limitingFactor.includes('GPU') ? 'gpu' : 'cpu',
          severity: frame.limitingFactor.includes('LIMIT') ? 'WARNING' : 'INFO',
        };
        setEventsHistory((prev) => {
          if (prev.some((e) => e.type === 'BOTTLENECK_CHANGED' && e.timestampSeconds === nextSec)) {
            return prev;
          }
          return [...prev, ev];
        });
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isPaused, activeStack, simSpeed, durationMinutes, machine, psuAgeYears, lastMaintenanceMonths]);

  // --------------------------------------------------------------------------
  // LIVE WORKLOAD MODIFICATION (IN-FLIGHT)
  // --------------------------------------------------------------------------
  const handleToggleSecondaryInFlight = (workload: GameWorkloadItem) => {
    if (!activeStack) return;

    const exists = activeStack.secondaries.some((s) => s.workload.id === workload.id);
    let newSecondaries: ActiveWorkloadInstance[];

    if (exists) {
      // Remove
      newSecondaries = activeStack.secondaries.filter((s) => s.workload.id !== workload.id);
      const ev: DigitalTwinEventMarker = {
        id: `ev-rem-${simulatedSecond}`,
        timestampSeconds: simulatedSecond,
        timeFormatted: currentFrame?.timeFormatted || '00:00',
        type: 'WORKLOAD_REMOVED',
        title: `Carga Finalizada: ${workload.title}`,
        description: `Se cerró ${workload.title}. Los recursos fueron liberados en tiempo real.`,
        affectedSubsystem: 'cpu',
        severity: 'INFO',
      };
      setEventsHistory((prev) => [...prev, ev]);
    } else {
      // Add
      const newInst: ActiveWorkloadInstance = {
        instanceId: `inst-live-${Date.now()}`,
        workload,
        role: 'SECONDARY',
        addedAtSeconds: simulatedSecond,
      };
      newSecondaries = [...activeStack.secondaries, newInst];
      const ev: DigitalTwinEventMarker = {
        id: `ev-add-${simulatedSecond}`,
        timestampSeconds: simulatedSecond,
        timeFormatted: currentFrame?.timeFormatted || '00:00',
        type: 'WORKLOAD_ADDED',
        title: `+ Carga Agregada en Vivo: ${workload.title}`,
        description: `Se inició ${workload.title} simultáneamente. El sistema recalculó la contención de memoria y consumo térmico.`,
        affectedSubsystem: workload.id === 'obs_studio' ? 'gpu' : 'ram',
        severity: 'WARNING',
      };
      setEventsHistory((prev) => [...prev, ev]);
    }

    const updatedStack: WorkloadStack = {
      ...activeStack,
      secondaries: newSecondaries,
      isSyntheticCombined: newSecondaries.length >= 2,
    };

    setActiveStack(updatedStack);

    // Recalculate frame immediately
    const { frame, thermalState } = EvoDigitalTwinEngine.generateFrame(
      machine,
      updatedStack,
      simulatedSecond,
      thermalStateRef,
      psuAgeYears,
      lastMaintenanceMonths
    );
    setCurrentFrame(frame);
    setThermalStateRef(thermalState);
    setFramesHistory((prev) => [...prev, frame]);
  };

  const handleChangeResolutionInFlight = (newRes: '1080p' | '1440p' | '4K') => {
    if (!activeStack || !activeStack.primary) return;
    setResolution(newRes);

    const updatedPrimary: ActiveWorkloadInstance = {
      ...activeStack.primary,
      resolution: newRes,
    };
    const updatedStack: WorkloadStack = {
      ...activeStack,
      primary: updatedPrimary,
    };
    setActiveStack(updatedStack);

    const ev: DigitalTwinEventMarker = {
      id: `ev-res-${simulatedSecond}`,
      timestampSeconds: simulatedSecond,
      timeFormatted: currentFrame?.timeFormatted || '00:00',
      type: 'BOTTLENECK_CHANGED',
      title: `Resolución Modificada a ${newRes}`,
      description: `Se cambió la resolución de render a ${newRes}. El ancho de banda de VRAM y tasa de rasterización fueron recalculados.`,
      affectedSubsystem: 'gpu',
      severity: 'INFO',
    };
    setEventsHistory((prev) => [...prev, ev]);

    const { frame, thermalState } = EvoDigitalTwinEngine.generateFrame(
      machine,
      updatedStack,
      simulatedSecond,
      thermalStateRef,
      psuAgeYears,
      lastMaintenanceMonths
    );
    setCurrentFrame(frame);
    setThermalStateRef(thermalState);
  };

  // --------------------------------------------------------------------------
  // FAST FORWARD & FINISH
  // --------------------------------------------------------------------------
  const handleFastForwardToFinish = () => {
    if (!activeStack) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const totalSeconds = durationMinutes * 60;
    const fullReport = EvoDigitalTwinEngine.runFullSimulation(
      machine,
      activeStack,
      totalSeconds,
      psuAgeYears,
      lastMaintenanceMonths
    );

    setFinalReport(fullReport);
    setFramesHistory(fullReport.frames);
    setEventsHistory(fullReport.events);
    setCurrentFrame(fullReport.frames[fullReport.frames.length - 1]);
    setSimulatedSecond(totalSeconds);
    setPhase('SESSION_REPORT');
  };

  const handleFinishSimulation = () => {
    if (!activeStack) return;
    const totalSeconds = durationMinutes * 60;
    const fullReport = EvoDigitalTwinEngine.runFullSimulation(
      machine,
      activeStack,
      totalSeconds,
      psuAgeYears,
      lastMaintenanceMonths
    );

    setFinalReport(fullReport);
    setPhase('SESSION_REPORT');

    // Register case in repository
    const evoCase: EvoCase = {
      id: `EVO-LOAD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      caseType: 'TEST',
      title: `Ensayo de Carga: ${activeStack.primary?.workload.title || 'Carga'} (${durationMinutes} min)`,
      machine,
      isClosed: false,
    };
    EvoCaseRepository.saveCase(evoCase);
  };

  // --------------------------------------------------------------------------
  // SIMULATE UPGRADE SCENARIO
  // --------------------------------------------------------------------------
  const handleRunUpgradeComparison = () => {
    if (!activeStack) return;

    // Clone machine with upgraded GPU
    const upgradedMachine: Machine = {
      ...machine,
      gpu: {
        ...machine.gpu,
        model: upgradeGpuModel,
        vramGb: 16,
        isDedicated: true,
        powerW: 285,
        provenance: 'SIMULATED',
      },
      psu: {
        ...machine.psu,
        wattageW: Math.max(750, machine.psu.wattageW),
      },
    };

    const upReport = EvoDigitalTwinEngine.runFullSimulation(
      upgradedMachine,
      activeStack,
      durationMinutes * 60,
      psuAgeYears,
      lastMaintenanceMonths
    );

    setUpgradeReport(upReport);
    setIsComparingUpgrade(true);
    setPhase('UPGRADE_COMPARISON');
  };

  // --------------------------------------------------------------------------
  // JUMP TO TIMELINE SECOND
  // --------------------------------------------------------------------------
  const handleScrubTimeline = (second: number) => {
    if (framesHistory[second]) {
      currentFrameRef.current = framesHistory[second];
      simulatedSecondRef.current = second;
      setCurrentFrame(framesHistory[second]);
      setSimulatedSecond(second);
    }
  };

  // ==========================================================================
  // RENDER PHASE 1: CONFIG LOAD ("¿QUÉ QUERÉS CARGAR SOBRE ESTA MACHINE?")
  // ==========================================================================
  if (phase === 'CONFIG_LOAD') {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 font-mono-tech">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-800 bg-[#090c12] shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>EVO LIVE LOAD LAB // GEMELO DIGITAL & ENSAYOS DE ESTRÉS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ¿QUÉ QUERÉS CARGAR SOBRE ESTA MACHINE?
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Elegí un juego o aplicación principal, sumá programas simultáneos y observá el comportamiento térmico y de buses en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 transition-all cursor-pointer"
            >
              VOLVER
            </button>
            <button
              type="button"
              onClick={handleStartLiveLoadLab}
              className="px-5 py-2 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>INICIAR LIVE LOAD LAB</span>
            </button>
          </div>
        </div>

        {/* Machine Prepared Card summary */}
        <EvoMachinePreparedCard machine={machine} onChangeRequested={onChangeMachineRequested} />

        {/* Main Grid: Workload Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Workload Selector & Discovery */}
          <div className="lg:col-span-2 space-y-5">
            {/* Category Tabs & Search Bar */}
            <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0b0e14] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                  {(['JUEGOS', 'STREAMING', 'MULTITAREA', 'TODOS'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSelectedCategoryTab(tab)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedCategoryTab === tab
                          ? 'bg-amber-400 text-black font-black shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Search / AI Discovery */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar o escribir juego/programa..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Workloads Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {displayedWorkloads.map((item) => {
                  const isPrimary = selectedPrimaryGame.id === item.id;
                  const isSecondary = selectedSecondaries.some((s) => s.id === item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPrimaryGame(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isPrimary
                          ? 'border-amber-400 bg-amber-950/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                          : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-xs text-white leading-tight">{item.title}</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">{item.publisher}</div>
                        </div>
                        {isPrimary && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400 text-black">
                            PRINCIPAL
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-1.5 border-t border-zinc-800/60">
                        <span>{item.engine.split('(')[0]}</span>
                        <span className="text-zinc-400">Rec: {item.demandProfile.recommendedCpuCores}C / {item.demandProfile.vramDemandGb.value}GB VRAM</span>
                      </div>
                    </div>
                  );
                })}

                {/* AI Discovery Option when search yields no direct match */}
                {displayedWorkloads.length === 0 && searchQuery.trim() && (
                  <div
                    onClick={() => {
                      const discovered = GameWorkloadRegistry.searchOrDiscover(searchQuery);
                      setSelectedPrimaryGame(discovered);
                      setSearchQuery('');
                    }}
                    className="col-span-full p-4 rounded-xl border border-dashed border-amber-400/50 bg-amber-950/20 hover:bg-amber-950/30 transition-all cursor-pointer text-center space-y-2"
                  >
                    <Sparkles className="w-5 h-5 text-amber-400 mx-auto animate-pulse" />
                    <div className="text-xs font-bold text-white">
                      ¿Descubrir e indexar <span className="text-amber-400">"{searchQuery}"</span> con EVO AI?
                    </div>
                    <div className="text-[10px] text-zinc-400 max-w-md mx-auto">
                      La IA localizará requisitos oficiales, motor gráfico y perfil dimensional de carga sin inventar datos.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Secondary Programs / Multitasking */}
            <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0b0e14] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-400 flex items-center gap-1.5 uppercase">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  + PROGRAMAS SIMULTÁNEOS (CARGA COMPUESTA)
                </span>
                <span className="text-[10px] text-zinc-500">Opcionales</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'obs_studio', title: 'OBS Studio (Stream 1080p)', icon: Tv },
                  { id: 'discord', title: 'Discord (Voice & Cam)', icon: Activity },
                  { id: 'chrome_heavy', title: 'Chrome (8 Tabs + YT)', icon: Layers },
                  { id: 'spotify', title: 'Spotify (Audio)', icon: Radio },
                ].map((sec) => {
                  const isSelected = selectedSecondaries.some((s) => s.id === sec.id);
                  const item = GameWorkloadRegistry.get(sec.id);

                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        if (!item) return;
                        if (isSelected) {
                          setSelectedSecondaries((prev) => prev.filter((s) => s.id !== sec.id));
                        } else {
                          setSelectedSecondaries((prev) => [...prev, item]);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/30 text-white shadow-sm'
                          : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <sec.icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                      <div className="text-[11px] font-bold leading-tight truncate">{sec.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 3: Parameters & Duration */}
          <div className="space-y-5">
            <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0b0e14] space-y-4">
              <div className="font-bold text-xs text-white uppercase flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>PARÁMETROS DEL ENSAYO</span>
              </div>

              {/* Resolution */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold uppercase">Resolución</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['1080p', '1440p', '4K'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setResolution(r)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        resolution === r
                          ? 'bg-amber-400 text-black font-black'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Preset */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold uppercase">Calidad Gráfica</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="LOW_COMPETITIVE">Bajo Competitivo (Max FPS)</option>
                  <option value="MEDIUM">Medio Equilibrado</option>
                  <option value="HIGH">Alto / Calidad Nativa</option>
                  <option value="ULTRA_RAYTRACING">Ultra + Ray Tracing</option>
                </select>
              </div>

              {/* Target FPS Goal */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-zinc-400 font-bold">
                  <span>FPS Objetivo:</span>
                  <span className="text-amber-400 font-mono font-black">{targetFps} FPS</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="360"
                  step="10"
                  value={targetFps}
                  onChange={(e) => setTargetFps(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Duración de la Prueba</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 5, 10, 20].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDurationMinutes(m)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        durationMinutes === m
                          ? 'bg-cyan-400 text-black font-black'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Context: PSU Age */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                <label className="text-[10px] text-zinc-400 font-bold uppercase flex items-center justify-between">
                  <span>¿Años de la Fuente (PSU)?</span>
                  <span className="text-zinc-500 font-normal">Opcional</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  placeholder="Ej: 5 años"
                  value={psuAgeYears !== undefined ? psuAgeYears : ''}
                  onChange={(e) => setPsuAgeYears(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  className="w-full p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleStartLiveLoadLab}
                className="w-full py-3 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>INICIAR LIVE LOAD LAB</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER PHASE 2: LIVE SIMULATION PLAYBACK
  // ==========================================================================
  if (phase === 'LIVE_SIMULATION' && activeStack && currentFrame) {
    const totalTargetSec = durationMinutes * 60;
    const progressPct = Math.min(100, (simulatedSecond / totalTargetSec) * 100);

    return (
      <div className="w-full max-w-7xl mx-auto space-y-5 pb-16 font-mono-tech">
        {/* Top Control Dashboard */}
        <div className="p-4 rounded-2xl border border-zinc-800 bg-[#090c12] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isPaused ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'REANUDAR' : 'PAUSAR'}</span>
              </button>

              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
                {[1, 2, 5, 10].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSimSpeed(spd as any)}
                    className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      simSpeed === spd ? 'bg-cyan-400 text-black font-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleFastForwardToFinish}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-400" />
              <span>FINALIZAR ENSAYO (INMEDIATO)</span>
            </button>
          </div>

          {/* Live Progress & FPS */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 font-bold uppercase">PROGRESO</div>
              <div className="text-xs font-mono font-bold text-white">
                {currentFrame.timeFormatted} / {durationMinutes}:00 ({progressPct.toFixed(0)}%)
              </div>
            </div>

            <div className="w-24 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-right">
              <div className="text-[9px] text-zinc-500 font-bold uppercase">FPS ESTIMADO</div>
              <div className="text-sm font-mono font-black text-emerald-400">
                {currentFrame.fpsEstimate.averageFps} <span className="text-[10px] text-zinc-500">FPS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Motherboard Canvas with Digital Twin Frame */}
        <EvoLiveMachineBusDiagram
          machine={machine}
          isPoweredOn={true}
          frame={currentFrame}
          workloadState="GAMING"
          selectedComponent={selectedSubsystem}
          onSelectComponent={(sub) => setSelectedSubsystem(sub)}
          highlightedSubsystem={highlightedSubsystem}
          framesHistory={framesHistory}
          showSideInspector={true}
        />

        {/* Real-Time Telemetry Multi-Charts Dashboard */}
        <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-[#080b11] shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
              </span>
              <div>
                <div className="font-black text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <span>TELEMETRÍA EN TIEMPO REAL // GRÁFICOS CONTINUOS</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-[10px] text-zinc-400">
                  Curvas dinámicas de carga, temperaturas, clocks y flujo de energía
                </div>
              </div>
            </div>

            {/* Tabs for Telemetry Views */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs overflow-x-auto">
              {[
                { id: 'ALL_METRICS', label: 'Todos los Sensores (11 Canales)' },
                { id: 'LOADS', label: 'Cargas & Memoria' },
                { id: 'THERMAL_CLOCKS', label: 'Térmico & Frecuencias' },
                { id: 'POWER_FPS', label: 'PSU & Rendimiento FPS' },
                { id: 'BOTTLENECK', label: 'Evolución Cuello de Botella' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTelemetryTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-[11px] whitespace-nowrap ${
                    activeTelemetryTab === tab.id
                      ? 'bg-cyan-400 text-black font-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TELEMETRY CHART TAB 0: ALL SENSORS (11 MULTI-TRACK SIGNALS) */}
          {activeTelemetryTab === 'ALL_METRICS' && (
            <div className="space-y-4">
              {/* Live Signal Badges Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-11 gap-1.5 text-center text-[10px]">
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">CPU LOAD</div>
                  <div className="font-mono font-black text-amber-400">{currentFrame.cpu.loadPct}%</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">GPU LOAD</div>
                  <div className="font-mono font-black text-emerald-400">{currentFrame.gpu.loadPct}%</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">RAM USO</div>
                  <div className="font-mono font-black text-cyan-400">{currentFrame.ram.usedGb}G</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">VRAM USO</div>
                  <div className="font-mono font-black text-purple-400">{currentFrame.gpu.vramUsedGb}G</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">CPU TEMP</div>
                  <div className="font-mono font-black text-rose-400">{currentFrame.cpu.temperatureC}°C</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">GPU TEMP</div>
                  <div className="font-mono font-black text-emerald-400">{currentFrame.gpu.temperatureC}°C</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">CPU CLOCK</div>
                  <div className="font-mono font-black text-amber-300">{(currentFrame.cpu.effectiveClockMhz / 1000).toFixed(2)}G</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">GPU CLOCK</div>
                  <div className="font-mono font-black text-cyan-300">{currentFrame.gpu.effectiveClockMhz}M</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">PSU POWER</div>
                  <div className="font-mono font-black text-yellow-400">{currentFrame.psu.estimatedLoadW}W</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 font-bold">FPS ESTIMADO</div>
                  <div className="font-mono font-black text-emerald-400">{currentFrame.fpsEstimate.averageFps}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-zinc-800 col-span-2 sm:col-span-1">
                  <div className="text-[8px] text-zinc-500 font-bold">BOTTLENECK</div>
                  <div className="font-mono font-black text-amber-400 truncate text-[9px]">
                    {currentFrame.limitingFactor.split('_')[0]}
                  </div>
                </div>
              </div>

              {/* Dual Graphs: Loads & Clocks with Scrub Support */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Graph 1: Cargas & Memoria (CPU / GPU / RAM / VRAM) */}
                <div className="p-3 rounded-xl bg-[#04060a] border border-zinc-850 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      CARGAS (%) & PRESIÓN DE MEMORIA
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">0-100%</span>
                  </div>

                  <div
                    className="h-36 w-full relative overflow-hidden cursor-crosshair"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      handleScrubTimeline(Math.round(pct * Math.max(1, framesHistory.length - 1)));
                    }}
                  >
                    {/* Gridlines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                      <div className="border-b border-zinc-600 w-full" />
                      <div className="border-b border-zinc-600 w-full" />
                      <div className="border-b border-zinc-600 w-full" />
                    </div>

                    {framesHistory.length >= 2 ? (
                      <svg className="w-full h-full relative z-10" viewBox="0 0 800 140" preserveAspectRatio="none">
                        {/* CPU */}
                        <path
                          d={`M ${framesHistory.map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${140 - (f.cpu.loadPct / 100) * 130}`).join(' L ')}`}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2.2"
                        />
                        {/* GPU */}
                        <path
                          d={`M ${framesHistory.map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${140 - (f.gpu.loadPct / 100) * 130}`).join(' L ')}`}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.2"
                        />
                        {/* RAM */}
                        <path
                          d={`M ${framesHistory.map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${140 - (f.ram.pressurePct / 100) * 130}`).join(' L ')}`}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="1.8"
                          strokeDasharray="4 3"
                        />
                        {/* VRAM */}
                        <path
                          d={`M ${framesHistory.map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${140 - (f.gpu.vramPressurePct / 100) * 130}`).join(' L ')}`}
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="1.8"
                          strokeDasharray="2 2"
                        />
                        {/* Cursor line for current simulated second */}
                        <line
                          x1={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                          y1="0"
                          x2={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                          y2="140"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      </svg>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                        Muestreando señales...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-zinc-850 font-mono">
                    <span className="text-amber-400 font-bold">CPU {currentFrame.cpu.loadPct}%</span>
                    <span className="text-emerald-400 font-bold">GPU {currentFrame.gpu.loadPct}%</span>
                    <span className="text-cyan-400">RAM {currentFrame.ram.pressurePct}%</span>
                    <span className="text-purple-400">VRAM {currentFrame.gpu.vramPressurePct}%</span>
                  </div>
                </div>

                {/* Graph 2: Térmica & Frecuencias (CPU Temp / GPU Temp / Clocks) */}
                <div className="p-3 rounded-xl bg-[#04060a] border border-zinc-850 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                      TEMPERATURAS (°C) & CLOCKS
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Curvas térmicas</span>
                  </div>

                  <div
                    className="h-36 w-full relative overflow-hidden cursor-crosshair"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      handleScrubTimeline(Math.round(pct * Math.max(1, framesHistory.length - 1)));
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                      <div className="border-b border-zinc-600 w-full" />
                      <div className="border-b border-zinc-600 w-full" />
                      <div className="border-b border-zinc-600 w-full" />
                    </div>

                    {framesHistory.length >= 2 ? (
                      <svg className="w-full h-full relative z-10" viewBox="0 0 800 140" preserveAspectRatio="none">
                        {/* CPU Temp */}
                        <path
                          d={`M ${framesHistory.map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${140 - (f.cpu.temperatureC / 105) * 130}`).join(' L ')}`}
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="2.2"
                        />
                        {/* GPU Temp */}
                        <path
                          d={`M ${framesHistory.map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${140 - (f.gpu.temperatureC / 105) * 130}`).join(' L ')}`}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.2"
                        />
                        {/* CPU Clock normalized */}
                        <path
                          d={`M ${framesHistory.map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${140 - (f.cpu.effectiveClockMhz / 5800) * 130}`).join(' L ')}`}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                        {/* Cursor line */}
                        <line
                          x1={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                          y1="0"
                          x2={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                          y2="140"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      </svg>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                        Muestreando señales...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-zinc-850 font-mono">
                    <span className="text-rose-400 font-bold">CPU {currentFrame.cpu.temperatureC}°C</span>
                    <span className="text-emerald-400 font-bold">GPU {currentFrame.gpu.temperatureC}°C</span>
                    <span className="text-amber-300">{(currentFrame.cpu.effectiveClockMhz / 1000).toFixed(2)} GHz</span>
                    <span className="text-cyan-300">{currentFrame.gpu.effectiveClockMhz} MHz</span>
                  </div>
                </div>
              </div>

              {/* Bottom Strip: Dynamic Bottleneck Over Time Ribbon */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    EVOLUCIÓN TEMPORAL DEL CUELLO DE BOTELLA
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {DynamicBottleneckEngine.getFactorLabel(currentFrame.limitingFactor)} ({currentFrame.limitingFactorReasonEs})
                  </span>
                </div>

                <div className="w-full h-7 rounded-xl overflow-hidden flex bg-zinc-950 border border-zinc-800 p-0.5">
                  {framesHistory.map((f, idx) => {
                    const factor = f.limitingFactor;
                    const bg =
                      factor === 'HEALTHY_GPU_BOUND'
                        ? 'bg-emerald-500'
                        : factor.includes('THERMAL')
                        ? 'bg-rose-500'
                        : factor.includes('VRAM')
                        ? 'bg-purple-500'
                        : factor.includes('CPU')
                        ? 'bg-cyan-500'
                        : factor.includes('PSU')
                        ? 'bg-yellow-500'
                        : 'bg-zinc-600';

                    return (
                      <div
                        key={idx}
                        onClick={() => handleScrubTimeline(idx)}
                        title={`${f.timeFormatted}: ${DynamicBottleneckEngine.getFactorLabel(factor)}`}
                        className={`flex-1 h-full ${bg} hover:opacity-100 cursor-pointer transition-opacity ${
                          idx === simulatedSecond ? 'ring-2 ring-white scale-105 z-10' : 'opacity-80'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TELEMETRY CHART TAB 1: LOADS & MEMORY */}
          {activeTelemetryTab === 'LOADS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 font-bold text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> CPU: {currentFrame.cpu.loadPct}%
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> GPU: {currentFrame.gpu.loadPct}%
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> RAM Presión: {currentFrame.ram.pressurePct}% ({currentFrame.ram.usedGb}GB)
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-purple-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" /> VRAM Presión: {currentFrame.gpu.vramPressurePct}% ({currentFrame.gpu.vramUsedGb}GB)
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Escala: 0 - 100%</span>
              </div>

              {/* Multi-series SVG Graph */}
              <div
                className="h-44 w-full rounded-xl bg-[#04060a] border border-zinc-850 p-2 relative overflow-hidden flex flex-col justify-between cursor-crosshair"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  handleScrubTimeline(Math.round(pct * Math.max(1, framesHistory.length - 1)));
                }}
              >
                {/* Horizontal Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
                  <div className="border-b border-zinc-600 w-full" />
                  <div className="border-b border-zinc-600 w-full" />
                  <div className="border-b border-zinc-600 w-full" />
                  <div className="border-b border-zinc-600 w-full" />
                </div>

                {framesHistory.length >= 2 ? (
                  <svg className="w-full h-full relative z-10" viewBox="0 0 800 160" preserveAspectRatio="none">
                    {/* CPU Line */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.cpu.loadPct / 100) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* GPU Line */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.gpu.loadPct / 100) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* RAM Line */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.ram.pressurePct / 100) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                    />
                    {/* VRAM Line */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.gpu.vramPressurePct / 100) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                      strokeDasharray="2 2"
                      strokeLinecap="round"
                    />
                    <line
                      x1={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                      y1="0"
                      x2={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                      y2="160"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  </svg>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                    Generando muestras de telemetría...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TELEMETRY CHART TAB 2: THERMAL & CLOCKS */}
          {activeTelemetryTab === 'THERMAL_CLOCKS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 font-bold text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> CPU Temp: {currentFrame.cpu.temperatureC}°C (TjMax 100°C)
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> GPU Temp: {currentFrame.gpu.temperatureC}°C
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> CPU Clock: {(currentFrame.cpu.effectiveClockMhz / 1000).toFixed(2)} GHz
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> GPU Clock: {currentFrame.gpu.effectiveClockMhz} MHz
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Térmica & Frecuencia Efectiva</span>
              </div>

              <div
                className="h-44 w-full rounded-xl bg-[#04060a] border border-zinc-850 p-2 relative overflow-hidden flex flex-col justify-between cursor-crosshair"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  handleScrubTimeline(Math.round(pct * Math.max(1, framesHistory.length - 1)));
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
                  <div className="border-b border-zinc-600 w-full" />
                  <div className="border-b border-zinc-600 w-full" />
                  <div className="border-b border-zinc-600 w-full" />
                  <div className="border-b border-zinc-600 w-full" />
                </div>

                {framesHistory.length >= 2 ? (
                  <svg className="w-full h-full relative z-10" viewBox="0 0 800 160" preserveAspectRatio="none">
                    {/* CPU Temp */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.cpu.temperatureC / 105) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* GPU Temp */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.gpu.temperatureC / 105) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* CPU Clock normalized */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.cpu.effectiveClockMhz / 6000) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.8"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                      y1="0"
                      x2={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                      y2="160"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  </svg>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                    Generando muestras de telemetría...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TELEMETRY CHART TAB 3: POWER & FPS */}
          {activeTelemetryTab === 'POWER_FPS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 font-bold text-yellow-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400" /> PSU Carga: {currentFrame.psu.estimatedLoadW}W / {currentFrame.psu.ratedWattageW}W ({currentFrame.psu.headroomPct}% margen)
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> FPS Estimado: {currentFrame.fpsEstimate.averageFps} FPS
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> 1% Low FPS: {currentFrame.fpsEstimate.low1PctFps} FPS
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Entrega de Potencia DC & Framerate</span>
              </div>

              <div
                className="h-44 w-full rounded-xl bg-[#04060a] border border-zinc-850 p-2 relative overflow-hidden flex flex-col justify-between cursor-crosshair"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  handleScrubTimeline(Math.round(pct * Math.max(1, framesHistory.length - 1)));
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
                  <div className="border-b border-zinc-600 w-full" />
                  <div className="border-b border-zinc-600 w-full" />
                  <div className="border-b border-zinc-600 w-full" />
                  <div className="border-b border-zinc-600 w-full" />
                </div>

                {framesHistory.length >= 2 ? (
                  <svg className="w-full h-full relative z-10" viewBox="0 0 800 160" preserveAspectRatio="none">
                    {/* PSU Load line */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.psu.estimatedLoadW / Math.max(1, f.psu.ratedWattageW)) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* FPS line normalized */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.fpsEstimate.averageFps / 240) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* 1% Low FPS */}
                    <path
                      d={`M ${framesHistory.slice(-50).map((f, idx, arr) => `${(idx / (arr.length - 1)) * 800},${160 - (f.fpsEstimate.low1PctFps / 240) * 150}`).join(' L ')}`}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                      y1="0"
                      x2={(simulatedSecond / Math.max(1, framesHistory.length - 1)) * 800}
                      y2="160"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  </svg>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                    Generando muestras de telemetría...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TELEMETRY CHART TAB 4: BOTTLENECK EVOLUTION */}
          {activeTelemetryTab === 'BOTTLENECK' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  RÉGIMEN ACTUAL: {DynamicBottleneckEngine.getFactorLabel(currentFrame.limitingFactor)}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {currentFrame.limitingFactorReasonEs}
                </span>
              </div>

              {/* Segmented Ribbon for all recorded seconds */}
              <div className="w-full h-8 rounded-xl overflow-hidden flex bg-zinc-950 border border-zinc-800 p-0.5">
                {framesHistory.map((f, idx) => {
                  const factor = f.limitingFactor;
                  const bg =
                    factor === 'HEALTHY_GPU_BOUND'
                      ? 'bg-emerald-500'
                      : factor.includes('THERMAL')
                      ? 'bg-rose-500'
                      : factor.includes('VRAM')
                      ? 'bg-purple-500'
                      : factor.includes('CPU')
                      ? 'bg-cyan-500'
                      : factor.includes('PSU')
                      ? 'bg-yellow-500'
                      : 'bg-zinc-600';

                  return (
                    <div
                      key={idx}
                      onClick={() => handleScrubTimeline(idx)}
                      title={`${f.timeFormatted}: ${DynamicBottleneckEngine.getFactorLabel(factor)}`}
                      className={`flex-1 h-full ${bg} hover:opacity-100 cursor-pointer transition-opacity ${
                        idx === simulatedSecond ? 'ring-2 ring-white scale-105 z-10' : 'opacity-80'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> GPU-Bound Saludable
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> Presión de CPU (Main Thread)
                </div>
                <div className="flex items-center gap-1.5 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded bg-purple-500" /> Presión de VRAM / Buffers
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Throttling / Límite Térmico
                </div>
              </div>
            </div>
          )}
        </div>

        {/* In-Flight Workload Modifier Strip */}
        <div className="p-4 rounded-2xl border border-zinc-800 bg-[#090c12] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5 uppercase">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>MODIFICAR CARGA EN VIVO (SIN REINICIAR)</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              El motor matemático recalcula la contención en tiempo real
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-zinc-400 font-bold">Sumar / Quitar:</span>
            {[
              { id: 'obs_studio', title: 'OBS Studio' },
              { id: 'chrome_heavy', title: 'Chrome (8 Tabs)' },
              { id: 'discord', title: 'Discord' },
              { id: 'spotify', title: 'Spotify' },
            ].map((sec) => {
              const isIncluded = activeStack.secondaries.some((s) => s.workload.id === sec.id);
              const item = GameWorkloadRegistry.get(sec.id);

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => item && handleToggleSecondaryInFlight(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isIncluded
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  {isIncluded ? <Trash2 className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{isIncluded ? `Quitar ${sec.title}` : `+ ${sec.title}`}</span>
                </button>
              );
            })}

            <span className="text-zinc-600">|</span>

            {/* Resolution Changer */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-zinc-400 font-bold mr-1">Resolución:</span>
              {(['1080p', '1440p', '4K'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleChangeResolutionInFlight(r)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    resolution === r
                      ? 'bg-amber-400 text-black font-black'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Timeline & Event Stream with Interactive Component Highlighting */}
        <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-[#090c12] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs text-white uppercase tracking-wider">
                LÍNEA TEMPORAL DE ENSAYO & REGISTRO DE EVENTOS
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Deslizá o hacé clic en cualquier evento para resaltar el componente en placa
            </span>
          </div>

          {/* Interactive Scrubber with Timestamp */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="0"
              max={Math.max(1, framesHistory.length - 1)}
              value={simulatedSecond}
              onChange={(e) => handleScrubTimeline(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-zinc-900 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>00:00</span>
              <span className="text-amber-400 font-black bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                Instante: {currentFrame.timeFormatted}
              </span>
              <span>{durationMinutes}:00</span>
            </div>
          </div>

          {/* Event Markers Grid with Subsystem Highlighting on Hover / Click */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800/80">
            {eventsHistory.slice(-6).map((ev, idx) => (
              <div
                key={`${ev.id}-${ev.timestampSeconds}-${idx}`}
                onClick={() => {
                  handleScrubTimeline(ev.timestampSeconds);
                  setHighlightedSubsystem(ev.affectedSubsystem);
                  if (['cpu', 'gpu', 'ram', 'storage', 'psu'].includes(ev.affectedSubsystem.toLowerCase())) {
                    setSelectedSubsystem(ev.affectedSubsystem.toUpperCase() as SubsystemIdentifier);
                  }
                }}
                onMouseEnter={() => setHighlightedSubsystem(ev.affectedSubsystem)}
                onMouseLeave={() => setHighlightedSubsystem(null)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  ev.severity === 'CRITICAL'
                    ? 'border-rose-500/50 bg-rose-950/25 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                    : ev.severity === 'WARNING'
                    ? 'border-amber-500/50 bg-amber-950/25 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold font-mono uppercase text-cyan-400">{ev.timeFormatted}</span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-black/50 text-white border border-zinc-700">
                    {ev.affectedSubsystem.toUpperCase()}
                  </span>
                </div>
                <div className="font-bold text-xs mt-1 leading-tight text-white">{ev.title}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">{ev.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER PHASE 3: FINAL SESSION REPORT
  // ==========================================================================
  if (phase === 'SESSION_REPORT' && finalReport) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 font-mono-tech">
        {/* Header Bar */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090c12] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ENSAYO COMPLETADO // EVO LIVE LOAD REPORT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              REPORTE TÉCNICO & DICTAMEN DE RENDIMIENTO
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Carga: {finalReport.stack.primary?.workload.title} ({durationMinutes} minutos)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowTechnicalModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>VER ANÁLISIS TÉCNICO</span>
            </button>

            <button
              type="button"
              onClick={handleRunUpgradeComparison}
              className="px-5 py-2 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all cursor-pointer flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>PROBAR OTRA GPU / SIMULAR UPGRADE</span>
            </button>
          </div>
        </div>

        {/* Peak Performance Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0b0e14]">
            <div className="text-[10px] text-zinc-500 font-bold uppercase">FPS PROMEDIO</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
              {finalReport.peakMetrics.averageFps} <span className="text-xs text-zinc-500">FPS</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">1% Low: {finalReport.peakMetrics.min1PctFps} FPS</div>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0b0e14]">
            <div className="text-[10px] text-zinc-500 font-bold uppercase">PICO TEMP GPU</div>
            <div className={`text-2xl font-black mt-1 font-mono ${finalReport.peakMetrics.maxGpuTempC >= 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {finalReport.peakMetrics.maxGpuTempC}°C
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">Margen min: {finalReport.peakMetrics.minThermalHeadroomC}°C</div>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0b0e14]">
            <div className="text-[10px] text-zinc-500 font-bold uppercase">PICO TEMP CPU</div>
            <div className={`text-2xl font-black mt-1 font-mono ${finalReport.peakMetrics.maxCpuTempC >= 85 ? 'text-rose-400' : 'text-amber-400'}`}>
              {finalReport.peakMetrics.maxCpuTempC}°C
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">vs 100°C TJMax</div>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0b0e14]">
            <div className="text-[10px] text-zinc-500 font-bold uppercase">CONSUMO MÁXIMO PSU</div>
            <div className="text-2xl font-black text-cyan-300 mt-1 font-mono">
              {finalReport.peakMetrics.maxPsuLoadW}W
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">Margen: {finalReport.peakMetrics.minPowerHeadroomW}W</div>
          </div>
        </div>

        {/* Non-Technical Explanation ("¿QUÉ PODÉS HACER?") */}
        <div className="p-5 rounded-2xl border border-amber-400/40 bg-amber-950/20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>DICTAMEN PEDAGÓGICO EVO LABS</span>
          </div>

          <div className="text-sm text-zinc-200 leading-relaxed font-sans font-medium">
            {finalReport.summaryTextNonTechnical}
          </div>

          {/* Action Recommendations */}
          <div className="space-y-2 pt-3 border-t border-amber-400/20">
            <div className="text-xs font-bold text-white uppercase">¿QUÉ PODÉS HACER?</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {finalReport.whatYouCanDoRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs ${
                    rec.impact === 'UNNECESSARY_EXPENSE'
                      ? 'border-rose-500/40 bg-rose-950/20 text-rose-200'
                      : rec.impact === 'HIGH'
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{rec.actionTitle}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40">
                      {rec.impact === 'UNNECESSARY_EXPENSE' ? 'GASTO INNECESARIO' : `IMPACTO ${rec.impact}`}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">{rec.justification}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottleneck Temporal Breakdown */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090c12] space-y-4">
          <div className="text-xs font-bold text-white uppercase flex items-center justify-between">
            <span>DISTRIBUCIÓN DEL CUELLO DE BOTELLA A LO LARGO DEL ENSAYO</span>
            <span className="text-zinc-500">Total: {durationMinutes} min</span>
          </div>

          <div className="w-full h-4 rounded-full overflow-hidden flex bg-zinc-900 border border-zinc-800">
            {finalReport.bottleneckTimelinePercentages.map((item, idx) => {
              const bgClass =
                item.factor === 'HEALTHY_GPU_BOUND'
                  ? 'bg-emerald-500'
                  : item.factor.includes('THERMAL')
                  ? 'bg-rose-500'
                  : item.factor.includes('VRAM')
                  ? 'bg-amber-500'
                  : item.factor.includes('CPU')
                  ? 'bg-cyan-500'
                  : 'bg-zinc-600';

              return (
                <div
                  key={idx}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.label}: ${item.percentage}% (${item.durationSeconds}s)`}
                  className={`${bgClass} transition-all`}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {finalReport.bottleneckTimelinePercentages.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs">
                <div className="text-[10px] text-zinc-400 truncate">{item.label}</div>
                <div className="font-bold text-white mt-0.5">
                  {item.percentage}% <span className="text-zinc-500 text-[10px]">({Math.round(item.durationSeconds / 60)}m {item.durationSeconds % 60}s)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => setPhase('CONFIG_LOAD')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REALIZAR OTRO ENSAYO</span>
          </button>

          <button
            type="button"
            onClick={handleRunUpgradeComparison}
            className="px-6 py-2.5 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all cursor-pointer flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>PROBAR OTRA GPU / SIMULAR UPGRADE</span>
          </button>
        </div>

        {/* Technical Forensic Modal */}
        {showTechnicalModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#0b0e14] p-6 space-y-5 font-mono-tech shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>REGISTRO PERICIAL DE TELEMETRÍA (DIGITAL TWIN)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTechnicalModal(false)}
                  className="px-3 py-1 rounded-lg text-xs bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
                >
                  CERRAR
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-zinc-500 font-bold uppercase mb-1">Procedencia Epistémica</div>
                  <div className="text-zinc-300">
                    {machine.isDetected
                      ? 'Telemetría calibrada con sensores nativos de hardware detectado.'
                      : 'Simulación virtual analítica (Digital Twin) en base a especificaciones de catálogo de fabricantes y modelos matemáticos de disipación diferencial.'}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-zinc-400 font-bold uppercase">Eventos Críticos Registrados:</div>
                  {finalReport.events.map((ev, idx) => (
                    <div key={`${ev.id}-${ev.timestampSeconds}-${idx}`} className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-cyan-400 font-bold mr-2">{ev.timeFormatted}</span>
                        <span className="text-white font-bold">{ev.title}</span>
                      </div>
                      <span className="text-zinc-500">{ev.affectedSubsystem.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // RENDER PHASE 4: UPGRADE COMPARISON ("PROBAR OTRA GPU")
  // ==========================================================================
  if (phase === 'UPGRADE_COMPARISON' && finalReport && upgradeReport) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 font-mono-tech">
        {/* Header Bar */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090c12] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>SIMULACIÓN COMPARATIVA DE UPGRADE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ORIGINAL vs ESCENARIO CON UPGRADE
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Misma carga exacta de {finalReport.stack.primary?.workload.title} ({resolution} preset {quality})
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPhase('SESSION_REPORT')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all cursor-pointer"
          >
            VOLVER AL REPORTE
          </button>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Original Machine */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0b0e14] space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-bold text-xs text-zinc-400 uppercase">CONFIGURACIÓN ORIGINAL</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">BASE</span>
            </div>

            <div className="text-sm font-bold text-white truncate">{machine.gpu.model}</div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">FPS PROMEDIO</div>
                <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                  {finalReport.peakMetrics.averageFps} FPS
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">1% LOW FPS</div>
                <div className="text-xl font-black text-zinc-300 font-mono mt-0.5">
                  {finalReport.peakMetrics.min1PctFps} FPS
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">TEMP GPU PICO</div>
                <div className="text-xl font-black text-zinc-300 font-mono mt-0.5">
                  {finalReport.peakMetrics.maxGpuTempC}°C
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">CONSUMO PSU</div>
                <div className="text-xl font-black text-zinc-300 font-mono mt-0.5">
                  {finalReport.peakMetrics.maxPsuLoadW}W
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
              <span className="text-zinc-500 font-bold">Régimen: </span>
              {DynamicBottleneckEngine.getFactorLabel(finalReport.dominantLimitingFactor)}
            </div>
          </div>

          {/* Card 2: Upgraded Scenario */}
          <div className="p-5 rounded-2xl border border-cyan-400/40 bg-cyan-950/10 space-y-4 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <div className="flex items-center justify-between border-b border-cyan-400/20 pb-3">
              <span className="font-bold text-xs text-cyan-400 uppercase">ESCENARIO CON UPGRADE</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-400 text-black font-black">
                SIMULADO
              </span>
            </div>

            <div className="text-sm font-bold text-white truncate">{upgradeGpuModel}</div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-cyan-400/30">
                <div className="text-[10px] text-cyan-400 font-bold uppercase">FPS PROMEDIO</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
                  <span>{upgradeReport.peakMetrics.averageFps} FPS</span>
                  <span className="text-xs text-emerald-400">
                    (+{Math.round(((upgradeReport.peakMetrics.averageFps - finalReport.peakMetrics.averageFps) / Math.max(1, finalReport.peakMetrics.averageFps)) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-cyan-400/30">
                <div className="text-[10px] text-cyan-400 font-bold uppercase">1% LOW FPS</div>
                <div className="text-xl font-black text-cyan-300 font-mono mt-0.5">
                  {upgradeReport.peakMetrics.min1PctFps} FPS
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-cyan-400/30">
                <div className="text-[10px] text-cyan-400 font-bold uppercase">TEMP GPU PICO</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                  {upgradeReport.peakMetrics.maxGpuTempC}°C
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-cyan-400/30">
                <div className="text-[10px] text-cyan-400 font-bold uppercase">CONSUMO PSU</div>
                <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                  {upgradeReport.peakMetrics.maxPsuLoadW}W
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-400/20 text-xs text-cyan-300">
              <span className="text-zinc-500 font-bold">Régimen: </span>
              {DynamicBottleneckEngine.getFactorLabel(upgradeReport.dominantLimitingFactor)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
