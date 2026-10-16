import React,{useState} from 'react';
import type {ProfessionalModule,ProfessionalState} from '../../data/tomo03ProfessionalTypes';
import {emptyProfessionalState} from '../../data/tomo03ProfessionalTypes';
import {performRepairTest,validateRepair,hasDiagnosticEvidence} from '../../data/tomo03RepairEngine';
export const EvoRepairLab:React.FC<{content:ProfessionalModule;state:ProfessionalState;onChange:(state:ProfessionalState)=>void;onDocument:()=>void}>=({content,state,onChange,onDocument})=>{
 const [message,setMessage]=useState('');
 const scenario=content.scenario,ready=hasDiagnosticEvidence(scenario,state);
 return <section className="rounded-2xl border border-emerald-700 bg-[#09140e] p-4 sm:p-5 space-y-4" data-repair-case={scenario.id}>
  <header className="space-y-2"><span className="text-xs font-bold text-emerald-400">EVO REPAIR LAB · EQUIPO Y OBSERVACIONES SIMULADOS</span><h2 className="text-xl font-bold">{scenario.equipment}</h2><p className="text-sm">{scenario.symptom}</p><p className="text-xs text-amber-200">{scenario.safety}</p></header>
  <p className="text-sm">Situación inicial: {scenario.before}</p>
  <h3 className="font-bold text-sm">Elegí instrumento y prueba</h3>
  <div className="grid sm:grid-cols-2 gap-2">{scenario.tests.map(test=><button key={test.id} type="button" data-repair-test={test.id} onClick={()=>{const result=performRepairTest(scenario,state,test.id);onChange(result.state);setMessage(result.message);}} className="text-left p-3 border border-zinc-700 rounded-lg text-sm"><strong>{test.label}</strong><span className="block text-xs text-zinc-400 mt-1">{test.instrument}{state.observations.includes(test.id)?' · realizada':''}</span></button>)}</div>
  <p role="status" className="text-sm text-amber-200" data-repair-message>{message}</p>
  <section aria-label="Observaciones obtenidas" className="space-y-2"><h3 className="font-bold text-sm">Evidencia del caso</h3>{state.observations.length?state.observations.map(id=>{const test=scenario.tests.find(t=>t.id===id)!;return <p key={id} className="text-sm p-3 bg-black/40 rounded-lg">SIMULADO · {test.instrument}: {test.result}</p>}):<p className="text-xs text-zinc-400">Aún no realizaste pruebas. La causa permanece sin determinar.</p>}</section>
  <fieldset className="space-y-2"><legend className="font-bold text-sm">Hipótesis de trabajo</legend>{scenario.hypotheses.map(h=><button key={h.id} type="button" onClick={()=>onChange({...state,hypothesis:h.id,verified:false})} aria-pressed={state.hypothesis===h.id} className="block w-full text-left border border-zinc-700 rounded-lg p-3 text-sm">{h.label}</button>)}</fieldset>
  <fieldset disabled={!ready} className="space-y-2 disabled:opacity-50"><legend className="font-bold text-sm">Intervención justificada</legend>{scenario.repairs.map(repair=><button key={repair.id} type="button" onClick={()=>onChange({...state,repair:repair.id,verified:false})} aria-pressed={state.repair===repair.id} className="block w-full text-left border border-zinc-700 rounded-lg p-3 text-sm">{repair.label}</button>)}</fieldset>
  {!ready&&<p className="text-xs text-zinc-400">Reuní las comprobaciones discriminantes antes de intervenir; no se revela la resolución con evidencia incompleta.</p>}
  <button type="button" onClick={()=>{const result=validateRepair(scenario,state);onChange(result.state);setMessage(result.message);}} className="bg-emerald-500 text-black px-4 py-2 rounded-lg text-sm font-bold">Comprobar reparación simulada</button>
  {state.verified&&<div className="border border-emerald-700 p-4 rounded-lg space-y-2" data-case-resolution><p className="font-bold text-emerald-300">Caso resuelto con evidencia simulada</p><p className="text-sm">{scenario.hypotheses.find(h=>h.id===scenario.cause)?.feedback}</p><p className="text-sm">Después: {scenario.after}</p><p className="text-xs text-zinc-400">Límites: {scenario.limits}</p></div>}
  <div className="flex flex-wrap gap-3"><button type="button" onClick={onDocument} className="text-xs underline text-emerald-300">Registrar interpretación y exportar expediente</button><button type="button" onClick={()=>{onChange({...emptyProfessionalState(),tree:state.tree,quiz:state.quiz});setMessage('Caso reiniciado; teoría y evaluación conservadas.');}} className="text-xs underline">Reiniciar solo este caso</button></div>
 </section>;
};
