import React, { useState } from 'react';
import { Zap, Flame, Sliders, AlertTriangle, ShieldCheck, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

type CircuitMode = 'SERIES' | 'PARALLEL' | 'MIXED' | 'SHORT_CIRCUIT' | 'OPEN_CIRCUIT';

export const ElectricCircuitsLab: React.FC = () => {
  // Circuit Parameters
  const [voltage, setVoltage] = useState<number>(12.0); // +12V standard PC rail
  const [resistance1, setResistance1] = useState<number>(4.0); // 4 Ohms
  const [resistance2, setResistance2] = useState<number>(6.0); // 6 Ohms
  const [resistance3, setResistance3] = useState<number>(2.0); // 2 Ohms for mixed
  const [circuitTopology, setCircuitTopology] = useState<CircuitMode>('SERIES');
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Equivalent Resistance Calculations
  let req = 0;
  let isShortCircuit = false;
  let isOpenCircuit = false;

  if (circuitTopology === 'SHORT_CIRCUIT') {
    req = 0.001; // extremely low impedance
    isShortCircuit = true;
  } else if (circuitTopology === 'OPEN_CIRCUIT') {
    req = 999999; // open air gap
    isOpenCircuit = true;
  } else if (circuitTopology === 'SERIES') {
    req = resistance1 + resistance2;
  } else if (circuitTopology === 'PARALLEL') {
    req = (resistance1 * resistance2) / (resistance1 + resistance2);
  } else if (circuitTopology === 'MIXED') {
    // R1 and R2 in parallel, plus R3 in series
    const rParallel = (resistance1 * resistance2) / (resistance1 + resistance2);
    req = rParallel + resistance3;
  }

  // Ohm's Law: I = V / R_eq
  const currentTotal = req > 0 ? voltage / req : 0;

  // Power Law: P = V * I (Watts)
  const powerTotal = voltage * currentTotal;

  // Per branch calculations
  let vDrop1 = 0;
  let vDrop2 = 0;
  let vDrop3 = 0;
  let current1 = 0;
  let current2 = 0;
  let current3 = 0;

  if (circuitTopology === 'SERIES') {
    current1 = currentTotal;
    current2 = currentTotal;
    vDrop1 = currentTotal * resistance1;
    vDrop2 = currentTotal * resistance2;
  } else if (circuitTopology === 'PARALLEL') {
    vDrop1 = voltage;
    vDrop2 = voltage;
    current1 = resistance1 > 0 ? voltage / resistance1 : 0;
    current2 = resistance2 > 0 ? voltage / resistance2 : 0;
  } else if (circuitTopology === 'MIXED') {
    current3 = currentTotal;
    vDrop3 = currentTotal * resistance3;
    const vParallel = Math.max(0, voltage - vDrop3);
    vDrop1 = vParallel;
    vDrop2 = vParallel;
    current1 = resistance1 > 0 ? vParallel / resistance1 : 0;
    current2 = resistance2 > 0 ? vParallel / resistance2 : 0;
  }

  const power1 = vDrop1 * current1;
  const power2 = vDrop2 * current2;
  const power3 = vDrop3 * current3;

  // Thermal dissipation estimation (Joule Effect: Q = I² * R)
  // Temperature rise estimate on standard 1oz copper trace
  const ambientTemp = 25;
  const traceTempDelta = Math.min(150, Math.round(powerTotal * 0.85));
  const estimatedTraceTemp = isShortCircuit ? 180 : ambientTemp + traceTempDelta;
  const thermalIntensity = Math.min(100, Math.round((powerTotal / 140) * 100));

  const applyPreset = (preset: 'CPU_VCORE' | 'RAM_PMIC' | 'PCIE_12V' | 'SHORT') => {
    if (preset === 'CPU_VCORE') {
      setVoltage(1.2);
      setResistance1(0.05);
      setResistance2(0.05);
      setCircuitTopology('PARALLEL');
    } else if (preset === 'RAM_PMIC') {
      setVoltage(1.1);
      setResistance1(2.0);
      setResistance2(3.0);
      setCircuitTopology('SERIES');
    } else if (preset === 'PCIE_12V') {
      setVoltage(12.0);
      setResistance1(4.0);
      setResistance2(6.0);
      setCircuitTopology('SERIES');
    } else if (preset === 'SHORT') {
      setVoltage(12.0);
      setCircuitTopology('SHORT_CIRCUIT');
    }
  };

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                FUNDAMENTOS // PARTE I
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Ley de Ohm (V=I·R) y Ley de Joule (P=I²·R)" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              ELECTRICIDAD Y CIRCUITOS: LEY DE OHM, POTENCIA Y EFECTO JOULE
            </h2>
            <p className="text-zinc-400 text-sm max-w-3xl">
              Una PC es una máquina electromagnética antes que de software. Entendé cómo interactúan el Voltaje (tensión), la Corriente (amperios), la Resistencia equivalente y por qué las pistas de cobre disipan calor.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-mono text-xs font-bold hover:bg-yellow-500/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showGuide ? 'OCULTAR GUÍA' : 'GUÍA DE USO'}</span>
              {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Guía de Uso Paso a Paso */}
      {showGuide && (
        <div className="border border-yellow-500/30 bg-yellow-950/20 rounded-xl p-5 space-y-3 font-sans text-xs text-zinc-300">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-yellow-400">
            <Zap className="w-4 h-4" />
            <span>GUÍA DE EXPERIMENTACIÓN TÉCNICA // PASO A PASO</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-zinc-300">
            <li>
              <strong className="text-white font-mono">Paso 1 (Seleccionar Topología):</strong> Probá entre circuito en <em>Serie</em>, <em>Paralelo</em> o <em>Mixto</em>. Observá cómo en Serie las resistencias se suman (R_eq = R1 + R2), mientras que en Paralelo la resistencia total disminuye (1/R_eq = 1/R1 + 1/R2).
            </li>
            <li>
              <strong className="text-white font-mono">Paso 2 (Ajustar Tensión y Resistencias):</strong> Modificá el voltaje de la fuente o usá los accesos rápidos de rieles ATX (1.2V VCore, 3.3V Lógica, 5.0V SATA, 12.0V PCIe).
            </li>
            <li>
              <strong className="text-white font-mono">Paso 3 (Efecto Joule & Calor):</strong> Observá el termómetro de disipación de calor (P = I² · R). Al reducir la resistencia manteniendo el voltaje, la corriente se dispara cuadráticamente en calor, imitando la carga de una GPU o CPU bajo Overclock.
            </li>
            <li>
              <strong className="text-white font-mono">Paso 4 (Probar Cortocircuito):</strong> Seleccioná la prueba de <em>Cortocircuito</em> para simular una falla donde la impedancia cae a casi cero y salta la protección OCP (Over-Current Protection) de la fuente.
            </li>
          </ol>
        </div>
      )}

      {/* Topologies & Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-zinc-400 uppercase font-bold mr-1">TOPOLOGÍA:</span>
          {(['SERIES', 'PARALLEL', 'MIXED', 'SHORT_CIRCUIT', 'OPEN_CIRCUIT'] as CircuitMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setCircuitTopology(mode)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                circuitTopology === mode
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {mode === 'SERIES'
                ? 'Serie'
                : mode === 'PARALLEL'
                ? 'Paralelo'
                : mode === 'MIXED'
                ? 'Mixto'
                : mode === 'SHORT_CIRCUIT'
                ? '⚡ Cortocircuito'
                : '🔌 Circuito Abierto'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">PRESETS:</span>
          <button
            type="button"
            onClick={() => applyPreset('CPU_VCORE')}
            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 cursor-pointer"
          >
            VCore CPU (1.2V)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('PCIE_12V')}
            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 cursor-pointer"
          >
            PCIe 12V
          </button>
          <button
            type="button"
            onClick={() => applyPreset('SHORT')}
            className="px-2 py-1 bg-red-950/60 text-red-300 rounded border border-red-700 hover:bg-red-900/60 cursor-pointer"
          >
            Falla Corto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sliders className="w-5 h-5 text-yellow-400" />
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              PARÁMETROS ELÉCTRICOS
            </h3>
          </div>

          {/* Voltage slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Tensión de Fuente (V):</span>
              <span className="text-yellow-400 font-bold">{voltage.toFixed(1)} V</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="24.0"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              disabled={isShortCircuit || isOpenCircuit}
              className="w-full accent-yellow-400 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Resistor 1 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Resistencia R1:</span>
              <span className="text-white font-bold">{resistance1.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="20.0"
              step="0.1"
              value={resistance1}
              onChange={(e) => setResistance1(parseFloat(e.target.value))}
              disabled={isShortCircuit || isOpenCircuit}
              className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Resistor 2 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Resistencia R2:</span>
              <span className="text-white font-bold">{resistance2.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="20.0"
              step="0.1"
              value={resistance2}
              onChange={(e) => setResistance2(parseFloat(e.target.value))}
              disabled={isShortCircuit || isOpenCircuit}
              className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Resistor 3 for Mixed Topology */}
          {circuitTopology === 'MIXED' && (
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Resistencia R3 (en Serie):</span>
                <span className="text-amber-400 font-bold">{resistance3.toFixed(1)} Ω</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="20.0"
                step="0.1"
                value={resistance3}
                onChange={(e) => setResistance3(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          )}

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 space-y-1">
            <div className="text-zinc-300 font-bold uppercase text-[10px]">Fórmulas Aplicadas:</div>
            <div>R_eq = {req.toFixed(3)} Ω</div>
            <div>I = V / R_eq = <strong className="text-cyan-300">{currentTotal.toFixed(2)} A</strong></div>
            <div>P = I² × R = <strong className="text-amber-300">{powerTotal.toFixed(1)} W</strong></div>
          </div>
        </div>

        {/* Meters and Visualization Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">VOLTAJE TOTAL</span>
              <span className="text-2xl font-mono font-black text-yellow-400">{voltage.toFixed(1)} V</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Diferencia potencial</span>
            </div>

            <div className="bg-black/60 border border-zinc-800 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">CORRIENTE TOTAL</span>
              <span className={`text-2xl font-mono font-black ${isShortCircuit ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                {currentTotal.toFixed(1)} A
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block">Flujo electrones</span>
            </div>

            <div className="bg-black/60 border border-zinc-800 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">RESISTENCIA EQUIV.</span>
              <span className="text-2xl font-mono font-black text-white">
                {isOpenCircuit ? '∞' : req.toFixed(2)} Ω
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block">Oposición al paso</span>
            </div>

            <div className="bg-black/60 border border-zinc-800 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">POTENCIA CONSUMIDA</span>
              <span className="text-2xl font-mono font-black text-amber-400">{powerTotal.toFixed(1)} W</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Energía disipada</span>
            </div>
          </div>

          {/* Interactive Circuit Schematic */}
          <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-6 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="font-mono text-xs uppercase font-bold text-zinc-300">
                ESQUEMA DE MONITOREO TÉCNICO ({circuitTopology})
              </span>
              <span className="font-mono text-xs text-zinc-500">
                Temp. Estimada Pistas: <strong className="text-orange-400">{estimatedTraceTemp}°C</strong>
              </span>
            </div>

            {isShortCircuit ? (
              <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-400 animate-bounce" />
                <div>
                  <h4 className="font-mono text-sm font-bold text-red-200 uppercase">
                    ¡CORTOCIRCUITO CRÍTICO REGISTRADO!
                  </h4>
                  <p className="text-xs text-red-300/80 font-sans">
                    La resistencia cayó a ~0 Ω. La corriente tiende al infinito, disparando la temperatura de las pistas de cobre y activando la protección OCP (Over-Current Protection) de la fuente de poder.
                  </p>
                </div>
              </div>
            ) : isOpenCircuit ? (
              <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-zinc-400" />
                <div>
                  <h4 className="font-mono text-sm font-bold text-zinc-200 uppercase">
                    CIRCUITO ABIERTO (RESISTENCIA INFINITA)
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans">
                    Existe una interrupción en el conductor (pista rota, fusible quemado o switch abierto). La corriente es de 0 Amperios y no hay disipación de potencia.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3.5 space-y-1">
                  <span className="text-cyan-400 font-bold uppercase">RAMA R1 ({resistance1} Ω)</span>
                  <div className="text-zinc-300">Caída V: <strong>{vDrop1.toFixed(2)} V</strong></div>
                  <div className="text-zinc-300">Corriente I: <strong>{current1.toFixed(2)} A</strong></div>
                  <div className="text-amber-400">Potencia P: <strong>{power1.toFixed(1)} W</strong></div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3.5 space-y-1">
                  <span className="text-cyan-400 font-bold uppercase">RAMA R2 ({resistance2} Ω)</span>
                  <div className="text-zinc-300">Caída V: <strong>{vDrop2.toFixed(2)} V</strong></div>
                  <div className="text-zinc-300">Corriente I: <strong>{current2.toFixed(2)} A</strong></div>
                  <div className="text-amber-400">Potencia P: <strong>{power2.toFixed(1)} W</strong></div>
                </div>
              </div>
            )}

            {/* Joule Effect Thermal Dissipation Meter */}
            <div className="space-y-2 pt-3 border-t border-zinc-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Efecto Joule en Pistas de Cobre PCB (P = I²·R):
                </span>
                <span className="text-orange-400 font-bold">{powerTotal.toFixed(1)} W</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-300"
                  style={{ width: `${Math.max(5, thermalIntensity)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
