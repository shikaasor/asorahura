---
phase: 07-product-1-page-live-payments-revenue
plan: 13
subsystem: verification
tags: [checkpoint, human-verify]

# Dependency graph
requires:
  - phase: 07-product-1-page-live-payments-revenue (plans 01-12)
    provides: full /automate funnel (analytics, lead capture, checkout, webhook, success page, page composition)
provides:
  - "Gap-closure fixes for the 3 placeholder blockers flagged by earlier plan summaries"
affects: []
---

# Plan 13: Final End-to-End Verification — Partial Status

## Status: BLOCKED on human live-walkthrough + Paddle production approval

This plan has no code of its own — it verifies Plans 01-12 work together as a system,
on a real device, against live Paddle/Resend. During the checkpoint, the user surfaced
concrete blockers and new information (Paddle's domain review requirements) that were
resolved in-session before the live walkthrough could happen.

## Gap-closure fixes applied (commit `11dcbe4`, plus `ee6f788`/`8e1c1fe` for the Refund page)

| Blocker (flagged by) | Fix |
|---|---|
| Refund Policy only reachable via `/automate#faq` anchor, not nav-accessible (Paddle domain review requirement) | Added standalone `/refund` page; linked from both site-wide footer and `/automate` footer |
| Terms of Service missing legal entity name (Paddle domain review requirement) | User deferred — kept "Asor Ahura" as-is, to refine before actual Paddle submission |
| PhoneMockup screenshot was a styled placeholder div (07-07) | Replaced with real `@ai_learnt` DM screenshot (`public/images/automate/dm-screenshot.png`), sourced from user-provided Instagram carousel |
| Build Map email sent from `hello@asorahura.com`, linked to placeholder `.txt` (07-05) | Now sends from `resources@asorahura.com`, links to the real Google Drive deliverable the user provided |
| `NEXT_PUBLIC_AUTOMATE_REEL_URL` unset — Hero showed "Reel embed pending" (07-06) | Set to the user's published Reel (`https://www.instagram.com/reel/DbtS6Ijuolu/embed`) in `.env.local` |

## Still open — requires the user, not code

1. **Paddle production approval.** Per user: "We need to finish the website before Paddle will give approval" — the website is now feature-complete per the domain review checklist (product description, pricing, features, Privacy/Terms/Refund nav-accessible, legal name pending). Next step is the user's own Paddle dashboard submission (see 07-01 checkpoint). Until approved, `NEXT_PUBLIC_PADDLE_TOKEN` stays in sandbox mode.
2. **Production env vars.** `NEXT_PUBLIC_AUTOMATE_REEL_URL` was only set in local `.env.local` — must also be set in the production hosting environment (e.g. Vercel) before launch.
3. **The 6 live checks from this plan's `<how-to-verify>`** — real device, real Paddle transaction, real email inbox delivery, real Plausible dashboard — cannot be executed by an agent. These remain the user's responsibility once Paddle production is approved.

## Recommendation

Phase 7's code is complete (Plans 01-12 + this gap-closure). Do not mark Plan 13 as
passed/complete until the user completes Paddle production approval and reports back
on the 6 live checks. Re-run this checkpoint at that time.
