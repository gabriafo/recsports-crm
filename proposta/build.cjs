// Gera a proposta a partir de src/:
//  1. HTMLs autocontidos (CSS e fontes embutidos) em proposta/*.html
//  2. PDFs A4 em proposta/pdf/*.pdf, renderizados a partir desses HTMLs
// Uso: node proposta/build.cjs [proposta-completa.html ...]
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const dir = __dirname;
const src = path.join(dir, 'src');
const files = process.argv.slice(2).length ? process.argv.slice(2)
  : ['proposta-completa.html', 'proposta-resumida.html', 'proposta-comercial.html'];

// CSS com as fontes convertidas em data URI
const css = fs.readFileSync(path.join(src, 'style.css'), 'utf8')
  .replace(/url\('fonts\/([^']+\.woff2)'\)/g, (_, f) =>
    `url('data:font/woff2;base64,${fs.readFileSync(path.join(src, 'fonts', f)).toString('base64')}')`);

// Em telas estreitas (celular), reduz a página A4 para caber na largura sem rolagem lateral
const FIT_SCRIPT = `<script>
(function () {
  function fit() {
    var w = document.documentElement.clientWidth, a4 = 794 + 24;
    document.body.style.zoom = w < a4 ? String(w / a4) : '';
  }
  fit(); addEventListener('resize', fit);
})();
</script>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let failed = false;
  for (const f of files) {
    const html = fs.readFileSync(path.join(src, f), 'utf8')
      .replace('<link rel="stylesheet" href="style.css">', `<style>\n${css}\n</style>`)
      .replace('</body>', `${FIT_SCRIPT}\n</body>`);
    if (!html.includes('<style>')) throw new Error(`${f}: link para style.css não encontrado`);
    const standalone = path.join(dir, f);
    fs.writeFileSync(standalone, html);

    await page.goto('file://' + standalone);
    await page.evaluate(() => document.fonts.ready);
    const pages = await page.$$eval('.page', ps => ps.map((p, i) => {
      const pad = p.querySelector('.pad');
      const free = pad ? [...pad.querySelectorAll(':scope > .grow')]
        .reduce((a, g) => a + g.getBoundingClientRect().height, 0) : 0;
      return { n: i + 1, over: p.scrollHeight - p.clientHeight, free: Math.round(free) };
    }));
    for (const p of pages) {
      if (p.over > 0) failed = true;
      console.log(`${f} p${p.n}: livre ${p.free}px${p.over > 0 ? `  <-- ESTOURO ${p.over}px` : ''}`);
    }
    const out = path.join(dir, 'pdf', f.replace(/\.html$/, '.pdf'));
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    console.log('->', path.relative(dir, standalone), '+', path.relative(dir, out));
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
