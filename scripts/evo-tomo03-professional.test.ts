import test from 'node:test';
import assert from 'node:assert/strict';
import {TOMO03_PROFESSIONAL_MODULES} from '../src/data/tomo03ProfessionalContent';
import {emptyProfessionalState} from '../src/data/tomo03ProfessionalTypes';
import {performRepairTest,validateRepair,parseProfessionalState,moduleAssessment,assessAtxUncertainty,compareRepairSamples} from '../src/data/tomo03RepairEngine';
import {TOMO_03_MODULES} from '../src/data/tomo03Data';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {assessRamMatrix,advancePost,assessFirmwarePlan,assessCpuCompatibility,assessThermalProfile} from '../src/data/tomo03RepairEngine';
import {TOMO03_TREATISE_TOPICS,TOMO03_TREATISE_RESOURCES} from '../src/data/tomo03Treatise';
import {TOMO03_TREATISE_LABS,getTreatiseLab} from '../src/data/tomo03TreatiseLabs';
import {TOMO03_TOOL_LABELS} from '../src/data/tomo03ProfessionalTypes';
import {TOMO03_REPAIR_LABS} from '../src/data/tomo03WorkbenchData';
test('treatise sequence preserves the canonical bank and supplies five learning stages per topic',()=>{
 assert.deepEqual(TOMO03_TREATISE_TOPICS.map(topic=>topic.label),[...Array.from({length:13},(_,i)=>String(i).padStart(2,'0')),'NIVEL VI','NIVEL VII']);
 assert.equal(new Set(TOMO03_TREATISE_TOPICS.map(topic=>topic.id)).size,15);
 for(const topic of TOMO03_TREATISE_TOPICS){
  assert.ok(topic.modules.length>0);assert.equal(new Set(topic.modules).size,topic.modules.length);
  for(const number of topic.modules)assert.ok(TOMO_03_MODULES.some(m=>m.moduleNumber===number));
  assert.deepEqual(Object.keys(topic.stages),['understand','observe','measure','diagnose','verify']);
  assert.ok(Object.values(topic.stages).every(stage=>stage.length>120));assert.ok(topic.practice.length>60);
  if(topic.lab)assert.ok(TOMO03_TREATISE_LABS.some(lab=>lab.id===topic.lab));
  const resources=TOMO03_TREATISE_RESOURCES[topic.id];assert.ok(resources);
  for(const tool of resources.tools)assert.ok(TOMO03_TOOL_LABELS[tool]);
  if(resources.guidedLab)assert.ok(TOMO03_REPAIR_LABS.some(lab=>lab.id===resources.guidedLab));
 }
 assert.equal(TOMO03_PROFESSIONAL_MODULES.length,14);
 assert.equal(getTreatiseLab('unknown'),undefined);
});
for(const lab of TOMO03_TREATISE_LABS)test(`${lab.id}: specialist case requires ordered evidence and retains its own state`,()=>{
 const content=getTreatiseLab(lab.id)!;
 assert.equal(content.number,lab.owner);assert.notEqual(lab.id,lab.owner);
 assert.ok(!TOMO03_PROFESSIONAL_MODULES.some(m=>m.scenario.id===lab.scenario.id));
 let state=emptyProfessionalState();
 assert.equal(validateRepair(lab.scenario,state).state.verified,false);
 assert.equal(parseProfessionalState({verified:true},content).verified,false);
 for(const test of lab.scenario.tests.filter(t=>t.requires?.length))assert.deepEqual(performRepairTest(lab.scenario,state,test.id).state.observations,[]);
 const rejected=performRepairTest(lab.scenario,state,'unsafe');
 assert.deepEqual(rejected.state.observations,[]);assert.match(rejected.message,/seguridad/);
 for(const test of lab.scenario.tests.filter(t=>!t.unsafe))state=performRepairTest(lab.scenario,state,test.id).state;
 assert.deepEqual(state.observations,lab.scenario.required);
 state={...state,hypothesis:lab.scenario.cause,repair:lab.scenario.repairs.find(r=>r.id!==lab.scenario.repair)!.id};
 assert.equal(validateRepair(lab.scenario,state).state.verified,false);
 state=validateRepair(lab.scenario,{...state,repair:lab.scenario.repair}).state;
 assert.equal(state.verified,true);assert.equal(parseProfessionalState(state,content).verified,true);
 const persisted={[lab.owner]:emptyProfessionalState(),[lab.id]:state};
 assert.equal(parseProfessionalState(persisted[lab.owner],TOMO03_PROFESSIONAL_MODULES.find(m=>m.number===lab.owner)!).verified,false);
 assert.equal(parseProfessionalState(persisted[lab.id],content).verified,true);
});
test('specializations have unique original module ownership and a complete technical contract',()=>{
 const ids=new Set<string>();
 for(const content of TOMO03_PROFESSIONAL_MODULES){
  assert.ok(!ids.has(content.number));ids.add(content.number);assert.ok(TOMO_03_MODULES.some(m=>m.moduleNumber===content.number));
  assert.equal(content.levels.length,3);assert.ok(content.levels.every(p=>p.length>180));assert.ok(content.diagram.length>=4);assert.ok(content.tree.length>=3);assert.ok(content.procedure.length>=4);assert.ok(content.quiz.length>=3);
  for(const question of content.quiz){assert.ok(question.choices.some(c=>c.id===question.correct));assert.ok(question.choices.every(c=>c.feedback.length>40));}
  assert.ok(content.references.every(ref=>ref.url.startsWith('https://')));assert.ok(content.measurement.uncertainty.length>30);
 }
});
test('all 35 IDs survive and untouched modules 15–35 retain their source',()=>{
 assert.equal(TOMO_03_MODULES.length,35);assert.equal(new Set(TOMO_03_MODULES.map(m=>m.id)).size,35);
 const file='src/data/tomo03Data.ts',baseline=execFileSync('git',['show',`11bc22b:${file}`],{encoding:'utf8'}),current=fs.readFileSync(file,'utf8');
 // git show yields LF while fs.readFileSync can yield CRLF on Windows.
 // Preserve main's Windows compatibility while checking each untouched module.
 const normalizeEol=(value:string)=>value.replace(/\r\n?/g,'\n');
 const revised=new Set([15,30,31,34]);
 const block=(raw:string,number:number)=>{const source=normalizeEol(raw);const start=source.indexOf(`    id: 'mod${number}',`);const next=number<35?source.indexOf(`    id: 'mod${number+1}',`):source.length;assert.ok(start>=0);assert.ok(next>start);return source.slice(start,next);};
 for(let number=15;number<=35;number++)if(!revised.has(number))assert.equal(block(current,number),block(baseline,number),`Unexpected change to module ${number}`);
});
for(const content of TOMO03_PROFESSIONAL_MODULES)test(`case ${content.number}: evidence gates, incorrect repairs, validation and safe restoration`,()=>{
 const scenario=content.scenario;
 let state=emptyProfessionalState();assert.equal(validateRepair(scenario,state).state.verified,false);
 const premature=scenario.tests.find(t=>t.requires?.length);if(premature){const attempt=performRepairTest(scenario,state,premature.id);assert.deepEqual(attempt.state.observations,[]);assert.match(attempt.message,/previas/);}
 for(const unsafe of scenario.tests.filter(t=>t.unsafe)){state=performRepairTest(scenario,state,unsafe.id).state;assert.ok(!state.observations.includes(unsafe.id));}
 assert.equal(parseProfessionalState({verified:true},content).verified,false);
 for(const observation of scenario.tests.filter(t=>!t.unsafe))state=performRepairTest(scenario,state,observation.id).state;
 assert.equal(state.observations.length,scenario.tests.filter(t=>!t.unsafe).length);
 state={...state,hypothesis:scenario.cause,repair:scenario.repairs.find(r=>r.id!==scenario.repair)!.id};
 assert.equal(validateRepair(scenario,state).state.verified,false);
 state={...state,repair:scenario.repair};state=validateRepair(scenario,state).state;assert.equal(state.verified,true);
 assert.equal(parseProfessionalState(JSON.parse(JSON.stringify(state)),content).verified,true);
 assert.equal(moduleAssessment(content,state).practiceValidated,true);assert.equal(moduleAssessment(content,state).theoryPassed,false);
 state.quiz=Object.fromEntries(content.quiz.map(q=>[q.id,q.correct]));assert.equal(moduleAssessment(content,state).theoryPassed,true);
 const forged={...state,observations:['fake'],verified:true};assert.equal(parseProfessionalState(forged,content).verified,false);
});
test('measurement tools: boundary uncertainty and comparable series, including genuine zero',()=>{
 assert.equal(assessAtxUncertainty(11.4,.05,11.4,12.6)?.status,'INDETERMINATE');
 assert.equal(assessAtxUncertainty(12.04,.03,11.4,12.6)?.status,'WITHIN');
 assert.equal(assessAtxUncertainty(11,.03,11.4,12.6)?.status,'OUTSIDE');
 assert.equal(assessAtxUncertainty(NaN,0,11.4,12.6),null);assert.equal(assessAtxUncertainty(12,-1,11.4,12.6),null);
 assert.equal(assessAtxUncertainty(1e308,1e308,11.4,12.6),null);
 assert.equal(compareRepairSamples([0,0,0],[1,1,1])?.percent,null);
 assert.equal(compareRepairSamples([1,2,3],[2,3]),null);assert.equal(compareRepairSamples([1,NaN,3],[1,2,3]),null);
 assert.equal(compareRepairSamples([10,11,12],[8,9,10])?.delta,-2);
});
test('RAM matrix, POST progression and firmware prerequisites never manufacture evidence',()=>{
 assert.equal(assessRamMatrix(['fail','fail','pass','pass']),'MODULE_A');
 assert.equal(assessRamMatrix(['fail','pass','fail','pass']),'PATH_1');
 assert.equal(assessRamMatrix(['unknown','pass','pass','pass']),'INCOMPLETE');
 assert.equal(assessRamMatrix(['pass','pass','pass','pass']),'NO_ERROR_OBSERVED');
 assert.equal(assessRamMatrix([] as any),'INVALID');
 assert.deepEqual(advancePost(1,2),{position:2,blocked:false});assert.deepEqual(advancePost(2,2),{position:2,blocked:true});
 assert.deepEqual(advancePost(5,null),{position:5,blocked:false});assert.equal(advancePost(-1,null),null);
 assert.equal(assessFirmwarePlan({identity:true,reason:true,official:true,recovery:false,power:true}).allowed,false);
 assert.equal(assessFirmwarePlan({identity:true,reason:true,official:true,recovery:true,power:true}).allowed,true);
 assert.equal(assessFirmwarePlan({} as any).allowed,false);
});
test('CPU support and thermal tools retain unknowns and model-specific limits',()=>{
 assert.equal(assessCpuCompatibility('AM5','AM5','unknown',true,true,true),'UNKNOWN');
 assert.equal(assessCpuCompatibility('AM5','AM4','yes',true,true,true),'NOT_SUPPORTED');
 assert.equal(assessCpuCompatibility('AM5','AM5','yes',true,true,true),'DOCUMENTED_BY_USER');
 assert.equal(assessCpuCompatibility('AM5','AM5','yes',true,true,false),'UNKNOWN');
 assert.equal(assessThermalProfile(NaN,25,95),null);assert.equal(assessThermalProfile(60,25,0),null);
 assert.deepEqual(assessThermalProfile(80,25,95),{deltaAmbient:55,margin:15,atLimit:false});
 assert.equal(assessThermalProfile(95,25,95)?.atLimit,true);
});
