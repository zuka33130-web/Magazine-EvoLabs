import React, { useState } from 'react';
import { Cpu, Play, RotateCcw, Award, CheckCircle2, AlertCircle, ArrowRight, Star } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

interface CpuMission {
  id: number;
  title: string;
  brief: string;
  initialRegA: number;
  initialRegB: number;
  initialRegC: number;
  targetRegA: number;
  maxCycles: number;
  optimalCycles: number;
}

const MISSIONS: CpuMission[] = [
  {
    id: 1,
    title: 'Misión 1: Duplicación sin Multiplicador',
    brief: 'Los CPUs tempranos no tenían circuito multiplicador. Lográ que el Registro A valga el doble de su valor inicial (debe quedar en 16).',
    initialRegA: 8,
    initialRegB: 0,
    initialRegC: 0,
    targetRegA: 16,
    maxCycles: 5,
    optimalCycles: 2,
  },
  {
    id: 2,
    title: 'Misión 2: Intercambio de Registros (Swap)',
    brief: 'El valor de A (12) debe pasar a B, y el valor original de B (4) debe terminar en A, usando el registro auxiliar C.',
    initialRegA: 12,
    initialRegB: 4,
    initialRegC: 0,
    targetRegA: 4,
    maxCycles: 6,
    optimalCycles: 3,
  },
  {
    id: 3,
    title: 'Misión 3: Resta y Compensación',
    brief: 'A vale 30 y B vale 18. Obtené en el Registro A exactamente la diferencia (12) y luego sumale 3 de compensación (resultado final: 15).',
    initialRegA: 30,
    initialRegB: 18,
    initialRegC: 0,
    targetRegA: 15,
    maxCycles: 6,
    optimalCycles: 2,
  },
];

type InstructionCommand =
  | { op: 'MOV_LITERAL'; reg: 'A' | 'B' | 'C'; val: number }
  | { op: 'MOV_REG'; dest: 'A' | 'B' | 'C'; src: 'A' | 'B' | 'C' }
  | { op: 'ADD'; dest: 'A'; src: 'A' | 'B' | 'C' }
  | { op: 'SUB'; dest: 'A'; src: 'B' | 'C' };

export const CpuMissionGame: React.FC = () => {
  const [currentMissionIdx, setCurrentMissionIdx] = useState<number>(0);
  const mission = MISSIONS[currentMissionIdx];

  // User program instruction list
  const [program, setProgram] = useState<InstructionCommand[]>([]);
  const [regA, setRegA] = useState<number>(mission.initialRegA);
  const [regB, setRegB] = useState<number>(mission.initialRegB);
  const [regC, setRegC] = useState<number>(mission.initialRegC);
  const [executionState, setExecutionState] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [cyclesUsed, setCyclesUsed] = useState<number>(0);

  // Reset to initial state of current mission
  const resetMission = () => {
    setProgram([]);
    setRegA(mission.initialRegA);
    setRegB(mission.initialRegB);
    setRegC(mission.initialRegC);
    setExecutionState('IDLE');
    setCyclesUsed(0);
  };

  const handleSelectMission = (idx: number) => {
    setCurrentMissionIdx(idx);
    const m = MISSIONS[idx];
    setProgram([]);
    setRegA(m.initialRegA);
    setRegB(m.initialRegB);
    setRegC(m.initialRegC);
    setExecutionState('IDLE');
    setCyclesUsed(0);
  };

  // Add instruction to program
  const addInstruction = (cmd: InstructionCommand) => {
    if (program.length >= mission.maxCycles) return;
    setProgram((prev) => [...prev, cmd]);
    setExecutionState('IDLE');
  };

  // Run the assembled program step-by-step
  const runProgram = () => {
    let a = mission.initialRegA;
    let b = mission.initialRegB;
    let c = mission.initialRegC;

    for (const cmd of program) {
      if (cmd.op === 'MOV_LITERAL') {
        if (cmd.reg === 'A') a = cmd.val;
        if (cmd.reg === 'B') b = cmd.val;
        if (cmd.reg === 'C') c = cmd.val;
      } else if (cmd.op === 'MOV_REG') {
        const val = cmd.src === 'A' ? a : cmd.src === 'B' ? b : c;
        if (cmd.dest === 'A') a = val;
        if (cmd.dest === 'B') b = val;
        if (cmd.dest === 'C') c = val;
      } else if (cmd.op === 'ADD') {
        const val = cmd.src === 'A' ? a : cmd.src === 'B' ? b : c;
        a += val;
      } else if (cmd.op === 'SUB') {
        const val = cmd.src === 'B' ? b : c;
        a -= val;
      }
    }

    setRegA(a);
    setRegB(b);
    setRegC(c);
    setCyclesUsed(program.length);

    if (a === mission.targetRegA) {
      setExecutionState('SUCCESS');
    } else {
      setExecutionState('FAILED');
    }
  };

  const starsEarned =
    executionState === 'SUCCESS'
      ? cyclesUsed <= mission.optimalCycles
        ? 3
        : cyclesUsed <= mission.optimalCycles + 1
        ? 2
        : 1
      : 0;

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400">
                JUEGO TÉCNICO // RETO DE ENSAMBLADOR
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Simulador Determinista de Set de Instrucciones" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              CPU MISSION: CONTROL DE REGISTROS Y CICLOS
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Escribí instrucciones de microcódigo elementales para resolver problemas de cómputo en el menor número de ciclos de reloj posibles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {MISSIONS.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMission(idx)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                  currentMissionIdx === idx
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                Misión {m.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instruction Palette Column */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              INSTRUCCIONES DISPONIBLES
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">
              {program.length}/{mission.maxCycles} Ciclos
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            Hacé clic para agregar instrucciones al búfer de ejecución:
          </p>

          <div className="space-y-2">
            {/* MOV REG to REG */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => addInstruction({ op: 'MOV_REG', dest: 'C', src: 'A' })}
                className="p-2 rounded bg-black/40 border border-zinc-700 hover:border-purple-400 text-xs font-mono text-zinc-300 text-left cursor-pointer"
              >
                MOV C, A
              </button>
              <button
                type="button"
                onClick={() => addInstruction({ op: 'MOV_REG', dest: 'A', src: 'B' })}
                className="p-2 rounded bg-black/40 border border-zinc-700 hover:border-purple-400 text-xs font-mono text-zinc-300 text-left cursor-pointer"
              >
                MOV A, B
              </button>
              <button
                type="button"
                onClick={() => addInstruction({ op: 'MOV_REG', dest: 'B', src: 'C' })}
                className="p-2 rounded bg-black/40 border border-zinc-700 hover:border-purple-400 text-xs font-mono text-zinc-300 text-left cursor-pointer"
              >
                MOV B, C
              </button>
              <button
                type="button"
                onClick={() => addInstruction({ op: 'MOV_REG', dest: 'B', src: 'A' })}
                className="p-2 rounded bg-black/40 border border-zinc-700 hover:border-purple-400 text-xs font-mono text-zinc-300 text-left cursor-pointer"
              >
                MOV B, A
              </button>
            </div>

            {/* Arithmetic */}
            <div className="grid grid-cols-2 gap-1.5 pt-2">
              <button
                type="button"
                onClick={() => addInstruction({ op: 'ADD', dest: 'A', src: 'A' })}
                className="p-2 rounded bg-black/40 border border-zinc-700 hover:border-purple-400 text-xs font-mono text-zinc-300 text-left cursor-pointer"
              >
                ADD A, A
              </button>
              <button
                type="button"
                onClick={() => addInstruction({ op: 'ADD', dest: 'A', src: 'B' })}
                className="p-2 rounded bg-black/40 border border-zinc-700 hover:border-purple-400 text-xs font-mono text-zinc-300 text-left cursor-pointer"
              >
                ADD A, B
              </button>
              <button
                type="button"
                onClick={() => addInstruction({ op: 'SUB', dest: 'A', src: 'B' })}
                className="p-2 rounded bg-black/40 border border-zinc-700 hover:border-purple-400 text-xs font-mono text-zinc-300 text-left cursor-pointer"
              >
                SUB A, B
              </button>
              <button
                type="button"
                onClick={() => addInstruction({ op: 'MOV_LITERAL', reg: 'A', val: 3 })}
                className="p-2 rounded bg-black/40 border border-zinc-700 hover:border-purple-400 text-xs font-mono text-zinc-300 text-left cursor-pointer"
              >
                MOV A, #3
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex gap-2">
            <button
              type="button"
              onClick={runProgram}
              disabled={program.length === 0}
              className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>EJECUTAR PROGRAMA</span>
            </button>
            <button
              type="button"
              onClick={resetMission}
              className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 cursor-pointer"
              title="Limpiar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Central Pipeline & Execution Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                  OBJETIVO DE LA MISIÓN
                </span>
                <h3 className="font-mono-tech text-base font-bold text-white">
                  {mission.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Meta Registro A</span>
                <span className="text-xl font-mono font-black text-emerald-400">{mission.targetRegA}</span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 font-sans leading-relaxed">
              {mission.brief}
            </p>

            {/* Current State of Registers */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-black/60 border border-zinc-800 rounded-lg p-3 text-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">REGISTRO A</span>
                <span className="text-2xl font-mono font-black text-white">{regA}</span>
                <span className="text-[9px] font-mono text-zinc-500 block">Inicio: {mission.initialRegA}</span>
              </div>

              <div className="bg-black/60 border border-zinc-800 rounded-lg p-3 text-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">REGISTRO B</span>
                <span className="text-2xl font-mono font-black text-white">{regB}</span>
                <span className="text-[9px] font-mono text-zinc-500 block">Inicio: {mission.initialRegB}</span>
              </div>

              <div className="bg-black/60 border border-zinc-800 rounded-lg p-3 text-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">REGISTRO C</span>
                <span className="text-2xl font-mono font-black text-white">{regC}</span>
                <span className="text-[9px] font-mono text-zinc-500 block">Inicio: {mission.initialRegC}</span>
              </div>
            </div>

            {/* Program assembly list */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                CÓDIGO CARGADO EN MEMORIA:
              </span>
              {program.length === 0 ? (
                <div className="p-4 rounded-lg bg-black/40 border border-dashed border-zinc-800 text-center text-xs font-mono text-zinc-600">
                  El programa está vacío. Seleccioná instrucciones de la izquierda.
                </div>
              ) : (
                <div className="space-y-1">
                  {program.map((cmd, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-black/50 border border-zinc-800 font-mono text-xs flex justify-between items-center text-zinc-300"
                    >
                      <span>
                        <span className="text-purple-400 mr-2">0x0{i}:</span>
                        {cmd.op === 'MOV_REG' && `MOV ${cmd.dest}, ${cmd.src}`}
                        {cmd.op === 'MOV_LITERAL' && `MOV ${cmd.reg}, #${cmd.val}`}
                        {cmd.op === 'ADD' && `ADD A, ${cmd.src}`}
                        {cmd.op === 'SUB' && `SUB A, ${cmd.src}`}
                      </span>
                      <span className="text-[10px] text-zinc-600">1 Ciclo</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Execution Result Banner */}
            {executionState === 'SUCCESS' && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-mono text-sm font-bold text-white uppercase">
                      ¡MISIÓN CUMPLIDA! Registro A = {regA}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= starsEarned ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-emerald-300/80 font-mono">
                  Ciclos utilizados: {cyclesUsed} (Óptimo: {mission.optimalCycles}).
                </p>
              </div>
            )}

            {executionState === 'FAILED' && (
              <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <span className="font-mono text-xs font-bold text-red-300 uppercase block">
                    RESULTADO INCORRECTO: A = {regA} (Se esperaba {mission.targetRegA})
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Revisá la secuencia de operaciones o reiniciá para probar otra estrategia.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
