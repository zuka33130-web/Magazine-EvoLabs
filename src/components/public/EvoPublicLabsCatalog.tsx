import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, FlaskConical, Search } from 'lucide-react';
import { CANONICAL_LABS, CANONICAL_TOMES, CanonicalPracticeLab } from '../../data/evoCatalog';

export interface EvoPublicLabsCatalogProps {
  onOpenRegisteredLab: (labId: string) => void;
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const categories = [...new Set(CANONICAL_LABS.map((lab) => lab.category))];
const kinds = { ALL: 'Todas', GUIADO: 'Guiados', SIMULADOR: 'Simuladores', CASO: 'Casos', CAMPUS: 'Campus' };

export function filterPracticeLabs(query: string, category: string, kind: string, status: string, tomo: string = 'ALL'): CanonicalPracticeLab[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return CANONICAL_LABS.filter((lab) => {
    const tome = CANONICAL_TOMES.find((item) => item.id === lab.tomo);
    const text = normalize([lab.title, lab.description, lab.category, lab.problem, lab.experiment,
      lab.outcome, lab.evidence, tome?.title, lab.tomo && `Tomo ${lab.tomo} Tomo ${Number(lab.tomo)}`].filter(Boolean).join(' '));
    return terms.every((term) => text.includes(term)) &&
      (category === 'ALL' || lab.category === category) &&
      (kind === 'ALL' || lab.kind === kind) && (status === 'ALL' || lab.status === status) &&
      (tomo === 'ALL' || (tomo === 'global' ? lab.tomo === null && lab.kind !== 'CAMPUS' : tomo === 'campus' ? lab.kind === 'CAMPUS' : lab.tomo === tomo));
  });
}

export const EvoPublicLabsCatalog: React.FC<EvoPublicLabsCatalogProps> = ({ onOpenRegisteredLab }) => {
  const [savedFilters] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('evo_practice_filters') || '{}');
      return {
        tomo: [...CANONICAL_TOMES.map(tome=>tome.id),'global','campus'].includes(saved.tomo) ? saved.tomo : 'ALL',
        query: typeof saved.query === 'string' ? saved.query : '',
        category: categories.includes(saved.category) ? saved.category : 'ALL',
        kind: Object.hasOwn(kinds, saved.kind) ? saved.kind : 'ALL',
        status: ['DISPONIBLE', 'EN DESARROLLO'].includes(saved.status) ? saved.status : 'ALL',
      };
    } catch { return { tomo: 'ALL', query: '', category: 'ALL', kind: 'ALL', status: 'ALL' }; }
  });
  const [tomo, setTomo] = useState(savedFilters.tomo);
  const [closedGroups,setClosedGroups] = useState<Record<string,boolean>>({});
  const [query, setQuery] = useState(savedFilters.query);
  const [category, setCategory] = useState(savedFilters.category);
  const [kind, setKind] = useState(savedFilters.kind);
  const [status, setStatus] = useState(savedFilters.status);
  useEffect(()=>setClosedGroups({}),[query, category, kind, status, tomo]);
  useEffect(() => {
    try { sessionStorage.setItem('evo_practice_filters', JSON.stringify({ query, category, kind, status, tomo })); } catch {}
  }, [query, category, kind, status, tomo]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = useMemo(() => filterPracticeLabs(query, category, kind, status, tomo), [query, category, kind, status, tomo]);
  const groups = [
    ...CANONICAL_TOMES.map((tome) => ({
      id: tome.id, title: `TOMO ${tome.tomoNumber} — ${tome.title}`,
      labs: filtered.filter((lab) => lab.tomo === tome.id),
    })),
    { id: 'global', title: 'RECURSOS GLOBALES', labs: filtered.filter((lab) => lab.tomo === null && lab.kind !== 'CAMPUS') },
    { id: 'campus', title: 'ZONAS DEL CAMPUS', labs: filtered.filter((lab) => lab.kind === 'CAMPUS') },
  ];
  const availableCount = CANONICAL_LABS.filter((lab) => lab.status === 'DISPONIBLE' && lab.target).length;
  const reset = () => { setQuery(''); setCategory('ALL'); setKind('ALL'); setStatus('ALL'); setTomo('ALL'); };

  return (
    <div className="w-full text-zinc-100 font-sans-editorial space-y-6 py-6 sm:py-10">
      <div className="space-y-3 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-amber-400 font-mono-tech text-xs font-black uppercase tracking-widest">
          <FlaskConical className="w-5 h-5" /> PRACTICAR // LABORATORIOS EVO
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase">No lo creas. <span className="text-amber-400">Comprobalo.</span></h1>
        <p className="text-sm text-zinc-300 max-w-3xl">Todos los bancos, simuladores y laboratorios internos en un solo catálogo. Elegí un tomo y una categoría y abrí directamente la experiencia que querés practicar.</p>
        <p className="font-mono-tech text-xs text-cyan-400">{availableCount} accesos funcionales · {CANONICAL_LABS.length - availableCount} bancos en desarrollo</p>
        <p className="text-xs text-zinc-500">La disponibilidad indica que el laboratorio está implementado. Se mantienen los permisos y requisitos de acceso de cada experiencia.</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-zinc-800 p-4 sm:p-5">
        <label className="block space-y-2">
          <span className="text-xs font-mono-tech uppercase text-zinc-300">Buscar laboratorio, tema o tomo</span>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-cyan-400" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej.: DNS, scheduler, Tomo 11…" className="w-full bg-black/40 rounded-xl border border-zinc-700 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
          </div>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="space-y-2 text-xs font-mono-tech text-zinc-300"><span className="block uppercase">Tomo propietario</span><select value={tomo} onChange={event=>setTomo(event.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 focus:border-amber-400"><option value="ALL">Todos los tomos</option>{CANONICAL_TOMES.map(item=><option key={item.id} value={item.id}>Tomo {item.tomoNumber} · {item.title}</option>)}<option value="global">Recursos globales</option><option value="campus">Campus EVO</option></select></label>
          <label className="space-y-2 text-xs font-mono-tech text-zinc-300">
            <span className="block uppercase">Categoría técnica</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 focus:border-amber-400">
              <option value="ALL">Todas las categorías</option>
              {categories.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-xs font-mono-tech text-zinc-300">
            <span className="block uppercase">Disponibilidad</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 focus:border-amber-400">
              <option value="ALL">Todos los estados</option><option value="DISPONIBLE">Disponibles</option><option value="EN DESARROLLO">En desarrollo</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Tipo de experiencia">
          {Object.entries(kinds).map(([value, label]) => <button type="button" key={value} aria-pressed={kind === value} onClick={() => setKind(value)} className={`px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${kind === value ? 'bg-amber-400 text-black border-amber-400' : 'border-zinc-700 text-zinc-300 hover:border-cyan-400'}`}>{label}</button>)}
          <button type="button" onClick={reset} className="px-3 py-2 text-xs text-cyan-400 hover:text-cyan-300">Limpiar filtros</button>
        </div>
      </div>

      <p role="status" className="text-xs text-zinc-400 font-mono-tech">{filtered.length} resultados de {CANONICAL_LABS.length}</p>
      {filtered.length === 0 && <div className="p-6 border border-zinc-800 rounded-xl text-sm text-zinc-300">No hay laboratorios que coincidan con estos filtros. <button type="button" onClick={reset} className="text-amber-400 underline">Mostrar todos</button></div>}
      {groups.filter((group) => group.labs.length > 0 || (query === '' && category === 'ALL' && kind === 'ALL' && status === 'ALL' && tomo === 'ALL')).map((group) => (
        <details key={group.id} data-tomo-group={group.id} open={!closedGroups[group.id]} onToggle={event=>{const closed=!event.currentTarget.open;if(closed!==!!closedGroups[group.id])setClosedGroups(prev=>({...prev,[group.id]:closed}));}} className="space-y-5" aria-label={group.title}>
          <summary className="cursor-pointer"><h2 className="inline font-display font-black text-xl uppercase text-amber-400 border-b border-zinc-700 pb-3">{group.title} <span className="text-zinc-400 text-sm">({group.labs.length})</span></h2></summary>
          {group.labs.length === 0 && <p className="text-xs text-zinc-500">Sin laboratorios registrados en este tomo.</p>}
          {categories.filter((value) => group.labs.some((lab) => lab.category === value)).map((value) => (
            <section key={value} className="space-y-4" aria-label={value}>
              <h3 className="font-display font-bold text-lg uppercase text-cyan-400 border-b border-zinc-800 pb-2">{value} <span className="text-zinc-500 text-sm">({group.labs.filter((lab) => lab.category === value).length})</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {group.labs.filter((lab) => lab.category === value).map((lab) => {
                  const tome = CANONICAL_TOMES.find((item) => item.id === lab.tomo);
                  const available = lab.status === 'DISPONIBLE' && lab.target !== null;
                  const hasDetail = Boolean(lab.problem || lab.experiment || lab.outcome || lab.evidence);
                  return <article key={lab.id} data-lab-id={lab.id} className="flex flex-col gap-4 p-5 rounded-2xl border border-zinc-800 hover:border-cyan-500/50 transition-colors bg-black/20">
                    <div className="flex flex-wrap justify-between gap-2 text-[10px] font-mono-tech uppercase">
                      <span className="text-cyan-300">{lab.kind} · {lab.category}</span>
                      <span className={available ? 'text-emerald-400' : 'text-zinc-500'}>{lab.status}</span>
                    </div>
                    <h4 className="font-display font-black text-base text-white uppercase leading-snug">{lab.title}</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">{lab.description}</p>
                    {tome && <p className="text-[11px] text-amber-300 font-mono-tech">Tomo {tome.tomoNumber} · {tome.title}</p>}
                    {hasDetail && <button type="button" aria-expanded={expanded === lab.id} aria-controls={`detail-${lab.id}`} onClick={() => setExpanded(expanded === lab.id ? null : lab.id)} className="text-xs text-zinc-300 flex items-center gap-2 self-start">{expanded === lab.id ? 'Ocultar detalle' : 'Ver detalle'}<ChevronDown className="w-4 h-4 text-amber-400" /></button>}
                    {expanded === lab.id && <div id={`detail-${lab.id}`} className="space-y-3 border-t border-zinc-800 pt-3 text-xs">
                      {[["Problema", lab.problem], ["Experimento", lab.experiment], ["Aprendizaje", lab.outcome], ["Evidencia", lab.evidence]].filter(([, text]) => text).map(([label, text]) => <p key={label} className="text-zinc-300 leading-relaxed"><span className="block text-cyan-400 font-bold uppercase text-[10px]">{label}</span>{text}</p>)}
                    </div>}
                    <button type="button" disabled={!available} onClick={() => onOpenRegisteredLab(lab.id)} className="mt-auto w-full rounded-xl py-2.5 px-3 text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 bg-amber-400 text-black hover:bg-amber-300 disabled:bg-zinc-900 disabled:text-zinc-500 disabled:cursor-not-allowed">
                      Abrir laboratorio{available && <ArrowRight className="w-4 h-4 shrink-0" />}
                    </button>
                  </article>;
                })}
              </div>
            </section>
          ))}
        </details>
      ))}
    </div>
  );
};
