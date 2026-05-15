# Phase 3: Lead Nurture — Blog Launch + Extended Email Sequences - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the blog as a second funnel driver (pulling readers to the assessment) and extend the email system with 5-email nurture sequences per cold/warm/hot segment (Day 3, 7, 14, 30 triggers). The existing /articles page (long-form case studies) gets merged into /blog. Content migration removes remaining EU Horizon and Flowmorph references from articles data.

Creating posts, comments, search, and subscription management are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Blog listing layout
- Card grid layout (2-3 columns)
- Cover image on each card (image required per post)
- Each card shows: title + excerpt, reading time, category tag
- Category filtering enabled — tabs or pills above the grid to filter by category
- No date published on cards

### Content model
- MDX files in /content/blog/ — authored in Markdown+JSX, committed to repo, no CMS dependency
- Existing /articles page (long-form case studies at /articles/[slug]) is merged into /blog/[slug]
- /articles/* URLs should redirect to /blog/* (preserve any existing links)
- All existing article content from src/lib/articles.ts migrates to MDX files
- Case studies are tagged as 'Case Study' category; any new editorial posts get their own categories (e.g. 'AI Strategy', 'How-To')
- Launch with the existing 4 case study articles converted to MDX — no new articles needed

### Email sequence copy
- Day 3/7/14/30 nurture emails are LLM-generated per send (same pattern as Phase 2 initial email — Gemini via OpenAI SDK)
- Sequence arc per segment (5 emails: initial already sent in Phase 2, so 4 follow-ups at Day 3/7/14/30):
  - Email 2 (Day 3): Problem deepening — re-surface their specific pain point from assessment answers
  - Email 3 (Day 7): Case study — a relevant project match, links to the corresponding /blog article
  - Email 4 (Day 14): Process reveal — explain the build/implementation approach, what working with Asor looks like
  - Email 5 (Day 30): Offer — the direct ask, tailored by segment
- Segment-specific CTAs:
  - Cold (<40): softer CTA — read a blog post or re-take the assessment
  - Warm (40-69): book discovery call → /checkout?tier=discovery
  - Hot (70+): book strategy session → /checkout?tier=strategy
- Email 3 (case study) links to a relevant /blog article matching the prospect's industry/context

### Blog CTA block
- End-of-post section only — no sticky sidebar or floating footer bar
- High-contrast dark box (dark background, light text) — consistent with existing site CTA aesthetic
- CTA varies by post type:
  - Case study posts: primary CTA → /engage ("See how I can do this for your business")
  - Educational/strategy posts: primary CTA → /assessment ("Take the Free AI Readiness Assessment")
- CTA block is a reusable component — accepts `type: "case-study" | "educational"` prop or defaults based on post frontmatter

### Claude's Discretion
- Exact grid column breakpoints and card spacing
- MDX rendering library choice (next-mdx-remote vs @next/mdx vs contentlayer)
- Reading time calculation approach
- Exact LLM prompt wording for each email in the nurture arc
- How EU Horizon and Flowmorph references in articles.ts are cleaned before migration to MDX

</decisions>

<specifics>
## Specific Ideas

- The /articles page already exists with full long-form content in src/lib/articles.ts — this data should be the source for MDX migration, not rewritten from scratch
- EU Horizon reference ("EU HORIZON €2.25M") currently appears in articles.ts metrics field for the cervical cancer article — remove or replace with neutral outcome language during migration
- The existing /articles/[slug] page.tsx has its own layout and styling — the new /blog/[slug] should use a clean article reading layout consistent with the site's dark aesthetic
- Email nurture arc is described as: "Problem deepening → Case study → Process reveal → Offer" — Claude designs the exact copy per segment within this arc

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-lead-nurture-blog-launch-extended-email-sequences-segmentation*
*Context gathered: 2026-05-15*
