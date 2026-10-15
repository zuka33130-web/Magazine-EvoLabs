/** Run after npm run build. Exercises restored ZIP sectors through the current magazine. */
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
const output=fs.mkdtempSync(path.join(os.tmpdir(),'evo-original-sectors-'));
const numbers=Array.from({length:29},(_,i)=>String(i+11)).filter(n=>Number(n)>=Number(process.env.EVO_ORIGINAL_START||11));
const imports=numbers.map(n=>`import * as s${n} from './src/data/tomo02Sector${n}Data';`).join('\n');
const source=`import React from 'react';import {createRoot} from 'react-dom/client';import {Tomo02MagazineView} from './src/components/tomo02/Tomo02MagazineView';import {TutorEvoProvider} from './src/components/tutor/TutorEvoContext';${imports}\nwindow.originalData={${numbers.map(n=>`'${n}':s${n}`).join(',')}};createRoot(document.getElementById('root')).render(<TutorEvoProvider><Tomo02MagazineView initialSubView="index"/></TutorEvoProvider>);`;
await build({stdin:{contents:source,resolveDir:root,loader:'tsx'},outfile:path.join(output,'app.js'),bundle:true,format:'esm',platform:'browser',loader:{'.png':'dataurl','.jpg':'dataurl','.webp':'dataurl'},define:{'process.env.NODE_ENV':'"production"'},alias:{components:path.join(root,'src/components')}});
const cssFile=fs.readdirSync(path.join(root,'dist/assets')).find(file=>file.endsWith('.css'));
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
 await page.goto(`http://127.0.0.1:${server.address().port}`);await page.getByRole('button',{name:'Abrir Sector 11',exact:true}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(output,'index-mobile.png'),fullPage:true});await page.setViewportSize({width:1440,height:1000});
 const snapshot=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key.startsWith('evo_tomo02_'))));const before=await snapshot();
 let investigations=0,cases=0,questions=0;const inventory=[];
 for(const n of numbers){
  const data=await page.evaluate(n=>{const m=window.originalData[n];return{invs:m[`SECTOR_${n}_INVESTIGATIONS`].map(i=>({code:i.code,title:i.title})),cases:m[`SECTOR_${n}_MINICASES`].length,questions:m[`SECTOR_${n}_TEST_BANK`].length};},n);
  assert.ok(data.invs.length&&data.cases&&data.questions);assert.equal(new Set(data.invs.map(i=>i.code)).size,data.invs.length);inventory.push({sector:n,investigations:data.invs.length,cases:data.cases,questions:data.questions});
  await page.getByRole('button',{name:`Abrir Sector ${n}`,exact:true}).click();const host=page.locator(`[data-original-sector="${n}"]`);await host.waitFor();await host.locator('h1,h2,h3').first().waitFor({state:'attached'});
  for(const inv of data.invs){const clicked=await host.evaluate((el,inv)=>{const b=[...el.querySelectorAll('button')].find(b=>b.textContent.includes(inv.code)&&b.textContent.includes(inv.title));if(!b)return false;b.click();return true;},inv);assert.ok(clicked,`${n}: enlace ${inv.code}`);await page.waitForFunction(({n,title})=>[...document.querySelectorAll(`[data-original-sector="${n}"] h1, [data-original-sector="${n}"] h2, [data-original-sector="${n}"] h3`)].some(el=>el.textContent.replace(/\s+/g,' ').includes(title.replace(/\s+/g,' '))),{n,title:inv.title});await page.waitForTimeout(5);investigations++;}
  const body=()=>host.locator(':scope > div').last();const returnToReader=()=>body().locator('button').filter({has:page.locator('svg.lucide-arrow-left')}).or(body().getByRole('button',{name:/volver|regresar/i})).first();
  await body().getByRole('button',{name:/casos/i}).first().click();const modal=host.locator('div.fixed.inset-0').last();await modal.waitFor();await modal.locator('button').filter({has:page.locator('svg.lucide-x')}).first().click();await modal.waitFor({state:'hidden'});cases+=data.cases;
  await body().getByRole('button',{name:/Lab|Simulator|Recovery|Triage|Misi[oó]n|Consola/i}).first().click();await returnToReader().waitFor();await returnToReader().click();await body().getByRole('button',{name:/Examen|Test|Evalua/i}).first().click();await returnToReader().waitFor();await returnToReader().click();questions+=data.questions;
  if(['11','20','30','39'].includes(n)){await page.screenshot({path:path.join(output,`sector-${n}-desktop.png`),fullPage:true});await page.setViewportSize({width:390,height:844});await host.locator('h1,h2,h3').first().waitFor({state:'attached'});await page.screenshot({path:path.join(output,`sector-${n}-mobile.png`),fullPage:true});await page.setViewportSize({width:1440,height:1000});}
  await host.getByRole('button',{name:'Volver al índice',exact:true}).click();await page.getByRole('button',{name:`Abrir Sector ${n}`,exact:true}).waitFor();console.log(`PASS Sector ${n}: ${data.invs.length} investigaciones, misión, examen y casos`);
 }
 await page.getByRole('button',{name:'Abrir Sector 39',exact:true}).click();await page.locator('[data-original-sector="39"]').getByRole('button',{name:/Sector 38:/}).click();await page.locator('[data-original-sector="38"] h1').waitFor();await page.locator('[data-original-sector="38"]').getByRole('button',{name:/Sector 39:/}).click();await page.locator('[data-original-sector="39"] h1').waitFor();await page.getByRole('button',{name:'Volver al índice',exact:true}).click();console.log('PASS: navegación original 39 → 38 → 39');
 assert.deepEqual(await snapshot(),before,'Restored content must not overwrite or duplicate existing progress');
 await page.getByRole('button',{name:'Abrir Sector 11',exact:true}).click();await page.locator('[data-original-sector="11"] header').waitFor();await page.locator('[data-original-sector="11"]').getByRole('button',{name:'Investigaciones ampliadas del Sector 11',exact:true}).click();await page.locator('[data-sector="11"]').waitFor();await page.getByRole('button',{name:'Sector original 11',exact:true}).click();await page.locator('[data-original-sector="11"] header').waitFor();
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(output,'inventory.json'),JSON.stringify(inventory,null,2));console.log(`PASS: ${numbers.length} sectores originales / ${investigations} investigaciones / ${cases} casos / ${questions} preguntas; índices, misiones, tests, retorno, ambas bibliotecas y progreso conservado. Sin excepciones.`);console.log(`Artifacts: ${output}`);
}finally{await browser?.close();server.close();}
