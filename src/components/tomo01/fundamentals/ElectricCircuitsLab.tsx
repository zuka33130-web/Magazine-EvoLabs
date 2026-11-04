import React, { useState } from 'react';
import { Zap, Gauge, Flame, Sliders, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

export const ElectricCircuitsLab: React.FC = () => {
  // Circuit Parameters
  const [voltage, setVoltage] = useState<number>(12.0); // +12V standard PC rail
  const [resistance1, setResistance1] = useState<number>(4.0); // 4 Ohms
  const [resistance2, setResistance2] = useState<number>(6.0); // 6 Ohms
  const [circuitTopology, setCircuitTopology] = useState<'SERIES' | 'PARALLEL'>('SERIES');

  // Equivalent Resistance Calculations
  // Series: R_eq = R1 + R2
  // Parallel: 1/R_eq = 1/R1 + 1/R2 => R_eq = (R1 * R2) / (R1 + R2)
  const req =
    circuitTopology === 'SERIES'
      ? resistance1 + resistance2
      : (resistance1 * resistance2) / (resistance1 + resistance2);

  // Ohm's Law: I = V / R_eq
  const currentTotal = req > 0 ? voltage / req : 0;

  // Power Law: P = V * I (Watts)
  const powerTotal = voltage * currentTotal;

  // Per branch calculations
  let vDrop1 = 0;
  let vDrop2 = 0;
  let current1 = 0;
  let current2 = 0;
  let power1 = 0;
  let power2 = 0;

  if (circuitTopology === 'SERIES') {
    current1 = currentTotal;
    current2 = currentTotal;
    vDrop1 = currentTotal * resistance1;
    vDrop2 = currentTotal * resistance2;
    power1 = vDrop1 * current1;
    power2 = vDrop2 * current2;
  } else {
    vDrop1 = voltage;
    vDrop2 = voltage;
    current1 = resistance1 > 0 ? voltage / resistance1 : 0;
    current2 = resistance2 > 0 ? voltage / resistance2 : 0;
    power1 = vDrop1 * current1;
    power2 = vDrop2 * current2;
  }

  // Thermal dissipation estimation (Joule Effect: Q = I² * R * t)
  // Higher power -> higher heat in PCB traces
  const thermalIntensity = Math.min(100, Math.round((powerTotal / 120) * 100));

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
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Ley de Ohm (V=I·R) y Ley de Joule (P=V·I)" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              ELECTRICIDAD Y CIRCUITOS: LEY DE OHM, POTENCIA Y EFECTO JOULE
            </h2>
            <p className="text-zinc-400 text-sm max-w-3xl">
              Una PC es una máquina electromagnética antes que de software. Entendé cómo interactúan el Voltaje (tensión), la Corriente (amperios), la Resistencia y por qué los VRM y pistas de cobre disipan calor térmico.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCircuitTopology('SERIES')}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                circuitTopology === 'SERIES'
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              Circuito en Serie
            </button>
            <button
              type="button"
              onClick={() => setCircuitTopology('PARALLEL')}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                circuitTopology === 'PARALLEL'
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              Circuito en Paralelo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sliders className="w-5 h-5 text-yellow-400" />
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              PARÁMETROS DEL CIRCUITO
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
              className="w-full accent-yellow-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-600">
              <button
                type="button"
                onClick={() => setVoltage(1.2)}
                className="hover:text-zinc-300 underline"
              >
                1.2V (VCore CPU)
              </button>
              <button
                type="button"
                onClick={() => setVoltage(3.3)}
                className="hover:text-zinc-300 underline"
              >
                3.3V (Logic ATX)
              </button>
              <button
                type="button"
                onClick={() => setVoltage(5.0)}
                className="hover:text-zinc-300 underline"
              >
                5.0V (USB/SATA)
              </button>
              <button
                type="button"
                onClick={() => setVoltage(12.0)}
                className="hover:text-zinc-300 underline"
              >
                12.0V (GPU/PCIe)
              </button>
            </div>
          </div>

          {/* Resistor 1 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Resistencia R1 (Carga A):</span>
              <span className="text-white font-bold">{resistance1.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20.0"
              step="0.5"
              value={resistance1}
              onChange={(e) => setResistance1(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Resistor 2 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Resistencia R2 (Carga B):</span>
              <span className="text-white font-bold">{resistance2.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20.0"
              step="0.5"
              value={resistance2}
              onChange={(e) => setResistance2(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 space-y-1">
            <div className="text-zinc-300 font-bold uppercase text-[10px]">Fórmulas Aplicadas:</div>
            <div>{circuitTopology === 'SERIES' ? 'R_eq = R1 + R2' : '1/R_eq = 1/R1 + 1/R2'}</div>
            <div>I = V / R_eq = {currentTotal.toFixed(2)} Amperios</div>
            <div>P = V × I = {powerTotal.toFixed(2)} Watts</div>
          </div>
        </div>

        {/* Meters and Visualization Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">VOLTAJE TOTAL</span>
              <span className="text-2xl font-mono font-black text-yellow-400">{voltage.toFixed(1)} V</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Diferencia de potencial</span>
            </div>

            <div className="bg-black/60 border border-zinc-800 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">CORRIENTE TOTAL</span>
              <span className="text-2xl font-mono font-black text-cyan-400">{currentTotal.toFixed(2)} A</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Flujo de electrones</span>
            </div>

            <div className="bg-black/60 border border-zinc-800 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">RESISTENCIA EQUIVALENTE</span>
              <span className="text-2xl font-mono font-black text-white">{req.toFixed(2)} Ω</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Oposición al paso</span>
            </div>

            <div className="bg-black/60 border border-zinc-800 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">POTENCIA CONSUMIDA</span>
              <span className="text-2xl font-mono font-black text-amber-400">{powerTotal.toFixed(1)} W</span>
              <span className="text-[10px] font-mono text-zinc-500 block">Energía por segundo</span>
            </div>
          </div>

          {/* Interactive Circuit Schematic Representation */}
          <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <span className="font-mono text-xs uppercase font-bold text-zinc-300">
                ESQUEMA DEL CIRCUITO: TOPOLOGÍA EN {circuitTopology}
              </span>
              <span className="font-mono text-xs text-zinc-500">
                Riel ATX: {voltage.toFixed(1)}V
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch 1 */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-cyan-400 font-bold uppercase">RAMA R1 ({resistance1} Ω)</span>
                  <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                    {circuitTopology === 'SERIES' ? 'Misma Corriente' : 'Misma Tensión'}
                  </span>
                </div>
                <div className="font-mono text-sm space-y-1 text-zinc-300">
                  <div>Caída de Tensión: <strong className="text-white">{vDrop1.toFixed(2)} V</strong></div>
                  <div>Intensidad: <strong className="text-cyan-300">{current1.toFixed(2)} A</strong></div>
                  <div>Calor Disipado (Joule): <strong className="text-amber-300">{power1.toFixed(1)} W</strong></div>
                </div>
              </div>

              {/* Branch 2 */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-cyan-400 font-bold uppercase">RAMA R2 ({resistance2} Ω)</span>
                  <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                    {circuitTopology === 'SERIES' ? 'Divisor de Tensión' : 'Divisor de Corriente'}
                  </span>
                </div>
                <div className="font-mono text-sm space-y-1 text-zinc-300">
                  <div>Caída de Tensión: <strong className="text-white">{vDrop2.toFixed(2)} V</strong></div>
                  <div>Intensidad: <strong className="text-cyan-300">{current2.toFixed(2)} A</strong></div>
                  <div>Calor Disipado (Joule): <strong className="text-amber-300">{power2.toFixed(1)} W</strong></div>
                </div>
              </div>
            </div>

            {/* Heat & Thermal Dissipation Bar */}
            <div className="mt-5 space-y-2 pt-3 border-t border-zinc-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Efecto Joule en Pistas y Fases VRM (Q = I²·R):
                </span>
                <span className="text-orange-400 font-bold">{powerTotal.toFixed(1)} Joules/seg (Watts)</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-300"
                  style={{ width: `${Math.max(5, thermalIntensity)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-sans leading-relaxed">
            <strong className="font-mono text-yellow-400">Conexión con el Hardware Real:</strong> Los procesadores modernos demandan más de 150 Amperios a tan solo 1.2 Voltios. Para evitar que las pistas de cobre de la placa madre se fundan por la Ley de Joule (I²·R), la fuente de alimentación envía la energía a 12V con menor amperaje, y el VRM (módulo regulador de voltaje) reduce la tensión junto al socket de la CPU.
          </div>
        </div>
      </div>
    </div>
  );
};
