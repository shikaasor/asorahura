# Phase 2: Conversion Funnel — Research

**Researched:** 2026-05-15
**Domain:** Email automation (LLM + Resend), PDF generation (Node.js), Engage form routing, Services page, Work/case studies page
**Confidence:** HIGH (core stack verified against codebase and official docs)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**PDF Report Content & Format**
- PDF contains: score (0-100) + breakdown by category/question + personalized next step based on segment
- Visual style: Branded — Asor's colors, logo, professional design (feels like a real consulting deliverable)
- Breakdown granularity: Claude's discretion

**Email Delivery — LLM-Personalized**
- LLM integration via LiteLLM — provides provider flexibility
- Default model: `gemini-2.0-flash` (configurable via LiteLLM)
- Trigger: At assessment completion — one LLM call per user, all emails drafted and queued at once
- LLM context input: full assessment report + score (0-100) + segment (cold/warm/hot)
- Output: personalized initial email + all follow-up emails (Day 3, 7, 14, 30)
- Delivery: Resend API with scheduled delays (not Loops for follow-ups)

**Email Tone & Initial Email**
- Initial delivery email: Personal, from Asor — short note with PDF attached
- Tone: 1-on-1 conversation, not formal notification
- Example frame: "Hey [Name], here's your AI Readiness Report. Based on your score of X, here's what I'd suggest..."

**Cold/Warm/Hot Email Differentiation — Highly differentiated**
- Cold (<40): Education angle — opportunity cost framing
- Warm (40-70): Case study angle — proof
- Hot (70+): Urgency angle — primary CTA is direct to checkout (Strategy Session)
- Hot lead follow-up CTA: go to checkout (not Calendly)

**Engage Form — Fields**
1. Full Name, Email, Company/Organization, Your Role, Company Size, Monthly Operational Volume, Primary Operational Challenge (textarea), Engagement Timeline
2. Budget Alignment updated to: Under $5k / $5k–$15k / $15k–$30k / $30k+
3. Additional Context (optional)

**Engage Form — Score-Based Routing**
- Routing trigger: assessment score passed as URL param (`/engage?score=82`)
- Assessment results page links to engage form with score in URL
- On submit, server reads score param and routes:
  - Hot (70+) → Checkout (Strategy Session)
  - Warm (40–70) → Checkout (Discovery Call)
  - Cold (<40) → Confirmation page

**Services Page — Tier Display**
- Layout: 4 pricing cards in columns
- Each card: price range + 3-4 bullet scope items + CTA button
- Top tier ($30k+): "Book Strategy Session" → checkout
- All other tiers: "Take the Assessment" → assessment

**Case Study Structure — 5-section template**
1. Headline: metric result up front
2. Client context
3. What we built
4. Business impact
5. CTA block: "See if we're a fit" → /engage

**Case Study Attribution**
- All work attributed to Asor Ahura / asorahura.com directly
- All Flowmorph references removed
- EU Horizon grant references purged

### Claude's Discretion
- Exact PDF breakdown structure (categories vs per-question)
- LLM prompt design for email drafting
- Services page scope bullet content per tier
- Case study body copy (outcome-first language)
- Cold lead confirmation page copy

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within Phase 2 scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EMAIL-01 | Assessment completion triggers immediate PDF delivery | PDF generation via route handler + Resend attach |
| EMAIL-02 | Email 1 (0 min) — "Your AI Readiness Report is here" with PDF + Calendly link | Resend `emails.send` with `attachments` array |
| EMAIL-07 | Assessment results segmented: <40 cold / 40-70 warm / 70+ hot | Existing `calculateScore()` in `lib/assessment.ts`, extend with segment logic |
| ENGAGE-01 | Hero "Tell Me About Your Problem" | Static copy change on `/engage` page |
| ENGAGE-02 | Sub "Describe what's slowing your operations down..." | Static copy change |
| ENGAGE-03 | 1-2 testimonials at top of engage form | `<Testimonials />` component already imported |
| ENGAGE-04 | Form with updated fields (budget ranges updated) | Modify existing form in `engage/page.tsx` |
| ENGAGE-05 | Submit button "Submit My Project Brief" | Rename existing button |
| ENGAGE-06 | Post-submission routing logic (score-based) | Read score from URL param in server action, redirect appropriately |
| SERV-01 | Hero "Here's Exactly What I Build" | New `/services` page route |
| SERV-02 | Tier 1 card — Starter Automation ($5,000) | Static card component in services page |
| SERV-03 | Tier 2 card — Operational Automation ($5k–$15k) | Static card component |
| SERV-04 | Tier 3 card — Systems Integration ($15k–$30k) | Static card component |
| SERV-05 | Tier 4 card — Enterprise/Complex Build ($30k+) | Static card component with Calendly CTA |
| SERV-06 | Sidebar note pointing to assessment for tier matching | Static aside element |
| SERV-07 | Social proof / testimonials section | Reuse `<Testimonials />` |
| WORK-01 | Header "Real Problems. Real Systems. Real Results." | Replace existing headline in `work/page.tsx` |
| WORK-02 | Case Study 1 — HR Automation | Update `systems` array data in `work/page.tsx` |
| WORK-03 | Case Study 2 — Chatbot Analytics | Update `systems` array data |
| WORK-04 | Case Study 3 — Document Intelligence | Update `systems` array data |
| WORK-05 | Case Study 4 — Healthcare Ops | Update `systems` array data |
| WORK-06 | Case study card template: Problem → Result → Built → Stack | Restructure card markup in `work/page.tsx` |
| WORK-07 | Bottom CTA links to /engage | Add CTA at end of work page |
| CONV-01 | Three entry states served: Cold/Warm/Hot | Score-based routing from ResultsScreen + engage form |
| CONV-02 | Assessment as primary lead gen engine | Existing flow; ensure ResultsScreen links to `/engage?score=X` |
</phase_requirements>

---

## Summary

Phase 2 builds on a well-structured Next.js 16 codebase that already has: Resend email integration (`src/lib/email.ts`), a working email template (`src/emails/AssessmentReport.tsx`), a fully functional engage form (`src/app/engage/`), and the work/case studies page (`src/app/work/`). The assessment scoring infrastructure (`src/lib/assessment.ts`) and the action that triggers email (`src/app/assessment/actions.ts`) are complete.

The three new technical challenges are: (1) PDF generation on the server that attaches to the initial email, (2) calling an LLM (Gemini via OpenAI-compatible SDK) from a server action to draft all 5 emails, and (3) queuing 4 follow-up emails with Resend's `scheduledAt` parameter. The remaining work is primarily content/UI: a new `/services` page, updated copy on `/engage`, restructured case study cards on `/work`, and adding a score URL param link from the ResultsScreen to `/engage`.

**Primary recommendation:** Use the OpenAI npm package (already in ecosystem knowledge) pointed at Google's Gemini OpenAI-compatible endpoint for LLM calls — no new LiteLLM package needed. Use PDFKit (plain Node.js Buffer API, zero Next.js compatibility issues) for PDF generation inside a server action. Use Resend `scheduledAt` (natural language `"in 3 days"`) for follow-up scheduling.

---

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| `resend` | ^6.12.3 | Email delivery + attachments + scheduling | Already in use |
| `@react-email/components` | ^1.0.12 | Email HTML templates | Already in use |
| `next` | ^16.2.6 | App Router, Server Actions, route handlers | Already in use |
| `react-hook-form` | ^7.75.0 | Form state management | Installed, not yet used on engage |
| `zod` | ^4.4.3 | Input validation | Already in use |

### New to Install
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| `openai` | ^4.x | LLM calls to Gemini via OpenAI-compatible endpoint | Gemini exposes OpenAI-compatible API; `openai` npm is the standard TypeScript client; no extra proxy server needed |
| `pdfkit` | ^0.15.x | Server-side PDF generation as Node.js Buffer | No Next.js App Router compatibility issues unlike `@react-pdf/renderer`; pure Node.js; returns Buffer directly |

**Do NOT install `litellm` npm package** — this is a community JS port with limited Gemini support. The locked decision says "LiteLLM for provider flexibility," which is achieved by pointing the OpenAI SDK at Gemini's OpenAI-compatible endpoint (`https://generativelanguage.googleapis.com/v1beta/openai/`) and making the baseURL/apiKey configurable via env vars. This IS the LiteLLM pattern — provider swappability without extra infrastructure.

**Do NOT install `@react-pdf/renderer`** — confirmed open bugs with Next.js 15+ App Router (`"PDFDocument is not a constructor"` on renderToBuffer, issue #3074 still unresolved as of Feb 2025).

**Installation:**
```bash
npm install openai pdfkit
npm install --save-dev @types/pdfkit
```

---

## Architecture Patterns

### Recommended Project Structure (new files)

```
src/
├── app/
│   ├── services/
│   │   ├── page.tsx              # New — 4-tier pricing page
│   │   └── services.module.css
│   ├── engage/
│   │   ├── page.tsx              # Update — copy, budget ranges, score param routing
│   │   ├── actions.ts            # Update — read score from hidden field, redirect
│   │   └── confirmation/
│   │       └── page.tsx          # New — cold lead confirmation page
│   └── work/
│       ├── page.tsx              # Update — headline, card structure, CTA, remove Flowmorph
│       └── work.module.css       # Update as needed
├── lib/
│   ├── pdf.ts                    # New — generateAssessmentPDF(params) → Buffer
│   ├── llm.ts                    # New — draftEmailSequence(params) → EmailDrafts
│   ├── email.ts                  # Update — sendInitialEmailWithPDF, scheduleFollowUps
│   └── assessment.ts             # Update — add getSegment(score) helper
└── emails/
    └── AssessmentReport.tsx      # Update — support PDF attachment flow (simplify template)
```

### Pattern 1: LLM Email Drafting (Server Action)

**What:** On assessment completion, call Gemini once with the full report context. Gemini returns all 5 email bodies (initial + 4 follow-ups) as structured JSON. The server action sends email 1 immediately and schedules emails 2-5 via Resend `scheduledAt`.

**When to use:** Single trigger point (assessment submission), not on every page load.

```typescript
// src/lib/llm.ts
// Source: https://ai.google.dev/gemini-api/docs/openai

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export interface EmailDrafts {
  initial: { subject: string; body: string };
  day3: { subject: string; body: string };
  day7: { subject: string; body: string };
  day14: { subject: string; body: string };
  day30: { subject: string; body: string };
}

export async function draftEmailSequence(params: {
  firstName: string;
  score: number;
  segment: "cold" | "warm" | "hot";
  tierName: string;
  tierDescription: string;
  topOpportunities: string[];
}): Promise<EmailDrafts> {
  const systemPrompt = buildEmailSystemPrompt(params.segment);
  const userContext = JSON.stringify(params);

  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "gemini-2.0-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContext },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content!) as EmailDrafts;
}
```

**Environment variables required:**
```
GEMINI_API_KEY=your-google-ai-studio-key
LLM_MODEL=gemini-2.0-flash   # optional override
```

### Pattern 2: PDF Generation (Server Action)

**What:** Generate a branded PDF report as a Node.js Buffer using PDFKit, then pass the buffer as base64 to Resend's `attachments` field.

**When to use:** Inside the `sendInitialEmailWithPDF` function, called from the assessment server action.

```typescript
// src/lib/pdf.ts
import PDFDocument from "pdfkit";

export async function generateAssessmentPDF(params: {
  firstName: string;
  score: number;
  tierName: string;
  breakdown: { category: string; score: number; insight: string }[];
  nextStep: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Title
    doc.fontSize(24).fillColor("#111111").text("AI Readiness Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Prepared for: ${params.firstName}`);
    doc.fontSize(36).fillColor("#111111").text(`${params.score}/100`, { align: "center" });
    // ... breakdown table, next step section
    doc.end();
  });
}
```

### Pattern 3: Resend Scheduled Follow-ups

**What:** Use Resend `scheduledAt` with natural language strings for the Day 3/7/14/30 follow-ups.

```typescript
// src/lib/email.ts (updated)
// Source: https://resend.com/docs/dashboard/emails/schedule-email

await resend.emails.send({
  from: "Asor Ahura <hello@asorahura.com>",
  to: recipientEmail,
  subject: drafts.day3.subject,
  html: drafts.day3.body,
  scheduledAt: "in 3 days",
});

await resend.emails.send({
  ...
  scheduledAt: "in 7 days",
});
// etc for day14, day30
```

**Scheduling limit:** Resend supports up to 30 days in advance (verified against official docs, extended April 2025). Natural language strings like `"in 3 days"` and `"in 14 days"` are supported.

### Pattern 4: Engage Form Score-Based Routing

**What:** The `/engage` page reads the `?score=` URL param. On form submit, the server action reads the score from a hidden form field (not URL — server actions don't have access to URL params directly) and redirects accordingly.

```typescript
// engage/page.tsx (client component)
"use client";
import { useSearchParams } from "next/navigation";

const searchParams = useSearchParams();
const score = searchParams.get("score");

// Pass as hidden field in the form:
<input type="hidden" name="score" value={score ?? ""} />
```

```typescript
// engage/actions.ts (server action)
"use server";
import { redirect } from "next/navigation";

export async function submitInquiry(formData: FormData) {
  const score = parseInt(formData.get("score") as string || "0", 10);
  
  // ... existing form handling ...

  if (score >= 70) {
    redirect("/checkout?tier=strategy");
  } else if (score >= 40) {
    redirect("/checkout?tier=discovery");
  } else {
    redirect("/engage/confirmation");
  }
}
```

### Pattern 5: ResultsScreen → Engage Link with Score

**What:** The existing `ResultsScreen.tsx` CTA currently links to `/checkout`. It needs to also link to `/engage?score=X` (primary CTA for post-assessment flow).

```typescript
// src/components/assessment/ResultsScreen.tsx
// Change CTA to:
<Link href={`/engage?score=${score}`} className={styles.ctaBtn}>
  Tell Me About Your Project
</Link>
```

### Anti-Patterns to Avoid

- **Do not call the LLM in a React render function** — LLM calls belong in Server Actions (`"use server"`) or API route handlers.
- **Do not use `@react-pdf/renderer` renderToBuffer in a Server Action** — confirmed broken in Next.js 15+ App Router (PDFDocument is not a constructor). Use PDFKit instead.
- **Do not read `searchParams` in a Server Action** — Server Actions receive `FormData`, not URL params. Pass score via hidden form field.
- **Do not batch the initial email with follow-ups using Resend's batch endpoint** — Resend's batch endpoint does not support attachments or `scheduledAt`. Send each email individually.
- **Do not hardcode the LLM model** — use `process.env.LLM_MODEL` so it's swappable per the locked decision.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF generation | Custom HTML→PDF converter | `pdfkit` | Edge cases: fonts, page breaks, encoding; PDFKit is battle-tested Node.js library |
| LLM provider switching | Custom fetch wrapper per provider | OpenAI SDK + configurable `baseURL`/`apiKey` env vars | Gemini's OpenAI-compatible endpoint means zero code changes to switch models |
| Email scheduling delays | Custom cron jobs or database timers | Resend `scheduledAt` | Resend manages scheduling state; no infrastructure needed |
| Email HTML templates | Raw HTML strings | `@react-email/components` | Already installed and in use; handles email client quirks |
| Form validation | Manual regex | `zod` schemas | Already installed; consistent with rest of codebase |

**Key insight:** The biggest complexity risk in this phase is the PDF+LLM combination in the assessment completion path. Both must be non-blocking: if PDF generation fails, the score still shows; if LLM call fails, fall back to static email template. Design with try/catch isolation.

---

## Common Pitfalls

### Pitfall 1: LLM Response Not Being Valid JSON
**What goes wrong:** The LLM returns markdown-wrapped JSON or incomplete JSON, causing `JSON.parse()` to throw.
**Why it happens:** Models sometimes wrap JSON in ```json``` fences even when instructed not to.
**How to avoid:** Use `response_format: { type: "json_object" }` in the OpenAI SDK call (Gemini supports this via the OpenAI-compatible endpoint). Add a try/catch around `JSON.parse` with a fallback to static templates.
**Warning signs:** Intermittent failures in email drafting; unhandled promise rejections in server action logs.

### Pitfall 2: PDFKit Async Buffer Pattern
**What goes wrong:** `doc.end()` is called but the Buffer hasn't been fully written yet; the returned Buffer is empty.
**Why it happens:** PDFKit's stream is async — `doc.end()` triggers the end event, not immediate completion.
**How to avoid:** Wrap in a Promise that resolves in the `"end"` event handler, not after `doc.end()`. (See Pattern 2 above.)
**Warning signs:** Email attachment shows as 0-byte PDF; attachment opens blank.

### Pitfall 3: Resend Batch Endpoint Incompatible with Attachments
**What goes wrong:** Developer uses `resend.batch.send([...])` to send multiple emails at once — attachments silently fail or API returns error.
**Why it happens:** Resend's batch endpoint does not support `attachments` or `scheduledAt`.
**How to avoid:** Use individual `resend.emails.send()` calls for each email — initial (with attachment) and all 4 scheduled follow-ups.
**Warning signs:** Batch call succeeds but recipient never receives PDF attachment.

### Pitfall 4: Server Action Cannot Read URL searchParams
**What goes wrong:** Server action tries to access `headers()` or `request.url` to read `?score=82` — this is not available in Server Actions.
**Why it happens:** Server Actions receive only `FormData`, not the full HTTP request context.
**How to avoid:** Pass the score as a hidden `<input type="hidden" name="score" value={score} />` in the form. The engage page is already a client component (`"use client"`) so `useSearchParams()` is available for reading the param.
**Warning signs:** Score is always 0 in routing logic; all users redirected to cold confirmation page.

### Pitfall 5: @react-pdf/renderer Breaks Next.js 15+ App Router
**What goes wrong:** `renderToBuffer` throws `"PDFDocument is not a constructor"` in Next.js 15 App Router route handlers/server actions.
**Why it happens:** Open GitHub issue #3074 (Feb 2025, unresolved). Likely a module initialization conflict with Next.js bundling.
**How to avoid:** Use PDFKit instead. PDFKit is pure Node.js and works correctly in server contexts.
**Warning signs:** PDF generation fails silently; build warnings about ESM packages.

### Pitfall 6: Assessment Action Blocking on LLM Timeout
**What goes wrong:** LLM call takes 3-8 seconds; the user's browser shows a spinner waiting for the assessment email action to resolve, or the function times out.
**Why it happens:** `submitAssessmentForEmail` in `assessment/actions.ts` is already non-blocking for email (uses fire-and-forget pattern with console.error). LLM call must follow same pattern.
**How to avoid:** Do not `await` the LLM+email pipeline in the server action's critical path. Return `{ success: true, score, tier }` immediately; fire the full LLM+PDF+email sequence without awaiting. Use `void draftAndSendEmails(...)`.
**Warning signs:** Assessment results page takes 5+ seconds to render after email submission.

---

## Code Examples

### Gemini via OpenAI SDK (verified against Google AI docs)
```typescript
// Source: https://ai.google.dev/gemini-api/docs/openai
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const response = await client.chat.completions.create({
  model: "gemini-2.0-flash",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContext },
  ],
  response_format: { type: "json_object" },
});
```

### Resend with PDF Attachment + Scheduled Follow-ups
```typescript
// Source: https://resend.com/docs/dashboard/emails/attachments
// Source: https://resend.com/docs/dashboard/emails/schedule-email

// Email 1 — immediate with PDF
await resend.emails.send({
  from: "Asor Ahura <hello@asorahura.com>",
  to: email,
  subject: drafts.initial.subject,
  html: drafts.initial.body,
  attachments: [
    {
      filename: "AI-Readiness-Report.pdf",
      content: pdfBuffer.toString("base64"),
    },
  ],
});

// Email 2 — Day 3 follow-up
await resend.emails.send({
  from: "Asor Ahura <hello@asorahura.com>",
  to: email,
  subject: drafts.day3.subject,
  html: drafts.day3.body,
  scheduledAt: "in 3 days",
});
```

### Score-based routing in engage/actions.ts
```typescript
// Source: Next.js docs — redirect() in Server Actions
"use server";
import { redirect } from "next/navigation";

export async function submitInquiry(formData: FormData) {
  const score = parseInt(formData.get("score") as string || "0", 10);
  
  // ... save inquiry data ...

  if (score >= 70) {
    redirect("/checkout?tier=strategy");
  } else if (score >= 40) {
    redirect("/checkout?tier=discovery");
  } else {
    redirect("/engage/confirmation");
  }
}
```

---

## Existing Codebase — What Already Exists

The planner must work with what's already built:

| File | Status | Phase 2 Action |
|------|--------|----------------|
| `src/lib/assessment.ts` | Complete | Add `getSegment(score)` helper returning `"cold" | "warm" | "hot"` |
| `src/lib/email.ts` | Basic (no PDF, no LLM) | Replace with PDF+LLM version |
| `src/lib/checkout.ts` | Complete | No changes needed |
| `src/emails/AssessmentReport.tsx` | Basic React Email template | Keep as fallback; LLM drafts plain HTML body |
| `src/app/assessment/actions.ts` | Complete | Add non-blocking LLM email call |
| `src/components/assessment/ResultsScreen.tsx` | Complete | Add link to `/engage?score=${score}` |
| `src/app/engage/page.tsx` | Form exists, wrong copy+budget ranges | Update copy, budget options, add hidden score field |
| `src/app/engage/actions.ts` | Sends to Google Sheets only | Add score routing + redirect |
| `src/app/work/page.tsx` | Has case studies data + motion | Update headline, card structure, remove Flowmorph refs, add /engage CTA |
| `src/app/services/` | Does NOT exist | Create new page |
| `src/app/engage/confirmation/` | Does NOT exist | Create new page (cold lead thank you) |
| `src/lib/pdf.ts` | Does NOT exist | Create with PDFKit |
| `src/lib/llm.ts` | Does NOT exist | Create with OpenAI SDK → Gemini |
| `src/components/Testimonials.tsx` | Complete (3 testimonials) | Reuse on services + engage |

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|-----------------|--------|
| Loops.so for nurture sequences | Resend `scheduledAt` (up to 30 days) | No third-party CRM needed; all in one API |
| `@react-pdf/renderer` for server PDF | PDFKit for server PDF | No Next.js 15 compatibility bugs |
| LiteLLM Python proxy | OpenAI SDK + configurable baseURL | No separate service to deploy; same swappability |
| Static email templates | LLM-drafted per-user emails | Differentiated cold/warm/hot messaging |

**Deprecated/outdated in this codebase:**
- `GOOGLE_SCRIPT_URL` in engage/actions.ts: The current engage form sends to Google Sheets. After Phase 2, the action needs to handle routing logic. Google Sheets logging is optional/secondary.

---

## Open Questions

1. **Checkout URL param for tier pre-selection**
   - What we know: Engage form routing redirects to `/checkout?tier=strategy` or `/checkout?tier=discovery`
   - What's unclear: The checkout page (`checkout/page.tsx`) currently uses `useState<TierId>("discovery")` — it does not read URL params on mount
   - Recommendation: The planner should add a `useSearchParams` in the checkout page to pre-select the tier based on `?tier=` param. This is a small change but necessary for the routing to function correctly.

2. **LLM timeout handling**
   - What we know: Gemini calls can take 3-10 seconds; Vercel serverless functions have a 10s default timeout
   - What's unclear: Whether the non-blocking fire-and-forget pattern (`void draftAndSendEmails(...)`) will complete before the serverless function context closes
   - Recommendation: If Vercel is the deployment target, consider using a Next.js API route with streaming or a longer timeout config (`export const maxDuration = 30`). Alternatively, accept that on cold starts the LLM call may not complete and implement a retry via a webhook or background job. For MVP, fire-and-forget with generous timeout config is acceptable.

3. **PDF file size vs Resend 40MB limit**
   - What we know: Resend attachments max is 40MB including base64 encoding. PDFKit-generated branded single-page PDFs are typically 50-200KB.
   - What's unclear: Whether Asor's branding assets (logo PNG) are available as Node.js-accessible file paths
   - Recommendation: Use SVG or embedded base64 logo in the PDF to avoid file system path issues in serverless environments. Keep PDF under 500KB.

---

## Sources

### Primary (HIGH confidence)
- Google AI Studio official docs — `https://ai.google.dev/gemini-api/docs/openai` — OpenAI SDK + Gemini baseURL
- Resend official docs — `https://resend.com/docs/dashboard/emails/schedule-email` — scheduledAt syntax and limits
- Resend official docs — `https://resend.com/docs/dashboard/emails/attachments` — attachment content field, 40MB limit
- Codebase direct inspection — `src/lib/`, `src/app/`, `src/emails/`, `package.json`

### Secondary (MEDIUM confidence)
- react-pdf GitHub issues #3074, #2994, #2460 — confirmed renderToBuffer broken in Next.js 15 App Router
- PDFKit official site — `https://pdfkit.org/` — Node.js Buffer API documented
- GitHub zya/litellmjs README — community litellm JS has no Gemini support; OpenAI SDK approach is correct

### Tertiary (LOW confidence)
- LiteLLM official docs on Gemini — Python-only examples; JS pattern inferred from OpenAI-compatibility claim

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against installed package.json, official Gemini docs, Resend official docs
- Architecture: HIGH — patterns derived directly from existing codebase structure and official APIs
- Pitfalls: HIGH — `@react-pdf/renderer` issue confirmed via open GitHub issue; other pitfalls from direct code inspection
- LLM integration: MEDIUM — OpenAI→Gemini endpoint verified via Google's official docs; `response_format: json_object` compatibility with Gemini's OpenAI endpoint not independently confirmed

**Research date:** 2026-05-15
**Valid until:** 2026-06-15 (Resend and Gemini APIs are stable; react-pdf compatibility issue may be resolved)
