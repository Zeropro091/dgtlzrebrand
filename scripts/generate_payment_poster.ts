// One-off generator: renders public/posters/payment-orchestration.svg to PNG.
// Usage: npx tsx scripts/generate_payment_poster.ts
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs/promises';

const root = path.resolve(import.meta.dirname, '..');
const svgPath = path.join(root, 'public', 'posters', 'payment-orchestration.svg');
const outPath = path.join(root, 'public', 'posters', 'payment-orchestration.png');

const svg = await fs.readFile(svgPath, 'utf8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1024 },
  font: {
    loadSystemFonts: true,
    serifFamily: 'Playfair Display',
    sansSerifFamily: 'Arial',
    monospaceFamily: 'Consolas',
  },
});

const pngBuffer = resvg.render().asPng();
await fs.writeFile(outPath, pngBuffer);

await sharp(outPath).png({ compressionLevel: 9 }).toFile(outPath + '.tmp');
await fs.rename(outPath + '.tmp', outPath);

console.log(`written: ${outPath}`);

