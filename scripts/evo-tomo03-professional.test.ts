import test from 'node:test';
import assert from 'node:assert/strict';
import {TOMO03_PROFESSIONAL_MODULES} from '../src/data/tomo03ProfessionalContent';
import {emptyProfessionalState} from '../src/data/tomo03ProfessionalTypes';
import {performRepairTest,validateRepair,parseProfessionalState,moduleAssessment,assessAtxUncertainty,compareRepairSamples} from '../src/data/tomo03RepairEngine';
import {TOMO_03_MODULES} from '../src/data/tomo03Data';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {assessRamMatrix,advancePost,assessFirmwarePlan,assessCpuCompatibility,assessThermalProfile} from '../src/data/tomo03RepairEngine';
test('specializations have unique original module ownership and a complete technical contract',()=>{
 const ids=new Set<string>();
 for(const content of TOMO03_PROFESSIONAL_MODULES){
  assert.ok(!ids.has(content.number));ids.add(content.number);assert.ok(TOMO_03_MODULES.some(m=>m.moduleNumber===content.number));
  assert.equal(content.levels.length,3);assert.ok(content.levels.every(p=>p.length>180));assert.ok(content.diagram.length>=4);assert.ok(content.tree.length>=3);assert.ok(content.procedure.length>=4);assert.ok(content.quiz.length>=3);
  for(const question of content.quiz){assert.ok(question.choices.some(c=>c.id===question.correct));assert.ok(question.choices.every(c=>c.feedback.length>40));}
  assert.ok(content.references.every(ref=>ref.url.startsWith('https://')));assert.ok(content.measurement.uncertainty.length>30);
 }
});
test('all 35 module IDs and the complete content of 15–35 remain intact',()=>{
 assert.equal(TOMO_03_MODULES.length,35);assert.equal(new Set(TOMO_03_MODULES.map(m=>m.id)).size,35);
 const file='src/data/tomo03Data.ts',baseline=execFileSync('git',['show',`11bc22b:${file}`],{encoding:'utf8'}),current=fs.readFileSync(file,'utf8');
 const marker="    id: 'mod15',";assert.ok(baseline.includes(marker));assert.equal(current.slice(current.indexOf(marker)),baseline.slice(baseline.indexOf(marker)));
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
