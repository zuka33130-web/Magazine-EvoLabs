import { chromium } from 'playwright';

async function auditPrintMedia() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print' });
  await page.goto('http://localhost:3000/?mode=magazine', { waitUntil: 'networkidle' });
  await page.waitForSelector('.a4-magazine-page', { timeout: 15000 });
  await page.waitForTimeout(2000);

  const pages = await page.$$eval('.a4-magazine-page', els => els.map((el, i) => {
    const pageRect = el.getBoundingClientRect();
    const children = Array.from(el.querySelectorAll('*'));
    let maxOverflow = 0;
    children.forEach(c => {
      const cr = c.getBoundingClientRect();
      if (cr.bottom > pageRect.bottom + 1) {
        const d = cr.bottom - pageRect.bottom;
        if (d > maxOverflow) maxOverflow = d;
      }
    });

    return {
      page: i + 1,
      id: el.id,
      heightPx: Math.round(el.clientHeight),
      scrollHeightPx: Math.round(el.scrollHeight),
      diff: Math.round(el.scrollHeight - el.clientHeight),
      maxOverflow: Math.round(maxOverflow)
    };
  }));

  console.log('PRINT EMULATION AUDIT — TOTAL PAGES:', pages.length);
  const overflow = pages.filter(p => p.diff > 2 || p.maxOverflow > 2);
  console.log('PAGES WITH OVERFLOW IN PRINT:', overflow.length);
  if (overflow.length) {
    console.log(overflow);
  }
  await browser.close();
}

auditPrintMedia().catch(console.error);
