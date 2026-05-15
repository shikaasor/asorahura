---
phase: "03-lead-nurture-blog-launch-extended-email-sequences-segmentation"
plan: "02"
subsystem: "blog-ui"
tags: ["blog", "listing-page", "article-page", "mdx", "category-filter", "cta-block"]
dependency_graph:
  requires:
    - "src/lib/blog.ts from Plan 01 — getBlogPosts() and getBlogPostBySlug()"
    - "content/blog/*.mdx from Plan 01 — 4 MDX case study files"
    - "next-mdx-remote from Plan 01 — RSC-compatible MDX rendering"
  provides:
    - "/blog — responsive listing page with card grid and category filter pills"
    - "/blog/[slug] — MDX article page with cover image, header metadata, and CTA block"
    - "src/components/blog/BlogCTABlock — reusable CTA block routing by post type"
    - "src/components/blog/CategoryFilter — client-side pill filter component"
  affects:
    - "Plan 03 (nurture emails) — Day 7 email can now link to rendered /blog/[slug] URLs"
    - "Phase 4 (nav polish) — /blog now a live route to add to site navigation"
tech_stack:
  added: []
  patterns:
    - "Server Component + thin client wrapper pattern: page.tsx fetches, BlogListingClient manages filter state"
    - "compileMDX (next-mdx-remote/rsc) for server-side MDX rendering in article page"
    - "generateStaticParams for SSG of all 4 blog slugs at build time"
    - "Array.from(new Set(...)) pattern for deriving category list without TypeScript downlevel iteration errors"
key_files:
  created:
    - "src/components/blog/BlogCTABlock.tsx"
    - "src/components/blog/CategoryFilter.tsx"
    - "src/app/blog/page.tsx"
    - "src/app/blog/BlogListingClient.tsx"
    - "src/app/blog/page.module.css"
    - "src/app/blog/[slug]/page.tsx"
    - "src/app/blog/[slug]/article.module.css"
  modified: []
decisions:
  - "Server Component + client wrapper pattern for blog listing — page.tsx fetches server-side, BlogListingClient owns useState for filter; avoids making entire page client-side"
  - "Array.from(new Set()) over spread — TypeScript target does not support Set iteration via spread without downlevelIteration flag"
  - "compileMDX from next-mdx-remote/rsc — same library installed in Plan 01, RSC-compatible, no extra install needed"
  - "category === 'Case Study' for CTA type routing — all 4 current posts are case studies; educational type ready for future posts"
metrics:
  duration: "~20 minutes"
  completed: "2026-05-15"
  tasks_completed: 3
  tasks_total: 3
  files_created: 7
  files_modified: 0
  requirements_addressed: ["BLOG-01", "BLOG-02", "BLOG-03", "BLOG-04", "BLOG-05", "CONTENT-02", "CONTENT-03"]
---

# Phase 03 Plan 02: Blog UI — Listing Page, Article Page, CTA Block Summary

**One-liner:** /blog listing page with responsive 3-col card grid + category filter pills, /blog/[slug] article page with compileMDX server-side rendering and dark BlogCTABlock routing case studies to /engage.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Build BlogCTABlock and CategoryFilter components | 28ede3e | src/components/blog/BlogCTABlock.tsx, src/components/blog/CategoryFilter.tsx |
| 2 | Build /blog listing page with card grid and category filtering | 8334108 | src/app/blog/page.tsx, src/app/blog/BlogListingClient.tsx, src/app/blog/page.module.css |
| 3 | Build /blog/[slug] article page with MDX rendering and CTA block | 672701d | src/app/blog/[slug]/page.tsx, src/app/blog/[slug]/article.module.css |

## What Was Built

**src/components/blog/BlogCTABlock.tsx** — Dark-box CTA component:
- Accepts `type: 'case-study' | 'educational'`
- Case study: heading "See how I can do this for your business." → 'Work With Me' link to /engage
- Educational: heading "Take the Free AI Readiness Assessment." → 'Take the Assessment' link to /assessment
- Inline styles matching site dark aesthetic (#0a0a0a background, #ffffff text)

**src/components/blog/CategoryFilter.tsx** — Client component pill filter:
- Renders 'All' + all unique categories as pill buttons
- Active pill: white background, dark text; inactive: transparent, grey text
- `onChange` callback for parent state updates

**src/app/blog/page.tsx + BlogListingClient.tsx** — Blog listing:
- Server Component fetches posts via getBlogPosts(), passes to client wrapper
- CategoryFilter + 3-col responsive grid (1 → 2 → 3 cols at 768px / 1024px)
- Each card: cover image (fill layout), category tag pill, title, excerpt (3-line clamp), reading time
- No date displayed on any card

**src/app/blog/[slug]/page.tsx** — Article page:
- compileMDX from next-mdx-remote/rsc for server-side MDX rendering
- generateStaticParams pre-generates all 4 slugs at build time (SSG)
- Article header: category tag + reading time
- Cover image with 16:9 aspect ratio
- BlogCTABlock at end — all current posts are Case Study → routes to /engage
- Back link ("All Articles") to /blog with ArrowLeft lucide icon

**Build output:** 18 pages compiled successfully. /blog and /blog/[slug] (4 static routes) all present.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript Set spread error in BlogListingClient**
- **Found during:** Task 2 (tsc --noEmit verification)
- **Issue:** `[...new Set(...)]` throws TS2802 — Set can only be iterated with `--downlevelIteration` or `--target es2015+`
- **Fix:** Changed to `Array.from(new Set(...))` which works at any TypeScript target
- **Files modified:** src/app/blog/BlogListingClient.tsx
- **Commit:** 8334108 (fix included in task commit)

## Verification Results

1. `npx tsc --noEmit` — zero errors: PASS
2. `npm run build` — 18 pages compiled, all 4 /blog/[slug] routes statically generated: PASS
3. Key links verified: getBlogPosts in page.tsx, getBlogPostBySlug in [slug]/page.tsx, BlogCTABlock in [slug]/page.tsx, /engage and /assessment hrefs in BlogCTABlock: PASS
4. No date field on card: grep confirmed no date rendered: PASS
5. generateStaticParams exported from [slug]/page.tsx: PASS

## Self-Check: PASSED
