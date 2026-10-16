import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Tomo02MagazineView } from '../src/components/tomo02/Tomo02MagazineView';
import { Tomo02MasterExpedienteModal } from '../src/components/tomo02/Tomo02MasterExpedienteModal';
import { TutorEvoProvider } from '../src/components/tutor/TutorEvoContext';

const root=createRoot(document.getElementById('root')!);
const pause=(ms=30)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
const assert=(value: unknown,message: string)=>{if(!value) throw new Error(message);};
const names=Array.from({length:40},(_,n)=>'sector-'+String(n).padStart(2,'0'));
const completeProgress=()=>Object.fromEntries(names.map(id=>[id,'completed']));
const attempt=(score: number,total: number,passed: boolean)=>({passed,score,totalQuestions:total,percentage:Math.round(score/total*100),tomoId:'tomo-02'});
const put=(key:string,value: unknown)=>localStorage.setItem(key,JSON.stringify(value));
const report=(name:string)=>console.log('PASS: '+name);

async function mount(view: React.ReactElement) {
  flushSync(()=>root.render(null));
  await pause();
  flushSync(()=>root.render(view));
  await pause();
}
async function run(){
  // An old completion flag cannot bypass the current prerequisites.
  localStorage.clear();
  put('evo_tomo02_progress',completeProgress());
  put('evo_tomo02_sector39_learning_v1',{finalExperiment:true});
  localStorage.setItem('evo_tomo02_completed','true');
  await mount(<TutorEvoProvider><Tomo02MagazineView initialSubView="completion" /></TutorEvoProvider>);
  assert(document.body.textContent!.includes('Finalización pendiente'),'Missing exam should block certificate');
  assert(localStorage.getItem('evo_tomo02_completed')==='false','Old completion flag was not revoked');
  report('no exam => certificate denied');

  localStorage.clear();
  const missingProgress=completeProgress(); delete missingProgress['sector-05'];
  put('evo_tomo02_progress',missingProgress);
  put('evo_tomo02_sector39_learning_v1',{finalExperiment:true});
  put('evo_labs_exam_history_tomo-02',[attempt(8,10,true)]);
  await mount(<TutorEvoProvider><Tomo02MagazineView initialSubView="completion" /></TutorEvoProvider>);
  assert(document.body.textContent!.includes('Finalización pendiente'),'39/40 should block certificate');
  assert(localStorage.getItem('evo_tomo02_completed')==='false','39/40 completion erroneously granted');
  report('39 of 40 sectors => certificate denied');

  localStorage.clear();
  put('evo_tomo02_progress',completeProgress());
  put('evo_labs_exam_history_tomo-02',[attempt(8,10,true)]);
  await mount(<TutorEvoProvider><Tomo02MagazineView initialSubView="completion" /></TutorEvoProvider>);
  assert(document.body.textContent!.includes('Finalización pendiente'),'Missing final experiment should block certificate');
  assert(localStorage.getItem('evo_tomo02_completed')==='false','Missing experiment accepted');
  report('missing sector 39 evidence => certificate denied');

  localStorage.clear();
  put('evo_tomo02_progress',completeProgress());
  put('evo_tomo02_sector39_learning_v1',{finalExperiment:true});
  put('evo_labs_exam_history_tomo-02',[attempt(4,10,true)]);
  await mount(<TutorEvoProvider><Tomo02MagazineView initialSubView="completion" /></TutorEvoProvider>);
  assert(document.body.textContent!.includes('Finalización pendiente'),'Invalid 40% attempt must fail even with passed flag');
  assert(localStorage.getItem('evo_tomo02_completed')==='false','Invalid exam accepted');
  report('invalid exam score => certificate denied');

  localStorage.clear();
  put('evo_tomo02_progress',completeProgress());
  put('evo_tomo02_sector39_learning_v1',{finalExperiment:true});
  put('evo_labs_exam_history_tomo-02',[attempt(8,10,true)]);
  await mount(<TutorEvoProvider><Tomo02MagazineView initialSubView="completion" /></TutorEvoProvider>);
  assert(document.body.textContent!.includes('TOMO 02 SUPERADO CON ÉXITO'),'Eligible completion view not displayed');
  assert(document.body.textContent!.includes('8 / 10 (80%)'),'Real exam score missing from certificate');
  assert(localStorage.getItem('evo_tomo02_completed')==='true','Eligible completion not persisted');
  report('all prerequisites => internal certificate, real score 8/10');

  localStorage.clear();
  const partial={ 'sector-00':'completed','sector-02':'in_progress' } as Record<string,'completed'|'in_progress'|'not_started'>;
  await mount(<Tomo02MasterExpedienteModal onClose={()=>{}} moduleProgress={partial}/>);
  assert(document.body.textContent!.includes('1 / 40 CON AVANCE COMPLETO'),'Incorrect completed sector count');
  assert(document.body.textContent!.includes('1 EN CURSO'),'Incorrect in-progress count');
  let exported='';
  const origCreate=URL.createObjectURL.bind(URL);
  const origClick=HTMLAnchorElement.prototype.click;
  URL.createObjectURL=(blob:Blob|MediaSource)=>{if(blob instanceof Blob)void blob.text().then(text=>{exported=text;});return origCreate(blob);};
  HTMLAnchorElement.prototype.click=function(){ /* Test only: don't download a file. */ };
  try {
    const button=[...document.querySelectorAll('button')].find(b=>b.textContent?.includes('Descargar Expediente'));
    assert(button,'Missing master dossier export action');
    flushSync(()=>button!.click());
    for(let n=0;n<40&&!exported;n++)await pause(15);
    assert(exported.includes('SECTORES CON AVANCE COMPLETO: 1 / 40'),'Export used fictitious progress');
    assert(exported.includes('SECTORES EN CURSO: 1'),'Export has wrong in-progress number');
    assert(exported.includes('Sector 00 -'),'Export missing sector list');
    assert(exported.includes('Sector 39 -'),'Export missing final sector');
    assert(exported.includes('NO certificación individual'),'Export misrepresents its status');
    assert(exported.split('\n').length>40,'Export is not a multiline dossier');
  } finally {
    URL.createObjectURL=origCreate;
    HTMLAnchorElement.prototype.click=origClick;
  }
  report('master dossier real counts, 40 sectors, multiline TXT export');
  document.getElementById('result')!.textContent='PASS: certificate gating (5 scenarios), real exam grade, master dossier 40-sector progress and TXT export.';
}
run().catch(err=>{document.getElementById('result')!.textContent='FAIL: '+(err instanceof Error?err.stack:String(err));});
