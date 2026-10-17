/** Actual App → catalogue → owner preview → magazine → treatise. Auth identity is a test fixture only. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const root=process.cwd(),output=process.env.EVO_TOMO03_OUTPUT||'/tmp/evo-tomo03-treatise';
const baseline=process.env.EVO_TOMO03_BASELINE==='1';
const baselineRevision=process.env.EVO_TOMO03_BASELINE_REV||'9fccc31c0a7643f376bb9c7b1cdc374f1f604d71';
fs.mkdirSync(output,{recursive:true});
const entry=`import React from 'react';import{createRoot}from'react-dom/client';import{AppContent}from'./src/App';import{EvoAccessProvider}from'./src/auth/EvoAccessContext';import{TutorEvoProvider}from'./src/components/tutor/TutorEvoContext';import{TOMO03_TREATISE_TOPICS,TOMO03_TREATISE_RESOURCES}from'./src/data/tomo03Treatise';import{TOMO03_TREATISE_LABS}from'./src/data/tomo03TreatiseLabs';window.topics=TOMO03_TREATISE_TOPICS;window.resources=TOMO03_TREATISE_RESOURCES;window.labs=TOMO03_TREATISE_LABS;createRoot(document.getElementById('root')).render(<EvoAccessProvider><TutorEvoProvider><AppContent/></TutorEvoProvider></EvoAccessProvider>);`;
await build({stdin:{contents:entry,resolveDir:root,loader:'tsx'},outfile:path.join(output,'app.js'),bundle:true,format:'esm',platform:'browser',loader:{'.png':'dataurl','.jpg':'dataurl','.webp':'dataurl'},alias:{components:root+'/src/components'},define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'test-auth-and-entry',setup(b){
 b.onLoad({filter:/\/src\/App\.tsx$/},args=>({contents:fs.readFileSync(args.path,'utf8')+'\nexport {AppContent};',loader:'tsx',resolveDir:root+'/src'}));
 if(baseline)b.onLoad({filter:/Tomo03(Workbench|Magazine)View\.tsx$/},args=>({contents:execFileSync('git',['show',baselineRevision+':'+path.relative(root,args.path)],{cwd:root,encoding:'utf8'}),loader:'tsx',resolveDir:path.dirname(args.path)}));
 b.onResolve({filter:/EvoAuthProvider$/},()=>({path:'auth',namespace:'fixture'}));
 b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`export const useEvoAuth=()=>({user:{uid:'test'},emailVerified:true,isOwner:window.testRole==='owner',loading:false,signOut:async()=>{}});export const EvoAuthProvider=({children})=>children;`,loader:'js'}));
}}]});
const css=fs.readdirSync(root+'/dist/assets').find(file=>/^index-.*\.css$/.test(file));assert.ok(css,'Run build first');
const server=http.createServer((req,res)=>{
 if(req.url==='/app.js'){res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(output+'/app.js'));}
 else if(req.url==='/style.css'){res.setHeader('Content-Type','text/css');res.end(fs.readFileSync(root+'/dist/assets/'+css));}
 else if(req.url?.startsWith('/covers/')){const file=path.resolve(root,'public','.'+decodeURIComponent(req.url));if(file.startsWith(root+'/public/covers/')&&fs.existsSync(file)){res.setHeader('Content-Type','image/png');res.end(fs.readFileSync(file));}else{res.statusCode=404;res.end();}}
 else{res.setHeader('Content-Type','text/html');res.end('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>');}
});
let browser;
try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(15000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
 const storageKey='evo_tomo03_repair_workbench_v1';
 await page.addInitScript(()=>{
  window.testRole='owner';localStorage.setItem('evo_academia_intro_dismissed','true');localStorage.setItem('evo_tutor_onboarding_dismissed_v1','true');
  if(!localStorage.getItem('evo_tomo03_repair_workbench_v1'))localStorage.setItem('evo_tomo03_repair_workbench_v1',JSON.stringify({schema:1,records:{mod35:{symptom:'NOTA ANTERIOR CONSERVADA'}},labs:{'power-zero':{p1:'a'}},professional:{'13':{tree:{},quiz:{},observations:[],hypothesis:null,repair:null,verified:false,log:['CASO ORIGINAL CONSERVADO']}}}));
 });
 const url=`http://127.0.0.1:${server.address().port}`;
 await page.goto(url);await page.getByRole('button',{name:'INGRESAR A BIBLIOTECA & TOMOS',exact:true}).waitFor();
 await page.setViewportSize({width:390,height:844});
 const initialMobileWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
 await page.screenshot({path:output+'/inicio-mobile-baseline.png'});
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'INGRESAR A BIBLIOTECA & TOMOS',exact:true}).click();
 await page.getByRole('button',{name:'ABRIR TOMO 03 EN DESARROLLO →',exact:true}).click();
 if(baseline){
  await page.getByRole('button',{name:'BANCO INTERACTIVO',exact:true}).click();await page.getByRole('heading',{name:'BANCO DE REPARACIÓN INTERACTIVO',exact:true}).waitFor();
  await page.setViewportSize({width:390,height:844});
  const measurement=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
  fs.writeFileSync(output+'/baseline.json',JSON.stringify({...measurement,revision:baselineRevision}));await page.screenshot({path:output+'/bank-baseline-mobile.png'});console.log('BASELINE '+baselineRevision+' bank:',measurement);
 }else{
 const magazineIndex=page.locator('#t03-page-03');await magazineIndex.locator('[data-treatise-link="t00"]').waitFor();
 const toolbar=page.getByRole('navigation',{name:'Barra de herramientas de la revista',exact:true});
 assert.equal(await toolbar.getByRole('button',{name:/^T0[1-4]$/}).count(),0,'Do not restore the obsolete four-volume selector removed in main');
 assert.equal(await toolbar.getByLabel('Volumen 03 de 12',{exact:true}).count(),1);
 assert.equal(await magazineIndex.locator('[data-treatise-link]').count(),15);
 await magazineIndex.screenshot({path:output+'/indice-desktop.png'});
 await magazineIndex.locator('[data-treatise-link="t09"]').click();
 await page.locator('[data-treatise-topic="t09"]').waitFor();
 assert.equal(await page.locator('[data-professional-module="10"]').count(),1,'Magazine topic link opens its canonical owner');
 await page.getByRole('button',{name:'Volver al manual',exact:true}).click();
 await page.getByRole('button',{name:'BANCO INTERACTIVO',exact:true}).click();await page.locator('[data-treatise-topic="t00"]').waitFor();
 const topics=await page.evaluate(()=>window.topics),resources=await page.evaluate(()=>window.resources);
 assert.equal(await page.locator('[data-canonical-module]').count(),35);
 assert.equal(await page.locator('[data-canonical-index]').getAttribute('open'),null,'Treatise is primary; original bank is complementary');
 for(const topic of topics){
  await page.locator(`[data-treatise-link="${topic.id}"]`).click();
  const guide=page.locator(`[data-treatise-topic="${topic.id}"]`);await guide.waitFor();
  assert.equal(await guide.locator('[data-treatise-stage]').count(),5);
  for(const number of topic.modules){await guide.getByRole('button',{name:'Abrir módulo del banco '+number,exact:true}).click();assert.ok((await page.locator('main').last().innerText()).includes('MÓDULO '+number+'/35'));}
  for(const tool of resources[topic.id].tools){
   const toolIndex=resources[topic.id].tools.indexOf(tool);
   await guide.locator('div.flex').first().getByRole('button').nth(toolIndex).click();
   assert.equal(await page.getByLabel('Herramienta profesional',{exact:true}).inputValue(),tool);
   await page.getByRole('button',{name:'Protocolos y síntomas',exact:true}).click();
  }
  if(resources[topic.id].guidedLab){await guide.getByRole('button',{name:'Abrir práctica guiada relacionada',exact:true}).click();assert.equal(await page.getByLabel('Equipo y escenario simulado',{exact:true}).inputValue(),'');await page.getByRole('button',{name:'Protocolos y síntomas',exact:true}).click();}
  await page.setViewportSize({width:390,height:844});
  const layout=await page.locator('main').last().evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,outside:[...el.querySelectorAll('*')].some(node=>node.getBoundingClientRect().right>innerWidth+1)}));
  assert.ok(layout.scroll<=layout.width&&!layout.outside,topic.id+' workbench mobile overflow');
  const baselineMeasurement=JSON.parse(fs.readFileSync(output+'/baseline.json','utf8'));
  const currentWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
  if(currentWidth>390){
   assert.ok(baselineMeasurement.scrollWidth>390,'Outer overflow must also exist in the original bank');
   assert.deepEqual(await page.evaluate(()=>{const header=document.querySelector('header');return [...document.querySelectorAll('body *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1&&!header.contains(el)).map(el=>el.tagName);}),[],'Only the unchanged global header may overflow');
  }
  await page.setViewportSize({width:1440,height:1000});
 }
 console.log('PASS: real App navigation, 15 main topics, five stages, canonical links and existing tools/practices; workbench without mobile overflow');
 console.log('GLOBAL HEADER BASELINE:',fs.readFileSync(output+'/baseline.json','utf8'),'; Home scroll width:',initialMobileWidth,'; workbench stays within its own viewport');
 const labs=await page.evaluate(()=>window.labs);
 for(const item of labs){
  const topic=topics.find(t=>t.lab===item.id);
  await page.getByRole('button',{name:'Volver al manual',exact:true}).click();
  await magazineIndex.locator(`[data-treatise-link="${topic.id}"]`).click();
  const guide=page.locator(`[data-treatise-topic="${topic.id}"]`);
  for(const details of await guide.locator('details').all())if(await details.getAttribute('open')===null)await details.locator('summary').click();
  await guide.evaluate(el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-300,behavior:'instant'}));await page.screenshot({path:output+`/${topic.id}-desktop.png`});
  await page.setViewportSize({width:390,height:844});await guide.evaluate(el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-300,behavior:'instant'}));await page.screenshot({path:output+`/${topic.id}-mobile.png`});await page.setViewportSize({width:1440,height:1000});
  await guide.getByRole('button',{name:/Abrir Laboratorio/}).click();
  assert.equal(await page.getByLabel('Equipo y escenario simulado',{exact:true}).inputValue(),item.id);
  const lab=page.locator(`[data-repair-case="${item.scenario.id}"]`);await lab.waitFor();
  assert.equal(await lab.locator('[data-case-resolution]').count(),0);
  await lab.getByRole('button',{name:'Comprobar reparación simulada',exact:true}).click();assert.equal(await lab.locator('[data-case-resolution]').count(),0);
  await lab.locator('[data-repair-test="unsafe"]').click();assert.match(await lab.locator('[data-repair-message]').innerText(),/seguridad/);
  const later=item.scenario.tests.find(test=>test.requires?.length);await lab.locator(`[data-repair-test="${later.id}"]`).click();assert.match(await lab.locator('[data-repair-message]').innerText(),/previas/);
  for(const test of item.scenario.tests.filter(test=>!test.unsafe))await lab.locator(`[data-repair-test="${test.id}"]`).click();
  await lab.getByRole('button',{name:item.scenario.hypotheses.find(h=>h.id===item.scenario.cause).label,exact:true}).click();
  await lab.getByRole('button',{name:item.scenario.repairs.find(r=>r.id!==item.scenario.repair).label,exact:true}).click();await lab.getByRole('button',{name:'Comprobar reparación simulada',exact:true}).click();assert.equal(await lab.locator('[data-case-resolution]').count(),0);
  await lab.getByRole('button',{name:item.scenario.repairs.find(r=>r.id===item.scenario.repair).label,exact:true}).click();await lab.getByRole('button',{name:'Comprobar reparación simulada',exact:true}).click();await lab.locator('[data-case-resolution]').waitFor();
  await lab.getByRole('button',{name:'Registrar interpretación y exportar expediente',exact:true}).click();assert.ok((await page.locator('pre').innerText()).includes(item.scenario.after));
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Exportar TXT del módulo',exact:true}).click()]);await download.saveAs(output+'/'+item.id+'.txt');assert.ok(fs.readFileSync(output+'/'+item.id+'.txt','utf8').includes(item.scenario.after));
  await page.getByRole('button',{name:'Protocolos y síntomas',exact:true}).click();
 }
 await page.goto(url+'/?volume=03');await page.getByRole('button',{name:'BANCO INTERACTIVO',exact:true}).click();
 const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey);
 for(const item of labs)assert.equal(saved.professional[item.id].verified,true);
 assert.equal(saved.professional['13'].verified,false);assert.deepEqual(saved.professional['13'].log,['CASO ORIGINAL CONSERVADO']);assert.equal(saved.records.mod35.symptom,'NOTA ANTERIOR CONSERVADA');assert.equal(saved.labs['power-zero'].p1,'a');
 await page.getByRole('button',{name:'Laboratorios',exact:true}).click();
 for(const item of labs){await page.getByLabel('Equipo y escenario simulado',{exact:true}).selectOption(item.id);await page.locator(`[data-repair-case="${item.scenario.id}"] [data-case-resolution]`).waitFor();}
 await page.getByRole('button',{name:'Protocolos y síntomas',exact:true}).click();await page.locator('[data-canonical-index] > summary').click();await page.getByLabel('Buscar módulo',{exact:true}).fill('RAM');assert.ok(await page.locator('[data-canonical-module]').count()>0);assert.ok(await page.locator('[data-canonical-module]').count()<35);await page.getByLabel('Buscar módulo',{exact:true}).fill('');assert.equal(await page.locator('[data-canonical-module]').count(),35);
 await page.locator('[data-canonical-module="mod08"]').click();assert.equal(await page.locator('[data-treatise-topic]').count(),0);await page.locator('[data-professional-module="08"]').waitFor();
 assert.deepEqual(errors,[]);
 console.log('PASS: two evidence-gated cases, unsafe/prerequisite/wrong-repair rejection, export, persistence, original progress, canonical bank search and return');
 const free=await browser.newPage();await free.addInitScript(()=>{window.testRole='free';localStorage.setItem('evo_academia_intro_dismissed','true');localStorage.setItem('evo_tutor_onboarding_dismissed_v1','true');});await free.goto(url+'/?volume=03');await free.getByText('Tomo 03 // Reparación de PC',{exact:true}).waitFor();assert.equal(await free.locator('[data-treatise-link]').count(),0);assert.equal(await free.getByRole('button',{name:'BANCO INTERACTIVO',exact:true}).count(),0);await free.close();
 console.log('PASS: existing FREE gate blocks access to the treatise');console.log('Artifacts:',output);
 }
}catch(error){console.error(error);throw error;}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
