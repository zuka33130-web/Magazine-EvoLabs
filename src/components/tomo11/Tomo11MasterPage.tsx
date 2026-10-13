import React, { useState } from 'react';
import { EvoTechnicalTomeReader } from '../tomes/EvoTechnicalTomeReader';
import { TOMO_11_META, TOMO_11_CHAPTERS, TOMO_11_CASE_STUDIES, TOMO_11_GLOSSARY } from '../../data/tomo11Data';
import { Activity, Zap, CheckCircle2, AlertTriangle, Play, RotateCcw, Wrench, Sparkles, X } from 'lucide-react';

interface Tomo11MasterPageProps {
  onBack?: () => void;
}

export const Tomo11MasterPage: React.FC<Tomo11MasterPageProps> = ({ onBack }) => {
  const [showLabHub, setShowLabHub] = useState(false);
  const [activeLabTab, setActiveLabTab] = useState<'multimeter' | 'ohms' | 'diagnosis' | 'catalog'>('multimeter');

  // LAB 1: Multimeter State
  const [meterMode, setMeterMode] = useState<'voltage' | 'resistance' | 'diode' | 'continuity'>('voltage');
  const [selectedProbePoint, setSelectedProbePoint] = useState<'12v_rail' | '5v_sb' | '3v3_sb' | 'vcore' | 'shorted_cap'>('12v_rail');

  // LAB 2: Ohm's Law State
  const [voltage, setVoltage] = useState<number>(12);
  const [resistance, setResistance] = useState<number>(4);

  // LAB 3: Fault Diagnosis State
  const [selectedCircuit, setSelectedCircuit] = useState<'standby' | 'vcore_phase' | 'ram_vddq'>('standby');
  const [injectedSignal, setInjectedSignal] = useState<boolean>(false);

  // Calculations
  const current = resistance > 0 ? (voltage / resistance) : 0;
  const power = voltage * current;

  const probeValues = {
    '12v_rail': { voltage: '12.08 V', resistance: '14.2 kΩ', diode: '0.520 V', continuity: false, label: 'Línea +12V ATX' },
    '5v_sb': { voltage: '5.02 V', resistance: '8.4 kΩ', diode: '0.485 V', continuity: false, label: 'Línea +5VSB Standby' },
    '3v3_sb': { voltage: '3.31 V', resistance: '2.8 kΩ', diode: '0.440 V', continuity: false, label: 'Línea +3.3VSB Standby' },
    'vcore': { voltage: '1.14 V', resistance: '0.8 Ω', diode: '0.012 V', continuity: true, label: 'Riel VCore CPU (Baja Impedancia)' },
    'shorted_cap': { voltage: '0.02 V', resistance: '0.1 Ω', diode: '0.001 V', continuity: true, label: 'Capacitor MLCC C412 (EN CORTO)' },
  };

  const currentProbe = probeValues[selectedProbePoint];

  return (
    <>
      <EvoTechnicalTomeReader
        tomeId="tomo-11"
        meta={TOMO_11_META}
        chapters={TOMO_11_CHAPTERS}
        cases={TOMO_11_CASE_STUDIES}
        glossary={TOMO_11_GLOSSARY}
        sources={TOMO_11_META.sources}
        themeColor={TOMO_11_META.themeColor}
        onBack={onBack}
        customLabAction={{
          label: 'ELECTRONICS LAB HUB',
          onClick: () => setShowLabHub(true),
        }}
      />

      {/* ELECTRONICS LAB HUB MODAL */}
      {showLabHub && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md p-4 overflow-y-auto flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="max-w-5xl w-full bg-[#090c14] border border-amber-500/40 rounded-2xl p-6 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-lg text-white uppercase tracking-wide">
                    ELECTRONICS LAB HUB // TOMO 11
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    BANCOS PERICIALES DE ELECTRÓNICA APLICADA & METROLOGÍA DE HARDWARE
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLabHub(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 text-xs font-mono"
              >
                CERRAR
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'multimeter', label: '1. VIRTUAL MULTIMETER (ACTIVO)' },
                { id: 'ohms', label: "2. OHM'S LAW BENCH (ACTIVO)" },
                { id: 'diagnosis', label: '3. FAULT DIAGNOSIS BENCH (ACTIVO)' },
                { id: 'catalog', label: 'OTROS BANCOS (CATÁLOGO)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveLabTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeLabTab === tab.id
                      ? 'bg-amber-400 text-black shadow-lg'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* LAB 1: Virtual Multimeter */}
            {activeLabTab === 'multimeter' && (
              <div className="p-6 rounded-2xl bg-[#06080e] border border-zinc-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-amber-300 font-mono flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>BANCO 01 // MULTÍMETRO DIGITAL PERICIAL & PUNTAS DE PRUEBA</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    ESTADO: SIMULACIÓN PRECISA 6000 CUENTAS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Multimeter Display Screen */}
                  <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between items-center space-y-4">
                    <div className="w-full bg-[#182018] p-4 rounded-xl border border-emerald-950/80 font-mono text-center space-y-1">
                      <div className="text-[10px] text-emerald-400/70 tracking-widest uppercase">
                        AUTO RANGE // TRUE RMS // {meterMode.toUpperCase()}
                      </div>
                      <div className="text-4xl font-black text-emerald-400 tracking-wider">
                        {meterMode === 'voltage' && currentProbe.voltage}
                        {meterMode === 'resistance' && currentProbe.resistance}
                        {meterMode === 'diode' && currentProbe.diode}
                        {meterMode === 'continuity' && (currentProbe.continuity ? 'BEEP! (0.0 Ω)' : 'OPEN')}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        SONDA EN: {currentProbe.label}
                      </div>
                    </div>

                    {/* Mode Selector */}
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {[
                        { id: 'voltage', label: 'VOLTAJE DC (V)' },
                        { id: 'resistance', label: 'RESISTENCIA (Ω)' },
                        { id: 'diode', label: 'MODO DIODO (V)' },
                        { id: 'continuity', label: 'CONTINUIDAD (BEEP)' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMeterMode(m.id as any)}
                          className={`p-2 rounded-lg text-xs font-mono font-bold transition-all ${
                            meterMode === m.id
                              ? 'bg-amber-400 text-black'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Probe Points Selector */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-zinc-400 font-bold uppercase">
                      SELECCIONAR PUNTO DE MEDICIÓN EN LA PLACA:
                    </div>
                    {Object.entries(probeValues).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedProbePoint(key as any)}
                        className={`w-full text-left p-3 rounded-xl border font-mono text-xs transition-all flex items-center justify-between ${
                          selectedProbePoint === key
                            ? 'bg-amber-950/30 border-amber-500 text-amber-200'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                        }`}
                      >
                        <span>{val.label}</span>
                        <span className="text-[10px] opacity-70">
                          {meterMode === 'voltage' ? val.voltage : val.resistance}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LAB 2: Ohm's Law Bench */}
            {activeLabTab === 'ohms' && (
              <div className="p-6 rounded-2xl bg-[#06080e] border border-zinc-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-amber-300 font-mono flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>BANCO 02 // CALCULADOR & SIMULADOR DE LEY DE OHM ($V = I \cdot R$ y $P = V \cdot I$)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">
                        VOLTAJE DE ENTRADA (V): {voltage} V
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="24"
                        step="0.5"
                        value={voltage}
                        onChange={(e) => setVoltage(parseFloat(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">
                        RESISTENCIA DE CARGA (Ω): {resistance} Ω
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="20"
                        step="0.1"
                        value={resistance}
                        onChange={(e) => setResistance(parseFloat(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 gap-4 font-mono text-center">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 uppercase">INTENSIDAD (I)</div>
                      <div className="text-2xl font-black text-cyan-400">{current.toFixed(2)} A</div>
                      <div className="text-[10px] text-zinc-500">I = V / R</div>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 uppercase">POTENCIA TÉRMICA (P)</div>
                      <div className="text-2xl font-black text-amber-400">{power.toFixed(2)} W</div>
                      <div className="text-[10px] text-zinc-500">P = V · I</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LAB 3: Fault Diagnosis Bench */}
            {activeLabTab === 'diagnosis' && (
              <div className="p-6 rounded-2xl bg-[#06080e] border border-zinc-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-amber-300 font-mono flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    <span>BANCO 03 // BANCO DE DIAGNÓSTICO DE FALLAS & POWER SEQUENCE</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCircuit('standby')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                        selectedCircuit === 'standby' ? 'bg-amber-400 text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      CASO A: STANDBY COLAPSADO
                    </button>
                    <button
                      onClick={() => setSelectedCircuit('vcore_phase')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                        selectedCircuit === 'vcore_phase' ? 'bg-amber-400 text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      CASO B: FASE VCORE EN CORTO
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs">
                    <div className="text-zinc-300">
                      <strong>DIAGNÓSTICO EN CURSO:</strong>{' '}
                      {selectedCircuit === 'standby'
                        ? 'El riel +3.3VSB mide 0.1V. La resistencia a tierra es de 0.4 Ω. Causa: Capacitor MLCC C412 perforado.'
                        : 'El riel VCore mide 12V directos en la bobina. Causa: High-Side MOSFET perforado por sobretensión.'}
                    </div>

                    <button
                      onClick={() => setInjectedSignal(!injectedSignal)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-black font-bold text-xs cursor-pointer shadow-lg"
                    >
                      {injectedSignal ? '✓ COMPONENTE REEMPLAZADO (SISTEMA SANADO)' : '⚡ REEMPLAZAR COMPONENTE DEFECTUOSO'}
                    </button>

                    {injectedSignal && (
                      <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs">
                        ✓ VEREDICTO: La resistencia a tierra subió a 4.2 kΩ. El riel estabilizó su tensión nominal.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Catalog of other labs */}
            {activeLabTab === 'catalog' && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-zinc-400">
                  ESTADO DE LABORATORIOS DE HARDWARE // TOMO 11:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: '4. OSCILLOSCOPE PWM BENCH', status: 'IN DEVELOPMENT' },
                    { name: '5. THERMAL INJECTION IMAGER', status: 'IN DEVELOPMENT' },
                    { name: '6. DRMOS SWITCHING ANALYZER', status: 'IN DEVELOPMENT' },
                    { name: '7. POWER SEQUENCE LOGIC TRACER', status: 'IN DEVELOPMENT' },
                  ].map((lab, i) => (
                    <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                      <span className="font-mono text-xs text-zinc-300">{lab.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-amber-400 border border-amber-500/30">
                        {lab.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
