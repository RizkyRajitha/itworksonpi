# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server on http://localhost:3000
- `npm run build` — production build (statically generates every post/category page)
- `npm run start` — serve the production build
- `npm run lint` — runs `next lint` (ESLint with `next/core-web-vitals`)

There is no test suite.

## Stack overview

CodeHiRise is a statically-generated blog built on **Next.js 12 (pages router, no `app/`)**, **React 18**, **Chakra UI + Emotion**, and **MDX** for post content. Posts are local markdown files, not fetched from a CMS.

## Content pipeline (`_posts/` → rendered pages)

Posts live as `.md` files in `_posts/` and are read at build time by `lib/getPosts.js`:

- `getAllPosts()` — reads every `.md`, parses frontmatter via `gray-matter`, sorts by `date` desc.
- `getPostBySlug(slug)` — single post lookup (slug is the filename without `.md`).
- `getAllCategories()` / `getPostByCategories(cat)` — categories are derived from a **comma-separated** `categories` string in frontmatter (e.g. `categories: "Linux,Networking"`). Filtering lowercases both sides.

Required frontmatter keys: `title`, `date` (ISO), `categories` (comma-separated string), `featured` (string `"true"`/`"false"`), `overview`.

Page wiring:

- `pages/index.js` — list of all posts, topic tags, featured sidebar.
- `pages/category/[slug].js` — `getStaticPaths` enumerates every category from posts; one page per category.
- `pages/post/[slug].js` — `getStaticPaths` enumerates every post; renders MDX via `next-mdx-remote`.
- `pages/sitemap.xml.js` — server-rendered XML sitemap built from `getAllPosts()`.

Because everything is `getStaticProps` / `getStaticPaths` with `fallback: false`, **adding or editing a post requires a rebuild** to appear.

## MDX rendering and custom components

`pages/post/[slug].js` defines a `components` map passed to `<MDXRemote>` that overrides standard markdown elements with Chakra components. Two non-standard conventions to be aware of:

- **Callout via `h6`**: a markdown `###### ~warning~ Some text` or `###### ~info~ Some text` line is parsed by splitting on `~` and rendered as a colored alert box (red for `warning`, blue otherwise). Don't "fix" this to look like a normal h6 — it's load-bearing.
- **Inline `<Alert type="..." />`** is also accepted in MDX and maps to a Chakra `Alert`.

Code highlighting uses `remark-prism` (configured in `serialize`). Heading anchors use `rehype-slug`. The Prism CSS is inlined as a `Global` style block in `pages/_app.js` — there is a large commented-out earlier copy above it; ignore the commented version.

Image handling in posts:

1. Markdown `![alt](url)` is captured by regex in `getStaticProps`.
2. `plaiceholder` generates a base64 blur placeholder for each image and the OG cover at build time. This requires the dev/build process to be able to fetch the OG image URL — see "Environment variables".
3. The rendered `<img>` is wrapped in a Chakra modal that opens a full-size view on click.

## OG image generation

`pages/api/og.js` is an **edge runtime** route (`runtime: "experimental-edge"`) that returns a 1200×630 PNG via `@vercel/og`, using the `VT323-Regular.TTF` font shipped in `public/`. Cards, post pages, and metatags all reference `/api/og?title=<post title>` for cover art. The `id=${VERCEL_GIT_COMMIT_SHA}` query param is a cache-buster keyed to the deploy.

When changing the OG layout, remember it must render on the edge runtime (no Node-only APIs).

## Environment variables

- `NEXT_PUBLIC_SITE_URL` — site origin (e.g. `https://codehirise.com`). Used for absolute URLs in metatags, sitemap, share links, and **as the base for `getPlaiceholder` to fetch `/api/og` at build time**. If unset locally, plaiceholder calls in `pages/post/[slug].js` will hit `https://codehirise.com` — set it to your dev URL when iterating on OG layout.
- `VERCEL_GIT_COMMIT_SHA` — auto-set by Vercel; used as cache-buster for OG image URLs.
- `VERCEL_ENV` — read in `pages/index.js` (currently informational only).

## Other notes

- `prom.yml` at the repo root is sample config referenced from one of the blog posts ("Setup Prometheus and Grafana on Orange Pi"), **not** runtime config for this app.
- `next.config.js` sets `images.remotePatterns` to allow any host — `next/future/image` is used throughout.
- Default color mode is dark (`initialColorMode: "dark"` in `_app.js`). The site theme uses VT323 / Inter Tight / Noto Sans Mono via `@fontsource/*`.
- Analytics: `data-umami-event` attributes on links/tags drive Umami events; the Umami script itself is not in this repo (presumably injected by the host).
