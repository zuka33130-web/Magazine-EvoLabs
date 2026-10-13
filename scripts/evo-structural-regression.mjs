import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalCount = 0;
let passCount = 0;
let failCount = 0;
let skipCount = 0;

function logResult(status, title, description) {
  totalCount++;
  if (status === 'PASS') {
    passCount++;
    console.log(`\x1b[32m[PASS]\x1b[0m ${title}: ${description}`);
  } else if (status === 'FAIL') {
    failCount++;
    console.error(`\x1b[31m[FAIL]\x1b[0m ${title}: ${description}`);
  } else if (status === 'SKIP') {
    skipCount++;
    console.log(`\x1b[33m[SKIP]\x1b[0m ${title}: ${description}`);
  }
}

function verifyFileExists(relPath, testTitle) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    logResult('PASS', testTitle, `Archivo verificado en '${relPath}'`);
    return true;
  } else {
    logResult('FAIL', testTitle, `Archivo NO encontrado en '${relPath}'`);
    return false;
  }
}

function verifyFileContains(relPath, searchStr, testTitle) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    logResult('FAIL', testTitle, `Archivo NO existe para inspección: '${relPath}'`);
    return false;
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes(searchStr)) {
    logResult('PASS', testTitle, `Referencia esperada encontrada en '${relPath}'`);
    return true;
  } else {
    logResult('FAIL', testTitle, `Falta la referencia '${searchStr}' en '${relPath}'`);
    return false;
  }
}

function verifyFileMatches(relPath, regex, testTitle) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    logResult('FAIL', testTitle, `Archivo NO existe para inspección: '${relPath}'`);
    return false;
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  if (regex.test(content)) {
    logResult('PASS', testTitle, `Patrón verificado en '${relPath}'`);
    return true;
  } else {
    logResult('FAIL', testTitle, `El contenido de '${relPath}' no coincide con el patrón esperado`);
    return false;
  }
}

console.log('================================================================');
console.log(' EVO LABS // SISTEMA DE PRUEBAS DE REGRESIÓN ESTRUCTURAL');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. TOMOS 01–12
// -----------------------------------------------------------------------------
console.log('>>> [MÓDULO 1] VERIFICACIÓN ESTRUCTURAL DE TOMOS 01 A 12');

verifyFileExists('src/data/evoCatalog.ts', 'TOMOS - Canónico (evoCatalog.ts)');
verifyFileExists('src/utils/evoTomeTargetRouter.ts', 'TOMOS - Enrutador (evoTomeTargetRouter.ts)');

for (let i = 1; i <= 12; i++) {
  const numStr = String(i).padStart(2, '0');
  verifyFileContains('src/data/evoCatalog.ts', `tomoNumber: '${numStr}'`, `TOMOS - Definición en Catálogo Tomo ${numStr}`);
  
  if (i === 1) {
    verifyFileExists('src/components/tomo01/EvoTomo01FinalExam.tsx', `TOMOS - Componente Tomo 01 (EvoTomo01FinalExam.tsx)`);
  } else {
    const componentPath = `src/components/tomo${numStr}/Tomo${numStr}MasterPage.tsx`;
    const dataPath = `src/data/tomo${numStr}Data.ts`;
    verifyFileExists(componentPath, `TOMOS - Componente Principal Tomo ${numStr}`);
    verifyFileExists(dataPath, `TOMOS - Datos del Tomo ${numStr}`);
  }
}

// -----------------------------------------------------------------------------
// 2. CATÁLOGO DE LABORATORIOS Y SUS DESTINOS
// -----------------------------------------------------------------------------
console.log('\n>>> [MÓDULO 2] VERIFICACIÓN DE LABORATORIOS Y COMPONENTES ASOCIADOS');

verifyFileExists('src/components/public/EvoPublicLabsCatalog.tsx', 'LABS - Catálogo Público de Laboratorios');
verifyFileExists('src/components/world/labs/EvoMasterLabSuite.tsx', 'LABS - Suite Maestra de Laboratorios');
verifyFileExists('src/components/world/labs/EvoLabConsole.tsx', 'LABS - Consola Interactiva de Laboratorio');
verifyFileExists('src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx', 'LABS - Windows Matrix Lab');

const labComponents = [
  'src/components/world/labs/Lab01CentralIncidentes.tsx',
  'src/components/world/labs/Lab02TallerRendimiento.tsx',
  'src/components/world/labs/Lab03ArchivoEvo.tsx',
  'src/components/world/labs/Lab04CamaraExperimentos.tsx',
  'src/components/world/labs/Lab05SalaMaquinas.tsx',
  'src/components/world/labs/Lab06ZonaRestringida.tsx',
  'src/components/world/labs/Lab07MiLaboratorio.tsx',
  'src/components/world/labs/Lab08ComunidadEvo.tsx',
  'src/components/labs/tomo05/EvoNetworkForensicsLab.tsx',
  'src/components/labs/tomo06/EvoDefensiveSecurityLab.tsx',
  'src/components/labs/tomo07/EvoPerformanceMetrologyLab.tsx',
  'src/components/labs/tomo09/EvoCodeEngineeringLab.tsx',
  'src/components/labs/tomo10/EvoAiSystemsLab.tsx'
];

labComponents.forEach((path) => {
  const name = path.split('/').pop();
  verifyFileExists(path, `LABS - Destino Registrado: ${name}`);
});

// -----------------------------------------------------------------------------
// 3. HERRAMIENTAS Y DESTINOS REGISTRADOS
// -----------------------------------------------------------------------------
console.log('\n>>> [MÓDULO 3] VERIFICACIÓN DE HERRAMIENTAS Y ROUTER CANÓNICO');

verifyFileExists('src/data/evoToolsData.ts', 'HERRAMIENTAS - Base de Datos Canónica');
verifyFileExists('src/utils/evoToolRouter.ts', 'HERRAMIENTAS - Router Canónico executeToolById');

const toolViews = [
  'src/components/tools/EvoBottleneckSimulatorView.tsx',
  'src/components/tools/EvoBsodRepairView.tsx',
  'src/components/tools/EvoLatencyCalculator.tsx',
  'src/components/tools/EvoPcBuildArchitect.tsx',
  'src/components/tools/EvoWindowsErrorAnalyzerView.tsx'
];

toolViews.forEach((path) => {
  const name = path.split('/').pop();
  verifyFileExists(path, `HERRAMIENTAS - Componente de Vista: ${name}`);
});

// -----------------------------------------------------------------------------
// 4. ANALIZAR MI PC
// -----------------------------------------------------------------------------
console.log('\n>>> [MÓDULO 4] VERIFICACIÓN DE ANALIZAR MI PC Y LAB CORE');

verifyFileExists('src/components/evoLabCore/EvoLabCore.tsx', 'ANALIZAR MI PC - Motor Principal EvoLabCore');
verifyFileExists('src/components/world/EvoQuickSearchBar.tsx', 'ANALIZAR MI PC - Buscador Rápido');
verifyFileExists('src/components/world/EvoSectorWorkstationModal.tsx', 'ANALIZAR MI PC - Modal Estación de Trabajo');

// -----------------------------------------------------------------------------
// 5. MI EVO
// -----------------------------------------------------------------------------
console.log('\n>>> [MÓDULO 5] VERIFICACIÓN DE MI EVO');

verifyFileExists('src/components/world/labs/Lab07MiLaboratorio.tsx', 'MI EVO - Mi Laboratorio Personal');
verifyFileExists('src/components/public/EvoPublicAprenderHub.tsx', 'MI EVO - Hub de Aprendizaje');

// -----------------------------------------------------------------------------
// 6. PLANES
// -----------------------------------------------------------------------------
console.log('\n>>> [MÓDULO 6] VERIFICACIÓN DE PLANES Y PRECIOS');

verifyFileExists('src/data/evoPricing.ts', 'PLANES - Estructura de Precios Canónica');
verifyFileExists('src/components/public/EvoPublicPricing.tsx', 'PLANES - Vista Pública de Precios');

// -----------------------------------------------------------------------------
// 7. AUTENTICACIÓN Y CONTROL DE ACCESO
// -----------------------------------------------------------------------------
console.log('\n>>> [MÓDULO 7] VERIFICACIÓN DE AUTENTICACIÓN Y PERMISOS');

verifyFileExists('src/auth/EvoAccessContext.tsx', 'AUTH - Contexto de Acceso');
verifyFileExists('src/auth/EvoAuthProvider.tsx', 'AUTH - Proveedor de Autenticación');
verifyFileExists('src/services/firebase.ts', 'AUTH - Cliente Firebase');
verifyFileExists('src/data/evoOwnershipMap.ts', 'AUTH - Mapa de Propiedad y Permisos');

// -----------------------------------------------------------------------------
// 8. TOMO 02: SEIS LABORATORIOS INTERNOS EN EvoWindowsMatrixLab
// -----------------------------------------------------------------------------
console.log('\n>>> [MÓDULO 8] VERIFICACIÓN DE LOS 6 LABS INTERNOS DE TOMO 02 EN EvoWindowsMatrixLab');

verifyFileExists('src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx', 'TOMO 02 - EvoWindowsMatrixLab.tsx');
verifyFileContains('src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx', 'WindowsBootExperienceLab', 'TOMO 02 - Importación de Boot Lab');
verifyFileContains('src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx', 'WindowsInstallExperienceLab', 'TOMO 02 - Importación de Install Lab');
verifyFileContains('src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx', 'WindowsServicesTelemetryLab', 'TOMO 02 - Importación de Telemetry & Services Lab');
verifyFileContains('src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx', 'WindowsFailureRepairLab', 'TOMO 02 - Importación de Failure & Repair Lab');
verifyFileContains('src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx', 'EvoWindowsXRayLab', 'TOMO 02 - Importación de X-Ray Lab');
verifyFileContains('src/components/world/labs/windowsMatrix/EvoWindowsMatrixLab.tsx', "deepLabSubTab === 'scheduler'", 'TOMO 02 - Sub-laboratorio Scheduler Híbrido Integrado');

// -----------------------------------------------------------------------------
// 9. LABORATORIO DE SERVICIOS Y TELEMETRÍA (WindowsServicesTelemetryLab)
// -----------------------------------------------------------------------------
console.log('\n>>> [MÓDULO 9] VERIFICACIÓN DE WindowsServicesTelemetryLab Y servicesData.ts');

verifyFileExists('src/components/world/labs/windowsMatrix/services/WindowsServicesTelemetryLab.tsx', 'SERVICES LAB - WindowsServicesTelemetryLab.tsx');
verifyFileExists('src/components/world/labs/windowsMatrix/data/servicesData.ts', 'SERVICES LAB - Catálogo servicesData.ts');

verifyFileContains('src/components/world/labs/windowsMatrix/data/servicesData.ts', 'WINDOWS_SERVICES_DATABASE', 'SERVICES DATA - Exportación WINDOWS_SERVICES_DATABASE');
verifyFileContains('src/components/world/labs/windowsMatrix/data/servicesData.ts', 'WINDOWS_SERVICE_CATEGORIES', 'SERVICES DATA - Exportación WINDOWS_SERVICE_CATEGORIES');
verifyFileContains('src/components/world/labs/windowsMatrix/services/WindowsServicesTelemetryLab.tsx', "from '../data/servicesData'", 'SERVICES LAB - Conexión de Datos entre Lab y Catálogo');

// -----------------------------------------------------------------------------
// SKIPPED CHECKS JUSTIFICADOS (COMPATIBILIDAD CON ARQUITECTURA ACTUAL)
// -----------------------------------------------------------------------------
logResult('SKIP', 'COMPATIBILIDAD - Ruta antigua Tomo 01 Legacy (reemplazada)', 'Tomo 01 utiliza el flujo moderno EvoTomo01FinalExam y data canónica.');

// -----------------------------------------------------------------------------
// RESUMEN FINAL
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(' RESUMEN DE REGRESIÓN ESTRUCTURAL');
console.log('================================================================');
console.log(` TOTAL DE PRUEBAS EJECUTADAS : ${totalCount}`);
console.log(` PASARON                     : ${passCount}`);
console.log(` FALLARON                    : ${failCount}`);
console.log(` OMITIDAS / SKIPPED          : ${skipCount}`);
console.log('================================================================');

if (failCount > 0) {
  console.error('\n\x1b[31m[RESULTADO] FALLO ESTRUCTURAL DETECTADO EN EL PROYECTO.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\n\x1b[32m[RESULTADO] TODAS LAS VERIFICACIONES ESTRUCTURALES PASARON EXITOSAMENTE.\x1b[0m\n');
  process.exit(0);
}
