/** Registry and ownership regression against the approved pre-reorganization commit. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const baseline=process.env.EVO_LABS_BASELINE_REF||'dc163c7b382217589092618d5be9ab08e70d7219';
const baseSource=execFileSync('git',['show',`${baseline}:src/data/evoCatalog.ts`],{cwd:process.env.EVO_LABS_GIT_ROOT||root,encoding:'utf8'});
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'evo-labs-integrity-'));
await build({stdin:{resolveDir:root,loader:'tsx',contents:`import {CANONICAL_LABS as before} from 'baseline-catalog';import {CANONICAL_LABS as after,getTomeLabs} from './src/data/evoCatalog';import {getLabOwnerTomo} from './src/data/evoOwnershipMap';import {filterPracticeLabs} from './src/components/public/EvoPublicLabsCatalog';console.log(JSON.stringify({before,after,owners:Object.fromEntries(after.map(l=>[l.id,getLabOwnerTomo(l.id)])),tomes:Object.fromEntries(Array.from({length:12},(_,i)=>{const id=String(i+1).padStart(2,'0');return[id,getTomeLabs(id)]})),filters:{tomo:filterPracticeLabs('','ALL','ALL','ALL','01').map(l=>l.id),windows:filterPracticeLabs('Windows','ALL','ALL','ALL','02').map(l=>l.id),development:filterPracticeLabs('','ALL','ALL','EN DESARROLLO').map(l=>l.id)}}));`},outfile:path.join(dir,'registry.cjs'),bundle:true,platform:'node',format:'cjs',plugins:[{name:'approved-baseline',setup(b){b.onResolve({filter:/^baseline-catalog$/},()=>({path:'baseline',namespace:'baseline'}));b.onLoad({filter:/.*/,namespace:'baseline'},()=>({contents:baseSource,loader:'ts',resolveDir:path.join(root,'src/data')}));}}]});
const result=JSON.parse(execFileSync(process.execPath,[path.join(dir,'registry.cjs')],{encoding:'utf8'}));
const {before,after}=result;
assert.equal(before.filter(l=>l.kind!=='CAMPUS').length,76);
assert.equal(before.filter(l=>l.kind==='CAMPUS').length,8);
assert.equal(after.length,88);assert.equal(new Set(after.map(l=>l.id)).size,after.length);
const functional=after.filter(l=>l.target);assert.equal(new Set(functional.map(l=>JSON.stringify(l.target))).size,functional.length,'Duplicate destinations');
for(const old of before){const lab=after.find(l=>l.id===old.id);assert.ok(lab,`Lost ${old.id}`);const expected={...old};if(old.id==='live-bench')expected.tomo='01';if(old.id==='lab-cpu-architecture')expected.target={type:'hotswap',panel:'architecture'};assert.deepEqual(lab,expected,`Unexpected change ${old.id}`);}
assert.deepEqual(after.filter(l=>l.kind==='CAMPUS'),before.filter(l=>l.kind==='CAMPUS'));
assert.ok(after.filter(l=>l.kind!=='CAMPUS'&&l.tomo===null).length===2);
for(const l of after){assert.equal(result.owners[l.id],l.tomo);if(l.tomo!==null)assert.ok(/^0[1-9]$|^1[0-2]$/.test(l.tomo));if(l.status==='EN DESARROLLO')assert.equal(l.target,null);else assert.ok(l.target);}
for(const [t,ids] of Object.entries(result.tomes))assert.deepEqual(ids,after.filter(l=>l.tomo===t).map(l=>l.id));
assert.deepEqual(result.filters.tomo,result.tomes['01']);assert.ok(result.filters.windows.every(id=>after.find(l=>l.id===id).tomo==='02'));assert.equal(result.filters.development.length,9);
assert.deepEqual(after.find(l=>l.id==='lab-gaming-simulator').target,{type:'hotswap',panel:'gaming'});assert.equal(after.find(l=>l.id==='lab-gaming-simulator').tomo,'01');
const counts=Object.fromEntries(Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')).map(t=>[t,{before:before.filter(l=>l.tomo===t).length,after:after.filter(l=>l.tomo===t).length}]));
fs.writeFileSync(path.join(dir,'inventory.json'),JSON.stringify({...result,counts},null,2));
console.log('PASS: 76 original records + 8 campus zones preserved; 4 distinct accesses added; 88 unique IDs and destinations; single ownership, development states and combined filters verified.');console.log(JSON.stringify(counts));console.log(`Artifacts: ${dir}`);
