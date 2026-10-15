/** Chromium with actual App/WorldMap/engines and test identities; no live Firebase or payment calls. */
const fs=require('fs'),http=require('http'),assert=require('assert/strict');const path=require('path'),os=require('os');const root=process.env.EVO_TEST_ROOT||path.resolve(__dirname,'..');const output=fs.mkdtempSync(path.join(os.tmpdir(),'evo-labs-browser-'));const {build}=require(root+'/node_modules/esbuild');const {chromium}=require(root+'/node_modules/playwright');
(async()=>{await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {AppContent} from './src/App';import {EvoPublicLabsCatalog} from './src/components/public/EvoPublicLabsCatalog';import {CANONICAL_LABS} from './src/data/evoCatalog';window.catalog=CANONICAL_LABS;window.openedIds=[];import {EvoAccessProvider} from './src/auth/EvoAccessContext';import {TutorEvoProvider} from './src/components/tutor/TutorEvoContext';const root=createRoot(document.getElementById('root'));let serial=0;window.openTarget=(target)=>root.render(<EvoAccessProvider><TutorEvoProvider><AppContent key={++serial} initialPendingTarget={target}/></TutorEvoProvider></EvoAccessProvider>);window.showCatalog=()=>root.render(<EvoPublicLabsCatalog onOpenRegisteredLab={id=>{window.openedIds.push(id);window.openTarget({type:'PRACTICE_LAB',labId:id});}}/>);window.showCatalog();`,resolveDir:root,loader:'tsx'},outfile:path.join(output,'app.js'),bundle:true,format:'esm',platform:'browser',loader:{'.png':'dataurl','.jpg':'dataurl','.webp':'dataurl'},define:{'process.env.NODE_ENV':'"production"'},alias:{components:root+'/src/components'},plugins:[{name:'test-auth-and-private-entry',setup(b){b.onLoad({filter:/EvoMasterLabSuite\.tsx$/},args=>({contents:fs.readFileSync(args.path,'utf8').replace('  // Print & PDF Export State', '  window.__labDebug = {initialPanel, activePanel, uiMode};\n  // Print & PDF Export State'),loader:'tsx',resolveDir:root+'/src/components/world/labs'}));b.onLoad({filter:/EvoWindowsMatrixLab\.tsx$/},args=>({contents:fs.readFileSync(args.path,'utf8').replace('  return (\n','  window.__matrixDebug = {initialScenario, activeTab, deepLabSubTab};\n  return (\n'),loader:'tsx',resolveDir:path.dirname(args.path)}));b.onLoad({filter:/EvoWindowsXRayLab\.tsx$/},args=>({contents:fs.readFileSync(args.path,'utf8').replace('  return (\n','  window.__xrayDebug = {initialScenario, mode};\n  return (\n'),loader:'tsx',resolveDir:path.dirname(args.path)}));b.onLoad({filter:/\/src\/App\.tsx$/},args=>({contents:fs.readFileSync(args.path,'utf8').replace('  const isAtHome =', '  window.__appDebug = {currentView, campusSection, labCorePhase, activeLabMission};\n  const isAtHome =')+'\nexport {AppContent};',loader:'tsx',resolveDir:root+'/src'}));b.onResolve({filter:/EvoAuthProvider$/},()=>({path:'auth-fixture',namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`export const useEvoAuth=()=>({user:{uid:'test'},emailVerified:true,isOwner:window.testRole==='owner',loading:false,signOut:async()=>{}});export const EvoAuthProvider=({children})=>children;`,loader:'js'}));}}]});
const css=fs.readdirSync(root+'/dist/assets').find(x=>x.endsWith('.css'));const server=http.createServer((req,res)=>{if(req.url==='/app.js'){res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(path.join(output,'app.js')));}else if(req.url==='/styles.css'){res.setHeader('Content-Type','text/css');res.end(fs.readFileSync(root+'/dist/assets/'+css));}else{res.setHeader('Content-Type','text/html');res.end('<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body style="background:#09090b"><div id="root"></div><script type="module" src="/app.js"></script></body></html>');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.testRole='owner';localStorage.setItem('evo_academia_intro_dismissed','true');localStorage.setItem('evo_tutor_onboarding_dismissed_v1','true')});await page.goto('http://127.0.0.1:'+server.address().port);await page.getByRole('heading',{name:/No lo creas/}).waitFor();const baseline=root.includes('reference');if(!baseline){assert.equal(await page.locator('[data-lab-id]').count(),88);const groups=await page.locator('[data-tomo-group]').evaluateAll(nodes=>nodes.map(n=>n.dataset.tomoGroup));assert.deepEqual(groups,['01','02','03','04','05','06','07','08','09','10','11','12','global','campus']);const ids=await page.locator('[data-lab-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.labId));assert.equal(new Set(ids).size,88);assert.equal(await page.locator('[data-tomo-group="01"] [data-lab-id="lab-gaming-simulator"]').count(),1);console.log('PASS: 88 tarjetas únicas agrupadas 01–12, globales y campus');}
// Tomo 01 editorial contract: metadata, responsiveness, detail controls and original callbacks.
if(!baseline){
 assert.equal(await page.locator('[data-tomo-group="01"] [data-editorial-lab]').count(),12,'All twelve editorial cards are required');
 const group=page.locator('[data-tomo-group="01"]');
 assert.notEqual(await group.getAttribute('open'),null,'Tomo 01 must open by default');
 assert.equal(await group.locator('[data-tome-registered]').innerText(),'12');
 assert.equal(await group.locator('[data-tome-available]').innerText(),'12');
 assert.ok((await group.innerText()).includes('NIVEL 1: CONOCER LA PC'));
 const labs=await page.evaluate(()=>window.catalog.filter(l=>l.tomo==='01'));
 assert.equal(labs.length,12);
 for(const lab of labs){
  const card=group.locator(`[data-lab-id="${lab.id}"]`);
  assert.equal(await card.getByRole('heading',{name:lab.title,exact:true}).count(),1);
  assert.ok((await card.innerText()).includes(lab.id));
  assert.equal(await card.getByRole('button',{name:'Abrir laboratorio',exact:true}).count(),1);
  assert.equal(await card.getByRole('button',{name:'Ver detalle',exact:true}).count(),Number(!!(lab.problem||lab.experiment||lab.outcome||lab.evidence)));
 }
 const withDetail=labs.find(l=>l.problem||l.experiment||l.outcome||l.evidence);const card=group.locator(`[data-lab-id="${withDetail.id}"]`);
 await card.getByRole('button',{name:'Ver detalle',exact:true}).click();
 for(const field of ['problem','experiment','outcome','evidence'])if(withDetail[field])assert.ok((await card.innerText()).includes(withDetail[field]));
 await card.getByRole('button',{name:'Ocultar detalle',exact:true}).click();
 for(const [width,columns] of [[1440,3],[900,2],[390,1]]){
  await page.setViewportSize({width,height:1000});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const grid of await group.locator('[data-lab-grid]').all()){
   const layout=await grid.evaluate(el=>({columns:getComputedStyle(el).gridTemplateColumns.split(' ').length,heights:[...el.children].map(card=>card.getBoundingClientRect().height),buttons:[...el.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Abrir laboratorio').map(b=>b.getBoundingClientRect().bottom)}));
   assert.equal(layout.columns,columns);assert.ok(Math.max(...layout.heights)-Math.min(...layout.heights)<2,'Uniform cards');
   for(let i=0;i<layout.buttons.length;i+=columns)assert.ok(Math.max(...layout.buttons.slice(i,i+columns))-Math.min(...layout.buttons.slice(i,i+columns))<2,'Aligned buttons');
  }
  await group.screenshot({path:path.join(output,`tomo01-editorial-${width}.png`)});
 }
 await group.locator('summary').first().click();assert.equal(await group.getAttribute('open'),null);
 await page.getByRole('searchbox').fill('juegos');await group.getByRole('button',{name:'Abrir laboratorio',exact:true}).first().waitFor();assert.notEqual(await group.getAttribute('open'),null,'Matching results must be visible');
 await page.getByRole('button',{name:'Limpiar filtros'}).click();await page.setViewportSize({width:1440,height:1000});
 console.log('PASS: Tomo 01, 12 canonical editorial cards, real metadata/details, 3/2/1 columns, uniform heights, aligned actions, filters reopen matching results');
 for(const lab of labs){
  await page.evaluate(()=>{window.testRole='owner';window.showCatalog();});await page.locator(`[data-lab-id="${lab.id}"]`).getByRole('button',{name:'Abrir laboratorio',exact:true}).click();
  assert.equal(await page.evaluate(()=>window.openedIds.at(-1)),lab.id,'Original callback');
  if(lab.target.type==='chapter')await page.waitForFunction(number=>window.__appDebug?.currentView===`chapter-${number}`,lab.target.chapter);
  else if(lab.target.type==='hotswap'){
   await page.waitForFunction(panel=>window.__appDebug?.currentView==='hotswap-lab'&&window.__labDebug?.activePanel===panel,lab.target.panel);
   if(lab.target.panel==='gaming'){const gaming=page.getByRole('button',{name:/3\. SIMULADOR DE JUEGOS/});await gaming.waitFor();assert.ok((await gaming.getAttribute('class')).includes('bg-emerald-400'));}
  }else if(lab.target.type==='core')await page.waitForFunction(()=>window.__appDebug?.currentView==='lab-core'&&window.__appDebug?.labCorePhase==='BUILD_PC');
  else if(lab.target.type==='embedded'){await page.getByRole('heading',{name:lab.title,exact:true}).waitFor();await page.getByText('Cargando laboratorio…',{exact:true}).waitFor({state:'hidden'});}
  else if(lab.target.type==='modal')await page.getByRole('heading',{name:/INTERACTIVE COMPUTER MODEL/}).waitFor();
  assert.ok((await page.locator('body').innerText()).length>500);console.log('PASS: editorial card → original destination '+lab.id);
 }
 await page.evaluate(()=>window.showCatalog());await page.getByRole('heading',{name:/No lo creas/}).waitFor();
}
// Tomo 02 reuses the approved components and every original entry point.
if(!baseline){
 const group=page.locator('[data-tomo-group="02"]');
 const labs=await page.evaluate(()=>window.catalog.filter(l=>l.tomo==='02'));
 assert.equal(labs.length,14);assert.equal(await group.locator('[data-editorial-lab]').count(),14);
 assert.equal(await group.locator('[data-tome-registered]').innerText(),'14');assert.equal(await group.locator('[data-tome-available]').innerText(),'14');
 assert.ok((await group.textContent()).includes('Laboratorios de Windows y diagnóstico'));
 for(const lab of labs){
  const card=group.locator(`[data-lab-id="${lab.id}"]`);
  assert.equal(await card.getByRole('heading',{name:lab.title,exact:true}).count(),1);assert.ok((await card.innerText()).includes(lab.id));
  assert.equal(await card.getByRole('button',{name:'Abrir laboratorio',exact:true}).count(),1);
  const realDetails=!!(lab.problem||lab.experiment||lab.outcome||lab.evidence);
  assert.equal(await card.getByRole('button',{name:'Ver detalle',exact:true}).count(),Number(realDetails));
  if(realDetails){await card.getByRole('button',{name:'Ver detalle',exact:true}).click();for(const key of ['problem','experiment','outcome','evidence'])if(lab[key])assert.ok((await card.innerText()).includes(lab[key]));await card.getByRole('button',{name:'Ocultar detalle',exact:true}).click();}
 }
 for(const [width,columns] of [[1440,3],[900,2],[390,1]]){
  await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const grid of await group.locator('[data-lab-grid]').all()){
   const layout=await grid.evaluate(el=>({columns:getComputedStyle(el).gridTemplateColumns.split(' ').length,heights:[...el.children].map(c=>c.getBoundingClientRect().height),buttons:[...el.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Abrir laboratorio').map(b=>b.getBoundingClientRect().bottom)}));
   assert.equal(layout.columns,columns);assert.ok(Math.max(...layout.heights)-Math.min(...layout.heights)<2);
   for(let i=0;i<layout.buttons.length;i+=columns)assert.ok(Math.max(...layout.buttons.slice(i,i+columns))-Math.min(...layout.buttons.slice(i,i+columns))<2);
  }
  await group.screenshot({path:path.join(output,`tomo02-editorial-${width}.png`)});
 }
 await group.locator('summary').first().click();assert.equal(await group.getAttribute('open'),null);await page.getByRole('searchbox').fill('DPC');await group.getByRole('button',{name:'Abrir laboratorio',exact:true}).first().waitFor();assert.notEqual(await group.getAttribute('open'),null);
 await page.getByRole('button',{name:'Limpiar filtros'}).click();await page.getByRole('combobox').nth(0).selectOption('02');assert.equal(await page.locator('[data-lab-id]').count(),14);await page.getByRole('button',{name:'Limpiar filtros'}).click();await page.setViewportSize({width:1440,height:1000});
 console.log('PASS: Tomo 02, 14 shared editorial cards, canonical metadata/details, 3/2/1 columns, uniform heights, aligned buttons, search and tome filter');
 for(const lab of labs){
  await page.evaluate(()=>{window.testRole='owner';window.showCatalog();});await page.locator(`[data-lab-id="${lab.id}"]`).getByRole('button',{name:'Abrir laboratorio',exact:true}).click();assert.equal(await page.evaluate(()=>window.openedIds.at(-1)),lab.id);
  if(lab.target.type==='chapter')await page.waitForFunction(n=>window.__appDebug?.currentView===`chapter-${n}`,lab.target.chapter);
  else if(lab.target.type==='windows'){
   await page.waitForFunction(s=>window.__appDebug?.currentView==='windows-matrix-lab'&&window.__matrixDebug?.initialScenario===s,lab.target.scenario);
   const state=await page.evaluate(()=>window.__matrixDebug);assert.equal(state.activeTab,['matrix','advisor'].includes(lab.target.scenario)?lab.target.scenario:'deep');if(state.activeTab==='deep')assert.equal(state.deepLabSubTab,lab.target.scenario);
  }else if(lab.target.type==='xray'){
   await page.waitForFunction(s=>window.__appDebug?.currentView==='windows-xray-lab'&&window.__xrayDebug?.initialScenario===s,lab.target.scenario);
   assert.equal((await page.evaluate(()=>window.__xrayDebug)).mode,{'crash-repair':'FAILURES',boot:'BOOT',install:'INSTALL',services:'SERVICES'}[lab.target.scenario]);
  }else if(lab.target.type==='hotswap')await page.waitForFunction(()=>window.__appDebug?.currentView==='hotswap-lab'&&window.__labDebug?.activePanel==='software');
  else if(lab.target.type==='embedded')await page.getByRole('heading',{name:/UEFI \+ BOOT SEQUENCE LAB/}).waitFor();
  assert.ok((await page.locator('body').innerText()).length>500);
  if(lab.target.type==='embedded')await page.locator('div.fixed.inset-0').filter({has:page.getByRole('heading',{name:/UEFI \+ BOOT SEQUENCE LAB/})}).locator('button').filter({has:page.locator('svg.lucide-x')}).first().click();
  else await page.getByRole('button',{name:'Volver a la pantalla anterior',exact:true}).first().click();
  await page.getByRole('heading',{name:/No lo creas/}).waitFor();console.log('PASS: Tomo 02 card → correct original scenario → catalog '+lab.id);
 }
 await page.evaluate(()=>window.showCatalog());await page.getByRole('heading',{name:/No lo creas/}).waitFor();
}
await page.getByRole('searchbox').fill('DNS');await page.waitForTimeout(100);assert.ok((await page.locator('article').count())>0);await page.getByRole('button',{name:'Limpiar filtros'}).click();await page.getByRole('combobox').nth(baseline?1:2).selectOption('EN DESARROLLO');await page.waitForTimeout(100);assert.equal(await page.getByRole('button',{name:baseline?'En desarrollo':'Abrir laboratorio',exact:true}).count(),9);for(const b of await page.getByRole('button',{name:baseline?'En desarrollo':'Abrir laboratorio',exact:true}).all())assert.equal(await b.isDisabled(),true);await page.getByRole('button',{name:'Limpiar filtros'}).click();console.log('PASS: búsqueda, filtros y 9 bancos en desarrollo deshabilitados');
for(const width of [1440,390]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:path.join(output,'catalogo-'+width+'.png'),fullPage:true});await page.screenshot({path:path.join(output,'vista-'+width+'.png'),fullPage:false});}console.log('PASS: catálogo desktop/mobile sin desbordamiento');
if(!baseline){await page.getByRole('combobox').nth(0).selectOption('01');assert.equal(await page.locator('[data-lab-id]').count(),12);assert.equal(await page.locator('[data-tomo-group]').count(),1);const group=page.locator('[data-tomo-group="01"]');await group.locator('summary').first().click();assert.equal(await group.getAttribute('open'),null);await group.locator('summary').first().click();assert.notEqual(await group.getAttribute('open'),null);await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(output,'tomo-01-expandido-mobile.png'),fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(output,'tomo-01-expandido.png'),fullPage:true});assert.equal(JSON.parse(await page.evaluate(()=>sessionStorage.getItem('evo_practice_filters'))).tomo,'01');await page.reload();await page.getByRole('heading',{name:/No lo creas/}).waitFor();assert.equal(await page.locator('[data-lab-id]').count(),12);await page.getByRole('button',{name:'Limpiar filtros'}).click();console.log('PASS: filtro de tomo y expandir/contraer');}

if(!baseline){await page.locator('[data-lab-id="lab-gaming-simulator"]').getByRole('button',{name:'Abrir laboratorio',exact:true}).click();await page.getByRole('button',{name:/3\. SIMULADOR DE JUEGOS/}).waitFor({timeout:10000}).catch(async e=>{console.log('ERRORS',errors);console.log('DEBUG',await page.evaluate(()=>window.__labDebug));fs.writeFileSync('/tmp/evolabs-browser-body.txt',await page.locator('body').innerText());console.log('BODY',(await page.locator('body').innerText()).slice(0,2200));throw e;});const gaming=page.getByRole('button',{name:/3\. SIMULADOR DE JUEGOS/});assert.ok((await gaming.getAttribute('class')).includes('bg-emerald-400'));assert.ok(!(await page.getByRole('button',{name:/1\. EL ENSAMBLADOR/}).getAttribute('class')).includes('bg-amber-400'));console.log('PASS: tarjeta → WorldMap → App → Hot-Swap → Ultimate Sandbox abre gaming');await page.getByRole('button',{name:/BIOS.*MEMORIA|BIOS.*RAM/i}).first().click();await page.getByRole('button',{name:/LATENCIA.*RED/i}).first().click();console.log('PASS: gaming conserva BIOS/memoria y latencia/red');await page.getByRole('button',{name:'Volver a la pantalla anterior',exact:true}).first().click();await page.getByRole('heading',{name:/No lo creas/}).waitFor();console.log('PASS: gaming vuelve al catálogo real');}

await page.evaluate(()=>{window.testRole='owner';window.openTarget({type:'HOTSWAP',subPanel:'sandbox'})});await page.getByRole('button',{name:/Laboratorio Completo/i}).waitFor({timeout:10000});await page.getByRole('button',{name:/Laboratorio Completo/i}).click();await page.getByRole('button',{name:/1\. EL ENSAMBLADOR/}).waitFor();assert.ok((await page.getByRole('button',{name:/1\. EL ENSAMBLADOR/}).getAttribute('class')).includes('bg-amber-400'));console.log('PASS: acceso antiguo sandbox conserva ensamblador por defecto');
if(!baseline){
 await page.evaluate(()=>window.openTarget({type:'PRACTICE_LAB',labId:'lab-cpu-architecture'}));await page.locator('[data-hardware-section="cpu"]').waitFor();assert.equal((await page.evaluate(()=>window.__labDebug)).activePanel,'architecture');assert.equal(await page.getByRole('button',{name:/3\. SIMULADOR DE JUEGOS/}).count(),0);await page.getByRole('button',{name:/Ryzen 9 9950X/}).click();console.log('PASS: microarquitectura abre el banco CPU real, sin ensamblador');
 for(const id of ['chapter-04','chapter-05','chapter-06']){await page.evaluate(id=>window.openTarget({type:'PRACTICE_LAB',labId:id}),id);await page.waitForFunction(id=>window.__appDebug?.currentView===id,id);assert.ok((await page.locator('body').innerText()).length>1200);assert.equal(await page.locator('[data-lab-id]').count(),0);await page.getByRole('button',{name:'Volver a la pantalla anterior',exact:true}).first().click();await page.getByRole('heading',{name:/No lo creas/}).waitFor();console.log('PASS: nuevo acceso '+id+' carga destino correcto y vuelve al catálogo');}
 await page.evaluate(()=>window.openTarget({type:'PRACTICE_LAB',labId:'lab-software-dpc'}));await page.waitForFunction(()=>window.__labDebug?.activePanel==='software');assert.ok((await page.locator('body').innerText()).includes('CONTROLADORES'));console.log('PASS: Software Hot-Swap permanece separado y funcional');
}
await page.evaluate(()=>{window.testRole='free';window.openTarget({type:'HOTSWAP',subPanel:'gaming'})});await page.waitForTimeout(500);assert.equal(await page.getByRole('button',{name:/3\. SIMULADOR DE JUEGOS/}).count(),0);console.log('PASS: acceso HOTSWAP denegado a FREE con política real');if(!baseline){await page.evaluate(()=>window.openTarget({type:'PRACTICE_LAB',labId:'lab-gaming-simulator'}));await page.waitForTimeout(500);assert.equal(await page.getByRole('button',{name:/3\. SIMULADOR DE JUEGOS/}).count(),0);console.log('PASS: nueva tarjeta no evade restricción FREE');}if(!baseline){for(const id of ['chapter-04','chapter-05','chapter-06']){await page.evaluate(id=>window.openTarget({type:'PRACTICE_LAB',labId:id}),id);await page.waitForTimeout(400);assert.notEqual((await page.evaluate(()=>window.__appDebug)).currentView,id);console.log('PASS: acceso '+id+' conserva restricciones FREE');}}assert.deepEqual(errors,[]);console.log('PASS: sin excepciones de navegador');console.log('Artifacts: '+output);}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exit(1)});
