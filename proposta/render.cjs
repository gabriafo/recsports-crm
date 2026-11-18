// Gera os PDFs da proposta a partir dos HTMLs (Playwright/Chromium).
// Uso: node render.cjs [arquivo.html ...]
const { chromium } = require('playwright');
const path = require('node:path');

const dir = __dirname;
const files = process.argv.slice(2).length ? process.argv.slice(2)
  : ['proposta-completa.html', 'proposta-resumida.html', 'proposta-comercial.html'];

(async () => {
const browser = await chromium.launch();
const page = await browser.newPage();
let failed = false;
for (const f of files) {
  await page.goto('file://' + path.join(dir, f));
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.$$eval('.page', ps => ps.map((p, i) => {
    const over = p.scrollHeight - p.clientHeight;
    const pad = p.querySelector('.pad');
    const grow = pad ? [...pad.querySelectorAll(':scope > .grow')].reduce((a, g) => a + g.getBoundingClientRect().height, 0) : 0;
    return { page: i + 1, over, free: Math.round(grow) };
  }));
  for (const o of overflow) {
    const flag = o.over > 0 ? `  <-- OVERFLOW ${o.over}px` : '';
    if (o.over > 0) failed = true;
    console.log(`${f} p${o.page}: free ${o.free}px${flag}`);
  }
  const out = path.join(dir, 'pdf', f.replace(/\.html$/, '.pdf'));
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
  console.log('->', out);
}
await browser.close();
process.exit(failed ? 1 : 0);
})();
