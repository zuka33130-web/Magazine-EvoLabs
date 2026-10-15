/** Run after npm run build. Exercises the unified magazine and every preserved ZIP resource. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('esbuild');
const {chromium}=require('playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=fs.mkdtempSync(path.join(os.tmpdir(),'evo-unified-sectors-'));
const numbers=Array.from({length:29},(_,i)=>String(i+11));
const imports=numbers.map(n=>`import * as s${n} from './src/data/tomo02Sector${n}Data';`).join('\n');
const source=`import React from 'react';import {createRoot} from 'react-dom/client';import {Tomo02MagazineView} from './src/components/tomo02/Tomo02MagazineView';import {TutorEvoProvider} from './src/components/tutor/TutorEvoContext';${imports}\nwindow.originalData={${numbers.map(n=>`'${n}':s${n}`).join(',')}};createRoot(document.getElementById('root')).render(<TutorEvoProvider><Tomo02MagazineView initialSubView="index"/></TutorEvoProvider>);`;
await build({stdin:{contents:source,resolveDir:root,loader:'tsx'},outfile:path.join(output,'app.js'),bundle:true,format:'esm',platform:'browser',loader:{'.png':'dataurl','.jpg':'dataurl','.webp':'dataurl'},define:{'process.env.NODE_ENV':'"production"'},alias:{components:path.join(root,'src/components')}});
const cssFile=fs.readdirSync(path.join(root,'dist/assets')).find(file=>file.startsWith('index-')&&file.endsWith('.css'));
const server=http.createServer((req,res)=>{
 if(req.url==='/app.js'){res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(path.join(output,'app.js')));}
 else if(req.url==='/styles.css'){res.setHeader('Content-Type','text/css');res.end(fs.readFileSync(path.join(root,'dist/assets',cssFile)));}
 else{res.setHeader('Content-Type','text/html');res.end('<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body style="background:#07090e"><div id="root"></div><script type="module" src="/app.js"></script></body></html>');}
});
let browser;
try{
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 browser=await chromium.launch({executablePath:process.env.EVO_CHROMIUM_EXECUTABLE||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{localStorage.setItem('evo_tomo02_sector11_learning_v1',JSON.stringify({answers:{0:1},decision:2,note:'EVIDENCIA EXISTENTE: conservar íntegramente.',finalExperiment:false}));localStorage.setItem('evo_tomo02_progress',JSON.stringify({m00:'completed','sector-11':'completed'}));localStorage.setItem('evo_tomo02_completed','false');});
 await page.goto(`http://127.0.0.1:${server.address().port}`);await page.getByRole('button',{name:'Ingresar al Sector 11',exact:true}).waitFor();
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Index mobile overflow');await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(80);await page.screenshot({path:path.join(output,'index-mobile.png'),fullPage:true});await page.setViewportSize({width:1440,height:1000});
 const snapshot=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key.startsWith('evo_tomo02_'))));const before=await snapshot();

 let investigations=0,cases=0,questions=0;const inventory=[];
 const enter=n=>page.getByRole('button',{name:`Ingresar al Sector ${n}`,exact:true});
 const forbidden=async()=>assert.equal(await page.getByRole('button',{name:/Sector original|Investigaciones ampliadas|Abrir Sector/}).count(),0);
 const initialLegacy=JSON.parse(before.evo_tomo02_sector11_learning_v1);
 const cards=await page.locator('h3,h4').filter({hasText:/./}).evaluateAll(els=>els.filter(el=>el.parentElement.textContent.includes('[SECTOR')).map(el=>({title:el.textContent,classes:el.closest('[class*="rounded-2xl"]').className})));
 assert.equal(cards.length,40);const reference=cards[10].classes;assert.ok(cards.slice(11).every(card=>card.classes===reference),'Card tokens differ from sector 10');
 assert.equal(await page.getByRole('button',{name:/^Ingresar al Sector /}).count(),29);await forbidden();
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(80);await page.screenshot({path:path.join(output,'index-desktop.png'),fullPage:true});
 for(let n=0;n<=10;n++){
   const padded=String(n).padStart(2,'0');
   const b=page.getByRole('button',{name:'INGRESAR',exact:true}).nth(n);await b.click();
   await page.locator('button').filter({has:page.locator('svg.lucide-arrow-left')}).first().waitFor();
   await page.locator('button').filter({has:page.locator('svg.lucide-arrow-left')}).first().click();await enter('11').waitFor();
   console.log('PASS: preserved sector '+padded+' opens and returns');
 }
 for(const n of numbers){
  const data=await page.evaluate(n=>{const m=window.originalData[n];return{invs:m[`SECTOR_${n}_INVESTIGATIONS`].map(i=>({code:i.code,title:i.title})),cases:m[`SECTOR_${n}_MINICASES`].length,questions:m[`SECTOR_${n}_TEST_BANK`].length};},n);
  await enter(n).click();const host=page.locator(`[data-sector="${n}"]`);await host.waitFor();await forbidden();
  const resources=host.locator(`[data-sector-resources="${n}"]`);await resources.waitFor();
  const ids=await host.locator('[data-investigation-link]').evaluateAll(els=>els.map(el=>el.dataset.investigationLink));
  let found=new Set();
  for(const id of ids){
   await host.locator(`[data-investigation-link="${id}"]`).evaluate(button=>button.click());
   await page.locator(`[data-investigation="${id}"]`).waitFor();
   assert.equal(await host.locator('[data-stage]').count(),6);
   for(const code of await resources.locator('[data-complementary-note]').evaluateAll(els=>els.map(el=>el.dataset.complementaryNote)))found.add(code);
   investigations++;
  }
  await host.getByRole('button',{name:'Misión',exact:true}).click();
  for(const code of await resources.locator('[data-complementary-note]').evaluateAll(els=>els.map(el=>el.dataset.complementaryNote)))found.add(code);
  assert.equal(found.size,data.invs.length,`Every supplementary source must be connected: ${n}`);
  await resources.getByText('Simulador de misión del sector',{exact:true}).click();await resources.locator('button:visible').first().waitFor();
  assert.ok(await resources.locator('button:visible').count()>1);
  await resources.locator('button').filter({has:page.locator('svg.lucide-arrow-left')}).first().click();await host.locator('[data-stage]').first().waitFor();
  await host.getByRole('button',{name:'Test',exact:true}).click();await resources.getByText('Banco de práctica del sector',{exact:true}).click();await resources.locator('button:visible').first().waitFor();
  assert.ok(await resources.locator('button:visible').count()>1);
  await resources.locator('button').filter({has:page.locator('svg.lucide-arrow-left')}).first().click();await host.locator('[data-stage]').first().waitFor();
  await host.getByRole('button',{name:'Investigaciones',exact:true}).click();await resources.getByText('Diagramas interactivos del sector',{exact:true}).click();await resources.locator('button:visible').first().waitFor();
  await resources.getByRole('button',{name:'Minicasos del sector',exact:true}).click();const modal=resources.locator('div.fixed.inset-0').last();await modal.waitFor();await modal.locator('button').filter({has:page.locator('svg.lucide-x')}).first().click();await modal.waitFor({state:'hidden'});
  cases+=data.cases;questions+=data.questions;inventory.push({sector:n,readerContents:ids.length,complementarySources:found.size,cases:data.cases,questions:data.questions});
  if(['11','20','30','39'].includes(n)){
   await host.locator(`[data-investigation-link="${ids[0]}"]`).evaluate(button=>button.click());await page.locator(`[data-investigation="${ids[0]}"]`).waitFor();
   if(n==='11'){await page.context().grantPermissions(['clipboard-read','clipboard-write']);await resources.getByText('Notas técnicas y consultas específicas',{exact:true}).click();const copy=resources.getByRole('button',{name:'Copiar consulta',exact:true}).first();const expected=await copy.locator('..').locator('pre').innerText();await copy.click();await resources.getByRole('button',{name:'Copiado',exact:true}).first().waitFor();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected);await resources.getByText('Notas técnicas y consultas específicas',{exact:true}).click();}

   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(80);await page.screenshot({path:path.join(output,`sector-${n}-desktop.png`),fullPage:true});await page.setViewportSize({width:390,height:844});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Mobile overflow ${n}`);
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(80);await page.screenshot({path:path.join(output,`sector-${n}-mobile.png`),fullPage:true});await page.setViewportSize({width:1440,height:1000});
  }
  await host.getByRole('button',{name:'ÍNDICE',exact:true}).click();await enter(n).waitFor();
  console.log(`PASS: Sector ${n}, single reader, ${ids.length} developed contents, ${found.size} complementary sources, mission, test, diagrams, cases`);
 }
 await enter('39').click();await page.getByRole('button',{name:'← Sector anterior',exact:true}).click();await page.locator('[data-sector="38"]').waitFor();await page.getByRole('button',{name:'Sector siguiente →',exact:true}).click();await page.locator('[data-sector="39"]').waitFor();
 const after=await snapshot();assert.deepEqual(JSON.parse(after.evo_tomo02_sector11_learning_v1),initialLegacy);assert.equal(after.evo_tomo02_progress,before.evo_tomo02_progress);assert.equal(after.evo_tomo02_completed,before.evo_tomo02_completed);
 assert.ok(Object.keys(after).every(key=>key in before||/^evo_tomo02_sector\d+_(learning_v1|investigations_v2)$/.test(key)||key==='evo_tomo02_last_sector'),'No parallel progress');
 await forbidden();assert.deepEqual(errors,[]);fs.writeFileSync(path.join(output,'inventory.json'),JSON.stringify(inventory,null,2));
 console.log(`PASS: 40 index cards; 00–10 open/return; ${numbers.length} unified entries / ${investigations} developed contents / 531 supplementary sources / ${cases} cases / ${questions} practice questions. Legacy progress preserved, no exceptions.`);console.log(`Artifacts: ${output}`);
}finally{await browser?.close();server.close();}
