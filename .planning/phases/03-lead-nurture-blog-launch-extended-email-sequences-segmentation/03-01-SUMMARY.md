---
phase: "03-lead-nurture-blog-launch-extended-email-sequences-segmentation"
plan: "01"
subsystem: "blog-content-foundation"
tags: ["blog", "mdx", "content-migration", "redirects", "reading-time"]
dependency_graph:
  requires: []
  provides:
    - "content/blog/*.mdx — 4 MDX case study files readable by getBlogPosts/getBlogPostBySlug"
    - "src/lib/blog.ts — getBlogPosts() and getBlogPostBySlug() exports for Plan 02 blog UI"
    - "/articles/* → /blog/* redirects for Plan 02 blog routes"
  affects:
    - "Plan 02 (blog listing + article pages) — depends on src/lib/blog.ts and content/blog/"
    - "Plan 03 (nurture emails) — Day 7 email links to /blog/[slug] slugs now available"
tech_stack:
  added:
    - "next-mdx-remote — RSC-compatible MDX rendering (installed, used by Plan 02)"
    - "gray-matter — YAML frontmatter extraction from MDX files"
    - "reading-time — per-article read time calculation (275 WPM, Math.ceil minutes)"
  patterns:
    - "File-backed blog discovery: fs/promises + gray-matter + readdir at request time"
    - "reading-time receives content body only (post gray-matter strip) to avoid frontmatter inflation"
key_files:
  created:
    - "src/lib/blog.ts"
    - "content/blog/cervical-cancer-screening-tool.mdx"
    - "content/blog/lloyds-list-ocr-pipeline.mdx"
    - "content/blog/ai-resume-reviewer.mdx"
    - "content/blog/chatbotly-nlp-analytics.mdx"
  modified:
    - "src/app/articles/page.tsx — replaced full page with redirect('/blog')"
    - "src/app/articles/[slug]/page.tsx — replaced full page with redirect to /blog/[slug]"
    - "package.json — added next-mdx-remote, gray-matter, reading-time"
decisions:
  - "reading-time default import (not named) — package exports as CJS default function; named export does not exist in this version"
  - "satisfies BlogPost on return object — TypeScript structural validation without widening"
  - "Articles redirects are server components only — redirect() throws internally (NEXT_REDIRECT), no try/catch needed"
  - "MDX tags strip # prefix from articles.ts source (e.g. #AIforHealth -> AIforHealth) — cleaner YAML array values"
metrics:
  duration: "~25 minutes"
  completed: "2026-05-15"
  tasks_completed: 3
  tasks_total: 3
  files_created: 6
  files_modified: 3
  requirements_addressed: ["BLOG-03", "CONTENT-01", "CONTENT-02", "CONTENT-03"]
---

# Phase 03 Plan 01: MDX Blog Foundation and Content Migration Summary

**One-liner:** File-backed MDX blog with gray-matter + reading-time, 4 case study articles migrated from articles.ts with EU Horizon references removed, /articles/* permanently redirecting to /blog/*.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Install MDX deps and create blog data library | 77b5cb4 | src/lib/blog.ts, package.json |
| 2 | Migrate 4 case studies from articles.ts to MDX | ea4ab93 | content/blog/*.mdx (4 files) |
| 3 | Add /articles redirects to /blog | 8271016 | src/app/articles/page.tsx, src/app/articles/[slug]/page.tsx |

## What Was Built

**src/lib/blog.ts** — Server-side data access layer exporting:
- `BlogPost` interface (slug, title, excerpt, coverImage, category, tags, readingTime)
- `BlogPostWithContent` extends BlogPost with `content` (MDX body, no frontmatter)
- `getBlogPosts()` — reads all .mdx files from /content/blog/, extracts frontmatter, calculates reading time
- `getBlogPostBySlug(slug)` — returns single post with content for rendering; returns null if not found

**content/blog/ (4 MDX files):**
- cervical-cancer-screening-tool.mdx — EU Horizon metrics removed; "Why This Matters" and "What's Next" sections rewritten to remove grant consortium language
- lloyds-list-ocr-pipeline.mdx
- ai-resume-reviewer.mdx
- chatbotly-nlp-analytics.mdx

All 4 files: `category: "Case Study"`, valid YAML frontmatter, tags without `#` prefix.

**Redirect pages:**
- `/articles` → `/blog` (server component, redirect() fires before render)
- `/articles/[slug]` → `/blog/[slug]` (async params pattern, same as existing article page)

## Deviations from Plan

None — plan executed exactly as written.

The reading-time import style (default vs named) was flagged in the plan as a potential issue. Verified at install time: the package exports a CJS default function, so `import readingTime from 'reading-time'` is correct. No deviation needed.

## Verification Results

1. `ls content/blog/*.mdx` — 4 files present: PASS
2. `grep -r "EU HORIZON" content/blog/` — zero output: PASS
3. `grep -r "Flowmorph" content/blog/` — zero output: PASS
4. `grep "category:" content/blog/*.mdx` — all 4 show `category: "Case Study"`: PASS
5. `npx tsc --noEmit` — no errors: PASS
6. `grep -n "redirect" src/app/articles/page.tsx` — redirect('/blog') present: PASS
7. `grep -n "redirect" src/app/articles/[slug]/page.tsx` — redirect to /blog/[slug] present: PASS
8. `npm run build` — 13 pages compiled, zero errors: PASS

## Self-Check: PASSED

All created files verified present. All 3 task commits verified in git log (77b5cb4, ea4ab93, 8271016).
