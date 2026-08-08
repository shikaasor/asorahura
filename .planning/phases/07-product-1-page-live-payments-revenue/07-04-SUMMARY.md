---
phase: 07-product-1-page-live-payments-revenue
plan: 04
subsystem: payments
tags: [paddle, checkout, pricing, typescript, vitest]

# Dependency graph
requires:
  - phase: 07-01
    provides: "PAY-01 sandbox/production env-detection pattern (startsWith('test_')) established in /api/paddle/config-status"
provides:
  - "automateTiers config (build-map, dfy, dwy, care-plan) — single source of truth for DFY/DWY/Care Plan pricing and Paddle price IDs"
  - "getAutomateTierById() lookup helper mirroring existing getTierById"
  - "getPaddleEnvironment() — derives sandbox/production from NEXT_PUBLIC_PADDLE_TOKEN prefix, no hardcoded environment string"
  - "PaddleCheckout customData prop for webhook product identification"
affects: [07-08 (webhook), 07-09 (pricing UI), 07-10 (success page), 07-12 (page compose)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AutomateTier config array, additive to existing Tier/tiers, following the same env-var-sourced paddlePriceId pattern"
    - "getPaddleEnvironment() reused by both /api/paddle/config-status (server) and PaddleCheckout.tsx (client) for consistent sandbox/production detection"

key-files:
  created:
    - tests/test-automate-checkout.test.ts
  modified:
    - src/lib/checkout.ts
    - src/components/checkout/PaddleCheckout.tsx

key-decisions:
  - "Care Plan price is the literal string \"$9.99/mo\" — verified by test, matches PROJECT.md correction of the $99/mo typo"
  - "automateTiers is additive only; existing tiers/TierId/getTierById array left byte-for-byte unchanged (verified: still 2 entries, discovery + strategy)"
  - "customData is optional and spread conditionally into Checkout.open config so /checkout page (no customData) behaves identically to before"

patterns-established:
  - "Product tier configs live in src/lib/checkout.ts as env-var-backed arrays with an ID-based getter function"

requirements-completed: [PAY-02, PAY-03, PAY-04, PROD-03]

# Metrics
duration: 12min
completed: 2026-08-08
---

# Phase 07 Plan 04: Automate Checkout Config + PaddleCheckout Env Detection Summary

**automateTiers config (DFY $500, DWY $800, Care Plan $9.99/mo, Build Map free) plus PaddleCheckout auto-detecting sandbox/production from the Paddle token prefix and accepting optional customData for webhook product identification**

## Performance

- **Duration:** 12 min
- **Started:** 2026-08-08T06:51:00Z
- **Completed:** 2026-08-08T07:03:12Z
- **Tasks:** 2 completed
- **Files modified:** 3 (1 new test file, 2 modified source files)

## Accomplishments
- `automateTiers` array with 4 entries (build-map, dfy, dwy, care-plan) added to `src/lib/checkout.ts`, additive to the existing `tiers`/`TierId`/`getTierById`
- Care Plan price locked to the literal string `"$9.99/mo"`, verified by test (guards against the known $99/mo typo)
- `getPaddleEnvironment()` derives `"sandbox"` vs `"production"` from `NEXT_PUBLIC_PADDLE_TOKEN`'s `test_` prefix — same logic Plan 01 established in `/api/paddle/config-status`, now shared with the client checkout component
- `PaddleCheckout.tsx` no longer hardcodes `Environment.set("sandbox")`; it now calls `getPaddleEnvironment()`
- `PaddleCheckout` accepts an optional `customData?: Record<string, string>` prop, spread into `Checkout.open()`'s config only when present, so the existing `/checkout` page (discovery/strategy tiers, no customData) is unaffected

## Task Commits

Each task was committed atomically (TDD):

1. **Task 1: Add automateTiers config + getPaddleEnvironment helper**
   - `0fb7d93` (test) — failing tests for automateTiers, getAutomateTierById, getPaddleEnvironment
   - `a546905` (feat) — implementation: automateTiers, getAutomateTierById, getPaddleEnvironment
2. **Task 2: Wire PaddleCheckout to dynamic environment + custom data** - `904582c` (feat)

_Note: Task 1 used TDD (RED → GREEN); Task 2 had no `<behavior>` block requiring a dedicated test and was verified via type-check + manual acceptance-criteria review since the project's `npm run build` fails on a pre-existing, unrelated issue (see Issues Encountered)._

## Files Created/Modified
- `tests/test-automate-checkout.test.ts` - Tests for getPaddleEnvironment, getAutomateTierById, automateTiers, and non-regression of existing tiers array
- `src/lib/checkout.ts` - Appended AutomateTierId, AutomateTier, automateTiers, getAutomateTierById, getPaddleEnvironment (existing tiers/TierId/getTierById untouched)
- `src/components/checkout/PaddleCheckout.tsx` - Imports getPaddleEnvironment, replaces hardcoded "sandbox", adds optional customData prop passed into Checkout.open()

## Decisions Made
- Kept `getAutomateTierById`'s dfy-paddlePriceId test assertion tied to import-time `process.env` value rather than a runtime env mutation, since `automateTiers` (like the existing `tiers` array) is evaluated once at module load — matching the codebase's existing pattern rather than inventing a new dynamic-lookup mechanism not requested by the plan.

## Deviations from Plan

None - plan executed exactly as written. Test file adjusted once during RED→GREEN (see Issues Encountered) but final behavior and acceptance criteria match the plan's `<behavior>` block exactly.

## Issues Encountered
- Initial test for `getAutomateTierById("dfy")` set `process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY` at test-run time and expected the tier's `paddlePriceId` to reflect it. Since `automateTiers` is a module-level constant (same pattern as the pre-existing `tiers` array), it's evaluated once at import time, before the test's env mutation takes effect. Fixed by asserting the tier's `paddlePriceId` matches `process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY` as captured at import time (or `""` fallback) instead of a post-import runtime value. This matches the plan's actual behavior spec ("sourced from process.env...") without changing the array from a static, module-level constant to something dynamic — no such dynamism was requested.
- `npm run build` fails on a pre-existing, unrelated error: `Module not found: Can't resolve 'prettier/standalone'` (via `@react-email/render` → `resend` → `src/app/api/subscribe/route.ts` and `src/lib/pdf.ts`), and a second pre-existing TS error `Cannot find module 'next-mdx-remote/rsc'` in `src/app/blog/[slug]/page.tsx`. Neither touches checkout code. Per scope boundary, left as out-of-scope; verified this plan's changes independently via `npx tsc --noEmit` (no errors reference checkout.ts or PaddleCheckout.tsx) and via the passing test suite.

## User Setup Required

None - no external service configuration required. (Actual Paddle price ID env vars for DFY/DWY/Care Plan remain the responsibility of Plan 01/deployment config, already referenced via `process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_*`.)

## Next Phase Readiness
- `automateTiers`, `getAutomateTierById`, and `getPaddleEnvironment` are exported and ready for Plan 08 (webhook), 09 (pricing UI), 10 (success page), and 12 (page compose) to consume.
- `PaddleCheckout`'s `customData` prop is ready for the pricing UI (Plan 09) to pass a product-type identifier through to Paddle's webhook payload.
- No blockers. Pre-existing build failures (`prettier/standalone`, `next-mdx-remote/rsc`) are unrelated to this plan and should be tracked separately if they block a future plan's `npm run build` verification step.

---
*Phase: 07-product-1-page-live-payments-revenue*
*Completed: 2026-08-08*
