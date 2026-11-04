import React, { useState } from 'react';
import { Binary, Layers, BookOpen, RefreshCw, Hash, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

export const InfoRepresentationLab: React.FC = () => {
  const [inputText, setInputText] = useState('EVO');
  const [selectedUnitValue, setSelectedUnitValue] = useState<number>(16); // e.g. 16 GB
  const [selectedUnitPrefix, setSelectedUnitPrefix] = useState<'GB' | 'GiB'>('GB');

  // Convert text to UTF-8 / ASCII bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(inputText);

  const byteDetails = Array.from(bytes).map((b) => ({
    char: String.fromCharCode(b),
    dec: b,
    hex: b.toString(16).toUpperCase().padStart(2, '0'),
    bin: b.toString(2).padStart(8, '0'),
    isAsciiStandard: b < 128,
  }));

  // Calculations for Storage Units: SI Decimal vs IEC Binary
  // 1 GB (SI) = 1,000,000,000 bytes
  // 1 GiB (IEC) = 1,073,741,824 bytes (1024^3)
  const bytesCount =
    selectedUnitPrefix === 'GB'
      ? selectedUnitValue * 1_000_000_000
      : selectedUnitValue * Math.pow(1024, 3);

  const gibEquivalent = (bytesCount / Math.pow(1024, 3)).toFixed(2);
  const gbEquivalent = (bytesCount / 1_000_000_000).toFixed(2);
  const mibEquivalent = (bytesCount / Math.pow(1024, 2)).toFixed(0);
  const lossPercentage = (
    ((selectedUnitValue - Number(gibEquivalent)) / selectedUnitValue) *
    100
  ).toFixed(2);

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                FUNDAMENTOS // PARTE I
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Codificación UTF-8 / Estándar IEC 60027-2" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              CODIFICACIÓN DE INFORMACIÓN Y UNIDADES DE ALMACENAMIENTO
            </h2>
            <p className="text-zinc-400 text-sm max-w-3xl">
              Toda instrucción y dato en una computadora son agrupaciones de bits (0 y 1). Descubrí cómo los transistores representan texto y por qué tu disco de 1 TB muestra 931 GB en Windows.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Live Byte & Text Encoder */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Binary className="w-5 h-5 text-cyan-400" />
              <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
                1. CODIFICADOR EN VIVO (ASCII & UTF-8)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">{bytes.length} bytes emitidos</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block">Ingresá texto para observar la física de bytes:</label>
            <input
              type="text"
              maxLength={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ej: EVO LABS"
              className="w-full bg-black/70 border border-zinc-700 rounded-lg px-4 py-2 font-mono text-cyan-300 text-base focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Bytes breakdown */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono text-zinc-400 block uppercase tracking-wider">
              Mapa de Bytes en Memoria:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {byteDetails.map((b, idx) => (
                <div
                  key={idx}
                  className="bg-black/50 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-black text-cyan-400 text-sm">
                      {b.char === ' ' ? '␣' : b.char}
                    </span>
                    <div>
                      <div className="font-mono text-xs text-white font-bold tracking-wider">
                        0b{b.bin}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        HEX: <span className="text-zinc-300 font-bold">0x{b.hex}</span> | DEC: {b.dec}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {b.isAsciiStandard ? 'ASCII-7' : 'UTF-8 multi'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-lg text-xs text-cyan-200/90 leading-relaxed font-sans">
            <strong className="font-mono text-cyan-300 block mb-1">Principio Técnico:</strong>
            Un caracter ASCII estándar ocupa 1 byte (8 bits, 256 combinaciones posibles: 2⁸). Los procesadores modernos transfieren bloques de 64 bits (8 bytes) por ciclo de bus hacia la memoria RAM.
          </div>
        </div>

        {/* Module 2: The Storage Discrepancy (SI vs IEC) */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
                2. EL MISTERIO DEL DISCO: SI (DECIMAL) VS IEC (BINARIO)
              </h3>
            </div>
            <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Fórmula: Base 10 vs Base 2" />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-mono text-zinc-400 block">
              Capacidad comercial declarada por el fabricante del disco:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 2000, 4000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setSelectedUnitValue(val >= 1000 ? val / 1000 : val);
                    setSelectedUnitPrefix(val >= 1000 ? 'GB' : 'GB');
                  }}
                  className={`px-2 py-2 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                    (selectedUnitValue === val || selectedUnitValue === val / 1000)
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {val >= 1000 ? `${val / 1000} TB` : `${val} GB`}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-black/60 border border-zinc-800 rounded-lg p-3 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                FABRICANTE (SI - Base 10)
              </span>
              <div className="text-xl font-mono font-black text-white">
                {selectedUnitValue} {selectedUnitValue >= 10 ? 'GB' : 'TB'}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                1 KB = 1.000 Bytes
                <br />
                Total: {(selectedUnitValue >= 10 ? selectedUnitValue * 1e9 : selectedUnitValue * 1e12).toLocaleString()} B
              </p>
            </div>

            <div className="bg-black/60 border border-amber-500/30 rounded-lg p-3 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold">
                WINDOWS (IEC - Base 2)
              </span>
              <div className="text-xl font-mono font-black text-amber-300">
                {selectedUnitValue >= 10
                  ? (selectedUnitValue * 0.9313).toFixed(1) + ' GB'
                  : (selectedUnitValue * 931.3).toFixed(0) + ' GiB / ' + (selectedUnitValue * 0.909).toFixed(2) + ' TB'}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                1 KiB = 1.024 Bytes (2¹⁰)
                <br />
                Diferencia aparente: ~7.3%
              </p>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-2 font-mono text-zinc-300">
            <div className="text-zinc-400 text-[11px]">
              <strong className="text-amber-400">¿Por qué ocurre esto?</strong>
              <p className="mt-1 font-sans text-xs text-zinc-300">
                Los fabricantes venden discos en múltiplos decimales (1 GB = 10⁹ bytes), pero Windows calcula el espacio dividiendo por 1024³ (Gibibytes), aunque etiquete erróneamente la unidad como "GB". No perdiste espacio: es una disparidad de unidades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
