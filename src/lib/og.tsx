/**
 * Build-time OG image generator. Runs in Node during `astro build`.
 *
 * Output is a PNG. We use satori for SVG, then resvg-js to rasterize.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from "@resvg/resvg-js";

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

let cachedFont: ArrayBuffer | null = null;
async function loadFont(): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;
  const buf = await fs.readFile(path.join(PUBLIC_DIR, 'VT323-Regular.TTF'));
  cachedFont = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return cachedFont;
}

let cachedLogoDataUrl: string | null = null;
async function loadLogoDataUrl(): Promise<string> {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;
  const logo = await fs.readFile(path.join(PUBLIC_DIR, 'images/codehiriselogo.png'));
  cachedLogoDataUrl = `data:image/png;base64,${logo.toString('base64')}`;
  return cachedLogoDataUrl;
}

export async function renderOgSvg(rawTitle: string): Promise<string> {
  const title = (rawTitle || 'CodeHiRise').slice(0, 100);
  const fontData = await loadFont();
  const logoSrc = await loadLogoDataUrl();

  const tree = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        color: '#fff',
        background: '#1b202c',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '20px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontSize: 108,
              width: '100%',
              height: '90vh',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: '20px',
              paddingRight: '20px',
              textTransform: 'capitalize',
              marginTop: '5%',
            },
            children: title,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              padding: '10px',
            },
            children: [
              {
                type: 'img',
                props: {
                  width: 75,
                  src: logoSrc,
                  style: {
                    alignSelf: 'center',
                    border: '#33c0d3',
                    borderRadius: '4px',
                    borderWidth: '2px',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 52,
                    height: '10vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    alignSelf: 'center',
                  },
                  children: 'CodeHiRise',
                },
              },
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
      {
        name: 'VT323',
        data: fontData,
        style: 'normal',
        weight: 400,
      },
    ],
  });
}

const pngCache = new Map<string, Uint8Array>();
export async function renderOgPng(title: string): Promise<Uint8Array> {
  const cached = pngCache.get(title);
  if (cached) return cached;
  const svg = await renderOgSvg(title);
  try {
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const png = new Uint8Array(resvg.render().asPng());
    pngCache.set(title, png);
    return png;
  } catch (err) {
    return new TextEncoder().encode(svg);
  }
}
