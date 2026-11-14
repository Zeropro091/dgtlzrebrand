// Verify the DGT.LZ hero: statue asset, size, and that the tagline is gone.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(2500);

  const facts = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="Classical marble statue"]');
    const cell = img ? img.parentElement : null;
    const cs = img ? getComputedStyle(img) : null;
    const b = img ? img.getBoundingClientRect() : null;
    const c = cell ? cell.getBoundingClientRect() : null;
    return {
      imgSrc: img && img.getAttribute('src'),
      natural: img ? [img.naturalWidth, img.naturalHeight] : null,
      objectFit: cs && cs.objectFit,
      renderedBox: b && [Math.round(b.width), Math.round(b.height)],
      cellBox: c && [Math.round(c.width), Math.round(c.height)],
      taglinePresent: /MENJALANKAN BISNIS/i.test(document.body.innerText),
      headline: (document.querySelector('h1') || {}).innerText,
    };
  });
  console.log(JSON.stringify(facts, null, 1));

  await page.screenshot({ path: 'C:/Users/Putu Ari/AppData/Local/hermes/cache/scratch/dgt-hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Putu Ari/AppData/Local/hermes/cache/scratch/dgt-hero-mobile.png' });
  await browser.close();
  console.log('screenshots ok');
})();
