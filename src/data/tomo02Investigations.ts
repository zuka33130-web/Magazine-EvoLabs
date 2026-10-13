import type { Sector01Investigation } from './tomo02Sector01Data';
import type { AdvancedSectorContent, SectorQuestion } from './tomo02AdvancedTypes';
import { TOMO_02_MASTER_SECTORS } from './tomo02MasterSectors';
import { TOMO_02_CASE_LIBRARY, type WindowsTeachingCase } from './tomo02CaseLibrary';
import { INVESTIGATION_DETAILS } from './tomo02InvestigationDetails';
import { INVESTIGATION_MYTHS } from './tomo02InvestigationMyths';
import { INVESTIGATION_TOOL_CODE } from './tomo02InvestigationTools';
/** Existing sector 01 educational contract, extended with experiment/check data. */
export interface WindowsInvestigation extends Sector01Investigation {
  experiment: string[]; check: SectorQuestion; toolCode?: string;
  caseRecord?: WindowsTeachingCase; category?: string;
}
const protocol = [
  ['protocol-baseline', 'BASELINE', 'Baseline sin condiciones reproducibles es suficiente.'],
  ['protocol-symptom', 'SÍNTOMA', 'Llamar lenta a la PC ya define una prueba.'],
  ['protocol-hypothesis', 'HIPÓTESIS', 'La hipótesis no necesita poder refutarse.'],
  ['protocol-measurement', 'MEDICIÓN', 'Datos simulados son mediciones reales del equipo.'],
  ['protocol-intervention', 'INTERVENCIÓN ÚNICA', 'Varias intervenciones permiten atribuir causa.'],
  ['protocol-remeasurement', 'SEGUNDA MEDICIÓN', 'Cambiar tarea y contexto no afecta comparación.'],
  ['protocol-delta', 'DELTA', 'Toda reducción numérica es una mejora demostrada.'],
  ['protocol-verdict', 'VEREDICTO', 'Una diferencia mínima prueba eficacia sin analizar dispersión.'],
  ['protocol-rollback', 'CONSERVAR / REVERTIR', 'Exportar el expediente certifica toda la PC.'],
] as const;
function orderChoices(choices: SectorQuestion['choices'], id: string) {
  const shift = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % choices.length;
  return [...choices.slice(shift), ...choices.slice(0, shift)];
}
function build(content: AdvancedSectorContent, id: string, title: string, myth: string): WindowsInvestigation {
  const detail = INVESTIGATION_DETAILS[id];
  if (!detail || !myth) throw new Error(`Missing authored investigation ${id}`);
  const words = `${title} ${detail.mechanism}`.toLowerCase().match(/[\p{L}]{4,}/gu) || [];
  const context = [...content.lessons].sort((a,b) => words.filter(w=>b.text.toLowerCase().includes(w)).length - words.filter(w=>a.text.toLowerCase().includes(w)).length)[0];
  const check: SectorQuestion = {question:`En ${title}, ¿qué conclusión está respaldada por el mecanismo y la observación propuesta?`, choices:orderChoices([
    {text:detail.conclusion, correct:true, feedback:`${detail.mechanism} Por eso: ${detail.conclusion}`},
    {text:myth, correct:false, feedback:`Ese supuesto excede o contradice la evidencia. ${detail.conclusion}`},
    {text:content.questions[0].choices.find(choice=>!choice.correct)!.text, correct:false, feedback:`Ese supuesto no explica este mecanismo. ${detail.mechanism}`},
  ], id)};
  const micro = orderChoices([
    {text:detail.experiment,correct:true,feedback:`La actividad se dirige al mecanismo de ${title}. Contrastá el resultado con: ${detail.conclusion}`},
    {text:`Dar por cierto: ${myth}`,correct:false,feedback:`Esa decisión confunde supuesto con prueba. ${detail.conclusion}`},
    {text:'Modificar varias configuraciones sin registrar estado anterior.',correct:false,feedback:`No permitiría atribuir el resultado. Para esta investigación: ${detail.experiment}`},
  ], `${id}-micro`);
  return {id, code:id, title, subtitle:detail.conclusion,
    descubri:{hook:`En el banco de diagnóstico alguien sostiene: «${myth}». Investigá ${title} antes de decidir una reparación: ${detail.experiment}`,
      mythVsTruth:{mentira:myth, verdad:detail.mechanism, comprobalo:detail.conclusion}},
    entende:{title:'Del mecanismo a la evidencia',explanation:[detail.mechanism,context.text],diagramLabel:'Secuencia de investigación',
      diagramItems:[{label:'OBSERVACIÓN',desc:detail.observation},{label:'PRUEBA CONTROLADA',desc:detail.experiment},{label:'INTERPRETACIÓN',desc:detail.conclusion}]},
    profundiza:{title:'Alcance y límites',technicalDetails:[detail.conclusion,content.rollback]},
    experiment:[detail.experiment, `Contrastá tu predicción inicial con el mecanismo: ${detail.mechanism}`,`Registrá qué evidencia permitiría sostener o descartar: ${detail.conclusion}`],
    miraloEnTuPc:{actionName:title, steps:[content.prerequisites,`Consulta nativa de lectura: ${detail.observation}`,'Registrá versión de Windows, herramienta, hora y qué pudiste observar. Si una opción no existe, anotá esa limitación sin instalar ni forzar cambios.'],commandOrPath:detail.observation,expectedVisual:detail.conclusion},
    comprobalo:{instruction:`Contrastá la observación de ${title} con la interpretación del resultado; resolvé la comprobación y justificá qué dato te permitió decidir.`,actionPrompt:detail.conclusion,validationKey:id}, check,
    microdesafio:{type:'DIAGNOSTIC_DECISION',question:`¿Qué práctica corresponde a ${title}?`,instruction:'Elegí una práctica pertinente, sin ejecutar cambios en el sistema desde esta página.',options:micro.map((choice,index)=>({id:String(index),text:choice.text,isCorrect:choice.correct,feedback:choice.feedback}))},
    evidencia:{fieldName:id,targetDescription:`Contexto, resultado y límite de ${title}: ${detail.conclusion}`,defaultProvenance:'SIMULATED'},toolCode:INVESTIGATION_TOOL_CODE[id],
  };
}
function fromCase(content: AdvancedSectorContent, item: WindowsTeachingCase): WindowsInvestigation {
  return {id:item.id,code:item.source,title:item.title,subtitle:`${item.category} · expediente didáctico`,category:item.category,caseRecord:item,
    descubri:{hook:item.symptom,mythVsTruth:{mentira:item.hypothesis,verdad:item.evidence,comprobalo:item.validation}},
    entende:{title:'Cadena causal del expediente',explanation:[item.symptom,item.test,item.evidence],diagramItems:[{label:'FUENTE',desc:item.source},{label:'HIPÓTESIS',desc:item.hypothesis},{label:'VALIDACIÓN',desc:item.validation}]},
    profundiza:{title:'Resolución razonada',technicalDetails:[item.rootCause,item.resolution,item.rollback]},
    experiment:[item.test,'Elegí una hipótesis antes de revelar la resolución del expediente.',item.validation],
    miraloEnTuPc:{actionName:'Transferir el método, no los valores',steps:[content.prerequisites,`Prueba indicada en el expediente: ${item.test}`,'No ejecutar una prueba de cambio o borrado sin revisar requisitos y reversión del sector de origen. Este expediente es didáctico y no mide este equipo.'],expectedVisual:item.validation},
    comprobalo:{instruction:item.test,actionPrompt:item.validation,validationKey:item.id},check:{question:item.test,choices:item.choices},
    microdesafio:{type:'DIAGNOSTIC_DECISION',question:`Con esta evidencia, ¿qué decisión aplicarías en ${item.category}?`,instruction:'Justificá la decisión con el dato del expediente.',options:item.choices.map((choice,index)=>({id:String(index),text:choice.text,isCorrect:choice.correct,feedback:choice.feedback}))},
    evidencia:{fieldName:item.id,targetDescription:item.validation,defaultProvenance:'SIMULATED'},
  };
}
const cache = new Map<string, WindowsInvestigation[]>();
export function getSectorInvestigations(content: AdvancedSectorContent): WindowsInvestigation[] {
  const cached=cache.get(content.number); if(cached) return cached;
  const meta=TOMO_02_MASTER_SECTORS.find(s=>s.sectorNumber===content.number)!;
  const investigations=content.number==='37' ? TOMO_02_CASE_LIBRARY.map(item=>fromCase(content,item)) :
    content.number==='39' ? protocol.map(([id,title,myth])=>({...build(content,id,title,myth),code:title})) :
    meta.investigationsList.map(item=>build(content,item.id,item.title,INVESTIGATION_MYTHS[item.id]));
  cache.set(content.number,investigations); return investigations;
}
