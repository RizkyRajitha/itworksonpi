/**
 * Build-time blur placeholders via plaiceholder. Runs in Node during `astro build`.
 * Only local images are processed; remote URLs return null and render without a blur.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { getPlaiceholder } from 'plaiceholder';
import { renderOgPng } from './og';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

export interface Placeholder {
  base64: string;
  width: number;
  height: number;
}

const localCache = new Map<string, Placeholder | null>();

// `src` is a public-relative path like "/assets/x.png" or "/images/landingbanner.jpg".
// Returns null for remote URLs or on any failure so the caller renders a plain <img>.
export async function getLocalImagePlaceholder(
  src: string,
): Promise<Placeholder | null> {
  const cached = localCache.get(src);
  if (cached !== undefined) return cached;

  let result: Placeholder | null = null;
  try {
    if (src.startsWith('/')) {
      const buf = await fs.readFile(path.join(PUBLIC_DIR, src.replace(/^\//, '')));
      const { base64, metadata } = await getPlaiceholder(buf, { size: 32 });
      result = { base64, width: metadata.width, height: metadata.height };
    }
  } catch {
    result = null;
  }

  localCache.set(src, result);
  return result;
}

const ogCache = new Map<string, string | null>();

// Blur for the locally generated OG cover (1200x630), keyed by post/category title.
export async function getOgPlaceholder(title: string): Promise<string | null> {
  const cached = ogCache.get(title);
  if (cached !== undefined) return cached;

  let base64: string | null = null;
  try {
    const png = await renderOgPng(title);
    base64 = (await getPlaiceholder(Buffer.from(png))).base64;
  } catch {
    base64 = null;
  }

  ogCache.set(title, base64);
  return base64;
}
