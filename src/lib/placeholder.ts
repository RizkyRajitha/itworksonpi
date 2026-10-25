/**
 * Build-time image metadata + blur placeholders via plaiceholder (sharp).
 * Runs in Node during `astro build`. Only local public/ images are processed;
 * remote URLs return null and render as a plain <img>.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { getPlaiceholder } from 'plaiceholder';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

export interface Placeholder {
  /** tiny blurred PNG as a data URI */
  base64: string;
  width: number;
  height: number;
}

const localCache = new Map<string, Placeholder | null>();

// `src` is a public-relative path like "/assets/x.png".
// Returns null for remote URLs or on any failure so the caller renders a plain <img>.
export async function getLocalImagePlaceholder(
  src: string,
): Promise<Placeholder | null> {
  const cached = localCache.get(src);
  if (cached !== undefined) return cached;

  let result: Placeholder | null = null;
  try {
    if (src.startsWith('/') && !src.startsWith('//')) {
      const file = path.join(PUBLIC_DIR, decodeURIComponent(src.split(/[?#]/)[0]));
      const buf = await fs.readFile(file);
      const { base64, metadata } = await getPlaiceholder(buf, { size: 8 });
      result = { base64, width: metadata.width, height: metadata.height };
    }
  } catch {
    result = null;
  }

  localCache.set(src, result);
  return result;
}
