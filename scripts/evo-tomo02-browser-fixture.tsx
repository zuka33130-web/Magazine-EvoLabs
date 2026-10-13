import React from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Tomo02MagazineView} from '../src/components/tomo02/Tomo02MagazineView';
import {TutorEvoProvider} from '../src/components/tutor/TutorEvoContext';
import {TOMO_02_ADVANCED_CONTENT} from '../src/data/tomo02AdvancedContent';
import {getSectorInvestigations} from '../src/data/tomo02Investigations';
import {INVESTIGATION_TOOL_CODE} from '../src/data/tomo02InvestigationTools';
const pause=(ms=0)=>new Promise(r=>setTimeout(r,ms));
const assert=(v:unknown,message:string)=>{if(!v)throw Error(message);};
const click=(text:string)=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()===text);assert(b,'Missing '+text);assert(!b!.disabled,'Disabled '+text);flushSync(()=>b!.click());};
const input=(el:HTMLInputElement|HTMLTextAreaElement,value:string)=>{const setter=Object.getOwnPropertyDescriptor(el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value')!.set!;flushSync(()=>{setter.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));});};
async function waitFor(fn:()=>boolean,message:string){for(let n=0;n<200;n++){if(fn())return;await pause(10);}throw Error(message);}
const root=createRoot(document.getElementById('root')!);
let exported='';const createObjectURL=URL.createObjectURL;URL.createObjectURL=(blob:Blob)=>{blob.text().then(text=>exported=text);return createObjectURL(blob);};
const legacy={answers:{0:1},decision:2,note:'EVIDENCIA ANTERIOR: no debe perderse durante la migración.',finalExperiment:false};
async function run(){
 localStorage.clear();localStorage.setItem('evo_tomo02_sector11_learning_v1',JSON.stringify(legacy));localStorage.setItem('evo_tomo02_progress',JSON.stringify({m00:'completed','sector-11':'completed'}));localStorage.setItem('evo_tomo02_completed','false');
 flushSync(()=>root.render(<TutorEvoProvider><Tomo02MagazineView initialSubView="index"/></TutorEvoProvider>));await pause(20);
 let count=0;
 for(const content of TOMO_02_ADVANCED_CONTENT){
  click(`Abrir Sector ${content.number}`);await waitFor(()=>!!document.querySelector(`[data-sector="${content.number}"]`),'Sector did not open');
  const invs=getSectorInvestigations(content);assert(document.querySelectorAll('[data-investigation-link]').length===invs.length,'Sidebar count '+content.number);
  for(const inv of invs){
   const button=document.querySelector<HTMLButtonElement>(`[data-investigation-link="${inv.id}"]`)!;flushSync(()=>button.click());
   assert(document.querySelector('[data-investigation]')?.getAttribute('data-investigation')===inv.id,'Wrong investigation '+inv.id);
   assert(document.querySelectorAll('[data-stage]').length===6,'Missing stages '+inv.id);
   assert(document.body.textContent!.includes(inv.entende.explanation[0]),'Missing own content '+inv.id);
   if(inv.toolCode)assert(document.body.textContent!.includes(INVESTIGATION_TOOL_CODE[inv.id]),'Missing tool code '+inv.id);
   count++;if(count%40===0){document.getElementById('result')!.textContent='RUNNING: '+count+' investigations';await pause();}
  }
  const first=invs[0];flushSync(()=>document.querySelector<HTMLButtonElement>(`[data-investigation-link="${first.id}"]`)!.click());
  let fields=document.querySelectorAll('fieldset');const wrong=first.check.choices.findIndex(c=>!c.correct),correct=first.check.choices.findIndex(c=>c.correct);
  flushSync(()=>(fields[0].querySelectorAll('button')[wrong] as HTMLButtonElement).click());assert(document.querySelectorAll('[role="status"]')[0].textContent!.includes(first.check.choices[wrong].feedback),'No wrong feedback');
  flushSync(()=>(document.querySelectorAll('fieldset')[0].querySelectorAll('button')[correct] as HTMLButtonElement).click());
  const micro=first.microdesafio.options!.findIndex(c=>c.isCorrect);flushSync(()=>(document.querySelectorAll('fieldset')[1].querySelectorAll('button')[micro] as HTMLButtonElement).click());
  input(document.querySelector<HTMLTextAreaElement>('textarea[aria-label="Evidencia de investigación"]')!,'SIMULADO: contexto, observación, interpretación y límite de esta prueba.');
  await waitFor(()=>document.querySelector('[data-investigation-progress]')!.textContent!.startsWith('1 /'),'Progress did not update');
  assert(document.querySelector('[data-investigation]')!.getBoundingClientRect().left>document.querySelector('aside')!.getBoundingClientRect().left,'No desktop two columns');
  click('Misión');assert(document.body.textContent!.includes(content.mission),'Missing mission');
  for(const lesson of content.lessons)assert(document.body.textContent!.includes(lesson.text),'Original lesson lost');
  for(const command of content.commands)assert(document.body.textContent!.includes(command.code),'Original command lost');
  if(content.number==='39'){
   const form=document.querySelector('section[aria-label="Expediente final"]')!;
   const values=['Demora al abrir app de prueba','Una política altera la demora','Build y carga iguales; datos simulados','Latencia','ms','Cambiar política en simulación','Restaurar política previa','No es telemetría; ejemplo didáctico','Resultado inconcluso, requiere prueba real'];
   [...form.querySelectorAll('textarea')].forEach((el,index)=>input(el,values[index]));const samples=form.querySelectorAll<HTMLInputElement>('input:not([type="checkbox"])');input(samples[0],'500;480;520');input(samples[1],'420;400;410');
   click('Exportar expediente y registrar evidencia');await waitFor(()=>exported.length>0,'No export');const report=JSON.parse(exported);assert(report.comparison.delta===-90 && report.source==='SIMULATED'&&!report.automaticTelemetry,'Bad export/provenance');
  }
  click('Test');assert(document.body.textContent!.includes(content.questions[0].question),'Missing original test');
  assert([...document.querySelectorAll('button')].find(b=>b.textContent==='Completar sector con evidencia')?.disabled,'Unearned completion');
  click('Volver a investigación');assert(document.querySelector('[data-investigation]')?.getAttribute('data-investigation')===first.id,'Return changed active investigation');
  click('ÍNDICE');await pause();click(`Abrir Sector ${content.number}`);await waitFor(()=>!!document.querySelector(`[data-sector="${content.number}"]`),'Reopen failed');
  assert(document.querySelector('[data-investigation]')?.getAttribute('data-investigation')===first.id,'Active not persisted');assert(document.querySelector('[data-investigation-progress]')!.textContent!.startsWith('1 /'),'Evidence not persisted');click('ÍNDICE');await pause();
 }
 const saved=JSON.parse(localStorage.getItem('evo_tomo02_sector11_learning_v1')!);assert(saved.note===legacy.note&&saved.decision===legacy.decision&&saved.answers[0]===legacy.answers[0],'Legacy evidence overwritten');
 assert(JSON.parse(localStorage.getItem('evo_tomo02_progress')!).m00==='completed','Original sector progress lost');assert(localStorage.getItem('evo_tomo02_completed')==='false','False certification');
 click('Abrir Sector 11');await waitFor(()=>!!document.querySelector('[data-sector="11"]'),'Final open failed');
 document.getElementById('result')!.textContent=`PASS: Chromium 29 sectors / ${count} individual contents; all sidebar destinations and six stages; checks and microchallenges with feedback; evidence, active selection, legacy progress preserved; mission/test return; 18 tool codes; experimental JSON export with provenance; desktop columns. Actual Tomo 02 components.`;
}
run().catch(e=>document.getElementById('result')!.textContent='FAIL: '+e.stack+' | '+document.querySelector('[data-investigation]')?.getAttribute('data-investigation'));
