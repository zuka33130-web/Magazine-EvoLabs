import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ClipboardCopy, FileCode2, FlaskConical, ShieldAlert, Search, CheckCircle2 } from 'lucide-react';
import { EVO_WINDOWS_50_LABS } from '../../data/tomo02Windows50Labs';
import { EVO_WINDOWS_50_HEADLINES, EVO_WINDOWS_50_BLOCKS } from '../../data/tomo02Windows50';
import { EVO_WINDOWS40_RESEARCH } from '../../data/tomo02Magazine40Corpus';
import { EVO_WINDOWS40_001 } from '../../data/tomo02Magazine40Chapter001';

type Props = {onBack: () => void};
const pad=(n:number)=>String(n).padStart(3,'0');
const fields=[
  {key:'premise',title:'El misterio original'},
  {key:'mechanisms',title:'Arquitectura y funcionamiento real'},
  {key:'traps',title:'Falsas pistas que te hacen fallar'},
  {key:'protocol',title:'Procedimiento y control de variables'},
  {key:'interpretation',title:'Lectura de resultados'},
  {key:'conclusion',title:'Conclusión y transferencia del conocimiento'}
] as const;
const Tab: React.FC<{number:number;selected:boolean;onClick:()=>void}>=({number,selected,onClick})=>
  <button type="button" onClick={onClick} aria-current={selected?'page':undefined}
    className={'flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left text-xs leading-snug transition-colors '+(selected?'border-[#55E3FF] bg-[#0664A2] text-white':'border-transparent text-[#C8E4F5] hover:border-[#187FBB] hover:bg-[#123653]')}>
    <strong className="shrink-0 font-mono-tech text-[#5CEAFF]">{pad(number)}</strong>
    <span className="font-semibold">{EVO_WINDOWS_50_HEADLINES[number-1]}</span>
  </button>;

export const Tomo02Windows50LabReader: React.FC<Props>=({onBack})=>{
  const [selected,setSelected]=React.useState(41);
  const [search,setSearch]=React.useState('');
  const [showTheory,setShowTheory]=React.useState(true);
  const lab=EVO_WINDOWS_50_LABS[selected-1];
  const previous=selected>1?selected-1:null,next=selected<50?selected+1:null;
  const draft=selected>1&&selected<=40?EVO_WINDOWS40_RESEARCH[selected-2]:null;
  const section=EVO_WINDOWS_50_BLOCKS.find(s=>selected>=s.range[0]&&selected<=s.range[1]);
  const normalized=search.trim().toLocaleLowerCase('es');
  const visible=EVO_WINDOWS_50_LABS.filter(l=>!normalized||
    String(l.number).padStart(3,'0').includes(normalized)||
    EVO_WINDOWS_50_HEADLINES[l.number-1].toLocaleLowerCase('es').includes(normalized));
  const select=(n:number)=>{
    setSelected(n);window.scrollTo({top:0,behavior:'smooth'});
  };
  return <main id="evo-windows-50-reader" className="min-h-screen bg-[#020813] text-white">
    <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#44D9FF] bg-gradient-to-r from-[#042348] via-[#075EAA] to-[#052B53] px-5 py-3 shadow-[0_10px_40px_rgba(0,133,230,.3)]">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-[#70DFFF] bg-[#052F56] px-3 py-2 font-mono-tech text-xs font-bold hover:bg-[#0774C1]"><ArrowLeft size={16}/> MAGAZINE A4</button>
      <span className="font-mono-tech text-[12px] font-black tracking-widest">EVO LABS · 50 INVESTIGACIONES PRÁCTICAS</span>
      <span className="rounded border border-[#00D2FF] bg-[#082742] px-3 py-1 font-mono-tech text-[10px] font-extrabold text-[#A0EAFF]">LABORATORIO EN REVISIÓN EDITORIAL</span>
    </div>
    <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-6 px-4 py-7 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto rounded-xl border border-[#185F91] bg-[#071A2E] p-3">
        <div className="sticky top-0 bg-[#071A2E] pb-3">
          <label htmlFor="evo-w50-search" className="mb-3 flex items-center gap-2 font-mono-tech text-[11px] font-black tracking-wide text-[#63E1FF]"><BookOpen size={17}/> 50 EXPEDIENTES · WINDOWS 11</label>
          <div className="flex items-center gap-2 rounded-md border border-[#287FAE] bg-[#010813] px-2"><Search className="text-[#8CDFFF]" size={15}/><input id="evo-w50-search" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar número o tema..." className="min-w-0 w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-[#8CAABF]"/></div>
        </div>
        <div className="space-y-0.5">
          {visible.map(l=><Tab key={l.number} number={l.number} selected={l.number===selected} onClick={()=>select(l.number)}/>)}
          {!visible.length&&<p className="p-4 text-xs text-[#AACBDD]">Ninguna investigación coincide con la búsqueda.</p>}
        </div>
      </aside>
      <article className="min-w-0 space-y-5">
        <header className="rounded-xl border border-[#308FC7] bg-gradient-to-br from-[#07538F] via-[#0A2B4C] to-[#071423] p-6 shadow-[0_20px_55px_rgba(0,20,50,.6)] md:p-9">
          <p className="font-mono-tech text-[11px] font-black tracking-widest text-[#83EAFF]">TOMO 02 / INVESTIGACIÓN {pad(lab.number)} · BLOQUE {section?.number}</p>
          <h1 className="mt-3 font-display text-[clamp(26px,3vw,43px)] font-black uppercase leading-tight tracking-tight">{EVO_WINDOWS_50_HEADLINES[lab.number-1]}</h1>
          <p className="mt-4 max-w-3xl border-l-4 border-[#1FD6FF] bg-[#0A3458] p-4 text-sm leading-relaxed text-[#EDF8FF]">{lab.discovery}</p>
          <p className="mt-4 text-[11px] font-mono-tech text-[#BDDCEF]">TRABAJO EN CURSO · 50 PROTOCOLOS REALES + TEORÍA DE BASE EN 001–040 · PDF A4 DEFINITIVO PENDIENTE</p>
        </header>

        <section className="rounded-xl border border-[#206B9E] bg-[#061B32] p-5 md:p-7">
          <p className="font-mono-tech text-xs font-black text-[#62E4FF]">01 / EL MECANISMO, SIN MITOS</p>
          <h2 className="mt-2 font-display text-2xl font-black uppercase text-white">Qué ocurre de verdad</h2>
          <p className="mt-4 text-[14px] leading-[1.8] text-[#E3F3FF]">{lab.mechanism}</p>
          <div className="mt-5 rounded-lg border-l-4 border-[#16CFFF] bg-[#0B365B] p-4">
            <strong className="font-mono-tech text-[11px] text-[#79ECFF]">ANTES DE EMPEZAR</strong>
            <p className="mt-2 text-[13px] leading-relaxed text-[#D5EFFC]">{lab.preparation}</p>
          </div>
        </section>

        {(draft||selected===1)&&<section className="rounded-xl border border-[#236D9B] bg-[#071828] p-5 md:p-7">
          <button type="button" onClick={()=>setShowTheory(!showTheory)} aria-expanded={showTheory} className="flex w-full items-center justify-between gap-3 text-left font-mono-tech text-xs font-black text-[#70E6FF]">
            <span>02 / ABRIR LA TEORÍA DE BASE COMPLETA · {selected===1?'8 SECCIONES':'6 SECCIONES'}</span>
            <span>{showTheory?'−':'+'}</span>
          </button>
          {showTheory&&<div className="mt-5 space-y-6">
            {selected===1?EVO_WINDOWS40_001.map((page,i)=><section key={i} className="border-b border-[#23577B] pb-5">
              <h3 className="mb-3 font-display text-xl font-bold text-white">{page.title}</h3>
              <div className="space-y-3 text-[13px] leading-[1.8] text-[#DEEFFA]">{page.paragraphs.map((p,j)=><p key={j}>{p}</p>)}</div>
            </section>):
            draft&&fields.map(field=><section key={field.key} className="border-b border-[#23577B] pb-5">
              <h3 className="mb-3 font-display text-xl font-bold text-white">{field.title}</h3>
              <div className="space-y-3 text-[13px] leading-[1.8] text-[#DEEFFA]">{draft[field.key].map((p,j)=><p key={j}>{p}</p>)}</div>
            </section>)}
          </div>}
        </section>}

        <section className="rounded-xl border border-[#287EB6] bg-[#061726] p-5 md:p-7">
          <p className="font-mono-tech text-xs font-black text-[#62E4FF]">03 / TRABAJO DE CAMPO</p>
          <h2 className="mb-5 mt-2 font-display text-2xl font-black uppercase">Reproducí el descubrimiento</h2>
          <ol className="space-y-4">
            {lab.experiment.map((step,i)=><li key={i} className="flex gap-4 text-[14px] leading-[1.75] text-[#E7F3FB]"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#0078D4] font-mono-tech text-xs font-black">{i+1}</span><span>{step}</span></li>)}
          </ol>
          <div className="mt-7 overflow-hidden rounded-lg border border-[#27BAEA]">
            <div className="flex flex-wrap justify-between gap-2 bg-gradient-to-r from-[#0062AF] to-[#0686C8] px-4 py-2.5">
              <span className="flex items-center gap-2 font-mono-tech text-[11px] font-black"><FileCode2 size={16}/> POWER­SHELL / WINDOWS · EJECUCIÓN VOLUNTARIA</span>
              <button type="button" onClick={()=>{if(navigator.clipboard?.writeText)void navigator.clipboard.writeText(lab.command)}} className="flex items-center gap-2 rounded border border-[#A7ECFF] bg-[#084878] px-3 py-1 font-mono-tech text-[10px] font-bold hover:bg-[#0574B4]"><ClipboardCopy size={14}/> COPIAR</button>
            </div>
            <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words bg-[#010712] px-4 py-4 text-[12px] leading-[1.6] text-[#8FF5FF]"><code>{lab.command}</code></pre>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-[#A5CAE1]">Los comandos se muestran como material didáctico. EVO LABS no los ejecuta en tu PC. Leer y verificar antes de copiar. Capturar solamente tu equipo y revisar cualquier información privada antes de compartirla.</p>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-xl border border-[#236E9D] bg-[#09223A] p-5 md:p-6">
            <h2 className="flex items-center gap-2 font-mono-tech text-[11px] font-black text-[#58E5FF]"><CheckCircle2 size={18}/> 04 / EVIDENCIA QUE SÍ VALE</h2>
            <p className="mt-4 text-[13px] leading-[1.75] text-[#EDF7FF]">{lab.evidence}</p>
            <div className="mt-4 border-t border-[#357090] pt-3 font-mono-tech text-[10px] text-[#B2D8EF]">FIGURA REAL PARA EL MAGAZINE: CAPTURA DE LA HERRAMIENTA EN TU PROPIO EQUIPO, FECHA Y DATOS CONFIDENCIALES OCULTADOS. NO ES UNA MEDICIÓN GENERADA POR IA.</div>
          </section>
          <section className="rounded-xl border border-[#B17639] bg-[#2B2118] p-5 md:p-6">
            <h2 className="flex items-center gap-2 font-mono-tech text-[11px] font-black text-[#FFE0A3]"><ShieldAlert size={18}/> 05 / EL ERROR QUE ARRUINA LA PRUEBA</h2>
            <p className="mt-4 text-[13px] leading-[1.75] text-[#FFF0DA]">{lab.pitfall}</p>
          </section>
        </div>

        <section className="rounded-xl border border-[#267FAE] bg-gradient-to-r from-[#0A4169] to-[#071B30] p-5 md:p-7">
          <p className="font-mono-tech text-xs font-black text-[#6DE5FF]">06 / RESULTADO APLICABLE A TU WINDOWS</p>
          <h2 className="mb-3 mt-2 font-display text-2xl font-black uppercase">Qué hacer con lo descubierto</h2>
          <p className="text-[14px] leading-[1.8]">{lab.action}</p>
          <div className="mt-5 border-l-4 border-[#30D9FF] bg-[#052B49] p-4">
            <strong className="font-mono-tech text-[11px] text-[#A7F2FF]">RECUPERACIÓN / REVERSIÓN</strong>
            <p className="mt-2 text-[13px] leading-relaxed">{lab.recovery}</p>
          </div>
        </section>

        <section className="rounded-xl border border-[#2A85B5] bg-[#071A2A] p-5 md:p-7">
          <p className="mb-2 flex items-center gap-2 font-mono-tech text-xs font-black text-[#62E4FF]"><FlaskConical size={17}/> DESAFÍO EVO · SIN SOLUCIÓN PREFABRICADA</p>
          <p className="text-[14px] leading-[1.8] text-[#E8F5FF]">{lab.challenge}</p>
          <h3 className="mb-3 mt-6 font-mono-tech text-[11px] font-black text-[#8CE9FF]">DOCUMENTACIÓN TÉCNICA PARA REPRODUCIRLO</h3>
          <ul className="space-y-1.5">{lab.references.map((ref,i)=><li key={i} className="text-xs text-[#BDDCEF]"><a className="underline decoration-[#23ABDB] underline-offset-2 hover:text-white" href={ref.url} target="_blank" rel="noopener noreferrer">{ref.name}</a></li>)}</ul>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 pb-12 pt-4">
          <button type="button" disabled={previous===null} onClick={()=>previous&&select(previous)} className="flex items-center gap-2 rounded-lg border border-[#349AC6] px-4 py-3 text-xs font-bold disabled:opacity-30 hover:bg-[#075280]"><ArrowLeft size={16}/> ANTERIOR</button>
          <span className="font-mono-tech text-xs text-[#67DFFF]">{pad(selected)} / 050</span>
          <button type="button" disabled={next===null} onClick={()=>next&&select(next)} className="flex items-center gap-2 rounded-lg border border-[#69DDFF] bg-[#086EB1] px-4 py-3 text-xs font-bold disabled:opacity-30 hover:bg-[#009AD9]">SIGUIENTE <ArrowRight size={16}/></button>
        </footer>
      </article>
    </div>
  </main>;
};
