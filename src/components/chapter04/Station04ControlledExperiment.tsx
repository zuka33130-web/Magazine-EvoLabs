import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Monitor,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  AbExperimentData,
  AbScenarioPoint,
  ObservedAbBehavior,
  UserPcSpec,
  FluidezProfileData,
} from '../../types';

interface Station04ControlledExperimentProps {
  specs: Partial<UserPcSpec>;
  fluidezData: FluidezProfileData | null;
  experimentData: AbExperimentData;
  onUpdateExperiment: (data: AbExperimentData) => void;
}

export const Station04ControlledExperiment: React.FC<Station04ControlledExperimentProps> = ({
  specs,
  fluidezData,
  experimentData,
  onUpdateExperiment,
}) => {
  // Local working state initialized from props
  const [game, setGame] = useState<string>(
    experimentData.game ||
      (fluidezData?.game === 'OTRO'
        ? fluidezData.customGameName || 'VALORANT'
        : fluidezData?.game || 'VALORANT')
  );

  const [scenarioA, setScenarioA] = useState<AbScenarioPoint>(experimentData.scenarioA);
  const [scenarioB, setScenarioB] = useState<AbScenarioPoint>(experimentData.scenarioB);

  // Recalculate Delta
  const computeDelta = (aFps: number, bFps: number) => {
    if (aFps <= 0) return 0;
    return Number((((bFps - aFps) / aFps) * 100).toFixed(1));
  };

  const deltaPct = computeDelta(scenarioA.fps, scenarioB.fps);

  // Derive empirical behavior
  const deriveBehavior = (delta: number, aGpu: number): ObservedAbBehavior => {
    if (delta >= 18) {
      return 'SUBIERON_FPS_PROPORCIONAL';
    }
    if (delta <= 7) {
      return 'FPS_CASI_IDENTICOS';
    }
    return 'FPS_ALTOS_CON_TIRONES';
  };

  const currentBehavior = deriveBehavior(deltaPct, scenarioA.gpuUsagePct);

  // Propagate changes upwards
  const handleApplyChanges = (
    newA: AbScenarioPoint,
    newB: AbScenarioPoint,
    newGame: string = game
  ) => {
    const d = computeDelta(newA.fps, newB.fps);
    const beh = deriveBehavior(d, newA.gpuUsagePct);
    const updated: AbExperimentData = {
      game: newGame,
      variableChanged: 'RESOLUCIÓN GRÁFICA // CARGA DE PÍXELES',
      scenarioA: newA,
      scenarioB: newB,
      fpsDeltaPct: d,
      observedBehavior: beh,
      notes: `Variación de FPS: ${d >= 0 ? `+${d}%` : `${d}%`}. Comportamiento: ${beh}`,
    };
    onUpdateExperiment(updated);
  };

  // Preset 1: GPU Bound Test Case
  const loadGpuBoundPreset = () => {
    const a: AbScenarioPoint = {
      label: 'Escenario A (1080p Nativo)',
      resolution: '1920×1080',
      quality: 'Media',
      fps: 82,
      gpuUsagePct: 98,
      cpuUsagePct: 38,
      tempC: 68,
      notes: 'GPU saturada al 98%.',
    };
    const b: AbScenarioPoint = {
      label: 'Escenario B (720p / 50% Render)',
      resolution: '1280×720',
      quality: 'Media (Misma calidad)',
      fps: 138,
      gpuUsagePct: 82,
      cpuUsagePct: 55,
      tempC: 66,
      notes: 'Al reducir píxeles a la mitad, los FPS aumentaron un +68%.',
    };
    setScenarioA(a);
    setScenarioB(b);
    handleApplyChanges(a, b);
  };

  // Preset 2: CPU Bound Test Case
  const loadCpuBoundPreset = () => {
    const a: AbScenarioPoint = {
      label: 'Escenario A (1080p Nativo)',
      resolution: '1920×1080',
      quality: 'Baja',
      fps: 142,
      gpuUsagePct: 62,
      cpuUsagePct: 36,
      tempC: 64,
      notes: 'GPU al 62%, Núcleo maestro de CPU al 100%.',
    };
    const b: AbScenarioPoint = {
      label: 'Escenario B (720p / 50% Render)',
      resolution: '1280×720',
      quality: 'Baja (Misma calidad)',
      fps: 147,
      gpuUsagePct: 44,
      cpuUsagePct: 38,
      tempC: 65,
      notes: 'Al bajar la resolución, los FPS apenas cambiaron (+3.5%).',
    };
    setScenarioA(a);
    setScenarioB(b);
    handleApplyChanges(a, b);
  };

  return (
    <section id="estacion-04-experimento-controlado" className="space-y-6 pt-4">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase">
          <span className="text-yellow-400 font-bold">ESTACIÓN 04 // EXPERIMENTO CONTROLADO</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">PRUEBA A/B CON UNA SOLA VARIABLE</span>
        </div>
        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
          MÉTODO CIENTÍFICO APLICADO
        </span>
      </div>

      {/* Editorial Principle Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161720] via-[#121318] to-[#0c0d10] border-l-4 border-yellow-400 border-y border-r border-zinc-800 space-y-3">
        <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
          REGLA DE ORO DE LABORATORIO
        </span>
        <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
          Cambiar una sola variable a la vez
        </h3>
        <p className="font-sans-editorial text-zinc-300 text-sm sm:text-base leading-relaxed">
          Si cambiás la resolución, cerrás Discord, bajás la calidad de texturas y actualizás los drivers de la tarjeta gráfica al mismo tiempo, <strong>jamás sabrás cuál fue la causa real</strong>.
          <br />
          Para saber si tu cuello de botella en este juego es la GPU o la CPU, alteramos <strong>únicamente la carga de píxeles</strong>.
        </p>
      </div>

      {/* Experiment Protocol Interactive Workbench */}
      <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-xs font-mono-tech text-yellow-400 uppercase font-bold tracking-wider block">
              BANCO DE ENSAYO EMPÍRICO
            </span>
            <h4 className="font-display font-bold text-lg text-white uppercase mt-0.5">
              Protocolo de Modificación de Carga de GPU
            </h4>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono-tech">
            <span className="text-[10px] text-zinc-400 uppercase">PRESETS DIDÁCTICOS (DATOS SIMULADOS):</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                id="btn-preset-gpu-bound"
                onClick={loadGpuBoundPreset}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer"
              >
                Cargar Caso Gráfico
              </button>
              <button
                type="button"
                id="btn-preset-cpu-bound"
                onClick={loadCpuBoundPreset}
                className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                Cargar Caso Plataforma / CPU
              </button>
            </div>
          </div>
        </div>

        {/* Game Title Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono-tech text-zinc-400 uppercase tracking-wider block font-bold">
            JUEGO OBJETO DE ENSAYO:
          </label>
          <input
            type="text"
            value={game}
            onChange={(e) => {
              setGame(e.target.value);
              handleApplyChanges(scenarioA, scenarioB, e.target.value);
            }}
            placeholder="Ej: VALORANT / CS2 / CYBERPUNK"
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-black/60 border border-zinc-700 text-white font-mono-tech text-xs focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Side-by-Side Comparison: Scenario A vs Scenario B */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* SCENARIO A: BASE */}
          <div className="p-5 rounded-xl bg-black/40 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-mono-tech text-zinc-400 font-bold uppercase">
                ESTADO A // LÍNEA DE BASE
              </span>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-900 text-zinc-300">
                100% ESCALA NATIVA
              </span>
            </div>

            <div className="space-y-3 font-mono-tech text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 text-[10px] uppercase block">RESOLUCIÓN BASE</label>
                <input
                  type="text"
                  value={scenarioA.resolution}
                  onChange={(e) => {
                    const next = { ...scenarioA, resolution: e.target.value };
                    setScenarioA(next);
                    handleApplyChanges(next, scenarioB);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] uppercase block">FPS OBSERVADOS</label>
                  <input
                    type="number"
                    value={scenarioA.fps}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const next = { ...scenarioA, fps: val };
                      setScenarioA(next);
                      handleApplyChanges(next, scenarioB);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-yellow-400 font-bold text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] uppercase block">USO DE GPU (%)</label>
                  <input
                    type="number"
                    value={scenarioA.gpuUsagePct}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                      const next = { ...scenarioA, gpuUsagePct: val };
                      setScenarioA(next);
                      handleApplyChanges(next, scenarioB);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-cyan-400 font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 text-[10px] uppercase block">CALIDAD GRÁFICA / PRESET</label>
                <input
                  type="text"
                  value={scenarioA.quality}
                  onChange={(e) => {
                    const next = { ...scenarioA, quality: e.target.value };
                    setScenarioA(next);
                    handleApplyChanges(next, scenarioB);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* SCENARIO B: MODIFIED */}
          <div className="p-5 rounded-xl bg-black/40 border border-yellow-400/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-mono-tech text-yellow-400 font-bold uppercase">
                ESTADO B // MODIFICACIÓN CONTROLADA
              </span>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                BAJAR RESOLUCIÓN / ESCALA
              </span>
            </div>

            <div className="space-y-3 font-mono-tech text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 text-[10px] uppercase block">
                  RESOLUCIÓN REDUCIDA (ÚNICA VARIABLE ALTERADA)
                </label>
                <input
                  type="text"
                  value={scenarioB.resolution}
                  onChange={(e) => {
                    const next = { ...scenarioB, resolution: e.target.value };
                    setScenarioB(next);
                    handleApplyChanges(scenarioA, next);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] uppercase block">FPS OBSERVADOS B</label>
                  <input
                    type="number"
                    value={scenarioB.fps}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const next = { ...scenarioB, fps: val };
                      setScenarioB(next);
                      handleApplyChanges(scenarioA, next);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-yellow-400 font-bold text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] uppercase block">USO DE GPU B (%)</label>
                  <input
                    type="number"
                    value={scenarioB.gpuUsagePct}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                      const next = { ...scenarioB, gpuUsagePct: val };
                      setScenarioB(next);
                      handleApplyChanges(scenarioA, next);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-cyan-400 font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 text-[10px] uppercase block">
                  CALIDAD (DEBE SER IDÉNTICA A LA DE A)
                </label>
                <input
                  type="text"
                  value={scenarioB.quality}
                  onChange={(e) => {
                    const next = { ...scenarioB, quality: e.target.value };
                    setScenarioB(next);
                    handleApplyChanges(scenarioA, next);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delta Outcome & Mathematical Deduction */}
        <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-4 font-mono-tech">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <span className="text-xs uppercase text-zinc-400 font-bold">
              VARIACIÓN OBSERVADA // ANÁLISIS DE DELTA
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">DELTA FPS:</span>
              <span
                className={`text-xl font-black ${
                  deltaPct >= 18
                    ? 'text-emerald-400'
                    : deltaPct <= 7
                    ? 'text-amber-400'
                    : 'text-yellow-400'
                }`}
              >
                {deltaPct >= 0 ? `+${deltaPct}%` : `${deltaPct}%`}
              </span>
            </div>
          </div>

          {/* Verdict Explanations */}
          {deltaPct >= 18 && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>CASO 1 // LOS FPS SUBIERON SUSTANCIALMENTE (+{deltaPct}%)</span>
              </div>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                Al aliviar la carga de píxeles a la GPU, el rendimiento escaló de forma sensible (de {scenarioA.fps} a {scenarioB.fps} FPS).
                <br />
                <strong className="text-emerald-300">
                  Indicio fuerte: en tu configuración habitual ({scenarioA.resolution}), los datos son consistentes con una limitación situada principalmente en el renderizado gráfico (GPU).
                </strong>
              </p>
            </div>
          )}

          {deltaPct <= 7 && deltaPct >= -10 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>CASO 2 // LOS FPS CASI NO SE MOVIERON ({deltaPct >= 0 ? `+${deltaPct}%` : `${deltaPct}%`})</span>
              </div>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                A pesar de reducir la carga de renderizado a la mitad, la cadencia de fotogramas permaneció prácticamente invariable (de {scenarioA.fps} a {scenarioB.fps} FPS).
                <br />
                <strong className="text-amber-300">
                  Indicio fuerte: la GPU operaba con margen de espera. La evidencia apunta a una limitación del lado plataforma o CPU (hilo crítico o subsistema de memoria).
                </strong>
              </p>
            </div>
          )}

          {deltaPct > 7 && deltaPct < 18 && (
            <div className="p-4 rounded-xl bg-yellow-950/20 border border-yellow-500/40 space-y-2">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase">
                <Activity className="w-4 h-4 text-yellow-400" />
                <span>CASO 3 // ESCALADO HÍBRIDO O MODERADO (+{deltaPct}%)</span>
              </div>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                Los FPS registraron una variación parcial moderada. Esto sugiere un régimen de transición en el que la carga se distribuye entre el renderizado gráfico y el procesamiento de la plataforma.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
