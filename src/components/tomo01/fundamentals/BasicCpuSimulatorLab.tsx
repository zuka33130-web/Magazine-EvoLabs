import React, { useState } from 'react';
import { Cpu, Play, SkipForward, RotateCcw, ArrowRight, Layers, Database, CheckCircle2 } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

type CpuPhase = 'FETCH' | 'DECODE' | 'EXECUTE';

interface Instruction {
  opcode: 'LOAD_A' | 'LOAD_B' | 'ADD' | 'SUB' | 'AND' | 'STORE_A' | 'JNZ' | 'HLT';
  operand: number; // literal or memory address
  rawByte: string;
}

export const BasicCpuSimulatorLab: React.FC = () => {
  // CPU Registers
  const [pc, setPc] = useState<number>(0); // Program counter (0 to 15)
  const [ir, setIr] = useState<string>('HLT'); // Instruction Register
  const [regA, setRegA] = useState<number>(0); // Accumulator
  const [regB, setRegB] = useState<number>(0); // Temp Register
  const [flagZero, setFlagZero] = useState<boolean>(false);
  const [flagCarry, setFlagCarry] = useState<boolean>(false);

  // CPU Micro-cycle Phase
  const [phase, setPhase] = useState<CpuPhase>('FETCH');
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [isHalted, setIsHalted] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([
    'CPU Inicializada. Lista para el primer ciclo de reloj.',
  ]);

  // 16 Bytes of Memory (Address 0x0 to 0xF)
  // Program: Load A with 5, Load B with 3, ADD A, B, Store in 0xE, HLT
  const defaultMemory: number[] = [
    0x15, // 0x0: LOAD_A 5
    0x23, // 0x1: LOAD_B 3
    0x30, // 0x2: ADD
    0x5e, // 0x3: STORE_A [0xE]
    0xff, // 0x4: HLT
    0x00, // 0x5
    0x00, // 0x6
    0x00, // 0x7
    0x00, // 0x8
    0x00, // 0x9
    0x00, // 0xA
    0x00, // 0xB
    0x00, // 0xC
    0x00, // 0xD
    0x00, // 0xE (Result storage)
    0x00, // 0xF
  ];

  const [ram, setRam] = useState<number[]>(defaultMemory);

  // Active Buses state
  const [addressBus, setAddressBus] = useState<number>(0);
  const [dataBus, setDataBus] = useState<number>(0);
  const [controlBus, setControlBus] = useState<string>('MEM_READ');

  // Decode instruction from byte
  const decodeByte = (byte: number): Instruction => {
    const highNibble = (byte >> 4) & 0x0f;
    const lowNibble = byte & 0x0f;

    switch (highNibble) {
      case 0x1:
        return { opcode: 'LOAD_A', operand: lowNibble, rawByte: `0x${byte.toString(16).toUpperCase()}` };
      case 0x2:
        return { opcode: 'LOAD_B', operand: lowNibble, rawByte: `0x${byte.toString(16).toUpperCase()}` };
      case 0x3:
        return { opcode: 'ADD', operand: 0, rawByte: `0x${byte.toString(16).toUpperCase()}` };
      case 0x4:
        return { opcode: 'SUB', operand: 0, rawByte: `0x${byte.toString(16).toUpperCase()}` };
      case 0x5:
        return { opcode: 'STORE_A', operand: lowNibble, rawByte: `0x${byte.toString(16).toUpperCase()}` };
      case 0x6:
        return { opcode: 'AND', operand: 0, rawByte: `0x${byte.toString(16).toUpperCase()}` };
      case 0x7:
        return { opcode: 'JNZ', operand: lowNibble, rawByte: `0x${byte.toString(16).toUpperCase()}` };
      case 0xf:
      default:
        return { opcode: 'HLT', operand: 0, rawByte: '0xFF' };
    }
  };

  // Step micro-cycle execution
  const executeStep = () => {
    if (isHalted) return;

    if (phase === 'FETCH') {
      // 1. FETCH: Read RAM at Address Bus (PC), put into Data Bus, store in IR, PC++
      const currentByte = ram[pc];
      setAddressBus(pc);
      setDataBus(currentByte);
      setControlBus('BUS_READ_ACTIVE');

      const instr = decodeByte(currentByte);
      setIr(`${instr.opcode} ${instr.operand > 0 ? instr.operand : ''}`);

      setLogMessages((prev) => [
        `[FETCH] PC=0x${pc.toString(16).toUpperCase()} → Bus de Direcciones activado. Byte leído: 0x${currentByte.toString(16).toUpperCase()}`,
        ...prev.slice(0, 7),
      ]);

      setPhase('DECODE');
    } else if (phase === 'DECODE') {
      // 2. DECODE: Analyze opcode & operands
      const currentByte = ram[pc];
      const instr = decodeByte(currentByte);
      setControlBus('ALU_CONTROL_READY');

      setLogMessages((prev) => [
        `[DECODE] Unidad de Control decodifica instrucción: ${instr.opcode} (Op: ${instr.operand})`,
        ...prev.slice(0, 7),
      ]);

      setPhase('EXECUTE');
    } else if (phase === 'EXECUTE') {
      // 3. EXECUTE: Execute ALU or register transfer, advance PC
      const currentByte = ram[pc];
      const instr = decodeByte(currentByte);

      let nextPc = (pc + 1) % 16;
      let nextRegA = regA;
      let nextRegB = regB;

      if (instr.opcode === 'LOAD_A') {
        nextRegA = instr.operand;
        setRegA(nextRegA);
        setLogMessages((prev) => [
          `[EXECUTE] Registro A cargado con valor inmediato: ${instr.operand}`,
          ...prev.slice(0, 7),
        ]);
      } else if (instr.opcode === 'LOAD_B') {
        nextRegB = instr.operand;
        setRegB(nextRegB);
        setLogMessages((prev) => [
          `[EXECUTE] Registro B cargado con valor inmediato: ${instr.operand}`,
          ...prev.slice(0, 7),
        ]);
      } else if (instr.opcode === 'ADD') {
        const sum = regA + regB;
        nextRegA = sum & 0xff;
        setRegA(nextRegA);
        setFlagZero(nextRegA === 0);
        setFlagCarry(sum > 255);
        setLogMessages((prev) => [
          `[EXECUTE] ALU ejecuta SUMA: ${regA} + ${regB} = ${nextRegA}`,
          ...prev.slice(0, 7),
        ]);
      } else if (instr.opcode === 'SUB') {
        const diff = regA - regB;
        nextRegA = Math.max(0, diff);
        setRegA(nextRegA);
        setFlagZero(nextRegA === 0);
        setLogMessages((prev) => [
          `[EXECUTE] ALU ejecuta RESTA: ${regA} - ${regB} = ${nextRegA}`,
          ...prev.slice(0, 7),
        ]);
      } else if (instr.opcode === 'STORE_A') {
        const targetAddr = instr.operand;
        setRam((prevRam) => {
          const copy = [...prevRam];
          copy[targetAddr] = regA;
          return copy;
        });
        setAddressBus(targetAddr);
        setDataBus(regA);
        setControlBus('MEM_WRITE_ACTIVE');
        setLogMessages((prev) => [
          `[EXECUTE] STORE: Valor de A (${regA}) guardado en Dirección de Memoria 0x${targetAddr.toString(16).toUpperCase()}`,
          ...prev.slice(0, 7),
        ]);
      } else if (instr.opcode === 'JNZ') {
        if (!flagZero) {
          nextPc = instr.operand;
          setLogMessages((prev) => [
            `[EXECUTE] Salto condicional JNZ ejecutado a 0x${nextPc.toString(16).toUpperCase()} (Flag Z=0)`,
            ...prev.slice(0, 7),
          ]);
        }
      } else if (instr.opcode === 'HLT') {
        setIsHalted(true);
        setLogMessages((prev) => [
          `[HLT] Instrucción HLT detectada. CPU detenida con éxito.`,
          ...prev.slice(0, 7),
        ]);
        return;
      }

      setPc(nextPc);
      setCycleCount((c) => c + 1);
      setPhase('FETCH');
    }
  };

  const handleReset = () => {
    setPc(0);
    setIr('HLT');
    setRegA(0);
    setRegB(0);
    setFlagZero(false);
    setFlagCarry(false);
    setPhase('FETCH');
    setCycleCount(0);
    setIsHalted(false);
    setRam([...defaultMemory]);
    setLogMessages(['CPU Reiniciada. Registros limpios a 0x00.']);
  };

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400">
                FUNDAMENTOS // PARTE I
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Arquitectura Von Neumann / Ciclo Fetch-Decode-Execute" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              SIMULADOR DE CPU DIDÁCTICO Y CICLO DE INSTRUCCIÓN
            </h2>
            <p className="text-zinc-400 text-sm max-w-3xl">
              Toda CPU en el mundo, desde el microcontrolador de un lavarropas hasta el procesador más veloz, ejecuta el mismo bucle fundamental: Fetch (búsqueda), Decode (decodificación) y Execute (ejecución).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={executeStep}
              disabled={isHalted}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                isHalted
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40'
              }`}
            >
              <SkipForward className="w-4 h-4" />
              <span>PASO A PASO // SIGUIENTE FASE ({phase})</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 cursor-pointer"
              title="Reiniciar CPU"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: CPU Core Internal Registers & ALU */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
                NÚCLEO Y REGISTROS
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
              CICLO #{cycleCount}
            </span>
          </div>

          {/* Phase Indicator */}
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs">
            {(['FETCH', 'DECODE', 'EXECUTE'] as CpuPhase[]).map((p) => (
              <div
                key={p}
                className={`py-1.5 rounded-lg border font-bold transition-all ${
                  phase === p
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-black/30 border-zinc-800 text-zinc-600'
                }`}
              >
                {p}
              </div>
            ))}
          </div>

          {/* Registers list */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="font-mono text-xs text-zinc-400">PC (Program Counter):</span>
              <span className="font-mono text-sm font-bold text-cyan-400">0x{pc.toString(16).toUpperCase()}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="font-mono text-xs text-zinc-400">IR (Instruction Reg):</span>
              <span className="font-mono text-sm font-bold text-amber-400">{ir}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="font-mono text-xs text-zinc-400">Acumulador A:</span>
              <span className="font-mono text-sm font-bold text-emerald-400">{regA} (0x{regA.toString(16).toUpperCase()})</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="font-mono text-xs text-zinc-400">Registro Auxiliar B:</span>
              <span className="font-mono text-sm font-bold text-emerald-400">{regB} (0x{regB.toString(16).toUpperCase()})</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="font-mono text-xs text-zinc-400">Banderas (FLAGS):</span>
              <div className="flex gap-2 font-mono text-xs">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${flagZero ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-zinc-800 text-zinc-600'}`}>
                  Z: {flagZero ? 1 : 0}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${flagCarry ? 'bg-amber-500/20 text-amber-300 border border-amber-500' : 'bg-zinc-800 text-zinc-600'}`}>
                  C: {flagCarry ? 1 : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: System Buses & Microcode Log */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              BUSES DEL SISTEMA
            </h3>
          </div>

          <div className="space-y-3">
            {/* Address Bus */}
            <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold uppercase">Bus de Direcciones (4 bits)</span>
                <span className="text-white">0x{addressBus.toString(16).toUpperCase()}</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                Selecciona la posición de memoria RAM a leer o escribir.
              </div>
            </div>

            {/* Data Bus */}
            <div className="bg-black/60 border border-emerald-500/30 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold uppercase">Bus de Datos (8 bits)</span>
                <span className="text-white">0x{dataBus.toString(16).toUpperCase()} ({dataBus})</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                Transporta los bytes de instrucción y datos entre CPU y RAM.
              </div>
            </div>

            {/* Control Bus */}
            <div className="bg-black/60 border border-purple-500/30 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-purple-400 font-bold uppercase">Líneas de Control</span>
                <span className="text-white font-mono text-xs">{controlBus}</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                Señales de sincronización: LECTURA, ESCRITURA, RELOJ.
              </div>
            </div>
          </div>

          {/* Microcode Activity Log */}
          <div className="border border-zinc-800 bg-black/60 rounded-lg p-3 space-y-1 font-mono text-[11px] text-zinc-400 max-h-48 overflow-y-auto">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">Bitácora de Micro-operaciones:</span>
            {logMessages.map((msg, i) => (
              <div key={i} className="text-zinc-300 leading-tight">
                {msg}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Memory Matrix (RAM 16 Bytes) */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
                MATRIZ RAM (16 BYTES)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">0x0 - 0xF</span>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {ram.map((val, addr) => {
              const isCurrentPc = pc === addr;
              const isCurrentAddr = addressBus === addr;
              const instr = decodeByte(val);

              return (
                <div
                  key={addr}
                  className={`flex items-center justify-between p-2 rounded-lg border font-mono text-xs transition-all ${
                    isCurrentPc
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold'
                      : isCurrentAddr
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200'
                      : 'bg-black/40 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500">0x{addr.toString(16).toUpperCase()}:</span>
                    <span className="text-white font-bold">0x{val.toString(16).toUpperCase().padStart(2, '0')}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {instr.opcode} {instr.operand > 0 ? instr.operand : ''}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-400 font-sans leading-relaxed">
            <strong className="font-mono text-purple-400">Arquitectura Real:</strong> En los procesadores x86/x64 actuales, la CPU divide estas tres fases en pipelines de hasta 19 etapas y ejecuta múltiples instrucciones en paralelo (superescalar), pero el concepto base es exactamente el mismo que estás comprobando acá.
          </div>
        </div>
      </div>
    </div>
  );
};
