import React, { useState } from 'react';
import { compareSeries } from '../../../data/tomo02AdvancedProgress';
import { safeStorage } from '../../../utils/safeStorage';

const fields = ['symptom', 'hypothesis', 'context', 'metric', 'unit', 'intervention', 'rollback', 'limitations', 'conclusion'] as const;
const labels = ['Síntoma y tarea reproducible', 'Hipótesis falsable', 'Contexto: build, carga, alimentación y condiciones', 'Métrica', 'Unidad', 'Una única intervención', 'Cómo revertir', 'Limitaciones y pruebas de estabilidad', 'Conclusión justificada'];
const initial = { symptom: '', hypothesis: '', context: '', metric: '', unit: '', intervention: '', rollback: '', limitations: '', conclusion: '', before: '', after: '', origin: 'SIMULATED', direction: 'LOWER', verdict: 'INCONCLUSIVE', comparable: false };
const storageKey = 'evo_tomo02_sector39_experiment_v1';
export function parseExperimentSamples(text: string): number[] {
  if (!text.trim()) return [];
  const tokens = text.trim().split(/[;\s]+/);
  return tokens.map((token) => /^\d+(?:[.,]\d+)?$/.test(token) ? Number(token.replace(',', '.')) : NaN);
}
export const Tomo02FinalExperiment: React.FC<{ onEvidence: (summary: string) => void; onEvidenceInvalidated?: () => void }> = ({ onEvidence, onEvidenceInvalidated }) => {
  const [form, setForm] = useState(() => {
    try {
      const saved = JSON.parse(safeStorage.getItem(storageKey) || '{}');
      return { ...initial, ...Object.fromEntries(Object.entries(saved).filter(([key, value]) => key in initial && typeof value === typeof initial[key as keyof typeof initial])) };
    } catch { return initial; }
  });
  const set = <K extends keyof typeof initial>(key: K, value: typeof initial[K]) => {
    onEvidenceInvalidated?.();
    const next = { ...form, [key]: value }; setForm(next); safeStorage.setItem(storageKey, JSON.stringify(next));
  };
  const comparison = compareSeries(parseExperimentSamples(form.before), parseExperimentSamples(form.after));
  const complete = fields.every((field) => form[field].trim().length > 0) && Boolean(comparison) &&
    (form.comparable || form.verdict === 'INCONCLUSIVE');
  const download = () => {
    if (!complete || !comparison) return;
    const report = { schema: 1, title: 'EXPEDIENTE WINDOWS EVO 001', createdAt: new Date().toISOString(), ...form,
      source: form.origin === 'SIMULATED' ? 'SIMULATED' : 'USER_INPUT_NOT_VERIFIED',
      before: parseExperimentSamples(form.before), after: parseExperimentSamples(form.after), comparison,
      automaticTelemetry: false, certification: false };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'EXPEDIENTE-WINDOWS-EVO-001.json'; link.click(); URL.revokeObjectURL(url);
    onEvidence(`${report.source}: ${form.metric} (${form.unit}); mediana ${comparison.baseline.median} → ${comparison.result.median}; delta ${comparison.delta}; ${form.verdict}. ${form.conclusion}`);
  };
  return <section className="p-5 rounded-2xl border border-amber-400/50 space-y-4" aria-label="Expediente final">
    <h2 className="font-display font-black text-xl text-amber-400">EXPEDIENTE WINDOWS EVO 001</h2>
    <p className="text-sm text-zinc-300">Datos simulados o ingresados por vos, sin detección automática. Registrá al menos tres muestras equivalentes por serie; separalas con espacios o punto y coma. Se admite coma decimal. No incluyas claves, tokens ni datos personales.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {fields.map((field, index) => <label key={field} className="text-xs text-cyan-300 space-y-1">{labels[index]}<textarea value={form[field]} onChange={(event) => set(field, event.target.value)} className="block w-full bg-black/50 border border-zinc-700 rounded-lg p-2 text-zinc-100" /></label>)}
      {(['before', 'after'] as const).map((field) => <label key={field} className="text-xs text-cyan-300">{field === 'before' ? 'Muestras de baseline' : 'Muestras después'}<input value={form[field]} onChange={(event) => set(field, event.target.value)} placeholder="120; 118; 125" className="block w-full bg-black/50 border border-zinc-700 rounded-lg p-2 text-white" /></label>)}
      <label className="text-xs text-cyan-300">Procedencia<select value={form.origin} onChange={(event) => set('origin', event.target.value)} className="block w-full bg-zinc-950 p-2 rounded-lg"><option value="SIMULATED">SIMULADO</option><option value="USER_INPUT">Ingresado por el operador; no verificado</option></select></label>
      <label className="text-xs text-cyan-300">Dirección de mejora<select value={form.direction} onChange={(event) => set('direction', event.target.value)} className="block w-full bg-zinc-950 p-2 rounded-lg"><option value="LOWER">Menor es mejor</option><option value="HIGHER">Mayor es mejor</option></select></label>
      <label className="text-xs text-cyan-300">Veredicto<select value={form.verdict} onChange={(event) => set('verdict', event.target.value)} className="block w-full bg-zinc-950 p-2 rounded-lg"><option value="INCONCLUSIVE">Inconcluso</option><option value="KEEP">Conservar, con justificación</option><option value="REVERT">Revertir, con justificación</option></select></label>
    </div>
    <label className="flex gap-2 text-sm"><input type="checkbox" checked={form.comparable} onChange={(event) => set('comparable', event.target.checked)} />Declaro misma carga y condiciones, y una sola variable intervenida.</label>
    <div role="status" className="text-sm font-mono-tech text-cyan-300">
      {comparison ? <>Medianas: {comparison.baseline.median} → {comparison.result.median} {form.unit}. Delta: {comparison.delta.toFixed(3)} {form.unit}; {comparison.percent === null ? 'porcentaje no definido (baseline cero)' : `${comparison.percent.toFixed(2)}%`}. Rango antes: {comparison.baseline.min}–{comparison.baseline.max}; después: {comparison.result.min}–{comparison.result.max}. {comparison.delta === 0 ? 'Sin cambio de mediana.' : (comparison.delta < 0) === (form.direction === 'LOWER') ? 'Dirección favorable; no prueba causalidad.' : 'Dirección desfavorable; revisá reversión.'}</> : 'Ingresá al menos tres valores finitos no negativos por serie, con igual cantidad; no uses unidades dentro de las muestras.'}
    </div>
    {!form.comparable && <p className="text-xs text-amber-300">Sin condiciones comparables, el veredicto debe ser inconcluso.</p>}
    <button type="button" disabled={!complete} onClick={download} className="bg-amber-400 text-black px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-40">Exportar expediente y registrar evidencia</button>
  </section>;
};
