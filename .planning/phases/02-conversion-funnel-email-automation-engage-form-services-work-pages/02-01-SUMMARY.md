---
phase: 02-conversion-funnel
plan: "01"
subsystem: api
tags: [resend, pdfkit, openai, gemini, email-automation, pdf-generation, llm]

# Dependency graph
requires:
  - phase: 01-critical-path
    provides: assessment scoring (calculateScore, getTierName, getTierDescription, getPreviewBullets), Resend client, submitAssessmentForEmail action
provides:
  - Gemini LLM client via OpenAI SDK (draftEmailSequence) in src/lib/llm.ts
  - Branded PDF generator (generateAssessmentPDF) in src/lib/pdf.ts
  - Score segmentation helper (getSegment) in src/lib/assessment.ts
  - Full email sequence delivery (sendAssessmentEmailSequence) in src/lib/email.ts
  - Fire-and-forget assessment action wiring in src/app/assessment/actions.ts
affects: [03-lead-nurture, 05-optimization-launch]

# Tech tracking
tech-stack:
  added: [openai (Gemini via OpenAI SDK), pdfkit, @types/pdfkit]
  patterns:
    - fire-and-forget void Server Action pattern for non-blocking side effects
    - per-segment LLM prompting (cold/warm/hot angle injection)
    - individual Resend sends with scheduledAt for follow-up scheduling
    - PDFKit Promise wrapping via data/end event listeners

key-files:
  created:
    - src/lib/llm.ts
    - src/lib/pdf.ts
  modified:
    - src/lib/assessment.ts
    - src/lib/email.ts
    - src/app/assessment/actions.ts
    - src/app/assessment/page.tsx

key-decisions:
  - "Use openai SDK with custom baseURL for Gemini — avoids a Gemini-specific dependency, works with standard OpenAI client interface"
  - "maxDuration export goes in page.tsx route segment config, not in use server action file (Next.js Turbopack constraint)"
  - "Each of 5 Resend sends wrapped individually in try/catch — one failure never cascades to block others"
  - "LLM parse failure returns static fallback EmailSequence — email delivery never fails even if Gemini is down"

patterns-established:
  - "Pattern: fire-and-forget void — void asyncFn() in Server Action; results return immediately without awaiting side effects"
  - "Pattern: segment-angle prompting — cold/warm/hot angle string injected into LLM system/user prompt"
  - "Pattern: PDFKit async Buffer — collect chunks on data event, resolve on end event"

requirements-completed: [EMAIL-01, EMAIL-02, EMAIL-07, CONV-02]

# Metrics
duration: 25min
completed: 2026-05-15
---

# Phase 02 Plan 01: Email Automation Backend Summary

**Gemini-via-OpenAI-SDK LLM client, PDFKit branded report generator, and Resend 5-email sequence (initial + day 3/7/14/30) with per-segment cold/warm/hot angle prompting — all fire-and-forget from the assessment Server Action**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-05-15T00:00:00Z
- **Completed:** 2026-05-15T00:25:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Created `src/lib/llm.ts` with `draftEmailSequence()` — single Gemini JSON call returning 5-email sequence, with static fallback if parse fails
- Created `src/lib/pdf.ts` with `generateAssessmentPDF()` — branded A4 PDF (dark background, gold accents) with score block, opportunities, tier table, and segment-specific next step
- Added `getSegment()` to `src/lib/assessment.ts` — maps score to cold/warm/hot
- Rewrote `src/lib/email.ts` with `sendAssessmentEmailSequence()` — PDF-attached initial email immediately + 4 individually scheduled follow-ups via Resend `scheduledAt`
- Updated `src/app/assessment/actions.ts` — `void sendAssessmentEmailSequence(...)` fires non-blocking; score returns to user immediately

## Task Commits

1. **Task 1: LLM client, segmentation helper, and branded PDF generator** - `043d106` (feat)
2. **Task 2: Email delivery with scheduling and assessment action wiring** - `c9ff038` (feat)
3. **Fix: maxDuration route segment placement** - `32d852f` (fix)

## Files Created/Modified

- `src/lib/llm.ts` - Gemini via OpenAI SDK, draftEmailSequence() with cold/warm/hot prompts and fallback
- `src/lib/pdf.ts` - generateAssessmentPDF() returning Promise<Buffer> via PDFKit event listeners
- `src/lib/assessment.ts` - Added getSegment() after existing exports
- `src/lib/email.ts` - Rewritten with sendAssessmentEmailSequence(); kept sendAssessmentEmail() for backwards compat
- `src/app/assessment/actions.ts` - void fire-and-forget; removed old awaited sendAssessmentEmail call
- `src/app/assessment/page.tsx` - Added maxDuration = 30 route segment config

## Decisions Made

- Used `openai` SDK with `baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"` for Gemini — avoids adding a Gemini-specific package, reuses standard interface
- `maxDuration` export belongs in route segment config (`page.tsx`), not inside `"use server"` files — Next.js Turbopack rejects non-async exports from use server modules
- Each of the 5 Resend sends is individually try/caught — a day-30 failure won't prevent the initial email from delivering
- LLM JSON parse failures return a static fallback `EmailSequence` — email delivery is guaranteed regardless of LLM availability

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed maxDuration export from "use server" file**
- **Found during:** Build verification after Task 2
- **Issue:** Next.js Turbopack rejects non-async exports from `"use server"` files. `export const maxDuration = 30` caused a build error that also made `submitAssessmentForEmail` appear missing to the client
- **Fix:** Removed `maxDuration` from `actions.ts`; added `export const maxDuration = 30` to `src/app/assessment/page.tsx` (route segment config — the correct location)
- **Files modified:** src/app/assessment/actions.ts, src/app/assessment/page.tsx
- **Verification:** `npm run build` succeeds — 16 pages generated, no errors
- **Committed in:** 32d852f

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug)
**Impact on plan:** Fix was necessary for build to pass. No scope creep. Plan intent preserved.

## Issues Encountered

- `export const maxDuration` not allowed in `"use server"` files under Next.js 16/Turbopack — moved to route segment config in page.tsx

## User Setup Required

Add these environment variables before the email automation will function:

- `GEMINI_API_KEY` — Google AI Studio API key (for LLM email drafting)
- `LLM_MODEL` — optional, defaults to `gemini-2.0-flash`
- `RESEND_API_KEY` — already required; Resend account must have a verified sending domain (hello@asorahura.com)

Note: `scheduledAt` requires a Resend Pro plan. Without it, scheduled sends will error (individually caught — initial email still delivers).

## Next Phase Readiness

- Email automation backend is complete and wired
- Assessment completion now fires segmented LLM email + PDF automatically
- Ready for Plan 02 (Engage form) and Plan 03 (Services page) without further dependency on email infra
- Blog/extended sequences (Phase 3) can build on the same segmentation pattern established here

---
*Phase: 02-conversion-funnel*
*Completed: 2026-05-15*
