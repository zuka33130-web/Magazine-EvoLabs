import React, { useState } from 'react';
import { Sliders, Activity, Info, CheckCircle2, AlertTriangle, BookOpen, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

interface RamPreset {
  name: string;
  generation: 'DDR3' | 'DDR4' | 'DDR5';
  speedMts: number;
  tcl: number;
  trcd: number;
  trp: number;
  tras: number;
  voltage: number;
  channels: number;
}

const PRESETS: RamPreset[] = [
  { name: 'DDR4-3200 CL16 (Estándar Popular)', generation: 'DDR4', speedMts: 3200, tcl: 16, trcd: 18, trp: 18, tras: 36, voltage: 1.35, channels: 2 },
  { name: 'DDR4-3600 CL14 (Samsung B-Die Optimizado)', generation: 'DDR4', speedMts: 3600, tcl: 14, trcd: 14, trp: 14, tras: 28, voltage: 1.45, channels: 2 },
  { name: 'DDR5-4800 CL40 (JEDEC Base)', generation: 'DDR5', speedMts: 4800, tcl: 40, trcd: 40, trp: 40, tras: 80, voltage: 1.10, channels: 2 },
  { name: 'DDR5-6000 CL30 (Sweet Spot AMD/Intel)', generation: 'DDR5', speedMts: 6000, tcl: 30, trcd: 36, trp: 36, tras: 76, voltage: 1.35, channels: 2 },
  { name: 'DDR5-7200 CL34 (Alta Gama Entusiasta)', generation: 'DDR5', speedMts: 7200, tcl: 34, trcd: 44, trp: 44, tras: 96, voltage: 1.40, channels: 2 },
];

export const RamLatencyExplorerLab: React.FC = () => {
  const [speedMts, setSpeedMts] = useState<number>(3200);
  const [tcl, setTcl] = useState<number>(16);
  const [trcd, setTrcd] = useState<number>(18);
  const [trp, setTrp] = useState<number>(18);
  const [tras, setTras] = useState<number>(36);
  const [channels, setChannels] = useState<number>(2); // Dual channel default
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Exact Metrological Formulas
  const realClockMhz = speedMts / 2;
  const clockCycleTimeNs = 1000 / realClockMhz; // ns per clock cycle

  // True CAS Latency in ns: (tCL * 2000) / MT/s
  const trueLatencyNs = (tcl * 2000) / speedMts;

  // Row Cycle Time: tRC = tRAS + tRP
  const trc = tras + trp;
  const trcNs = (trc * 2000) / speedMts;

  // Theoretical Bandwidth in GB/s
  const theoreticalBandwidthGbs = (speedMts * 8 * channels) / 1000;

  // Workload Impact Models
  // Esports 1% Low FPS estimate (Base 120 FPS at 15ns latency, scaling up with lower latency & higher bandwidth)
  const esportsLowFps = Math.round(180 * (10 / Math.max(7, trueLatencyNs)) * Math.sqrt(channels));
  const videoEncodeSec = Math.round(120 * (1 / (theoreticalBandwidthGbs / 40)));

  const handleApplyPreset = (p: RamPreset) => {
    setSpeedMts(p.speedMts);
    setTcl(p.tcl);
    setTrcd(p.trcd);
    setTrp(p.trp);
    setTras(p.tras);
    setChannels(p.channels);
  };

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                ESCALÓN 4 // BUSES Y MEMORIA
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Fórmula JEDEC: Latencia (ns) = (tCL × 2000) / MT/s" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              CALCULADOR Y EXPLORADOR DE LATENCIAS DE MEMORIA RAM
            </h2>
            <p className="text-zinc-400 text-sm max-w-3xl">
              ¿Por qué una memoria de 6000 MT/s puede responder más lento que una de 3600 MT/s? Aprendé a desmitificar la frecuencia comercial calculando la latencia absoluta en nanosegundos y el ancho de banda por canal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showGuide ? 'OCULTAR GUÍA' : 'GUÍA DE USO'}</span>
            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Guía de Uso Paso a Paso */}
      {showGuide && (
        <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-xl p-5 space-y-3 font-sans text-xs text-zinc-300">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-emerald-400">
            <Info className="w-4 h-4" />
            <span>GUÍA DE USO METROLÓGICO // PROCEDIMIENTO PASO A PASO</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-zinc-300">
            <li>
              <strong className="text-white font-mono">Paso 1 (Perfiles Canónicos):</strong> Probá presets como <em>DDR4-3600 CL14</em> vs <em>DDR5-4800 CL40</em>.
            </li>
            <li>
              <strong className="text-white font-mono">Paso 2 (Latencia Absoluta):</strong> Observá que la latencia real mide el tiempo en nanosegundos que transcurre antes de que el primer dato salga del banco de memoria.
            </li>
            <li>
              <strong className="text-white font-mono">Paso 3 (Canales de Memoria):</strong> Conmutá Single vs Dual Channel para ver la duplicación de ancho de banda.
            </li>
          </ol>
        </div>
      )}

      {/* Presets Bar */}
      <div className="space-y-2">
        <span className="font-mono text-xs uppercase font-bold text-zinc-400 block">
          PRESETS CANÓNICOS JEDEC / XMP / EXPO:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {PRESETS.map((p, idx) => {
            const isSelected = speedMts === p.speedMts && tcl === p.tcl;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="text-[10px] text-zinc-500 uppercase">{p.generation}</div>
                <div className="text-xs font-bold text-white truncate">{p.name.split(' (')[0]}</div>
                <div className="text-[10px] text-zinc-400 mt-1">tCL: {p.tcl} · {p.voltage}V</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              TIMINGS Y FRECUENCIA
            </h3>
          </div>

          {/* MT/s Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Velocidad Efectiva (MT/s):</span>
              <span className="text-emerald-400 font-bold">{speedMts} MT/s</span>
            </div>
            <input
              type="range"
              min="1600"
              max="8400"
              step="100"
              value={speedMts}
              onChange={(e) => setSpeedMts(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* tCL Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Latencia CAS (tCL):</span>
              <span className="text-cyan-400 font-bold">CL{tcl}</span>
            </div>
            <input
              type="range"
              min="9"
              max="46"
              step="1"
              value={tcl}
              onChange={(e) => setTcl(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Channels Selector */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-400 block uppercase">Canales Activos:</span>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {[1, 2].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChannels(ch)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    channels === ch
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  {ch === 1 ? 'Single Channel' : 'Dual Channel'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 space-y-1">
            <div className="text-zinc-300 font-bold text-[10px] uppercase">Frecuencias Físicas:</div>
            <div>Reloj I/O Real: <strong className="text-white">{realClockMhz.toFixed(1)} MHz</strong></div>
            <div>Duración Ciclo: <strong className="text-cyan-300">{clockCycleTimeNs.toFixed(3)} ns</strong></div>
            <div>Row Cycle tRC (tRAS+tRP): <strong className="text-amber-300">{trc} ciclos ({trcNs.toFixed(1)}ns)</strong></div>
          </div>
        </div>

        {/* Meters and Results Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            {/* Real Latency */}
            <div className="bg-black/60 border border-emerald-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                LATENCIA REAL ABSOLUTA
              </span>
              <span className="text-3xl font-black text-emerald-400">
                {trueLatencyNs.toFixed(2)} <span className="text-sm text-emerald-300">ns</span>
              </span>
              <p className="text-[10px] text-zinc-400">
                Fórmula: ({tcl} × 2000) / {speedMts}
              </p>
            </div>

            {/* Bandwidth */}
            <div className="bg-black/60 border border-cyan-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                ANCHO DE BANDA TEÓRICO
              </span>
              <span className="text-3xl font-black text-cyan-400">
                {theoreticalBandwidthGbs.toFixed(1)} <span className="text-sm text-cyan-300">GB/s</span>
              </span>
              <p className="text-[10px] text-zinc-400">
                Bus de {channels * 64} bits en paralelo
              </p>
            </div>

            {/* Impact Rating */}
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                ESPORTS 1% LOW EST.
              </span>
              <span className="text-3xl font-black text-amber-400">
                ~{esportsLowFps} <span className="text-sm text-amber-300">FPS</span>
              </span>
              <p className="text-[10px] text-zinc-400">
                Fluidez de cuadros mínimos
              </p>
            </div>
          </div>

          {/* Comparison Graph */}
          <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-5 space-y-4">
            <span className="font-mono text-xs uppercase font-bold text-zinc-300 block">
              TABLA COMPARATIVA DE TIEMPOS DE RESPUESTA (NS)
            </span>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Tu Configuración Actual ({speedMts} MT/s CL{tcl})</span>
                  <span className="font-bold text-emerald-400">{trueLatencyNs.toFixed(2)} ns</span>
                </div>
                <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (trueLatencyNs / 20) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Referencia DDR4-3600 CL14 (Samsung B-Die)</span>
                  <span className="text-zinc-300">7.78 ns</span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-600" style={{ width: `${(7.78 / 20) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Referencia DDR5-6000 CL30 (Sweet Spot)</span>
                  <span className="text-zinc-300">10.00 ns</span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${(10.0 / 20) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
