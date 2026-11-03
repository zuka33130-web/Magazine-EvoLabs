import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function generateTomo01Pdf() {
  console.log('Iniciando generación de PDF Tomo 01...');
  const outDir = path.resolve(process.cwd(), 'public/magazines/tomo01');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'EVO-LABS-TOMO-01-CONOCE-TU-PC.pdf');

  const execPath = fs.existsSync('/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell')
    ? '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell'
    : undefined;

  const browser = await chromium.launch({
    headless: true,
    executablePath: execPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 1800 }
  });

  console.log('Navegando a http://localhost:3000/?mode=magazine ...');
  await page.goto('http://localhost:3000/?mode=magazine', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Wait for all 46 pages to be in the DOM
  console.log('Esperando carga completa de páginas...');
  await page.waitForSelector('#magazine-continuous-stack', { timeout: 30000 });
  await page.waitForSelector('#magazine-page-46', { timeout: 30000 });

  // Wait for fonts
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });

  // Short pause to ensure all images and SVG vectors finish rendering
  await page.waitForTimeout(2000);

  console.log('Generando archivo PDF A4...');
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    },
    preferCSSPageSize: true
  });

  const stats = fs.statSync(outPath);
  console.log(`PDF generado exitosamente en: ${outPath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);

  // Also create alias with secondary name for compatibility
  const altPath = path.join(outDir, 'EVO-LABS-MAGAZINE-TOMO-01-CONOCE-TU-PC.pdf');
  fs.copyFileSync(outPath, altPath);

  await browser.close();
}

generateTomo01Pdf().catch((err) => {
  console.error('Error generando PDF:', err);
  process.exit(1);
});
