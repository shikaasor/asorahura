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

**Action taken:** Not fixed. Logged here for a future phase/task. This means `npm run build` will continue to fail through Phase 8's post-merge test gates for reasons unrelated to this phase's work; treat repeated failures in this specific `pdfkit`/`fs` trace as this known issue, not a Phase 8 regression.

**Status:** Deferred, not fixed.
