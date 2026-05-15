---
phase: 03-lead-nurture-blog-launch-extended-email-sequences-segmentation
plan: "04"
subsystem: blog
tags: [email-capture, newsletter, resend, blog, funnel]
dependency_graph:
  requires: ["03-02"]
  provides: ["BLOG-05"]
  affects: ["blog listing", "blog article pages", "Resend audience"]
tech_stack:
  added: ["resend contacts API"]
  patterns: ["client component in server component boundary", "fetch POST pattern"]
key_files:
  created:
    - src/components/blog/EmailCaptureWidget.tsx
    - src/app/api/subscribe/route.ts
  modified:
    - src/app/blog/BlogListingClient.tsx
    - src/app/blog/[slug]/page.tsx
decisions:
  - "EmailCaptureWidget is a 'use client' component imported into server components — Next.js handles the client boundary automatically"
  - "RESEND_AUDIENCE_ID env var required at runtime; absence returns 500 with config error (graceful degradation)"
  - "Input focus border change handled via React state (inputFocused) rather than CSS :focus — inline styles do not support pseudo-selectors"
metrics:
  duration: "~2 minutes"
  completed: "2026-05-15T13:12:19Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 2
---

# Phase 03 Plan 04: Blog Email Capture Widget Summary

**One-liner:** Email capture widget with Resend contacts API integration wired into blog listing and article pages, closing the BLOG-05 secondary funnel gap.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create EmailCaptureWidget and subscribe API route | 71f291e | src/components/blog/EmailCaptureWidget.tsx, src/app/api/subscribe/route.ts |
| 2 | Integrate EmailCaptureWidget into blog listing and article pages | 30abd4e | src/app/blog/BlogListingClient.tsx, src/app/blog/[slug]/page.tsx |

## What Was Built

### EmailCaptureWidget (src/components/blog/EmailCaptureWidget.tsx)
Client component with dark aesthetic matching BlogCTABlock. Manages idle/loading/success/error states. POSTs email to `/api/subscribe`, shows "You're on the list. Expect insights, not noise." on success, or user-friendly error messages on failure.

### POST /api/subscribe (src/app/api/subscribe/route.ts)
Next.js App Router route handler. Validates email format (400 on failure), checks `RESEND_AUDIENCE_ID` env var (500 if absent), calls `resend.contacts.create()` to add subscriber to Resend audience.

### Blog listing page integration
EmailCaptureWidget placed between CategoryFilter and card grid with `marginBottom: '3rem'` wrapper.

### Blog article page integration
EmailCaptureWidget placed below BlogCTABlock with `marginTop: '2rem'` wrapper. Works as client component imported from a server component — Next.js client boundary handled automatically.

## Deviations from Plan

None - plan executed exactly as written.

## Success Criteria Verified

- [x] Email capture widget exists at src/components/blog/EmailCaptureWidget.tsx
- [x] Widget shows "Get automation insights twice a month." heading (exact phrasing)
- [x] Widget appears on /blog listing page (below category filter, above card grid)
- [x] Widget appears on every blog article page (below BlogCTABlock)
- [x] POST /api/subscribe wires to Resend contacts.create() with RESEND_AUDIENCE_ID env var
- [x] Form handles success, validation error, and API error states without crashing
- [x] Dark aesthetic consistent with BlogCTABlock (#0a0a0a background, #1f1f1f border, #ffffff text)
- [x] `npx tsc --noEmit` passes with zero errors
- [x] `npm run build` completes successfully

## Notes

- `RESEND_AUDIENCE_ID` must be added to `.env.local` (get from Resend Dashboard > Audiences > select audience > copy ID)
- Input focus state managed via React `useState` (`inputFocused`) since inline styles do not support CSS pseudo-selectors

## Self-Check: PASSED
