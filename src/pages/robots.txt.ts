import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '') ?? '';
  // /og/ stays crawlable: X/Twitterbot honours robots.txt for card images,
  // and Google fetches the Article JSON-LD image from there.
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap-index.xml\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
