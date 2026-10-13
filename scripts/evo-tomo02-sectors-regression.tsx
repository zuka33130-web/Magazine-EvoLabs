import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TOMO_02_ADVANCED_CONTENT, getAdvancedSector } from '../src/data/tomo02AdvancedContent';
import { TOMO_02_MASTER_SECTORS } from '../src/data/tomo02MasterSectors';
import { TOMO_02_CASE_LIBRARY } from '../src/data/tomo02CaseLibrary';
import { isSectorEvidenceComplete, compareSeries } from '../src/data/tomo02AdvancedProgress';
import { Tomo02AdvancedSectorView } from '../src/components/tomo02/advanced/Tomo02AdvancedSectorView';
import { parseExperimentSamples } from '../src/components/tomo02/advanced/Tomo02FinalExperiment';
import { Tomo02EditorialIndex } from '../src/components/tomo02/Tomo02EditorialIndex';
import { EvoWindowsXRayLab } from '../src/components/world/labs/windowsMatrix/EvoWindowsXRayLab';
import { TutorEvoProvider } from '../src/components/tutor/TutorEvoContext';

assert.equal(TOMO_02_ADVANCED_CONTENT.length, 29);
assert.deepEqual(TOMO_02_ADVANCED_CONTENT.map((item) => item.number), Array.from({length: 29}, (_, index) => String(index + 11)));
const indexHtml = renderToStaticMarkup(<Tomo02EditorialIndex onBackToCover={() => {}} onOpenAdvancedSector={() => {}} />);
const rendered = new Set<string>();
for (const content of TOMO_02_ADVANCED_CONTENT) {
  const meta = TOMO_02_MASTER_SECTORS.find((sector) => sector.sectorNumber === content.number)!;
  assert.equal(meta.status, 'ACTIVE');
  assert.ok(indexHtml.includes(`Abrir Sector ${content.number}`), `Missing individual entry ${content.number}`);
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
  for (const lesson of content.lessons) assert.ok(html.includes(escape(lesson.text)), `Missing own content: ${content.number}`);
  rendered.add(html);
}
assert.equal(rendered.size, 29);
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
assert.ok(advancedViewSource.includes('<XRayLab initialScenario="crash-repair" />'));
const originalMaster = execFileSync('git', ['show', 'HEAD:src/data/tomo02MasterSectors.ts'], {encoding:'utf8'});
assert.equal(fs.readFileSync('src/data/tomo02MasterSectors.ts', 'utf8').split("    sectorId: 'sector-11',")[0], originalMaster.split("    sectorId: 'sector-11',")[0]);
// Preserve every original file of sectors 00–10 and their data exactly.
const protectedFiles = execFileSync('git', ['ls-tree','-r','--name-only','HEAD','src/components/tomo02','src/data'], {encoding:'utf8'}).trim().split('\n').filter((file) => /\/sector(?:0\d|10)\//.test(file) || /tomo02Sector(?:0\d|10)/.test(file));
for (const file of protectedFiles) assert.equal(fs.readFileSync(file,'utf8'), execFileSync('git',['show',`HEAD:${file}`],{encoding:'utf8'}), `Changed original sector: ${file}`);
console.log(`PASS: 29 unique readers and index entries; ${TOMO_02_ADVANCED_CONTENT.reduce((count, sector) => count + sector.commands.length, 0)} command examples; 58 checks; ${TOMO_02_CASE_LIBRARY.length} didactic cases across 22 categories; ${protectedFiles.length} original files unchanged. Experiment math, provenance and progress gates verified.`);
