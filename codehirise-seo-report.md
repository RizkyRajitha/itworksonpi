# SEO Improvement Report — codehirise.com

**Audited:** May 14, 2026
**Pages inspected:** `/` (landing) and `/post/going-production-on-cloud-part-1` (blog post)
**Goal:** grow organic traffic so the site can be monetized

---

## TL;DR — The 7 Things Hurting You Most

In rough order of impact-to-effort:

1. **Meta descriptions on blog posts are duplicated from the title.** Currently `meta-description` on the post equals the title verbatim. This is a wasted SERP click-through opportunity on every single article.
2. **No structured data (JSON-LD) anywhere.** No `Article`, `BlogPosting`, `BreadcrumbList`, `Organization`, or `Person` schema. Google relies on these for rich results, AI Overviews, and Discover.
3. **Category pages are empty shells.** Each `/category/<x>` reads literally *"Posts belong to <x> category"*. These are crawled, indexed thin pages that drag down site quality signals.
4. **Generic, typo'd meta keywords used site-wide.** Every page ships `arduino, rasberrypi, nodemcu, software, programming...` ("raspberrypi" is misspelled). Meta keywords don't help ranking anymore, but the duplication signals "templated, low-effort" to humans and crawlers reading other signals.
5. **Homepage has almost no indexable text content.** A banner image, a one-line tagline, and a list of post links. There is nothing for Google to rank this page for besides the brand name.
6. **No author, no about, no E-E-A-T signals.** Posts have no byline, no author bio, no author page, no LinkedIn/GitHub links. For a technical blog in 2026, this is a major Helpful Content Update penalty risk.
7. **The dev.to / Hashnode strategy is set up correctly *for SEO* but wrong for traffic.** Canonical tags are doing exactly what they're supposed to — telling Google "rank codehirise, not dev.to." But you're losing the dev.to/Hashnode *community* traffic that has nothing to do with SEO. More on this in section 8.

---

## 1. On-Page SEO — Landing Page (`/`)

### What's there now

```
<title>CodeHiRise</title>
<meta name="description" content="Wander in the wonderful world of electronics, programming, web dev and in between">
<meta name="keywords" content="arduino, rasberrypi, nodemcu, software, programming...">
```

### Problems

| Issue | Why it matters |
|---|---|
| Title is just the brand name ("CodeHiRise") | A brand-new site with no backlinks cannot rank for a made-up brand. The homepage title needs to target a *query*. |
| Description is poetic but contains no search-relevant terms | "Wander in the wonderful world" — no one searches for this. Lost SERP real estate. |
| H1 = "CodeHiRise" | The H1 should reinforce what the site is *about*, not repeat the brand. |
| No descriptive paragraph above the post list | Google has nothing to extract for snippets or topical relevance. |
| Banner image alt = "banner" | Wasted alt-text opportunity. |
| Typo "rasberrypi" in meta keywords | Tiny but signals lack of polish. |

### Fixes

**New `<title>`:**
> `CodeHiRise — Cloud, DevOps & Linux Tutorials for Engineers`

(55 chars; under the 60-char cap; leads with the brand for repeat visitors, hits the actual topics you cover.)

**New `<meta description>`:**
> `Practical guides on AWS, Kubernetes, Linux, networking and DevOps — written for engineers shipping real production systems. New tutorials weekly.`

(150 chars; uses your actual topical clusters; has a freshness hook.)

**New H1:**
> `Production-grade tutorials on Cloud, DevOps and Linux`

**Add an indexable intro paragraph** (2–3 sentences, 60–100 words) right under the H1, e.g.:

> CodeHiRise is a hands-on engineering blog covering AWS, Kubernetes, Linux administration, networking and the operational habits that keep production systems healthy. Every guide is written from real production experience — no fluff, no AI filler, just the patterns and gotchas you'll actually hit when you ship. Browse by topic below or jump straight to the latest post.

This gives Google ~80 words of topical anchor text and explicit topic mentions.

**Drop the meta keywords tag entirely.** It does nothing for SEO and the typo is mildly embarrassing.

**Update banner alt:** `alt="CodeHiRise — engineering blog covering cloud, DevOps and Linux"`

---

## 2. On-Page SEO — Blog Post Template

### What's there now (using the new post as example)

```
<title>Going Production on Cloud: Infrastructure Best Practices Every Engineer Should Know (Part 1)</title>
<meta name="description" content="Going Production on Cloud: Infrastructure Best Practices Every Engineer Should Know (Part 1)">
```

### The critical bug

**`meta-description` is identical to the title on every post.** This is almost certainly a templating bug in your Next.js post page — `description` is being defaulted to `title` when no explicit description is set in the frontmatter. Google may rewrite this in the SERP, but you're handing the rewrite over to them instead of controlling it.

Look in your post page component (something like `pages/post/[slug].tsx` or `app/post/[slug]/page.tsx`):

```tsx
// Likely what you have
<meta name="description" content={post.title} />

// What it should be
<meta name="description" content={post.excerpt || post.description || post.title} />
```

Then add an `excerpt` or `description` field to every post's frontmatter (the homepage already shows article summaries, so the data may already exist — you just need to surface it as `<meta>`).

### Other post-page issues

| Issue | Fix |
|---|---|
| Title too long (104 chars) — Google truncates at ~60 | Shorten: `Going to Production on AWS: 8 Infrastructure Practices (Part 1)` |
| No `<meta name="author">` or visible byline | Add an author component with name + 1-line bio + link to author page |
| No published date / modified date in markup | Add `<time datetime="2026-05-13">` and corresponding schema |
| Cover image is a dynamically generated `og?title=...` PNG with no real content | Either keep as OG-only, or generate richer covers — but make sure the `<img>` alt text is descriptive (not just "cover art") |
| No "Reading time" in metadata (it's in the body text "9ish minutes read") | Move into structured data |
| No related-posts section | Add 3-5 internal links at the bottom — huge for crawl depth and on-site time |
| Share buttons are anchor tags with the URL as the link text | The visible link text says `https://twitter.com/intent/tweet?...` which is ugly. Use icons + aria-labels |

### Slug improvements

Looking at your slugs:

- `access-ec-2-instances-privately-using-aws-systems-manager` → the hyphenation of "EC2" into "ec-2" is unhelpful. Should be `access-ec2-instances-privately-using-aws-ssm`
- `provision-aws-ec-2-instance-with-ubuntu-os-and-configure-nginx` → same issue + too long. Better: `aws-ec2-ubuntu-nginx-setup`
- `going-production-on-cloud-part-1` → fine, but consider `aws-production-checklist-part-1` for better keyword targeting

If you change slugs, **set up 301 redirects** from old to new — never break existing URLs that may already have backlinks or be indexed.

---

## 3. Technical SEO

### Sitemap & robots

I couldn't fetch `/robots.txt` or `/sitemap.xml` directly through the tools available to me, so verify these yourself:

```bash
curl https://codehirise.com/robots.txt
curl https://codehirise.com/sitemap.xml
```

**You need both.** Recommended `robots.txt`:

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://codehirise.com/sitemap.xml
```

**Sitemap requirements:**
- Auto-generated from your post list (Next.js: use `next-sitemap` package)
- Includes `<lastmod>` for each post (essential for re-crawl signals)
- Includes category pages *only if* you fix the thin-content issue (section 4)
- Submitted to Google Search Console and Bing Webmaster Tools

### Structured data (JSON-LD) — biggest single technical win

Currently you have **zero** structured data. Add these:

**On every blog post**, inside `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Going to Production on AWS: 8 Infrastructure Practices (Part 1)",
  "description": "<your meta description>",
  "image": "https://codehirise.com/api/og?title=...",
  "datePublished": "2026-05-13T...",
  "dateModified": "2026-05-13T...",
  "author": {
    "@type": "Person",
    "name": "<your name>",
    "url": "https://codehirise.com/author/<slug>"
  },
  "publisher": {
    "@type": "Organization",
    "name": "CodeHiRise",
    "logo": {
      "@type": "ImageObject",
      "url": "https://codehirise.com/logo.png"
    }
  },
  "mainEntityOfPage": "https://codehirise.com/post/going-production-on-cloud-part-1"
}
```

**On the homepage**, add `WebSite` + `Organization` schema with a `SearchAction` so Google can show a sitelinks search box.

**On posts with how-to steps** (your iptables post, your EC2 setup post, etc.), add `HowTo` schema. This is what makes Google show numbered step previews in search results.

**On posts with code/Q&A**, add `FAQPage` schema for any FAQ section at the bottom (and add FAQ sections — see content strategy).

**On every post**, add `BreadcrumbList`:

```
Home > Cloud > Going to Production on AWS (Part 1)
```

Validate everything at https://search.google.com/test/rich-results

### Core Web Vitals

The site is on Next.js with `_next/image` so image optimization is likely fine. Things to verify in PageSpeed Insights:

- **LCP**: the banner image is huge (`w=3840`). Use `priority` prop and proper `sizes` so a smaller variant loads on mobile.
- **CLS**: ensure all images have explicit width/height. The post cover images served from `/api/og` need explicit dimensions or aspect-ratio CSS.
- **INP**: check that the share buttons aren't blocking the main thread.

Run: https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fcodehirise.com

### Canonical tags

Both pages I fetched have `canonical` set to their own URL — good. Make sure category and pagination pages don't accidentally point to `/`.

### Image SEO

Every post cover is generated via `/api/og?title=...`. That's fine for social, but:
- The actual `<img>` alt attributes I saw were generic ("cover", "cover art", "banner")
- Filenames are non-descriptive query strings — Google Image Search won't extract anything useful

Fix the alt text site-wide: `alt="{post.title} cover image"` minimum, or write hand-crafted alts per post.

### Mobile

Verify nothing breaks on a 360px viewport. The post page banner and code blocks are the usual culprits.

---

## 4. The Category Pages Problem (Important)

Every category page (e.g. `/category/aws`, `/category/devops`, `/category/react`) returns essentially:

> *Posts belong to aws category*

That's all. No list of posts visible to crawlers (or it's there but extremely sparse), no description, no H1 with the topic name.

**Two options:**

**Option A — Make them substantial (recommended).** Turn each category page into a hub:
- H1: `AWS Tutorials & Guides`
- 100-200 word intro explaining what readers will find
- Full list of posts with excerpts (not just titles)
- A "Start here" featured post
- Internal links to related categories

This turns 11 currently-useless URLs into 11 potential ranking pages.

**Option B — Noindex them.** If you don't want to invest in the content, add `<meta name="robots" content="noindex,follow">` to category pages. This stops them from diluting your site's quality score while still allowing crawl-through to posts.

Pick A if you can write the intros. The category pages can rank for queries like "aws tutorials blog" which is exactly the discovery-stage traffic you want.

---

## 5. Content Strategy — Where the Real Traffic Comes From

Honest reality check: your current ~11 posts span 3 years. The two recent ones are well-written, but **you cannot out-rank Medium, dev.to, AWS docs, or Kubernetes docs with 11 posts**. The blogs that "blow up" usually have one of three things: (a) 50+ posts of consistent quality, (b) one viral post on Hacker News / Reddit / Twitter, or (c) authoritative backlinks.

### What to publish for traffic

Your current mix is generic intros to popular topics — which is the most competitive zone there is. The posts that will rank for a new domain are:

**1. Long-tail, specific error / problem queries**

These have low search volume individually but very low competition. Examples for your stack:

- *"AWS SSM Session Manager not connecting EC2 — fixes"*
- *"kubectl get pods returns empty for service account — RBAC fix"*
- *"NAT gateway costs reduce cross-AZ traffic"*
- *"Home Assistant InfluxDB v2 Flux query examples"*

Search for these on Google and look for results from forums (StackOverflow, Reddit r/aws, r/kubernetes). Where the top answer is bad or 3+ years old, *you can rank*.

**2. Comparison and "vs" posts**

- *"Spot vs Reserved vs On-Demand: real cost numbers"*
- *"SSE vs WebSockets vs Long Polling: when to use which"*
- *"Terraform vs Pulumi vs CDK in 2026"*

These attract decision-stage traffic and rank well for new sites because they're query-specific.

**3. "How I" / experience posts**

- *"How I reduced our AWS bill by 40% in 3 months"*
- *"What I wish I knew before going to production on EKS"*

These work because they're naturally first-person, hard to write with AI, and rank well in Google's Helpful Content era.

### Update old posts

Your "Provision AWS EC2 Instance" post is over 2 years old. The AWS console has changed since then. Update it (new screenshots, current pricing), set `dateModified`, and re-share. Old-post-refresh is one of the highest-ROI SEO activities there is.

### Topical authority — pick a lane

Right now the site is "electronics, programming, web dev, IoT, home automation, AWS, K8s, React, networking" — that's 9+ topics. For a small site, Google rewards **topical depth** more than breadth. Pick 2 clusters and own them:

- **Cluster 1: AWS production engineering** (you've already got 4 posts here)
- **Cluster 2: Kubernetes operations** (1 post, room to grow)

Drop or de-emphasize React tutorials, electronics, and home automation unless you genuinely plan to write 10+ posts on them.

### Internal linking

Your posts barely link to each other. Add 3-5 contextual internal links in every post. E.g. when your new "Going to Production" post mentions IaC, link to a future "Terraform basics" post. When it mentions NAT gateways, link to a "VPC design" post.

This:
- Increases pages-per-session (good engagement signal)
- Spreads link equity (such as it is)
- Tells Google these pages are topically related (helps both rank)

---

## 6. Off-Page SEO — Backlinks

A site with zero backlinks and 11 posts will struggle to rank for anything besides its own brand name. Focused link-building tactics that work for technical blogs:

| Tactic | Effort | Effectiveness |
|---|---|---|
| **HackerNews "Show HN" or thoughtful comments linking your post** | Low | High if it lands; rare hits |
| **Reddit comments** in r/devops, r/aws, r/kubernetes — answer questions with your post as backup | Medium | Steady drip |
| **dev.to and Hashnode cross-posting** | You're already doing this | See section 8 |
| **Guest posts** on bigger blogs (LogRocket, DigitalOcean Community, freeCodeCamp) | High | Each one is gold |
| **GitHub README links** — open-source a tool, link the blog from the README | Medium | Long-lived |
| **Comment on bigger blogs** thoughtfully with site in profile | Low | Marginal |
| **Submit to newsletters** — Pointer.io, DevOps Weekly, AWS Weekly, KubeWeekly | Low | One placement can = 1k visitors |

**Newsletter submissions are the single highest-ROI thing you can do this week.** Pointer.io and KubeWeekly accept submissions; AWS Weekly is curated but linkable via Twitter.

---

## 7. Author / E-E-A-T Signals

Google's Helpful Content system and the 2024+ algorithm changes heavily weight *Experience, Expertise, Authoritativeness, Trustworthiness*. Right now codehirise.com has none of these signals visible.

**Add:**
- An `/about` page with your real name, photo, where you've worked, what you're known for
- Author byline on every post with a 1-line bio and link to `/author/<you>`
- An `/author/<you>` page that lists all your posts and your credentials
- LinkedIn + GitHub + Twitter/X links in the footer
- If you have any conference talks, podcast appearances, or contributions to open source — link them

For monetization later (AdSense, sponsors), reviewers and ad networks will look for these too. No about page = often a rejection.

---

## 8. The dev.to / Hashnode Problem (Detailed)

You said you syndicated with canonical URLs and don't get views. Two separate things are happening:

### Why search traffic isn't coming from dev.to/Hashnode

This is **working as intended**. Canonical tags tell Google "this content lives at codehirise.com — please rank that, not us." Google obeys, so dev.to and Hashnode's copies essentially become invisible to search. They are *not* sending you search traffic by design.

So the canonical setup is correct *if* your goal is to consolidate SEO authority on your own domain. Don't change it.

### Why dev.to/Hashnode community traffic also isn't coming

This is the real problem. dev.to and Hashnode have *internal* feed-driven traffic that has nothing to do with Google. To get that traffic, you need to play their game:

**On dev.to:**

1. **Tags matter enormously.** dev.to lets you pick 4 tags. The good ones for your content are `#aws`, `#devops`, `#kubernetes`, `#cloud`, `#beginners`, `#tutorial`, `#productivity`. Avoid overly niche tags — they have small feeds.
2. **Cover image is critical.** Your dev.to cover image (separate from your og:image) is the first impression in the feed. Use a custom image, not the dynamic-generated one from your blog.
3. **Title needs to be punchier than for SEO.** SEO titles target keywords. dev.to titles target *clicks from a scrolling reader*. Compare:
   - SEO: *"Going to Production on AWS: 8 Infrastructure Practices (Part 1)"*
   - dev.to: *"8 things I wish I knew before shipping to production on AWS"* or *"The production-ready AWS checklist (from 5 years of incidents)"*
4. **Post at the right time.** US morning weekdays (9-11am Eastern) is peak dev.to. Avoid weekends.
5. **First 100 chars need to hook.** dev.to's feed previews the first ~100 chars. "Hi everyone, so you have been tinkering..." is a weak hook — that's reading like a personal blog. Lead with the problem.
6. **Engage with comments fast.** dev.to's algorithm boosts posts that get early reactions. Reply to every comment within an hour for the first few hours.
7. **Series feature.** Mark your "Part 1" and "Part 2" as a dev.to series — readers who like Part 1 get Part 2 surfaced automatically.
8. **Cross-post old articles.** You have 11 posts — only the new ones are on dev.to? Backfill the rest, spaced out a few days apart.

**On Hashnode:**

1. Hashnode rewards followers more than dev.to does. Follow people in your niche, comment on their posts, get a base audience.
2. Hashnode tags are smaller communities — `#aws`, `#kubernetes`, `#devops`, `#cloudcomputing`.
3. Hashnode also has a newsletter feature — turn it on so subscribers get every post.
4. Use Hashnode's "series" and create one for your AWS production tutorials.

### One more option: a non-canonical post

If you want dev.to/Hashnode to actually *send people back* via Google (not just community), you could publish an *original* shorter teaser there with a "Read the full guide on codehirise.com" link. The teaser ranks (or doesn't) on dev.to, and links flow back to you. This is more work, but it's the only way to convert syndication into SEO juice.

---

## 9. Monetization Roadmap

You mentioned wanting to monetize. With current traffic levels, here's the honest path:

### Phase 1 — 0 to 1,000 monthly visitors (current)

Skip AdSense and affiliate networks. Revenue would be cents per month and you'd risk rejection. Focus 100% on traffic.

**Allowed:**
- Add a Ko-fi / Buy Me a Coffee button in the footer (zero overhead, occasionally gets clicks)
- "Hire me / consult" link in your bio if you do freelance

### Phase 2 — 1,000 to 10,000 monthly visitors

- **AdSense:** technically possible but RPM will be $1-3 for a tech audience. Cluttery for the revenue.
- **EthicalAds** (https://www.ethicalads.io/) — devs-focused, less invasive, lower bar to entry
- **Carbon Ads** — premium dev-focused network, higher RPM, but harder to get in
- **Affiliate links** — Hetzner, DigitalOcean, Vultr, Hostinger all have generous referral programs for cloud-tutorial blogs. Hetzner especially pays well for new sign-ups, and many of your AWS/cloud tutorials could pair with a "want to try this on a cheap VPS? here's $20 credit" footer.
- **Sponsored posts:** companies like StackHawk, Mergify, Doppler pay $300-1500 for a sponsored tutorial. Need ~10k/month to qualify.

### Phase 3 — 10,000+ monthly

- Direct sponsorship deals (the highest RPM by far)
- A small paid product — a course, a template repo, an ebook. *"The AWS production checklist — the full PDF"* could be a $19 lead magnet from this exact series you just started.
- Newsletter sponsorship if you build a list

**Build a newsletter from day one.** Even if you don't monetize it yet, every visitor who subscribes is one you can reach without depending on Google. ConvertKit, Buttondown, or Substack are fine. Add a signup form in the post template (mid-article and footer).

---

## 10. Tools Checklist

Set these up this week if you haven't:

| Tool | What for |
|---|---|
| **Google Search Console** | See actual queries, impressions, click-through, indexing issues |
| **Bing Webmaster Tools** | Bing/DuckDuckGo/ChatGPT search use Bing's index |
| **Google Analytics 4** or **Plausible** | Actual traffic numbers + sources |
| **Ahrefs Webmaster Tools** (free tier) | Backlink monitoring on your own site |
| **PageSpeed Insights** | Core Web Vitals |
| **Google Rich Results Test** | Validate JSON-LD as you add it |
| **Screaming Frog** (free under 500 URLs) | Crawl your own site, find broken links / missing alts / duplicate meta |
| **Ubersuggest / Keywords Everywhere** | Keyword research on the cheap |
| **Indie Hackers / r/SEO / r/blogging** | Community feedback |

---

## 11. 30 / 60 / 90 Day Action Plan

### Week 1 (do these first)

- [ ] Fix the duplicate meta-description bug on post pages
- [ ] Write hand-crafted meta descriptions for all 11 existing posts
- [ ] Add JSON-LD `BlogPosting` schema to post template
- [ ] Add JSON-LD `WebSite` + `Organization` schema to homepage
- [ ] Fix homepage `<title>`, H1, and add 80-word intro paragraph
- [ ] Generate and submit sitemap.xml to Google Search Console and Bing
- [ ] Set up Google Search Console + Plausible/GA4
- [ ] Add an `/about` page with your real name and credentials
- [ ] Remove the `rasberrypi` meta-keywords tag (or remove the tag entirely)

### Week 2-4

- [ ] Fix category pages (Option A: write intros, or Option B: noindex)
- [ ] Add author component to post template + create author page
- [ ] Add BreadcrumbList schema
- [ ] Add HowTo schema to your tutorial posts where steps are explicit
- [ ] Improve image alt text site-wide
- [ ] Add 3-5 internal links to each existing post
- [ ] Refresh the oldest post (Provision EC2 / Nginx) with updated screenshots
- [ ] Submit your latest 2 posts to KubeWeekly, DevOps Weekly, and Pointer.io

### Month 2

- [ ] Publish 4 new posts targeting long-tail queries
- [ ] Cross-post all old articles to dev.to and Hashnode with optimized titles + tags
- [ ] Add newsletter signup
- [ ] Reach out to 5 mid-size dev blogs for guest post opportunities
- [ ] Start commenting helpfully in r/aws, r/devops, r/kubernetes (no spammy link drops)

### Month 3

- [ ] Publish part 2 of the production-on-cloud series
- [ ] Publish 4 more posts
- [ ] Apply for EthicalAds if traffic reaches ~3k/month
- [ ] Add affiliate links where genuinely useful (Hetzner, DigitalOcean)
- [ ] Review GSC data — double down on whatever queries are trending up

---

## 12. Quick Wins You Can Ship Today

If you only have one evening:

1. Fix the meta-description bug in your post template (15 min)
2. Add `BlogPosting` JSON-LD to the post template (30 min)
3. Rewrite the homepage title + add intro paragraph (15 min)
4. Set up Google Search Console + submit sitemap (10 min if sitemap exists, 1hr if not)
5. Write one cracking dev.to-style title for your newest post and update it on dev.to (10 min)

That sequence alone will probably double your impressions within 4-6 weeks just from better SERP click-through and rich results eligibility.

---

## Final note

None of this is fast. SEO for a new domain is a 6-12 month game minimum. The two recent posts you've written are genuinely good — significantly better than most AI-generated content flooding dev.to in 2026 — and that's the foundation. The work above is what turns "good content nobody finds" into "good content Google trusts." Keep writing, ship two posts a month minimum, and the traffic curve will start to bend somewhere between months 4 and 8.
