import React, { useState } from 'react';
import { Gamepad2, Award, Zap, CheckCircle2, AlertTriangle, RefreshCw, BookOpen, ChevronDown, ChevronUp, Sliders, ArrowRight } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

interface Stage {
  id: number;
  title: string;
  targetDescription: string;
  targetMaxLatencyNs: number;
  targetMinBandwidthGbs: number;
  maxVoltageV: number;
  defaultSpeedMts: number;
  defaultTcl: number;
  defaultVoltage: number;
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Nivel 1: Sintonización DDR4 para eSports',
    targetDescription: 'Lográ una latencia absoluta menor a 10.0 ns con al menos 45 GB/s de ancho de banda.',
    targetMaxLatencyNs: 10.0,
    targetMinBandwidthGbs: 45.0,
    maxVoltageV: 1.40,
    defaultSpeedMts: 3000,
    defaultTcl: 18,
    defaultVoltage: 1.35,
  },
  {
    id: 2,
    title: 'Nivel 2: Sweet Spot DDR5 (6000 MT/s)',
    targetDescription: 'Alcanzá al menos 85 GB/s de ancho de banda con una latencia de 10.5 ns o menor.',
    targetMaxLatencyNs: 10.5,
    targetMinBandwidthGbs: 85.0,
    maxVoltageV: 1.38,
    defaultSpeedMts: 5600,
    defaultTcl: 36,
    defaultVoltage: 1.25,
  },
  {
    id: 3,
    title: 'Nivel 3: Ajuste Fino de Entusiasta',
    targetDescription: 'Superá los 100 GB/s de ancho de banda manteniendo la latencia en 9.5 ns o menos, con voltaje seguro (≤ 1.42V).',
    targetMaxLatencyNs: 9.5,
    targetMinBandwidthGbs: 100.0,
    maxVoltageV: 1.42,
    defaultSpeedMts: 6400,
    defaultTcl: 34,
    defaultVoltage: 1.35,
  },
];

export const MemoryMatchGame: React.FC = () => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const stage = STAGES[currentStageIdx];

  const [speedMts, setSpeedMts] = useState<number>(stage.defaultSpeedMts);
  const [tcl, setTcl] = useState<number>(stage.defaultTcl);
  const [voltage, setVoltage] = useState<number>(stage.defaultVoltage);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Exact calculations
  const latencyNs = (tcl * 2000) / speedMts;
  const bandwidthGbs = (speedMts * 8 * 2) / 1000; // Dual channel

  // Success criteria
  const isLatencyMet = latencyNs <= stage.targetMaxLatencyNs;
  const isBandwidthMet = bandwidthGbs >= stage.targetMinBandwidthGbs;
  const isVoltageSafe = voltage <= stage.maxVoltageV;
  const isStageWon = isLatencyMet && isBandwidthMet && isVoltageSafe;

  const handleSelectStage = (idx: number) => {
    setCurrentStageIdx(idx);
    const s = STAGES[idx];
    setSpeedMts(s.defaultSpeedMts);
    setTcl(s.defaultTcl);
    setVoltage(s.defaultVoltage);
  };

  const handleReset = () => {
    setSpeedMts(stage.defaultSpeedMts);
    setTcl(stage.defaultTcl);
    setVoltage(stage.defaultVoltage);
  };

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                JUEGO TÉCNICO // OPTIMIZACIÓN DE SILICIO
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Física de Buses de Memoria / tCL JEDEC" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              SILICON MEMORY MATCH: DESAFÍO DE SUBTIMINGS
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Equilibrá velocidad de transferencia (MT/s) y latencia CAS (tCL) para cumplir con las exigencias metrológicas de cada escenario sin superar los límites de voltaje seguro.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showGuide ? 'OCULTAR GUÍA' : '¿CÓMO SE JUEGA?'}</span>
              {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <div className="flex items-center gap-1 font-mono text-xs">
              {STAGES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectStage(idx)}
                  className={`w-8 h-8 rounded-lg border font-bold transition-all cursor-pointer ${
                    currentStageIdx === idx
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guía de Juego */}
      {showGuide && (
        <div className="border border-amber-500/30 bg-amber-950/20 rounded-xl p-5 space-y-3 font-sans text-xs text-zinc-300">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-amber-400">
            <Gamepad2 className="w-4 h-4" />
            <span>CÓMO JUGAR Y DOMINAR ESTE RETO TÉCNICO</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-zinc-300">
            <li>
              <strong className="text-white font-mono">Regla 1 (El Balance de Silicio):</strong> Al subir la frecuencia (MT/s) ganás ancho de banda, pero si el tCL es demasiado alto, la latencia en nanosegundos empeorará.
            </li>
            <li>
              <strong className="text-white font-mono">Regla 2 (Límites de Voltaje):</strong> Aumentar el voltaje te permite estabilizar frecuencias mayores, pero si excedes el voltaje máximo permitido por nivel, el chip sufrirá degradación por electromigración y fallará la prueba.
            </li>
            <li>
              <strong className="text-white font-mono">Cómo Ganar:</strong> Ajustá los tres controles hasta que los tres indicadores de la derecha se pongan en verde al mismo tiempo.
            </li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              PANEL DE OVERCLOCK Y TIMINGS
            </h3>
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
              title="Reiniciar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* MT/s */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Velocidad (MT/s):</span>
              <span className="text-amber-400 font-bold">{speedMts} MT/s</span>
            </div>
            <input
              type="range"
              min="2400"
              max="7600"
              step="200"
              value={speedMts}
              onChange={(e) => setSpeedMts(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* tCL */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Latencia CAS (tCL):</span>
              <span className="text-cyan-400 font-bold">CL{tcl}</span>
            </div>
            <input
              type="range"
              min="12"
              max="42"
              step="2"
              value={tcl}
              onChange={(e) => setTcl(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Voltage */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Voltaje VDDQ (V):</span>
              <span className={`font-bold ${voltage > stage.maxVoltageV ? 'text-red-400' : 'text-emerald-400'}`}>
                {voltage.toFixed(2)} V (Máx: {stage.maxVoltageV.toFixed(2)}V)
              </span>
            </div>
            <input
              type="range"
              min="1.10"
              max="1.50"
              step="0.01"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Goals & Status Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                OBJETIVO DEL {stage.title}
              </span>
              <p className="text-sm text-zinc-200 mt-1">{stage.targetDescription}</p>
            </div>

            {/* Checklist of 3 conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className={`p-3 rounded-xl border space-y-1 ${isLatencyMet ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' : 'bg-red-950/20 border-red-500/30 text-red-300'}`}>
                <span className="text-[10px] font-mono uppercase block font-bold">LATENCIA MÁXIMA</span>
                <div className="text-xl font-mono font-black">{latencyNs.toFixed(2)} ns</div>
                <div className="text-[10px] font-mono">Meta: ≤ {stage.targetMaxLatencyNs} ns</div>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${isBandwidthMet ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' : 'bg-red-950/20 border-red-500/30 text-red-300'}`}>
                <span className="text-[10px] font-mono uppercase block font-bold">ANCHO DE BANDA MÍNIMO</span>
                <div className="text-xl font-mono font-black">{bandwidthGbs.toFixed(1)} GB/s</div>
                <div className="text-[10px] font-mono">Meta: ≥ {stage.targetMinBandwidthGbs} GB/s</div>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${isVoltageSafe ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' : 'bg-red-950/20 border-red-500/30 text-red-300'}`}>
                <span className="text-[10px] font-mono uppercase block font-bold">VOLTAJE SEGURO</span>
                <div className="text-xl font-mono font-black">{voltage.toFixed(2)} V</div>
                <div className="text-[10px] font-mono">Límite: ≤ {stage.maxVoltageV.toFixed(2)} V</div>
              </div>
            </div>

            {/* Winning banner */}
            {isStageWon && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="font-mono text-sm font-bold text-white uppercase">
                      ¡CONFIGURACIÓN ESTABLE Y HOMOLOGADA!
                    </h4>
                    <p className="text-xs text-emerald-300/80">
                      Cumpliste con todos los requisitos de latencia, ancho de banda y seguridad de silicio.
                    </p>
                  </div>
                </div>
                {currentStageIdx < STAGES.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleSelectStage(currentStageIdx + 1)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <span>SIGUIENTE NIVEL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
