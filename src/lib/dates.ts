// Date helpers. formatDate/isoDate run at build time; relativeTime/fullDate run
// in the browser (PostDate.astro), because "x ago" text baked into static HTML
// would go stale.

const displayDate = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' });
const longDate = new Intl.DateTimeFormat('en', { dateStyle: 'full', timeZone: 'UTC' });
const longDateTime = new Intl.DateTimeFormat('en', { dateStyle: 'full', timeStyle: 'short' });
const relative = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
const relativeDay = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }); // "today", "yesterday"

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

/** Absolute display date, e.g. "May 8, 2026". */
export function formatDate(date: Date): string {
  return displayDate.format(date);
}

/**
 * Value for <time datetime>: "2026-05-08" for date-only frontmatter, or a full
 * ISO timestamp when the post gives a time of day.
 */
export function isoDate(date: Date): string {
  const iso = date.toISOString();
  return iso.endsWith('T00:00:00.000Z') ? iso.slice(0, 10) : iso;
}

/**
 * A date-only value counts as that calendar day in the reader's timezone, so
 * "today" matches the date on their own clock.
 */
function parse(value: string): Date {
  if (DATE_ONLY.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * "today", "yesterday", "2 weeks ago", "5 months ago", "3 years ago" for an
 * isoDate() value. Minutes and hours only show when the value has a time of
 * day. Returns null for an unparseable value.
 */
export function relativeTime(value: string, now = new Date()): string | null {
  const then = parse(value);
  if (Number.isNaN(then.getTime())) return null;

  if (!DATE_ONLY.test(value)) {
    const secs = (now.getTime() - then.getTime()) / 1000;
    if (secs < 60) return 'just now';
    if (secs < 3600) return relative.format(-Math.floor(secs / 60), 'minute');
    if (secs < DAY_MS / 1000) return relative.format(-Math.floor(secs / 3600), 'hour');
  }

  let months = (now.getFullYear() - then.getFullYear()) * 12 + now.getMonth() - then.getMonth();
  if (now.getDate() < then.getDate()) months--;
  if (months >= 12) return relative.format(-Math.floor(months / 12), 'year');
  if (months >= 1) return relative.format(-months, 'month');

  // Round, not floor: days around a DST change are 23 or 25 hours long.
  const days = Math.max(0, Math.round((startOfDay(now) - startOfDay(then)) / DAY_MS));
  if (days >= 7) return relative.format(-Math.floor(days / 7), 'week');
  return relativeDay.format(-days, 'day');
}

/** Hover text: "Friday, May 8, 2026", plus the reader's local time when the value has one. */
export function fullDate(value: string): string {
  const format = DATE_ONLY.test(value) ? longDate : longDateTime;
  return format.format(new Date(value));
}
