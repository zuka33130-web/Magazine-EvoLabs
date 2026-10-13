import React, { useState } from 'react';
import { DiagnosticTestRecord } from '../../types';
import { Terminal, Copy, Check, CheckCircle2, ChevronRight, Eye, HelpCircle, ArrowRight } from 'lucide-react';

interface DiagnosticTestStationProps {
  test: DiagnosticTestRecord;
  onRecordResult: (outcome: string, note: string) => void;
  isLastTest?: boolean;
}

export const DiagnosticTestStation: React.FC<DiagnosticTestStationProps> = ({
  test,
  onRecordResult,
  isLastTest = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [recorded, setRecorded] = useState(false);

  const handleCopy = () => {
    if (test.technicalCommand) {
      navigator.clipboard.writeText(test.technicalCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirm = () => {
    if (!selectedOutcome && !customNote.trim()) return;
    setRecorded(true);
    onRecordResult(selectedOutcome || 'OBSERVACIÓN REGISTRADA', customNote);
  };

  return (
    <div
      id={`prueba-tecnica-${test.id}`}
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1016] border border-zinc-700/80 shadow-2xl space-y-7 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">PRÓXIMA PRUEBA TÉCNICA</span>
          <span>•</span>
          <span>EVO DIAGNOSTIC EXPERIMENTAL</span>
        </div>
        <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
          {test.title}
        </h3>
      </div>

      {/* Section 1: ¿QUÉ QUEREMOS DESCUBRIR? */}
      <div className="p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 space-y-1.5">
        <span className="font-mono-tech text-[11px] font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-yellow-400" />
          ¿QUÉ QUEREMOS DESCUBRIR?
        </span>
        <p className="font-sans-editorial text-sm text-zinc-200 leading-relaxed font-medium">
          {test.goal}
        </p>
      </div>

      {/* Section 2: HACÉ ESTO */}
      <div className="space-y-3">
        <span className="font-mono-tech text-xs font-bold text-white uppercase tracking-wider block">
          HACÉ ESTO // PASO A PASO:
        </span>
        <ol className="space-y-2.5">
          {test.instructions.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-zinc-800/80 font-mono-tech text-xs text-zinc-300"
            >
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-black font-black text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Technical Command Box (if present) */}
      {test.technicalCommand && (
        <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-xs font-bold text-sky-400 uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              COMANDO TÉCNICO EN WINDOWS / POWERSHELL
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono-tech text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar comando'}</span>
            </button>
          </div>

          <pre className="p-3.5 rounded-xl bg-black border border-zinc-800 text-sky-300 font-mono-tech text-[11px] overflow-x-auto leading-relaxed">
            <code>{test.technicalCommand}</code>
          </pre>

          {/* Triad: Qué hace / Qué devuelve / Qué no demuestra */}
          {(test.whatItDoes || test.whatItReturns || test.whatItDoesNotProve) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 font-mono-tech text-[11px]">
              {test.whatItDoes && (
                <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <strong className="text-yellow-400 block text-[10px] uppercase mb-1">QUÉ HACE</strong>
                  <p className="text-zinc-400 leading-snug">{test.whatItDoes}</p>
                </div>
              )}
              {test.whatItReturns && (
                <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <strong className="text-sky-400 block text-[10px] uppercase mb-1">QUÉ DEVUELVE</strong>
                  <p className="text-zinc-400 leading-snug">{test.whatItReturns}</p>
                </div>
              )}
              {test.whatItDoesNotProve && (
                <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <strong className="text-rose-400 block text-[10px] uppercase mb-1">QUÉ NO DEMUESTRA</strong>
                  <p className="text-zinc-400 leading-snug">{test.whatItDoesNotProve}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Section 3: MIRÁ ESTO */}
      <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-700/60 space-y-1.5">
        <span className="font-mono-tech text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4 text-sky-400" />
          MIRÁ ESTO // DATO CONCRETO A OBSERVAR:
        </span>
        <p className="font-sans-editorial text-sm text-zinc-300 leading-relaxed">
          {test.whatToLookAt}
        </p>
      </div>

      {/* Section 4: DESPUÉS CONTAME QUÉ PASÓ */}
      <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-4">
        <span className="font-mono-tech text-xs font-bold text-yellow-400 uppercase tracking-wider block">
          DESPUÉS CONTAME QUÉ PASÓ // REGISTRO DE EVIDENCIA REAL:
        </span>

        {/* Preset quick observations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-tech text-xs">
          <button
            type="button"
            onClick={() => setSelectedOutcome('NO_SE_OBSERVARON_ANOMALIAS')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              selectedOutcome === 'NO_SE_OBSERVARON_ANOMALIAS'
                ? 'bg-yellow-400 text-black font-bold border-yellow-400'
                : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            ✓ Todo normal / No se observaron anomalías ni errores visibles
          </button>

          <button
            type="button"
            onClick={() => setSelectedOutcome('SE_DETECTO_EVENTO_O_PICO')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              selectedOutcome === 'SE_DETECTO_EVENTO_O_PICO'
                ? 'bg-yellow-400 text-black font-bold border-yellow-400'
                : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            ⚠ Se detectó un pico / error registrado o coincidencia de fecha
          </button>

          <button
            type="button"
            onClick={() => setSelectedOutcome('LA_FALLA_DESAPARECIO')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              selectedOutcome === 'LA_FALLA_DESAPARECIO'
                ? 'bg-yellow-400 text-black font-bold border-yellow-400'
                : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            ★ Al aplicar la prueba, el síntoma desapareció o mejoró
          </button>

          <button
            type="button"
            onClick={() => setSelectedOutcome('SIGUE_EXACTAMENTE_IGUAL')}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              selectedOutcome === 'SIGUE_EXACTAMENTE_IGUAL'
                ? 'bg-yellow-400 text-black font-bold border-yellow-400'
                : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            ✕ Sigue exactamente igual sin ninguna variación
          </button>
        </div>

        {/* Custom notes */}
        <div className="space-y-1.5 font-mono-tech text-xs">
          <label className="text-zinc-400 block text-[11px]">
            DETALLE ADICIONAL O NÚMERO OBSERVADO (OPCIONAL):
          </label>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Ej. El código de evento fue BugCheck 0x00000124 / el ping subió a 180 ms..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white font-mono-tech text-xs focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!selectedOutcome && !customNote.trim()}
            onClick={handleConfirm}
            className={`px-6 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer ${
              selectedOutcome || customNote.trim()
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-400/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <span>REGISTRAR RESULTADO DE LA PRUEBA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {recorded && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 font-mono-tech text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            EVIDENCIA REGISTRADA ✓ // Actualizando mapa de hipótesis vivas y descartes...
          </span>
        </div>
      )}
    </div>
  );
};
