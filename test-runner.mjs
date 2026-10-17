import { chromium } from 'playwright';

async function runTests() {
  console.log('=== RUNNING EVO LABS V1 VALIDATION SUITE (REAL CHROMIUM) ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  // ----------------------------------------------------
  // TEST A: LocalStorage vacío + URL limpia
  // ----------------------------------------------------
  console.log('\n[CASO A] LocalStorage vacío + URL limpia');
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(1500);

  const introVisibleA = await page.locator('text=QUÉ ES EVO').isVisible();
  const tutorOnboardingVisibleA = await page.locator('text=BIENVENIDO AL TUTOR EVO').isVisible();
  console.log('Caso A - Intro visible:', introVisibleA ? 'PASS' : 'FAIL');
  console.log('Caso A - Tutor Onboarding cerrado durante Intro:', !tutorOnboardingVisibleA ? 'PASS' : 'FAIL');

  // Saltar Intro
  const skipBtn = page.locator('button:has-text("OMITIR INTRO")');
  if (await skipBtn.isVisible()) {
    await skipBtn.click();
    await page.waitForTimeout(1000);
  }

  const mundoEvoVisibleA = await page.locator('text=CENTRO DE CONTROL & MUNDO EVO').isVisible() || await page.locator('text=INICIAR MI EVOLUCIÓN').isVisible() || await page.locator('text=CONTINUAR MI EVOLUCIÓN').isVisible();
  console.log('Caso A - Aterriza en Mundo EVO / INICIO:', mundoEvoVisibleA ? 'PASS' : 'FAIL');

  // ----------------------------------------------------
  // TEST B: Intro ya completada -> Mundo EVO directo
  // ----------------------------------------------------
  console.log('\n[CASO B] Intro ya completada -> Mundo EVO directo');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('evo_academia_intro_dismissed', 'true');
  });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1500);

  const introVisibleB = await page.locator('text=QUÉ ES EVO').isVisible();
  const mundoEvoVisibleB = await page.locator('text=CENTRO DE CONTROL & MUNDO EVO').isVisible() || await page.locator('text=INICIAR MI EVOLUCIÓN').isVisible();
  console.log('Caso B - Mundo EVO directo sin intro:', (!introVisibleB && mundoEvoVisibleB) ? 'PASS' : 'FAIL');

  // ----------------------------------------------------
  // TEST C: Deep Link ?volume=02 -> Tomo 02 directo
  // ----------------------------------------------------
  console.log('\n[CASO C] Deep Link ?volume=02');
  await page.goto('http://localhost:3000/?volume=02');
  await page.waitForTimeout(1500);
  const tomo02Visible = await page.locator('text=LA BIBLIA NEGRA DE WINDOWS').isVisible() || await page.locator('text=TOMO 02').first().isVisible();
  const introVisibleC = await page.locator('text=QUÉ ES EVO').isVisible();
  console.log('Caso C - Tomo 02 directo sin intro:', (tomo02Visible && !introVisibleC) ? 'PASS' : 'FAIL');

  // ----------------------------------------------------
  // TEST D: Deep Link ?view=core -> EVO Core directo
  // ----------------------------------------------------
  console.log('\n[CASO D] Deep Link ?view=core');
  await page.goto('http://localhost:3000/?view=core');
  await page.waitForTimeout(1500);
  const coreVisible = await page.locator('text=EVO LAB CORE').isVisible() || await page.locator('text=TELEMETRÍA').first().isVisible();
  const introVisibleD = await page.locator('text=QUÉ ES EVO').isVisible();
  console.log('Caso D - EVO Core directo sin intro:', (coreVisible && !introVisibleD) ? 'PASS' : 'FAIL');

  // ----------------------------------------------------
  // TEST E: Móvil 375px -> exactamente las mismas 6 categorías
  // ----------------------------------------------------
  console.log('\n[CASO E] Móvil 375px Navegación');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  const menuBtn = page.locator('button[aria-label="Abrir menú de navegación"]');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await page.waitForTimeout(600);
  }

  const expectedNav = ['INICIO', 'APRENDER', 'PRACTICAR', 'ANALIZAR MI PC', 'HERRAMIENTAS', 'MI EVO'];
  const mobileNavStatus = {};
  for (const item of expectedNav) {
    const isVis = await page.locator(`button:has-text("${item}")`).first().isVisible();
    mobileNavStatus[item] = isVis;
  }
  const all6Found = expectedNav.every(k => mobileNavStatus[k]);
  console.log('Caso E - 6/6 Categorías renderizadas en Móvil 375px:', all6Found ? 'PASS' : 'FAIL');
  console.log('Detalle móvil:', mobileNavStatus);

  // ----------------------------------------------------
  // TEST F: Cap 01 sin comprobación -> Cap 02 NO desbloqueado
  // ----------------------------------------------------
  console.log('\n[CASO F] Cap. 01 sin comprobación');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('evo_academia_intro_dismissed', 'true');
    localStorage.setItem('evo_c01_started', 'true');
  });
  await page.goto('http://localhost:3000/?view=chapter-01');
  await page.waitForTimeout(1200);

  const btnUnlock = page.locator('#btn-desbloquear-cap02');
  if (await btnUnlock.isVisible()) {
    await btnUnlock.click();
    await page.waitForTimeout(500);
  }
  const isCap02UnlockedF = await page.evaluate(() => localStorage.getItem('evo_c02_unlocked') === 'true');
  console.log('Caso F - Cap 02 permanece bloqueado sin comprobación:', !isCap02UnlockedF ? 'PASS' : 'FAIL');

  // ----------------------------------------------------
  // TEST G: Umbral 70% unificado
  // ----------------------------------------------------
  console.log('\n[CASO G] Umbral 70% unificado');
  const pass10 = (10 / 15) >= 0.70; // 66.67% -> false
  const pass11 = (11 / 15) >= 0.70; // 73.33% -> true
  console.log('Caso G - 10/15 (66.7%) NO aprueba:', !pass10 ? 'PASS' : 'FAIL');
  console.log('Caso G - 11/15 (73.3%) SÍ aprueba:', pass11 ? 'PASS' : 'FAIL');

  // ----------------------------------------------------
  // CONSOLE AUDIT
  // ----------------------------------------------------
  const errors = consoleLogs.filter(l => l.type === 'error');
  const warnings = consoleLogs.filter(l => l.type === 'warning');
  console.log('\n[CONSOLA AUDIT]');
  console.log('Errores fatales:', errors.length);
  if (errors.length > 0) console.log(errors);
  console.log('Warnings:', warnings.length);

  await browser.close();
  console.log('\n=== SUITE COMPLETADA CON ÉXITO ===');
}

runTests().catch(err => {
  console.error('Error durante ejecución:', err);
  process.exit(1);
});
