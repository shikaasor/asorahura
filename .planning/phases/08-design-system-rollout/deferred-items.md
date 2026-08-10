# Deferred Items — Phase 08

## Pre-existing build failure: missing `prettier/standalone`

**Found during:** 08-01, Task 2 verification (`npm run build`)

**Issue:** `npm run build` fails with `Module not found: Can't resolve 'prettier/standalone'`, originating from `node_modules/@react-email/render/dist/node/index.mjs` (a transitive dependency of `resend`), reached via `src/lib/email.ts` and `src/lib/pdf.ts` → `src/app/blog/[slug]/page.tsx`, `src/app/api/subscribe/route.ts`, `src/app/assessment/deep/actions.ts`, `src/app/automate/instagram/success/page.tsx`.

**Scope determination:** Out of scope for this plan. Confirmed pre-existing: `prettier` is absent from `node_modules` in both this worktree and the main repo checkout (`C:\Users\HP_PC\Documents\DevOps\SAAS\asorahura\node_modules\prettier` does not exist). None of the files in the error's import trace were touched by 08-01's changes (dead-component deletion, `services/page.tsx`, `checkout/page.tsx`).

**Action taken:** Resolved by orchestrator after Wave 1 merge — `prettier@3.8.3` was already pinned in `package-lock.json` but missing from `node_modules` (stale/interrupted install). Ran `npm install` (no version/dependency changes, pure reinstall from existing lockfile) to restore it.

**Status:** Resolved.

## Pre-existing build failure: `pdfkit` bundled into a client component

**Found during:** Orchestrator post-Wave-1 build verification (`npm run build`), after the `prettier` fix above unblocked the first error.

**Issue:** `npm run build` fails with `Module not found: Can't resolve 'fs'` from `node_modules/pdfkit/js/pdfkit.es.js`, reached via `src/lib/pdf.ts` → `src/lib/email.ts` → `src/app/automate/instagram/success/page.tsx`. `pdfkit` is a Node-only library (imports `fs`, `events`) being pulled into the client bundle because `automate/instagram/success/page.tsx` is a Client Component that imports `email.ts` (server-only code) at module scope.

**Scope determination:** Out of scope for Phase 8 (design-system-rollout / color-token conversion). This is a pre-existing server/client boundary bug unrelated to CSS or color tokens — fixing it requires either marking the page/import as server-only, dynamic-importing `pdf.ts` inside a server action, or restructuring the `email.ts`/`pdf.ts` import graph so `pdfkit` never reaches the client bundle. None of Phase 8's plans touch these files.

**Action taken:** Fixed post-phase-close, at user request, by extracting `CALENDLY_URL` out of `src/lib/email.ts` (server-only: imports `resend`, `@/lib/llm`, `@/lib/pdf`) into a new `src/lib/constants.ts` with no server-only imports. Updated `src/app/automate/instagram/success/page.tsx` (a Client Component) to import `CALENDLY_URL` from `@/lib/constants` instead of `@/lib/email`, so the client bundle graph never reaches `pdf.ts`/`pdfkit`. `email.ts` re-exports `CALENDLY_URL` from `constants.ts` for any other consumer. `npm run build` now exits 0; `npx tsc --noEmit` and `npm run test` (178/179, only the pre-existing checkout-CTA test below still fails) both re-verified clean.

**Status:** Resolved.

## Pre-existing dependency install gaps: `prettier`, `next-mdx-remote/rsc`

**Found during:** Orchestrator post-Wave-2 verification (`npx tsc --noEmit`).

**Issue:** `npx tsc --noEmit` failed with `Cannot find module 'next-mdx-remote/rsc'` in `src/app/blog/[slug]/page.tsx`. `node_modules/next-mdx-remote` existed but was an empty directory (no files) despite being correctly pinned in `package.json`/`package-lock.json` — same class of stale/incomplete install as the `prettier` issue above.

**Scope determination:** Out of scope for Phase 8. Unrelated to any file this phase's plans touch.

**Action taken:** Resolved by orchestrator — ran `npm install next-mdx-remote@^6.0.0 --no-save` (already pinned at this version; no dependency change) to restore the package contents. `npx tsc --noEmit` now passes clean.

**Status:** Resolved.

## Pre-existing test failure: checkout enterprise-CTA test contradicts Phase 10 WR-02

**Found during:** Orchestrator post-Wave-2 verification (`npm run test`).

**Issue:** `tests/test-calendly-removal-pages.test.ts` (added in Phase 10 commit `104b852`, "route services and checkout CTAs through /engage instead of Calendly") asserts `checkout/page.tsx` contains `/engage?enterprise=true`. A later Phase 10 commit, `2c48588` ("fix(10): WR-02 remove dead enterprise CTA branch from checkout page"), removed that exact branch and its `/engage` routing text as dead code — but did not update this test. The two Phase 10 commits are now mutually inconsistent.

**Scope determination:** Out of scope for Phase 8. Pre-existing since Phase 10; none of Phase 8's plans touch checkout CTA routing logic (08-01 confirmed the `isEnterprise` branch was already gone before Phase 8 started; 08-02 only touched CSS token values in the same file).

**Action taken:** Not fixed. Logged here for a future phase/task to resolve (either restore the enterprise routing or update/remove the outdated test assertion).

**Status:** Deferred, not fixed. 1 test file / 1 test fails in `npm run test` for this reason — treat it as this known pre-existing issue, not a Phase 8 regression.
