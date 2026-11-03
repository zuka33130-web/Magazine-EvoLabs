import { chromium } from 'playwright';

async function auditMagazine() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 1800 }
  });

  await page.goto('http://localhost:3000/?mode=magazine', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const results = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.a4-magazine-page'));
    return pages.map((el, index) => {
      const pageId = el.id || `page-${index + 1}`;
      const clientH = el.clientHeight;
      const scrollH = el.scrollHeight;
      const clientW = el.clientWidth;
      const scrollW = el.scrollWidth;

      const pageRect = el.getBoundingClientRect();
      const allChildren = Array.from(el.querySelectorAll('*'));
      
      let overflowBottomCount = 0;
      let maxBottomOverflow = 0;
      let overflowingElements = [];

      allChildren.forEach(child => {
        const r = child.getBoundingClientRect();
        if (r.bottom > pageRect.bottom + 1) {
          overflowBottomCount++;
          const diff = r.bottom - pageRect.bottom;
          if (diff > maxBottomOverflow) maxBottomOverflow = diff;
          if (overflowingElements.length < 3) {
            overflowingElements.push({
              tag: child.tagName,
              class: child.className?.slice ? child.className.slice(0, 50) : '',
              text: child.innerText?.slice(0, 40) || '',
              overflowPx: Math.round(diff)
            });
          }
        }
      });

      // Collect fonts used in this page
      const fontsUsed = new Set();
      allChildren.forEach(child => {
        const computed = window.getComputedStyle(child);
        const ff = computed.fontFamily;
        if (ff) {
          if (ff.includes('Epilogue')) fontsUsed.add('Epilogue');
          if (ff.includes('Plus Jakarta Sans')) fontsUsed.add('Plus Jakarta Sans');
          if (ff.includes('JetBrains Mono')) fontsUsed.add('JetBrains Mono');
          if (ff.includes('Inter')) fontsUsed.add('Inter');
          if (ff.includes('Roboto')) fontsUsed.add('Roboto');
          if (ff.includes('sans-serif') && !ff.includes('Plus Jakarta Sans')) fontsUsed.add('generic-sans');
        }
      });

      return {
        pageIndex: index + 1,
        pageId,
        clientH,
        scrollH,
        isScrollOverflow: scrollH > clientH,
        overflowPx: scrollH - clientH,
        maxBottomOverflow: Math.round(maxBottomOverflow),
        overflowingElements,
        fonts: Array.from(fontsUsed)
      };
    });
  });

  console.log('AUDIT SUMMARY — TOTAL PAGES FOUND:', results.length);
  const overflowingPages = results.filter(r => r.isScrollOverflow || r.maxBottomOverflow > 2);
  console.log('PAGES WITH OVERFLOW / CLIPPING (' + overflowingPages.length + '):');
  overflowingPages.forEach(p => {
    console.log(`Page ${p.pageIndex} (${p.pageId}): scrollDiff=${p.overflowPx}px, maxBottomOverflow=${p.maxBottomOverflow}px`);
    if (p.overflowingElements.length) {
      console.log('   Sample culprits:', JSON.stringify(p.overflowingElements));
    }
  });

  console.log('\nFONTS DETECTED ACROSS ALL PAGES:');
  const allFonts = new Set();
  results.forEach(r => r.fonts.forEach(f => allFonts.add(f)));
  console.log(Array.from(allFonts));

  await browser.close();
}

auditMagazine().catch(console.error);
