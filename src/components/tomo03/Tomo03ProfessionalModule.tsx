import React,{useState} from 'react';
import type {ProfessionalModule,ProfessionalState} from '../../data/tomo03ProfessionalTypes';
import {TOMO03_TOOL_LABELS} from '../../data/tomo03ProfessionalTypes';
import {moduleAssessment} from '../../data/tomo03RepairEngine';
interface Props {content:ProfessionalModule;state:ProfessionalState;onChange:(state:ProfessionalState)=>void;onLab:()=>void;onTool:()=>void}
export const Tomo03ProfessionalModule:React.FC<Props>=({content,state,onChange,onLab,onTool})=>{
 const [level,setLevel]=useState(0);
 const result=moduleAssessment(content,state);
 return <div className="space-y-5" data-professional-module={content.number}>
  <section className="p-4 rounded-xl bg-black/40 border border-emerald-900 space-y-3">
   <h3 className="text-lg font-bold text-emerald-300">Entendé · {content.title}</h3>
   <div role="group" aria-label="Profundidad técnica" className="flex flex-wrap gap-2">{['Principiante','Intermedio','Avanzado'].map((label,index)=><button type="button" key={label} aria-pressed={level===index} onClick={()=>setLevel(index)} className={'px-3 py-2 text-xs rounded-lg border '+(level===index?'border-emerald-400 text-emerald-200':'border-zinc-700')}>{label}</button>)}</div>
   <p className="text-sm leading-relaxed" data-theory-level={level}>{content.levels[level]}</p>
   <figure className="p-3 border border-emerald-900 rounded-lg"><ol className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">{content.diagram.map((node,index)=><li className="p-3 bg-[#0b1a12] rounded text-xs break-words" key={node}><span className="text-emerald-400 font-bold">{index+1} → </span>{node}</li>)}</ol><figcaption className="text-xs text-zinc-400 mt-3">{content.diagramCaption}</figcaption></figure>
   <h4 className="font-bold text-sm">Síntomas con causas distintas</h4><ul className="text-sm list-disc pl-5 space-y-2">{content.symptoms.map(s=><li key={s}>{s}</li>)}</ul>
  </section>
  <section className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-3">
   <h3 className="font-bold text-emerald-300">Medí · procedimiento e interpretación</h3>
   <ol className="list-decimal pl-5 text-sm space-y-2">{content.procedure.map(s=><li key={s}>{s}</li>)}</ol>
   <dl className="text-xs space-y-2">{Object.entries({Instrumento:content.measurement.instrument,Condiciones:content.measurement.conditions,Referencia:content.measurement.reference,Incertidumbre:content.measurement.uncertainty,Interpretación:content.measurement.interpretation}).map(([label,text])=><div key={label}><dt className="font-bold text-emerald-300">{label}</dt><dd className="mt-1">{text}</dd></div>)}</dl>
   <button type="button" onClick={onTool} className="border border-emerald-600 px-3 py-2 rounded-lg text-xs">Abrir herramientas del banco · {TOMO03_TOOL_LABELS[content.tool]}</button>
  </section>
  <section className="p-4 rounded-xl bg-black/40 border border-emerald-900 space-y-3" aria-label="Árbol profesional">
   <h3 className="font-bold text-emerald-300">Descartá · decisiones encadenadas</h3>
   {content.tree.map((node,index)=>{
    const visible=index===0||content.tree.slice(0,index).every(previous=>state.tree[previous.id]&&state.tree[previous.id]!=='unknown');
    return visible?<fieldset key={node.id} className="p-3 border border-zinc-800 rounded-lg space-y-3" data-diagnostic-node={node.id}><legend className="text-sm font-bold">{index+1}. {node.question}</legend><div className="flex flex-wrap gap-2">{(['yes','no','unknown'] as const).map((answer,index)=><button type="button" key={answer} aria-pressed={state.tree[node.id]===answer} onClick={()=>{const tree={...state.tree,[node.id]:answer};for(const later of content.tree.slice(content.tree.indexOf(node)+1))delete tree[later.id];onChange({...state,tree});}} className="border border-zinc-600 rounded-lg p-2 text-xs">{['Sí, comprobado','No, comprobado','No probado'][index]}</button>)}</div><p role="status" className="text-xs text-zinc-300">{state.tree[node.id]==='yes'?node.yes:state.tree[node.id]==='no'?node.no:node.stop}</p></fieldset>:null;
   })}
   <p className="text-xs text-amber-300">Tus respuestas describen observaciones declaradas. La ruta orienta la siguiente prueba y no confirma una causa por sí sola.</p>
  </section>
  <details className="p-4 border border-zinc-800 rounded-xl space-y-3"><summary className="cursor-pointer text-sm font-bold">Atajo de taller y errores frecuentes</summary><div className="text-sm space-y-2 pt-3"><p>{content.trick.technique}</p><p>Cuándo ayuda: {content.trick.when}</p><p>Contraindicación: {content.trick.avoid}</p><p>Cómo comprobarlo: {content.trick.verify}</p><ul className="list-disc pl-5 space-y-2">{content.mistakes.map(s=><li key={s}>{s}</li>)}</ul></div></details>
  <section className="p-4 border border-emerald-900 rounded-xl space-y-4">
   <h3 className="font-bold text-emerald-300">Practicá · evaluación con devolución</h3>
   {content.quiz.map(q=><fieldset key={q.id} className="space-y-2"><legend className="text-sm font-semibold">{q.prompt}</legend>{q.choices.map(choice=><button type="button" key={choice.id} aria-pressed={state.quiz[q.id]===choice.id} onClick={()=>onChange({...state,quiz:{...state.quiz,[q.id]:choice.id}})} className={'block w-full p-3 text-left text-sm border rounded-lg '+(state.quiz[q.id]===choice.id?'border-emerald-500 bg-emerald-950':'border-zinc-800')}>{choice.label}</button>)}{state.quiz[q.id]&&<p role="status" className="text-xs text-amber-200">{q.choices.find(c=>c.id===state.quiz[q.id])?.feedback}</p>}</fieldset>)}
   <p className="text-sm" data-module-score>Evaluación: {result.score}/{result.total}. Práctica: {result.practiceValidated?'validada en simulación':'pendiente de resolver'}.</p>
   <button type="button" onClick={onLab} className="bg-emerald-500 text-black font-bold px-4 py-3 rounded-lg text-sm">Investigar caso en EVO Repair Lab</button>
   <p className="text-xs text-zinc-400">La evidencia y evaluación se guardan con tu expediente local. Resolver el caso no certifica una reparación de hardware real.</p>
  </section>
  <section className="text-xs space-y-2"><h3 className="font-bold">Referencias técnicas</h3>{content.references.map(ref=><a key={ref.url} href={ref.url} target="_blank" rel="noopener noreferrer" className="block text-emerald-300 underline break-words">{ref.label}</a>)}<p className="text-zinc-400">Valores y procedimientos dependientes del modelo: consultar revisión exacta del manual antes de intervenir.</p></section>
 </div>;
};
