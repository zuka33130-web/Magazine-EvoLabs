import type {RepairScenario} from './tomo03ProfessionalTypes';
import {getProfessionalModule} from './tomo03ProfessionalContent';
import {answer as a} from './tomo03RepairContentHelpers';
export const TOMO03_TREATISE_LABS:{id:string;owner:string;title:string;scenario:RepairScenario}[]=[
 {id:'treatise-lab-08',owner:'14',title:'Laboratorio 8 · Capacitor y retrabajo de entrenamiento',scenario:{
  id:'treatise-capacitor',equipment:'Placa de entrenamiento aislada · caso C7',symptom:'Un bloque de entrenamiento no mantiene la respuesta prevista. No se conoce aún la causa.',
  safety:'SIMULACIÓN. No es una fuente ATX ni una placa conectada a red. El retrabajo real requiere instructor, control térmico, extracción de humos y procedimiento del fabricante.',
  tests:[
   {id:'identify',label:'Identificar pieza y condiciones del circuito',instrument:'Esquema didáctico y marcado',result:'C7 es electrolítico polarizado de 470 µF, 16 V, tolerancia ±20 % en el circuito ficticio. El caso confirma ausencia de energía y placa de entrenamiento aislada.'},
   {id:'isolate',label:'Consultar comprobación aislada y referencia de prueba',instrument:'Medidor de capacidad simulado',requires:['identify'],result:'C7 aislado: 150 ±5 µF con instrumento verificado bajo la condición del caso. Intervalo admitido por su tolerancia: 376–564 µF. La medición en circuito anterior no era discriminante.'},
   {id:'plan',label:'Revisar equivalencia y plan térmico del instructor',instrument:'Plan de retrabajo simulado',requires:['isolate'],result:'Se especifica repuesto equivalente en valor, tensión, polaridad, tipo y características aplicables. El instructor define perfil, flux y herramientas; no hay temperatura o tiempo universal. Pads y vías se inspeccionan antes de autorizar.'},
   {id:'unsafe',label:'Aumentar calor indefinidamente y tirar del capacitor',instrument:'Maniobra no admitida',result:'',unsafe:true}
  ],required:['identify','isolate','plan'],
  hypotheses:[a('c7','C7 fuera de tolerancia por prueba aislada','El intervalo medido no se superpone con el permitido. Esto implica C7 en el caso; no convierte toda falla de capacitor en un diagnóstico por apariencia.'),a('plane','Los planos de cobre prueban que el capacitor está dañado','La absorción de calor por cobre explica dificultad de retrabajo, no el estado eléctrico.')],cause:'c7',
  repairs:[a('qualified','Reemplazo equivalente por instructor y verificación de placa','Observar liberación de uniones, protección térmica, polaridad, pads y ausencia de puentes; el alumno documenta el proceso.'),a('force','Forzar extracción sin liberar las uniones','Puede arrancar pads y vías; no está autorizado.')],repair:'qualified',
  before:'Respuesta del bloque fuera del comportamiento esperado; causa sin confirmar.',after:'El instructor del escenario reemplazó C7 con equivalente documentado; inspección de pads/polaridad y prueba funcional de entrenamiento correctas en las condiciones ensayadas.',limits:'No mide ESR, fuga ni envejecimiento en todos los regímenes; no certifica soldadura real ni habilita intervenir una fuente.'
 }},
 {id:'treatise-lab-09',owner:'13',title:'Laboratorio 9 · GPU sin imagen y etapa de alimentación',scenario:{
  id:'treatise-gpu-regulator',equipment:'Caso didáctico de RTX 3070 · topología de entrenamiento',symptom:'La tarjeta no entrega imagen. El nombre comercial no determina su revisión ni los valores eléctricos esperados.',
  safety:'SIMULACIÓN con documentación ficticia expresamente delimitada. No propone tensiones reales de una RTX 3070 ni inyección, reflow o BGA en hardware del usuario.',
  tests:[
   {id:'external',label:'Contrastar ruta externa, conectores e identificación',instrument:'Inspección y referencia simuladas',result:'Monitor/cable/ruta pasan; alimentación auxiliar y montaje del caso son correctos. Se identifica la revisión didáctica antes de interpretar medidas.'},
   {id:'rails',label:'Consultar entrada, habilitación y salida del bloque',instrument:'Registro de laboratorio simulado',requires:['external'],result:'Según el esquema ficticio, entrada y habilitación de U4 están presentes pero su salida no alcanza la condición prevista. No se extrapolan voltajes o resistencias a placas comerciales.'},
   {id:'isolation',label:'Contrastar bloque regulador y carga por aislamiento especializado',instrument:'Pruebas del instructor',requires:['rails'],result:'El aislamiento controlado del escenario implica U4: la carga de referencia funciona con regulación equivalente y no muestra el fallo. La baja resistencia del núcleo, por sí sola, no fue utilizada como prueba de corto.'},
   {id:'unsafe',label:'Aplicar reballing o reflow como primera respuesta',instrument:'Intervención no justificada',result:'',unsafe:true}
  ],required:['external','rails','isolation'],
  hypotheses:[a('u4','Etapa de regulación U4 implicada por aislamiento','La evidencia separa entrada, control y carga en el caso. Artefactos o video ausente no identifican por sí solos VRAM ni soldaduras BGA.'),a('vram','VRAM dañada confirmada porque no hay imagen','No existe evidencia que justifique ese salto causal.'),a('bga','Toda ausencia de imagen requiere reballing','Renovar uniones no repara daño del silicio ni sustituye diagnóstico.')],cause:'u4',
  repairs:[a('specialist','Intervención especializada de U4 con validación eléctrica y funcional','El instructor aplica el procedimiento específico del escenario y luego contrasta regulación, imagen y memoria.'),a('heat','Calentar el chip gráfico sin evidencia','La acción no responde a la etapa aislada y puede dañar la placa.')],repair:'specialist',
  before:'Sin imagen, con hipótesis de señal, alimentación, regulación y carga todavía abiertas.',after:'Después de la intervención especializada simulada, la regulación cumple la referencia ficticia y el conjunto de pruebas de imagen/memoria del caso no reproduce el fallo.',limits:'No certifica una RTX real, todos sus rieles, VRAM completa o estabilidad indefinida; los valores requieren esquema y revisión reales.'
 }}
];
export function getTreatiseLab(id:string){
 const lab=TOMO03_TREATISE_LABS.find(item=>item.id===id);
 const owner=lab&&getProfessionalModule(lab.owner);
 return lab&&owner?{...owner,scenario:lab.scenario}:undefined;
}
