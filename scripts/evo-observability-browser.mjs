/** Actual React/WorldMap + Chromium. HTTP fixtures are labelled TEST, not Windows capture evidence. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { chromium } from 'playwright';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = process.env.EOE_BROWSER_OUTPUT || fs.mkdtempSync(path.join(os.tmpdir(), 'eoe-browser-'));
fs.mkdirSync(output, { recursive: true });
await build({ stdin: { resolveDir: root, loader: 'tsx', contents: `import React from 'react';import {createRoot} from 'react-dom/client';import {EvoWorldMap} from './src/components/world/EvoWorldMap';import {EvoAccessProvider} from './src/auth/EvoAccessContext';import {TutorEvoProvider,useTutorEvo} from './src/components/tutor/TutorEvoContext';function TutorProbe(){window.testTutor=useTutorEvo();return null;}import {localObservabilityEngine} from './src/observability/localEngine';import {METRICS} from './evo-agent/src/observabilityProtocol';import {EvoAgentClient} from './src/components/evoLabCore/services/evoAgentClient';window.testEngine=localObservabilityEngine;window.testClient=EvoAgentClient;window.testMetrics=METRICS;window.testRole='owner';const root=createRoot(document.getElementById('root'));let serial=0;window.testBack={current:null};window.testShow=()=>root.render(<EvoAccessProvider><TutorEvoProvider><TutorProbe/><EvoWorldMap key={++serial} passport={null} completedChaptersCount={0} onEnterZone={()=>{}} initialIntention="diagnosticar" subViewBackHandlerRef={window.testBack}/></TutorEvoProvider></EvoAccessProvider>);window.testShow();` },
  outfile: path.join(output, 'app.js'), bundle: true, format: 'esm', platform: 'browser', loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.webp': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"' }, alias: { components: root + '/src/components' }, plugins: [{ name: 'test-only-auth', setup(b) {
    b.onResolve({ filter: /EvoAuthProvider$/ }, () => ({ path: 'auth-fixture', namespace: 'test-fixture' }));
    b.onLoad({ filter: /.*/, namespace: 'test-fixture' }, () => ({ contents: `export const useEvoAuth=()=>({user:{uid:'TEST_USER'},emailVerified:true,isOwner:window.testRole==='owner',loading:false,signOut:async()=>{}});export const EvoAuthProvider=({children})=>children;`, loader: 'js' }));
  } }] });
const css = fs.readdirSync(path.join(root, 'dist/assets')).find(f => f.startsWith('index-') && f.endsWith('.css'));
const server = http.createServer((req, res) => {
  if (['/app.js', '/app.css'].includes(req.url)) { res.setHeader('Content-Type', req.url.endsWith('.js') ? 'text/javascript' : 'text/css'); res.end(fs.readFileSync(path.join(output, req.url.slice(1)))); }
  else if (req.url === '/styles.css') { res.setHeader('Content-Type', 'text/css'); res.end(fs.readFileSync(path.join(root, 'dist/assets', css))); }
  else { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/app.css"></head><body style="background:#10151b"><aside style="padding:8px;color:#e6d2a4;font:12px system-ui">PRUEBA DE NAVEGADOR · CONTRATO SINTÉTICO · NO ES CAPTURA WINDOWS REAL</aside><div id="root"></div><script type="module" src="/app.js"></script></body></html>'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
let page;
try {
  page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.route('https://**/*', route => route.abort());
  let mode = 'normal', sequence = 0, requests = 0, hasPaired = false;
  await page.route('http://127.0.0.1:43921/**', async route => {
    const request = route.request(), pathname = new URL(request.url()).pathname;
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (pathname === '/health') return json({ status: 'OK', version: '1.1.0', platform: 'win32', isWindows: true, pairingRequired: !hasPaired });
    if (pathname === '/v1/pair') { if (request.postDataJSON().code !== '123456') return json({ error: 'PAIRING_CODE_INVALID' }, 400); hasPaired = true; return json({ sessionToken: 'a'.repeat(64), expiresAt: new Date(Date.now() + 3600000).toISOString() }); }
    if (pathname === '/v1/pair/revoke') { hasPaired = false; return json({ status: 'REVOKED' }); }
    if (pathname !== '/v1/telemetry') return json({ error: 'NOT_FOUND' }, 404);
    requests++;
    assert.equal(request.headers()['x-evo-agent-token'], 'a'.repeat(64));
    if (mode === 'offline') return json({ error: 'TEST_CAPTURE_UNAVAILABLE' }, 503);
    const definitions = await page.evaluate(() => window.testMetrics);
    definitions['cpu.logical.0'] = { label: 'TEST procesador lógico', unit: '%', source: 'node:os.cpus/windows-logical-times-delta' };
    const timestampUtc = new Date().toISOString();
    const samples = Object.entries(definitions).map(([metricId, d]) => ({ sessionId: 'TEST-AGENT', metricId, timestampUtc, value: mode === 'missing' || metricId.includes('Latency') ? null : metricId === 'agent.rss' || metricId === 'memory.physical' ? 67108864 : 25, unit: d.unit, source: d.source, sampleIntervalMs: 1000, validity: mode === 'missing' || metricId.includes('Latency') ? 'UNKNOWN' : 'VALID', captureError: mode === 'missing' ? 'TEST_COUNTER_UNAVAILABLE' : metricId.includes('Latency') ? 'TEST_NO_COMPLETED_IO' : null, lost: false, late: false, agentVersion: '1.1.0', schemaVersion: '1.0' }));
    return json({ observability: { schemaVersion: '1.0', agentVersion: '1.1.0', sessionId: 'TEST-AGENT', sequence: ++sequence, timestampUtc, platform: 'win32', samples, processes: mode === 'missing' ? [] : [{ pid: 123, name: 'TEST_PROCESS', cpuPercent: 10, workingSetBytes: 4096 }], processError: mode === 'missing' ? 'TEST_PROCESS_COUNTER_UNAVAILABLE' : null } });
  });
  await page.addInitScript(() => { localStorage.setItem('evo_academia_intro_dismissed', 'true'); localStorage.setItem('evo_tutor_onboarding_dismissed_v1', 'true'); });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const open = () => page.getByRole('button', { name: /EVO LIVE TELEMETRY PRO →/ }).click();
  await open(); await page.getByRole('heading', { name: 'EVO Live Telemetry PRO', exact: true }).waitFor();
  assert.equal(requests, 0, 'Mount must not start collecting');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'PAIRING_REQUIRED' }).waitFor();
  assert.equal(requests, 0, 'No protected request before pairing');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.locator('[data-eoe-center]').screenshot({ path: path.join(output, `sin-agente-${width}.png`) });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.getByLabel('Código local del agente').fill('000000'); await page.getByRole('button', { name: 'Emparejar', exact: true }).click();
  await page.locator('[data-eoe-connection]').filter({ hasText: 'PAIRING_CODE_INVALID' }).waitFor();
  await page.getByLabel('Código local del agente').fill('123456'); await page.getByRole('button', { name: 'Emparejar', exact: true }).click();
  await page.locator('[data-eoe-connection]').filter({ hasText: 'Emparejado con este origen' }).waitFor();
  assert.equal(await page.getByLabel('Código local del agente').inputValue(), '');
  await page.getByRole('button', { name: 'Perfil ligero / juegos', exact: true }).click();
  assert.equal(await page.getByLabel('Intervalo de captura').inputValue(), '5000'); assert.equal(await page.getByLabel('Intervalo de interfaz').inputValue(), '2000');
  await page.getByLabel('Intervalo de captura').selectOption('1000'); await page.getByLabel('Intervalo de interfaz').selectOption('500');
  await page.getByRole('button', { name: 'Reanudar captura', exact: true }).click();
  await page.waitForFunction(() => window.testEngine.snapshot().frames.some(f => f.samples.some(s => s.value === 25)), { timeout: 10000 });
  const cdp = await page.context().newCDPSession(page); await cdp.send('Performance.enable');
  const before = await cdp.send('Performance.getMetrics'), measuredStart = performance.now();
  await page.waitForFunction(() => window.testEngine.snapshot().frames.length >= 5);
  const after = await cdp.send('Performance.getMetrics'), measuredMs = performance.now() - measuredStart;
  const metrics = result => Object.fromEntries(result.metrics.map(m => [m.name, m.value]));
  const bm = metrics(before), am = metrics(after);
  fs.writeFileSync(path.join(output, 'browser-benchmark.json'), JSON.stringify({ scope: 'Chromium main-thread TaskDuration and JS heap during TEST HTTP fixture, not OS CPU or real Windows capture', viewport: '1440x1100', durationMs: measuredMs, taskDurationDeltaSeconds: am.TaskDuration - bm.TaskDuration, mainThreadTaskDutyPercent: (am.TaskDuration - bm.TaskDuration) / (measuredMs / 1000) * 100, jsHeapBeforeBytes: bm.JSHeapUsedSize, jsHeapAfterBytes: am.JSHeapUsedSize, captureIntervalMs: 1000, renderIntervalMs: 500 }, null, 2));
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  const count = requests; await page.waitForTimeout(1200); assert.equal(requests, count, 'Pause must stop requests');
  await page.getByRole('button', { name: 'Análisis técnico', exact: true }).click(); await page.getByText('TEST_PROCESS', { exact: true }).waitFor();
  await page.getByLabel('Métrica del gráfico').selectOption('disk.readLatency'); assert.match(await page.locator('.eoe-inspection').innerText(), /UNKNOWN/);
  await page.getByLabel('Métrica del gráfico').selectOption('cpu.total'); await page.getByLabel('Ventana del gráfico').selectOption('30');
  assert.equal(await page.getByLabel('Inspeccionar muestra').count(), 1);
  await page.locator('[data-eoe-center]').evaluate(el => { const banner = document.createElement('strong'); banner.dataset.testBanner = 'true'; banner.textContent = 'PRUEBA DE CONTRATO · DATOS SINTÉTICOS · NO ES CAPTURA WINDOWS'; banner.style.cssText = 'padding:12px;border:1px solid #9c8860;color:#edcf98;font-size:13px'; el.prepend(banner); });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1100 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('[data-eoe-center]').screenshot({ path: path.join(output, `contrato-test-${width}.png`) });
  }
  await page.locator('[data-test-banner]').evaluate(el => el.remove());
  const downloaded = page.waitForEvent('download'); await page.getByRole('button', { name: 'Exportar JSON', exact: true }).click();
  const download = await downloaded; await download.saveAs(path.join(output, 'test-session.json'));
  const session = JSON.parse(fs.readFileSync(path.join(output, 'test-session.json'), 'utf8')); assert.ok(session.frames.length >= 5); assert.ok(!JSON.stringify(session).includes('a'.repeat(64)));
  mode = 'missing'; await page.getByRole('button', { name: 'Reanudar captura', exact: true }).click();
  await page.getByText('TEST_COUNTER_UNAVAILABLE', { exact: true }).first().waitFor();
  assert.equal(await page.evaluate(() => window.testEngine.snapshot().frames.at(-1).samples.every(s => s.value === null)), true);
  await page.getByLabel('Métrica del gráfico').selectOption('cpu.logical.0');
  mode = 'offline'; await page.getByRole('alert').filter({ hasText: 'TELEMETRY_HTTP_503' }).waitFor();
  assert.equal(await page.getByLabel('Métrica del gráfico').inputValue(), 'cpu.logical.0');
  assert.match(await page.locator('.eoe-inspection').innerText(), /UNKNOWN/);
  mode = 'normal'; await page.waitForFunction(() => window.testEngine.snapshot().phase === 'running' && window.testEngine.snapshot().error === null, { timeout: 10000 });
  await page.getByRole('button', { name: 'Laboratorio experto', exact: true }).click(); assert.equal(await page.locator('.eoe-cost').getAttribute('open'), '');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  assert.equal(await page.evaluate(() => window.testEngine.snapshot().running), false);
  await page.evaluate(() => Object.defineProperty(document, 'hidden', { configurable: true, value: false }));
  await page.getByRole('button', { name: 'Examinar evidencia con Tutor EVO', exact: true }).click();
  assert.ok((await page.evaluate(() => window.testTutor.currentLocation.whyItMatters)).includes('Una observación de utilización no demuestra'));
  assert.equal(await page.evaluate(() => window.testTutor.isTutorOpen), true);
  // The shared host Back handler must close the new subview and keep diagnosis reachable.
  assert.equal(await page.evaluate(() => window.testBack.current()), true);
  await page.locator('[data-eoe-center]').waitFor({ state: 'detached' });
  await open(); await page.getByRole('button', { name: 'Volver a diagnóstico', exact: true }).click(); assert.equal(await page.locator('[data-eoe-center]').count(), 0);
  // Existing commercial policy: FREE users cannot export telemetry through the new center.
  await page.evaluate(() => { window.testRole = 'free'; window.testShow(); }); await open();
  let unauthorizedDownloads = 0; const onDownload = () => unauthorizedDownloads++; page.on('download', onDownload);
  await page.getByRole('button', { name: 'Exportar CSV', exact: true }).click(); await page.waitForTimeout(200);
  assert.equal(unauthorizedDownloads, 0); assert.ok((await page.locator('body').innerText()).includes('Exportación de telemetría'));
  page.off('download', onDownload);
  assert.deepEqual(errors, []);
  console.log('PASS: actual WorldMap integration, explicit pairing, no automatic capture, quick/technical/expert, intervals/light profile, pause/resume, UNKNOWN counters, disconnect/reconnect, local export and FREE denial, Tutor evidence, Back and 1440/390 responsive layouts.');
  console.log('TEST contract fixture only; Windows real capture NOT verified. Artifacts: ' + output);
} catch (error) {
  if (page) { fs.writeFileSync(path.join(output, 'failure.txt'), await page.locator('body').innerText().catch(() => 'No body')); await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => undefined); }
  throw error;
} finally { await browser.close(); await new Promise(r => server.close(r)); }
