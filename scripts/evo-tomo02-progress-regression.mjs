import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(path, 'utf8');
const root = 'src/components/tomo02/';
let checks = 0;
const has = (text, fragment, title) => {
  assert.ok(text.includes(fragment), title + ': falta ' + fragment);
  checks++;
};
const no = (text, fragment, title) => {
  assert.ok(!text.includes(fragment), title + ': marcador no permitido ' + fragment);
  checks++;
};
const magazine = read(root + 'Tomo02MagazineView.tsx');
const shared = read(root + 'shared/useTomo02LegacySectorProgress.ts');
has(shared, 'schema: 1', 'Esquema versionado');
has(shared, 'localStorage.setItem(keyFor(sector)', 'Persistencia explícita');
has(shared, 'record.testScore >= passingPercent', 'Puntuación con umbral');
has(shared, 'completed.length === valid.size', 'Investigaciones obligatorias');
has(shared, 'record.mission', 'Misión obligatoria');
has(magazine, 'const handleSectorProgress = useCallback(', 'Actualización estable del índice');
has(magazine, 'const completionEligible = hasPassedFinalExam && sectorCompletionReady && hasFinalExperimentEvidence()', 'Elegibilidad de constancia');
has(magazine, 'if (!completionEligible)', 'Bloqueo de constancia');
for (let i = 0; i <= 10; i++) {
  const n = String(i).padStart(2, '0');
  const folder = root + 'sector' + n + '/Tomo02Sector' + n;
  const reader = read(folder + 'View.tsx');
  const test = read(folder + 'TestView.tsx');
  const mission = read(folder + 'MissionView.tsx');
  has(magazine, '<Tomo02Sector' + n + 'View\\n        onSectorProgress={handleSectorProgress}'.replace('\\n', '\n'), 'Conexión sector ' + n);
  has(reader, "useTomo02LegacySectorProgress('" + n + "'", 'Registro sector ' + n);
  has(reader, 'onSectorProgress?:', 'Firma sector ' + n);
  if (i === 0) {
    has(reader, 'const setTestScore = recorder.setTestScore', 'Evaluación sector 00');
    has(reader, 'const setIsMissionPassed = recorder.setMissionPassed', 'Misión sector 00');
  } else if (i < 5) {
    has(reader, 'recorder.setMissionPassed(true)', 'Misión sector ' + n);
    has(reader, 'recorder.setTestScore', 'Nota sector ' + n);
  } else {
    has(reader, 'onPassTest={recorder.setTestScore}', 'Nota sector ' + n);
    has(reader, 'onPracticeCompleted={() => recorder.setMissionPassed(true)}', 'Práctica sector ' + n);
    has(test, 'onPassTest?.(', 'Resultado de evaluación sector ' + n);
    has(mission, 'onPracticeCompleted?.()', 'Fin real de práctica sector ' + n);
  }
}
const passport = read(root + 'sector00/Tomo02Sector00MissionView.tsx');
no(passport, "edition: 'Windows 11 Pro'", 'No inventar versión');
no(passport, 'navigator.userAgent', 'No simular acceso WMI');
has(passport, 'sin lectura WMI/CIM', 'Origen declarado en pasaporte');
has(read(root + 'sector00/Tomo02Sector00View.tsx'), 'captured: false', 'No precargar baseline');
const boot = read(root + 'sector01/Tomo02Sector01MissionView.tsx');
has(boot, "status: 'WARNING' as const", 'Boot no verificado');
has(boot, 'Completá todos los campos observados', 'Campos obligatorios');
no(boot, "status: 'VALID'", 'No promover boot sin instrumentación');
console.log('PASS: ' + checks + ' comprobaciones estructurales de Tomo 02 (00–10).');
console.log('Pendiente independiente: TypeScript, build, interacciones reales y regresión Chromium.');
