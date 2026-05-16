# Phase 3: Lead Nurture — Blog Launch + Extended Email Sequences - Research

**Researched:** 2026-05-15
**Domain:** Blog content system + segment-based email nurture automation
**Confidence:** HIGH

## Summary

Phase 3 builds a dual-funnel engine: a blog powered by MDX files (with article migration from existing src/lib/articles.ts data) drives readers to the assessment, while extended email nurture sequences (Day 3, 7, 14, 30) per segment (cold/warm/hot) convert assessment takers into scheduled calls.

The blog uses @next/mdx (already configured in next.config.mjs), with file-backed content in /content/blog/ migrated from existing articles. The email system extends Phase 2's LLM-driven approach: Gemini 2.0 Flash via OpenAI SDK generates segment-specific subject + body per email stage (Problem Deepening → Case Study → Process Reveal → Offer). Resend's scheduledAt API handles delivery timing; natural language like "in 3 days" works through May 2026.

All requirements map to three technical areas: (1) blog listing + reading time + category filtering, (2) MDX article migration + CTA routing, (3) segment-aware email copy generation + Resend integration.

**Primary recommendation:** Use @next/mdx (already configured); render MDX files server-side with next-mdx-remote/rsc for dynamic metadata extraction; calculate reading time with reading-time npm package; generate segment-specific nurture copy via Gemini with structured segment-angle prompts per email stage.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Blog listing: card grid layout (2-3 columns), cover image required per post, title + excerpt + reading time + category tag visible, category filtering enabled, no date published
- Content model: MDX files in /content/blog/, authored in Markdown+JSX, committed to repo, no CMS
- Existing /articles page merged into /blog; /articles/* redirects to /blog/* (preserve existing links)
- All article content from src/lib/articles.ts migrates to MDX files
- Case studies tagged 'Case Study'; new editorial posts get own categories
- Email sequences: Day 3/7/14/30 LLM-generated per send (Gemini via OpenAI SDK, same as Phase 2)
- Email arc: Problem deepening (Day 3) → Case study with /blog link (Day 7) → Process reveal (Day 14) → Offer (Day 30)
- Segment-specific CTAs: Cold → blog/reassessment, Warm → /checkout?tier=discovery, Hot → /checkout?tier=strategy
- Blog CTA block: End-of-post only (no sticky sidebar), dark box, case study posts → /engage, educational posts → /assessment
- CTA block: reusable component accepting type prop

### Claude's Discretion
- Exact grid column breakpoints and card spacing
- MDX rendering library choice (next-mdx-remote vs @next/mdx vs contentlayer) — **RECOMMENDATION: next-mdx-remote/rsc for file-backed blog with dynamic frontmatter extraction**
- Reading time calculation approach — **RECOMMENDATION: reading-time npm package, 275 WPM baseline**
- Exact LLM prompt wording for each email in the nurture arc
- How EU Horizon and Flowmorph references in articles.ts are cleaned before migration to MDX

### Deferred Ideas (OUT OF SCOPE)
- Creating posts, comments, search, and subscription management

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EMAIL-03 | Send Day 3 nurture email (problem deepening) per segment | LLM-generated copy via Gemini, segment angle prompts, Resend scheduledAt "in 3 days" |
| EMAIL-04 | Send Day 7 nurture email (case study) with /blog link | Case study matching logic, blog slug linking, segment-specific CTAs |
| EMAIL-05 | Send Day 14 nurture email (process reveal) | Process-focused LLM generation per segment |
| EMAIL-06 | Send Day 30 nurture email (offer) with tier CTA | Tier-mapping logic: cold → reassessment, warm → discovery, hot → strategy |
| BLOG-01 | Blog listing page with card grid, category filtering | @next/mdx + file-backed structure, category extraction from frontmatter |
| BLOG-02 | Individual blog article page with clean reading layout | MDX rendering, frontmatter metadata display |
| BLOG-03 | Reading time calculation on each article | reading-time npm library, word count extraction |
| BLOG-04 | Blog CTA block (reusable component) | Dark box styling, type-prop routing (case-study vs educational) |
| CONTENT-01 | Migrate 4 case studies from articles.ts to MDX files | Data transformation, EU Horizon/Flowmorph reference removal |
| CONTENT-02 | Create /blog/[slug] route for article pages | Dynamic route handler, metadata extraction |
| CONTENT-03 | Redirect /articles/* to /blog/* | Next.js redirect configuration |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @next/mdx | latest (included) | File-backed MDX rendering in Next.js 15 | Already configured in next.config.mjs; integrates directly with App Router; no extra build step |
| next-mdx-remote | latest | RSC-compatible MDX rendering with dynamic frontmatter | Server-side rendering without pre-serialization; extracts metadata (reading time, category, cover image) from frontmatter on-demand |
| Gemini 2.0 Flash | via OpenAI SDK v6.37+ | LLM for segment-specific email generation | Same pattern as Phase 2; Gemini supports JSON structured output; compatible with existing llm.ts setup via OpenAI SDK baseURL |
| Resend | v6.12.3 (current) | Email delivery with schedule API | Supports natural language scheduledAt ("in 3 days", "in 7 days"); native error handling; integrates with Phase 2 sendAssessmentEmailSequence |
| reading-time | npm latest | Reading time calculation | Industry standard (275 WPM); handles markdown/HTML; lightweight |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| gray-matter | npm latest | YAML frontmatter extraction from MDX | Extract title, cover image, category from file headers before rendering |
| @react-email/components | v1.0.12 (current) | Email template components | Optional: use for email preview during development (Phase 2 uses text-only; same approach for nurture) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @next/mdx + next-mdx-remote/rsc | contentlayer | Contentlayer no longer maintained (as of 2025); higher complexity for this use case; don't hand-roll file discovery |
| @next/mdx + next-mdx-remote/rsc | @next/mdx only | @next/mdx alone requires MDX files in app/ directory as routes; doesn't support external /content/ directory without custom build plugins |
| Gemini 2.0 Flash | GPT-4 or Claude | Gemini 2.0 Flash is cost-efficient at scale; Phase 2 already uses it; model shutdown June 1, 2026 — migrate to Gemini 3.1-flash-lite for emails after that date |
| reading-time | Manual word counting | reading-time already installed, handles edge cases (code blocks, markdown syntax), single npm install |

**Installation:**
```bash
npm install next-mdx-remote reading-time gray-matter
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx              # Blog listing (grid + filtering)
│   │   └── [slug]/
│   │       └── page.tsx          # Individual article page
│   ├── articles/
│   │   ├── page.tsx              # Redirect to /blog
│   │   └── [slug]/
│   │       └── page.tsx          # Redirect to /blog/[slug]
│   ├── assessment/
│   │   ├── actions.ts            # Extend sendAssessmentEmailSequence
│   │   └── ...
│   └── engage/
│       └── page.tsx              # CTA destination for cold/warm
├── components/
│   ├── blog/
│   │   ├── BlogCard.tsx          # Grid card: title + excerpt + image + reading time + category
│   │   ├── BlogCTABlock.tsx      # Reusable CTA component (type: case-study | educational)
│   │   └── CategoryFilter.tsx    # Pills/tabs for category filtering
│   └── ...
├── lib/
│   ├── blog.ts                   # Blog file discovery, frontmatter extraction, reading time calculation
│   ├── email.ts                  # Extend with nurture email functions per segment
│   ├── llm.ts                    # Add draftNurtureEmailSequence (separate from Phase 2 initial)
│   └── ...
└── articles.ts                   # (Keep for migration reference; delete after conversion)
content/
└── blog/
    ├── cervical-cancer-screening-tool.mdx
    ├── lloyds-list-ocr-pipeline.mdx
    ├── ai-resume-reviewer.mdx
    └── chatbotly-nlp-analytics.mdx
```

### Pattern 1: File-Backed Blog Discovery + Metadata Extraction
**What:** Read MDX files from /content/blog/ at request time; extract frontmatter (title, excerpt, cover image, category, tags) without pre-build; calculate reading time on-demand.

**When to use:** Dynamic blog listing, category filtering, reading time per article. Supports adding new articles without rebuild (in production, trigger revalidation).

**Example:**
```typescript
// src/lib/blog.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { readingTime } from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags?: string[];
  readingTime: number; // minutes
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const contentDir = path.join(process.cwd(), 'content/blog');
  const files = await fs.readdir(contentDir);
  
  const posts = await Promise.all(
    files
      .filter(f => f.endsWith('.mdx'))
      .map(async (file) => {
        const filePath = path.join(contentDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const { data, content: body } = matter(content);
        
        return {
          slug: file.replace('.mdx', ''),
          title: data.title || '',
          excerpt: data.excerpt || '',
          coverImage: data.coverImage || '',
          category: data.category || 'General',
          tags: data.tags || [],
          readingTime: Math.ceil(
            body.split(/\s+/).length / 275 // 275 WPM baseline
          ),
        };
      })
  );
  
  return posts;
}

export async function getBlogPostBySlug(slug: string) {
  const contentDir = path.join(process.cwd(), 'content/blog');
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const content = await fs.readFile(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  return {
    slug,
    frontmatter: data,
    content: body,
    readingTime: Math.ceil(body.split(/\s+/).length / 275),
  };
}
```

### Pattern 2: Segment-Aware Email Sequence Generation
**What:** Extend llm.ts with a new draftNurtureEmailSequence function that takes (segment, firstName, score, assessmentAnswers) and returns Day 3/7/14/30 emails with subject + body tailored by segment angle.

**When to use:** Day 3, 7, 14, 30 scheduled emails. Different from Phase 2's initial email — separate function, same Gemini setup.

**Example:**
```typescript
// src/lib/llm.ts (extend)
export type NurtureEmailSequence = {
  day3: EmailDraft; // Problem deepening
  day7: EmailDraft; // Case study + /blog link
  day14: EmailDraft; // Process reveal
  day30: EmailDraft; // Offer
};

function getNurtureSegmentAngle(segment: 'cold' | 'warm' | 'hot'): string {
  if (segment === 'cold') {
    return "Educational angle — surface cost of the problem, show case studies proving AI impact. Soften CTA to blog/reassessment. Don't pitch services yet.";
  }
  if (segment === 'warm') {
    return "Proof angle — share case studies matching their readiness level. Show social proof. Soft CTA to discovery call.";
  }
  return "Urgency + Direct Ask angle — they're ready to build. Direct CTA to strategy session. Emphasize timeline and ROI.";
}

export async function draftNurtureEmailSequence(params: {
  firstName: string;
  segment: 'cold' | 'warm' | 'hot';
  score: number;
  assessmentAnswers?: Record<number, string>;
  casestudySlug?: string; // For Day 7 blog link
}): Promise<NurtureEmailSequence> {
  const { firstName, segment, score, assessmentAnswers, casestudySlug } = params;
  const angle = getNurtureSegmentAngle(segment);

  // Day 3: Problem deepening
  // Day 7: Case study with blog link
  // Day 14: Process reveal
  // Day 30: Offer with segment-specific CTA

  const systemPrompt =
    "You are Asor Ahura drafting personalized follow-up emails. Return valid JSON with keys: day3, day7, day14, day30. Each has: subject (string), body (string with \\n for line breaks). No markdown, no code fences.";

  const userPrompt = `Draft nurture email sequence for:
Name: ${firstName}
Score: ${score}/100
Segment: ${segment}
Segment angle: ${angle}
Day 7 should include a blog link to: https://asorahura.com/blog/${casestudySlug || 'cervical-cancer-screening-tool'}

Return JSON only.`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.LLM_MODEL || "gemini-2.0-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw) as NurtureEmailSequence;
    
    if (parsed.day3 && parsed.day7 && parsed.day14 && parsed.day30) {
      return parsed;
    }
    return buildNurtureFallback(firstName, segment);
  } catch {
    return buildNurtureFallback(firstName, segment);
  }
}

function buildNurtureFallback(firstName: string, segment: 'cold' | 'warm' | 'hot'): NurtureEmailSequence {
  const greeting = `Hey ${firstName},`;
  const ctaUrl = segment === 'cold' ? 'asorahura.com/blog' :
                 segment === 'warm' ? 'asorahura.com/checkout?tier=discovery' :
                 'asorahura.com/checkout?tier=strategy';
  return {
    day3: {
      subject: `Thought about your AI readiness?`,
      body: `${greeting}\n\nQuick follow-up on your assessment.\n\nBest,\nAsor`,
      day: 3,
    },
    day7: {
      subject: `How others with your score are automating`,
      body: `${greeting}\n\nCheck out a case study: asorahura.com/blog/cervical-cancer-screening-tool\n\nBest,\nAsor`,
      day: 7,
    },
    day14: {
      subject: `Two weeks in — still thinking about next steps?`,
      body: `${greeting}\n\nLet me know if you want to chat.\n\nBest,\nAsor`,
      day: 14,
    },
    day30: {
      subject: `Month 1 check-in: Ready to move forward?`,
      body: `${greeting}\n\nBook a call: ${ctaUrl}\n\nBest,\nAsor`,
      day: 30,
    },
  };
}
```

### Pattern 3: MDX Article Rendering with Server Components
**What:** Use next-mdx-remote/rsc to render MDX files server-side; extract and display frontmatter metadata (title, cover image, category, reading time).

**When to use:** Individual article page (/blog/[slug]/page.tsx). No client-side hydration needed for static content.

**Example:**
```typescript
// src/app/blog/[slug]/page.tsx
import { compileMDX } from 'next-mdx-remote/rsc';
import { getBlogPostBySlug } from '@/lib/blog';
import BlogCTABlock from '@/components/blog/BlogCTABlock';
import styles from '../blog.module.css';

export default async function BlogArticle({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  const { frontmatter, content, readingTime } = post;

  const mdxSource = await compileMDX({
    source: content,
    components: {
      // Custom components for MDX (headings, code blocks, etc.)
    },
  });

  return (
    <main className={styles.article}>
      <header className={styles.header}>
        <img src={frontmatter.coverImage} alt={frontmatter.title} />
        <h1>{frontmatter.title}</h1>
        <p className={styles.meta}>
          {frontmatter.category} • {readingTime} min read
        </p>
      </header>

      <article className={styles.body}>
        {mdxSource.content}
      </article>

      <BlogCTABlock
        type={frontmatter.category === 'Case Study' ? 'case-study' : 'educational'}
      />
    </main>
  );
}
```

### Anti-Patterns to Avoid
- **Don't hand-roll MDX file discovery:** Use file system APIs + matter for frontmatter. Adding new articles shouldn't require code changes.
- **Don't pre-generate reading time at build:** Calculate on-demand from MDX content; if content changes, reading time auto-updates.
- **Don't fetch articles at render time in client components:** Use Server Components for static content; RSC avoids hydration waterfall.
- **Don't mix segment logic into generic email templates:** Create separate functions (draftNurtureEmailSequence) for follow-ups; reuse initial email logic only if identical.
- **Don't store case study references as hardcoded links in email prompts:** Pass casestudySlug as a parameter so email content is data-driven.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reading time calculation | Word counter + manual WPM division | reading-time npm package | Handles markdown syntax, code blocks, image overhead; Medium-verified algorithm |
| MDX frontmatter extraction | Regex parsing | gray-matter npm package | YAML/TOML parsing, encoding handling, edge cases already solved |
| File discovery for blog posts | fs.readdirSync() + manual mapping | fs/promises + async mapping in getBlogPosts() | Non-blocking, resilient to slow I/O, matches server-side patterns |
| Email scheduling arithmetic | "Add 3 days to now" logic | Resend's scheduledAt with natural language ("in 3 days") | Timezone-aware, edge cases (leap years, daylight savings), handled by Resend |
| Segment-specific copy generation | Prompt templates with if/else branching | Structured LLM prompts + segment angle parameter | LLM is better at tone/phrasing variation; branching logic becomes unmaintainable |
| Blog content versioning / edit history | Custom git wrapper | Commit MDX files to repo; git handles history | Repo is source of truth; rebase/rollback already built-in |

**Key insight:** Every domain here has a library or SaaS API specifically for it. Don't replace them with custom logic.

---

## Common Pitfalls

### Pitfall 1: "Gemini 2.0 Flash is being shut down"
**What goes wrong:** Confusion about Gemini 2.0 Flash sunset (June 1, 2026) leaves email generation broken after that date.

**Why it happens:** Gemini 2.0 Flash was the recommended model at Phase 2; users don't know about the transition window.

**How to avoid:** At deploy time, verify Gemini model version in environment. Plan model migration to Gemini 3.1-flash-lite or equivalent _before_ June 1, 2026 in prod. Add a comment in llm.ts with the sunset date. Set a calendar reminder for April 2026 (8 weeks before) to test migration.

**Warning signs:** Emails fail to generate after early June 2026 with model not found errors.

### Pitfall 2: Category filtering breaks with dynamic categories
**What goes wrong:** Hardcoded category list in filter UI doesn't match actual categories in MDX files. Adding a new article category requires code changes.

**Why it happens:** Categories are embedded in both frontmatter _and_ UI component state, creating two sources of truth.

**How to avoid:** Extract categories dynamically from getBlogPosts(). Compute unique categories from all posts at listing time; generate filter pills from that set. Store in React state or pass via props.

**Warning signs:** New article with category "Case Study" doesn't appear in filters even though the article renders.

### Pitfall 3: Reading time calculation includes frontmatter and YAML
**What goes wrong:** Reading time is inflated because body text includes the raw YAML frontmatter before gray-matter strips it.

**Why it happens:** Forgetting to separate `data` from `content` in matter() output. Passing raw file to readingTime instead of body.

**How to avoid:** In getBlogPostBySlug, pass only the `content` (post-YAML) to readingTime calculation. Test with a 5k-word article; reading time should be ~18 minutes (5000/275), not 18.5+ (if YAML is included).

**Warning signs:** Random 1-2 min additions to all reading times; frontmatter-heavy articles have inflated times.

### Pitfall 4: Segment-specific CTAs in emails don't route correctly
**What goes wrong:** Cold leads click the email CTA, land on /engage (which accepts hot leads), and see irrelevant form language or CTAs. No redirect based on segment.

**Why it happens:** Email generation includes a CTA URL, but there's no segment parameter passed through the link to downstream pages.

**How to avoid:** Include segment in query params when generating email body. Example: `/engage?segment=cold` or `/checkout?tier=discovery&from=email-day7`. The /engage page should acknowledge the lead temperature and adjust language/CTAs accordingly. Verify landing page handles the segment param.

**Warning signs:** All leads land on the same /engage form regardless of which email they came from. No personalization on checkout tier pre-selection.

### Pitfall 5: Resend scheduledAt natural language fails in production
**What goes wrong:** "in 3 days" works in development (local timezone assumed), but in production (server timezone differs from client), emails send at wrong times or fail with "invalid date" error.

**Why it happens:** Relying on natural language without understanding Resend's timezone handling. Server might be UTC, but "in 3 days" is ambiguous without explicit timezone.

**How to avoid:** Use ISO 8601 format instead of natural language in production: `scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()`. Test with explicit UTC dates. Or, if using natural language, verify Resend's default timezone and set it explicitly in environment (Resend uses server timezone by default).

**Warning signs:** Day 3 emails send on Day 2, or "Invalid date" errors in production logs.

### Pitfall 6: EU Horizon reference removal is incomplete
**What goes wrong:** After migrating cervical cancer article to MDX, the old "EU HORIZON €2.25M" text remains in the metrics field or body. Blog and Phase 2 /articles page show different content.

**Why it happens:** Grepping for "EU HORIZON" in articles.ts, finding it in the metrics field, but not removing it everywhere it appears (body text also mentions it).

**How to avoid:** Before migration, grep the full articles.ts for "EU HORIZON" and "Flowmorph". List all occurrences. Create a data transformation that:
1. Removes "EU HORIZON €2.25M" from metrics → replace with neutral outcome ("Zero Cloud Dependency", "39+ Facilities Deployed").
2. Replaces the "Why This Matters Beyond Nigeria" paragraph section that discusses the HORIZON grant with a rewritten version focused on architecture replicability instead.
3. Removes "Flowmorph" references entirely.
Test by comparing article body before/after migration.

**Warning signs:** Blog article shows "EU HORIZON" while /articles no longer does (or vice versa). Old links in body text reference grant-specific context that's been stripped.

### Pitfall 7: Cold segment gets "book discovery call" CTA instead of "read blog"
**What goes wrong:** Email generation ignores segment angle and generates warm-like CTAs for cold leads.

**Why it happens:** Segment angle prompt not passed correctly to LLM, or fallback function doesn't implement segment-specific CTAs.

**How to avoid:** In draftNurtureEmailSequence, explicitly construct the segment angle string based on segment parameter. Include it in the system prompt. Verify fallback function (buildNurtureFallback) implements segment-specific CTAs:
- Cold: "Read more at asorahura.com/blog"
- Warm: "Book a discovery call: asorahura.com/checkout?tier=discovery"
- Hot: "Book a strategy session: asorahura.com/checkout?tier=strategy"
Test by calling draftNurtureEmailSequence for each segment and checking the Day 30 email (offer) CTA.

**Warning signs:** Cold lead's Day 30 email includes "/checkout?tier=discovery" instead of blog link.

---

## Code Examples

Verified patterns from official sources:

### Reading Time Calculation
```typescript
// Source: reading-time npm package (https://github.com/ngryman/reading-time)
import { readingTime } from 'reading-time';

const content = `Your markdown or plain text here...`;
const rt = readingTime(content);
console.log(rt.minutes); // e.g., 5
```

### MDX Frontmatter Extraction with gray-matter
```typescript
// Source: gray-matter npm package (https://github.com/jonschlinkert/gray-matter)
import matter from 'gray-matter';

const fileContent = `---
title: "My Article"
category: "Case Study"
coverImage: "/images/article.jpg"
---

# Article body starts here`;

const { data, content } = matter(fileContent);
console.log(data.title); // "My Article"
console.log(content); // "# Article body starts here"
```

### MDX Rendering with next-mdx-remote/rsc
```typescript
// Source: next-mdx-remote/rsc (https://github.com/hashicorp/next-mdx-remote)
import { compileMDX } from 'next-mdx-remote/rsc';

const mdxSource = await compileMDX({
  source: `# Hello\n\nThis is **bold**.`,
  components: {
    h1: ({ children }) => <h1 style={{ color: 'blue' }}>{children}</h1>,
  },
});

// In JSX:
<>{mdxSource.content}</>;
```

### Gemini API via OpenAI SDK with JSON Response
```typescript
// Source: Gemini API OpenAI Compatibility (https://ai.google.dev/gemini-api/docs/openai)
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

const response = await client.chat.completions.create({
  model: 'gemini-2.0-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Return JSON only.' },
  ],
  response_format: { type: 'json_object' },
});

const jsonBody = response.choices[0]?.message?.content;
const parsed = JSON.parse(jsonBody);
```

### Resend Scheduled Email with Natural Language
```typescript
// Source: Resend Schedule Email API (https://resend.com/docs/dashboard/emails/schedule-email)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'hello@example.com',
  to: 'recipient@example.com',
  subject: 'Scheduled email',
  text: 'This email will be sent in 3 days.',
  scheduledAt: 'in 3 days', // Natural language supported
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Contentlayer | next-mdx-remote/rsc | 2024–2025 | Contentlayer no longer maintained; RSC-first approach aligns with Next.js 15 |
| Gemini 1.5 | Gemini 2.0 Flash (then 3.1) | 2025–2026 | 2.0 Flash faster + cheaper; 3.1 incoming as successor post-June 2026 |
| Hardcoded email sequences | LLM-generated per-segment sequences | Phase 2–Phase 3 | Personalization at scale; segment angles drive copy variation |
| /articles as separate page | /articles redirects to /blog | This phase | Single source of truth; content migration reduces duplication |
| Static blog at build time | File-backed blog at request time | This phase | Supports adding articles without rebuild (Next.js revalidation) |

**Deprecated/outdated:**
- Contentlayer (2024): No longer actively maintained; talks of new maintainer but no definitive plans. Don't start new projects with it.
- Gemini 2.0 Flash (June 1, 2026 sunset): Plan migration to Gemini 3.1-flash-lite or comparable model before that date. Resend + OpenAI SDK will continue to support the new model with one-line config change.
- Static blog articles in /articles/articles.ts: Replace with file-backed MDX in /content/blog/. Easier to version, easier to deploy, easier to edit without code changes.

---

## Open Questions

1. **Case study matching for Day 7 email: What makes a "relevant match"?**
   - What we know: The context says "Email 3 links to a relevant /blog article matching the prospect's industry/context." But all 4 current case studies span healthcare, maritime, HR, insurance—no industry cohort.
   - What's unclear: Should cold leads always get the same case study, or should we attempt matching based on assessment answers (e.g., if they select "Operations Manager" → send the HR resume reviewer case study)?
   - Recommendation: For Phase 3 launch, use a fixed mapping (all cold leads → cervical cancer article, all warm → AI resume reviewer, all hot → SRDM vision model). If assessment data suggests better matching, add that logic in Phase 4.

2. **Blog grid responsive breakpoints: 2 columns on mobile, 3 on desktop, or different?**
   - What we know: CONTEXT.md specifies "2-3 columns" but doesn't define breakpoints.
   - What's unclear: Should mobile (< 640px) show 1 column, tablet (640-1024px) show 2, desktop (>1024px) show 3?
   - Recommendation: Follow Tailwind convention: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Verify in component design.

3. **Do we need image optimization (Next.js Image component)?**
   - What we know: Blog cards require cover images. The codebase uses next/image elsewhere.
   - What's unclear: Should cover images be optimized (responsive srcset, lazy loading, format conversion) or raw URLs?
   - Recommendation: Use next/image with `fill` prop + `object-cover` CSS for cards. Optimizes for mobile + lighthouse scores.

---

## Sources

### Primary (HIGH confidence)
- @next/mdx configuration in next.config.mjs (verified in codebase)
- src/lib/email.ts and src/lib/llm.ts (Phase 2 implementation, verified in codebase)
- src/lib/assessment.ts (segment logic verified in codebase)
- src/lib/articles.ts (migration source, verified in codebase)
- [OpenAI SDK compatibility with Gemini API](https://ai.google.dev/gemini-api/docs/openai) — official Google AI Developers docs
- [Resend Schedule Email API documentation](https://resend.com/docs/dashboard/emails/schedule-email) — official Resend docs, verified natural language support + 30-day limit

### Secondary (MEDIUM confidence)
- [next-mdx-remote/rsc on GitHub](https://github.com/hashicorp/next-mdx-remote) — verified RSC support and frontmatter extraction capabilities via WebFetch
- [next-mdx-remote vs @next/mdx in Next.js 15 comparison](https://blixamo.com/blog/next-mdx-remote-rsc-vs-next-mdx-nextjs-15) — cross-referenced with official Next.js docs; recommends next-mdx-remote/rsc for file-backed blogs
- [reading-time npm package](https://github.com/ngryman/reading-time) — widely used, 275 WPM baseline verified across multiple sources
- [gray-matter npm package](https://github.com/jonschlinkert/gray-matter) — industry-standard YAML frontmatter extraction

### Tertiary (LOW confidence — informational, not implementation-critical)
- [Lead nurture best practices 2026](https://prospeo.io/s/lead-nurturing-emails) — WebSearch indicates segment-based nurture is standard practice; Cold/Warm/Hot classification widely adopted
- [LLM email generation 2026](https://www.appaca.ai/resources/llm-for/email) — WebSearch indicates Claude 4 Sonnet and GPT-5.4 lead for email; Gemini 2.5 Flash recommended for cost at scale

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — @next/mdx already configured; Gemini/Resend pattern from Phase 2; reading-time/gray-matter are industry standard
- Architecture: **HIGH** — File-backed MDX pattern is standard in 2026; RSC rendering is recommended; segment-based email generation extends proven Phase 2 pattern
- Pitfalls: **MEDIUM-HIGH** — Gemini 2.0 Flash sunset is real (June 1, 2026) and documented; category filtering and reading time edge cases are common; Resend scheduledAt timezone pitfall is documented in their changelog
- Open questions: **MEDIUM** — Case study matching strategy isn't locked in CONTEXT.md; responsive design and image optimization are discretionary

**Research date:** 2026-05-15
**Valid until:** 2026-06-15 (30 days; Gemini sunset approaching — revalidate model recommendation in April 2026)

---

*Phase: 03-lead-nurture-blog-launch-extended-email-sequences-segmentation*  
*Context gathered: 2026-05-15*
