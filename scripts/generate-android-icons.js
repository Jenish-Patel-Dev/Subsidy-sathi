import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

function scaleImage(srcPng, targetWidth, targetHeight) {
  const dst = new PNG({ width: targetWidth, height: targetHeight });
  const xRatio = srcPng.width / targetWidth;
  const yRatio = srcPng.height / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = x * xRatio;
      const srcY = y * yRatio;
      const x0 = Math.floor(srcX);
      const y0 = Math.floor(srcY);
      const x1 = Math.min(x0 + 1, srcPng.width - 1);
      const y1 = Math.min(y0 + 1, srcPng.height - 1);

      const xWeight = srcX - x0;
      const yWeight = srcY - y0;

      const idx00 = (y0 * srcPng.width + x0) * 4;
      const idx10 = (y0 * srcPng.width + x1) * 4;
      const idx01 = (y1 * srcPng.width + x0) * 4;
      const idx11 = (y1 * srcPng.width + x1) * 4;

      const dstIdx = (y * targetWidth + x) * 4;

      for (let c = 0; c < 4; c++) {
        const top = srcPng.data[idx00 + c] * (1 - xWeight) + srcPng.data[idx10 + c] * xWeight;
        const bottom = srcPng.data[idx01 + c] * (1 - xWeight) + srcPng.data[idx11 + c] * xWeight;
        dst.data[dstIdx + c] = Math.round(top * (1 - yWeight) + bottom * yWeight);
      }
    }
  }
  return dst;
}

function createAdaptiveForeground(srcPng, canvasSize, logoSize) {
  const scaledLogo = scaleImage(srcPng, logoSize, logoSize);
  const canvas = new PNG({ width: canvasSize, height: canvasSize });
  const offsetX = Math.round((canvasSize - logoSize) / 2);
  const offsetY = Math.round((canvasSize - logoSize) / 2);

  for (let y = 0; y < logoSize; y++) {
    for (let x = 0; x < logoSize; x++) {
      const srcIdx = (y * logoSize + x) * 4;
      const dstIdx = ((y + offsetY) * canvasSize + (x + offsetX)) * 4;
      for (let c = 0; c < 4; c++) {
        canvas.data[dstIdx + c] = scaledLogo.data[srcIdx + c];
      }
    }
  }
  return canvas;
}

function createLegacyIcon(srcPng, size, isRound = false) {
  const logoSize = Math.round(size * 0.72);
  const scaledLogo = scaleImage(srcPng, logoSize, logoSize);
  const canvas = new PNG({ width: size, height: size });
  const offsetX = Math.round((size - logoSize) / 2);
  const offsetY = Math.round((size - logoSize) / 2);
  const radius = size / 2;

  // Background #0E4B47
  const bgR = 14, bgG = 75, bgB = 71;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dstIdx = (y * size + x) * 4;
      if (isRound) {
        const dx = x - radius + 0.5;
        const dy = y - radius + 0.5;
        if (Math.sqrt(dx * dx + dy * dy) > radius) {
          continue;
        }
      }
      canvas.data[dstIdx] = bgR;
      canvas.data[dstIdx + 1] = bgG;
      canvas.data[dstIdx + 2] = bgB;
      canvas.data[dstIdx + 3] = 255;
    }
  }

  for (let y = 0; y < logoSize; y++) {
    for (let x = 0; x < logoSize; x++) {
      const srcIdx = (y * logoSize + x) * 4;
      const alpha = scaledLogo.data[srcIdx + 3] / 255;
      if (alpha <= 0) continue;

      const dstIdx = ((y + offsetY) * size + (x + offsetX)) * 4;
      if (isRound) {
        const dx = (x + offsetX) - radius + 0.5;
        const dy = (y + offsetY) - radius + 0.5;
        if (Math.sqrt(dx * dx + dy * dy) > radius) continue;
      }

      const inv = 1 - alpha;
      canvas.data[dstIdx] = Math.round(scaledLogo.data[srcIdx] * alpha + canvas.data[dstIdx] * inv);
      canvas.data[dstIdx + 1] = Math.round(scaledLogo.data[srcIdx + 1] * alpha + canvas.data[dstIdx + 1] * inv);
      canvas.data[dstIdx + 2] = Math.round(scaledLogo.data[srcIdx + 2] * alpha + canvas.data[dstIdx + 2] * inv);
      canvas.data[dstIdx + 3] = 255;
    }
  }

  return canvas;
}

const inputPath = path.resolve('public/favicon.png');
const srcPng = PNG.sync.read(fs.readFileSync(inputPath));
console.log(`Source icon loaded from ${inputPath} (${srcPng.width}x${srcPng.height})`);

const adaptiveDensities = [
  { folder: 'mipmap-mdpi', canvas: 108, logo: 68, legacy: 48 },
  { folder: 'mipmap-hdpi', canvas: 162, logo: 102, legacy: 72 },
  { folder: 'mipmap-xhdpi', canvas: 216, logo: 136, legacy: 96 },
  { folder: 'mipmap-xxhdpi', canvas: 324, logo: 204, legacy: 144 },
  { folder: 'mipmap-xxxhdpi', canvas: 432, logo: 272, legacy: 192 },
];

const resDir = path.resolve('android/app/src/main/res');

for (const d of adaptiveDensities) {
  const dir = path.join(resDir, d.folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // 1. Adaptive foreground with 63% safe-zone centering
  const fg = createAdaptiveForeground(srcPng, d.canvas, d.logo);
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), PNG.sync.write(fg));

  // 2. Legacy square icon
  const legacySquare = createLegacyIcon(srcPng, d.legacy, false);
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), PNG.sync.write(legacySquare));

  // 3. Legacy round icon
  const legacyRound = createLegacyIcon(srcPng, d.legacy, true);
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), PNG.sync.write(legacyRound));

  console.log(`Generated icons for ${d.folder}: foreground=${d.canvas}x${d.canvas} (logo ${d.logo}x${d.logo}), legacy=${d.legacy}x${d.legacy}`);
}

console.log('All Android icons generated successfully!');
