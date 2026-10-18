import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, FlaskConical, Search, ShieldCheck } from 'lucide-react';
import { EVO_WINDOWS40_RESEARCH } from '../../data/tomo02Magazine40Corpus';
import { EVO_WINDOWS_40_ARTICLES } from '../../data/tomo02Magazine40';
import type { EvoWindowsResearch } from '../../data/tomo02Magazine40CorpusTypes';

/**
 * Lector de REVISIÓN para los borradores 002–040.
 * No forma parte del PDF A4 ni declara manuscritos incompletos como publicados.
 * La Biblia Virtual y la investigación 001 se mantienen independientes.
 */
type Props = { onReturnToMagazine: () => void };
const sections: readonly {key: keyof Pick<EvoWindowsResearch,
  'premise' | 'mechanisms' | 'traps' | 'protocol' | 'interpretation' | 'conclusion'>;
  title: string; kicker: string}[] = [
  {key:'premise', title:'El misterio', kicker:'01 / EL PUNTO DE PARTIDA'},
  {key:'mechanisms', title:'Qué ocurre realmente dentro de Windows', kicker:'02 / ARQUITECTURA Y TEORÍA'},
  {key:'traps', title:'Las falsas pistas', kicker:'03 / MITOS Y ERRORES'},
  {key:'protocol', title:'El experimento reproducible', kicker:'04 / MÉTODO EVO'},
  {key:'interpretation', title:'Cómo interpretar los resultados', kicker:'05 / ANÁLISIS Y EVIDENCIA'},
  {key:'conclusion', title:'El veredicto técnico', kicker:'06 / LO QUE TE LLEVÁS'},
];

const pad = (n:number) => String(n).padStart(3,'0');

export const Tomo02MagazineDraftPreview: React.FC<Props> = ({onReturnToMagazine}) => {
  const [selectedNumber,setSelectedNumber] = React.useState(2);
  const [search,setSearch] = React.useState('');
  const manuscript = EVO_WINDOWS40_RESEARCH.find(a=>a.number===selectedNumber);
  const book = EVO_WINDOWS_40_ARTICLES[selectedNumber-1];
  const filtered = EVO_WINDOWS_40_ARTICLES.slice(1).filter(a=>
    a.title.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')) ||
    pad(a.number).includes(search.trim())
  );
  const select = (id:number) => {
    setSelectedNumber(id);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  if (!manuscript || !book) return <section className="mx-auto max-w-3xl p-8 text-white">No se encontró el manuscrito solicitado. <button type="button" onClick={onReturnToMagazine}>Volver</button></section>;

  return (
    <main className="min-h-screen bg-[#030911] text-white" id="evo-magazine40-draft-preview">
      <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#25DEFF] bg-gradient-to-r from-[#05152B] via-[#054E87] to-[#042743] px-5 py-3 shadow-[0_10px_35px_rgba(0,140,236,0.27)]">
        <button type="button" onClick={onReturnToMagazine} className="inline-flex items-center gap-2 rounded-lg border border-[#7ADBFF] bg-[#062842] px-4 py-2 font-mono-tech text-xs font-extrabold text-white hover:bg-[#0876B6]"><ArrowLeft size={16}/> VOLVER AL MAGAZINE A4</button>
        <span className="font-mono-tech text-[11px] font-black tracking-widest">EVO LABS / REVISIÓN EDITORIAL 002–040</span>
        <span className="rounded border border-amber-300 bg-amber-400/10 px-3 py-1 font-mono-tech text-[10px] font-black text-amber-200">BORRADORES · NO EDICIÓN FINAL</span>
      </nav>
      <div className="mx-auto grid max-w-[1460px] grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-[89px] lg:max-h-[calc(100vh-108px)] lg:self-start lg:overflow-y-auto rounded-xl border border-[#1E85C5] bg-[#061525] shadow-[0_0_24px_rgba(0,113,193,0.12)]">
          <div className="sticky top-0 z-10 border-b border-[#237AB0] bg-[#08233D] p-4">
            <div className="mb-3 flex items-center gap-2 font-mono-tech text-[11px] font-black tracking-wider text-[#67DFFF]"><BookOpen size={17}/> 39 MANUSCRITOS DISPONIBLES</div>
            <label htmlFor="evo-draft-search" className="sr-only">Buscar por título o número</label>
            <div className="flex items-center gap-2 rounded-lg border border-[#387DAD] bg-[#020A15] px-3"><Search size={16} className="text-[#75DFFF]"/><input id="evo-draft-search" value={search} onChange={e=>setSearch(e.target.value)} className="min-w-0 w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#9EB5CC]" placeholder="Buscar 002–040..." /></div>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {filtered.map(a=><button key={a.number} type="button" onClick={()=>select(a.number)} aria-current={selectedNumber===a.number?'page':undefined}
              className={'flex w-full items-start gap-2 rounded-lg border px-3 py-3 text-left transition-colors '+(selectedNumber===a.number?'border-[#49DAFF] bg-[#075A94] text-white shadow-[0_0_18px_rgba(0,201,255,0.23)]':'border-transparent text-[#D7EAF7] hover:border-[#1D7AA9] hover:bg-[#0B3151]')}>
              <strong className="font-mono-tech text-[12px] text-[#70E7FF]">{pad(a.number)}</strong>
              <span className="text-[12px] font-bold leading-snug">{a.title}</span>
            </button>)}
            {!filtered.length && <p className="p-4 text-sm text-[#B4C9DC]">No hay resultados para esa búsqueda.</p>}
          </div>
        </aside>
        <article className="min-w-0 max-w-[980px] overflow-hidden rounded-xl border border-[#217FB5] bg-gradient-to-b from-[#071E36] via-[#050E1D] to-[#030814] shadow-[0_20px_70px_rgba(0,0,0,0.52)]">
          <header className="border-b-2 border-[#22CFFF] bg-gradient-to-br from-[#0B497C] via-[#09233D] to-[#06101F] p-6 md:p-9">
            <p className="font-mono-tech text-[11px] font-black tracking-widest text-[#91ECFF]">EVO LABS · TOMO 02 · EXPEDIENTE {pad(manuscript.number)}</p>
            <h1 className="mt-4 font-display text-[clamp(26px,3vw,42px)] font-black uppercase leading-tight tracking-tight text-white">{book.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-md border border-amber-300/65 bg-amber-300/15 px-2 py-1 font-mono-tech text-[10px] font-black text-amber-100">MANUSCRITO PRELIMINAR</span>
              <span className="font-mono-tech text-[11px] text-[#B8DBEF]">6 secciones · laboratorio de solo lectura · fuentes técnicas</span>
            </div>
            <p className="mt-5 border-l-4 border-[#26D5FA] bg-[#05223D] p-4 text-[13px] leading-relaxed text-[#D9F3FF]">
              Vista de revisión: esta investigación existe como borrador técnico. Todavía necesita ampliación, edición y maquetación A4 definitiva antes de considerarse publicada.
            </p>
          </header>
          <div className="space-y-9 p-5 md:p-9">
            {sections.map((section,i)=><section key={section.key} className="break-inside-avoid border-b border-[#235474] pb-7">
              <p className="font-mono-tech text-[11px] font-black tracking-wider text-[#65E3FF]">{section.kicker}</p>
              <h2 className="mt-2 mb-5 font-display text-[23px] font-black uppercase text-white">{section.title}</h2>
              <div className="grid gap-4 text-[14px] leading-[1.77] text-[#E4F0F9] md:grid-cols-2">
                {manuscript[section.key].map((paragraph,j)=><p key={j}>{paragraph}</p>)}
              </div>
              {i===0 && <aside className="mt-5 border-l-4 border-[#00D2FF] bg-[#0C3658] p-4 text-[13px] text-[#E2F6FF]"><b className="mb-2 block font-mono-tech text-[11px] text-[#7EE6FF]">PREGUNTA CLAVE EVO</b>{manuscript.insight}</aside>}
              {section.key==='protocol' && <div className="mt-6 overflow-hidden rounded-lg border border-[#1ED4FF] bg-[#020B18]">
                <div className="flex items-center gap-2 bg-[#0067B5] px-4 py-3 font-mono-tech text-xs font-black text-white"><FlaskConical size={16}/>{manuscript.lab.title}</div>
                <p className="p-4 text-[13px] leading-relaxed text-[#D7EFFC]">{manuscript.lab.why}</p>
                <pre className="max-w-full overflow-x-auto border-y border-[#235A80] bg-[#010610] p-4 text-[12px] leading-relaxed text-[#65EFFF]"><code>{manuscript.lab.code}</code></pre>
                <p className="p-4 text-[12px] leading-relaxed text-[#A9DDEC]">{manuscript.lab.readout}</p>
                <p className="border-t border-[#195070] px-4 py-2 font-mono-tech text-[10px] font-bold text-[#9CE3FA]">CÓDIGO PARA INSPECCIÓN DEL LECTOR · NO SE EJECUTA AUTOMÁTICAMENTE</p>
              </div>}
            </section>)}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-[#217EAE] bg-[#0B3351] p-5"><h3 className="font-mono-tech text-[11px] font-black text-[#70E8FF]">DESAFÍO EVO</h3><p className="mt-3 text-[13px] leading-relaxed">{manuscript.challenge}</p></div>
              <div className="rounded-lg border border-[#2478A5] bg-[#0B2B46] p-5"><h3 className="font-mono-tech text-[11px] font-black text-[#70E8FF]">GANCHO PARA VIDEO</h3><p className="mt-3 text-[13px] leading-relaxed">{manuscript.video}</p></div>
            </div>
            <section className="rounded-lg border border-[#1E6D9C] p-5">
              <h3 className="flex items-center gap-2 font-mono-tech text-[11px] font-black tracking-wider text-[#66DBFF]"><ShieldCheck size={16}/> FUENTES DEL MANUSCRITO · VERIFICAR VIGENCIA</h3>
              <ul className="mt-3 space-y-2">
                {manuscript.sources.map((source,i)=><li key={i} className="break-all text-[12px] leading-relaxed text-[#D8EFFA]"><a href={source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-[#40B3E8] underline-offset-4 hover:text-[#53E9FF]">{source.name}</a></li>)}
              </ul>
            </section>
            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#3388B3] pt-6">
              <button type="button" disabled={selectedNumber<=2} onClick={()=>select(selectedNumber-1)} className="inline-flex items-center gap-2 rounded-lg border border-[#2CB3E5] px-4 py-3 font-mono-tech text-xs font-bold text-[#D9F6FF] disabled:cursor-not-allowed disabled:opacity-30 hover:bg-[#084A78]"><ArrowLeft size={16}/> ANTERIOR</button>
              <span className="font-mono-tech text-xs text-[#8BCCEB]">{pad(selectedNumber)} / 040</span>
              <button type="button" disabled={selectedNumber>=40} onClick={()=>select(selectedNumber+1)} className="inline-flex items-center gap-2 rounded-lg border border-[#2CB3E5] bg-[#07578F] px-4 py-3 font-mono-tech text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-30 hover:bg-[#0078D4]">SIGUIENTE <ArrowRight size={16}/></button>
            </footer>
          </div>
        </article>
      </div>
    </main>
  );
};
