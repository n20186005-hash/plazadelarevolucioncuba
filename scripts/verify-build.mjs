/**
 * 校验静态导出产物关键 SEO 点（在 npm run build 后运行）
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'out');

let failed = false;
function check(name, ok, extra = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${name}${extra ? ' | ' + extra : ''}`);
  if (!ok) failed = true;
}

for (const loc of ['zh', 'en', 'es']) {
  const file = join(out, `${loc}.html`);
  if (!existsSync(file)) {
    check(`${loc} homepage html exists`, false);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const ldBlocks = (html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []).map(
    (b) => b.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>$/, '')
  );
  const parsed = ldBlocks.map((b) => JSON.parse(b));
  const types = parsed.map((o) => (o['@graph'] ? 'graph' : o['@type']));

  check(`${loc} jsonld block count === 3`, ldBlocks.length === 3, `got ${ldBlocks.length}`);
  const graph = parsed.find((o) => o['@graph']);
  const typesInGraph = graph ? graph['@graph'].map((n) => JSON.stringify(n['@type'])) : [];
  check(`${loc} graph has TouristAttraction`, typesInGraph.some((t) => t.includes('TouristAttraction')), typesInGraph.join(','));
  const attr = graph?.['@graph']?.find?.((n) => JSON.stringify(n['@type']).includes('TouristAttraction'));
  check(`${loc} TouristAttraction aggregateRating 4.5/7333`, attr?.aggregateRating?.ratingValue === 4.5 && attr?.aggregateRating?.ratingCount === 7333);
  check(`${loc} TouristAttraction geo`, attr?.geo?.latitude === 23.1227066 && attr?.geo?.longitude === -82.3888396);
  check(`${loc} TouristAttraction sameAs maps link`, (attr?.sameAs || []).includes('https://maps.app.goo.gl/W8thrgWWbavuLXwa7'));
  check(`${loc} has hasMap`, !!attr?.hasMap);
  check(`${loc} canonical`, html.includes(`<link rel="canonical" href="https://plazadelarevolucioncuba.com/${loc}"/>`) || html.includes(`<link rel="canonical" href="https://plazadelarevolucioncuba.com/${loc}">`));
  check(`${loc} hreflang x-default`, html.includes('hrefLang="x-default"') || html.includes('hreflang="x-default"'));
  check(`${loc} og:image absolute`, html.includes('property="og:image" content="https://plazadelarevolucioncuba.com/gallery/revolution-square-1.jpg"'));
  check(`${loc} GA4 consent-gated`, html.includes('G-HXM22WWPKP') && html.includes('cookiePrefs'));
  check(`${loc} manifest link`, html.includes('/manifest.webmanifest'));
  check(`${loc} FAQ questions visible`, (html.match(/<summary/g) || []).length === 6);
  check(`${loc} sw registered`, html.includes("'/sw.js'") || html.includes('/sw.js'));
  const faqSchema = parsed.find((o) => o['@type'] === 'FAQPage');
  check(`${loc} FAQPage schema 6 items`, faqSchema?.mainEntity?.length === 6, `got ${faqSchema?.mainEntity?.length}`);
}

for (const f of ['robots.txt', 'sw.js', 'manifest.webmanifest', 'sitemap.xml', 'icons/icon.svg']) {
  check(`asset ${f}`, existsSync(join(out, f)));
}

// sitemap 内容
const sm = readFileSync(join(out, 'sitemap.xml'), 'utf8');
check('sitemap has 12 urls', (sm.match(/<loc>/g) || []).length === 12, `got ${(sm.match(/<loc>/g) || []).length}`);
check('sitemap x-default', sm.includes('hreflang="x-default"'));

if (failed) {
  console.log('\nVERIFY FAILED');
  process.exit(1);
}
console.log('\nALL CHECKS PASSED');
