import type { CollectionEntry } from 'astro:content';

export const SITE_NAME = 'CodeHiRise';
export const TAGLINE = 'cloud · devops · linux · electronics · and everything in between';
export const SITE_TITLE = 'CodeHiRise - Cloud, DevOps, Linux & Electronics Guides for Engineers';
export const DESCRIPTION =
  'Practical guides on cloud, DevOps, Linux and electronics, and everything in between. Written for engineers shipping real systems.';

/** Site origin without a trailing slash, e.g. "https://codehirise.com". */
export function siteOrigin(site: URL | undefined): string {
  return site?.toString().replace(/\/$/, '') ?? '';
}

/** Canonical post slug: the content file path minus its extension. */
export function postSlug(post: CollectionEntry<'blog'>): string {
  return post.id.replace(/\.(md|mdx)$/, '');
}

/** Meta description for a post: explicit `description`, else the overview trimmed to ~160 chars. */
export function postDescription(post: CollectionEntry<'blog'>): string {
  if (post.data.description) return post.data.description;
  const text = post.data.overview.trim();
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '') + '…';
}
