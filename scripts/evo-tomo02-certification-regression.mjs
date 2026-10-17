/** Isolated Tomo 02 final certificate test.
 * node scripts/evo-tomo02-certification-regression.mjs
 * Uses synthetic localStorage inside a private, temporary Chromium page.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('esbuild');
const {chromium}=require('playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=fs.mkdtempSync(path.join(os.tmpdir(),'evo-tomo02-certification-'));
const app=path.join(output,'app.js');
let server,browser;
try {
  await build({entryPoints:[path.join(root,'scripts/evo-tomo02-certification-fixture.tsx')],outfile:app,
    bundle:true,format:'iife',platform:'browser',nodePaths:[path.join(root,'node_modules')],
    loader:{'.jpg':'dataurl','.png':'dataurl','.webp':'dataurl'},
    define:{'process.env.NODE_ENV':'"production"'},
    plugins:[{name:'existing-vite-component-alias',setup(build){build.onResolve({filter:/^\/components\//},args=>({path:path.join(root,'src',args.path.slice(1))}));}}],
    alias:{components:path.join(root,'src/components')}});
  const html='<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><pre id="result"></pre><script src="/app.js"></script></body></html>';
  server=http.createServer((req,res)=>{
    if(req.url==='/app.js'){res.setHeader('Content-Type','application/javascript');res.end(fs.readFileSync(app));}
    else{res.setHeader('Content-Type','text/html');res.end(html);}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const exe=process.env.EVO_CHROMIUM_EXECUTABLE||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
  browser=await chromium.launch({headless:true,executablePath:exe,args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:1200,height:900}});
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.waitForFunction(()=>/^(PASS:|FAIL:)/.test(document.querySelector('#result')?.textContent||''),null,{timeout:60000});
  const result=await page.locator('#result').innerText();
  console.log(result);
  if(!result.startsWith('PASS:'))throw new Error('Certificate functional regression failed');
  console.log('Validation artifacts: '+output);
} finally {
  if(browser)await browser.close();
  if(server)await new Promise(resolve=>server.close(resolve));
}
