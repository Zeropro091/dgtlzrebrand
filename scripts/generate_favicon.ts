// One-off generator: renders public/favicon.svg to PNG favicon set.
// Usage: npx tsx scripts/generate_favicon.ts
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const svgPath = path.join(root, 'public', 'favicon.svg');
const outDir = path.join(root, 'public');

await mkdir(outDir, { recursive: true });

// Render SVG at high resolution to a buffer first
const master = await sharp(svgPath, { density: 300 }).png().toBuffer();

const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 512];

for (const size of sizes) {
  await sharp(master)
    .resize(size, size, { fit: 'cover', kernel: 'nearest' })
    .png()
    .toFile(path.join(outDir, `favicon-${size}x${size}.png`));
  console.log(`  favicon-${size}x${size}.png`);
}

// ICO-style favicon (16+32 combined) as favicon.png fallback
await sharp(master)
  .resize(32, 32, { fit: 'cover', kernel: 'nearest' })
  .png()
  .toFile(path.join(outDir, `favicon.png`));
console.log('  favicon.png (32px fallback)');

console.log('done.');
