import React, {useEffect, useMemo, useState} from 'react';
import {Activity, ArrowLeft, BookOpen, CheckCircle2, ClipboardList, Download, FlaskConical, Gauge, RotateCcw, Search, ShieldAlert, Wrench} from 'lucide-react';
import {TOMO_03_MODULES} from '../../data/tomo03Data';
import {ATX_RAILS, assessAtxRail, TOMO03_REPAIR_LABS} from '../../data/tomo03WorkbenchData';
import {TOMO03_PROFESSIONAL_MODULES,getProfessionalModule} from '../../data/tomo03ProfessionalContent';
import type {ProfessionalState} from '../../data/tomo03ProfessionalTypes';
import {parseProfessionalState,moduleAssessment,assessAtxUncertainty} from '../../data/tomo03RepairEngine';
import {Tomo03ProfessionalModule} from './Tomo03ProfessionalModule';
import {EvoRepairLab} from './EvoRepairLab';
import {Tomo03RepairTools} from './Tomo03RepairTools';

type Section = 'protocolos'|'laboratorios'|'herramientas'|'expediente';
type Branch = 'untested'|'yes'|'no';
type Provenance = 'SIMULATED'|'USER_DECLARED_NOT_VERIFIED';
type RecordItem = {
  branch: Branch;
  symptom: string;
  observation: string;
  hypothesis: string;
  test: string;
  result: string;
  validation: string;
  rollback: string;
  diagnosis: string;
  limitations: string;
  provenance: Provenance;
};
type Store = {schema:1;records:Record<string,RecordItem>;labs:Record<string,Record<string,string>>;professional?:Record<string,ProfessionalState>};
const storageKey='evo_tomo03_repair_workbench_v1';
const readAtxDraft=():Record<string,string>=>{try{const value=JSON.parse(localStorage.getItem('evo_tomo03_atx_draft_v1')||'{}');return value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter((entry):entry is [string,string]=>typeof entry[1]==='string')):{};}catch{return {};}};
const blank=():RecordItem=>({
  branch:'untested',symptom:'',observation:'',hypothesis:'',test:'',result:'',validation:'',rollback:'',diagnosis:'',limitations:'',
  provenance:'SIMULATED'
});
const readStore=():Store=>{
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');
    if(saved.schema===1 && saved.records && typeof saved.records==='object' && saved.labs && typeof saved.labs==='object'){
      const records:Store['records']={};
      for(const [id,raw] of Object.entries(saved.records)){
        if(!raw||typeof raw!=='object'||Array.isArray(raw))continue;
        const item=raw as Partial<RecordItem>,record=blank();
        for(const key of ['symptom','observation','hypothesis','test','result','validation','rollback','diagnosis','limitations'] as const)if(typeof item[key]==='string')record[key]=item[key]!;
        if(item.branch==='yes'||item.branch==='no')record.branch=item.branch;
        if(item.provenance==='USER_DECLARED_NOT_VERIFIED')record.provenance=item.provenance;
        records[id]=record;
      }
      const labs:Store['labs']={};
      for(const [id,raw] of Object.entries(saved.labs))if(raw&&typeof raw==='object'&&!Array.isArray(raw))labs[id]=Object.fromEntries(Object.entries(raw).filter(([,value])=>typeof value==='string'));
      return {schema:1,records,labs,professional:saved.professional&&typeof saved.professional==='object'&&!Array.isArray(saved.professional)?saved.professional:{}};
    }
  }catch{ /* No storage in private mode or invalid old data. */ }
  return {schema:1,records:{},labs:{}};
};
const tabs: {id:Section;label:string}[]=[
  {id:'protocolos',label:'Protocolos y síntomas'},
  {id:'laboratorios',label:'Laboratorios'},
  {id:'herramientas',label:'Herramientas'},
  {id:'expediente',label:'Expediente de taller'}
];
export const Tomo03WorkbenchView:React.FC<{onBack:()=>void;initialModuleNumber?:string}>=({onBack,initialModuleNumber})=>{
  const [section,setSection]=useState<Section>('protocolos');
  const [store,setStore]=useState<Store>(readStore);
  const [moduleId,setModuleId]=useState(()=>TOMO_03_MODULES.find(item=>item.moduleNumber===initialModuleNumber)?.id||'mod03');
  const [filter,setFilter]=useState('');
  const [labId,setLabId]=useState(TOMO03_REPAIR_LABS[0].id);
  const [rail,setRail]=useState<string>(()=>{const value=readAtxDraft().rail;return ATX_RAILS.some(r=>r.id===value)?value:'12';});
  const [voltage,setVoltage]=useState(()=>readAtxDraft().voltage||'');
  const [voltageUncertainty,setVoltageUncertainty]=useState(()=>readAtxDraft().uncertainty||'');
  const [showTheory,setShowTheory]=useState(false);
  const [professionalCase,setProfessionalCase]=useState<string|null>(null);
  const [professionalTool,setProfessionalTool]=useState('power-checklist');
  const current=TOMO_03_MODULES.find(item=>item.id===moduleId)||TOMO_03_MODULES[0];
  const professional=getProfessionalModule(current.moduleNumber);
  const caseContent=getProfessionalModule(professionalCase||'');
  const updateProfessional=(number:string,state:ProfessionalState)=>setStore(prev=>({...prev,professional:{...prev.professional,[number]:state}}));
  const record={...blank(),...(store.records[current.id]||{})};
  const lab=TOMO03_REPAIR_LABS.find(item=>item.id===labId)!;
  const labAnswers=store.labs[lab.id]||{};
  const answered=lab.steps.filter(step=>step.options.some(c=>c.id===labAnswers[step.id])).length;
  const correct=lab.steps.filter(step=>step.correctId===labAnswers[step.id]).length;
  const matchingLabs=TOMO03_REPAIR_LABS.filter(item=>item.moduleNumbers.includes(current.moduleNumber));
  const recordsCount=Object.keys(store.records).filter((key) => {
    const item: RecordItem | undefined = store.records[key];
    return Boolean(item && (item.symptom?.trim() || item.observation?.trim()));
  }).length;
  const filtered=useMemo(()=>TOMO_03_MODULES.filter(item=>[item.moduleNumber,item.title,item.subtitle,item.categoryTag]
    .some(value=>value.toLocaleLowerCase('es').includes(filter.toLocaleLowerCase('es').trim()))),[filter]);
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(store));}catch{/* Storage optional. */}},[store]);
  useEffect(()=>{try{localStorage.setItem('evo_tomo03_atx_draft_v1',JSON.stringify({rail,voltage,uncertainty:voltageUncertainty,provenance:'USER_INPUT_NOT_VERIFIED'}));}catch{/* Optional draft. */}},[rail,voltage,voltageUncertainty]);
  const update=(patch:Partial<RecordItem>)=>setStore(prev=>({
    ...prev,records:{...prev.records,[current.id]:{...blank(),...prev.records[current.id],...patch}}
  }));
  const choose=(stepId:string,answerId:string)=>setStore(prev=>({
    ...prev,labs:{...prev.labs,[lab.id]:{...prev.labs[lab.id],[stepId]:answerId}}
  }));
  const openLab=(id:string)=>{setLabId(id);setSection('laboratorios');};
  const report=()=>{
    const lines=[
      'EVO LABS // EXPEDIENTE DE DIAGNÓSTICO DE TALLER',
      'ORIGEN: MANUAL O SIMULADO. SIN DETECCIÓN AUTOMÁTICA. NO ES CERTIFICACIÓN.',
      'FECHA UTC: '+new Date().toISOString(),
      'MÓDULO: '+current.moduleNumber+' · '+current.title,
      'PROCEDENCIA: '+record.provenance,
      'SÍNTOMA: '+(record.symptom||'(sin consignar)'),
      'OBSERVACIÓN: '+(record.observation||'(sin consignar)'),
      'HIPÓTESIS: '+(record.hypothesis||'(sin consignar)'),
      'PRUEBA REALIZADA: '+(record.test||'(sin consignar)'),
      'RESULTADO: '+(record.result||'(sin consignar)'),
      'VALIDACIÓN: '+(record.validation||'(sin consignar)'),
      'REVERSIÓN: '+(record.rollback||'(sin consignar)'),
      'DIAGNÓSTICO / GRADO DE CERTEZA: '+(record.diagnosis||'(sin consignar)'),
      'LIMITACIONES Y PRUEBAS PENDIENTES: '+(record.limitations||'(sin consignar)'),
      'LECTURA ATX INGRESADA, NO VERIFICADA: '+(voltage?`${rail}: ${voltage} V; incertidumbre declarada ${voltageUncertainty||'desconocida'} V`:'sin lectura registrada'),
      'RUTA DEL ÁRBOL: '+(professional?JSON.stringify(parseProfessionalState(store.professional?.[professional.number],professional).tree):record.branch),
      ...(professional?[
        'RECORRIDO PROFESIONAL: '+JSON.stringify(parseProfessionalState(store.professional?.[professional.number],professional)),
        'EVALUACIÓN EDUCATIVA: '+JSON.stringify(moduleAssessment(professional,parseProfessionalState(store.professional?.[professional.number],professional))),
        'CAUSA Y REPARACIÓN SIMULADAS: '+(parseProfessionalState(store.professional?.[professional.number],professional).verified?professional.scenario.hypotheses.find(h=>h.id===professional.scenario.cause)?.label:'Aún sin resolución validada'),
        'LÍMITES: '+professional.scenario.limits
      ]:[]),
      '',
      'PRÁCTICAS DIDÁCTICAS (NO SON MEDICIONES FÍSICAS):',
      ...TOMO03_REPAIR_LABS.map(item=>{
        const answers=store.labs[item.id]||{};
        const done=item.steps.filter(step=>Boolean(answers[step.id])).length;
        const hits=item.steps.filter(step=>answers[step.id]===step.correctId).length;
        return item.id+': '+hits+'/'+item.steps.length+' decisiones correctas; '+done+'/'+item.steps.length+' respondidas';
      }),
      '',
      'LÍMITES: la simulación no demuestra el estado de ningún componente físico. No incluir secretos ni datos privados.'
    ];
    return lines.join('\n');
  };
  const download=()=>{
    const blob=new Blob([report()],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='EVO-TOMO03-EXPEDIENTE-'+current.moduleNumber+'.txt';a.click();
    URL.revokeObjectURL(url);
  };
  const numeric=voltage.trim()?Number(voltage.replace(',','.')):NaN;
  const evaluated=assessAtxRail(rail,numeric);
  const interval=evaluated?assessAtxUncertainty(numeric,voltageUncertainty.trim()?Number(voltageUncertainty.replace(',','.')):NaN,evaluated.rail.min,evaluated.rail.max):null;
  return <main className="min-h-screen bg-[#050a07] text-zinc-100 px-3 sm:px-7 pb-16 font-sans">
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="sticky top-0 z-30 bg-[#06100b]/95 border-b border-emerald-900/60 backdrop-blur py-4">
        <div className="flex flex-wrap justify-between gap-4 items-center">
          <div className="space-y-1">
            <div className="text-[10px] font-mono tracking-[0.18em] text-emerald-400">EVO LABS // TOMO 03 // REPAIR WORKBENCH</div>
            <h1 className="text-lg sm:text-2xl font-black">BANCO DE REPARACIÓN INTERACTIVO</h1>
            <p className="text-xs text-zinc-400">Síntoma ≠ causa · medir, aislar, comprobar y documentar</p>
          </div>
          <button type="button" onClick={onBack} className="border border-emerald-700 px-3 py-2 rounded-lg text-xs flex items-center gap-2 hover:bg-emerald-950"><ArrowLeft size={16}/> Volver al manual</button>
        </div>
      </header>
      <div className="p-3 sm:p-4 rounded-xl border border-amber-800/70 bg-amber-950/15 text-amber-200 text-xs leading-relaxed flex gap-3">
        <ShieldAlert className="shrink-0" size={20}/>
        <p><strong>Entorno educativo y registro manual.</strong> No lee sensores ni inspecciona tu PC. Los casos son simulados; las observaciones propias no están verificadas automáticamente. Nunca abras una fuente ATX ni trabajes sobre tensión de red sin capacitación y equipo habilitado. Hacé copia de seguridad antes de escribir en discos.</p>
      </div>
      <nav aria-label="Áreas del banco EVO" className="flex flex-wrap gap-2">
        {tabs.map(tab=><button key={tab.id} type="button" onClick={()=>setSection(tab.id)} aria-pressed={section===tab.id} className={'px-3 py-2 rounded-lg text-xs font-semibold border transition-colors '+(section===tab.id?'bg-emerald-500 text-black border-emerald-400':'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-emerald-800')}>{tab.label}</button>)}
      </nav>
      {section==='protocolos'&&<div className="grid lg:grid-cols-[270px_minmax(0,1fr)] gap-5 items-start">
        <aside className="rounded-xl border border-emerald-900/60 bg-zinc-950/70 p-3 space-y-3 lg:sticky lg:top-32">
          <label className="text-xs text-emerald-300 flex gap-2 items-center"><Search size={16}/> Buscar módulo</label>
          <input aria-label="Buscar módulo" value={filter} onChange={event=>setFilter(event.target.value)} placeholder="RAM, BIOS, arranque…" className="w-full border border-zinc-700 bg-black rounded-lg p-2 text-sm"/>
          <div className="max-h-[60vh] overflow-y-auto space-y-1">
            {filtered.map(mod=><button key={mod.id} type="button" onClick={()=>{setModuleId(mod.id);setShowTheory(false);}} aria-pressed={current.id===mod.id} className={'block w-full text-left rounded-lg px-2 py-2 text-xs border '+(current.id===mod.id?'border-emerald-500 bg-emerald-950/40 text-emerald-200':'border-transparent text-zinc-300 hover:bg-zinc-900')}><span className="font-bold">[{mod.moduleNumber}]</span> {mod.title}</button>)}
            {filtered.length===0&&<p className="text-xs text-zinc-400 p-2">No hay coincidencias.</p>}
          </div>
        </aside>
        <div className="space-y-5 min-w-0">
          <section className="p-5 rounded-2xl border border-emerald-800/60 bg-[#09140e] space-y-4">
            <div className="text-xs font-mono text-emerald-400">{current.categoryTag} · MÓDULO {current.moduleNumber}/35</div>
            <h2 className="font-black text-xl sm:text-2xl">{current.title}</h2>
            <p className="text-sm text-zinc-300">{current.subtitle}</p>
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-bold text-emerald-300">1. Comprendé antes de intervenir</h3>
              <p className="text-xs text-zinc-300">{current.summary||current.keyTakeaways[0]}</p>
              <button type="button" onClick={()=>setShowTheory(v=>!v)} className="text-xs underline text-emerald-300">{showTheory?'Ocultar claves de taller':'Ver claves y herramienta recomendada'}</button>
              {showTheory&&<div className="space-y-2 text-xs text-zinc-300">
                <ul className="list-disc pl-5 space-y-2">{current.keyTakeaways.map((item,i)=><li key={i}>{item}</li>)}</ul>
                <p className="text-emerald-300">Herramienta: {current.bancoTool||current.workbenchTool}</p>
                <p className="text-amber-300">Riesgo declarado: {current.safetyLevel.replaceAll('_',' ')}</p>
              </div>}
            </div>
            {professional?<Tomo03ProfessionalModule key={professional.number} content={professional} state={parseProfessionalState(store.professional?.[professional.number],professional)} onChange={state=>updateProfessional(professional.number,state)} onLab={()=>{setProfessionalCase(professional.number);setSection('laboratorios');}} onTool={()=>{setProfessionalTool(professional.tool);setSection('herramientas');}}/>:<div className="bg-black/40 border border-emerald-900/70 rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-emerald-300 text-sm">2. Árbol de decisión interactivo</h3>
              <p className="text-sm">{current.decisionTree.question}</p>
              <div className="flex flex-wrap gap-2">{([
                {id:'yes' as const,label:'SÍ, observado'},
                {id:'no' as const,label:'NO, observado'},
                {id:'untested' as const,label:'No comprobado'}
              ]).map(option=><button key={option.id} type="button" onClick={()=>update({branch:option.id})} aria-pressed={record.branch===option.id} className={'rounded-lg border px-3 py-2 text-xs '+(record.branch===option.id?'border-emerald-400 bg-emerald-950 text-emerald-200':'border-zinc-700 text-zinc-400')}>{option.label}</button>)}</div>
              <p role="status" className="p-3 rounded-lg bg-[#0b1a12] border border-emerald-900/40 text-sm text-zinc-200">
                {record.branch==='yes'?current.decisionTree.yesAction:record.branch==='no'?current.decisionTree.noAction:'Elegí solo una observación realmente comprobada. Si no la mediste, dejá «No comprobado».'}
              </p>
              <p className="text-xs text-amber-300">Una rama indica la próxima comprobación sugerida; no certifica la causa de una avería.</p>
            </div>}
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="text-xs text-zinc-300">Síntoma reproducible<textarea value={record.symptom} onChange={e=>update({symptom:e.target.value})} rows={3} placeholder="Qué ocurre, cuándo y con qué frecuencia" className="mt-1 block w-full rounded-lg border border-zinc-700 bg-black p-3"/></label>
              <label className="text-xs text-zinc-300">Observación o medición<textarea value={record.observation} onChange={e=>update({observation:e.target.value})} rows={3} placeholder="Dato obtenido y fuente; no inventar valores" className="mt-1 block w-full rounded-lg border border-zinc-700 bg-black p-3"/></label>
              <label className="text-xs text-zinc-300">Hipótesis<textarea value={record.hypothesis} onChange={e=>update({hypothesis:e.target.value})} rows={3} placeholder="Una explicación que pueda ponerse a prueba" className="mt-1 block w-full rounded-lg border border-zinc-700 bg-black p-3"/></label>
              <label className="text-xs text-zinc-300">Prueba controlada<textarea value={record.test} onChange={e=>update({test:e.target.value})} rows={3} placeholder="Una variable, criterio esperado, precauciones" className="mt-1 block w-full rounded-lg border border-zinc-700 bg-black p-3"/></label>
              <label className="text-xs text-zinc-300">Resultado real o simulado<textarea value={record.result} onChange={e=>update({result:e.target.value})} rows={3} placeholder="Resultado, incluidos los datos contradictorios" className="mt-1 block w-full rounded-lg border border-zinc-700 bg-black p-3"/></label>
              <label className="text-xs text-zinc-300">Verificación y reversión<textarea value={record.validation} onChange={e=>update({validation:e.target.value})} rows={3} placeholder="Cómo confirmaste estabilidad" className="mt-1 block w-full rounded-lg border border-zinc-700 bg-black p-3"/></label>
            </div>
            <label className="text-xs text-zinc-300 block">Plan de recuperación si algo sale mal<textarea value={record.rollback} onChange={e=>update({rollback:e.target.value})} rows={2} className="block mt-1 w-full rounded-lg border border-zinc-700 bg-black p-2"/></label>
            <div className="grid sm:grid-cols-2 gap-3"><label className="text-xs block">Diagnóstico y grado de certeza<textarea value={record.diagnosis} onChange={e=>update({diagnosis:e.target.value})} rows={3} placeholder="Probable, sustentado o inconcluso; citar pruebas" className="block mt-1 w-full rounded-lg border border-zinc-700 bg-black p-2"/></label><label className="text-xs block">Limitaciones y pruebas pendientes<textarea value={record.limitations} onChange={e=>update({limitations:e.target.value})} rows={3} placeholder="Qué no pudo comprobarse y cuándo derivar" className="block mt-1 w-full rounded-lg border border-zinc-700 bg-black p-2"/></label></div>
            <label className="text-xs text-zinc-300 block">Procedencia del expediente
              <select value={record.provenance} onChange={e=>update({provenance:e.target.value as Provenance})} className="block mt-1 p-2 rounded-lg bg-black border border-zinc-700 w-full max-w-lg">
                <option value="SIMULATED">Práctica simulada</option>
                <option value="USER_DECLARED_NOT_VERIFIED">Observación propia, sin verificación automática</option>
              </select>
            </label>
            <p role="status" className="text-xs text-emerald-400">Tus registros se guardan localmente por módulo. {recordsCount} de 35 módulos con notas registradas.</p>
            <button type="button" onClick={()=>setSection('expediente')} className="rounded-lg bg-emerald-500 px-4 py-2 text-black text-sm font-bold flex items-center gap-2"><ClipboardList size={17}/> Abrir expediente y exportar</button>
          </section>
          <section className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/70 space-y-3">
            <h3 className="text-sm font-bold">Prácticas relacionadas con este módulo</h3>
            <p className="text-xs text-zinc-400">Los laboratorios disponibles son simulaciones; ampliaremos los escenarios específicos sin repetir contenidos.</p>
            <div className="flex flex-wrap gap-2">{matchingLabs.length?matchingLabs.map(item=><button key={item.id} onClick={()=>openLab(item.id)} className="text-xs border border-emerald-700 text-emerald-300 rounded-lg p-2" type="button">{item.title}</button>):<span className="text-xs text-zinc-500">Pendiente de laboratorio dedicado. Podés completar el protocolo manual del módulo.</span>}</div>
          </section>
        </div>
      </div>}
      {section==='laboratorios'&&<div className="space-y-5">
       <section className="p-4 rounded-xl border border-emerald-800 space-y-3"><h2 className="text-xl font-bold">EVO Repair Lab · investigación de fallas</h2><label className="text-xs block">Equipo y escenario simulado<select aria-label="Equipo y escenario simulado" className="block w-full bg-black border border-zinc-700 p-2 rounded-lg mt-1" value={professionalCase||''} onChange={e=>{setProfessionalCase(e.target.value||null);if(e.target.value)setModuleId('mod'+e.target.value);}}><option value="">Seleccionar equipo simulado</option>{TOMO03_PROFESSIONAL_MODULES.map(m=><option key={m.number} value={m.number}>[{m.number}] {m.scenario.equipment} · {m.scenario.symptom}</option>)}</select></label><p className="text-xs text-zinc-400">Elegís un equipo y un síntoma. Las pruebas revelan evidencia del caso; la resolución permanece oculta hasta sustentar y comprobar una reparación.</p></section>
       {caseContent&&<EvoRepairLab key={caseContent.number} content={caseContent} state={parseProfessionalState(store.professional?.[caseContent.number],caseContent)} onChange={state=>updateProfessional(caseContent.number,state)} onDocument={()=>{setModuleId('mod'+caseContent.number);setSection('expediente');}}/>}
       <h2 className="font-bold text-lg">Cuatro prácticas guiadas originales</h2>
       <section className="grid lg:grid-cols-[270px_minmax(0,1fr)] gap-5">
        <aside className="space-y-2">{TOMO03_REPAIR_LABS.map(item=><button key={item.id} type="button" onClick={()=>setLabId(item.id)} aria-pressed={lab.id===item.id} className={'block w-full text-left p-3 rounded-xl border text-sm '+(lab.id===item.id?'bg-emerald-950/50 border-emerald-500':'bg-zinc-950 border-zinc-800')}>{item.title}<span className="block text-xs text-zinc-400 mt-1">{item.steps.length} decisiones</span></button>)}</aside>
        <div className="space-y-4 min-w-0">
          <div className="rounded-2xl border border-emerald-800 p-5 bg-[#09140e] space-y-3">
            <div className="text-xs text-emerald-400 flex gap-2 items-center"><FlaskConical size={16}/> SIMULACIÓN DIDÁCTICA · {answered}/{lab.steps.length} RESPONDIDAS</div>
            <h2 className="font-black text-xl">{lab.title}</h2>
            <p className="text-sm">{lab.symptom}</p>
            <p className="text-xs p-3 rounded-lg bg-amber-950/30 border border-amber-800 text-amber-200">{lab.safety}</p>
          </div>
          {lab.steps.map((step,index)=><div key={step.id} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 space-y-3">
            <h3 className="text-sm font-bold text-emerald-300">Decisión {index+1} · {step.question}</h3>
            <div className="space-y-2">{step.options.map(choice=><button type="button" key={choice.id} onClick={()=>choose(step.id,choice.id)} aria-pressed={labAnswers[step.id]===choice.id} className={'block w-full text-left text-sm p-3 rounded-lg border '+(labAnswers[step.id]===choice.id?'border-emerald-400 bg-emerald-950/50':'border-zinc-700 hover:border-emerald-900')}>{choice.label}</button>)}</div>
            {labAnswers[step.id]&&<div role="status" className={'p-3 rounded-lg text-xs border '+(labAnswers[step.id]===step.correctId?'border-emerald-600 text-emerald-300':'border-amber-800 text-amber-300')}>
              <p className="font-bold">{labAnswers[step.id]===step.correctId?'Decisión adecuada':'Revisá el criterio de descarte'}</p>
              <p>{step.options.find(choice=>choice.id===labAnswers[step.id])?.feedback}</p>
              <p className="mt-2 text-zinc-300">{step.explanation}</p>
            </div>}
          </div>)}
          <div className="rounded-xl border border-emerald-800 bg-[#09140e] p-4 space-y-2">
            <p className="text-sm font-bold">Resultado de la práctica: {correct} / {lab.steps.length} decisiones correctas</p>
            <p className="text-xs text-zinc-300">{answered===lab.steps.length?lab.outcome:'Completá todas las decisiones para leer el criterio final de validación.'}</p>
            <div className="flex flex-wrap gap-2"><button type="button" onClick={()=>setStore(prev=>({...prev,labs:{...prev.labs,[lab.id]:{}}}))} className="flex items-center gap-2 text-xs border border-zinc-700 rounded-lg px-3 py-2"><RotateCcw size={14}/> Repetir práctica</button><button type="button" onClick={()=>setSection('expediente')} className="text-xs bg-emerald-500 text-black font-bold rounded-lg px-3 py-2">Ver avance en expediente</button></div>
          </div>
        </div>
      </section></div>}
      {section==='herramientas'&&<><Tomo03RepairTools key={professionalTool} initialTool={professionalTool}/><div className="grid lg:grid-cols-2 gap-5">
        <section id="evo-atx-interpreter" className="rounded-2xl border border-emerald-800 bg-[#09140e] p-5 space-y-4">
          <h2 className="text-xl font-black flex items-center gap-2"><Gauge size={20}/> Intérprete de tensiones ATX</h2>
          <p className="text-xs text-zinc-300">Calculadora para introducir una medición manual. No conecta con un multímetro ni verifica el estado de la fuente. Rangos nominales ±5 % por riel para interpretación orientativa.</p>
          <label className="text-xs text-emerald-300 block">Riel medido<select value={rail} onChange={e=>setRail(e.target.value)} className="block w-full p-2 mt-1 bg-black border border-zinc-700 rounded-lg">{ATX_RAILS.map(item=><option key={item.id} value={item.id}>{item.label} · nominal {item.nominal} V</option>)}</select></label>
          <label className="text-xs text-emerald-300 block">Lectura en voltios<input aria-label="Tensión ingresada (V)" inputMode="decimal" value={voltage} onChange={e=>setVoltage(e.target.value)} placeholder="Por ejemplo: 12,04" className="block w-full mt-1 bg-black border border-zinc-700 p-2 rounded-lg"/></label>
          <label className="text-xs text-emerald-300 block">Incertidumbre absoluta declarada (± V)<input inputMode="decimal" value={voltageUncertainty} onChange={e=>setVoltageUncertainty(e.target.value)} placeholder="Según instrumento y método" className="block w-full mt-1 bg-black border border-zinc-700 p-2 rounded-lg"/></label>
          <div role="status" className="p-4 border border-zinc-700 rounded-xl text-sm space-y-2">
            {evaluated?<><p className={evaluated.within?'text-emerald-300 font-bold':'text-amber-300 font-bold'}>{evaluated.within?'Dentro del rango de tensión nominal (valor central)':'Fuera del rango de tensión nominal (valor central)'}</p><p>Rango de comparación: {evaluated.rail.min} – {evaluated.rail.max} V.</p><p className="text-xs text-zinc-400">{evaluated.caveat}</p></>:<p className="text-zinc-400">Ingresá un valor numérico válido para mostrar el rango.</p>}
          </div>
          <p role="status" className="text-sm text-amber-200">{interval?`Intervalo ${interval.low.toFixed(3)}–${interval.high.toFixed(3)} V. ${interval.status==='WITHIN'?'Dentro de referencia DC incluyendo incertidumbre':interval.status==='OUTSIDE'?'Fuera de referencia DC':'Indeterminado: cruza un límite'}.`:'La comparación nominal anterior no incluye incertidumbre hasta que declares su valor.'}</p>
          <p className="text-xs text-amber-300">Solo personal calificado debe medir en circuitos energizados. Nunca abrir la fuente ni introducir puntas donde puedan causar cortocircuito. Un riel dentro de rango no descarta rizado o fallas transitorias.</p>
        </section>
        <section className="rounded-2xl border border-zinc-800 p-5 bg-zinc-950/70 space-y-4">
          <h2 className="font-black text-lg flex items-center gap-2"><Wrench size={18}/> Método de comprobación EVO</h2>
          <ol className="list-decimal pl-5 text-sm text-zinc-300 space-y-3">
            <li>Reproducir el síntoma en condiciones conocidas y registrar su frecuencia.</li>
            <li>Comprobar primero causas externas y de bajo riesgo.</li>
            <li>Medir una variable por vez; registrar instrumento, unidad, contexto y límites.</li>
            <li>Contrastar la hipótesis con un componente conocido bueno si es seguro y compatible.</li>
            <li>Documentar intervención, verificación después de reparar y plan de reversión.</li>
          </ol>
          <p className="text-xs text-zinc-500">POST, RAM, compatibilidad, perfil térmico y comparación de series están disponibles en el selector del banco. El lector guiado de SMART corresponde a la siguiente fase de almacenamiento.</p>
        </section>
      </div></>}
      {section==='expediente'&&<section className="rounded-2xl border border-emerald-800 bg-[#09140e] p-5 space-y-4 max-w-5xl">
        <h2 className="text-xl font-black flex gap-2 items-center"><ClipboardList size={20}/> Expediente de reparación · {current.title}</h2>
        <p className="text-sm text-zinc-300">Los datos se guardan en este navegador para los 35 módulos. El expediente informa observaciones declaradas y prácticas simuladas; no expide certificados.</p>
        <p className="text-xs text-emerald-300">{recordsCount} / 35 módulos con notas. Seleccioná otro módulo en Protocolos para exportar su registro individual.</p>
        <pre className="text-xs p-4 whitespace-pre-wrap break-words border border-zinc-700 rounded-xl bg-black text-zinc-300 max-h-[600px] overflow-auto">{report()}</pre>
        <div className="flex flex-wrap gap-2">
          <button onClick={download} type="button" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 text-black text-xs font-bold px-4 py-2"><Download size={17}/> Exportar TXT del módulo</button>
          <button onClick={()=>setSection('protocolos')} type="button" className="inline-flex items-center gap-2 border border-zinc-700 text-xs px-4 py-2 rounded-lg"><BookOpen size={17}/> Volver al protocolo</button>
        </div>
        <p className="text-xs text-amber-300">No guardes contraseñas, datos identificatorios de clientes ni claves de cifrado. Antes de prestar un equipo, considerá exportar el informe y borrar los datos locales según la política de privacidad del taller.</p>
      </section>}
      <footer className="text-[11px] text-zinc-500 border-t border-emerald-950 py-5 flex items-center gap-2"><Activity size={14}/> EVO LABS // {TOMO03_PROFESSIONAL_MODULES.length} módulos especializados · cuatro prácticas originales · 35 protocolos con registro. Los demás módulos continúan en desarrollo.</footer>
    </div>
  </main>;
};
