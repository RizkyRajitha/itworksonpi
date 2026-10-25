import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

export function postCategories(post: Post): string[] {
  return post.data.categories
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
}

export function categorySlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-');
}

export function uniqueCategories(posts: Post[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of posts) {
    for (const c of postCategories(p)) {
      const key = c.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(c);
      }
    }
  }
  return out;
}

export function postsByCategory(posts: Post[], slug: string): Post[] {
  const target = slug.toLowerCase();
  return posts.filter((p) =>
    postCategories(p).some((c) => categorySlug(c) === target)
  );
}

export function readTime(content: string): number {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 183));
}

const dateFormat = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

/** Absolute display date, e.g. "May 8, 2026". Static pages can't show "x days ago" without going stale. */
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

/** Machine-readable date for <time datetime>, e.g. "2026-05-08". */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function sortPostsByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}
