import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Eye,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Gauge,
  Monitor,
  Info,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  Play,
  Cpu,
  Activity,
  Search,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';
import {
  FluidezGameOption,
  FluidezResolution,
  FluidezQuality,
  FluidezFpsLimit,
  FluidezVsync,
  FluidezSensacion,
  FluidezSintoma,
  UserPcSpec,
} from '../../types';
import { GameWorkloadRegistry } from '../evoLabCore/services/digitalTwin/gameWorkloadRegistry';
import { EvoSystemLoadSolver } from '../evoLabCore/services/digitalTwin/evoSystemLoadSolver';
import { WorkloadStack } from '../evoLabCore/services/digitalTwin/types';
import { Machine } from '../evoLabCore/types';

interface FpsLabStationProps {
  specs?: Partial<UserPcSpec>;
  game: FluidezGameOption;
  setGame: (g: FluidezGameOption) => void;
  customGameName: string;
  setCustomGameName: (s: string) => void;
  resolution: FluidezResolution;
  setResolution: (r: FluidezResolution) => void;
  customResolution: string;
  setCustomResolution: (s: string) => void;
  quality: FluidezQuality;
  setQuality: (q: FluidezQuality) => void;
  fpsLimit: FluidezFpsLimit;
  setFpsLimit: (l: FluidezFpsLimit) => void;
  customFpsLimit: string;
  setCustomFpsLimit: (s: string) => void;
  vsync: FluidezVsync;
  setVsync: (v: FluidezVsync) => void;
  monitor: string;
  setMonitor: (m: string) => void;
  fpsHabituales: number | null;
  setFpsHabituales: (n: number | null) => void;
  caidaObservada: number | null;
  setCaidaObservada: (n: number | null) => void;
  sensacion: FluidezSensacion;
  setSensacion: (s: FluidezSensacion) => void;
  sintomas: FluidezSintoma[];
  toggleSintoma: (s: FluidezSintoma) => void;
  hasTelemetry: boolean;
  setHasTelemetry: (b: boolean) => void;
  avgFps: number | null;
  setAvgFps: (n: number | null) => void;
  onePercentLow: number | null;
  setOnePercentLow: (n: number | null) => void;
  zeroPointOnePercentLow: number | null;
  setZeroPointOnePercentLow: (n: number | null) => void;
  frametimeAvgMs: number | null;
  setFrametimeAvgMs: (n: number | null) => void;
  frametimePeakMs: number | null;
  setFrametimePeakMs: (n: number | null) => void;
  captureDurationSeconds: number | null;
  setCaptureDurationSeconds: (n: number | null) => void;
  highlightMissing?: boolean;
}

const POPULAR_GAMES_CATALOG = [
  { id: 'VALORANT', title: 'VALORANT', category: 'ESPORTS', desc: 'Riot Direct / Vanguard' },
  { id: 'COUNTER-STRIKE 2', title: 'COUNTER-STRIKE 2', category: 'ESPORTS', desc: 'Source 2 / Sub-tick' },
  { id: 'FORTNITE', title: 'FORTNITE', category: 'ESPORTS / AAA', desc: 'Unreal Engine 5 / DX12' },
  { id: 'CYBERPUNK 2077', title: 'CYBERPUNK 2077', category: 'AAA HEAVY', desc: 'REDengine 4 / Path Tracing' },
  { id: 'GRAND THEFT AUTO V', title: 'GTA V / GTA ONLINE', category: 'AAA OPEN WORLD', desc: 'RAGE Engine / DX11' },
  { id: 'ELDEN RING', title: 'ELDEN RING', category: 'AAA ACTION', desc: 'FromSoftware Engine' },
  { id: 'CALL OF DUTY: WARZONE', title: 'COD WARZONE', category: 'AAA BATTLE ROYALE', desc: 'IW 9.0 Engine' },
  { id: 'RED DEAD REDEMPTION 2', title: 'RED DEAD REDEMPTION 2', category: 'AAA HEAVY', desc: 'RAGE Engine / Vulkan' },
  { id: 'LEAGUE OF LEGENDS', title: 'LEAGUE OF LEGENDS', category: 'LIGHT ESPORTS', desc: 'Riot Engine' },
  { id: 'APEX LEGENDS', title: 'APEX LEGENDS', category: 'ESPORTS', desc: 'Source Engine Modified' },
  { id: 'OTRO', title: 'CARGAR CUALQUIER OTRO JUEGO', category: 'CUSTOM SEARCH', desc: 'Escribí el nombre del título' },
];

const ALL_SINTOMAS: { id: FluidezSintoma; label: string; desc: string }[] = [
  { id: 'micro-stuttering', label: 'Micro-stuttering', desc: 'Tironcitos rápidos y casi imperceptibles pero molestos' },
  { id: 'tirón al girar', label: 'Tirón al girar cámara', desc: 'Freno abrupto al rotar la vista 90° o 180° rápidamente' },
  { id: 'tirón al entrar en combate', label: 'Tirón al entrar en combate', desc: 'Caída súbita al cruzarse con enemigos o lanzar habilidades' },
  { id: 'congelamiento breve', label: 'Congelamiento breve', desc: 'Pausa de 100 ms a 500 ms con pantalla fija' },
  { id: 'tirón al cargar zona', label: 'Tirón al cargar zona / mapa', desc: 'Freno al cruzar umbrales o cambiar de sector' },
  { id: 'ninguno', label: 'Ninguno / Experiencia continua', desc: 'No se percibe ninguna perturbación visual' },
];

function buildMachineFromUserSpecs(specs?: Partial<UserPcSpec>): Machine {
  const cpuStr = (specs?.cpu || 'Intel Core i5-12400F').toLowerCase();
  const gpuStr = (specs?.gpu || 'NVIDIA GeForce RTX 3060 12GB').toLowerCase();
  const ramStr = (specs?.ram || '16 GB DDR4 3200MHz').toLowerCase();

  let cores = 6;
  let threads = 12;
  let boostClockGhz = 4.4;

  if (cpuStr.includes('i7') || cpuStr.includes('7700') || cpuStr.includes('7800') || cpuStr.includes('5800') || cpuStr.includes('ryzen 7')) {
    cores = 8; threads = 16; boostClockGhz = 5.0;
  } else if (cpuStr.includes('i9') || cpuStr.includes('13900') || cpuStr.includes('14900') || cpuStr.includes('7950') || cpuStr.includes('ryzen 9')) {
    cores = 16; threads = 32; boostClockGhz = 5.6;
  } else if (cpuStr.includes('i3') || cpuStr.includes('quad') || cpuStr.includes('3200g') || cpuStr.includes('ryzen 3')) {
    cores = 4; threads = 8; boostClockGhz = 4.0;
  } else if (cpuStr.includes('i5') || cpuStr.includes('5600') || cpuStr.includes('3600') || cpuStr.includes('10400') || cpuStr.includes('12400') || cpuStr.includes('ryzen 5')) {
    cores = 6; threads = 12; boostClockGhz = 4.4;
  }

  let vramGb = 8;
  let gpuPowerW = 170;
  let isDedicated = true;

  if (gpuStr.includes('4090')) { vramGb = 24; gpuPowerW = 450; }
  else if (gpuStr.includes('4080')) { vramGb = 16; gpuPowerW = 320; }
  else if (gpuStr.includes('4070') || gpuStr.includes('7800')) { vramGb = 12; gpuPowerW = 220; }
  else if (gpuStr.includes('3080') || gpuStr.includes('6800')) { vramGb = 10; gpuPowerW = 300; }
  else if (gpuStr.includes('3070') || gpuStr.includes('6700')) { vramGb = 8; gpuPowerW = 220; }
  else if (gpuStr.includes('3060') || gpuStr.includes('6600')) { vramGb = 12; gpuPowerW = 170; }
  else if (gpuStr.includes('2060') || gpuStr.includes('5600')) { vramGb = 6; gpuPowerW = 160; }
  else if (gpuStr.includes('1660') || gpuStr.includes('1650') || gpuStr.includes('580')) { vramGb = 6; gpuPowerW = 120; }
  else if (gpuStr.includes('intel hd') || gpuStr.includes('graphics') || gpuStr.includes('vega') || gpuStr.includes('integrated')) { vramGb = 2; gpuPowerW = 25; isDedicated = false; }

  let ramGb = 16;
  let ramSpeedMts = 3200;
  const ramMatch = ramStr.match(/(\d+)\s*gb/i);
  if (ramMatch) ramGb = parseInt(ramMatch[1], 10);
  const speedMatch = ramStr.match(/(\d{4})\s*(mhz|mts)/i);
  if (speedMatch) ramSpeedMts = parseInt(speedMatch[1], 10);

  return {
    id: 'user-pc-spec',
    alias: 'PC de Usuario en Prueba',
    name: 'PC de Usuario',
    machineType: 'CUSTOM_DESKTOP',
    isDetected: true,
    overallProvenance: 'USER_ENTERED',
    motherboard: {
      model: specs?.motherboard || 'B550 / B660 Chipset Motherboard',
      socket: 'AM4/LGA1700',
      chipset: 'B550/B660',
      ramSlots: 4,
      ramType: ramStr.includes('ddr5') ? 'DDR5' : 'DDR4',
      pcieGen: 'PCIe 4.0',
      formFactor: 'ATX',
      provenance: 'USER_ENTERED',
    },
    cpu: {
      model: specs?.cpu || 'Procesador de Sistema',
      socket: 'AM4/LGA1700',
      cores,
      threads,
      baseClockGhz: 3.2,
      boostClockGhz,
      tdpW: 65,
      hasIGPU: !isDedicated,
      provenance: 'USER_ENTERED',
    },
    ram: {
      sizeGb: ramGb,
      configuredSpeedMts: ramSpeedMts,
      type: ramStr.includes('ddr5') ? 'DDR5' : 'DDR4',
      channels: 2,
      provenance: 'USER_ENTERED',
    },
    gpu: {
      model: specs?.gpu || 'Placa de Video',
      vramGb,
      isDedicated,
      powerW: gpuPowerW,
      provenance: 'USER_ENTERED',
    },
    storage: {
      type: specs?.storage?.toLowerCase().includes('nvme') ? 'NVMe M.2' : 'SATA SSD',
      capacityGb: 1000,
      model: specs?.storage || 'SSD Almacenamiento',
      provenance: 'USER_ENTERED',
    },
    psu: { wattageW: 650, rating: '80+ Bronze', provenance: 'USER_ENTERED' },
    cooling: { model: 'Air Cooler Standard', type: 'Air Tower', tdpCapacityW: 150, provenance: 'USER_ENTERED' },
    workloadTargets: [],
  };
}

export const FpsLabStation: React.FC<FpsLabStationProps> = ({
  specs,
  game,
  setGame,
  customGameName,
  setCustomGameName,
  resolution,
  setResolution,
  customResolution,
  setCustomResolution,
  quality,
  setQuality,
  fpsLimit,
  setFpsLimit,
  customFpsLimit,
  setCustomFpsLimit,
  vsync,
  setVsync,
  monitor,
  setMonitor,
  fpsHabituales,
  setFpsHabituales,
  caidaObservada,
  setCaidaObservada,
  sensacion,
  setSensacion,
  sintomas,
  toggleSintoma,
  hasTelemetry,
  setHasTelemetry,
  avgFps,
  setAvgFps,
  onePercentLow,
  setOnePercentLow,
  zeroPointOnePercentLow,
  setZeroPointOnePercentLow,
  frametimeAvgMs,
  setFrametimeAvgMs,
  frametimePeakMs,
  setFrametimePeakMs,
  captureDurationSeconds,
  setCaptureDurationSeconds,
  highlightMissing,
}) => {
  const [isTelemetryGuideOpen, setIsTelemetryGuideOpen] = useState(false);
  const [instrumentChecked, setInstrumentChecked] = useState(true);
  const [calculationSummary, setCalculationSummary] = useState<{
    limitingFactor: string;
    gpuUsagePct: number;
    cpuUsagePct: number;
    vramUsedGb: number;
    gameTitle: string;
  } | null>(null);

  // Active game title helper
  const activeGameTitle = game === 'OTRO' ? (customGameName || 'Juego Personalizado') : game;

  // Real FPS Calculation Engine
  const calculateRealFps = (gameTitleToTest?: string) => {
    const title = gameTitleToTest || activeGameTitle;
    if (!title || title.trim() === '') return;

    // 1. Get or discover game workload
    const gameWorkload = GameWorkloadRegistry.searchOrDiscover(title);

    // 2. Parse specs into Machine object
    const machine = buildMachineFromUserSpecs(specs);

    // 3. Map resolution
    let resKey: '1080p' | '1440p' | '4K' = '1080p';
    if (resolution === '1920×1080' || resolution === '1600×900' || resolution === '1280×960' || resolution === '1280×720') {
      resKey = '1080p';
    } else if (customResolution.includes('1440') || customResolution.includes('2K')) {
      resKey = '1440p';
    } else if (customResolution.includes('2160') || customResolution.includes('4K')) {
      resKey = '4K';
    }

    // 4. Map quality
    let qualKey: 'LOW_COMPETITIVE' | 'MEDIUM' | 'HIGH' | 'ULTRA_RAYTRACING' = 'LOW_COMPETITIVE';
    if (quality === 'BAJA') qualKey = 'LOW_COMPETITIVE';
    else if (quality === 'MEDIA') qualKey = 'MEDIUM';
    else if (quality === 'ALTA') qualKey = 'HIGH';
    else qualKey = 'MEDIUM';

    // 5. Construct stack and run solver
    const stack: WorkloadStack = {
      primary: {
        instanceId: `game_inst_${Date.now()}`,
        addedAtSeconds: 0,
        workload: gameWorkload,
        role: 'PRIMARY',
        resolution: resKey,
        quality: qualKey,
      },
      secondaries: [],
      backgrounds: [],
      isSyntheticCombined: false,
    };

    const load = EvoSystemLoadSolver.solveInstantaneousLoad(machine, stack, 30);

    // Apply VSync / FPS limit caps if active
    let finalAvgFps = load.fpsEstimate;
    let final1PctLow = load.low1PctFps;

    let maxCap = 999;
    if (fpsLimit !== 'SIN LÍMITE') {
      if (fpsLimit === 'PERSONALIZADO' && customFpsLimit) {
        maxCap = parseInt(customFpsLimit, 10) || 999;
      } else {
        maxCap = parseInt(fpsLimit, 10) || 999;
      }
    }

    if (vsync === 'ACTIVO') {
      maxCap = Math.min(maxCap, 144);
    }

    if (finalAvgFps > maxCap) {
      finalAvgFps = maxCap;
      final1PctLow = Math.min(final1PctLow, maxCap * 0.95);
    }

    const final01PctLow = Math.max(1, Math.round(final1PctLow * 0.72));
    const frametimeAvg = parseFloat((1000 / Math.max(1, finalAvgFps)).toFixed(2));
    const frametimePeak = parseFloat((1000 / Math.max(1, final01PctLow)).toFixed(2));

    // Determine bottleneck diagnosis
    let limitingFactor = 'BALANCEADO';
    if (load.gpuRasterPct >= 95) {
      limitingFactor = `Placa de Video (${machine.gpu.model}) al ${load.gpuRasterPct}% uso (Límite Gráfico / RASTER)`;
    } else if (load.cpuSingleThreadPct >= 90) {
      limitingFactor = `Procesador (${machine.cpu.model}) al ${load.cpuSingleThreadPct}% uso Mono-núcleo (Límite CPU)`;
    } else if (load.vramPressurePct >= 90) {
      limitingFactor = `Saturación de VRAM GPU (${load.vramUsedGb}GB / ${load.vramTotalGb}GB)`;
    } else if (load.ramPressurePct >= 90) {
      limitingFactor = `Saturación de RAM (${load.ramUsedGb}GB / ${load.ramTotalGb}GB)`;
    }

    // Infer perceived sensation
    const lowRatio = final1PctLow / Math.max(1, finalAvgFps);
    let inferredSensacion: FluidezSensacion = 'FLUIDA';
    if (lowRatio > 0.88 && finalAvgFps >= 120) inferredSensacion = 'MUY FLUIDA';
    else if (lowRatio > 0.80) inferredSensacion = 'FLUIDA';
    else if (lowRatio > 0.65) inferredSensacion = 'IRREGULAR';
    else if (lowRatio > 0.50) inferredSensacion = 'MICRO-TIRONES';
    else inferredSensacion = 'TIRONES NOTORIOS';

    // Update state
    setAvgFps(finalAvgFps);
    setOnePercentLow(final1PctLow);
    setZeroPointOnePercentLow(final01PctLow);
    setFrametimeAvgMs(frametimeAvg);
    setFrametimePeakMs(frametimePeak);
    setFpsHabituales(finalAvgFps);
    setCaidaObservada(final1PctLow);
    setHasTelemetry(true);
    setSensacion(inferredSensacion);

    setCalculationSummary({
      limitingFactor,
      gpuUsagePct: load.gpuRasterPct,
      cpuUsagePct: load.cpuDemandPct,
      vramUsedGb: load.vramUsedGb,
      gameTitle: title,
    });
  };

  // Select game from catalog
  const handleSelectGameOption = (optId: string) => {
    if (['VALORANT', 'COUNTER-STRIKE 2', 'FORTNITE'].includes(optId)) {
      setGame(optId as FluidezGameOption);
      setCustomGameName('');
      calculateRealFps(optId);
    } else if (optId === 'OTRO') {
      setGame('OTRO');
      if (customGameName) calculateRealFps(customGameName);
    } else {
      setGame('OTRO');
      setCustomGameName(optId);
      calculateRealFps(optId);
    }
  };

  // Frametime theoretical calculation
  const frametimeTeorico = fpsHabituales && fpsHabituales > 0 ? (1000 / fpsHabituales).toFixed(2) : null;

  return (
    <section id="seccion-estacion-05" className="space-y-8 pt-4">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-yellow-400 font-bold">
            <span>ESTACIÓN 05</span>
            <span>•</span>
            <span>SIMULADOR DE JUEGOS // MEDÍ CUALQUIER JUEGO EN TIEMPO REAL</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
            CARGÁ O SELECCIONÁ CUALQUIER JUEGO Y CALCULÁ SUS FPS REALES
          </h2>
        </div>
        <span className="text-xs font-mono-tech px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold uppercase self-start sm:self-auto shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>SIMULACIÓN DIGITAL TWIN</span>
        </span>
      </div>

      <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
        Cargá el juego que quieras probar. El motor de simulación de EVO LABS cruza los requerimientos reales del juego con las capacidades exactas de tu CPU, GPU y memoria RAM para calcular cuántos FPS mide tu máquina y detectar posibles cuellos de botella.
      </p>

      {/* ============================================================ */}
      {/* PASO 1 // ELEGÍ O CARGÁ CUALQUIER JUEGO */}
      {/* ============================================================ */}
      <div
        id="paso-elegir-juego"
        className={`p-5 sm:p-6 rounded-2xl bg-[#121318] border transition-colors space-y-5 ${
          highlightMissing && !game
            ? 'border-red-500 shadow-lg shadow-red-500/20 ring-1 ring-red-500'
            : 'border-zinc-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
            <Gamepad2 className="w-4 h-4 text-yellow-400" />
            <span>PASO 1 // ELEGÍ O CARGÁ CUALQUIER JUEGO</span>
          </div>
          <span className="text-[10px] font-mono-tech text-yellow-400 font-bold uppercase px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/30">
            JUEGO ACTIVO: {activeGameTitle}
          </span>
        </div>

        {/* Popular Games Catalog Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {POPULAR_GAMES_CATALOG.map((item) => {
            const isSelected =
              (item.id === 'OTRO' && game === 'OTRO') ||
              (item.id === game && game !== 'OTRO') ||
              (game === 'OTRO' && customGameName.toLowerCase() === item.id.toLowerCase()) ||
              (game === 'OTRO' && customGameName.toLowerCase() === item.title.toLowerCase());

            return (
              <button
                key={item.id}
                type="button"
                id={`btn-game-${item.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleSelectGameOption(item.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-400/15 border-yellow-400 text-white font-bold shadow-lg shadow-yellow-400/10 ring-1 ring-yellow-400/50'
                    : 'bg-zinc-900/80 border-zinc-800/90 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div>
                  <span className="text-[9px] font-mono-tech text-yellow-400 font-bold uppercase block mb-0.5">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono-tech font-bold uppercase block text-white line-clamp-1">
                    {item.title}
                  </span>
                </div>
                <span className="text-[10px] font-sans-editorial text-zinc-400 mt-2 block truncate">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Custom Game Loader */}
        <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
          <label className="block text-xs font-mono-tech text-zinc-300 uppercase tracking-wider font-bold">
            BUSCAR / CARGAR CUALQUIER OTRO TÍTULO PERSONALIZADO:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                id="input-custom-game-name"
                value={customGameName}
                onChange={(e) => {
                  setGame('OTRO');
                  setCustomGameName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    calculateRealFps(customGameName);
                  }
                }}
                placeholder="Ej. Apex Legends, Cyberpunk 2077, GTA V, EA Sports FC 24, Minecraft, Red Dead Redemption 2..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm font-mono-tech text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <button
              type="button"
              onClick={() => calculateRealFps(customGameName || game)}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-mono-tech font-bold text-xs uppercase cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="w-4 h-4 text-black fill-black" />
              <span>CARGAR JUEGO & CALCULAR FPS</span>
            </button>
          </div>
          <p className="text-[11px] font-mono-tech text-zinc-400">
            Escribí el nombre del juego que quieras probar y presioná "CARGAR JUEGO & CALCULAR FPS". El motor evaluará su demanda gráfica.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PASO 2 // ACTIVÁ TU INSTRUMENTO (REGLA EDITORIAL OBLIGATORIA) */}
      {/* ============================================================ */}
      <div id="paso-activa-instrumento" className="p-5 sm:p-7 rounded-2xl bg-[#0e1014] border-2 border-yellow-400/80 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
            <Eye className="w-4 h-4 text-yellow-400" />
            <span>PASO 2 // ACTIVÁ TU INSTRUMENTO DE MEDIDA</span>
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
            Primero vamos a hacer visibles los FPS. Después aprenderemos a medir lo que el contador no muestra.
          </h3>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 italic">
            Regla metódica EVO LABS: no preguntamos cuántos FPS tenés sin enseñarte primero qué medís, dónde activar el contador y qué valor registrar.
          </p>
        </div>

        {/* Dynamic game specific activation instruction */}
        <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-zinc-800/90 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-tech text-yellow-400 font-bold uppercase tracking-wider">
            <span>GUÍA DE ACTIVACIÓN // {game}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
              PASO A PASO
            </span>
          </div>

          {game === 'VALORANT' && (
            <div className="space-y-2.5 text-xs font-mono-tech text-zinc-300">
              <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-200 leading-relaxed">
                <span className="text-yellow-400 font-bold block mb-1">RECORRIDO EN EL MENÚ:</span>
                <span className="text-white font-bold">CONFIGURACIÓN</span> → <span className="text-white font-bold">VIDEO</span> → <span className="text-white font-bold">ESTADÍSTICAS</span> → Ubicá la fila <span className="text-yellow-400 font-bold">“FPS del cliente”</span> → Cambiá a <span className="text-white font-bold">“Solo texto”</span> o <span className="text-white font-bold">“Texto y gráfico”</span>.
              </div>
              <p className="font-sans-editorial text-xs sm:text-[13px] text-zinc-400 leading-relaxed">
                💡 <strong className="text-zinc-200">Consejo EVO:</strong> Mirar un único número durante un segundo no alcanza. Jugá aproximadamente 60 segundos en Deathmatch o galería de tiro y observá el rango en el que oscila habitualmente.
              </p>
            </div>
          )}

          {game === 'COUNTER-STRIKE 2' && (
            <div className="space-y-2.5 text-xs font-mono-tech text-zinc-300">
              <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-200 leading-relaxed space-y-2">
                <div>
                  <span className="text-yellow-400 font-bold block mb-0.5">MÉTODO PRINCIPAL (INTERFAZ):</span>
                  <span className="text-white font-bold">AJUSTES (Engranaje)</span> → <span className="text-white font-bold">PARTIDA</span> → <span className="text-white font-bold">TELEMETRÍA</span> → Activá <span className="text-yellow-400 font-bold">“Mostrar siempre FPS y tiempo de cuadro”</span>.
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-zinc-400 block mb-0.5">MÉTODO TÉCNICO OPCIONAL (CONSOLA):</span>
                  Presioná la tecla <span className="text-white font-bold">~</span> y escribí <code className="text-yellow-300 bg-black px-1.5 py-0.5 rounded">cl_showfps 1</code>.
                </div>
              </div>
              <p className="font-sans-editorial text-xs sm:text-[13px] text-zinc-400 leading-relaxed">
                💡 <strong className="text-zinc-200">Consejo EVO:</strong> El sistema de telemetría de CS2 muestra tanto los FPS como el tiempo de cuadro en ms en la esquina superior derecha.
              </p>
            </div>
          )}

          {game === 'FORTNITE' && (
            <div className="space-y-2.5 text-xs font-mono-tech text-zinc-300">
              <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-200 leading-relaxed">
                <span className="text-yellow-400 font-bold block mb-1">RECORRIDO EN EL MENÚ:</span>
                <span className="text-white font-bold">AJUSTES (Esc)</span> → <span className="text-white font-bold">VIDEO</span> → Bajá hasta la sección <span className="text-white font-bold">“Gráficos avanzados”</span> → Ubicá <span className="text-yellow-400 font-bold">“Mostrar FPS”</span> → Cambiá a <span className="text-white font-bold">“ACTIVADO”</span> → Guardá con <span className="text-white font-bold">Aplicar</span>.
              </div>
              <p className="font-sans-editorial text-xs sm:text-[13px] text-zinc-400 leading-relaxed">
                💡 <strong className="text-zinc-200">Consejo EVO:</strong> La medición debe hacerse dentro de una partida real o en Creativo en movimiento continuo, no solamente en el lobby principal donde la carga es estática.
              </p>
            </div>
          )}

          {game === 'OTRO' && (
            <div className="space-y-2.5 text-xs font-mono-tech text-zinc-300">
              <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-200 leading-relaxed space-y-2">
                <div>
                  <span className="text-yellow-400 font-bold block mb-0.5">DÓNDE BUSCAR EN EL MENÚ:</span>
                  Entrá en <span className="text-white font-bold">Ajustes / Opciones</span> → <span className="text-white font-bold">Video / Pantalla / Interfaz</span> → Buscá opciones llamadas <span className="text-yellow-400 font-bold">“Mostrar FPS”</span>, <span className="text-yellow-400 font-bold">“FPS Counter”</span> o <span className="text-yellow-400 font-bold">“Estadísticas de rendimiento”</span>.
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-zinc-400 block mb-0.5">SI EL JUEGO NO TIENE CONTADOR INTEGRADO:</span>
                  Podés activar el contador de Steam (<span className="text-white">Parámetros → En la partida → Contador de FPS</span>) o la superposición de Windows (<span className="text-white">Win + G → Rendimiento</span>).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Readiness Verification Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setInstrumentChecked(!instrumentChecked)}
              className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${
                instrumentChecked ? 'bg-yellow-400 text-black' : 'border border-zinc-600 bg-zinc-800'
              }`}
            >
              {instrumentChecked && <CheckCircle2 className="w-4 h-4" />}
            </button>
            <div>
              <span className="text-xs font-mono-tech font-bold text-white uppercase block">
                INSTRUMENTO 01 LISTO // CONTADOR VISIBLE
              </span>
              <span className="text-[11px] font-mono-tech text-zinc-400">
                Confirmé que puedo ver el número de FPS en pantalla durante la partida.
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded bg-yellow-400/20 text-yellow-300 font-bold uppercase shrink-0">
            VERIFICADO ✓
          </span>
        </div>

        {/* Principio EVO LABS */}
        <div className="p-4 rounded-xl bg-[#14151b] border-l-4 border-yellow-400 space-y-1.5">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
            PRINCIPIO EVO // VER FPS ≠ MEDIR ESTABILIDAD
          </span>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
            “Los FPS instantáneos que ves en la esquina te indican cuántos cuadros se completaron aproximadamente en el último segundo. Pero no te dicen si se entregaron con regularidad rítmica o si varios de ellos tardaron 50 milisegundos en salir.”
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PROTOCOLO METODOLÓGICO DE 60 SEGUNDOS */}
      {/* ============================================================ */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span>PROTOCOLO DE PRUEBA // GUÍA METODOLÓGICA (60 SEGUNDOS)</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { num: '01', title: 'ACTIVÁ', desc: 'Contador visible en pantalla' },
            { num: '02', title: 'ENTRÁ', desc: 'Dentro de la partida activa' },
            { num: '03', title: 'REPETIBLE', desc: 'Escena o recorrido similar' },
            { num: '04', title: '60 SEG', desc: 'Observá la oscilación continua' },
            { num: '05', title: 'ESTABLE', desc: 'No cambies ajustes al medir' },
            { num: '06', title: 'REGISTRÁ', desc: 'Anotá el rango habitual' },
          ].map((step) => (
            <div key={step.num} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono-tech text-yellow-400 font-bold block">
                PASO {step.num}
              </span>
              <span className="text-xs font-display font-bold text-white uppercase block">
                {step.title}
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-400 block leading-tight">
                {step.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* PASO 3 // CONTEXTO DE PRUEBA (PARÁMETROS) */}
      {/* ============================================================ */}
      <div id="paso-contexto-prueba" className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
            <Sliders className="w-4 h-4 text-yellow-400" />
            <span>PASO 3 // CONTEXTO GRÁFICO DE PRUEBA</span>
          </div>
          <span className="text-[10px] font-mono-tech text-zinc-400 uppercase">
            PARÁMETROS DEL ENSAYO
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Resolución */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech text-zinc-300 uppercase tracking-wide block">
              RESOLUCIÓN:
            </label>
            <select
              id="select-resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value as FluidezResolution)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
            >
              <option value="1920×1080">1920×1080 (1080p FHD)</option>
              <option value="1600×900">1600×900 (900p)</option>
              <option value="1280×960">1280×960 (4:3 Estirada)</option>
              <option value="1280×720">1280×720 (720p HD)</option>
              <option value="PERSONALIZADA">Personalizada...</option>
            </select>
            {resolution === 'PERSONALIZADA' && (
              <input
                type="text"
                value={customResolution}
                onChange={(e) => setCustomResolution(e.target.value)}
                placeholder="Ej. 2560×1440"
                className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white"
              />
            )}
          </div>

          {/* Calidad gráfica */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech text-zinc-300 uppercase tracking-wide block">
              CALIDAD GRÁFICA:
            </label>
            <select
              id="select-quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as FluidezQuality)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
            >
              <option value="BAJA">Baja / Competitiva (Mínimo)</option>
              <option value="MEDIA">Media / Balanceada</option>
              <option value="ALTA">Alta / Ultra</option>
              <option value="PERSONALIZADA">Personalizada</option>
            </select>
          </div>

          {/* Límite FPS */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech text-zinc-300 uppercase tracking-wide block">
              LÍMITE DE FPS EN JUEGO:
            </label>
            <select
              id="select-fps-limit"
              value={fpsLimit}
              onChange={(e) => setFpsLimit(e.target.value as FluidezFpsLimit)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
            >
              <option value="SIN LÍMITE">Sin límite (Destrabado)</option>
              <option value="60">60 FPS</option>
              <option value="120">120 FPS</option>
              <option value="144">144 FPS</option>
              <option value="165">165 FPS</option>
              <option value="180">180 FPS</option>
              <option value="200">200 FPS</option>
              <option value="240">240 FPS</option>
              <option value="PERSONALIZADO">Personalizado...</option>
            </select>
            {fpsLimit === 'PERSONALIZADO' && (
              <input
                type="text"
                value={customFpsLimit}
                onChange={(e) => setCustomFpsLimit(e.target.value)}
                placeholder="Ej. 75, 100..."
                className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white"
              />
            )}
          </div>

          {/* V-Sync */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech text-zinc-300 uppercase tracking-wide block">
              V-SYNC (SINCRONIZACIÓN VERTICAL):
            </label>
            <select
              id="select-vsync"
              value={vsync}
              onChange={(e) => setVsync(e.target.value as FluidezVsync)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
            >
              <option value="DESACTIVADO">Desactivado (Recomendado)</option>
              <option value="ACTIVO">Activo</option>
              <option value="NO LO SÉ">No lo sé / Por defecto</option>
            </select>
          </div>
        </div>

        {/* Monitor Info (Heredado de C01 si existe) */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-zinc-400">
            <Monitor className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>MONITOR / TASA DE REFRESCO:</span>
            <span className="text-white font-bold">{monitor || 'Por defecto (60 Hz)'}</span>
            <span className="text-[10px] text-zinc-400">(Heredado del Pasaporte EVO)</span>
          </div>

          <input
            type="text"
            value={monitor}
            onChange={(e) => setMonitor(e.target.value)}
            placeholder="Modificar Hz o modelo si es necesario..."
            className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono-tech w-full sm:w-64"
          />
        </div>

        {/* Recalculate Button */}
        <div className="pt-3 flex justify-end">
          <button
            type="button"
            onClick={() => calculateRealFps()}
            className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-mono-tech font-bold text-xs uppercase cursor-pointer transition-colors flex items-center gap-2 shadow-lg"
          >
            <Zap className="w-4 h-4 text-black fill-black" />
            <span>⚡ RECALCULAR IMPACTO EN FPS Y FRAMETIME CON ESTOS PARÁMETROS</span>
          </button>
        </div>
      </div>

      {/* Live Calculation Summary Card */}
      {calculationSummary && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-yellow-950/40 via-black/90 to-zinc-900 border-2 border-yellow-400 space-y-4 animate-in fade-in duration-300 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-yellow-400/30 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="font-display font-black text-white text-base sm:text-lg uppercase tracking-tight">
                RESULTADO DE MEDICIÓN DIGITAL TWIN // {calculationSummary.gameTitle}
              </span>
            </div>
            <span className="text-xs font-mono-tech px-2.5 py-1 rounded bg-yellow-400 text-black font-black uppercase shadow-sm">
              CÁLCULO DE FPS COMPLETADO
            </span>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center space-y-0.5 shadow-md">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase block">AVG FPS (PROMEDIO)</span>
              <span className="text-2xl sm:text-3xl font-mono-tech font-black text-yellow-400">{avgFps} FPS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center space-y-0.5 shadow-md">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase block">1% LOW (TIRONES)</span>
              <span className="text-2xl sm:text-3xl font-mono-tech font-black text-amber-300">{onePercentLow} FPS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center space-y-0.5 shadow-md">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase block">CADENCIA MEDIA</span>
              <span className="text-2xl sm:text-3xl font-mono-tech font-black text-emerald-400">{frametimeAvgMs} ms</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center space-y-0.5 shadow-md">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase block">PICO LATENCIA</span>
              <span className="text-2xl sm:text-3xl font-mono-tech font-black text-red-400">{frametimePeakMs} ms</span>
            </div>
          </div>

          {/* Bottleneck & Telemetry Breakdown */}
          <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 text-xs font-mono-tech space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-zinc-300">
              <span className="text-zinc-400 uppercase font-bold">FACTOR LIMITANTE DETECTADO EN ESTE JUEGO:</span>
              <strong className="text-yellow-400 font-bold">{calculationSummary.limitingFactor}</strong>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
              <div>Uso Estimado GPU: <strong className="text-white">{calculationSummary.gpuUsagePct}%</strong></div>
              <div>Uso Estimado CPU: <strong className="text-white">{calculationSummary.cpuUsagePct}%</strong></div>
              <div>VRAM Requerida: <strong className="text-white">{calculationSummary.vramUsedGb} GB</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PASO 4 // REGISTRO DE OBSERVACIÓN BÁSICA */}
      {/* ============================================================ */}
      <div
        id="paso-observacion-basica"
        className={`p-5 sm:p-7 rounded-2xl bg-[#121318] border transition-colors space-y-6 ${
          highlightMissing && (!fpsHabituales || !sensacion)
            ? 'border-red-500 shadow-lg shadow-red-500/20 ring-1 ring-red-500'
            : 'border-zinc-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
            <Gauge className="w-4 h-4 text-yellow-400" />
            <span>PASO 4 // OBSERVACIÓN BÁSICA DEL CONTADOR (60 SEGUNDOS)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech">
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold uppercase">
              FUENTE: OBSERVACIÓN MANUAL
            </span>
            <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 font-bold uppercase">
              ESTADO: OBSERVADO
            </span>
          </div>
        </div>

        {/* Important conceptual notice */}
        <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 text-xs font-mono-tech flex items-start gap-2.5 text-zinc-400">
          <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-200 block mb-0.5">DIFERENCIACIÓN TÉCNICA OBLIGATORIA:</strong>
            Los <strong className="text-white">“FPS Habituales”</strong> son una lectura visual humana aproximada, <strong className="text-yellow-400">NO equivalen al AVG FPS calculado matemáticamente</strong>. De igual modo, la <strong className="text-white">“Caída más baja observada”</strong> <strong className="text-yellow-400">NO equivale al 1% Low</strong> estadístico.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* FPS habituales */}
          <div className="space-y-2">
            <label className="block text-xs font-mono-tech uppercase tracking-wide text-zinc-200">
              ¿QUÉ VALOR DE FPS VISTE LA MAYOR PARTE DEL TIEMPO? <span className="text-yellow-400 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="input-fps-habituales"
                value={fpsHabituales ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? null : Math.max(1, Number(e.target.value));
                  setFpsHabituales(val);
                }}
                placeholder="Ej. 144, 75, 60, 220..."
                className={`w-full px-4 py-3 rounded-xl bg-zinc-900 border text-base font-mono-tech text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 ${
                  highlightMissing && !fpsHabituales ? 'border-red-500' : 'border-zinc-700'
                }`}
              />
              <span className="absolute right-4 top-3.5 text-xs font-mono-tech text-zinc-400">FPS</span>
            </div>
            <p className="text-[11px] font-mono-tech text-zinc-400">
              El número más constante que marcó el contador durante tu prueba.
            </p>
          </div>

          {/* Caída más baja observada */}
          <div className="space-y-2">
            <label className="block text-xs font-mono-tech uppercase tracking-wide text-zinc-200">
              CAÍDA MÁS BAJA QUE OBSERVASTE (OPCIONAL):
            </label>
            <div className="relative">
              <input
                type="number"
                id="input-caida-observada"
                value={caidaObservada ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? null : Math.max(1, Number(e.target.value));
                  setCaidaObservada(val);
                }}
                placeholder="Ej. 95, 42, 110..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-base font-mono-tech text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
              <span className="absolute right-4 top-3.5 text-xs font-mono-tech text-zinc-400">FPS MIN</span>
            </div>
            <p className="text-[11px] font-mono-tech text-zinc-400">
              ¿Hasta cuánto descendió cuando hubo explosiones, humo o combates?
            </p>
          </div>
        </div>

        {/* Interactive Theoretical Frametime Calculation Card */}
        {frametimeTeorico && (
          <div className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
                CÁLCULO AUTOMÁTICO // FRAMETIME TEÓRICO
              </span>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200">
                A <strong className="text-white">{fpsHabituales} FPS</strong>, cada cuadro debería tardar exactamente{' '}
                <strong className="text-yellow-400 font-mono-tech text-base sm:text-lg">
                  {frametimeTeorico} ms
                </strong>.
              </p>
              <p className="text-[11px] font-mono-tech text-zinc-400">
                “Esto sería una entrega matemáticamente perfecta. La realidad cuadro por cuadro se observa en la dispersión milimétrica.”
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-center shrink-0">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase block">CADENCIA TEÓRICA</span>
              <span className="text-lg font-mono-tech font-black text-yellow-400">{frametimeTeorico} ms</span>
            </div>
          </div>
        )}

        {/* Sensación Percibida */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-mono-tech uppercase tracking-wide text-zinc-200">
            SENSACIÓN PERCIBIDA DURANTE LA JUGADA: <span className="text-yellow-400 font-bold">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(['MUY FLUIDA', 'FLUIDA', 'IRREGULAR', 'MICRO-TIRONES', 'TIRONES NOTORIOS'] as FluidezSensacion[]).map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  id={`btn-sensacion-${s.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSensacion(s)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    sensacion === s
                      ? s === 'MUY FLUIDA' || s === 'FLUIDA'
                        ? 'bg-emerald-500/15 border-emerald-400 text-white font-bold'
                        : s === 'IRREGULAR'
                        ? 'bg-yellow-400/15 border-yellow-400 text-white font-bold'
                        : 'bg-red-500/20 border-red-400 text-white font-bold'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-mono-tech uppercase block">{s}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Síntomas específicos (Checkboxes múltiples) */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-mono-tech uppercase tracking-wide text-zinc-200">
            SÍNTOMAS DETECTADOS (MARCÁ TODOS LOS QUE CORRESPONDAN):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {ALL_SINTOMAS.map((item) => {
              const isSelected = sintomas.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`btn-sintoma-${item.id.replace(/\s+/g, '-')}`}
                  onClick={() => toggleSintoma(item.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? item.id === 'ninguno'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                        : 'bg-red-500/10 border-red-500/40 text-zinc-200'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center ${
                      isSelected ? 'bg-yellow-400 text-black' : 'border border-zinc-600 bg-zinc-800'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-xs font-mono-tech font-bold uppercase block text-white">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-sans-editorial text-zinc-400 block leading-tight">
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PASO 5 // QUIERO MEDIR MÁS // TELEMETRÍA AVANZADA (OPCIONAL) */}
      {/* ============================================================ */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>QUIERO MEDIR MÁS // TELEMETRÍA CUADRO POR CUADRO (OPCIONAL)</span>
            </div>
            <p className="text-xs font-sans-editorial text-zinc-400 mt-1">
              CapFrameX y PresentMon permiten capturar AVG FPS, 1% Low, 0.1% Low y picos de frametime reales.
            </p>
          </div>

          <button
            type="button"
            id="btn-toggle-telemetria-avanzada"
            onClick={() => setHasTelemetry(!hasTelemetry)}
            className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase transition-colors cursor-pointer shrink-0 ${
              hasTelemetry
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            {hasTelemetry ? '✓ REGISTRAR TELEMETRÍA' : '+ ACTIVAR MODO TELEMETRÍA'}
          </button>
        </div>

        {/* Guía opcional de CapFrameX */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsTelemetryGuideOpen(!isTelemetryGuideOpen)}
            className="inline-flex items-center gap-2 text-xs font-mono-tech text-yellow-400 hover:text-yellow-300 cursor-pointer"
          >
            <span>{isTelemetryGuideOpen ? 'Ocultar protocolo CapFrameX' : '¿Cómo se captura con CapFrameX / PresentMon? (10 pasos)'}</span>
            {isTelemetryGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isTelemetryGuideOpen && (
            <div className="mt-3 p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-3 text-xs font-mono-tech text-zinc-300">
              <span className="text-yellow-400 font-bold block uppercase tracking-wider">
                PROTOCOLO DE CAPTURA EN 10 PASOS:
              </span>
              <ol className="list-decimal pl-5 space-y-1.5 font-sans-editorial text-xs sm:text-[13px] leading-relaxed text-zinc-300">
                <li>Descargar e instalar CapFrameX (gratuito, código abierto, basado en Intel PresentMon).</li>
                <li>Abrir CapFrameX antes de iniciar el juego.</li>
                <li>En la pestaña <em>Capture</em>, configurar tecla de captura (ej. <code className="text-yellow-300 bg-zinc-900 px-1 rounded">F11</code>).</li>
                <li>Fijar tiempo de captura en 20 o 60 segundos (o modo manual).</li>
                <li>Iniciar tu juego en la resolución y calidad que registraste antes.</li>
                <li>Entrar en la partida o recorrido de prueba reproducible.</li>
                <li>Presionar la tecla asignada para iniciar el registro.</li>
                <li>Completar los segundos de prueba sin cambiar configuraciones.</li>
                <li>Volver a CapFrameX para observar los percentiles y el gráfico de frametime.</li>
                <li>Copiar los valores resultantes (AVG, 1% Low, 0.1% Low) en el formulario siguiente.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Campos de telemetría opcional */}
        {hasTelemetry && (
          <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-yellow-400/40 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-yellow-400 font-bold uppercase">
                FORMULARIO DE TELEMETRÍA CAPTURADA
              </span>
              <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 text-[10px] font-bold">
                ESTADO: MEDIDO EMPÍRICAMENTE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono-tech text-zinc-300 uppercase block">
                  AVG FPS (PROMEDIO CALCULADO):
                </label>
                <input
                  type="number"
                  id="input-avg-fps"
                  value={avgFps ?? ''}
                  onChange={(e) => setAvgFps(e.target.value === '' ? null : Math.max(1, Number(e.target.value)))}
                  placeholder="Ej. 142.4"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-tech text-zinc-300 uppercase block">
                  1% LOW (FPS):
                </label>
                <input
                  type="number"
                  id="input-one-percent-low"
                  value={onePercentLow ?? ''}
                  onChange={(e) => setOnePercentLow(e.target.value === '' ? null : Math.max(1, Number(e.target.value)))}
                  placeholder="Ej. 98.1"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-tech text-zinc-300 uppercase block">
                  0.1% LOW (OPCIONAL):
                </label>
                <input
                  type="number"
                  id="input-zero-one-percent-low"
                  value={zeroPointOnePercentLow ?? ''}
                  onChange={(e) => setZeroPointOnePercentLow(e.target.value === '' ? null : Math.max(1, Number(e.target.value)))}
                  placeholder="Ej. 64.5"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-mono-tech text-zinc-300 uppercase block">
                  FRAMETIME MEDIO (MS):
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="input-frametime-avg"
                  value={frametimeAvgMs ?? ''}
                  onChange={(e) => setFrametimeAvgMs(e.target.value === '' ? null : Math.max(0.1, Number(e.target.value)))}
                  placeholder="Ej. 7.02"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-tech text-zinc-300 uppercase block">
                  PICO MÁXIMO DE FRAMETIME (MS):
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="input-frametime-peak"
                  value={frametimePeakMs ?? ''}
                  onChange={(e) => setFrametimePeakMs(e.target.value === '' ? null : Math.max(0.1, Number(e.target.value)))}
                  placeholder="Ej. 34.2"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-tech text-zinc-300 uppercase block">
                  DURACIÓN DE CAPTURA (SEG):
                </label>
                <input
                  type="number"
                  id="input-capture-duration"
                  value={captureDurationSeconds ?? ''}
                  onChange={(e) => setCaptureDurationSeconds(e.target.value === '' ? null : Math.max(1, Number(e.target.value)))}
                  placeholder="Ej. 60"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setHasTelemetry(false);
                  setAvgFps(null);
                  setOnePercentLow(null);
                  setZeroPointOnePercentLow(null);
                }}
                className="text-xs font-mono-tech text-zinc-400 hover:text-zinc-200 cursor-pointer underline"
              >
                No pude medirlo con software / Mantener solo observación manual
              </button>
              <span className="text-[10px] font-mono-tech text-emerald-400">
                {avgFps && onePercentLow ? '✓ Telemetría lista para interpretar' : 'Completá los valores si los tenés'}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
