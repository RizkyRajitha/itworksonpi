/**
 * Build-time OG image generator. Runs in Node during `astro build`.
 *
 * Output is a PNG. We use satori for SVG, then resvg-js to rasterize.
 *
 * The cards mirror the on-site terminal "cover" (see PostCover.astro):
 * a window chrome with traffic-light dots + a file path, a `$ title`
 * body and a footer with category hashtags + the CodeHiRise mark.
 * The on-site cover has a blinking cursor; OG images intentionally omit it.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { TAGLINE } from './site';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

// ---- theme tokens (kept in sync with src/styles/global.css) ----
const ACCENT = '#4ecdc4';
const TITLE = '#f2f5f8';
const MUTED = '#98a2b3';
const FAINT = '#69727f';
const WINDOW_BG = '#0b0f16';
const BACKDROP = '#07090d';
const BORDER_STRONG = '#2a3342';
const BORDER = '#1d2330';

export type OgVariant = 'index' | 'post' | 'category' | 'explore';

export interface OgOptions {
  title: string;
  /** text shown in the window title bar, e.g. ~/codehirise/posts/foo.md */
  pathLabel: string;
  /** categories rendered as #hashtags in the footer */
  categories?: string[];
  variant?: OgVariant;
}

const fontCache = new Map<string, ArrayBuffer>();
async function loadFont(file: string): Promise<ArrayBuffer> {
  const hit = fontCache.get(file);
  if (hit) return hit;
  const buf = await fs.readFile(path.join(PUBLIC_DIR, file));
  const data = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  fontCache.set(file, data);
  return data;
}

// Noto Sans Mono matches the on-site terminal cover; Inter Tight gives the
// index hero a bigger, bolder feel. Both ship in public/ (400 weight only).
const MONO = 'Noto Sans Mono';
const DISPLAY = 'Inter Tight';

// The CodeHiRise mark, inlined as an SVG data URI so satori renders it as <img>.
function markDataUrl(color: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}">` +
    `<path d="M2 4.5 L9.5 12 L2 19.5 Z"/>` +
    `<rect x="10.7" y="4" width="2.6" height="16" rx="1"/>` +
    `<path d="M22 4.5 L14.5 12 L22 19.5 Z"/>` +
    `</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function hashtags(categories: string[] = []): string {
  return categories
    .map((c) => '#' + c.toLowerCase().replace(/\s+/g, ''))
    .join('  ');
}

// Noto Sans Mono is wide, so titles wrap fast; shrink for long strings.
function titleSize(t: string): number {
  const n = t.length;
  if (n > 68) return 42;
  if (n > 48) return 50;
  if (n > 32) return 60;
  if (n > 20) return 72;
  return 84;
}

const dot = (color: string) => ({
  type: 'div',
  props: {
    style: {
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: color,
      opacity: 0.6,
    },
  },
});

function windowBar(pathLabel: string) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '11px',
        padding: '20px 28px',
        borderBottom: `1px solid ${BORDER}`,
        background: 'rgba(255,255,255,0.02)',
      },
      children: [
        dot('#e5685e'),
        dot('#e0b341'),
        dot('#57c06b'),
        {
          type: 'div',
          props: {
            style: { marginLeft: '14px', fontSize: '27px', color: FAINT },
            children: pathLabel,
          },
        },
      ],
    },
  };
}

function footer(categories: string[] | undefined, variant: OgVariant) {
  const left = {
    type: 'div',
    props: {
      style: { display: 'flex', fontSize: '30px', color: FAINT, letterSpacing: '0.02em' },
      children: variant === 'index' ? '~ codehirise.com' : hashtags(categories),
    },
  };

  const right = {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', gap: '11px', fontSize: '30px', color: FAINT },
      children: [
        {
          type: 'img',
          props: { width: 30, height: 30, src: markDataUrl(ACCENT) },
        },
        { type: 'div', props: { children: 'CodeHiRise' } },
      ],
    },
  };

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 30px 30px',
      },
      children: [left, right],
    },
  };
}

function titleBody(title: string) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 64px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'flex-start',
              fontSize: titleSize(title),
              lineHeight: 1.12,
              letterSpacing: '-0.01em',
              color: TITLE,
            },
            children: [
              {
                type: 'span',
                props: { style: { color: ACCENT, marginRight: '18px', flexShrink: 0 }, children: '$' },
              },
              { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: title } },
            ],
          },
        },
      ],
    },
  };
}

function indexBody() {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 64px',
        gap: '20px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '26px' },
            children: [
              {
                type: 'img',
                props: { width: 96, height: 96, src: markDataUrl(ACCENT) },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontFamily: DISPLAY,
                    fontSize: '150px',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: { color: TITLE, textShadow: '1px 0 0 #f2f5f8, -1px 0 0 #f2f5f8' },
                        children: 'Code',
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          color: ACCENT,
                          textShadow: '1px 0 0 #4ecdc4, -1px 0 0 #4ecdc4, 0 0 40px rgba(78,205,196,0.55)',
                        },
                        children: 'HiRise',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: DISPLAY,
              fontSize: '34px',
              color: MUTED,
              letterSpacing: '0.01em',
              textAlign: 'center',
            },
            children: TAGLINE,
          },
        },
      ],
    },
  };
}

export async function renderOgSvg(opts: OgOptions): Promise<string> {
  const variant = opts.variant ?? 'post';
  const title = (opts.title || 'CodeHiRise').slice(0, 120);
  const [monoFont, displayFont] = await Promise.all([
    loadFont('noto-sans-mono-latin-400-normal.woff'),
    loadFont('inter-tight-latin-400-normal.woff'),
  ]);

  const tree = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: '32px',
        background: BACKDROP,
        fontFamily: MONO,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              borderRadius: '18px',
              border: `1px solid ${BORDER_STRONG}`,
              backgroundColor: WINDOW_BG,
              backgroundImage:
                'linear-gradient(180deg, rgba(78,205,196,0.07), rgba(11,15,22,0) 42%)',
              overflow: 'hidden',
            },
            children: [
              windowBar(opts.pathLabel),
              variant === 'index' ? indexBody() : titleBody(title),
              footer(opts.categories, variant),
            ],
          },
        },
      ],
    },
  };

  return await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: MONO, data: monoFont, style: 'normal', weight: 400 },
      { name: DISPLAY, data: displayFont, style: 'normal', weight: 400 },
    ],
  });
}

const pngCache = new Map<string, Uint8Array>();
export async function renderOgPng(opts: OgOptions): Promise<Uint8Array> {
  const key = [opts.variant ?? 'post', opts.title, opts.pathLabel, (opts.categories ?? []).join(',')].join('|');
  const cached = pngCache.get(key);
  if (cached) return cached;
  const svg = await renderOgSvg(opts);
  // Let render errors fail the build: a fallback would ship SVG bytes as a .png.
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = new Uint8Array(resvg.render().asPng());
  pngCache.set(key, png);
  return png;
}
