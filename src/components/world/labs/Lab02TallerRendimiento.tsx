import React, { useState } from 'react';
import { 
  Gauge, 
  Activity, 
  Cpu, 
  Monitor, 
  Sliders, 
  Wind, 
  Volume2, 
  Zap, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Layers,
  Terminal,
  Microscope,
  Flame
} from 'lucide-react';
import { useEvoOperatingMode } from '../../../hooks/useEvoOperatingMode';
import { EvoOperatingModeSelector } from '../../common/EvoOperatingModeSelector';
import { Sector02HardwareHotSwap } from './sector02/Sector02HardwareHotSwap';
import { Sector02SoftwareHotSwap } from './sector02/Sector02SoftwareHotSwap';

export const Lab02TallerRendimiento: React.FC = () => {
  const { isPericial, mode } = useEvoOperatingMode();
  const [activeSubTab, setActiveSubTab] = useState<
    'frametime' | 'hw-hotswap' | 'sw-hotswap' | 'fancurve' | 'bottleneck'
  >('frametime');

  // Sub-Tab 1: Frametime Simulator States
  const [avgFps, setAvgFps] = useState<number>(120);
  const [stutterSeverity, setStutterSeverity] = useState<'smooth' | 'moderate' | 'severe'>('moderate');
  const [refreshRate, setRefreshRate] = useState<number>(144);

  // Computed frametime metrics
  const targetFrametimeMs = +(1000 / avgFps).toFixed(2);
  const onePercentLow = stutterSeverity === 'smooth' 
    ? Math.floor(avgFps * 0.92) 
    : stutterSeverity === 'moderate' 
    ? Math.floor(avgFps * 0.65) 
    : Math.floor(avgFps * 0.35);
  const zeroOnePercentLow = stutterSeverity === 'smooth'
    ? Math.floor(avgFps * 0.85)
    : stutterSeverity === 'moderate'
    ? Math.floor(avgFps * 0.45)
    : Math.floor(avgFps * 0.18);
  const maxSpikeMs = stutterSeverity === 'smooth' ? 12 : stutterSeverity === 'moderate' ? 38 : 84;

  // Sub-Tab 2: Fan Curve & Acoustic States
  const [idleTemp, setIdleTemp] = useState<number>(40);
  const [loadTemp, setLoadTemp] = useState<number>(75);
  const [fanProfile, setFanProfile] = useState<'silent' | 'balanced' | 'aggressive'>('balanced');

  const fanRpm = fanProfile === 'silent' ? 1100 : fanProfile === 'balanced' ? 1650 : 2300;
  const fanNoiseDba = fanProfile === 'silent' ? 24.5 : fanProfile === 'balanced' ? 34.2 : 46.8;
  const fanCfm = fanProfile === 'silent' ? 38 : fanProfile === 'balanced' ? 58 : 82;
  const deltaTemp = fanProfile === 'silent' ? +4 : fanProfile === 'balanced' ? 0 : -6;

  // Sub-Tab 3: Bottleneck Calculator States
  const [selectedCpuTier, setSelectedCpuTier] = useState<'entry' | 'mid' | 'high' | 'enthusiast'>('mid');
  const [selectedGpuTier, setSelectedGpuTier] = useState<'entry' | 'mid' | 'high' | 'enthusiast'>('high');
  const [selectedRes, setSelectedRes] = useState<'1080p' | '1440p' | '4k'>('1080p');

  // Compute load % distribution
  const getBottleneckAnalysis = () => {
    const cpuScores = { entry: 40, mid: 70, high: 95, enthusiast: 120 };
    const gpuScores = { entry: 35, mid: 65, high: 105, enthusiast: 160 };
    const resMultipliers = { '1080p': { cpu: 1.2, gpu: 0.8 }, '1440p': { cpu: 1.0, gpu: 1.1 }, '4k': { cpu: 0.7, gpu: 1.6 } };

    const effectiveCpu = cpuScores[selectedCpuTier] * resMultipliers[selectedRes].cpu;
    const effectiveGpu = gpuScores[selectedGpuTier] * resMultipliers[selectedRes].gpu;

    const total = effectiveCpu + effectiveGpu;
    const cpuPct = Math.round((effectiveGpu / total) * 100);
    const gpuPct = 100 - cpuPct;

    let bottleneck = 'EQUILIBRADO';
    let summary = 'Carga balanceada entre CPU y GPU.';
    if (cpuPct > 60) {
      bottleneck = 'CUELLO DE BOTELLA EN CPU';
      summary = 'La placa de video espera al procesador. Los FPS promedio son altos pero los 1% Lows sufren caídas.';
    } else if (gpuPct > 65) {
      bottleneck = 'CUELLO DE BOTELLA EN GPU (IDEAL EN JUEGOS)';
      summary = 'La GPU está al 99-100% de uso constante. Genera la máxima fluidez y consistencia de frametime.';
    }

    return { cpuPct, gpuPct, bottleneck, summary };
  };

  const bottleneckData = getBottleneckAnalysis();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0d1017] to-zinc-900 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Gauge className="w-40 h-40 text-amber-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-400 font-mono-tech text-xs font-bold uppercase tracking-wider">
                ZONA 02 // BANCO DE TELEMETRÍA Y ESTRÉS
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">// REAL-TIME BENCHMARK SUITE</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Taller de Rendimiento & Análisis de Fluidez
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm mt-1 max-w-2xl leading-relaxed">
              Desmontá el mito de los "FPS promedio". Evaluá la consistencia de tiempos de cuadro (Frametimes), optimizá curvas acústicas térmicas y calculá cuellos de botella con física real.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/80 p-1.5 rounded-xl border border-zinc-800 text-xs font-mono-tech shrink-0">
            <button
              type="button"
              onClick={() => setActiveSubTab('frametime')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'frametime'
                  ? 'bg-amber-400 text-black font-bold shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>FRAMETIME & 1% LOWS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('hw-hotswap')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'hw-hotswap'
                  ? 'bg-amber-400 text-black font-bold shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                  : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">HOT-SWAP HARDWARE (ns)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('sw-hotswap')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'sw-hotswap'
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                  : 'text-zinc-400 hover:text-cyan-300 hover:bg-zinc-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">HOT-SWAP SOFTWARE (DPC)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('fancurve')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'fancurve'
                  ? 'bg-amber-400 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>CURVA ACÚSTICA</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('bottleneck')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'bottleneck'
                  ? 'bg-amber-400 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>BOTTLENECK</span>
            </button>
          </div>
        </div>
      </div>

      {/* INDUSTRIAL OPERATING MODE SELECTOR BANNER */}
      <EvoOperatingModeSelector />

      {/* SUB-TAB 1: FRAMETIME & MICRO-STUTTERING SIMULATOR */}
      {activeSubTab === 'frametime' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Controls */}
          <div className="lg:col-span-4 p-5 bg-[#0d0f17] border border-zinc-800 rounded-xl space-y-5">
            <span className="font-mono-tech text-xs font-bold text-amber-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">
              PARÁMETROS DE SIMULACIÓN
            </span>

            {/* FPS Target Slider */}
            <div className="space-y-2 font-mono-tech text-xs">
              <div className="flex justify-between items-center text-zinc-300">
                <span>FPS PROMEDIO:</span>
                <span className="text-amber-400 font-bold text-sm">{avgFps} FPS</span>
              </div>
              <input
                type="range"
                min={30}
                max={240}
                step={5}
                value={avgFps}
                onChange={(e) => setAvgFps(+e.target.value)}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500 block">
                Frametime teórico: {targetFrametimeMs} ms por cuadro
              </span>
            </div>

            {/* Stutter Severity Selection */}
            <div className="space-y-2 font-mono-tech text-xs">
              <span className="text-zinc-300 block">CONSISTENCIA DE FRAME PACING:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStutterSeverity('smooth')}
                  className={`p-2 rounded text-center border cursor-pointer ${
                    stutterSeverity === 'smooth'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  FLUIDO (0.92x)
                </button>
                <button
                  type="button"
                  onClick={() => setStutterSeverity('moderate')}
                  className={`p-2 rounded text-center border cursor-pointer ${
                    stutterSeverity === 'moderate'
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 font-bold'
                      : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  TIRONES (0.65x)
                </button>
                <button
                  type="button"
                  onClick={() => setStutterSeverity('severe')}
                  className={`p-2 rounded text-center border cursor-pointer ${
                    stutterSeverity === 'severe'
                      ? 'bg-red-500/20 border-red-500 text-red-400 font-bold'
                      : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  CRÍTICO (0.35x)
                </button>
              </div>
            </div>

            {/* Refresh rate sync */}
            <div className="space-y-2 font-mono-tech text-xs">
              <span className="text-zinc-300 block">TASA DE REFRESCO MONITOR:</span>
              <div className="grid grid-cols-3 gap-2">
                {[60, 144, 240].map((hz) => (
                  <button
                    key={hz}
                    type="button"
                    onClick={() => setRefreshRate(hz)}
                    className={`p-2 rounded text-center border cursor-pointer ${
                      refreshRate === hz
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {hz} Hz
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-black/60 rounded-lg border border-zinc-800 text-[11px] font-sans-editorial text-zinc-400">
              <strong className="text-white">Regla EVO:</strong> El ojo humano no percibe números de FPS sino variaciones en el tiempo que transcurre entre fotograma y fotograma (Frametime delta).
            </div>
          </div>

          {/* Right Metrics & Graph Visualizer */}
          <div className="lg:col-span-8 p-6 bg-[#0c0e15] border-2 border-zinc-800 rounded-xl space-y-6 shadow-2xl">
            
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tech">
              
              <div className="p-4 bg-[#11141d] border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">FPS PROMEDIO</span>
                <span className="text-2xl font-black text-white">{avgFps} <span className="text-xs text-zinc-400 font-normal">FPS</span></span>
                <span className="text-[10px] text-zinc-400 block mt-1">Base: {targetFrametimeMs} ms</span>
              </div>

              <div className="p-4 bg-[#11141d] border border-amber-500/30 rounded-xl">
                <span className="text-[10px] text-amber-400 uppercase block mb-1">1% LOW (PISO REAL)</span>
                <span className="text-2xl font-black text-amber-400">{onePercentLow} <span className="text-xs text-zinc-400 font-normal">FPS</span></span>
                <span className="text-[10px] text-zinc-400 block mt-1">Tiempo de cuadro: {+(1000 / onePercentLow).toFixed(1)} ms</span>
              </div>

              <div className="p-4 bg-[#11141d] border border-red-500/30 rounded-xl">
                <span className="text-[10px] text-red-400 uppercase block mb-1">PICO MÁXIMO DE STUTTER</span>
                <span className="text-2xl font-black text-red-400">{maxSpikeMs} <span className="text-xs text-zinc-400 font-normal">ms</span></span>
                <span className="text-[10px] text-zinc-400 block mt-1">0.1% Low: {zeroOnePercentLow} FPS</span>
              </div>

            </div>

            {/* Visual Frametime Simulation Canvas / Bar chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <Activity className="w-4 h-4 text-amber-400" />
                  OSCILOSCOPIO DE FRAMETIMES EN TIEMPO REAL (60 CUADROS CONSECUTIVOS)
                </span>
                <span className="text-amber-400 font-bold">LÍNEA OBJETIVO: {targetFrametimeMs} ms</span>
              </div>

              <div className="h-44 bg-black/90 rounded-xl border border-zinc-800 p-3 flex items-end justify-between gap-1 overflow-hidden relative">
                {/* Reference Target Line */}
                <div 
                  className="absolute left-0 right-0 border-b border-dashed border-amber-400/60 z-10 pointer-events-none"
                  style={{ bottom: '45%' }}
                />

                {/* Simulated frame bars */}
                {Array.from({ length: 48 }).map((_, idx) => {
                  let heightPct = 45;
                  if (stutterSeverity === 'smooth') {
                    heightPct = 42 + (Math.sin(idx) * 4);
                  } else if (stutterSeverity === 'moderate') {
                    heightPct = idx % 8 === 0 ? 78 : 42 + (Math.sin(idx) * 8);
                  } else {
                    heightPct = idx % 5 === 0 ? 94 : idx % 3 === 0 ? 72 : 40 + (Math.sin(idx) * 12);
                  }

                  const isSpike = heightPct > 65;

                  return (
                    <div
                      key={idx}
                      className={`w-full rounded-t transition-all duration-300 ${
                        isSpike ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-400/80 hover:bg-emerald-300'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`Cuadro #${idx + 1}: ${+(heightPct * 0.4).toFixed(1)} ms`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-500">
                <span>0 ms (Tiempo Cero)</span>
                <span className="text-red-400">Picos rojos = Micro-stutter visible al ojo</span>
                <span>80+ ms (Congelamiento)</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB: HOT-SWAP HARDWARE (CPU / RAM ns / PCIe) */}
      {activeSubTab === 'hw-hotswap' && (
        <Sector02HardwareHotSwap />
      )}

      {/* SUB-TAB: HOT-SWAP SOFTWARE (DRIVERS & DPC) */}
      {activeSubTab === 'sw-hotswap' && (
        <Sector02SoftwareHotSwap />
      )}

      {/* SUB-TAB 2: FAN CURVE & ACOUSTIC STUDIO */}
      {activeSubTab === 'fancurve' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 p-5 bg-[#0d0f17] border border-zinc-800 rounded-xl space-y-5">
            <span className="font-mono-tech text-xs font-bold text-amber-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">
              PERFILES DE VENTILACIÓN
            </span>

            <div className="space-y-3 font-mono-tech text-xs">
              <button
                type="button"
                onClick={() => setFanProfile('silent')}
                className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  fanProfile === 'silent'
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">SILENCIOSO (ACÚSTICO)</span>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] font-sans-editorial text-zinc-400">
                  Prioriza baja sonoridad (&lt;28 dBA) con ventiladores a 1100 RPM.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFanProfile('balanced')}
                className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  fanProfile === 'balanced'
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">BALANCEADO (ESTÁNDAR EVO)</span>
                  <Wind className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[11px] font-sans-editorial text-zinc-400">
                  Curva lineal con histéresis de 3 segundos para evitar ruidos de aceleración constante.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFanProfile('aggressive')}
                className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  fanProfile === 'aggressive'
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">MÁXIMO FLUJO (CFM ALTO)</span>
                  <Zap className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-[11px] font-sans-editorial text-zinc-400">
                  Máxima presión estática para disipadores densos o radiadores líquidos.
                </p>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 p-6 bg-[#0c0e15] border-2 border-zinc-800 rounded-xl space-y-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tech">
              <div className="p-4 bg-[#11141d] border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">VELOCIDAD ROTACIÓN</span>
                <span className="text-2xl font-black text-amber-400">{fanRpm} <span className="text-xs text-zinc-400 font-normal">RPM</span></span>
                <span className="text-[10px] text-zinc-400 block mt-1">Flujo: {fanCfm} CFM</span>
              </div>

              <div className="p-4 bg-[#11141d] border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">PRESIÓN SONORA</span>
                <span className="text-2xl font-black text-sky-400">{fanNoiseDba} <span className="text-xs text-zinc-400 font-normal">dBA</span></span>
                <span className="text-[10px] text-zinc-400 block mt-1">A 1 metro de distancia</span>
              </div>

              <div className="p-4 bg-[#11141d] border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">DELTA TÉRMICO (ΔT)</span>
                <span className={`text-2xl font-black ${deltaTemp <= 0 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {deltaTemp > 0 ? `+${deltaTemp}` : deltaTemp} °C
                </span>
                <span className="text-[10px] text-zinc-400 block mt-1">Bajo carga sostenida de 150W</span>
              </div>
            </div>

            <div className="p-4 bg-black/70 rounded-xl border border-zinc-800 space-y-3 font-sans-editorial text-xs text-zinc-300">
              <div className="flex items-center gap-2 text-amber-400 font-mono-tech text-xs font-bold uppercase">
                <Wind className="w-4 h-4" />
                <span>RECOMENDACIÓN METROLÓGICA DE HISTÉRESIS TÉRMICA:</span>
              </div>
              <p className="leading-relaxed">
                El error más común es configurar curvas con escalones abruptos que provocan que los ventiladores suban y bajen de velocidad cada 2 segundos cuando el CPU hace picos de boost normales. Activá siempre un retardo de <strong className="text-white">2 a 3 segundos de histéresis</strong> en tu BIOS o con software como Fan Control.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BOTTLENECK CALCULATOR */}
      {activeSubTab === 'bottleneck' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-[#0d0f17] border border-zinc-800 rounded-xl space-y-5 font-mono-tech text-xs">
            <span className="font-bold text-amber-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">
              SELECCIÓN DE HARDWARE & RESOLUCIÓN
            </span>

            {/* CPU Tier */}
            <div className="space-y-2">
              <span className="text-zinc-400 block">NIVEL DE PROCESADOR (CPU):</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'entry', label: 'Gama Entrada (4C/8T)' },
                  { id: 'mid', label: 'Gama Media (6C/12T)' },
                  { id: 'high', label: 'Gama Alta (8C/16T X3D)' },
                  { id: 'enthusiast', label: 'Entusiasta (16C+)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedCpuTier(item.id as any)}
                    className={`p-2.5 rounded text-left border cursor-pointer ${
                      selectedCpuTier === item.id
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* GPU Tier */}
            <div className="space-y-2">
              <span className="text-zinc-400 block">NIVEL DE TARJETA GRÁFICA (GPU):</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'entry', label: 'Gama Entrada (ej: RTX 3050)' },
                  { id: 'mid', label: 'Gama Media (ej: RTX 4060)' },
                  { id: 'high', label: 'Gama Alta (ej: RTX 4070 Ti)' },
                  { id: 'enthusiast', label: 'Extrema (ej: RTX 4090)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedGpuTier(item.id as any)}
                    className={`p-2.5 rounded text-left border cursor-pointer ${
                      selectedGpuTier === item.id
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <span className="text-zinc-400 block">RESOLUCIÓN DE RENDERIZADO:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1080p', label: '1080p (FHD)' },
                  { id: '1440p', label: '1440p (QHD)' },
                  { id: '4k', label: '4K (UHD)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRes(item.id as any)}
                    className={`p-2 rounded text-center border cursor-pointer ${
                      selectedRes === item.id
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 bg-[#0c0e15] border-2 border-zinc-800 rounded-xl space-y-6 shadow-2xl">
            <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/40">
              <span className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase tracking-wider block">
                DIAGNÓSTICO ARQUITECTÓNICO EVO
              </span>
              <h3 className="font-display font-black text-xl text-white uppercase mt-0.5">
                {bottleneckData.bottleneck}
              </h3>
              <p className="text-xs text-zinc-300 font-sans-editorial mt-1 leading-relaxed">
                {bottleneckData.summary}
              </p>
            </div>

            <div className="space-y-4 font-mono-tech text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-300">
                  <span>CARGA EN CPU (PREPARACIÓN DE FRAMES):</span>
                  <span className="text-amber-400 font-bold">{bottleneckData.cpuPct}%</span>
                </div>
                <div className="h-3 bg-black rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${bottleneckData.cpuPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-300">
                  <span>CARGA EN GPU (RASTERIZADO & SHADERS):</span>
                  <span className="text-cyan-400 font-bold">{bottleneckData.gpuPct}%</span>
                </div>
                <div className="h-3 bg-black rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-500"
                    style={{ width: `${bottleneckData.gpuPct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-black/60 rounded-lg border border-zinc-800 text-[11px] font-sans-editorial text-zinc-400">
              <strong className="text-white">Lección de Ingeniería:</strong> Subir la resolución de 1080p a 1440p o 4K traslada la carga hacia la GPU, aliviando el cuello de botella de CPU y regularizando la curva de frametimes.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
