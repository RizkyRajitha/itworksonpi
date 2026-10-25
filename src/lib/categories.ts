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

/**
 * Up to `limit` posts related to `post`: most shared categories first, then newest.
 * Falls back to the newest other posts when nothing overlaps.
 */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const mine = new Set(postCategories(post).map(categorySlug));
  const others = sortPostsByDateDesc(all.filter((p) => p.id !== post.id));
  const scored = others
    .map((p, i) => ({
      p,
      i,
      shared: postCategories(p).filter((c) => mine.has(categorySlug(c))).length,
    }))
    .filter((s) => s.shared > 0)
    .sort((a, b) => b.shared - a.shared || a.i - b.i)
    .map((s) => s.p);
  return (scored.length ? scored : others).slice(0, limit);
}

// One-line blurbs for topic pages, keyed by categorySlug().
const CATEGORY_BLURBS: Record<string, string> = {
  cloud:
    'Cloud architecture, provisioning and the habits that keep workloads reliable and affordable.',
  aws: 'Hands-on AWS EC2, IAM, Systems Manager and the services you actually reach for in production.',
  devops:
    'CI/CD, automation, runners and the operational practices that ship software safely.',
  kubernetes:
    'Cluster access, RBAC, workloads and day-two operations for Kubernetes.',
  linux:
    'System administration, networking tools and command-line craft for engineers.',
  networking:
    'DNS, connections, troubleshooting and the network fundamentals every engineer needs.',
  security:
    'Least-privilege access, hardening and keeping production systems safe.',
  webdev: 'Real-time apps, streaming and modern web engineering patterns.',
  react: 'Front-end patterns and building responsive, real-time interfaces.',
  'home-automation':
    'Smart-home integrations, dashboards and self-hosted monitoring.',
  iot: 'Sensors, data pipelines and connecting the physical world to your stack.',
};

export function categoryBlurb(slug: string): string {
  return (
    CATEGORY_BLURBS[slug] ??
    'Every CodeHiRise guide filed under this topic, newest first.'
  );
}
