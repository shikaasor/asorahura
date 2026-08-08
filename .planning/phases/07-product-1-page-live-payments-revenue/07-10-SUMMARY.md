---
phase: 07-product-1-page-live-payments-revenue
plan: 10
subsystem: payments
tags: [nextjs, react-hook-form, zod, resend, paddle-postpurchase]

# Dependency graph
requires:
  - phase: 07-product-1-page-live-payments-revenue (plans 03-05)
    provides: automateSuccessSchema (07-05), getAutomateTierById/automateTiers (07-03/04), CALENDLY_URL and email infra (existing)
provides:
  - "/automate/success?product=dfy|dwy" onboarding page, differentiated by product
  - "/api/automate/onboarding" POST route that validates and emails the owner
  - "sendOnboardingNotification()" helper and exported CALENDLY_URL in src/lib/email.ts
affects: [07-08 (Paddle webhook — server-side confirmation counterpart), 07-checkout-integration (client redirect to this page on Paddle success callback)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Suspense + useSearchParams() wrapper for client components reading query params (matches src/app/checkout/page.tsx)"
    - "React Hook Form + zodResolver against a schema shared with the API route (matches BuildMapForm.tsx)"
    - "API routes use relative imports (../../.. /lib/x), not the @/ alias — required for vitest module resolution without a configured alias in vitest.config.ts"

key-files:
  created:
    - "src/app/api/automate/onboarding/route.ts"
    - "src/app/(automate)/success/page.tsx"
    - "src/app/(automate)/success/success.module.css"
    - "tests/test-onboarding-route.test.ts"
  modified:
    - "src/lib/email.ts"

key-decisions:
  - "CALENDLY_URL changed from module-private const to exported const in src/lib/email.ts — the DWY scheduling exception (REQUIREMENTS.md Out of Scope table) needed the same constant the enterprise flow uses, not a duplicate literal."
  - "API route uses relative imports instead of the @/ path alias — vitest.config.ts has no alias resolution configured, so @/-style imports fail to resolve under vitest even though Next.js resolves them fine. src/app/api/subscribe/route.ts already established this relative-import convention for the same reason."
  - "No React component test written for success/page.tsx — the project has no jsdom/RTL test infrastructure (vitest.config.ts environment is \"node\"; no other test in tests/ renders a page.tsx). Task 2's <behavior> claims are verified by source-level acceptance criteria (grep checks) and code review instead, consistent with the plan's actual <verify> command, which is grep-only."

patterns-established:
  - "Product-differentiated post-purchase page: read `product` search param defaulting to the safer/base tier, branch rendering per product without duplicating the form"

requirements-completed: [PAY-07, PAY-08, PAY-09]

# Metrics
duration: 25min
completed: 2026-08-08
---

# Phase 07 Plan 10: Onboarding Success Page + API Summary

**Product-differentiated `/automate/success` page (DFY form-only vs. DWY form+scheduling) posting to a new `/api/automate/onboarding` route that emails the owner, explicitly avoiding the Calendly-for-everyone anti-pattern from the existing `/checkout/success` page.**

## Performance

- **Duration:** ~25 min
- **Tasks:** 2 completed
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments
- `/api/automate/onboarding` validates `{ product, igHandle, keyword, leadMagnetLink, voiceTone }` with `automateSuccessSchema`, emails the owner via a new `sendOnboardingNotification()` helper, and never blocks the client 200 response on email failure (logs instead)
- `/automate/success` renders the 4-field onboarding form for both `dfy` and `dwy`, adding a "Schedule Build Session" link (to the now-exported `CALENDLY_URL`) only for `dwy` — no iframe, no Calendly for DFY
- Care Plan next-rung copy reads price from `getAutomateTierById("care-plan").price` (not hardcoded) and links to `/automate#pricing`, with no `/assessment` link anywhere in the file (PROD-12 constraint honored)

## Task Commits

Each task was committed atomically:

1. **Task 1: Onboarding API route** - `694778b` (feat) — TDD: wrote `tests/test-onboarding-route.test.ts` covering the 3 `<behavior>` cases (valid dfy 200, invalid igHandle 400 with field message, dwy+schedulingConfirmed 200) alongside the implementation; all 3 pass.
2. **Task 2: Success page (DFY/DWY differentiated)** - `4d013b5` (feat)

**Plan metadata:** (this commit, not yet made — see below)

## Files Created/Modified
- `src/app/api/automate/onboarding/route.ts` - POST handler: validates product type inline + automateSuccessSchema, calls sendOnboardingNotification, returns { ok: true }
- `src/lib/email.ts` - exported CALENDLY_URL; added sendOnboardingNotification() sending the 4 fields + product to OWNER_EMAIL (fallback hello@asorahura.com)
- `src/app/(automate)/success/page.tsx` - Suspense-wrapped client page reading `?product=`, renders the 4-field RHF+Zod form, conditional DWY scheduling link, Care Plan next-rung copy
- `src/app/(automate)/success/success.module.css` - styling using the existing numbered design-token scale (`--spacing-N`, `--fontSize-N`, `--radius-N`), matching BuildMapForm.module.css conventions
- `tests/test-onboarding-route.test.ts` - 3 tests for the API route's `<behavior>` cases

## Decisions Made
- Exported `CALENDLY_URL` from `src/lib/email.ts` rather than duplicating the literal in the success page — single source of truth for the one sanctioned post-purchase Calendly exception.
- Used relative imports in the new API route (matching `src/app/api/subscribe/route.ts`'s existing convention) instead of the `@/` alias, because `vitest.config.ts` has no alias configured and `@/`-style imports fail to resolve under the test runner.
- UI-SPEC's spacing/radius token names (`--spacing-lg`, `--radius-md`, etc.) don't exist in `src/app/globals.css`; used the project's actual numbered scale (`--spacing-3`, `--radius-1`, etc.) to match `BuildMapForm.module.css` and other automate components — this is the codebase's real convention, not a deviation from the design intent.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Switched API route imports from `@/` alias to relative paths**
- **Found during:** Task 1, first test run
- **Issue:** `import { automateSuccessSchema } from "@/lib/schemas"` failed under vitest with "Cannot find package '@/lib/schemas'" — `vitest.config.ts` has no `resolve.alias` or `vite-tsconfig-paths` plugin configured, even though Next.js itself resolves `@/` via `tsconfig.json` paths.
- **Fix:** Changed both imports in `route.ts` to relative paths (`../../../../lib/schemas`, `../../../../lib/email`), matching the existing convention in `src/app/api/subscribe/route.ts`.
- **Files modified:** `src/app/api/automate/onboarding/route.ts`
- **Verification:** `npx vitest run tests/test-onboarding-route.test.ts` — all 3 tests pass.
- **Committed in:** `694778b` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary for tests to run at all; no scope creep. `src/app/(automate)/success/page.tsx` retained `@/` imports since Next.js's own build resolves them fine and no test renders that file directly.

## Issues Encountered
- No jsdom/React Testing Library infrastructure exists in this project (`vitest.config.ts` environment is `"node"`, no `@testing-library/react` dependency, and no other test in `tests/` renders a `page.tsx` component). Task 2's `<behavior>` block describes rendering-based assertions (e.g., "Rendering the success page with ?product=dfy shows the 4-field form") that cannot be executed as automated component tests with the current infra. The plan's own `<verify>` step for this task is a grep command, not a test command, so this is consistent with what's actually required — verified via source-level acceptance criteria (grep checks for `/assessment`, Calendly iframe, schema import) and manual code review instead.

## User Setup Required

None - no external service configuration required. (`OWNER_EMAIL` env var is optional with a `hello@asorahura.com` fallback, consistent with existing `src/lib/email.ts` patterns.)

## Next Phase Readiness
- `/automate/success?product=dfy|dwy` is ready to receive the Paddle client-side success redirect once the checkout button wiring (07-06/07-07 or later plan) points to it.
- The Paddle webhook (Plan 07-08/11) still owns server-side purchase confirmation and tagging — this plan only handles the client-side onboarding form and owner notification, per the RESEARCH.md architecture split.
- T-07-16 (unauthenticated POST to `/api/automate/onboarding`) remains an accepted risk per the plan's threat model — no order persistence exists yet to gate this route on a transaction ID.

---
*Phase: 07-product-1-page-live-payments-revenue*
*Completed: 2026-08-08*
