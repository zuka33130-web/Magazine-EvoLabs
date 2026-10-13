import React, { useMemo, useState } from 'react';
import { TOMO_02_CASE_LIBRARY } from '../../../data/tomo02CaseLibrary';
import { TOMO_02_MASTER_SECTORS } from '../../../data/tomo02MasterSectors';
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const Tomo02CaseLibrary: React.FC = () => {
  const [query, setQuery] = useState(''), [category, setCategory] = useState('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answer, setAnswer] = useState<number | null>(null), [revealed, setRevealed] = useState(false);
  const categories = TOMO_02_MASTER_SECTORS.find((sector) => sector.sectorNumber === '37')?.categories || [];
  const filtered = useMemo(() => TOMO_02_CASE_LIBRARY.filter((item) => (category === 'ALL' || category === item.category) &&
    normalize(`${item.title} ${item.symptom} ${item.source}`).includes(normalize(query))), [query, category]);
  const selected = TOMO_02_CASE_LIBRARY.find((item) => item.id === selectedId);
  return <section className="space-y-4 p-5 border border-cyan-500/40 rounded-2xl" aria-label="Biblioteca de problemas">
    <h2 className="text-xl font-display text-cyan-300 font-black">Biblioteca de problemas · {TOMO_02_CASE_LIBRARY.length} expedientes didácticos</h2>
    <p className="text-xs text-zinc-400">Fuentes existentes preservadas y casos nuevos de los sectores. No son capturas de tu PC ni expedientes de clientes verificados. La colección es ampliable; no se anuncia una cantidad inexistente.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      <label className="text-xs text-cyan-300">Buscar síntoma<input value={query} onChange={(event) => setQuery(event.target.value)} className="block w-full bg-black/50 p-2 rounded-lg border border-zinc-700 text-white" /></label>
      <label className="text-xs text-cyan-300">Categoría<select value={category} onChange={(event) => setCategory(event.target.value)} className="block w-full bg-zinc-950 p-2 rounded-lg"><option value="ALL">Todas</option>{categories.map((value) => <option key={value} value={value}>{value} ({TOMO_02_CASE_LIBRARY.filter((item) => item.category === value).length})</option>)}</select></label>
    </div>
    <p role="status" className="text-sm">{filtered.length} resultados</p>
    {filtered.length === 0 && <p>No hay expedientes de esa categoría/filtro en la colección actual.</p>}
    <div className="max-h-72 overflow-y-auto space-y-2">
      {filtered.map((item) => <button type="button" key={item.id} onClick={() => { setSelectedId(item.id); setAnswer(null); setRevealed(false); }} className="block w-full text-left p-3 rounded-lg border border-zinc-700 hover:border-cyan-400 text-sm"><span className="text-cyan-400 text-xs block">{item.category} · {item.source}</span>{item.title}</button>)}
    </div>
    {selected && <article className="space-y-3 border-t border-zinc-700 pt-4">
      <h3 className="font-bold text-amber-300">{selected.title}</h3>
      {[['Síntoma', selected.symptom], ['Hipótesis por contrastar', selected.hypothesis], ['Prueba disponible', selected.test], ['Evidencia didáctica', selected.evidence]].map(([label, text]) => <p key={label} className="text-sm whitespace-pre-wrap"><strong className="text-cyan-300 block">{label}</strong>{text}</p>)}
      <p className="text-sm">Elegí una hipótesis/acción antes de revelar la resolución:</p>
      {selected.choices.map((choice, index) => <button type="button" key={index} onClick={() => setAnswer(index)} aria-pressed={answer === index} className={`block w-full text-left p-3 rounded-lg border text-sm ${answer === index ? 'border-amber-400' : 'border-zinc-700'}`}>{choice.text}</button>)}
      {answer !== null && <p role="status" className={selected.choices[answer].correct ? 'text-emerald-300' : 'text-amber-300'}>{selected.choices[answer].feedback}</p>}
      <button type="button" disabled={answer === null} onClick={() => setRevealed(!revealed)} className="px-3 py-2 bg-cyan-500 text-black rounded-lg text-sm font-bold disabled:opacity-40">{revealed ? 'Ocultar resolución' : 'Revelar resolución'}</button>
      {revealed && [['Causa/criterio demostrado en el ejemplo', selected.rootCause], ['Procedimiento', selected.resolution], ['Validación', selected.validation], ['Riesgo y reversión', selected.rollback]].map(([label, text]) => <p key={label} className="text-sm whitespace-pre-wrap"><strong className="block text-cyan-300">{label}</strong>{text}</p>)}
    </article>}
  </section>;
};
