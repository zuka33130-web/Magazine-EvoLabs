import React, { useState, useEffect, useRef } from 'react';
import { Activity, Sliders, Waves, Play, Pause, AlertTriangle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

export const DigitalSignalsLab: React.FC = () => {
  // Clock parameters
  const [frequencyGhz, setFrequencyGhz] = useState<number>(3.6); // 3.6 GHz base clock
  const [dutyCycle, setDutyCycle] = useState<number>(50); // 50% square wave
  const [logicStandard, setLogicStandard] = useState<'TTL_5V' | 'CMOS_3V3' | 'DDR5_1V1' | 'CORE_0V8'>('CORE_0V8');
  const [jitterPs, setJitterPs] = useState<number>(15); // Picoseconds jitter
  const [isOscilloscopeRunning, setIsOscilloscopeRunning] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Derived physics
  // Period T = 1 / f
  const periodNs = (1 / frequencyGhz).toFixed(3); // in nanoseconds
  const periodPs = (1000 / frequencyGhz).toFixed(1); // in picoseconds
  const waveLengthLightMm = ((299792458 / (frequencyGhz * 1e9)) * 1000).toFixed(1); // mm in vacuum

  // Logic Voltage Thresholds
  const logicProfiles = {
    TTL_5V: {
      name: 'Transistor-Transistor Logic (TTL Clásico)',
      vHighMin: 2.0,
      vLowMax: 0.8,
      vSupply: 5.0,
      vNoiseMargin: 0.4,
      color: '#F59E0B',
    },
    CMOS_3V3: {
      name: 'CMOS 3.3V (Buses PCIe / LPC)',
      vHighMin: 2.0,
      vLowMax: 0.8,
      vSupply: 3.3,
      vNoiseMargin: 0.5,
      color: '#3B82F6',
    },
    DDR5_1V1: {
      name: 'DDR5 SDRAM Bus (1.1V PMIC)',
      vHighMin: 0.77,
      vLowMax: 0.33,
      vSupply: 1.1,
      vNoiseMargin: 0.12,
      color: '#10B981',
    },
    CORE_0V8: {
      name: 'Silicio Núcleo Moderno (FinFET 0.8V - 1.2V)',
      vHighMin: 0.55,
      vLowMax: 0.25,
      vSupply: 0.85,
      vNoiseMargin: 0.08,
      color: '#8B5CF6',
    },
  };

  const currentProfile = logicProfiles[logicStandard];

  // Rise / Fall time estimation (t_r ~ 10-20% of period for high speed silicon)
  const riseTimePs = Math.round(parseFloat(periodPs) * 0.12);
  const isDutyCycleUnstable = dutyCycle < 40 || dutyCycle > 60;
  const isJitterHigh = jitterPs > 30;

  // Canvas Oscilloscope Animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    let offset = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with CRT phosphor dark background
      ctx.fillStyle = '#060A0E';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid (Volt / Time Div)
      ctx.strokeStyle = '#12202C';
      ctx.lineWidth = 1;

      // Vertical divisions
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal divisions
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Voltage reference levels
      const lowY = height - 35;
      const highY = 40;

      // Logic high reference line
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, highY);
      ctx.lineTo(width, highY);
      ctx.stroke();

      // Logic low reference line
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, lowY);
      ctx.lineTo(width, lowY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Clock Square Wave
      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const wavePeriodPx = Math.max(30, 200 / frequencyGhz);
      const highWidthPx = (wavePeriodPx * dutyCycle) / 100;
      const riseFallPx = 4; // realistic rise and fall time

      if (isOscilloscopeRunning) {
        offset = (offset + frequencyGhz * 1.5) % wavePeriodPx;
      }

      for (let x = -wavePeriodPx; x < width + wavePeriodPx; x += wavePeriodPx) {
        const startX = x - offset;
        const jitter = (Math.random() - 0.5) * (jitterPs / 8);

        // Low segment
        ctx.lineTo(startX, lowY);
        // Rise edge
        ctx.lineTo(startX + riseFallPx + jitter, highY);
        // High segment
        ctx.lineTo(startX + highWidthPx + jitter, highY);
        // Fall edge
        ctx.lineTo(startX + highWidthPx + riseFallPx, lowY);
      }
      ctx.stroke();

      // Glow effect
      ctx.shadowColor = '#22D3EE';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [frequencyGhz, dutyCycle, jitterPs, isOscilloscopeRunning]);

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                FUNDAMENTOS // PARTE I
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Física Electromagnética / Período T = 1/f" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              SEÑALES DIGITALES, OSCILOSCOPIO Y FRECUENCIA DE RELOJ
            </h2>
            <p className="text-zinc-400 text-sm max-w-3xl">
              Un ciclo de reloj de 4.0 GHz dura tan solo 0.25 nanosegundos (250 picosegundos). La luz viaja apenas 7.5 centímetros en ese tiempo. Analizá niveles lógicos, tiempos de transición y márgenes de ruido con el osciloscopio de laboratorio.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showGuide ? 'OCULTAR GUÍA' : 'GUÍA DE USO'}</span>
            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Guía de Uso Paso a Paso */}
      {showGuide && (
        <div className="border border-cyan-500/30 bg-cyan-950/20 rounded-xl p-5 space-y-3 font-sans text-xs text-zinc-300">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-cyan-400">
            <Activity className="w-4 h-4" />
            <span>GUÍA DE USO METROLÓGICO // ANÁLISIS DE SEÑALES</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-zinc-300">
            <li>
              <strong className="text-white font-mono">Paso 1 (Ajustar Frecuencia):</strong> Subí la frecuencia de 0.5 GHz a 5.5 GHz. Fijate cómo el período ($T = 1/f$) disminuye drásticamente a picosegundos y la longitud de onda de la luz limita la distancia física entre núcleos.
            </li>
            <li>
              <strong className="text-white font-mono">Paso 2 (Inyectar Jitter / Ruido):</strong> Aumentá el Jitter (fluctuación de reloj). El jitter deforma los flancos de subida y bajada, reduciendo la ventana de retención (Hold Time) de los transistores.
            </li>
            <li>
              <strong className="text-white font-mono">Paso 3 (Ciclo de Trabajo / Duty Cycle):</strong> El valor ideal es 50%. Si cae por debajo de 40% o supera el 60%, el tiempo en estado alto no alcanza para cargar las puertas lógicas, provocando errores de sincronización.
            </li>
            <li>
              <strong className="text-white font-mono">Paso 4 (Seleccionar Estándar de Silicio):</strong> Compará el estándar TTL antiguo (5V) con DDR5 (1.1V) o núcleos FinFET (0.85V). Observá cómo los márgenes de ruido se estrechan con la miniaturización.
            </li>
          </ol>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              GENERADOR DE RELOJ (CLOCK GEN)
            </h3>
          </div>

          {/* Frequency Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Frecuencia de CPU / Bus:</span>
              <span className="text-cyan-400 font-bold">{frequencyGhz.toFixed(2)} GHz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.5"
              step="0.1"
              value={frequencyGhz}
              onChange={(e) => setFrequencyGhz(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>0.5 GHz (Base)</span>
              <span>3.6 GHz (Boost)</span>
              <span>5.5 GHz (XOC)</span>
            </div>
          </div>

          {/* Duty Cycle */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Ciclo de Trabajo (Duty Cycle):</span>
              <span className={`font-bold ${isDutyCycleUnstable ? 'text-amber-400' : 'text-white'}`}>{dutyCycle}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={dutyCycle}
              onChange={(e) => setDutyCycle(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Jitter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Jitter de Reloj (Fluctuación):</span>
              <span className={`font-bold ${isJitterHigh ? 'text-red-400' : 'text-cyan-400'}`}>{jitterPs} ps</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={jitterPs}
              onChange={(e) => setJitterPs(parseInt(e.target.value, 10))}
              className="w-full accent-red-400 cursor-pointer"
            />
          </div>

          {/* Logic Standard Select */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block uppercase">Estándar Lógico / Silicio:</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(logicProfiles) as Array<keyof typeof logicProfiles>).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLogicStandard(key)}
                  className={`p-2 rounded-lg border text-left font-mono text-[11px] transition-all cursor-pointer ${
                    logicStandard === key
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div>{key.replace('_', ' ')}</div>
                  <div className="text-[9px] text-zinc-500">{logicProfiles[key].vSupply}V</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono space-y-1 text-zinc-400">
            <div className="text-zinc-300 font-bold text-[10px] uppercase">Métricas Físicas de Reloj:</div>
            <div>Período (T = 1/f): <strong className="text-cyan-300">{periodNs} ns ({periodPs} ps)</strong></div>
            <div>Tiempo de Subida (t_r est.): <strong className="text-amber-300">{riseTimePs} ps</strong></div>
            <div>Margen de Ruido (V_NM): <strong className="text-emerald-300">{currentProfile.vNoiseMargin} V</strong></div>
            <div>Distancia límite de luz: <strong className="text-purple-300">{waveLengthLightMm} mm</strong></div>
          </div>
        </div>

        {/* Oscilloscope Canvas Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-400" />
                <span className="font-mono text-xs uppercase font-bold text-zinc-200">
                  OSCILOSCOPIO DIGITAL EVO (50 GS/s EQUIVALENTE)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOscilloscopeRunning(!isOscilloscopeRunning)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 font-mono text-xs text-zinc-200 cursor-pointer"
              >
                {isOscilloscopeRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                {isOscilloscopeRunning ? 'Pausar Traza' : 'Reanudar'}
              </button>
            </div>

            {/* CRT Screen */}
            <div className="relative rounded-lg overflow-hidden border border-cyan-900/50 shadow-inner">
              <canvas
                ref={canvasRef}
                width={640}
                height={240}
                className="w-full h-56 bg-[#060A0E] block"
              />
              <div className="absolute top-2 left-3 font-mono text-[10px] text-cyan-400/80 bg-black/60 px-2 py-0.5 rounded border border-cyan-900/40">
                CH1: {frequencyGhz.toFixed(2)} GHz | TB: 100 ps/div | T = {periodNs} ns
              </div>
            </div>

            {/* Warnings Bar */}
            {(isDutyCycleUnstable || isJitterHigh) && (
              <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-lg text-xs font-mono text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  {isJitterHigh && <div>· Jitter excesivo (&gt;30ps): Riesgo de fallas de Setup & Hold Time en los registros.</div>}
                  {isDutyCycleUnstable && <div>· Duty Cycle desbalanceado ({dutyCycle}%): Asimetría en la carga de transistores.</div>}
                </div>
              </div>
            )}

            {/* Voltage Levels Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-black/50 border border-zinc-800 rounded-lg p-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">1 LÓGICO (ALTO)</span>
                <span className="text-lg font-mono font-black text-emerald-400">
                  &gt; {currentProfile.vHighMin} V
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  V_DD: {currentProfile.vSupply} V
                </span>
              </div>

              <div className="bg-black/50 border border-red-500/20 rounded-lg p-3">
                <span className="text-[10px] font-mono text-red-400 uppercase block font-bold">ZONA INDETERMINADA</span>
                <span className="text-lg font-mono font-black text-red-300">
                  {currentProfile.vLowMax} V - {currentProfile.vHighMin} V
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block">
                  Zona de ruido / error
                </span>
              </div>

              <div className="bg-black/50 border border-zinc-800 rounded-lg p-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">0 LÓGICO (BAJO)</span>
                <span className="text-lg font-mono font-black text-blue-400">
                  &lt; {currentProfile.vLowMax} V
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  GND: 0.0 V
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
