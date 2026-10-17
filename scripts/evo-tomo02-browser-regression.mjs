/** Run with node scripts/evo-tomo02-browser-regression.mjs.
 * Existing dependencies only. Tests actual Tomo 02 without importing authentication.
 * Needs local listening sockets and an available Chromium; never downloads a browser.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('esbuild');
const {compile}=require('@tailwindcss/node');
const {chromium}=require('playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=fs.mkdtempSync(path.join(os.tmpdir(),'evo-tomo02-browser-'));
await build({entryPoints:[path.join(root,'scripts/evo-tomo02-browser-fixture.tsx')],outfile:path.join(output,'app.js'),bundle:true,format:'iife',platform:'browser',
  nodePaths:[path.join(root,'node_modules')],loader:{'.jpg':'dataurl','.png':'dataurl','.webp':'dataurl'},define:{'process.env.NODE_ENV':'"production"'},
  plugins:[{name:'existing-vite-component-alias',setup(b){b.onResolve({filter:/^\/components\//},a=>({path:path.join(root,'src',a.path.slice(1))}));}}],alias:{components:path.join(root,'src/components')}});
const css=await compile(fs.readFileSync(path.join(root,'src/index.css'),'utf8'),{base:path.join(root,'src'),onDependency:()=>{}});
const files=['src/components/tomo02/shared/Tomo02SectorReaderLayout.tsx','src/components/tomo02/advanced/Tomo02AdvancedSectorView.tsx','src/components/tomo02/advanced/Tomo02FinalExperiment.tsx','src/components/tomo02/sector01/Tomo02Sector01View.tsx','src/components/tomo02/Tomo02EditorialIndex.tsx'];
const tokens=[...new Set(files.flatMap(file=>fs.readFileSync(path.join(root,file),'utf8').split(/[\s'"`{}<>]+/)))];
fs.writeFileSync(path.join(output,'styles.css'),css.build(tokens));
fs.writeFileSync(path.join(output,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body><div id="root"></div><pre id="result"></pre><script src="/app.js"></script></body></html>');
const server=http.createServer((req,res)=>{
  const filename=req.url==='/app.js'?'app.js':req.url==='/styles.css'?'styles.css':'index.html';
  res.setHeader('Content-Type',filename.endsWith('.js')?'application/javascript':filename.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(path.join(output,filename)));
});
let browser;
try {
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const executablePath=process.env.EVO_CHROMIUM_EXECUTABLE || (fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
  browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-background-networking']});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(()=>/^(PASS:|FAIL:)/.test(document.querySelector('#result')?.textContent||''),{},{timeout:180000});
  const result=await page.locator('#result').innerText();
  fs.writeFileSync(path.join(output,'result.txt'),result);console.log(result);
  await page.screenshot({path:path.join(output,'desktop.png'),fullPage:true});
  if(!result.startsWith('PASS:'))throw Error('Browser interaction regression failed');
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,columns:getComputedStyle(document.querySelector('aside').parentElement).gridTemplateColumns}));
  fs.writeFileSync(path.join(output,'mobile.json'),JSON.stringify(mobile));
  await page.screenshot({path:path.join(output,'mobile.png'),fullPage:true});
  if(mobile.overflow || mobile.columns.split(' ').length!==1)throw Error('Mobile layout regression');
  console.log('PASS: mobile single column without horizontal overflow');
  console.log(`Artifacts: ${output}`);
} finally {await browser?.close();server.close();}
