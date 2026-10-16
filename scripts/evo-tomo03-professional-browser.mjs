import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const root=process.cwd(),output=process.env.EVO_TOMO03_OUTPUT||fs.mkdtempSync(path.join(os.tmpdir(),'evo-tomo03-professional-'));
fs.mkdirSync(output,{recursive:true});
const source=`import React from 'react';import{createRoot}from'react-dom/client';import{Tomo03WorkbenchView}from'./src/components/tomo03/Tomo03WorkbenchView';import{TOMO03_PROFESSIONAL_MODULES}from'./src/data/tomo03ProfessionalContent';window.modules=TOMO03_PROFESSIONAL_MODULES;createRoot(document.getElementById('root')).render(<Tomo03WorkbenchView onBack={()=>window.wentBack=true}/>);`;
await build({stdin:{contents:source,resolveDir:root,loader:'tsx'},outfile:path.join(output,'app.js'),bundle:true,format:'esm',platform:'browser',define:{'process.env.NODE_ENV':'"production"'}});
const css=fs.readdirSync(path.join(root,'dist/assets')).find(name=>/^index-.*\.css$/.test(name));assert.ok(css,'Run Vite build first');
const server=http.createServer((req,res)=>{if(req.url==='/app.js'){res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(path.join(output,'app.js')));}else if(req.url==='/style.css'){res.setHeader('Content-Type','text/css');res.end(fs.readFileSync(path.join(root,'dist/assets',css)));}else res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>');});
let browser;
try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`http://127.0.0.1:${server.address().port}`);await page.getByRole('heading',{name:'BANCO DE REPARACIÓN INTERACTIVO'}).waitFor();
 assert.equal(await page.locator('aside button[aria-pressed]').count(),35);
 const numbers=await page.evaluate(()=>window.modules.map(m=>m.number));
 for(const number of numbers){
  await page.getByRole('button',{name:'Protocolos y síntomas',exact:true}).click();await page.locator('aside button').filter({hasText:`[${number}]`}).click();
  const host=page.locator(`[data-professional-module="${number}"]`);await host.waitFor();await host.getByRole('button',{name:'Avanzado',exact:true}).click();assert.ok((await host.locator('[data-theory-level="2"]').innerText()).length>180);
  for(let i=0;i<3;i++){const node=host.locator('[data-diagnostic-node]').nth(i);await node.getByRole('button',{name:'No, comprobado',exact:true}).click();}
  const module=await page.evaluate(n=>window.modules.find(m=>m.number===n),number);
  for(const question of module.quiz)await host.getByRole('button',{name:question.choices.find(c=>c.id===question.correct).label,exact:true}).click();
  assert.match(await host.locator('[data-module-score]').innerText(),/3\/3/);
  await page.getByLabel('Síntoma reproducible',{exact:true}).fill(`SIMULADO ${number}: registro de prueba y límites del caso.`);
  await host.getByRole('button',{name:'Investigar caso en EVO Repair Lab',exact:true}).click();
  const lab=page.locator(`[data-repair-case="${module.scenario.id}"]`);await lab.waitFor();assert.equal(await lab.locator('[data-case-resolution]').count(),0);
  await lab.getByRole('button',{name:'Comprobar reparación simulada',exact:true}).click();assert.equal(await lab.locator('[data-case-resolution]').count(),0);
  for(const observation of module.scenario.tests.filter(t=>!t.unsafe))await lab.locator(`[data-repair-test="${observation.id}"]`).click();
  await lab.getByRole('button',{name:module.scenario.hypotheses.find(h=>h.id===module.scenario.cause).label,exact:true}).click();
  await lab.getByRole('button',{name:module.scenario.repairs.find(r=>r.id===module.scenario.repair).label,exact:true}).click();
  await lab.getByRole('button',{name:'Comprobar reparación simulada',exact:true}).click();await lab.locator('[data-case-resolution]').waitFor();
  await lab.getByRole('button',{name:'Registrar interpretación y exportar expediente',exact:true}).click();
  assert.match(await page.locator('pre').innerText(),new RegExp(`SIMULADO ${number}`));
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Exportar TXT del módulo',exact:true}).click()]);await download.saveAs(path.join(output,`expediente-${number}.txt`));
  assert.match(fs.readFileSync(path.join(output,`expediente-${number}.txt`),'utf8'),/verified":true/);
  await page.getByRole('button',{name:'Protocolos y síntomas',exact:true}).click();await page.locator(`[data-professional-module="${number}"]`).waitFor();
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Module ${number} overflow`);
  if(['01','05','08','10','12','14'].includes(number)){await page.screenshot({path:path.join(output,`modulo-${number}-mobile.png`),fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(output,`modulo-${number}-desktop.png`),fullPage:true});}else await page.setViewportSize({width:1440,height:1000});
  console.log(`PASS: module ${number}, levels, chained tree, quiz, hidden-cause case, repair, dossier/export and mobile`);
 }
 await page.reload();await page.getByRole('button',{name:'Protocolos y síntomas',exact:true}).waitFor();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('evo_tomo03_repair_workbench_v1')));
 assert.equal(Object.values(saved.professional).filter(state=>state.verified).length,numbers.length);
 await page.getByRole('button',{name:'Herramientas',exact:true}).click();await page.getByLabel('Herramienta profesional',{exact:true}).selectOption('atx-uncertainty');await page.getByLabel('Tensión ingresada (V)',{exact:true}).fill('11,40');await page.getByLabel('Incertidumbre absoluta declarada (± V)',{exact:true}).fill('0,05');await page.getByText(/Indeterminado: cruza un límite/).waitFor();
 await page.getByLabel('Herramienta profesional',{exact:true}).selectOption('before-after');await page.getByLabel('Muestras antes',{exact:true}).fill('10; 11; 12');await page.getByLabel('Muestras después',{exact:true}).fill('8; 9; 10');await page.getByText(/Medianas 11 → 9/).waitFor();
 assert.deepEqual(errors,[]);await page.getByRole('button',{name:'Volver al manual',exact:true}).click();assert.equal(await page.evaluate(()=>window.wentBack),true);
 console.log('PASS: persistence after reload, functional tools, export, back callback and no browser exceptions');console.log('Artifacts:',output);
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
