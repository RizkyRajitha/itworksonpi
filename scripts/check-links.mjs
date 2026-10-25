#!/usr/bin/env node
// Check that every internal link in the built site resolves.
//
//   node scripts/check-links.mjs [dist]
//
// Walks dist/**/*.html and verifies each internal href/src/data-src points at a
// built file, and that #anchors exist on the target page. External URLs are skipped.
// Exits non-zero when anything is broken, so it can gate CI.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');

const pages = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (full.endsWith('.html')) pages.push(full);
  }
})(dist);

// Map a URL path to a built file (/x, /x/index.html, /x.html).
function resolveFile(url) {
  const p = decodeURIComponent(url.split(/[?#]/)[0]);
  return [path.join(dist, p), path.join(dist, p, 'index.html'), path.join(dist, p + '.html')]
    .find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
}

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

let checked = 0;
let broken = 0;
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const where = path.relative(dist, page);
  for (const [, url] of html.matchAll(/\s(?:href|src|data-src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:|\/\/)/.test(url)) continue;
    checked++;
    if (url.startsWith('#')) {
      if (url.length > 1 && !idsOf(page).has(decodeURIComponent(url.slice(1)))) {
        console.log(`broken anchor ${url}  (on ${where})`);
        broken++;
      }
      continue;
    }
    const target = resolveFile(url);
    if (!target) {
      console.log(`broken link ${url}  (on ${where})`);
      broken++;
      continue;
    }
    const hash = url.split('#')[1];
    if (hash && !idsOf(target).has(decodeURIComponent(hash))) {
      console.log(`broken anchor ${url}  (on ${where})`);
      broken++;
    }
  }
}

console.log(`${checked} internal links checked, ${broken} broken`);
process.exit(broken ? 1 : 0);
