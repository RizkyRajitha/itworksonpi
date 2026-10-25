# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`); Node `>=22.12`. Dependencies are pinned to exact versions.

- `pnpm dev` — dev server on http://localhost:4321
- `pnpm build` — static build to `dist/`
- `pnpm preview` — serve the built `dist/`
- `pnpm images` — palette-compress PNG/JPG in `public/assets` in place and convert GIFs to animated WebP (`--dry` via `node scripts/optimize-images.mjs --dry --lossy` to preview). Run it before committing new screenshots.

There is no test suite and no lint/typecheck script (`@astrojs/check` was blocked by pnpm's supply-chain trust policy). The `README.md` is the unmodified Astro starter template — ignore it. `master` holds the old Next.js site; the Astro site lives on the feature branches.

To test Cloudflare routing locally (trailing slashes, `_headers`, `_redirects`, 404): `pnpm build && pnpm dlx wrangler@4 dev`.

## Stack

CodeHiRise (deployed at codehirise.com) is a statically-generated blog on **Astro 6**, **MDX**, and **Tailwind CSS v4** (wired through `@tailwindcss/vite`, not a config file). Styling is almost entirely hand-written CSS in `src/styles/global.css`: design tokens are plain CSS variables on `:root` (`--bg`, `--surface`, `--text`, `--text-muted`, `--text-faint`, `--accent`, …) — use those, not hard-coded hex. Tailwind is only used for its preflight and a few layout utilities in `BaseLayout.astro`. Posts are local MDX files.

Output is fully static and served from `dist/` by Cloudflare Workers static assets (`wrangler.jsonc`, no Worker script). `html_handling: drop-trailing-slash` matches `trailingSlash: 'never'` in `astro.config.mjs` (Astro emits `/x/index.html`, served at `/x`); `not_found_handling: 404-page` serves `src/pages/404.astro`. The `SITE_URL` env var overrides the `site` origin; everything builds absolute URLs from `Astro.site`.

Response headers set in Astro endpoints are **dropped** in a static build — caching and security headers live in `public/_headers`, redirects in `public/_redirects`.

There is **no client framework** — interactivity (image lightbox, explore search, topic filters, TOC highlight, code copy, hero canvas, scroll progress) is plain inline `<script is:inline>`. The exception is a component whose script imports from `src/lib` (e.g. `PostDate.astro`): it uses a normal bundled `<script>`, which Astro adds once per page no matter how many times the component renders. The site is dark-only (`<html class="dark">`, `color-scheme: dark`); there is no toggle. Inline scripts run on static HTML, so anything request-dependent (e.g. the explore page's `?text=` query) must be read in the browser, never via `Astro.url.searchParams`.

## Content pipeline

Posts are a `glob`-loaded content collection (`src/content.config.ts`) reading `src/content/blog/**/*.{md,mdx}`.

Frontmatter (Zod schema in `content.config.ts`):

- required: `title`, `date` (coerced to Date), `categories` (a **comma-separated string**, e.g. `"Linux,Networking"`), `featured` (string `"true"`/`"false"` preprocessed to boolean; `"true"` lists the post in the home page's Featured section), `description` (≤160 chars; the one post summary, used on cards, RSS, Explore search and meta/OG descriptions)
- optional: `updated` (date; drives `dateModified` / `article:modified_time`)

Post conventions: don't start a post with an `# h1` (the post cover renders the title as the h1) or write greetings / sign-offs as headings (they end up in the table of contents) — use plain paragraphs. Link to other posts with relative `/post/<slug>` URLs. Images go in `public/assets/<post>/` with descriptive alt text (alt doubles as the visible caption).

Shared helpers — use these instead of re-implementing:

- `src/lib/site.ts` — `SITE_NAME`, `TAGLINE`, `SITE_TITLE`, `DESCRIPTION`, `siteOrigin(Astro.site)` (origin without trailing slash), `postSlug(post)` (the canonical slug: file path minus extension).
- `src/lib/categories.ts` — all category logic: `postCategories`, `uniqueCategories`, `postsByCategory`, `categorySlug()` (lowercase, spaces→`-`; use it for every topic URL), `categoryBlurb()`, `relatedPosts()` (ranked by shared categories), plus `readTime()` and `sortPostsByDateDesc()`. Frontmatter categories are shown to readers as **topics**, at `/topics/<slug>`.
- `src/lib/dates.ts` — `formatDate()` / `isoDate()` (build time: absolute date and `<time datetime>` value) and `relativeTime()` / `fullDate()` (browser: "5 months ago" and the hover text). Never call `relativeTime()` at build time; the text would go stale in a static build.
- Post dates: render them with `PostDate.astro`, never a bare `<time>`. It ships the absolute date as the no-JS fallback; its `<post-date>` custom element then rewrites itself with `relativeTime()` and puts `fullDate()` in the hover `title`. `global.css` hides it (`post-date:not(:defined)`, JS-enabled browsers only) until that happens, so the absolute date never flashes. Date-only frontmatter shows a date on hover; give `date` a time (`"2026-05-08T09:30:00+05:30"`) to also show the time.

Because every route is `getStaticPaths` static generation, **adding or editing a post requires a rebuild** to appear.

### Routes (`src/pages/`)

- `index.astro` — home: hero canvas, topic filter chips, Latest (the newest post, as a `FeatureCard`), Featured (every other `featured` post, as `<Card featured>` with a glowing border), All articles (every post except Latest; the topic chips filter only this grid). Featured posts appear in both Featured and All articles on purpose, so a topic filter never hides them.
- `explore.astro` — all posts; client-side text + topic filter. Reads `?text=` in the browser (navbar search and the home page's JSON-LD SearchAction target it).
- `topics/index.astro` — index of all topics with counts; `topics/[slug].astro` — one page per `uniqueCategories` entry. The old `/category/*` URLs (also used by the Next.js site) 301 to `/topics/*` via `public/_redirects`.
- `post/[...slug].astro` — renders MDX via `render()` + `<Content components={mdxComponents} />`; TOC, related posts, BlogPosting JSON-LD (CodeHiRise as Organization author/publisher).
- `rss.xml.ts` — RSS via `@astrojs/rss`; `404.astro`; `robots.txt.ts` (points to `/sitemap-index.xml`; `/og/` must stay crawlable for social cards).
- `og/[...slug].png.ts` — OG images as static files (see below).

## MDX rendering and custom components

`src/components/mdx-components.ts` maps MDX elements:

- **`img` → `PostImage.astro`**: every markdown image becomes a button that opens the shared `PostImageDialog.astro` lightbox (one `<dialog>` per post page, driven by a delegated click listener). For local images it adds build-time `width`/`height` and a tiny blur background via `getLocalImagePlaceholder()`. Don't render bare `<img>` for post content.
- **`<Alert type="info|warning|success|error|note">`** is used directly inside MDX for callout boxes (`note` aliases to `info`).

Code highlighting is **Shiki** (`github-dark-dimmed`, `wrap: true`), configured in `astro.config.mjs` markdown options. Heading anchors come from `rehype-slug` + `rehype-autolink-headings`. Heading ids can start with a digit ("1-use-…"), so look them up with `getElementById`, never `querySelector('#…')`.

## OG images and blur placeholders (build-time, Node-only)

Both run in Node during `astro build`, so they may use `node:fs` — but they must not be moved to any edge/Worker runtime.

- `src/lib/og.tsx` — `renderOgPng(opts: OgOptions)` builds a 1200×630 terminal-style card with **satori** (fonts: `public/noto-sans-mono-latin-400-normal.woff` and `public/inter-tight-latin-400-normal.woff`, plus the inlined logo mark), then rasterizes via **`@resvg/resvg-js`**. Render errors fail the build. `@resvg/resvg-js` is a native module — it's listed in `vite.optimizeDeps.exclude` and `vite.ssr.external` in `astro.config.mjs`; keep it there. Results are cached in-process.
- `og/[...slug].png.ts` pre-renders one PNG per post (`/og/post/<slug>.png`), per topic (`/og/topics/<slug>.png`), plus `index` and `explore` cards.
- `src/lib/placeholder.ts` — `getLocalImagePlaceholder(src)` returns `{ base64, width, height }` for **local** public images (remote URLs return `null`). Cached in-process. Uses plaiceholder/sharp.

## Conventions

- Build absolute URLs with `siteOrigin(Astro.site)`; pages assemble their own canonical `url`, `image` (`/og/...png`), and JSON-LD, then pass them to `BaseLayout` → `MetaTags.astro` (which also takes `publishedTime`, `modifiedTime`, `tags`, `noindex`).
- Fonts are the variable Fontsource packages (`Inter Tight Variable`, `Noto Sans Mono Variable`); their latin files are preloaded in `BaseLayout.astro`.
- Analytics: `data-umami-event` attributes on links/tags drive Umami events; the Umami script is injected in `BaseLayout.astro` and only records on `codehirise.com`.
- Respect `prefers-reduced-motion` for any new animation, and keep the `:focus-visible` styles intact.
