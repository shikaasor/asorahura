---
phase: 07-product-1-page-live-payments-revenue
plan: 11
subsystem: payments
tags: [resend, react-email, paddle-webhook, plausible, email]

# Dependency graph
requires:
  - phase: 07-08
    provides: Paddle webhook route with signature verification and the transaction.completed branch stub
  - phase: 07-10
    provides: Success-page onboarding notification pattern (sendOnboardingNotification) reused as the send-and-log-on-failure convention
provides:
  - PurchaseConfirmation and OrderNotification React Email templates
  - sendPurchaseConfirmationEmail / sendOrderNotificationEmail helpers in src/lib/email.ts
  - Fully wired transaction.completed webhook branch: buyer email, owner email, automate-buyer Resend segmentation, server-side Plausible Purchase event
affects: [07-12, 07-13]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server-side Plausible Purchase event via direct fetch to plausible.io/api/event (no server SDK exists)"
    - "Promise.allSettled around independent webhook side-effects so one failure never blocks the others or the 200 response"

key-files:
  created:
    - src/emails/PurchaseConfirmation.tsx
    - src/emails/OrderNotification.tsx
  modified:
    - src/lib/email.ts
    - src/app/api/paddle/webhook/route.ts
    - tests/test-paddle-webhook.test.ts

key-decisions:
  - "productType resolved from event.data.items[0].price.custom_data.product with a fallback to event.data.custom_data.product and finally 'unknown', so the branch never throws on a missing field"
  - "Email helpers wrapped in try/catch internally (not just relying on Promise.allSettled) to fully satisfy the plan's 'never throw' requirement for sendPurchaseConfirmationEmail/sendOrderNotificationEmail"

patterns-established:
  - "New server-side email helpers follow sendBuildMapEmail's convention: catch, log, return { success, error } — never throw"

requirements-completed: [PAY-05, PAY-06, PROD-12, TRACK-03]

# Metrics
duration: 25min
completed: 2026-08-08
---

# Phase 07 Plan 11: Webhook Purchase Loop Summary

**Wired the Paddle transaction.completed webhook to send buyer + owner emails, segment the buyer as automate-buyer in Resend, and fire a server-side Plausible Purchase event — closing the payment loop so purchases are no longer silent.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-08-08T08:44:00Z
- **Completed:** 2026-08-08T08:52:00Z
- **Tasks:** 2
- **Files modified:** 5 (2 created, 3 modified)

## Accomplishments
- Buyer-facing `PurchaseConfirmation` and owner-facing `OrderNotification` email templates with product-specific copy (dfy/dwy/care-plan)
- `sendPurchaseConfirmationEmail` and `sendOrderNotificationEmail` helpers in `src/lib/email.ts`
- `transaction.completed` webhook branch now extracts productType/transactionId/amount/buyerEmail and fires emails, Resend `automate-buyer` segmentation, and a Plausible `Purchase` event, all via `Promise.allSettled`
- Full RED → GREEN TDD cycle for the webhook wiring, with the RED commit demonstrating the 3 new behavior assertions failing before implementation

## Task Commits

Each task was committed atomically:

1. **Task 1: Email templates** - `ae7c80e` (feat)
2. **Task 2: Wire webhook to emails + automate-buyer segmentation + Purchase event** - `12ca4f7` (test — RED), `14eed97` (feat — GREEN)

_Note: Task 2 used TDD (tdd="true"); RED and GREEN are separate commits. No REFACTOR commit was needed — the GREEN implementation required no follow-up cleanup._

## Files Created/Modified
- `src/emails/PurchaseConfirmation.tsx` - Buyer-facing order confirmation email with dfy/dwy/care-plan next-steps copy and unsubscribe footer
- `src/emails/OrderNotification.tsx` - Owner-facing new-order notification with onboarding-pending note for dfy/dwy
- `src/lib/email.ts` - Added `sendPurchaseConfirmationEmail` and `sendOrderNotificationEmail`, both try/catch-wrapped, never throw
- `src/app/api/paddle/webhook/route.ts` - `transaction.completed` branch now fully wired: emails, Resend `contacts.update` segmentation, Plausible `Purchase` event fetch, all inside one `Promise.allSettled` call; still always returns `{ ok: true }`
- `tests/test-paddle-webhook.test.ts` - Added `resend` and `../src/lib/email` mocks plus 4 new behavior tests covering emails, segmentation, analytics event, and graceful degradation on email rejection

## Decisions Made
- Field extraction for `productType`/`transactionId`/`amount`/`customer_email` follows the plan's explicit fallback chain (`items[0].price.custom_data.product` → `custom_data.product` → `"unknown"`) since Paddle's exact echo location can vary by API version and the branch must never throw on a missing field.
- Added an internal try/catch inside both new email helpers (beyond relying on the webhook's `Promise.allSettled`) so the helpers independently satisfy "never throw" per the plan's `<action>` spec — useful if these helpers are ever called from a context without `allSettled` protection.
- Switched the test file's dynamic `await import(...)` for `POST` to a static `import` after discovering `tsc --noEmit` rejects top-level await under the project's `target: "es5"` tsconfig; vitest's own transform tolerated it but the typecheck step did not. Static import works because `vi.mock` calls are hoisted above imports by the test runner's transform, matching the pattern already used in `tests/test-subscribe-build-map.test.ts` and `tests/test-onboarding-route.test.ts`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Top-level await in test file failed `tsc --noEmit`**
- **Found during:** Task 2 (Wire webhook to emails + automate-buyer segmentation + Purchase event) — post-GREEN typecheck verification
- **Issue:** Initial test setup used `const { POST } = await import(...)` after `vi.mock(...)` calls, which vitest ran fine but `tsc --noEmit -p tsconfig.json` rejected (`TS1378`, target `es5` doesn't support top-level await)
- **Fix:** Replaced with a standard static `import { POST } from "../src/app/api/paddle/webhook/route"` placed after the `vi.mock` calls — vitest's transform hoists `vi.mock` above imports regardless of source order, so mocking still applies
- **Files modified:** tests/test-paddle-webhook.test.ts
- **Verification:** `npx vitest run` (13/13 webhook tests, 91/91 full suite) and `npx tsc --noEmit -p tsconfig.json` both pass with zero errors
- **Committed in:** 14eed97 (Task 2 GREEN commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Fix was necessary to keep the codebase typecheck-clean; no scope creep, no behavior change to the shipped feature.

## Issues Encountered
- No local `node_modules` existed in this worktree at start; ran `npm ci --prefer-offline --no-audit --no-fund` (584 packages, ~50s) before any test/typecheck could run. `node_modules` remains correctly gitignored.

## User Setup Required
None - no external service configuration required beyond what prior Phase 7 plans (07-01 Paddle setup, existing `RESEND_API_KEY`/`RESEND_AUDIENCE_ID`) already established. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and `OWNER_EMAIL` are optional env vars with sensible defaults (`"asorahura.com"` and `"hello@asorahura.com"` respectively) already used elsewhere in this codebase.

## Next Phase Readiness
- Purchase loop is complete end-to-end: a `transaction.completed` webhook now reliably notifies both buyer and owner, segments the buyer for future upsell targeting, and reports revenue to Plausible — no manual dashboard polling required.
- No blockers for downstream plans (07-12, 07-13) that build on the completed payment loop.

---
*Phase: 07-product-1-page-live-payments-revenue*
*Completed: 2026-08-08*
