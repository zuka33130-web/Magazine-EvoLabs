import React, { useState, useMemo } from 'react';
import { Plus, Minus, ArrowRight, ShieldAlert, CheckCircle2, Cpu, RefreshCw, Hash, Sliders } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

type BitWidth = 8 | 16 | 32;
type OperationType = 'ADD' | 'SUB' | 'AND' | 'OR' | 'XOR' | 'NOT' | 'SHL' | 'SHR';

export const BinaryArithmeticLab: React.FC = () => {
  const [bitWidth, setBitWidth] = useState<BitWidth>(8);
  const [valAInput, setValAInput] = useState<number>(42);
  const [valBInput, setValBInput] = useState<number>(21);
  const [operation, setOperation] = useState<OperationType>('ADD');
  const [isSigned, setIsSigned] = useState<boolean>(false);

  // Mask for active bit width (e.g. 0xFF for 8-bit, 0xFFFF for 16-bit)
  const maxUnsignedValue = useMemo(() => Math.pow(2, bitWidth) - 1, [bitWidth]);
  const maxSignedValue = useMemo(() => Math.pow(2, bitWidth - 1) - 1, [bitWidth]);
  const minSignedValue = useMemo(() => -Math.pow(2, bitWidth - 1), [bitWidth]);

  // Clean inputs within valid bit width limits
  const sanitizedA = useMemo(() => {
    let clean = valAInput & maxUnsignedValue;
    return clean < 0 ? clean + Math.pow(2, bitWidth) : clean;
  }, [valAInput, bitWidth, maxUnsignedValue]);

  const sanitizedB = useMemo(() => {
    let clean = valBInput & maxUnsignedValue;
    return clean < 0 ? clean + Math.pow(2, bitWidth) : clean;
  }, [valBInput, bitWidth, maxUnsignedValue]);

  // Convert numbers to bit arrays
  const numToBits = (num: number, width: BitWidth): number[] => {
    const arr: number[] = [];
    for (let i = width - 1; i >= 0; i--) {
      arr.push((num >> i) & 1);
    }
    return arr;
  };

  const bitsA = useMemo(() => numToBits(sanitizedA, bitWidth), [sanitizedA, bitWidth]);
  const bitsB = useMemo(() => numToBits(sanitizedB, bitWidth), [sanitizedB, bitWidth]);

  // Execute operation step-by-step
  const calculationResult = useMemo(() => {
    let rawResult = 0;
    const carries: number[] = new Array(bitWidth + 1).fill(0);
    const resultBits: number[] = new Array(bitWidth).fill(0);
    let carryOut = 0;

    if (operation === 'ADD') {
      let c = 0;
      for (let i = bitWidth - 1; i >= 0; i--) {
        const bitSum = bitsA[i] + bitsB[i] + c;
        resultBits[i] = bitSum % 2;
        c = Math.floor(bitSum / 2);
        carries[i] = c;
      }
      carryOut = c;
      rawResult = sanitizedA + sanitizedB;
    } else if (operation === 'SUB') {
      // Subtraction as A + (~B + 1)
      const bComp = (~sanitizedB + 1) & maxUnsignedValue;
      const bCompBits = numToBits(bComp, bitWidth);
      let c = 0;
      for (let i = bitWidth - 1; i >= 0; i--) {
        const bitSum = bitsA[i] + bCompBits[i] + c;
        resultBits[i] = bitSum % 2;
        c = Math.floor(bitSum / 2);
        carries[i] = c;
      }
      carryOut = c;
      rawResult = sanitizedA - sanitizedB;
    } else if (operation === 'AND') {
      for (let i = 0; i < bitWidth; i++) resultBits[i] = bitsA[i] & bitsB[i];
      rawResult = sanitizedA & sanitizedB;
    } else if (operation === 'OR') {
      for (let i = 0; i < bitWidth; i++) resultBits[i] = bitsA[i] | bitsB[i];
      rawResult = sanitizedA | sanitizedB;
    } else if (operation === 'XOR') {
      for (let i = 0; i < bitWidth; i++) resultBits[i] = bitsA[i] ^ bitsB[i];
      rawResult = sanitizedA ^ sanitizedB;
    } else if (operation === 'NOT') {
      for (let i = 0; i < bitWidth; i++) resultBits[i] = bitsA[i] === 1 ? 0 : 1;
      rawResult = (~sanitizedA) & maxUnsignedValue;
    } else if (operation === 'SHL') {
      const shift = 1;
      rawResult = (sanitizedA << shift) & maxUnsignedValue;
      for (let i = 0; i < bitWidth - 1; i++) resultBits[i] = bitsA[i + 1];
      resultBits[bitWidth - 1] = 0;
      carryOut = bitsA[0];
    } else if (operation === 'SHR') {
      const shift = 1;
      rawResult = (sanitizedA >>> shift) & maxUnsignedValue;
      for (let i = bitWidth - 1; i > 0; i--) resultBits[i] = bitsA[i - 1];
      resultBits[0] = 0;
      carryOut = bitsA[bitWidth - 1];
    }

    const maskedResult = rawResult & maxUnsignedValue;

    // Two's complement signed evaluation
    const msb = resultBits[0];
    const signedValue = msb === 1 ? maskedResult - Math.pow(2, bitWidth) : maskedResult;

    // Overflow Flags
    const unsignedOverflow = carryOut === 1 || rawResult > maxUnsignedValue || rawResult < 0;
    const signedOverflow = (bitsA[0] === bitsB[0]) && (bitsA[0] !== resultBits[0]) && (operation === 'ADD');
    const hasOverflow = isSigned ? signedOverflow : unsignedOverflow;

    // Flags: Zero Flag (ZF), Sign Flag (SF), Carry Flag (CF), Overflow Flag (OF)
    const zf = maskedResult === 0 ? 1 : 0;
    const sf = msb;
    const cf = carryOut;
    const of = signedOverflow ? 1 : 0;

    return {
      resultBits,
      carries,
      maskedResult,
      signedValue,
      rawResult,
      hasOverflow,
      flags: { zf, sf, cf, of },
    };
  }, [sanitizedA, sanitizedB, bitsA, bitsB, operation, bitWidth, maxUnsignedValue, isSigned]);

  const toggleSingleBitA = (index: number) => {
    const copy = [...bitsA];
    copy[index] = copy[index] === 1 ? 0 : 1;
    const newUnsigned = copy.reduce((acc, bit, idx) => acc + bit * Math.pow(2, bitWidth - 1 - idx), 0);
    setValAInput(newUnsigned);
  };

  return (
    <div className="space-y-8 text-zinc-100 font-sans select-none animate-in fade-in duration-200">
      
      {/* HEADER BANNER */}
      <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0a1813] via-[#080d0a] to-zinc-950 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
                TOMO 01 · FUNDAMENTOS 02
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="ALU Lógica Booleana / Complemento a 2" />
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px]">
                8 / 16 / 32 BITS CONFIGURABLE
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Laboratorio de Aritmética Binaria y Registros de ALU
            </h2>
            <p className="text-zinc-300 text-sm mt-1 max-w-3xl leading-relaxed font-sans">
              Un procesador no resta ni multiplica directamente: todo lo computa sumando voltajes y acarreando bits. Experimentá con registros de 8, 16 y 32 bits y observá el comportamiento de las banderas (OF, ZF, SF, CF).
            </p>
          </div>

          {/* Mode Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex items-center gap-1 font-mono text-xs">
              {([8, 16, 32] as BitWidth[]).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setBitWidth(w)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    bitWidth === w ? 'bg-emerald-400 text-black shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {w} BITS
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsSigned(!isSigned)}
              className={`px-3.5 py-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${
                isSigned
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              {isSigned ? 'CON SIGNO (COMPLEMENTO A 2)' : 'SIN SIGNO (UNSIGNED)'}
            </button>
          </div>
        </div>
      </div>

      {/* CONTROLES Y REGISTROS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        
        {/* Left Inputs and Operation Selector */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0a0f16] border border-zinc-800 space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">
            CONFIGURACIÓN DE OPERANDOS Y ALU
          </span>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">OPERANDO A (Decimal):</label>
              <input
                type="number"
                value={valAInput}
                onChange={(e) => setValAInput(Number(e.target.value))}
                className="w-full bg-black/80 border border-zinc-700 text-emerald-300 rounded-xl px-3.5 py-2 font-mono text-sm outline-none focus:border-emerald-400"
              />
            </div>

            {operation !== 'NOT' && operation !== 'SHL' && operation !== 'SHR' && (
              <div>
                <label className="text-zinc-400 block mb-1">OPERANDO B (Decimal):</label>
                <input
                  type="number"
                  value={valBInput}
                  onChange={(e) => setValBInput(Number(e.target.value))}
                  className="w-full bg-black/80 border border-zinc-700 text-cyan-300 rounded-xl px-3.5 py-2 font-mono text-sm outline-none focus:border-cyan-400"
                />
              </div>
            )}

            <div>
              <label className="text-zinc-400 block mb-1">OPERACIÓN BOOLEANA / ARITMÉTICA:</label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(['ADD', 'SUB', 'AND', 'OR', 'XOR', 'NOT', 'SHL', 'SHR'] as OperationType[]).map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setOperation(op)}
                    className={`py-2 rounded-lg font-bold border cursor-pointer transition-all ${
                      operation === op
                        ? 'bg-emerald-400 text-black border-emerald-400 font-black shadow'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-sans text-zinc-300 space-y-1">
            <span className="text-emerald-400 font-mono font-bold uppercase text-[10px] block">
              💡 RANGOS PERMITIDOS DE {bitWidth} BITS:
            </span>
            <p>Unsigned: <strong className="text-white">0 a {maxUnsignedValue.toLocaleString()}</strong></p>
            <p>Signed: <strong className="text-white">{minSignedValue.toLocaleString()} a +{maxSignedValue.toLocaleString()}</strong></p>
          </div>
        </div>

        {/* Right Register Display and Bitwise Visualization */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#080b12] border border-zinc-800 space-y-6">
          
          {/* Register A Bits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 uppercase">REGISTRO A [{bitWidth} BITS]:</span>
              <span className="text-zinc-400">
                DEC: <strong className="text-white">{sanitizedA}</strong> | HEX: <strong className="text-zinc-200">0x{sanitizedA.toString(16).toUpperCase()}</strong>
              </span>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 text-center">
              {bitsA.map((bit, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleSingleBitA(idx)}
                  className={`p-1.5 rounded border text-xs font-mono transition-all cursor-pointer ${
                    bit === 1
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-black/50 border-zinc-800 text-zinc-600'
                  }`}
                  title={`Bit ${bitWidth - 1 - idx}`}
                >
                  {bit}
                </button>
              ))}
            </div>
          </div>

          {/* ALU Output Result */}
          <div className="p-5 rounded-xl bg-black/80 border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">
                  SALIDA DE LA ALU ({operation})
                </h4>
              </div>

              {calculationResult.hasOverflow ? (
                <div className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/60 text-rose-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>OVERFLOW DETECTADO (OF=1)</span>
                </div>
              ) : (
                <div className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>RESULTADO VÁLIDO</span>
                </div>
              )}
            </div>

            {/* Result Bits */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-500 block uppercase">BITS DE RESULTADO EN BUS EN SALIDA:</span>
              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 text-center">
                {calculationResult.resultBits.map((bit, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded border text-xs font-bold ${
                      bit === 1
                        ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                    }`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
            </div>

            {/* Decimal & Hexadecimal Evaluation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase">VALOR UNSIGNED</span>
                <span className="text-lg font-bold text-white">{calculationResult.maskedResult.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase">VALOR SIGNED</span>
                <span className="text-lg font-bold text-amber-300">{calculationResult.signedValue.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase">VALOR HEXADECIMAL</span>
                <span className="text-lg font-bold text-cyan-300">0x{calculationResult.maskedResult.toString(16).toUpperCase()}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase">FLAGS (REGISTRO ESTADO)</span>
                <div className="flex gap-1.5 font-bold text-[10px] mt-1">
                  <span className={calculationResult.flags.zf ? 'text-cyan-400' : 'text-zinc-600'}>ZF={calculationResult.flags.zf}</span>
                  <span className={calculationResult.flags.sf ? 'text-amber-400' : 'text-zinc-600'}>SF={calculationResult.flags.sf}</span>
                  <span className={calculationResult.flags.cf ? 'text-emerald-400' : 'text-zinc-600'}>CF={calculationResult.flags.cf}</span>
                  <span className={calculationResult.flags.of ? 'text-rose-400' : 'text-zinc-600'}>OF={calculationResult.flags.of}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
