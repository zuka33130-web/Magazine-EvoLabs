import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, ArrowRight, Plus, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

export const BinaryArithmeticLab: React.FC = () => {
  // 8-bit registers for interactive toggling
  const [bitsA, setBitsA] = useState<number[]>([0, 0, 1, 0, 1, 0, 1, 0]); // 42 in dec
  const [bitsB, setBitsB] = useState<number[]>([0, 0, 0, 1, 0, 1, 0, 1]); // 21 in dec
  const [isSigned, setIsSigned] = useState<boolean>(false);

  // Helper to toggle a single bit in an array
  const toggleBit = (setter: React.Dispatch<React.SetStateAction<number[]>>, index: number) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = copy[index] === 1 ? 0 : 1;
      return copy;
    });
  };

  // Convert bit array to unsigned decimal
  const bitsToUnsigned = (bits: number[]) => {
    return bits.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 7 - idx), 0);
  };

  // Convert bit array to signed (Two's Complement)
  const bitsToSigned = (bits: number[]) => {
    const unsigned = bitsToUnsigned(bits);
    if (bits[0] === 1) {
      // Negative in two's complement: unsigned - 256
      return unsigned - 256;
    }
    return unsigned;
  };

  // Synchronized values
  const valA = isSigned ? bitsToSigned(bitsA) : bitsToUnsigned(bitsA);
  const valB = isSigned ? bitsToSigned(bitsB) : bitsToUnsigned(bitsB);

  const hexA = bitsToUnsigned(bitsA).toString(16).toUpperCase().padStart(2, '0');
  const hexB = bitsToUnsigned(bitsB).toString(16).toUpperCase().padStart(2, '0');

  // Binary Addition Simulation with Bitwise Carry
  const sumBits: number[] = new Array(8).fill(0);
  const carries: number[] = new Array(9).fill(0); // carries[0] is carry-out of MSB (bit 7)

  let carry = 0;
  for (let i = 7; i >= 0; i--) {
    const a = bitsA[i];
    const b = bitsB[i];
    const sum = a + b + carry;
    sumBits[i] = sum % 2;
    carry = Math.floor(sum / 2);
    carries[i] = carry;
  }
  carries[8] = carry; // Final carry out

  const unsignedSum = bitsToUnsigned(sumBits);
  const signedSum = bitsToSigned(sumBits);
  const theoreticalSum = valA + valB;

  // Overflow Detection
  // In Unsigned: Overflow occurs if final carry out == 1 (result exceeds 255)
  // In Signed: Overflow occurs if sign of operands is same, but sign of result is different
  const unsignedOverflow = carries[0] === 1;
  const signedOverflow = (bitsA[0] === bitsB[0]) && (bitsA[0] !== sumBits[0]);
  const hasOverflow = isSigned ? signedOverflow : unsignedOverflow;

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                FUNDAMENTOS // PARTE I
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Aritmética Binaria Booleana / Complemento a Dos" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              SISTEMAS BINARIOS, ARITMÉTICA Y DESBORDAMIENTO (OVERFLOW)
            </h2>
            <p className="text-zinc-400 text-sm max-w-3xl">
              Un procesador no sabe restar ni multiplicar directamente: todo lo computa sumando voltajes y acarreando bits. Experimentá con registros de 8 bits y comprobá cómo se produce un fallo de desbordamiento en memoria.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSigned(!isSigned)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                isSigned
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
            >
              Modo: {isSigned ? 'Con Signo (Complemento a 2)' : 'Sin Signo (Unsigned)'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Register A */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="font-mono-tech text-sm font-bold uppercase text-emerald-400">
              REGISTRO A [8 BITS]
            </span>
            <div className="font-mono text-xs space-x-2 text-zinc-400">
              <span>DEC: <strong className="text-white">{valA}</strong></span>
              <span>HEX: <strong className="text-zinc-200">0x{hexA}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1.5 text-center">
            {bitsA.map((bit, idx) => {
              const weight = Math.pow(2, 7 - idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleBit(setBitsA, idx)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border font-mono transition-all cursor-pointer ${
                    bit === 1
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/40'
                      : 'bg-black/50 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[10px] text-zinc-500">2^{7 - idx}</span>
                  <span className="text-lg font-black">{bit}</span>
                  <span className="text-[9px] text-zinc-400">{weight}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-mono text-zinc-500 text-center">
            Hacé clic en cualquier bit para conmutar su estado eléctrico (0V = 0 / 1.2V = 1)
          </p>
        </div>

        {/* Register B */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="font-mono-tech text-sm font-bold uppercase text-cyan-400">
              REGISTRO B [8 BITS]
            </span>
            <div className="font-mono text-xs space-x-2 text-zinc-400">
              <span>DEC: <strong className="text-white">{valB}</strong></span>
              <span>HEX: <strong className="text-zinc-200">0x{hexB}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1.5 text-center">
            {bitsB.map((bit, idx) => {
              const weight = Math.pow(2, 7 - idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleBit(setBitsB, idx)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border font-mono transition-all cursor-pointer ${
                    bit === 1
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/40'
                      : 'bg-black/50 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[10px] text-zinc-500">2^{7 - idx}</span>
                  <span className="text-lg font-black">{bit}</span>
                  <span className="text-[9px] text-zinc-400">{weight}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-mono text-zinc-500 text-center">
            Hacé clic en cualquier bit para conmutar su estado eléctrico (0V = 0 / 1.2V = 1)
          </p>
        </div>
      </div>

      {/* Arithmetic Logic Unit (ALU) Sum Result */}
      <div className="border border-zinc-800 bg-zinc-900/70 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono-tech text-base font-bold uppercase text-white">
                SALIDA DE LA ALU: SUMADOR COMPLETO (FULL ADDER)
              </h3>
              <p className="text-zinc-400 text-xs font-mono">
                A + B = {valA} + {valB} = {theoreticalSum}
              </p>
            </div>
          </div>

          {/* Overflow Status Pill */}
          {hasOverflow ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/60 text-red-400 font-mono text-xs font-bold animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>OVERFLOW FLAG (OF) ACTIVADO — DESBORDAMIENTO DE REGISTRO</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>OPERACIÓN VÁLIDA (SIN DESBORDAMIENTO)</span>
            </div>
          )}
        </div>

        {/* Binary Sum Visualizer with Carry Row */}
        <div className="space-y-2">
          {/* Carries row */}
          <div className="flex items-center justify-end gap-1.5 font-mono text-xs pr-4 text-amber-400">
            <span className="text-[10px] text-zinc-500 mr-2 uppercase">Acarreos (Carry):</span>
            {carries.slice(0, 8).map((c, i) => (
              <span
                key={i}
                className={`w-8 text-center text-xs font-bold ${
                  c === 1 ? 'text-amber-400 font-black' : 'text-zinc-700'
                }`}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Sum bits row */}
          <div className="grid grid-cols-8 gap-2 text-center">
            {sumBits.map((bit, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border font-mono ${
                  bit === 1
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-black/40 border-zinc-800 text-zinc-500'
                }`}
              >
                <span className="text-[10px] text-zinc-500">Bit {7 - idx}</span>
                <span className="text-xl font-black">{bit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-black/50 border border-zinc-800 rounded-lg p-3">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">VALOR EN REGISTRO DE 8 BITS</span>
            <span className="text-xl font-mono font-black text-white">
              {isSigned ? signedSum : unsignedSum}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 block">
              HEX: 0x{unsignedSum.toString(16).toUpperCase().padStart(2, '0')}
            </span>
          </div>

          <div className="bg-black/50 border border-zinc-800 rounded-lg p-3">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">RESULTADO MATEMÁTICO REAL</span>
            <span className="text-xl font-mono font-black text-zinc-300">
              {theoreticalSum}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 block">
              Rango 8 bits: {isSigned ? '-128 a +127' : '0 a 255'}
            </span>
          </div>

          <div className="bg-black/50 border border-zinc-800 rounded-lg p-3">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">REGISTRO DE ESTADO (FLAGS)</span>
            <div className="flex gap-2 mt-1 font-mono text-xs">
              <span className={`px-2 py-0.5 rounded border ${hasOverflow ? 'bg-red-500/20 border-red-500 text-red-300 font-bold' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                OF: {hasOverflow ? 1 : 0}
              </span>
              <span className={`px-2 py-0.5 rounded border ${unsignedSum === 0 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                ZF: {unsignedSum === 0 ? 1 : 0}
              </span>
              <span className={`px-2 py-0.5 rounded border ${sumBits[0] === 1 ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                SF: {sumBits[0]}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-sans leading-relaxed">
          <strong className="font-mono text-emerald-400">Lección de Hardware:</strong> Cuando la suma excede la capacidad del registro físico ({isSigned ? '127' : '255'}), el bit más significativo se pierde o cambia de signo abruptamente. Este es el origen de bugs históricos en videojuegos (como las 255 vidas que pasan a 0) y fallos críticos de desbordamiento de búfer en memoria.
        </div>
      </div>
    </div>
  );
};
