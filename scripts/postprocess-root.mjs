/**
 * output: 'export' 构建后，把 out/index.html 替换为无依赖的静态跳转页，
 * 确保不带 JS 的客户端/爬虫访问 https://plazadelarevolucioncuba.com/ 时也能到达默认语言 /es。
 * 用法: npm run build（构建链自动执行）
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'out');

// 与 src/config.ts 保持一致
const BASE_URL = 'https://plazadelarevolucioncuba.com';
const DEFAULT_LOCALE = 'es';
const target = `/${DEFAULT_LOCALE}`;

const html = `<!DOCTYPE html>
<html lang="${DEFAULT_LOCALE}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Revolution Square (Plaza de la Revolución) - Havana, Cuba Visitor Guide</title>
<meta name="description" content="Discover Revolution Square (Plaza de la Revolución), the iconic landmark in Havana, Cuba. See the José Martí Memorial and Che Guevara portraits, plus location map, opening hours and travel tips."/>
<link rel="canonical" href="${BASE_URL}${target}"/>
<meta http-equiv="refresh" content="0; url=${target}"/>
<script>location.replace('${target}');</script>
</head>
<body>
<p>Redirecting to the Spanish version: <a href="${target}">Revolution Square (Plaza de la Revolución) - La Habana, Cuba</a>.</p>
<p>Español · <a href="${BASE_URL}/en">English</a> · <a href="${BASE_URL}/zh">中文</a></p>
</body>
</html>
`;

writeFileSync(join(outDir, 'index.html'), html, 'utf8');
console.log(`Root index.html -> static redirect to ${target}`);
