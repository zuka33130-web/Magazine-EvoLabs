import React, { useState } from 'react';
import {
  Gauge,
  Cpu,
  Flame,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { UserHardwarePassport } from '../../types';

interface EvoLiveBenchSuiteProps {
  passport: UserHardwarePassport | null;
}

export const EvoLiveBenchSuite: React.FC<EvoLiveBenchSuiteProps> = ({ passport }) => {
  // Simulator 1: Bottleneck & Frame Pacing Calculator
  const [resolution, setResolution] = useState<'1080p' | '1440p' | '4k'>('1440p');
  const [targetFps, setTargetFps] = useState<number>(144);
  const [cpuUtilization, setCpuUtilization] = useState<number>(65);
  const [gpuUtilization, setGpuUtilization] = useState<number>(98);

  // Simulator 2: Fan Curve & Acoustic Flow
  const [tempInput, setTempInput] = useState<number>(68);
  const calculatedRpm = Math.min(2200, Math.max(600, Math.round(600 + (tempInput - 40) * 45)));
  const calculatedNoise = Math.round(22 + (calculatedRpm / 2200) * 18);

  // Simulator 3: RAM Bandwidth & Latency Calculator
  const [ramSpeed, setRamSpeed] = useState<number>(6000); // MT/s
  const [casLatency, setCasLatency] = useState<number>(30); // CL
  const trueLatencyNs = ((casLatency * 2000) / ramSpeed).toFixed(2);
  const theoreticalBandwidthGBs = ((ramSpeed * 8 * 2) / 1000).toFixed(1); // Dual Channel

  return (
    <div className="w-full space-y-6 font-mono-tech select-none">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0e111a] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              SUITE METROLÓGICA & SIMULADORES EN VIVO
            </h3>
            <p className="text-xs text-zinc-400 font-sans-editorial">
              Calculadoras físicas y modelos matemáticos directos para predecir el comportamiento de tu hardware.
            </p>
          </div>
        </div>
        <span className="text-[11px] bg-zinc-900 text-amber-400 px-3 py-1 rounded-lg border border-zinc-700 font-bold">
          MOTOR DE FÍSICA APLICADA EVO
        </span>
      </div>

      {/* Grid of 3 Interactive Simulators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SIMULATOR 1: RAM True Latency Calculator */}
        <div className="p-5 rounded-2xl bg-[#090b12] border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                LATENCIA REAL DE RAM (NANOSEGUNDOS)
              </span>
              <span className="text-[10px] text-zinc-500">FÓRMULA: (CL × 2000) / MT/s</span>
            </div>

            <p className="text-xs text-zinc-400 font-sans-editorial mb-4">
              Una RAM de 6000 MT/s CL30 es más rápida en latencia absoluta que una de 6400 MT/s CL40. Calculalo acá:
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Velocidad de Transferencia:</span>
                  <span className="text-cyan-400 font-bold">{ramSpeed} MT/s</span>
                </div>
                <input
                  type="range"
                  min="3200"
                  max="8000"
                  step="200"
                  value={ramSpeed}
                  onChange={(e) => setRamSpeed(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>CAS Latency (CL):</span>
                  <span className="text-amber-400 font-bold">CL {casLatency}</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="46"
                  step="2"
                  value={casLatency}
                  onChange={(e) => setCasLatency(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">LATENCIA PRIMARIA REAL:</span>
              <span className="text-base font-bold text-emerald-400">{trueLatencyNs} ns</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">ANCHO DE BANDA DUAL-CHANNEL:</span>
              <span className="text-xs font-bold text-white">{theoreticalBandwidthGBs} GB/s</span>
            </div>
          </div>
        </div>

        {/* SIMULATOR 2: Fan Curve & Acoustic Flow */}
        <div className="p-5 rounded-2xl bg-[#090b12] border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                CURVA ACÚSTICA DE VENTILADORES
              </span>
              <span className="text-[10px] text-zinc-500">PWM CURVE OPTIMIZER</span>
            </div>

            <p className="text-xs text-zinc-400 font-sans-editorial mb-4">
              Evitá la oscilación brusca de turbina cuando abrís una pestaña del navegador. Ajustá la histéresis térmica:
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Temperatura del Die (CPU/GPU):</span>
                  <span className={`font-bold ${tempInput > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {tempInput}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  step="1"
                  value={tempInput}
                  onChange={(e) => setTempInput(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">VELOCIDAD CALCULADA:</span>
              <span className="text-base font-bold text-amber-400">{calculatedRpm} RPM</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">PRESIÓN SONORA ESTIMADA:</span>
              <span className="text-xs font-bold text-white">~{calculatedNoise} dBA (CONFORT)</span>
            </div>
          </div>
        </div>

        {/* SIMULATOR 3: Bottleneck & Resolution Shift */}
        <div className="p-5 rounded-2xl bg-[#090b12] border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                DESPLAZAMIENTO DE CUELLO DE BOTELLA
              </span>
              <span className="text-[10px] text-zinc-500">PIXEL LOAD FACTOR</span>
            </div>

            <p className="text-xs text-zinc-400 font-sans-editorial mb-3">
              Al aumentar la resolución de pantalla, la carga migra del procesador a la placa de video:
            </p>

            <div className="flex items-center gap-2 mb-3">
              {(['1080p', '1440p', '4k'] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    resolution === res
                      ? 'bg-emerald-400 text-black shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {res.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">COMPORTAMIENTO:</span>
              <span className="text-xs font-bold text-emerald-400">
                {resolution === '1080p'
                  ? 'CPU BOUND (ALTA DEMANDANTE DE IPC)'
                  : resolution === '1440p'
                  ? 'EQUILIBRIO PERFECTO SILICIO/RASTER'
                  : 'GPU BOUND (SATURACIÓN DE ROPs & VRAM)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">RECOMENDACIÓN METROLÓGICA:</span>
              <span className="text-[11px] text-zinc-300">
                {resolution === '1080p' ? 'Ajustar latencias de RAM' : 'Activar ReBAR & optimizar disipación GPU'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
