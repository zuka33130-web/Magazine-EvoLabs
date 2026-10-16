/** node scripts/evo-tomo03-workbench-regression.mjs
 * Isolated Chromium smoke test; uses installed Playwright, does not download any browser.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('esbuild'),{compile}=require('@tailwindcss/node'),{chromium}=require('playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=fs.mkdtempSync(path.join(os.tmpdir(),'evo-tomo03-workbench-'));
const outfile=path.join(output,'app.js');
let server,browser;
try{
 await build({entryPoints:[path.join(root,'scripts/evo-tomo03-workbench-fixture.tsx')],outfile,bundle:true,format:'iife',platform:'browser',
 nodePaths:[path.join(root,'node_modules')],loader:{'.jpg':'dataurl','.png':'dataurl','.webp':'dataurl'},
 define:{'process.env.NODE_ENV':'"production"'},
 plugins:[{name:'vite-alias',setup(b){b.onResolve({filter:/^\/components\//},a=>({path:path.join(root,'src',a.path.slice(1))}));}}],
 alias:{components:path.join(root,'src/components')}});
 const css=await compile(fs.readFileSync(path.join(root,'src/index.css'),'utf8'),{base:path.join(root,'src'),onDependency:()=>{}});
 const source=['src/components/tomo03/Tomo03WorkbenchView.tsx','src/components/tomo03/Tomo03MagazineView.tsx'];
 const tokens=[...new Set(source.flatMap(p=>fs.readFileSync(path.join(root,p),'utf8').split(/[\s'"\x60{}<>]+/)))];
 fs.writeFileSync(path.join(output,'styles.css'),css.build(tokens));
 const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body><div id="root"></div><pre id="result"></pre><script src="/app.js"></script></body></html>';
 server=http.createServer((req,res)=>{const file=req.url==='/app.js'?'app.js':req.url==='/styles.css'?'styles.css':null;
 if(file){res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':'text/css');res.end(fs.readFileSync(path.join(output,file)));}
 else{res.setHeader('Content-Type','text/html');res.end(html);}});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const executablePath=process.env.EVO_CHROMIUM_EXECUTABLE||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1380,height:900}});
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.waitForFunction(()=>/^(PASS:|FAIL:)/.test(document.querySelector('#result')?.textContent||''),null,{timeout:100000});
 const result=await page.locator('#result').innerText();
 console.log(result);
 if(!result.startsWith('PASS:'))throw Error('Workbench functional regression failed');
 await page.setViewportSize({width:390,height:844});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 if(overflow)throw Error('Mobile workbench has horizontal overflow');
 console.log('PASS: mobile workbench without horizontal overflow');
 console.log('Artifacts: '+output);
}finally{
 if(browser)await browser.close();
 if(server)await new Promise(resolve=>server.close(resolve));
}
