---
phase: 03-lead-nurture-blog-launch-extended-email-sequences-segmentation
plan: "03"
subsystem: email-automation
tags: [email, llm, nurture-sequence, segmentation, resend]
dependency_graph:
  requires: ["03-01"]
  provides: ["segment-aware nurture emails", "draftNurtureEmailSequence"]
  affects: ["src/lib/llm.ts", "src/lib/email.ts"]
tech_stack:
  added: []
  patterns: ["LLM JSON generation with fallback", "ISO 8601 scheduled sends", "segment-aware CTA routing"]
key_files:
  created: []
  modified:
    - src/lib/llm.ts
    - src/lib/email.ts
decisions:
  - "Separate LLM call for nurture sequence — keeps draftEmailSequence (initial email) isolated from follow-up generation; one failure does not block the other"
  - "ISO 8601 timestamps via Date.now() + N*86400000 — eliminates timezone ambiguity from natural language strings like 'in 3 days'"
  - "Fixed SEGMENT_CASE_STUDY map — deterministic blog slug per segment; fallback guaranteed to embed correct URL even if LLM fails"
metrics:
  duration: "~2 minutes"
  completed_date: "2026-05-15"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 03 Plan 03: Segment-Aware Nurture Email Sequence Summary

**One-liner:** 4-email LLM-generated nurture arc (Day 3 problem deepening, Day 7 case study, Day 14 process reveal, Day 30 offer) with cold/warm/hot segment CTAs and ISO 8601 scheduled sends.

## What Was Built

### Task 1: draftNurtureEmailSequence in src/lib/llm.ts (commit: 32457b0)

Appended to the end of `llm.ts` without modifying any existing code:

- `NurtureEmailSequence` type — day3/day7/day14/day30 EmailDraft fields
- `SEGMENT_CASE_STUDY` map — cold → `cervical-cancer-screening-tool`, warm → `ai-resume-reviewer`, hot → `chatbotly-nlp-analytics`
- `getNurtureSegmentAngle()` — returns tone/angle string per segment for LLM prompt
- `buildNurtureFallback()` — complete 4-email fallback sequence with correct segment CTAs (cold → `/blog`, warm → `/checkout?tier=discovery`, hot → `/checkout?tier=strategy`)
- `draftNurtureEmailSequence()` — exported async function; calls Gemini with JSON mode; validates day3/7/14/30 keys; falls back to `buildNurtureFallback` on parse or network failure

### Task 2: sendAssessmentEmailSequence updated in src/lib/email.ts (commit: 4bbdd14)

Surgical changes — only imports and the 4 follow-up send blocks touched:

- Added `draftNurtureEmailSequence` to the existing `@/lib/llm` import
- Added separate `nurture` LLM call block (independent try/catch from `sequence` call)
- Replaced Day 3/7/14/30 send blocks: use `nurture?.dayN.subject/body` with fallback strings
- Switched `scheduledAt` from natural language ("in 3 days") to ISO 8601 (`new Date(Date.now() + N * 86400000).toISOString()`)
- Initial email send block (immediate, with PDF) untouched

## Decisions Made

1. **Separate LLM call for nurture sequence** — `draftEmailSequence` (for the initial email) and `draftNurtureEmailSequence` (for Day 3-30) are called independently inside `sendAssessmentEmailSequence`. A failure in either does not cascade to block the other. This maintains the existing "each send independently try/caught" pattern from Phase 2.

2. **ISO 8601 timestamps** — Resend's natural language scheduling ("in 3 days") is ambiguous under timezone shifts. Computing from `Date.now()` at send time produces an unambiguous UTC timestamp for each scheduled email.

3. **Fixed blog slugs per segment** — Rather than asking the LLM to choose a case study, the `SEGMENT_CASE_STUDY` map hardcodes the correct slug per segment. This ensures the Day 7 email always contains a valid `/blog/{slug}` URL, even in the fallback path.

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

All plan verification checks passed:

- `npx tsc --noEmit` — zero errors
- `draftNurtureEmailSequence` exported from `src/lib/llm.ts` (line 185)
- `NurtureEmailSequence` exported from `src/lib/llm.ts` (line 125)
- `draftNurtureEmailSequence` appears in `src/lib/email.ts` at import (line 2) and call (line 105)
- `toISOString()` appears 4 times in `src/lib/email.ts` (lines 147, 161, 175, 189)
- `checkout?tier=discovery` present in fallback and LLM angle strings
- `checkout?tier=strategy` present in fallback and LLM angle strings
- `/blog` cold CTA and Day 7 URL construction both present

## Self-Check: PASSED

- src/lib/llm.ts: FOUND
- src/lib/email.ts: FOUND
- Commit 32457b0: FOUND
- Commit 4bbdd14: FOUND
