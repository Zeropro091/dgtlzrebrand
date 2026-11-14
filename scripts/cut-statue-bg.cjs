// Cut the electric-blue background out of statue.webp -> transparent PNG with despill.
const sharp = require('sharp');
const SRC = 'public/statue.webp';
const OUT = 'public/statue-cut.png';

const D0 = 26;   // fully transparent below this color distance
const D1 = 78;   // fully opaque above this

(async () => {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const idx = (x, y) => (y * w + x) * ch;

  // background colour = median of the border pixels
  const samples = [[], [], []];
  for (let x = 0; x < w; x++) {
    for (const y of [1, 2, h - 3, h - 2]) {
      const i = idx(x, y);
      samples[0].push(data[i]); samples[1].push(data[i + 1]); samples[2].push(data[i + 2]);
    }
  }
  const med = samples.map((a) => a.sort((p, q) => p - q)[a.length >> 1]);
  console.log('background rgb =', med);

  const out = Buffer.alloc(w * h * 4);
  let transparent = 0, opaque = 0, soft = 0;
  for (let p = 0; p < w * h; p++) {
    const i = p * ch, o = p * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const d = Math.sqrt((r - med[0]) ** 2 + (g - med[1]) ** 2 + (b - med[2]) ** 2);
    let a = (d - D0) / (D1 - D0);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    // despill: pull the background colour back out of the semi-transparent edge pixels
    if (a > 0.02 && a < 0.98) {
      const inv = 1 - a;
      out[o] = Math.max(0, Math.min(255, Math.round((r - med[0] * inv) / a)));
      out[o + 1] = Math.max(0, Math.min(255, Math.round((g - med[1] * inv) / a)));
      out[o + 2] = Math.max(0, Math.min(255, Math.round((b - med[2] * inv) / a)));
      soft++;
    } else {
      out[o] = r; out[o + 1] = g; out[o + 2] = b;
      if (a <= 0.02) transparent++; else opaque++;
    }
    out[o + 3] = Math.round(a * 255);
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png({ compressionLevel: 9 }).toFile(OUT);
  const meta = await sharp(OUT).metadata();
  console.log(`saved ${OUT} ${meta.width}x${meta.height} alpha=${meta.hasAlpha}`);
  console.log(`transparent ${(100 * transparent / (w * h)).toFixed(1)}% | soft edge ${(100 * soft / (w * h)).toFixed(1)}% | opaque ${(100 * opaque / (w * h)).toFixed(1)}%`);
})();
