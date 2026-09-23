// Verify poster regions using raw pixel buffers (bypasses stats() quirks).
import sharp from 'sharp';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const png = path.join(root, 'public', 'posters', 'payment-orchestration.png');

async function rawStats(name: string, left: number, top: number, width: number, height: number) {
  const { data, info } = await sharp(png)
    .extract({ left, top, width, height })
    .raw()
    .toBuffer({ resolveWithObject: true });

  let min = 255, max = 0, sum = 0, sumSq = 0;
  const n = width * height;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < min) min = lum;
    if (lum > max) max = lum;
    sum += lum;
    sumSq += lum * lum;
  }
  const mean = sum / n;
  const stdev = Math.sqrt(sumSq / n - mean * mean);
  console.log(
    `${name}: lum min=${min.toFixed(0)} max=${max.toFixed(0)} mean=${mean.toFixed(1)} stdev=${stdev.toFixed(1)} [${info.width}x${info.height}]`
  );
  return { min, max, mean, stdev };
}

// top blue header bar (should be mostly blue #0B17EF ~ lum 45, with white text)
await rawStats('header bar  ', 0, 0, 1024, 56);
// "DGTLZ.AGENCY" text region within header
const hdrTxt = await rawStats('header text ', 30, 14, 270, 32);
// "NON-" display type area (black #111 on off-white #F4F4F2)
const disp = await rawStats('display NON-', 55, 105, 300, 95);
// off-white control (empty area)
const ctrl = await rawStats('blank control', 420, 120, 200, 80);
// orchestrator blue chip
const orch = await rawStats('orchestrator ', 412, 560, 200, 120);

console.log('');
console.log(hdrTxt.max > 240 && hdrTxt.stdev > 30 ? 'HEADER TEXT: RENDERED ✓' : 'HEADER TEXT: MISSING ✗');
console.log(disp.min < 60 && disp.stdev > 30 ? 'DISPLAY TEXT: RENDERED ✓' : 'DISPLAY TEXT: MISSING ✗');
console.log(ctrl.stdev < 15 && ctrl.min > 200 ? 'CONTROL AREA: CLEAN ✓' : 'CONTROL AREA: NOISY ✗');
console.log(orch.mean < 100 ? 'ORCHESTRATOR CHIP: BLUE + WHITE TEXT ✓' : 'ORCHESTRATOR CHIP: WRONG ✗');
