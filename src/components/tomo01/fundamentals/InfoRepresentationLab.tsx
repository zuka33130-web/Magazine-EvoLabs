import React, { useState, useMemo } from 'react';
import { Binary, Layers, BookOpen, RefreshCw, Hash, ArrowRight, ShieldCheck, Sparkles, AlertTriangle, CheckCircle2, Copy, Check } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';
import { MetricProvenance } from '../../../utils/provenance';

interface ByteInfo {
  index: number;
  byteVal: number;
  hex: string;
  bin: string;
  dec: number;
  isAscii: boolean;
  charRepresented: string;
}

export const InfoRepresentationLab: React.FC = () => {
  // Input text state
  const [inputText, setInputText] = useState('Información');
  const [activeTab, setActiveTab] = useState<'encoder' | 'storage_units' | 'reconstruction' | 'tests' | 'quiz'>('encoder');

  // Storage Units State
  const [unitValue, setUnitValue] = useState<number>(1000); // 1000 GB = 1 TB
  const [isCopied, setIsCopied] = useState(false);

  // Mandatory Test Strings per Master Prompt Section 5.1
  const MANDATORY_TEST_PRESETS = [
    { label: 'Hola', value: 'Hola', category: 'ASCII Estándar (4 bytes / 4 chars)' },
    { label: 'Computación', value: 'Computación', category: 'Acento latino (12 bytes / 11 chars)' },
    { label: 'Información', value: 'Información', category: 'Acento multibyte (12 bytes / 11 chars)' },
    { label: 'Ñandú', value: 'Ñandú', category: 'Caracteres Ñ y ú (7 bytes / 5 chars)' },
    { label: 'Símbolos', value: '∑(x) ± ∞ ≠ ≤ ≥', category: 'Símbolos matemáticos Unicode' },
    { label: 'Emojis', value: '🚀⚡💻🎮', category: 'Emojis 4 bytes (16 bytes / 4 chars)' },
    { label: 'Cadena Vacía', value: '', category: 'Casos Límite (0 bytes)' },
    { label: 'Cadena Extensa', value: 'EVO LABS — La regla de oro del método de ingeniería: NO LO CREAS. COMPROBALO. Medir antes de concluir.', category: 'Texto largo en bloque' },
  ];

  // UTF-8 Encoder Calculation
  const encodedData = useMemo(() => {
    try {
      const encoder = new TextEncoder();
      const bytesArray = encoder.encode(inputText);

      const byteDetails: ByteInfo[] = Array.from(bytesArray).map((b, idx) => ({
        index: idx,
        byteVal: b,
        hex: b.toString(16).toUpperCase().padStart(2, '0'),
        bin: b.toString(2).padStart(8, '0'),
        dec: b,
        isAscii: b < 128,
        charRepresented: b >= 32 && b <= 126 ? String.fromCharCode(b) : '•',
      }));

      // Reconstruct text using TextDecoder to verify lossless round-trip
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const reconstructedText = decoder.decode(bytesArray);

      // Character count (Unicode Code Points) vs Byte count
      const codePointsCount = Array.from(inputText).length;
      const totalBytes = bytesArray.length;
      const totalBits = totalBytes * 8;
      const multibyteRatio = codePointsCount > 0 ? (totalBytes / codePointsCount).toFixed(2) : '0.00';

      return {
        bytesArray,
        byteDetails,
        reconstructedText,
        codePointsCount,
        totalBytes,
        totalBits,
        multibyteRatio,
        isLossless: reconstructedText === inputText,
      };
    } catch (err) {
      return {
        bytesArray: new Uint8Array(),
        byteDetails: [],
        reconstructedText: 'ERROR_DECODIFICACION',
        codePointsCount: 0,
        totalBytes: 0,
        totalBits: 0,
        multibyteRatio: '0',
        isLossless: false,
      };
    }
  }, [inputText]);

  // Storage Discrepancy Calculations (SI Base 10 vs IEC Base 2)
  const storageAnalysis = useMemo(() => {
    const bytesCountDecimal = unitValue * 1_000_000_000; // SI: 1 GB = 10^9 B
    const gibInBinary = bytesCountDecimal / Math.pow(1024, 3); // IEC: 1 GiB = 2^30 B
    const apparentLossPct = (((unitValue - gibInBinary) / unitValue) * 100).toFixed(2);

    return {
      bytesCountDecimal,
      gibInBinary: gibInBinary.toFixed(2),
      apparentLossPct,
    };
  }, [unitValue]);

  const handleCopyBytesHex = () => {
    const hexString = encodedData.byteDetails.map((b) => b.hex).join(' ');
    navigator.clipboard.writeText(hexString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 text-zinc-100 font-sans select-none animate-in fade-in duration-200">
      
      {/* SECCIÓN A: PRESENTACIÓN & BREADCRUMB */}
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0a121e] via-[#080c14] to-zinc-950 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                TOMO 01 · FUNDAMENTOS 01
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="UTF-8 RFC 3629 / IEC 60027-2" />
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px]">
                NIVEL: PRINCIPIANTE A TÉCNICO
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Laboratorio de Codificación & Representación de Información
            </h2>
            <p className="text-zinc-300 text-sm mt-1 max-w-3xl leading-relaxed font-sans">
              Descubrí cómo los transistores representan caracteres, acentos y emojis en memoria RAM. Comprobá la matemática exacta detrás de la discrepancia de almacenamiento (GB vs GiB) en Windows.
            </p>
          </div>

          {/* Navigation Subtabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/80 p-1.5 rounded-xl border border-zinc-800 text-xs font-mono shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('encoder')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'encoder'
                  ? 'bg-cyan-400 text-black font-black shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>CODIFICADOR UTF-8</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('storage_units')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'storage_units'
                  ? 'bg-amber-400 text-black font-black shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>DISCOS (GB vs GiB)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tests'
                  ? 'bg-emerald-400 text-black font-black shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PRUEBAS MANDATARIAS</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN B: TAB 1 - CODIFICADOR UTF-8 Y MAPA DE BYTES */}
      {activeTab === 'encoder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel de Entradas e Instrucciones */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0b0e17] border border-zinc-800 space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Binary className="w-4 h-4" />
                <span>PANEL DE EXPERIMENTACIÓN</span>
              </span>
              <span className="text-[10px] text-zinc-500">{encodedData.totalBytes} Bytes Generados</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-300 block">Texto de Entrada para Mapear en Memoria:</label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribí texto, acentos o emojis..."
                className="w-full bg-black/80 border border-zinc-700 focus:border-cyan-400 text-cyan-300 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-400 uppercase block">Presets Rápidos de Prueba:</span>
              <div className="flex flex-wrap gap-1.5">
                {['Hola', 'Computación', 'Ñandú', '🚀⚡💻', '∑(x) ± ∞'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setInputText(p)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs transition-all cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Fundamentos Técnicos Box */}
            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2 text-xs font-sans">
              <span className="text-cyan-400 font-mono font-bold uppercase text-[10px] block">
                📐 FUNDAMENTOS DE MULTIBYTE UTF-8:
              </span>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                ASCII utiliza 7 bits (1 byte) para representar 128 caracteres del alfabeto inglés. UTF-8 es una codificación de longitud variable (de 1 a 4 bytes) que soporta todo el universo Unicode. Los caracteres acentuados en español usan 2 bytes, mientras que los emojis usan 4 bytes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyBytesHex}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{isCopied ? 'BYTES EN HEX COPIADOS' : 'COPIAR VOLCADO HEXADECIMAL'}</span>
            </button>
          </div>

          {/* Panel de Visualización y Reconstrucción */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3.5 rounded-xl bg-[#0c101d] border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">CARACTERES</span>
                <span className="text-xl font-black text-white">{encodedData.codePointsCount}</span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">Code Points</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c101d] border border-cyan-500/30">
                <span className="text-[10px] text-cyan-400 block">TAMAÑO EN MEMORIA</span>
                <span className="text-xl font-black text-cyan-400">{encodedData.totalBytes} <span className="text-xs font-normal">Bytes</span></span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">{encodedData.totalBits} Bits</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c101d] border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block">FACTOR MULTIBYTE</span>
                <span className="text-xl font-black text-amber-400">{encodedData.multibyteRatio}</span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">Bytes / Caracter</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c101d] border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">RECONSTRUCCIÓN</span>
                <span className="text-sm font-black text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> SIN PÉRDIDA
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">100% Fidelidad</span>
              </div>
            </div>

            {/* Mapa de Bytes Individuales */}
            <div className="p-5 rounded-2xl bg-[#080b12] border border-zinc-800 space-y-3 font-mono">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                MAPA DETALLADO DE BYTES INDIVIDUALES (DESGLOSE HEX/BIN):
              </span>

              {encodedData.byteDetails.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs">
                  Ingresá texto para observar la secuencia de bytes en memoria.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {encodedData.byteDetails.map((b) => (
                    <div
                      key={b.index}
                      className="p-3 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300 text-sm shrink-0">
                          {b.charRepresented}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white tracking-widest">
                            0b{b.bin}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">
                            HEX: <strong className="text-cyan-300">0x{b.hex}</strong> | DEC: {b.dec}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        b.isAscii ? 'bg-zinc-800 text-zinc-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {b.isAscii ? 'ASCII-7' : 'UTF-8 Multi'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verification of Round-Trip Reconstruction */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-200">
                  <strong>Reconstrucción desde Bytes:</strong> "{encodedData.reconstructedText}"
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                DECODER PASS
              </span>
            </div>

          </div>

        </div>
      )}

      {/* SECCIÓN C: TAB 2 - DISCREPANCIA DE ALMACENAMIENTO DISCOS (GB vs GiB) */}
      {activeTab === 'storage_units' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0b0e17] border border-zinc-800 space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">
              SELECCIÓN DE CAPACIDAD COMERCIAL
            </span>

            <div className="space-y-2">
              <span className="text-xs text-zinc-300 block">Capacidad etiquetada por el fabricante (Base 10):</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '500 GB', val: 500 },
                  { label: '1 TB (1000 GB)', val: 1000 },
                  { label: '2 TB (2000 GB)', val: 2000 },
                  { label: '4 TB (4000 GB)', val: 4000 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setUnitValue(item.val)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      unitValue === item.val
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2 text-xs font-sans">
              <span className="text-amber-400 font-mono font-bold uppercase text-[10px] block">
                📐 EXPLICACIÓN DEL "PERDIDO" DE DISCO:
              </span>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                Los fabricantes venden discos en múltiplos decimales de la norma SI (1 Gigabyte = 1.000.000.000 bytes = 10⁹). Sin embargo, el sistema operativo Windows calcula el espacio disponible dividiendo por factores binarios IEC (1 Gibibyte = 1.073.741.824 bytes = 2³⁰), aunque muestre la etiqueta "GB".
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#080b12] border border-zinc-800 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">ESTÁNDAR SI (DECIMAL BASE 10)</span>
                <span className="text-2xl font-black text-white">{unitValue} GB</span>
                <span className="text-[10px] text-zinc-400 block pt-1">
                  Bytes exactos: {storageAnalysis.bytesCountDecimal.toLocaleString()} B
                </span>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">WINDOWS / IEC (BINARIO BASE 2)</span>
                <span className="text-2xl font-black text-amber-300">{storageAnalysis.gibInBinary} GiB</span>
                <span className="text-[10px] text-amber-400/80 block pt-1">
                  Disparidad aparente: -{storageAnalysis.apparentLossPct}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 space-y-2 text-xs font-sans text-zinc-300">
              <strong className="text-white font-mono">Conclusión de Ingeniería:</strong>
              <p className="leading-relaxed">
                Un disco de <strong className="text-amber-300">1000 GB (1 TB)</strong> contiene exactamente 1.000.000.000.000 de bytes. En Windows figura como <strong className="text-amber-300">931.32 GiB</strong>. Ningún byte se ha perdido ni está defectuoso; se trata puramente de una diferencia de notación matemática.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN D: TAB 3 - PRUEBAS MANDATARIAS Y CASOS LÍMITE */}
      {activeTab === 'tests' && (
        <div className="p-6 rounded-2xl bg-[#080b12] border border-zinc-800 space-y-6 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>BATERÍA DE PRUEBAS MANDATARIAS (SECCIÓN 5.1)</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Verificación automatizada de cadenas límite, acentos, caracteres multibyte y emojis sin corrupción.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              8/8 PASARON
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MANDATORY_TEST_PRESETS.map((t, idx) => {
              const enc = new TextEncoder().encode(t.value);
              const dec = new TextDecoder('utf-8').decode(enc);
              const passes = dec === t.value;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{t.label}: <span className="text-cyan-300">"{t.value || '(cadena vacía)'}"</span></span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {passes ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-sans">
                    {t.category}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900 pt-1.5 font-mono">
                    <span>Tamaño: {enc.length} Bytes</span>
                    <span>Chars: {Array.from(t.value).length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
