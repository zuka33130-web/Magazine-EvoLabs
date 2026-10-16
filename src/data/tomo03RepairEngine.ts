import type {ProfessionalState,RepairScenario,ProfessionalModule} from './tomo03ProfessionalTypes';
import {emptyProfessionalState} from './tomo03ProfessionalTypes';
export function parseProfessionalState(raw:unknown,content:ProfessionalModule):ProfessionalState {
  const data=raw && typeof raw==='object'?raw as Partial<ProfessionalState>:{};
  const state=emptyProfessionalState();
  for(const node of content.tree)if(['yes','no','unknown'].includes(data.tree?.[node.id]||''))state.tree[node.id]=data.tree![node.id];
  for(const question of content.quiz)if(question.choices.some(c=>c.id===data.quiz?.[question.id]))state.quiz[question.id]=data.quiz![question.id];
  state.observations=Array.isArray(data.observations)?[...new Set(data.observations.filter(id=>content.scenario.tests.some(test=>test.id===id&&!test.unsafe)))]:[];
  state.hypothesis=content.scenario.hypotheses.some(h=>h.id===data.hypothesis)?data.hypothesis!:null;
  state.repair=content.scenario.repairs.some(r=>r.id===data.repair)?data.repair!:null;
  state.verified=data.verified===true&&canValidateRepair(content.scenario,state);
  state.log=Array.isArray(data.log)?data.log.filter((line):line is string=>typeof line==='string').slice(-100):[];
  return state;
}
export function hasDiagnosticEvidence(scenario:RepairScenario,state:ProfessionalState) {
  return scenario.required.every(id=>state.observations.includes(id));
}
export function canValidateRepair(scenario:RepairScenario,state:ProfessionalState) {
  return hasDiagnosticEvidence(scenario,state)&&state.hypothesis===scenario.cause&&state.repair===scenario.repair;
}
export function performRepairTest(scenario:RepairScenario,state:ProfessionalState,id:string) {
  const test=scenario.tests.find(item=>item.id===id);
  if(!test)return {state,message:'Prueba inexistente.'};
  if(test.unsafe)return {state:{...state,log:[...state.log,`DETENIDO: ${test.label}`].slice(-100)},message:'Prueba rechazada por seguridad. No se generó una observación.'};
  if(test.requires?.some(required=>!state.observations.includes(required)))return {state,message:'Faltan comprobaciones previas. Revisá el orden del procedimiento.'};
  return {state:{...state,observations:[...new Set([...state.observations,id])],verified:false,log:[...state.log,`${test.instrument}: ${test.result}`].slice(-100)},message:`SIMULADO · ${test.result}`};
}
export function validateRepair(scenario:RepairScenario,state:ProfessionalState) {
  if(!hasDiagnosticEvidence(scenario,state))return {state,message:'Faltan pruebas que discriminen las hipótesis; no se puede cerrar el caso.'};
  if(!canValidateRepair(scenario,state))return {state:{...state,verified:false},message:'La intervención elegida no resuelve la causa sustentada por las observaciones. Revisá la hipótesis y la reparación.'};
  return {state:{...state,verified:true,log:[...state.log,`VERIFICACIÓN SIMULADA: ${scenario.after}`].slice(-100)},message:`Reparación validada en este escenario simulado. ${scenario.after}`};
}
export function moduleAssessment(content:ProfessionalModule,state:ProfessionalState) {
  const score=content.quiz.filter(q=>state.quiz[q.id]===q.correct).length;
  return {score,total:content.quiz.length,practiceValidated:state.verified&&canValidateRepair(content.scenario,state),theoryPassed:score===content.quiz.length};
}
export function assessAtxUncertainty(value:number,uncertainty:number,min:number,max:number) {
  if(![value,uncertainty,min,max].every(Number.isFinite)||value<0||uncertainty<0||min>=max)return null;
  const low=value-uncertainty,high=value+uncertainty;
  return {low,high,status:low>=min&&high<=max?'WITHIN':high<min||low>max?'OUTSIDE':'INDETERMINATE'} as const;
}
export function compareRepairSamples(before:number[],after:number[]) {
  const summarize=(values:number[])=>{if(values.length<3||values.some(n=>!Number.isFinite(n)||n<0))return null;const sorted=[...values].sort((a,b)=>a-b);const mid=Math.floor(sorted.length/2);return {count:values.length,min:sorted[0],max:sorted.at(-1)!,median:sorted.length%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2};};
  const baseline=summarize(before),result=summarize(after);
  if(!baseline||!result||baseline.count!==result.count)return null;
  return {baseline,result,delta:result.median-baseline.median,percent:baseline.median===0?null:(result.median-baseline.median)/baseline.median*100};
}
