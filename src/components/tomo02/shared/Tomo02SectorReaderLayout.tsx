import React, { useState } from 'react';
import { ArrowLeft, Award, BookOpen, Lightbulb, Search, Sparkles, Terminal } from 'lucide-react';
import type { WindowsInvestigation } from '../../../data/tomo02Investigations';
export type ReaderTab = 'reader' | 'mission' | 'test';
interface Props {
  number: string; title: string; subtitle: string; investigations: WindowsInvestigation[];
  activeId: string; completedIds: Set<string>; tab: ReaderTab;
  onSelect: (id:string)=>void; onTab: (tab:ReaderTab)=>void; onBack:()=>void; onTutor:()=>void;
  children: React.ReactNode;
}
/** Extracted layout and class tokens from the actual sector 01 reader.
 * The original reader is deliberately untouched; advanced sectors share this one component.
 */
export const Tomo02SectorReaderLayout: React.FC<Props> = ({number,title,subtitle,investigations,activeId,completedIds,tab,onSelect,onTab,onBack,onTutor,children}) => {
  const [query,setQuery]=useState(''), [category,setCategory]=useState('ALL');
  const categories=[...new Set(investigations.map(inv=>inv.category).filter((item):item is string=>!!item))];
  const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const filtered=investigations.filter(inv=>(category==='ALL'||inv.category===category) && normalize(`${inv.code} ${inv.title} ${inv.subtitle}`).includes(normalize(query)));
  const active=investigations.find(inv=>inv.id===activeId)!;
  return <div className="min-h-screen bg-[#05070A] text-zinc-100 flex flex-col font-sans selection:bg-[#0078D4] selection:text-white" data-sector={number} data-reader-system="sector-01">
    <header className="sticky top-0 z-40 bg-[#080B10]/95 backdrop-blur-md border-b border-sky-500/20 px-4 sm:px-6 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={onBack} className="px-3 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-300 hover:text-[#60CDFF] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer"><ArrowLeft className="w-3.5 h-3.5 text-[#00A4EF]"/>ÍNDICE</button>
          <div><span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0078D4]/20 text-[#60CDFF] border border-[#00A4EF]/40">SECTOR {number}</span><h1 className="text-xs font-bold text-white tracking-wide mt-1">{title}</h1></div>
        </div>
        <nav aria-label="Vistas del sector" className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#11161D] p-1 rounded-xl border border-sky-500/20 text-xs font-mono">
            {([['reader','Investigaciones',BookOpen],['mission','Misión',Terminal],['test','Test',Award]] as const).map(([value,label,Icon])=><button type="button" key={value} onClick={()=>onTab(value)} aria-pressed={tab===value} className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${tab===value?'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white font-bold shadow-[0_0_12px_rgba(0,164,239,0.3)]':'text-zinc-400 hover:text-zinc-200'}`}><Icon className="w-3.5 h-3.5"/>{label}</button>)}
          </div>
          <button type="button" onClick={onTutor} className="px-3 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] text-[#60CDFF] border border-sky-500/20 text-xs font-mono flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/>Tutor EVO</button>
        </nav>
      </div>
    </header>
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
      <p className="text-xs text-[#60CDFF] font-mono mb-4">{subtitle}</p>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="lg:col-span-4 space-y-3 bg-[#080B10] p-3 rounded-2xl border border-sky-500/20 shadow-xl" aria-label="Investigaciones del sector">
          <div className="flex items-center justify-between px-2 py-1 text-xs font-mono text-zinc-400"><span className="font-bold text-[#60CDFF] uppercase">INVESTIGACIONES ({investigations.length})</span><span className="text-white font-bold" data-investigation-progress>{completedIds.size} / {investigations.length}</span></div>
          <div className="w-full h-1.5 rounded-full bg-[#151B23] overflow-hidden border border-sky-500/20" role="progressbar" aria-label="Progreso de investigaciones" aria-valuenow={completedIds.size} aria-valuemin={0} aria-valuemax={investigations.length}><div className="h-full bg-gradient-to-r from-[#0078D4] to-[#00A4EF] transition-all duration-500" style={{width:`${completedIds.size/investigations.length*100}%`}}/></div>
          <div className="p-3 rounded-xl bg-[#11161D] border border-sky-500/20 text-xs text-zinc-300 leading-relaxed space-y-1"><div className="font-mono text-[10px] text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1"><Lightbulb className="w-3 h-3 text-[#00A4EF]"/>TUTOR EVO // GUÍA DE BANCO</div><p className="italic text-[11px]">{active.comprobalo.actionPrompt}</p></div>
          <label className="relative block"><Search className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-500"/><span className="sr-only">Buscar investigación</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Buscar código o investigación..." className="w-full bg-[#11161D] border border-sky-500/20 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-[#00A4EF]"/></label>
          {categories.length>0 && <label className="block text-xs text-[#60CDFF]">Categoría<select className="block w-full mt-1 bg-[#11161D] border border-sky-500/20 rounded-xl p-2" value={category} onChange={event=>setCategory(event.target.value)}><option value="ALL">Todas ({investigations.length})</option>{categories.map(value=><option key={value} value={value}>{value} ({investigations.filter(inv=>inv.category===value).length})</option>)}</select></label>}
          <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
            {filtered.map(inv=>{const selected=inv.id===activeId,done=completedIds.has(inv.id);return <button type="button" key={inv.id} data-investigation-link={inv.id} aria-current={selected?'true':undefined} onClick={()=>onSelect(inv.id)} className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${selected?'bg-[#0078D4]/15 border border-[#00A4EF]/60 text-white shadow-[0_0_15px_rgba(0,164,239,0.15)]':'hover:bg-[#11161D] text-zinc-400 hover:text-zinc-200 border border-transparent'}`} style={{borderLeft:selected?'3px solid #00A4EF':undefined}}><span className={`min-w-6 min-h-6 p-1 rounded-lg flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5 ${selected?'bg-gradient-to-br from-[#0078D4] to-[#00A4EF] text-white font-bold':done?'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40':'bg-[#151B23] text-zinc-400'}`}>{done?'✓':inv.caseRecord?inv.category:inv.code}</span><span className="min-w-0 flex-1"><span className="text-xs font-semibold block">{inv.title}</span><span className="text-[10px] font-mono text-zinc-500 block mt-1">{inv.subtitle}</span></span></button>;})}
            {filtered.length===0 && <p role="status" className="text-xs text-zinc-400 p-3">No hay investigaciones para este filtro.</p>}
          </div>
        </aside>
        <article className="lg:col-span-8 space-y-6 min-w-0" data-investigation={activeId}>{children}</article>
      </div>
    </main>
  </div>;
};
export const Tomo02InvestigationStage: React.FC<{number?:number;title:string;children:React.ReactNode;challenge?:boolean}> = ({number,title,children,challenge}) => <section data-stage={number} className={challenge?'p-6 rounded-2xl bg-gradient-to-r from-[#080B10] via-[#0078D4]/10 to-[#080B10] border border-[#00A4EF]/40 space-y-4':'p-6 rounded-2xl bg-[#080B10]/90 border border-sky-500/20 space-y-4'}><h3 className="font-mono text-xs text-[#60CDFF] font-bold uppercase tracking-wider">{number ? `${number} // `:''}{title}</h3>{children}</section>;
