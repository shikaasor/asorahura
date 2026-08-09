# Deferred Items — Phase 08

## Pre-existing build failure: missing `prettier/standalone`

**Found during:** 08-01, Task 2 verification (`npm run build`)

**Issue:** `npm run build` fails with `Module not found: Can't resolve 'prettier/standalone'`, originating from `node_modules/@react-email/render/dist/node/index.mjs` (a transitive dependency of `resend`), reached via `src/lib/email.ts` and `src/lib/pdf.ts` → `src/app/blog/[slug]/page.tsx`, `src/app/api/subscribe/route.ts`, `src/app/assessment/deep/actions.ts`, `src/app/automate/instagram/success/page.tsx`.

**Scope determination:** Out of scope for this plan. Confirmed pre-existing: `prettier` is absent from `node_modules` in both this worktree and the main repo checkout (`C:\Users\HP_PC\Documents\DevOps\SAAS\asorahura\node_modules\prettier` does not exist). None of the files in the error's import trace were touched by 08-01's changes (dead-component deletion, `services/page.tsx`, `checkout/page.tsx`).

**Action taken:** Not fixed (package-manager install is excluded from auto-fix per deviation rules; would require `npm install` verification of a legitimate package, which is outside this plan's scope). Logged here for a future plan/task to address (likely needs `npm install prettier` or a lockfile sync).

**Status:** Deferred, not fixed.
