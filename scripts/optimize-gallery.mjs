/**
 * 压缩 public/gallery 下全部 jpg：最长边 1600px、mozjpeg q82、渐进式。
 * 使用 tmp 文件 + renameSync 落盘，规避 Windows 写盘拦截 (errno -4094)。
 * 用法: npm run optimize:images
 */
import { readdirSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, '..', 'public', 'gallery');

const files = readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));
let savedBefore = 0;
let savedAfter = 0;

for (const f of files) {
  const src = join(dir, f);
  const tmp = join(dir, `.tmp-${f}`);
  const before = statSync(src).size;
  try {
    await sharp(src)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(tmp);
    const after = statSync(tmp).size;
    if (after < before) {
      renameSync(tmp, src);
      savedBefore += before;
      savedAfter += after;
      console.log(`OK  ${f}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
    } else {
      unlinkSync(tmp);
      savedBefore += before;
      savedAfter += before;
      console.log(`KEEP ${f}  (already optimal, ${(before / 1024).toFixed(0)}KB)`);
    }
  } catch (err) {
    console.error(`ERR ${f}: ${err.message}`);
  }
}

console.log(
  `\nDone. Total ${(savedBefore / 1024 / 1024).toFixed(2)}MB -> ${(savedAfter / 1024 / 1024).toFixed(2)}MB (-${(
    ((savedBefore - savedAfter) / savedBefore) *
    100
  ).toFixed(1)}%)`
);
