import React, {useEffect, useState} from 'react';
import {loadSectorResources, SectorResources} from './tomo02ResourceRegistry';
import {WindowsInvestigation} from '../../../data/tomo02Investigations';
import {ReaderTab} from '../shared/Tomo02SectorReaderLayout';

type Note = {code:string;title:string;[key:string]:unknown};
const protocolIds=['protocol-baseline','protocol-symptom','protocol-hypothesis','protocol-measurement','protocol-intervention','protocol-remeasurement','protocol-delta','protocol-verdict','protocol-rollback'];
/** Codes identify the same subjects in 11–36 and 38. Cases and protocol have distinct identities. */
export function complementaryNotes(number:string, investigations:unknown[], activeId:string, tab:ReaderTab):Note[] {
  const notes=investigations as Note[];
  if(tab==='mission')return number==='39'?notes.filter(note=>note.code==='39.10'):[];
  if(tab!=='reader')return [];
  if(number==='37')return notes; // Distinct case dossiers, never counted as canonical investigations.
  if(number==='39')return notes.filter(note=>protocolIds[Number(note.code.split('.')[1])-1]===activeId);
  return notes.filter(note=>note.code===activeId);
}
const labels:Record<string,string>={subtitle:'Contexto técnico',targetKey:'Clave de destino',targetComponent:'Componente',targetMechanism:'Mecanismo',targetStage:'Etapa',commandName:'Comando',riskLevel:'Nivel de riesgo',descubri:'Observación',hook:'Situación',mythVsTruth:'Mito y evidencia',mentira:'Mito',verdad:'Evidencia técnica',comprobalo:'Comprobación',entende:'Fundamentos',queEs:'Qué es',paraQueSirve:'Para qué sirve',quePasaSiFalta:'Qué pasa si falta',interactua:'Práctica específica',regQueryExample:'Consulta de Registro',psExample:'PowerShell',cmdExample:'CMD',syntaxBreakdown:'Desglose de sintaxis',whatToLookFor:'Qué observar',valueType:'Tipo de valor',alertaEVO:'Precauciones y recuperación',reversibilityRule:'Regla de reversibilidad',safetyWarning:'Precaución',evidenceBadge:'Referencia de evidencia',code:'Código',label:'Referencia',category:'Categoría',summary:'Resumen',technicalDepth:'Desarrollo técnico',contentMarkdown:'Detalle técnico'};
function strings(value:unknown):string[] {
  if(typeof value==='string')return [value];
  if(Array.isArray(value))return value.flatMap(strings);
  return value && typeof value==='object'?Object.values(value).flatMap(strings):[];
}
const normalize=(value:string)=>value.replace(/\s+/g,' ').trim();
/** Omit only identical text already shown in this investigation; retain every different explanation. */
export function uniqueNoteFields(note:Note, current:unknown):Record<string,unknown> {
  const seen=new Set(strings(current).map(normalize));
  const visit=(value:unknown):unknown=>{
    if(typeof value==='string'){const key=normalize(value);if(!key||seen.has(key))return undefined;seen.add(key);return value;}
    if(Array.isArray(value)){const values=value.map(visit).filter(v=>v!==undefined);return values.length?values:undefined;}
    if(value && typeof value==='object'){const entries=Object.entries(value).map(([k,v])=>[k,visit(v)] as const).filter(([,v])=>v!==undefined);return entries.length?Object.fromEntries(entries):undefined;}
    return value;
  };
  return (visit(Object.fromEntries(Object.entries(note).filter(([key])=>!['id','code','title'].includes(key))))||{}) as Record<string,unknown>;
}
const QuerySnippet:React.FC<{text:string}> = ({text}) => {
  const [copied,setCopied]=useState(false),[failed,setFailed]=useState(false);
  return <div className="min-w-0 space-y-2"><pre className="p-3 rounded-xl bg-[#11161D] border border-sky-500/20 text-xs text-cyan-200 overflow-x-auto whitespace-pre-wrap break-words">{text}</pre><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(text);setCopied(true);setFailed(false);}catch{setFailed(true);}}} className="text-xs text-[#60CDFF]">{copied?'Copiado':'Copiar consulta'}</button>{failed&&<p role="status" className="text-xs text-zinc-400">No se pudo copiar. Podés seleccionar el texto de la consulta.</p>}</div>;
}
function MarkdownNote({text}:{text:string}) {
  // Source text becomes React nodes; never insert source HTML into the document.
  return <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">{text.split(/(```[\s\S]*?```)/g).map((part,index)=>part.startsWith('```')?<QuerySnippet key={index} text={part.replace(/^```[^\n]*\n?/, '').replace(/```$/, '')}/>:<div key={index} className="space-y-2">{part.split('\n').map((line,i)=>/^#{1,6} /.test(line)?<h5 key={i} className="text-sm font-bold text-cyan-300">{line.replace(/^#{1,6} /,'')}</h5>:<p key={i} className="whitespace-pre-wrap break-words">{line.split(/(`[^`]+`)/g).map((piece,j)=>piece.startsWith('`')?<code key={j} className="text-cyan-200">{piece.slice(1,-1)}</code>:piece)}</p>)}</div>)}</div>;
}
function NoteFields({value}:{value:unknown}) {
  if(value==null)return null;
  if(typeof value!=='object')return <p className="text-xs sm:text-sm whitespace-pre-wrap break-words text-zinc-300 leading-relaxed">{String(value)}</p>;
  return <div className="space-y-3">{Object.entries(value).map(([key,item])=><div key={key} className="min-w-0 space-y-1"><h5 className="text-xs font-mono text-[#60CDFF]">{labels[key]||key.replace(/([A-Z])/g,' $1')}</h5>{typeof item==='string' && ['regQueryExample','psExample','cmdExample'].includes(key)?<QuerySnippet text={item}/>:key==='contentMarkdown'&&typeof item==='string'?<MarkdownNote text={item}/>:<NoteFields value={item}/>}</div>)}</div>;
}
interface Props {number:string;current:WindowsInvestigation;tab:ReaderTab;onReturnToReader:()=>void}
export const Tomo02SectorResources:React.FC<Props>=({number,current,tab,onReturnToReader})=>{
  const [resources,setResources]=useState<SectorResources|null>(null);
  const [error,setError]=useState(false);
  const [diagramsOpen,setDiagramsOpen]=useState(false);
  const [open,setOpen]=useState<string|null>(null);
  useEffect(()=>{let active=true;setResources(null);setError(false);loadSectorResources(number).then(data=>{if(active)setResources(data);}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[number]);
  if(error)return <p role="alert">No se pudieron cargar los recursos del sector. Volvé al índice y reintentá.</p>;
  if(!resources)return <p role="status" className="text-xs text-cyan-300">Cargando recursos del sector…</p>;
  const {Diagrams,Mission,Test,Cases}=resources;
  const notes=complementaryNotes(number,resources.investigations,current.id,tab).map(note=>({note,fields:uniqueNoteFields(note,current)})).filter(({fields})=>Object.keys(fields).length>0);
  const returnToReader=()=>setOpen(null);
  return <section data-sector-resources={number} className="space-y-4 min-w-0">
    {notes.length>0 && <details className="p-5 rounded-2xl bg-[#080B10] border border-sky-500/20"><summary className="cursor-pointer font-mono text-xs text-[#60CDFF]">{number==='37'?'Expedientes técnicos complementarios':'Notas técnicas y consultas específicas'}</summary><div className="space-y-5 mt-4">{notes.map(({note,fields})=><article key={note.code} data-complementary-note={note.code} className="space-y-3 border-t border-sky-500/15 pt-4"><h4 className="text-sm font-bold text-white">{note.code} · {note.title}</h4><NoteFields value={fields}/></article>)}</div></details>}
    {tab==='reader' && <>
      <details className="p-5 rounded-2xl bg-[#080B10] border border-sky-500/20" onToggle={event=>setDiagramsOpen(event.currentTarget.open)}><summary className="cursor-pointer font-mono text-xs text-[#60CDFF]">Diagramas interactivos del sector</summary>{diagramsOpen && <div className="mt-4"><Diagrams/></div>}</details>
      <button type="button" onClick={()=>setOpen('cases')} className="px-4 py-2 rounded-xl border border-sky-500/30 text-xs text-[#60CDFF]">Minicasos del sector</button>
      <Cases isOpen={open==='cases'} onClose={returnToReader}/>
    </>}
    {tab==='mission' && <details open={open==='mission'} onToggle={event=>{if(event.currentTarget.open)setOpen('mission');else if(open==='mission')setOpen(null);}} className="p-5 rounded-2xl bg-[#080B10] border border-sky-500/20"><summary className="cursor-pointer font-mono text-xs text-[#60CDFF]">Simulador de misión del sector</summary>{open==='mission' && <div className="mt-4"><Mission onBackToReader={()=>{returnToReader();onReturnToReader();}}/></div>}</details>}
    {tab==='test' && <details open={open==='test'} onToggle={event=>{if(event.currentTarget.open)setOpen('test');else if(open==='test')setOpen(null);}} className="p-5 rounded-2xl bg-[#080B10] border border-sky-500/20"><summary className="cursor-pointer font-mono text-xs text-[#60CDFF]">Banco de práctica del sector</summary>{open==='test' && <div className="mt-4"><Test onBackToReader={()=>{returnToReader();onReturnToReader();}}/></div>}</details>}
  </section>;
};
