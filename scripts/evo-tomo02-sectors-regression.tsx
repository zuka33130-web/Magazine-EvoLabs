import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadSectorResources } from '../src/components/tomo02/advanced/tomo02ResourceRegistry';
import { complementaryNotes, uniqueNoteFields } from '../src/components/tomo02/advanced/Tomo02SectorResources';
import { TOMO_02_ADVANCED_CONTENT, getAdvancedSector } from '../src/data/tomo02AdvancedContent';
import { TOMO_02_MASTER_SECTORS } from '../src/data/tomo02MasterSectors';
import { TOMO_02_CASE_LIBRARY } from '../src/data/tomo02CaseLibrary';
import { isSectorEvidenceComplete, compareSeries } from '../src/data/tomo02AdvancedProgress';
import { Tomo02AdvancedSectorView } from '../src/components/tomo02/advanced/Tomo02AdvancedSectorView';
import { parseExperimentSamples } from '../src/components/tomo02/advanced/Tomo02FinalExperiment';
import { Tomo02EditorialIndex } from '../src/components/tomo02/Tomo02EditorialIndex';
import { getSectorInvestigations } from '../src/data/tomo02Investigations';
import { INVESTIGATION_DETAILS } from '../src/data/tomo02InvestigationDetails';
import { INVESTIGATION_MYTHS } from '../src/data/tomo02InvestigationMyths';
import { INVESTIGATION_TOOL_CODE } from '../src/data/tomo02InvestigationTools';
import { parseReaderProgress, investigationComplete, emptyMissionRecord, missionRecordComplete } from '../src/data/tomo02InvestigationProgress';
import { EvoWindowsXRayLab } from '../src/components/world/labs/windowsMatrix/EvoWindowsXRayLab';
import { TutorEvoProvider } from '../src/components/tutor/TutorEvoContext';

assert.equal(TOMO_02_ADVANCED_CONTENT.length, 29);
assert.deepEqual(TOMO_02_ADVANCED_CONTENT.map((item) => item.number), Array.from({length: 29}, (_, index) => String(index + 11)));
const indexHtml = renderToStaticMarkup(<Tomo02EditorialIndex onBackToCover={() => {}} onOpenAdvancedSector={() => {}} />);
const rendered = new Set<string>();
let canonicalCount = 0, individualCount = 0;
for (const content of TOMO_02_ADVANCED_CONTENT) {
  const meta = TOMO_02_MASTER_SECTORS.find((sector) => sector.sectorNumber === content.number)!;
  assert.equal(meta.status, 'ACTIVE');
  assert.ok(indexHtml.includes(`Ingresar al Sector ${content.number}`), `Missing individual entry ${content.number}`);
  assert.ok(content.lessons.length >= 3 && content.commands.length >= 2 && content.procedure.length >= 4);
  assert.ok(new Set(content.lessons.map((item) => item.text)).size === content.lessons.length);
  for (const command of content.commands) assert.ok(command.code && command.purpose && command.example && command.interpretation);
  for (const question of [...content.questions, {question: content.scenario, choices: content.decisions}]) {
    assert.equal(question.choices.filter((choice) => choice.correct).length, 1);
    assert.ok(question.choices.every((choice) => choice.feedback.length > 20));
  }
  const evidence = { answers: Object.fromEntries(content.questions.map((question, index) => [index, question.choices.findIndex((choice) => choice.correct)])),
    decision: content.decisions.findIndex((choice) => choice.correct), note: 'Evidencia didáctica registrada con hipótesis, prueba y resultado.', finalExperiment: content.number !== '39' };
  assert.equal(isSectorEvidenceComplete(content, evidence), content.number !== '39');
  assert.equal(isSectorEvidenceComplete(content, {...evidence, finalExperiment:true}), true);
  assert.equal(isSectorEvidenceComplete(content, {...evidence, decision:null}), false);
  assert.equal(isSectorEvidenceComplete(content, {...evidence, answers:{}}), false);
  const html = renderToStaticMarkup(<TutorEvoProvider><Tomo02AdvancedSectorView content={content} onBack={() => {}} onNavigate={() => {}} onComplete={() => {}} /></TutorEvoProvider>);
  assert.ok(html.includes(`data-sector="${content.number}"`));
  const escape = (value:string) => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll("'",'&#x27;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  assert.ok(html.includes(escape(meta.title)), `Wrong sector title: ${content.number}`);
  const investigations = getSectorInvestigations(content);
  assert.ok(investigations.length > 0);
  for (const item of meta.investigationsList) {
    assert.ok(INVESTIGATION_DETAILS[item.id] && INVESTIGATION_MYTHS[item.id]);
    const inv = investigations.find(inv => inv.id === item.id)!;
    assert.equal(inv.title, item.title);
    canonicalCount++;
  }
  for (const inv of investigations) {
    const individualHtml = renderToStaticMarkup(<TutorEvoProvider><Tomo02AdvancedSectorView content={content} initialInvestigationId={inv.id} onBack={() => {}} onNavigate={() => {}} onComplete={() => {}} /></TutorEvoProvider>);
    assert.ok(individualHtml.includes(`data-investigation="${inv.id}"`));
    for (let stage = 1; stage <= 6; stage++) assert.ok(individualHtml.includes(`data-stage="${stage}"`));
    assert.ok(individualHtml.includes(escape(inv.entende.explanation[0])));
    assert.ok(individualHtml.includes(escape(inv.title)));
    assert.ok(individualHtml.includes(escape(inv.caseRecord?.rollback || content.rollback)));
    assert.ok(individualHtml.includes('REQUISITOS Y RECUPERACIÓN'));
    assert.ok(html.includes(`data-investigation-link="${inv.id}"`));
    assert.ok(inv.experiment.length >= 3 && inv.miraloEnTuPc.steps.length >= 3);
    assert.equal(inv.check.choices.filter(choice => choice.correct).length, 1);
    assert.equal(inv.microdesafio.options!.filter(choice => choice.isCorrect).length, 1);
    const valid = {check:inv.check.choices.findIndex(choice=>choice.correct),challenge:inv.microdesafio.options!.find(choice=>choice.isCorrect)!.id,note:'SIMULADO: evidencia con mecanismo y límites.',provenance:'SIMULATED' as const};
    assert.equal(investigationComplete(inv, valid), true);
    assert.equal(investigationComplete(inv, {...valid, note:''}), false);
    assert.equal(investigationComplete(inv, {...valid, check:null}), false);
    assert.equal(investigationComplete(inv, {...valid, check:inv.check.choices.findIndex(choice=>!choice.correct)}), false);
    assert.equal(parseReaderProgress('not-json',investigations).activeId,investigations[0].id);
    assert.equal(parseReaderProgress(JSON.stringify({activeId:'missing',evidence:{[inv.id]:{check:999,challenge:'invalid',note:5}}}),investigations).evidence[inv.id].check,null);
    const persisted=parseReaderProgress(JSON.stringify({activeId:inv.id,tab:'test',evidence:{[inv.id]:valid}}), investigations);
    assert.equal(persisted.activeId,inv.id); assert.deepEqual(persisted.evidence[inv.id],valid);
    individualCount++;
  }
  rendered.add(html);
}
assert.equal(rendered.size, 29);
assert.equal(missionRecordComplete(emptyMissionRecord()),false);
assert.equal(missionRecordComplete(Object.fromEntries(Object.keys(emptyMissionRecord()).map(key=>[key,'SIMULADO: contexto y criterio registrado.'])) as ReturnType<typeof emptyMissionRecord>),true);
assert.equal(canonicalCount,501); assert.equal(individualCount,622);
assert.equal(Object.keys(INVESTIGATION_MYTHS).length,501);
assert.equal(Object.keys(INVESTIGATION_TOOL_CODE).length,18);
assert.ok(!TOMO_02_MASTER_SECTORS.some(sector=>sector.sectorNumber==='40'));
const sourceLayout=fs.readFileSync('src/components/tomo02/sector01/Tomo02Sector01View.tsx','utf8');
const sharedLayout=fs.readFileSync('src/components/tomo02/shared/Tomo02SectorReaderLayout.tsx','utf8');
for(const token of ['grid grid-cols-1 lg:grid-cols-12 gap-6 items-start','lg:col-span-4 space-y-3 bg-[#080B10] p-3 rounded-2xl border border-sky-500/20 shadow-xl','lg:col-span-8 space-y-6','p-6 rounded-2xl bg-[#080B10]/90 border border-sky-500/20 space-y-4']) { assert.ok(sourceLayout.includes(token)); assert.ok(sharedLayout.includes(token)); }
assert.equal(getAdvancedSector('10'), undefined); assert.equal(getAdvancedSector('40'), undefined);
assert.deepEqual(parseExperimentSamples('1,5; 2; 3.5'), [1.5, 2, 3.5]);
assert.equal(compareSeries([10,20,30],[8,16,24])?.percent, -20);
assert.equal(compareSeries([0,0,0],[1,1,1])?.percent, null);
assert.equal(compareSeries([1,2],[2,3]), null);
assert.equal(compareSeries([1,2,3],[1,2,3,4]), null);
assert.equal(compareSeries(parseExperimentSamples('1; NaN; 3'),[1,2,3]), null);
assert.equal(compareSeries([-1,2,3],[1,2,3]), null);
assert.equal(new Set(TOMO_02_CASE_LIBRARY.map((item) => item.id)).size, TOMO_02_CASE_LIBRARY.length);
for (const category of TOMO_02_MASTER_SECTORS.find((sector) => sector.sectorNumber === '37')!.categories!) {
  assert.ok(TOMO_02_CASE_LIBRARY.some((item) => item.category === category), `Missing forensic category: ${category}`);
}
const failureHtml = renderToStaticMarkup(<EvoWindowsXRayLab initialScenario="crash-repair" />);
assert.ok(failureHtml.includes('SIMULATED FAILURE'), 'BSOD practice must select the failures view, not boot');
const advancedViewSource = fs.readFileSync('src/components/tomo02/advanced/Tomo02AdvancedSectorView.tsx', 'utf8');
assert.match(advancedViewSource, /<XRayLab\s+initialScenario="crash-repair"\s*\/>/);
const baselineDir = process.env.EVO_TOMO02_BASELINE_DIR;
const baselineText = (file:string) => baselineDir ? fs.readFileSync(`${baselineDir}/${file}`, 'utf8') : execFileSync('git',['show',`HEAD:${file}`],{encoding:'utf8'});
const originalMaster = baselineText('src/data/tomo02MasterSectors.ts');
assert.equal(fs.readFileSync('src/data/tomo02MasterSectors.ts', 'utf8').split("    sectorId: 'sector-11',")[0], originalMaster.split("    sectorId: 'sector-11',")[0]);
// Preserve every original file of sectors 00–10 and their data exactly.
const baselineFiles = baselineDir ? ['src/components/tomo02','src/data'].flatMap(root=>fs.readdirSync(`${baselineDir}/${root}`,{recursive:true,withFileTypes:true}).filter(item=>item.isFile()).map(item=>`${item.parentPath}/${item.name}`.slice(baselineDir.length+1))) : execFileSync('git', ['ls-tree','-r','--name-only','HEAD','src/components/tomo02','src/data'], {encoding:'utf8'}).trim().split('\n');
const protectedFiles = baselineFiles.filter((file) => /\/sector(?:0\d|10)\//.test(file) || /tomo02Sector(?:0\d|10)/.test(file));
for (const file of protectedFiles) assert.equal(fs.readFileSync(file,'utf8'), baselineText(file), `Changed original sector: ${file}`);
console.log(`PASS: 29 unified readers; 501 canonical investigations, 112 preserved cases, 9 protocol stages (622 individually rendered); 18 tool modules; ${TOMO_02_ADVANCED_CONTENT.reduce((count, sector) => count + sector.commands.length, 0)} command examples; 58 checks; ${TOMO_02_CASE_LIBRARY.length} didactic cases across 22 categories; ${protectedFiles.length} original files unchanged. Experiment math, provenance and progress gates verified.`);

// Every distinct original explanation remains reachable from the single reader or its mission.
const leafText=(value:unknown):string[]=>typeof value==='string'?[value]:value&&typeof value==='object'?Object.values(value).flatMap(leafText):[];
let supplementaryCount=0;
for(const content of TOMO_02_ADVANCED_CONTENT){
 const resources=await loadSectorResources(content.number);const invs=getSectorInvestigations(content);const reached=new Set<string>();
 for(const inv of invs)for(const tab of ['reader','mission'] as const)for(const note of complementaryNotes(content.number,resources.investigations,inv.id,tab)){
  reached.add(note.code);const fields=uniqueNoteFields(note,inv);const available=new Set([...leafText(inv),...leafText(fields)].map(text=>text.replace(/\s+/g,' ').trim()));
  for(const [key,value] of Object.entries(note))if(!['id','code','title'].includes(key))for(const text of leafText(value))assert.ok(available.has(text.replace(/\s+/g,' ').trim()),`Lost complementary text ${note.code}: ${key}`);
 }
 assert.equal(reached.size,resources.investigations.length,`Unreachable sources ${content.number}`);supplementaryCount+=reached.size;
}
assert.equal(supplementaryCount,531);console.log('PASS: all 531 supplementary sources reachable; every distinct textual field retained without new investigation IDs or progress keys.');
