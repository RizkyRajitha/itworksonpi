#!/usr/bin/env node
// Shrink post images in place. Run before committing new screenshots:
//
//   node scripts/optimize-images.mjs [dir] [--dry] [--lossy]
//
// - PNG: lossless re-encode (max zlib + adaptive filtering). --lossy switches to
//   palette quantisation (much smaller; fine for UI screenshots, can band gradients).
// - JPG: only re-encoded with --lossy (mozjpeg q82); lossless JPG re-encoding isn't possible.
// - GIF: converted to animated WebP next to the original (update the post's path,
//   then delete the .gif).
// Files are only rewritten when the result is at least 2% smaller.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const lossy = args.includes('--lossy');
const root = path.resolve(args.find((a) => !a.startsWith('--')) ?? 'public/assets');

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const kb = (n) => `${(n / 1024).toFixed(0)}K`;
let before = 0;
let after = 0;

for await (const file of walk(root)) {
  const ext = path.extname(file).toLowerCase();
  const rel = path.relative(process.cwd(), file);
  const input = await fs.readFile(file);

  if (ext === '.gif') {
    const out = await sharp(input, { animated: true }).webp({ quality: 80, effort: 6 }).toBuffer();
    const target = file.slice(0, -ext.length) + '.webp';
    before += input.length;
    after += out.length;
    console.log(`gif→webp ${rel}: ${kb(input.length)} → ${kb(out.length)}  (update path to ${path.basename(target)})`);
    if (!dry) await fs.writeFile(target, out);
    continue;
  }

  let out;
  if (ext === '.png') {
    out = await sharp(input)
      .png(lossy
        ? { palette: true, quality: 85, effort: 10, compressionLevel: 9 }
        : { compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
  } else if ((ext === '.jpg' || ext === '.jpeg') && lossy) {
    out = await sharp(input).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  } else {
    continue;
  }

  before += input.length;
  if (out.length < input.length * 0.98) {
    after += out.length;
    console.log(`${rel}: ${kb(input.length)} → ${kb(out.length)}`);
    if (!dry) await fs.writeFile(file, out);
  } else {
    after += input.length;
  }
}

const saved = before ? (100 * (1 - after / before)).toFixed(1) : '0';
console.log(`\n${dry ? '[dry run] ' : ''}total ${kb(before)} → ${kb(after)} (${saved}% smaller)`);
