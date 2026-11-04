import React, { useState, useEffect } from 'react';
import { Cpu, SkipForward, RotateCcw, Layers, Database, BookOpen, ChevronDown, ChevronUp, Play, Pause } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

type CpuPhase = 'FETCH' | 'DECODE' | 'EXECUTE';

interface Instruction {
  opcode: 'LOAD_A' | 'LOAD_B' | 'ADD' | 'SUB' | 'AND' | 'STORE_A' | 'JNZ' | 'HLT';
  operand: number; // literal or memory address
  rawByte: string;
}

const PROGRAM_PRESETS = [
  {
    name: '1. Sumar 2 Números (5 + 3)',
    memory: [0x15, 0x23, 0x30, 0x5e, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    desc: 'Carga 5 en A, 3 en B, ejecuta SUMA y guarda el resultado 8 en la dirección 0xE.',
  },
  {
    name: '2. Resta y Bandera Cero (7 - 7)',
    memory: [0x17, 0x27, 0x40, 0x5d, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    desc: 'Carga 7 en A y B, resta A-B (0). Activa la bandera Zero Flag (Z=1).',
  },
  {
    name: '3. Máscara Lógica AND (0xF & 0x5)',
    memory: [0x1f, 0x25, 0x60, 0x5f, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    desc: 'Carga 15 en A (1111b), 5 en B (0101b) y realiza operación lógica bit a bit AND.',
  },
];

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
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  const [autoSpeedMs, setAutoSpeedMs] = useState<number>(800); // 800ms per step
  const [showGuide, setShowGuide] = useState<boolean>(true);

  const [logMessages, setLogMessages] = useState<string[]>([
    'CPU Inicializada. Lista para el primer ciclo de reloj.',
  ]);

  // 16 Bytes of Memory (Address 0x0 to 0xF)
  const [ram, setRam] = useState<number[]>([...PROGRAM_PRESETS[0].memory]);

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
    if (isHalted) {
      setIsAutoRunning(false);
      return;
    }

    if (phase === 'FETCH') {
      const currentByte = ram[pc];
      setAddressBus(pc);
      setDataBus(currentByte);
      setControlBus('BUS_READ_ACTIVE');

      const instr = decodeByte(currentByte);
      setIr(`${instr.opcode} ${instr.operand > 0 ? instr.operand : ''}`);

      setLogMessages((prev) => [
        `[FETCH] PC=0x${pc.toString(16).toUpperCase()} → Bus Direcciones activado. Byte: 0x${currentByte.toString(16).toUpperCase()}`,
        ...prev.slice(0, 6),
      ]);

      setPhase('DECODE');
    } else if (phase === 'DECODE') {
      const currentByte = ram[pc];
      const instr = decodeByte(currentByte);
      setControlBus('ALU_CONTROL_READY');

      setLogMessages((prev) => [
        `[DECODE] Unidad Control decodifica: ${instr.opcode} (Op: ${instr.operand})`,
        ...prev.slice(0, 6),
      ]);

      setPhase('EXECUTE');
    } else if (phase === 'EXECUTE') {
      const currentByte = ram[pc];
      const instr = decodeByte(currentByte);

      let nextPc = (pc + 1) % 16;
      let nextRegA = regA;
      let nextRegB = regB;

      if (instr.opcode === 'LOAD_A') {
        nextRegA = instr.operand;
        setRegA(nextRegA);
        setLogMessages((prev) => [
          `[EXECUTE] Reg A cargado con valor inmediato: ${instr.operand}`,
          ...prev.slice(0, 6),
        ]);
      } else if (instr.opcode === 'LOAD_B') {
        nextRegB = instr.operand;
        setRegB(nextRegB);
        setLogMessages((prev) => [
          `[EXECUTE] Reg B cargado con valor inmediato: ${instr.operand}`,
          ...prev.slice(0, 6),
        ]);
      } else if (instr.opcode === 'ADD') {
        const sum = regA + regB;
        nextRegA = sum & 0xff;
        setRegA(nextRegA);
        setFlagZero(nextRegA === 0);
        setFlagCarry(sum > 255);
        setLogMessages((prev) => [
          `[EXECUTE] ALU ejecuta SUMA: ${regA} + ${regB} = ${nextRegA}`,
          ...prev.slice(0, 6),
        ]);
      } else if (instr.opcode === 'SUB') {
        const diff = regA - regB;
        nextRegA = Math.max(0, diff);
        setRegA(nextRegA);
        setFlagZero(nextRegA === 0);
        setLogMessages((prev) => [
          `[EXECUTE] ALU ejecuta RESTA: ${regA} - ${regB} = ${nextRegA}`,
          ...prev.slice(0, 6),
        ]);
      } else if (instr.opcode === 'AND') {
        nextRegA = regA & regB;
        setRegA(nextRegA);
        setFlagZero(nextRegA === 0);
        setLogMessages((prev) => [
          `[EXECUTE] ALU ejecuta AND: ${regA} & ${regB} = ${nextRegA}`,
          ...prev.slice(0, 6),
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
          `[EXECUTE] STORE: Valor A (${regA}) guardado en RAM 0x${targetAddr.toString(16).toUpperCase()}`,
          ...prev.slice(0, 6),
        ]);
      } else if (instr.opcode === 'JNZ') {
        if (!flagZero) {
          nextPc = instr.operand;
          setLogMessages((prev) => [
            `[EXECUTE] JNZ activado. Salto a 0x${nextPc.toString(16).toUpperCase()}`,
            ...prev.slice(0, 6),
          ]);
        }
      } else if (instr.opcode === 'HLT') {
        setIsHalted(true);
        setIsAutoRunning(false);
        setLogMessages((prev) => [
          `[HLT] Instrucción HLT detectada. CPU detenida con éxito.`,
          ...prev.slice(0, 6),
        ]);
        return;
      }

      setPc(nextPc);
      setCycleCount((c) => c + 1);
      setPhase('FETCH');
    }
  };

  // Auto-run timer hook
  useEffect(() => {
    if (!isAutoRunning || isHalted) return;
    const interval = setInterval(() => {
      executeStep();
    }, autoSpeedMs);
    return () => clearInterval(interval);
  }, [isAutoRunning, isHalted, phase, pc, regA, regB, ram, autoSpeedMs]);

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
    setIsAutoRunning(false);
    setLogMessages(['CPU Reiniciada. Registros limpios a 0x00.']);
  };

  const handleLoadPreset = (preset: typeof PROGRAM_PRESETS[0]) => {
    handleReset();
    setRam([...preset.memory]);
  };

  const handleEditRamByte = (index: number, hexVal: string) => {
    const val = parseInt(hexVal, 16);
    if (!isNaN(val) && val >= 0 && val <= 255) {
      setRam((prev) => {
        const copy = [...prev];
        copy[index] = val;
        return copy;
      });
    }
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
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Arquitectura Von Neumann / Bucle Fetch-Decode-Execute" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              SIMULADOR DE CPU DIDÁCTICO Y CICLO DE INSTRUCCIÓN
            </h2>
            <p className="text-zinc-400 text-sm max-w-3xl">
              Toda CPU en el mundo ejecuta el mismo bucle fundamental: Fetch (búsqueda en RAM), Decode (decodificación) y Execute (ejecución ALU).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-300 font-mono text-xs font-bold hover:bg-purple-500/20 transition-all cursor-pointer"
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
        <div className="border border-purple-500/30 bg-purple-950/20 rounded-xl p-5 space-y-3 font-sans text-xs text-zinc-300">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-purple-400">
            <Cpu className="w-4 h-4" />
            <span>GUÍA DE USO PASO A PASO // ARQUITECTURA VON NEUMANN</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-zinc-300">
            <li>
              <strong className="text-white font-mono">Paso 1 (Cargar Programa):</strong> Seleccioná uno de los programas preprogramados (Suma, Resta con Flag Z, u Operación Lógica AND) o editá los bytes de la RAM manualmente.
            </li>
            <li>
              <strong className="text-white font-mono">Paso 2 (Modo Manual o Automático):</strong> Presioná <em>SIGUIENTE FASE</em> para avanzar de a una micro-instrucción o <em>EJECUCIÓN AUTOMÁTICA</em> para ver correr el reloj en tiempo real.
            </li>
            <li>
              <strong className="text-white font-mono">Paso 3 (Inspeccionar Registros y Buses):</strong> Observá el Program Counter (PC), la ALU y cómo los buses de Direcciones (4 bits) y Datos (8 bits) transportan la información desde la RAM hasta el acumulador A.
            </li>
          </ol>
        </div>
      )}

      {/* Program Presets & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-zinc-400 uppercase font-bold mr-1">PROGRAMAS:</span>
          {PROGRAM_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadPreset(p)}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-purple-500 text-zinc-300 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoRunning(!isAutoRunning)}
            disabled={isHalted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold cursor-pointer transition-all ${
              isAutoRunning
                ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isAutoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRunning ? 'Pausar Reloj' : 'Auto Reloj'}</span>
          </button>

          <button
            type="button"
            onClick={executeStep}
            disabled={isHalted || isAutoRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-mono text-xs font-bold cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Fase ({phase})</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 cursor-pointer"
            title="Reiniciar CPU"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
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
          <div className="space-y-2.5 pt-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="text-zinc-400">PC (Program Counter):</span>
              <span className="font-bold text-cyan-400">0x{pc.toString(16).toUpperCase()}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="text-zinc-400">IR (Instruction Reg):</span>
              <span className="font-bold text-amber-400">{ir}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="text-zinc-400">Acumulador A:</span>
              <span className="font-bold text-emerald-400">{regA} (0x{regA.toString(16).toUpperCase()})</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="text-zinc-400">Registro Auxiliar B:</span>
              <span className="font-bold text-emerald-400">{regB} (0x{regB.toString(16).toUpperCase()})</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-zinc-800 rounded-lg">
              <span className="text-zinc-400">Banderas (FLAGS):</span>
              <div className="flex gap-2 text-xs">
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

          <div className="space-y-3 font-mono text-xs">
            {/* Address Bus */}
            <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-cyan-400 font-bold uppercase">Bus de Direcciones (4 bits)</span>
                <span className="text-white">0x{addressBus.toString(16).toUpperCase()}</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                Selecciona la celda de memoria RAM activa.
              </div>
            </div>

            {/* Data Bus */}
            <div className="bg-black/60 border border-emerald-500/30 rounded-lg p-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold uppercase">Bus de Datos (8 bits)</span>
                <span className="text-white">0x{dataBus.toString(16).toUpperCase()} ({dataBus})</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                Transporta los bytes de instrucción entre RAM y registros.
              </div>
            </div>

            {/* Control Bus */}
            <div className="bg-black/60 border border-purple-500/30 rounded-lg p-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-purple-400 font-bold uppercase">Líneas de Control</span>
                <span className="text-white">{controlBus}</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                Señales de sincronización: LECTURA, ESCRITURA, ALU.
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

        {/* Column 3: Memory Matrix (RAM 16 Bytes Editable) */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
                MATRIZ RAM (16 BYTES EDITABLES)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">0x0 - 0xF</span>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 font-mono text-xs">
            {ram.map((val, addr) => {
              const isCurrentPc = pc === addr;
              const isCurrentAddr = addressBus === addr;
              const instr = decodeByte(val);

              return (
                <div
                  key={addr}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                    isCurrentPc
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold'
                      : isCurrentAddr
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200'
                      : 'bg-black/40 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500">0x{addr.toString(16).toUpperCase()}:</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={val.toString(16).toUpperCase().padStart(2, '0')}
                      onChange={(e) => handleEditRamByte(addr, e.target.value)}
                      className="w-10 px-1 text-center bg-black border border-zinc-700 rounded text-amber-400 font-bold uppercase focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {instr.opcode} {instr.operand > 0 ? instr.operand : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
