/**
 * 三语 (zh/en/es) 消息 JSON 校验：
 *  1. 顶层叶子键完全同构
 *  2. 对应数组长度一致
 * 用法: node scripts/check-i18n.mjs
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, '..', 'src', 'messages');
const files = ['zh.json', 'en.json', 'es.json'];

function parse(file) {
  return JSON.parse(readFileSync(join(messagesDir, file), 'utf8'));
}

function leafKeys(obj, prefix = '') {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...leafKeys(v, path));
    } else if (!Array.isArray(v)) {
      keys.push(path);
    }
  }
  return keys.sort();
}

function arrayLengths(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) {
      out.push(`${path}:${v.length}`);
    } else if (v && typeof v === 'object') {
      out.push(...arrayLengths(v, path));
    }
  }
  return out.sort();
}

const parsed = files.map((f) => parse(f));
const [zh, en, es] = parsed;

let failed = false;
const baseLeaves = leafKeys(zh);

for (let i = 0; i < parsed.length; i++) {
  const otherLeaves = leafKeys(parsed[i]);
  const missing = baseLeaves.filter((k) => !otherLeaves.includes(k));
  const extra = otherLeaves.filter((k) => !baseLeaves.includes(k));
  if (missing.length) {
    failed = true;
    console.log(`[${files[i]}] MISSING keys:`);
    missing.forEach((k) => console.log('  - ' + k));
  }
  if (extra.length) {
    failed = true;
    console.log(`[${files[i]}] EXTRA keys:`);
    extra.forEach((k) => console.log('  + ' + k));
  }
}

const baseArrays = arrayLengths(zh);
const arrayReports = [en, es].map((obj) => arrayLengths(obj));
const compared = [en, es];
for (let i = 0; i < compared.length; i++) {
  const other = arrayReports[i];
  for (const entry of baseArrays) {
    if (!other.includes(entry)) {
      const [path, len] = entry.split(':');
      failed = true;
      console.log(`[${files[i + 1]}] length mismatch at "${path}" (zh=${len}, other has ${other.find((x) => x.startsWith(path + ':'))?.split(':')[1] ?? 'n/a'})`);
    }
  }
}

if (failed) {
  console.log('\nFAIL: keys/lengths not in parity.');
  process.exit(1);
}
console.log('PASS: zh/en/es messages key & list-length parity OK.');
