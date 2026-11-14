#!/usr/bin/env node
// Ganti hero statue: node scripts/set-statue.mjs <1|2|3|4>
// Sumber: ../DGTLZ STATUES/<n>.png  →  public/statue.webp
import { existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const n = process.argv[2];
if (!['1', '2', '3', '4'].includes(n)) {
  console.error('pakai: node scripts/set-statue.mjs <1|2|3|4>');
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, '..');
const src = path.resolve(root, '..', 'DGTLZ STATUES', `${n}.png`);
const out = path.join(root, 'public', 'statue.webp');

if (!existsSync(src)) {
  console.error('sumber tidak ada:', src);
  process.exit(1);
}

const py = `from PIL import Image
im = Image.open(r"${src}").convert("RGB")
w = 1000; h = round(im.height * w / im.width)
im.resize((w, h), Image.LANCZOS).save(r"${out}", quality=86, method=6)
print("ok", w, h)`;

execFileSync('python', ['-c', py], { stdio: 'inherit' });
console.log(`statue ${n}.png → public/statue.webp (${Math.round(statSync(out).size / 1024)} KB)`);
