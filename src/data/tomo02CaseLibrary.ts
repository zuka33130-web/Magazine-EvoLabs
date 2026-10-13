import { SECTOR_00_MINICASES } from './tomo02Sector00Data';
import { SECTOR_01_MINICASES } from './tomo02Sector01CasesAndTests';
import { SECTOR_02_MINICASES } from './tomo02Sector02Data';
import { SECTOR_03_MINICASES } from './tomo02Sector03Data';
import { SECTOR_04_MINICASES } from './tomo02Sector04Data';
import { SECTOR_05_MINICASES } from './tomo02Sector05Data';
import { SECTOR_06_MINICASES } from './tomo02Sector06Data';
import { SECTOR_07_MINICASES } from './tomo02Sector07Data';
import { SECTOR_08_MINICASES } from './tomo02Sector08Data';
import { SECTOR_09_MINICASES } from './tomo02Sector09Data';
import { SECTOR_10_MINICASES } from './tomo02Sector10Data';
import { FAILURE_SCENARIOS } from '../components/world/labs/windowsMatrix/repair/failureScenariosData';
import { TOMO_02_ADVANCED_CONTENT } from './tomo02AdvancedContent';
import { SectorQuestion } from './tomo02AdvancedTypes';
export interface WindowsTeachingCase {
  id: string; title: string; category: string; source: string; symptom: string;
  hypothesis: string; test: string; evidence: string; rootCause: string;
  resolution: string; validation: string; rollback: string; choices: SectorQuestion['choices'];
}
const categorize = (text: string): string => {
  const rules: [string, RegExp][] = [
    ['BSOD', /bsod|bugcheck|pantallazo|pantalla azul/i], ['Bluetooth', /bluetooth/i], ['USB', /\busb\b/i],
    ['Printer', /impres|spool/i], ['HDR', /\bhdr\b/i], ['Wi-Fi', /wi.?fi/i], ['Audio', /audio|sonido/i],
    ['Boot', /arranque|boot|bcd|uefi/i], ['Update', /update|actualiz/i], ['Stutter', /stutter|tir[oó]n|dpc/i],
    ['Drivers', /driver|controlador/i], ['Power', /energ[ií]a|suspensi[oó]n|bater[ií]a/i],
    ['Recovery', /recuper|restaur/i], ['Security', /seguridad|privilegio|permiso|uac/i],
    ['Network', /dns|red|network|tcp/i], ['Display', /pantalla|monitor/i], ['GPU', /gpu|vram/i],
    ['Disk', /disco|disk|ssd|hdd|archivo/i], ['RAM', /memoria|ram|pagefile/i], ['CPU', /cpu|procesador/i],
    ['Services', /servicio|service|svchost/i],
  ];
  return rules.find(([, pattern]) => pattern.test(text))?.[0] || 'Apps';
};
const miniSets = [SECTOR_00_MINICASES, SECTOR_01_MINICASES, SECTOR_02_MINICASES, SECTOR_03_MINICASES,
  SECTOR_04_MINICASES, SECTOR_05_MINICASES, SECTOR_06_MINICASES, SECTOR_07_MINICASES,
  SECTOR_08_MINICASES, SECTOR_09_MINICASES, SECTOR_10_MINICASES];
export const TOMO_02_CASE_LIBRARY: WindowsTeachingCase[] = [
  ...miniSets.flatMap((set, index) => set.map((item): WindowsTeachingCase => ({
    id: `sector-${index}-${item.id}`, title: item.title, category: categorize(`${item.title} ${item.scenario}`),
    source: `Sector ${String(index).padStart(2, '0')} · ${item.code}`, symptom: item.scenario,
    hypothesis: item.initialMistake, test: item.diagnosticQuestion,
    evidence: item.userStatement, rootCause: item.technicalVerdict,
    resolution: item.options.find((option) => option.isCorrect)?.text || item.lessonLearned,
    validation: item.lessonLearned, rollback: 'Consultar requisitos y reversión del sector de origen antes de aplicar cualquier intervención a otro equipo.',
    choices: item.options.map((option) => ({ text: option.text, correct: option.isCorrect, feedback: option.explanation })),
  }))),
  ...FAILURE_SCENARIOS.map((item): WindowsTeachingCase => ({
    id: `repair-${item.id}`, title: item.title, category: categorize(`${item.title} ${item.category}`), source: 'Windows Failure & Repair Lab',
    symptom: item.userSymptom, hypothesis: item.whatNotToAssume, test: `${item.firstTestTool}: ${item.firstTestCommand}`,
    evidence: `${item.testResultOutput}\n${item.newEvidence}`, rootCause: item.rootCause,
    resolution: item.solutionSteps.join('\n'), validation: item.verificationProtocol, rollback: item.rollbackProtocol,
    choices: item.hypotheses.map((option) => ({ text: option.text, correct: option.isCorrect,
      feedback: option.confirmationReason || option.rejectionReason || item.nextTestExplanation })),
  })),
  ...TOMO_02_ADVANCED_CONTENT.filter((item) => item.number !== '37').map((item): WindowsTeachingCase => ({
    id: `advanced-${item.number}`, title: item.scenario, category: categorize(`${item.objective} ${item.scenario}`), source: `Sector ${item.number}`,
    symptom: item.scenario, hypothesis: item.decisions.filter((option) => !option.correct).map((option) => option.text).join(' / '),
    test: item.decisions.find((option) => option.correct)!.text, evidence: item.scenario,
    rootCause: item.decisions.find((option) => option.correct)!.feedback,
    resolution: item.procedure.join('\n'), validation: item.verification, rollback: item.rollback, choices: item.decisions,
  })),
  {
    id: 'peripheral-bluetooth-radio', title: 'Bluetooth desaparece después de suspensión', category: 'Bluetooth', source: 'Sector 16 · caso complementario',
    symptom: 'Después de reanudar no aparece la radio Bluetooth; el accesorio funciona en otro dispositivo.',
    hypothesis: 'Accesorio roto frente a enumeración/energía del adaptador.',
    test: 'Comparar el árbol PnP antes/después de reanudar y registrar versión del driver OEM.',
    evidence: 'En el escenario, la radio está enumerada al arrancar pero falta después de sleep.',
    rootCause: 'La falla se acota al trayecto del adaptador tras reanudación; aún no demuestra qué versión o política la causa.',
    resolution: 'Ensayar una política o driver compatible a la vez, preservando la versión anterior.',
    validation: 'Repetir tres ciclos de sleep/reanudación y comprobar reconexión del accesorio.',
    rollback: 'Restaurar política y paquete anteriores; conservar teclado/mouse alternativos.',
    choices: [{text: 'Comparar enumeración y energía antes/después', correct: true, feedback: 'La radio ausente delimita una capa distinta del emparejamiento.'}, {text: 'Borrar todos los emparejamientos', correct: false, feedback: 'No recupera por sí sola una radio que no está enumerada.'}],
  },
  {
    id: 'display-hdr-sdr', title: 'Escritorio SDR lavado al habilitar HDR', category: 'HDR', source: 'Sector 18 · caso complementario',
    symptom: 'Contenido HDR tiene rango visible, pero ventanas SDR cambian de brillo después de habilitar HDR.',
    hypothesis: 'Mapeo SDR/HDR o ajuste del monitor frente a GPU defectuosa.',
    test: 'Comparar mismo contenido SDR con HDR activado/desactivado, preservando perfil y brillo.',
    evidence: 'En el ejemplo, el cambio coincide con HDR y desaparece al restaurar el modo anterior.',
    rootCause: 'Hay una relación reproducible con la presentación SDR dentro del modo HDR; revisar brillo SDR y mapeo antes de reemplazar hardware.',
    resolution: 'Ajustar una sola opción documentada de brillo SDR o restaurar modo SDR según la carga.',
    validation: 'Comparar muestra SDR/HDR en el mismo monitor, sin cambiar resolución ni perfil simultáneamente.',
    rollback: 'Restaurar modo HDR/SDR, perfil y brillo originales.',
    choices: [{text: 'Cambiar GPU y cable juntos', correct: false, feedback: 'Elimina atribución del cambio.'}, {text: 'Comparar y ajustar el mapeo SDR/HDR', correct: true, feedback: 'La prueba separa presentación de una falla general de hardware.'}],
  },
  {
    id: 'graphics-hybrid-adapter', title: 'Aplicación 3D usa la GPU integrada', category: 'GPU', source: 'Sector 18 · caso complementario',
    symptom: 'La app 3D muestra poca carga dGPU y su preferencia de gráficos está en ahorro de energía.',
    hypothesis: 'Selección de adaptador frente a límite de la dGPU.',
    test: 'Verificar adaptador por proceso y comparar preferencia de la misma app con carga y energía iguales.',
    evidence: 'El ejemplo mantiene escena y alimentación; al cambiar una sola preferencia se observa actividad del adaptador seleccionado.',
    rootCause: 'La selección influye en qué GPU renderiza; no demuestra ausencia de otros límites de CPU, energía o temperatura.',
    resolution: 'Elegir preferencia compatible por aplicación, reiniciarla y medir la tarea.',
    validation: 'Comprobar adaptador y frametimes, además de batería y estabilidad.',
    rollback: 'Restaurar preferencia original y reiniciar solo la app de prueba.',
    choices: [{text: 'Usar preferencia por aplicación y verificar renderizador', correct: true, feedback: 'Aísla el adaptador sin cambiar toda la plataforma.'}, {text: 'Deshabilitar la iGPU globalmente', correct: false, feedback: 'En equipos híbridos puede intervenir en la presentación y dejar sin imagen.'}],
  },
];
