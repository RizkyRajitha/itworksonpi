# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`); Node `>=22.12`.

- `pnpm dev` — dev server on http://localhost:4321
- `pnpm build` — static build to `dist/`
- `pnpm preview` — serve the built `dist/`

There is no test suite and no separate lint script. The `README.md` is the unmodified Astro starter template — ignore it.

## Stack

CodeHiRise (deployed at codehirise.com) is a statically-generated blog on **Astro 6**, **MDX**, and **Tailwind CSS v4** (wired through `@tailwindcss/vite`, not a config file — design tokens live in the `@theme` block of `src/styles/global.css`). Posts are local MDX files. Output is fully static and served from `dist/` by Cloudflare (`wrangler.jsonc` — static assets only, no Worker). The `SITE_URL` env var overrides the `site` origin in `astro.config.mjs`; everything builds absolute URLs from `Astro.site`.

There is **no client framework** — interactivity (image lightbox, explore search, scroll progress) is plain inline `<script is:inline>`. Dark mode is forced: an inline script in `BaseLayout.astro` always adds `.dark` to `<html>` (there is no toggle).

## Content pipeline

Posts are a `glob`-loaded content collection (`src/content.config.ts`) reading `src/content/blog/**/*.{md,mdx}`. The post **slug is the file path minus extension** (`post.id.replace(/\.(md|mdx)$/, '')`) — this exact replace recurs across every route and is the canonical slug.

Required frontmatter (Zod schema in `content.config.ts`): `title`, `date` (coerced to Date), `categories` (a **comma-separated string**, e.g. `"Linux,Networking"`), `featured` (string `"true"`/`"false"` preprocessed to boolean), `overview`.

`src/lib/categories.ts` owns all category/slug logic — categories are derived by splitting the `categories` string on commas. Use `categorySlug()` (lowercase, spaces→`-`) anywhere you build a category URL, and the `postCategories`/`uniqueCategories`/`postsByCategory` helpers rather than reparsing. `readTime()` and `sortPostsByDateDesc()` also live here.

Because every route is `getStaticPaths` static generation, **adding or editing a post requires a rebuild** to appear.

### Routes (`src/pages/`)

- `index.astro` — home: post list, topic tags, featured cards.
- `explore.astro` — all posts; client-side title filter via inline script (reads `?text=` for the JSON-LD SearchAction).
- `category/[slug].astro` — one page per `uniqueCategories` entry.
- `post/[...slug].astro` — renders MDX via `render()` + `<Content components={mdxComponents} />`.
- `og/[...slug].png.ts` — OG images as static files (see below).
- `robots.txt.ts` — disallows `/og/`, points to `/sitemap-index.xml` (sitemap from `@astrojs/sitemap`).

## MDX rendering and custom components

`src/components/mdx-components.ts` maps MDX elements:

- **`img` → `PostImage.astro`**: every markdown image becomes a button that opens the shared `PostImageDialog.astro` lightbox (one `<dialog>` per post page, driven by a delegated click listener). Don't render bare `<img>` for post content.
- **`<Alert type="info|warning|success|error|note">`** is used directly inside MDX for callout boxes (`note` aliases to `info`).

Code highlighting is **Shiki** (`github-dark-dimmed`, `wrap: true`), configured in `astro.config.mjs` markdown options. Heading anchors come from `rehype-slug` + `rehype-autolink-headings`.

## OG images and blur placeholders (build-time, Node-only)

Both run in Node during `astro build`, so they may use `node:fs` — but they must not be moved to any edge/Worker runtime.

- `src/lib/og.tsx` — `renderOgPng(title)` builds a 1200×630 card with **satori** (SVG, using `public/VT323-Regular.TTF` and the embedded logo) then rasterizes via **`@resvg/resvg-js`**. `@resvg/resvg-js` is a native module — it's listed in `vite.optimizeDeps.exclude` and `vite.ssr.external` in `astro.config.mjs`; keep it there. Results are cached per title in-process.
- `og/[...slug].png.ts` pre-renders one PNG per post, per category, and an `index` card, served immutable.
- `src/lib/placeholder.ts` — `getLocalImagePlaceholder()` makes base64 blur data for **local** public images (remote URLs return `null` → plain `<img>`); `getOgPlaceholder()` blurs the generated OG cover. Both cache in-process. Placeholders are applied as inline `background-image` styles behind the `<img>`.

## Conventions

- Use `Astro.site` (with trailing slash stripped) to build absolute URLs; pages assemble their own canonical `url`, `image` (`/og/...png`), and JSON-LD, then pass them to `BaseLayout` → `MetaTags.astro`.
- Brand colors and fonts are Tailwind theme tokens: reference them as `var(--color-brand-*)` / utility classes, not hard-coded hex.
- Analytics: `data-umami-event` attributes on links/tags drive Umami events; the Umami script is injected in `BaseLayout.astro`.
