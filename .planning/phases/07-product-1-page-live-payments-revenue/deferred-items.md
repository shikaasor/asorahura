# Deferred Items — Phase 07

## Pre-existing: `npm run build` fails — missing `prettier` transitive dependency

- **Found during:** Plan 07-12, Task 1 verification (`npm run build`)
- **Symptom:** Build fails with `Module not found: Can't resolve 'prettier/standalone'` and `'prettier/plugins/html'`, originating from `@react-email/render` (a transitive dependency of `resend`), pulled in via `src/lib/email.ts` → `src/app/api/subscribe/route.ts`, `src/app/assessment/deep/actions.ts`, and `src/app/(automate)/success/page.tsx`.
- **Also observed:** `npx tsc --noEmit` reports a separate pre-existing error unrelated to this plan: `src/app/blog/[slug]/page.tsx` cannot find module `next-mdx-remote/rsc`.
- **Root cause:** `prettier` (declared in `package-lock.json` as a transitive dep of `@react-email/render` at `^3.5.3`) and `next-mdx-remote` are not present in the installed `node_modules` for this environment. This is an environment/install-state issue, not something introduced by this plan's files.
- **Scope:** Out of scope for Plan 07-12 — none of the affected files (`src/lib/email.ts`, `src/app/api/subscribe/route.ts`, `src/app/assessment/deep/actions.ts`, `src/app/(automate)/success/page.tsx`, `src/app/blog/[slug]/page.tsx`) are in this plan's `<files>` list (`src/app/(automate)/page.tsx`, `src/app/(automate)/error.tsx`).
- **Not auto-fixed:** Package installs are excluded from auto-fix per deviation rules (Rule 3 exclusion) — requires human verification before installing/reinstalling dependencies to avoid masking a broader environment problem.
- **Verification performed instead:** `npx tsc --noEmit -p .` shows zero errors attributable to the new files created in this plan (`src/app/(automate)/page.tsx`, `src/app/(automate)/error.tsx`, `src/app/(automate)/LandEventTracker.tsx`, `src/app/(automate)/page.module.css`). Manual source inspection confirms all acceptance criteria for Task 1 are met.
- **Recommended next step:** Run a full `npm install` (or equivalent) in the main repo to restore `prettier` and `next-mdx-remote` to `node_modules`, then re-run `npm run build` to confirm the whole app builds.
