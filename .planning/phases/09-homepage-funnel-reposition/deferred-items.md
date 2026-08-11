# Deferred Items — Phase 09

## Pre-existing test failure (out of scope for 09-02)

- **Test:** `tests/test-calendly-removal-pages.test.ts:29` — "checkout/page.tsx routes the enterprise CTA through /engage"
- **Failure:** `expect(checkoutSource).toContain("/engage?enterprise=true")` fails.
- **Cause:** Unrelated to Plan 09-02's scope (layout.tsx metadata, Footer.tsx tagline/nav). Traced to `src/app/checkout/page.tsx`, last touched by phase 08/10 commits (`38d6ed4`, `ccf735c`, `2c48588`), none of which are part of Plan 09-02.
- **Action:** Not fixed per scope boundary rule — logged here instead. Full suite result: 178/179 passing, 1 pre-existing failure.
