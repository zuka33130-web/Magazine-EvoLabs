import React, { useState } from 'react';
import { Cpu, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Lightbulb, Zap } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR';

interface Level {
  id: number;
  title: string;
  scenario: string;
  availableGates: GateType[];
  targetTruthTable: Array<{
    inputs: { a: number; b: number };
    expectedOut: number;
  }>;
  hint: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Nivel 1: La Compuerta de Seguridad',
    scenario: 'El sistema debe activarse SOLO si la señal A está encendida y la señal B está apagada (A = 1, B = 0).',
    availableGates: ['AND', 'OR', 'NOT', 'XOR'],
    targetTruthTable: [
      { inputs: { a: 0, b: 0 }, expectedOut: 0 },
      { inputs: { a: 0, b: 1 }, expectedOut: 0 },
      { inputs: { a: 1, b: 0 }, expectedOut: 1 },
      { inputs: { a: 1, b: 1 }, expectedOut: 0 },
    ],
    hint: 'Invertí la señal B usando NOT antes de combinarla con A usando AND.',
  },
  {
    id: 2,
    title: 'Nivel 2: Medio Sumador (Half Adder - Bit de Suma)',
    scenario: 'Diseñá la salida del bit de suma: debe dar 1 si una y solo una de las entradas está encendida.',
    availableGates: ['AND', 'OR', 'XOR', 'NAND'],
    targetTruthTable: [
      { inputs: { a: 0, b: 0 }, expectedOut: 0 },
      { inputs: { a: 0, b: 1 }, expectedOut: 1 },
      { inputs: { a: 1, b: 0 }, expectedOut: 1 },
      { inputs: { a: 1, b: 1 }, expectedOut: 0 },
    ],
    hint: 'La compuerta XOR (OR Exclusivo) genera un 1 exactamente cuando las dos entradas son distintas.',
  },
  {
    id: 3,
    title: 'Nivel 3: Detector de Coincidencia (XNOR)',
    scenario: 'El circuito debe validar que A y B sean estrictamente idénticas (ambas 0 o ambas 1).',
    availableGates: ['AND', 'OR', 'NOT', 'XOR', 'NOR'],
    targetTruthTable: [
      { inputs: { a: 0, b: 0 }, expectedOut: 1 },
      { inputs: { a: 0, b: 1 }, expectedOut: 0 },
      { inputs: { a: 1, b: 0 }, expectedOut: 0 },
      { inputs: { a: 1, b: 1 }, expectedOut: 1 },
    ],
    hint: 'Podés negar la salida de un XOR usando una compuerta NOT.',
  },
  {
    id: 4,
    title: 'Nivel 4: El Acarreo del Sumador (Carry Bit)',
    scenario: 'El bit de acarreo se enciende únicamente cuando ambas entradas están a 1 (1 + 1 = 10 binario).',
    availableGates: ['AND', 'OR', 'NOT', 'XOR', 'NAND'],
    targetTruthTable: [
      { inputs: { a: 0, b: 0 }, expectedOut: 0 },
      { inputs: { a: 0, b: 1 }, expectedOut: 0 },
      { inputs: { a: 1, b: 0 }, expectedOut: 0 },
      { inputs: { a: 1, b: 1 }, expectedOut: 1 },
    ],
    hint: 'La compuerta AND requiere que todas sus entradas sean simultáneamente verdaderas.',
  },
];

export const LogicFactoryGame: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [gate1, setGate1] = useState<GateType>('AND');
  const [invertB, setInvertB] = useState<boolean>(false);
  const [invertOutput, setInvertOutput] = useState<boolean>(false);
  const [testInputA, setTestInputA] = useState<number>(1);
  const [testInputB, setTestInputB] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  const level = LEVELS[currentLevelIdx];

  // Evaluate circuit logic
  const evaluateCircuit = (a: number, b: number, g1: GateType, invB: boolean, invOut: boolean): number => {
    const finalB = invB ? (b === 1 ? 0 : 1) : b;
    let res = 0;

    switch (g1) {
      case 'AND':
        res = a && finalB ? 1 : 0;
        break;
      case 'OR':
        res = a || finalB ? 1 : 0;
        break;
      case 'XOR':
        res = a !== finalB ? 1 : 0;
        break;
      case 'NAND':
        res = !(a && finalB) ? 1 : 0;
        break;
      case 'NOR':
        res = !(a || finalB) ? 1 : 0;
        break;
      case 'NOT':
        res = a === 0 ? 1 : 0;
        break;
    }

    if (invOut) {
      res = res === 1 ? 0 : 1;
    }

    return res;
  };

  // Test current configuration against all truth table rows
  const truthTableStatus = level.targetTruthTable.map((row) => {
    const actualOut = evaluateCircuit(row.inputs.a, row.inputs.b, gate1, invertB, invertOutput);
    return {
      ...row,
      actualOut,
      passed: actualOut === row.expectedOut,
    };
  });

  const allPassed = truthTableStatus.every((r) => r.passed);

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                JUEGO TÉCNICO // PUZZLE LÓGICO
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Álgebra de Boole" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              LOGIC FACTORY: FÁBRICA DE COMPUERTAS BOOLEANAS
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Configurá y conectá compuertas lógicas digitales para satisfacer las tablas de verdad de hardware que componen la ALU y los circuitos de silicio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {LEVELS.map((lvl, idx) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  setCurrentLevelIdx(idx);
                  setShowHint(false);
                }}
                className={`w-8 h-8 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                  currentLevelIdx === idx
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                {lvl.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                  MISIÓN DE INGENIERÍA
                </span>
                <h3 className="font-mono-tech text-base font-bold text-white">
                  {level.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-xs font-mono text-amber-400 hover:underline cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Ocultar Pista' : 'Ver Pista'}</span>
              </button>
            </div>

            <p className="text-sm text-zinc-300 font-sans leading-relaxed">
              {level.scenario}
            </p>

            {showHint && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-mono text-amber-300">
                💡 Pista: {level.hint}
              </div>
            )}

            {/* Circuit Workbench */}
            <div className="p-6 bg-black/60 border border-zinc-800 rounded-xl space-y-6">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                PANEL DE CONEXIONES LÓGICAS
              </span>

              {/* Interactive Wiring Representation */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {/* Inputs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-400 w-8">Ent A:</span>
                    <button
                      type="button"
                      onClick={() => setTestInputA(testInputA === 1 ? 0 : 1)}
                      className={`w-10 h-8 rounded font-mono text-xs font-bold border cursor-pointer ${
                        testInputA === 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                      }`}
                    >
                      {testInputA}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-400 w-8">Ent B:</span>
                    <button
                      type="button"
                      onClick={() => setTestInputB(testInputB === 1 ? 0 : 1)}
                      className={`w-10 h-8 rounded font-mono text-xs font-bold border cursor-pointer ${
                        testInputB === 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                      }`}
                    >
                      {testInputB}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvertB(!invertB)}
                      className={`px-2 py-1 rounded text-[10px] font-mono border cursor-pointer ${
                        invertB ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {invertB ? 'NOT [B] ACTIVO' : '+ INVERSOR NOT'}
                    </button>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-zinc-600 hidden sm:block" />

                {/* Gate Selector */}
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">COMPUERTA</span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {level.availableGates.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGate1(g)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                          gate1 === g
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/40'
                            : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-zinc-600 hidden sm:block" />

                {/* Output Inverter Toggle & Output Display */}
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">SALIDA</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvertOutput(!invertOutput)}
                      className={`px-2 py-1 rounded text-[10px] font-mono border cursor-pointer ${
                        invertOutput ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                      }`}
                    >
                      {invertOutput ? 'NOT FINAL' : '+ NOT OUT'}
                    </button>
                    <div
                      className={`w-12 h-10 rounded-lg flex items-center justify-center font-mono text-lg font-black border ${
                        evaluateCircuit(testInputA, testInputB, gate1, invertB, invertOutput) === 1
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-black/60 border-zinc-800 text-zinc-600'
                      }`}
                    >
                      {evaluateCircuit(testInputA, testInputB, gate1, invertB, invertOutput)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success state */}
            {allPassed && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="font-mono text-sm font-bold text-white uppercase">
                      ¡CIRCUITO COMPROBADO Y VALIDADO!
                    </h4>
                    <p className="text-xs text-emerald-300/80">
                      Cumpliste con el 100% de la tabla de verdad requerida.
                    </p>
                  </div>
                </div>
                {currentLevelIdx < LEVELS.length - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLevelIdx((i) => i + 1);
                      setShowHint(false);
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase rounded-lg cursor-pointer"
                  >
                    SIGUIENTE NIVEL →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Truth Table Verification Column */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              TABLA DE VERDAD CANÓNICA
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">4 Estados</span>
          </div>

          <div className="space-y-2">
            {truthTableStatus.map((row, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border font-mono text-xs flex items-center justify-between ${
                  row.passed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-red-950/20 border-red-500/30 text-red-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">A={row.inputs.a} B={row.inputs.b}</span>
                  <span className="text-zinc-600">→</span>
                  <span>Esperado: <strong className="text-white">{row.expectedOut}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Obtenido: {row.actualOut}</span>
                  {row.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-400 font-sans leading-relaxed">
            <strong className="font-mono text-cyan-400">Teorema de De Morgan:</strong> Toda función lógica compleja puede construirse combinando compuertas básicas (o únicamente compuertas universales NAND). Así se fabrican físicamente los chips de silicio con miles de millones de transistores en una oblea.
          </div>
        </div>
      </div>
    </div>
  );
};
