import React from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Tomo03WorkbenchView} from '../src/components/tomo03/Tomo03WorkbenchView';
import {TOMO_03_MODULES, TOMO_03_META} from '../src/data/tomo03Data';
import {assessAtxRail,TOMO03_REPAIR_LABS} from '../src/data/tomo03WorkbenchData';
const assert=(v:unknown,message:string)=>{if(!v)throw Error(message);};
const pause=(ms=20)=>new Promise<void>(res=>setTimeout(res,ms));
const root=createRoot(document.getElementById('root')!);
const click=(name:string)=>{
 const b=[...document.querySelectorAll('button')].find(b=>b.textContent?.includes(name));
 assert(b,'Missing button '+name);
 flushSync(()=>b!.click());
};
const setInput=(el:HTMLInputElement|HTMLTextAreaElement,value:string)=>{
 const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
 const setter=Object.getOwnPropertyDescriptor(proto,'value')?.set;
 assert(setter,'Missing native input setter');
 flushSync(()=>{setter!.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));});
};
async function run(){
 localStorage.clear();
 assert(TOMO_03_MODULES.length===35,'Module count must be 35');
 assert(TOMO_03_META.totalPages===42,'A4 page count must be 42');
 assert(TOMO03_REPAIR_LABS.length===4,'Four working labs expected');
 const ids=new Set(TOMO_03_MODULES.map(m=>m.moduleNumber));
 assert(ids.size===35 && ids.has('01') && ids.has('35'),'35 unique module numbers required');
 for(const lab of TOMO03_REPAIR_LABS){
  assert(lab.steps.length>=3,'Lab needs multiple decisions: '+lab.id);
  for(const step of lab.steps){assert(step.options.some(o=>o.id===step.correctId),'Missing correct choice: '+step.id);}
  for(const m of lab.moduleNumbers){assert(ids.has(m),'Invalid linked module: '+m);}
 }
 const r=assessAtxRail('12',12.04);
 assert(r?.within===true,'Good 12 V value evaluated incorrectly');
 assert(assessAtxRail('12',11.3)?.within===false,'Low 12 V value accepted');
 assert(assessAtxRail('5vsb',5.25)?.within===true,'Inclusive rail boundary invalid');
 assert(assessAtxRail('5','foo' as unknown as number)===null,'Invalid rail sample accepted');

 flushSync(()=>root.render(<Tomo03WorkbenchView onBack={()=>{}}/>));
 await pause();
 assert(document.body.textContent!.includes('BANCO DE REPARACIÓN INTERACTIVO'),'Workbench not rendered');
 assert(document.querySelectorAll('aside button[aria-pressed]').length===35,'Not all 35 modules navigable');
 click('[08] DIAGNÓSTICO PERICIAL DE RAM');
 assert(document.body.textContent!.includes('MÓDULO 08/35'),'Module context did not switch');
 click('No, comprobado');
 assert(document.querySelector('[data-diagnostic-node] button[aria-pressed="true"]'),'Professional diagnostic branch selection not rendered');
 const symptom=[...document.querySelectorAll('textarea')][0] as HTMLTextAreaElement;
 setInput(symptom,'Equipo de prueba sin video con LED DRAM persistente.');
 await pause();
 assert(JSON.parse(localStorage.getItem('evo_tomo03_repair_workbench_v1')||'{}').records.mod08.symptom.includes('LED DRAM'),'Manual evidence not persisted');
 click('Laboratorios');
 for(const lab of TOMO03_REPAIR_LABS){
  click(lab.title);
  for(const step of lab.steps){
   const option=step.options.find(c=>c.id===step.correctId)!;
   click(option.label);
  }
  assert(document.body.textContent!.includes('Resultado de la práctica: '+lab.steps.length+' / '+lab.steps.length),'Lab score incorrect: '+lab.id);
 }
 click('Herramientas');
 assert(document.body.textContent!.includes('Intérprete de tensiones ATX'),'ATX instrument missing');
 const voltage=document.querySelector<HTMLInputElement>('input[placeholder="Por ejemplo: 12,04"]')!;
 assert(voltage,'Voltage field missing');
 setInput(voltage,'11,30');
 assert(document.body.textContent!.includes('Fuera del rango de tensión nominal'),'Out-of-range voltage not reported');
 setInput(voltage,'12,04');
 assert(document.body.textContent!.includes('Dentro del rango de tensión nominal'),'Valid voltage not reported');
 click('Expediente de taller');
 assert(document.body.textContent!.includes('Equipo de prueba sin video con LED DRAM'),'Manual case notes omitted from export preview');
 assert(document.body.textContent!.includes('PRÁCTICAS DIDÁCTICAS'),'Lab history omitted');
 assert(!localStorage.getItem('evo_tomo03_completed'),'Must not fabricate certification');
 flushSync(()=>root.render(<Tomo03WorkbenchView key="direct-module-14" initialModuleNumber="14" onBack={()=>{}}/>));
 await pause();
 assert(document.querySelector('[data-professional-module="14"]'),'Deep-linked professional module 14 is not visible');
 document.getElementById('result')!.textContent='PASS: 35 guided protocols, four interactive labs, manual evidence persistence, ATX tolerances and workshop dossier. No automatic telemetry or false certificate.';
}
run().catch(err=>document.getElementById('result')!.textContent='FAIL: '+(err instanceof Error?err.stack:String(err)));
