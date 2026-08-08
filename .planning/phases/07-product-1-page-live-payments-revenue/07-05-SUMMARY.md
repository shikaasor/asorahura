---
phase: 07-product-1-page-live-payments-revenue
plan: 05
subsystem: api
tags: [zod, react-hook-form, resend, nextjs-api-route, lead-capture]

requires:
  - phase: 07-02
    provides: analytics.ts (trackAnalyticsEvent) used by BuildMapForm's "Build Map Submit" event

provides:
  - buildMapSchema + automateSuccessSchema Zod validation (src/lib/schemas.ts)
  - Build Map email capture form (BuildMapForm.tsx) wired to /api/subscribe
  - /api/subscribe extended to segment build-map downloaders via Resend contact properties, mirror to Sheets as formType "build-map", and send a transactional download-link email — with the pre-existing blog widget caller unaffected
  - sendBuildMapEmail() helper in src/lib/email.ts
  - Placeholder Build Map deliverable at public/downloads/build-map-guide.txt (flagged for human replacement)

affects: [07-06, 07-07, 07-08, 07-09, 07-10, 07-11, 07-12, 07-13]

tech-stack:
  added: []
  patterns:
    - "Resend segmentation via contacts.create({ properties: { segment: ... } }), with contacts.update() fallback when the contact already exists (v6.12.3 SDK has no `tags` field on contacts — properties is the actual mechanism)"
    - "Optional `source` field on shared /api/subscribe route branches behavior without touching the default (no-source) path, so multiple callers (blog widget, Build Map form) stay decoupled"

key-files:
  created:
    - src/lib/schemas.ts
    - src/components/automate/BuildMapForm.tsx
    - src/components/automate/BuildMapForm.module.css
    - public/downloads/build-map-guide.txt
    - tests/test-schemas.test.ts
    - tests/test-subscribe-build-map.test.ts
  modified:
    - src/app/api/subscribe/route.ts
    - src/lib/email.ts

key-decisions:
  - "Used Resend's properties field (not tags) for segmentation, per actual v6.12.3 SDK types — RESEARCH.md's tags-based pseudocode is superseded"
  - "sendBuildMapEmail imported via a relative path in route.ts (not the @/lib/email alias) because vitest.config.ts has no path-alias resolver configured; this keeps the route unit-testable without changing the shared vitest config"

patterns-established:
  - "Build Map form status machine: idle | loading | success | error | already-subscribed, driven by parsing the /api/subscribe error message for the substring 'already'"

requirements-completed: [LEAD-01, LEAD-02, LEAD-03, LEAD-04]

duration: 45min
completed: 2026-08-08
---

# Phase 07 Plan 05: Build Map Lead Capture Summary

**Email-gated Build Map lead flow — Zod-validated form → Resend contact segmented via `properties.segment=build-map-downloader` (with update-fallback for returning downloaders) → Google Sheets mirror → transactional download-link email — while the existing untagged blog widget caller is untouched.**

## Performance

- **Duration:** ~45 min
- **Tasks:** 3 completed
- **Files modified:** 8 (4 created source files, 2 test files, 1 placeholder asset, 2 modified source files)

## Accomplishments
- `src/lib/schemas.ts`: `buildMapSchema` and `automateSuccessSchema` (the latter shared with Plan 07-10's success-page form), both test-covered
- `/api/subscribe` extended non-destructively: `source === "build-map"` branches into Resend segmentation + email send + Sheets `formType: "build-map"`; absent/other `source` reproduces the exact prior behavior (verified by an explicit "no properties field, zero email sends, formType newsletter" test)
- `BuildMapForm.tsx`: real-time Zod-validated email capture with all UI-SPEC § Section 6 states (valid/invalid/loading/success/already-subscribed/error), styled entirely from `globals.css` tokens (zero hardcoded hex)
- Placeholder Build Map deliverable created and clearly labeled `PLACEHOLDER` (the real 4 n8n workflow files + env template + deploy guide do not exist in the repo — see below)

## Task Commits

Each task was committed atomically (TDD RED → GREEN):

1. **Task 1: Zod schemas + placeholder deliverable**
   - `9d01d01` test: add failing test for buildMap and automateSuccess Zod schemas
   - `ac01792` feat: implement buildMapSchema, automateSuccessSchema, placeholder Build Map deliverable
2. **Task 2: Extend /api/subscribe with Build Map segmentation + email send**
   - `856dee2` test: add failing test for build-map segmentation + email in /api/subscribe
   - `b65ee70` feat: extend /api/subscribe with build-map segmentation + email send
3. **Task 3: BuildMapForm component**
   - `d987045` feat: add BuildMapForm component with real-time validation

## Files Created/Modified
- `src/lib/schemas.ts` - `buildMapSchema` (email), `automateSuccessSchema` (igHandle/keyword/leadMagnetLink/voiceTone), exported inferred types
- `public/downloads/build-map-guide.txt` - Clearly-labeled placeholder deliverable, restates the 4-tier value proposition so the file isn't empty
- `src/app/api/subscribe/route.ts` - Accepts optional `source`; branches to Resend `properties` segmentation, update-fallback for existing contacts, `sendBuildMapEmail()` call, and `formType: "build-map"` Sheets mirror when `source === "build-map"`; identical to pre-change behavior otherwise
- `src/lib/email.ts` - Added `sendBuildMapEmail(email)` helper (plain-text send from `hello@asorahura.com`, includes `unsubscribeFooter`)
- `src/components/automate/BuildMapForm.tsx` - Client component, React Hook Form + `zodResolver(buildMapSchema)`, POSTs to `/api/subscribe` with `source: "build-map"`, fires `"Build Map Submit"` analytics event
- `src/components/automate/BuildMapForm.module.css` - Token-only styling (`--surface-2`, `--border-1/2`, `--success`, `--error`, `--accent`, spacing/radius/fontSize scale)
- `tests/test-schemas.test.ts`, `tests/test-subscribe-build-map.test.ts` - Behavior coverage per plan's `<behavior>` and `<acceptance_criteria>` blocks

## Decisions Made
- Segmentation implemented via Resend's `properties` field (not `tags`) — confirmed by reading the installed `resend@6.12.3` SDK type definitions directly, since `tags` does not exist on `CreateContactOptions`/`UpdateContactOptions` in this version
- `route.ts` imports `sendBuildMapEmail` via a relative path (`../../../lib/email`) rather than the `@/lib/email` alias used elsewhere in the codebase, because `vitest.config.ts` has no path-alias resolver configured (confirmed by a throwaway repro test — `@/lib/...` imports fail to resolve under `vitest run`). This is scoped to the one file under test; no change was made to the shared vitest config, keeping the fix surgical per CLAUDE.md.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing `node_modules` in worktree**
- **Found during:** Task 1 setup (attempting to run `npm test`)
- **Issue:** This git worktree had no `node_modules` installed, blocking any test run
- **Fix:** Ran `npm install` (584 packages, matches root `package-lock.json` — no new dependencies added)
- **Files modified:** none (node_modules is gitignored)
- **Verification:** `npx vitest run` executed successfully afterward
- **Committed in:** n/a (not a tracked change)

**2. [Rule 3 - Blocking] `@/lib/email` path-alias import unresolvable under vitest**
- **Found during:** Task 2 (writing the failing test for the extended `/api/subscribe` route)
- **Issue:** `vitest.config.ts` has no `resolve.alias` or tsconfig-paths plugin, so any file importing via the `@/...` alias fails to load under `vitest run` (confirmed via a throwaway repro test on the already-existing `src/lib/email.ts`, which itself uses `@/lib/llm` etc.)
- **Fix:** `route.ts` imports `sendBuildMapEmail` via a relative path instead of the `@/lib/email` alias. Scoped strictly to this one new import; did not touch `vitest.config.ts` or convert any other file's existing `@/` imports
- **Files modified:** src/app/api/subscribe/route.ts
- **Verification:** `npx vitest run tests/test-subscribe-build-map.test.ts` passes; `npx tsc --noEmit` reports no errors (relative import is type-equivalent to the alias)
- **Committed in:** b65ee70 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking, both necessary to make the plan's own tests runnable)
**Impact on plan:** No scope creep — both fixes were prerequisites for running the tests the plan itself specifies. No shared config files were modified.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required

None - no new external service configuration required (reuses existing `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `GOOGLE_SCRIPT_URL`).

**Content gap (carried forward from plan, not fixed by this plan — flagging per plan instructions):** `public/downloads/build-map-guide.txt` is a clearly-labeled **placeholder**. The real Build Map deliverable (4 n8n workflow JSON exports, a `.env.example` template, and a step-by-step deployment guide, per `PROJECT.md`) does not exist anywhere in the repo. The founder must replace this file with the real deliverable before `/automate` is used to acquire real leads.

## Next Phase Readiness
- `buildMapSchema` and `automateSuccessSchema` are both ready for reuse — Plan 07-10 (success-page form) depends on `automateSuccessSchema` from this plan
- `BuildMapForm` is a standalone component ready to be composed into the `/automate` page in a later wave (page composition is out of this plan's scope)
- Blocker carried forward: real Build Map deliverable content still needed before launch (see above)

---
*Phase: 07-product-1-page-live-payments-revenue*
*Completed: 2026-08-08*

## Self-Check: PASSED

All 8 created/modified files verified present on disk. All 6 task/summary commits (9d01d01, ac01792, 856dee2, b65ee70, d987045, 64ae2fb) verified present in `git log`.
