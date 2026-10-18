import type { Windows40Page } from './tomo02Magazine40Chapter001';

/**
 * Manuscritos del Magazine A4. Los datos son documentación editorial:
 * no ejecutan comandos ni capturan telemetría del lector.
 */
export type EvoWindowsResearch = {
  number: number;
  premise: readonly string[];
  mechanisms: readonly string[];
  traps: readonly string[];
  protocol: readonly string[];
  interpretation: readonly string[];
  conclusion: readonly string[];
  lab: { title: string; why: string; code: string; readout: string };
  insight: string;
  challenge: string;
  video: string;
  sources: readonly {name:string; url:string}[];
};
const titles = ['EL MISTERIO','ARQUITECTURA INVISIBLE','FALSAS PISTAS','PRUEBA REPRODUCIBLE','LECTURA DE RESULTADOS','VEREDICTO EVO'] as const;
const visuals: NonNullable<Windows40Page['visual']>[] = ['flow','flow','verdict','experiment','cpu','verdict'];
const pad = (n:number)=>String(n).padStart(3,'0');

/** Seis secciones diferentes por investigación, con teoría, experimento y fuentes. */
export function researchToPages(r:EvoWindowsResearch, title:string): Windows40Page[] {
  const groups = [r.premise,r.mechanisms,r.traps,r.protocol,r.interpretation,r.conclusion];
  const focus = [
    {label:'EL MISTERIO',text:r.insight},
    {label:'CÓMO FUNCIONA REALMENTE',text:'Diferenciá procesos, privilegios, subsistemas y eventos; no atribuyas efectos a un nombre o captura.'},
    {label:'NO CONFUNDAS CORRELACIÓN Y CAUSA',text:'Una anomalía aislada exige una hipótesis alternativa y una repetición antes de convertirse en diagnóstico.'},
    {label:'LABORATORIO EVO',text:r.lab.readout},
    {label:'LA PRUEBA DECISIVA',text:r.insight},
    {label:'DESAFÍO + VIDEO',text:r.challenge+' · GANCHO PARA VIDEO: '+r.video},
  ];
  const names = [
    title,
    'EL MECANISMO QUE HAY DETRÁS',
    'LOS ERRORES QUE TE HACEN FALLAR',
    'EL EXPERIMENTO QUE PODÉS REPETIR',
    'CÓMO INTERPRETAR SIN ENGAÑARTE',
    'LO QUE AHORA SABÉS COMPROBAR',
  ];
  return groups.map((paragraphs,i)=>({
    eyebrow:'EXPEDIENTE '+pad(r.number)+' / '+titles[i],
    title:names[i],
    subtitle: i===0?'De una promesa llamativa a un problema técnico comprobable.':
      i===1?'Arquitectura de Windows y mecanismos reales, sin atajos.':
      i===2?'Cómo separar pistas, coincidencias y falsos positivos.':
      i===3?'Instrumentos nativos, una línea de base y una variable por ensayo.':
      i===4?'Qué demuestra cada resultado y qué no permite concluir.':
      'Criterios verificables, devolución del lector y siguiente pregunta.',
    paragraphs,
    focus: focus[i],
    ...(i===3?{laboratory:r.lab}:{}),
    visual:visuals[i],
    footnote:i===5?
      'Fuentes oficiales: '+r.sources.map(s=>s.name+' — '+s.url).join(' | '):
      'Ejemplo didáctico: no es una medición del equipo del lector. Verificá edición, permisos y versión de Windows.'
  }));
}
