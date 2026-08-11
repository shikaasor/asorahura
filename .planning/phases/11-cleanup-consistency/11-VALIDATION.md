---
phase: 11
slug: cleanup-consistency
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-11
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.10 (unit testing) + Lighthouse CLI (performance, to be added) |
| **Config file** | vitest.config.ts + .lhcirc.json (Lighthouse CI, to be created) |
| **Quick run command** | `npm test -- tests/` |
| **Full suite command** | `npm test && npm run verify:contrast && npm run lighthouse` |
| **Estimated runtime** | ~10s quick / ~2min full |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- tests/`
- **After every plan wave:** Run `npm test && npm run verify:contrast && npm run lighthouse`
- **Before `/gsd-verify-work`:** Full suite must be green (tests pass, contrast script exits 0, Lighthouse thresholds met)
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 0 | POLISH-01 | — | Redirect from /flowmorph to / (HTTP 301) | unit (source check) | `grep "source: '/flowmorph'" next.config.mjs` | ✅ yes | ⬜ pending |
| 11-01-02 | 01 | 0 | POLISH-01 | — | Redirect from /automate/success to /automate/instagram/success | unit + integration | `curl -I https://asorahura.com/automate/success` | ✅ yes | ⬜ pending |
| 11-01-03 | 01 | 0 | POLISH-02 | — | Footer year renders current year dynamically | component (source check) | `grep "new Date().getFullYear()" src/components/home/Footer.tsx` | ❌ W0 | ⬜ pending |
| 11-01-04 | 01 | 0 | POLISH-03 | — | TrustBadges uses lucide-react icons, not emoji | component (source check) | `grep -v "🏆\|🔒\|✅" src/components/checkout/TrustBadges.tsx` | ❌ W0 | ⬜ pending |
| 11-01-05 | 01 | 0 | POLISH-04 | — | All images have alt text | component (source check) | `grep -rn "<Image" src --include="*.tsx" \| grep -v "alt="` | ❌ W0 | ⬜ pending |
| 11-01-06 | 01 | 0 | POLISH-04 | — | Interactive elements have :focus-visible styles | CSS check | `grep -r ":focus-visible" src --include="*.css"` | ❌ W0 | ⬜ pending |
| 11-01-07 | 01 | 0 | POLISH-05 | — | Pages responsive at 360/768/1024/1440 with no horizontal scroll | manual | Viewport DevTools check at each breakpoint | ❌ W0 | ⬜ pending |
| 11-01-08 | 01 | 0 | POLISH-06 | — | Lighthouse runs on `/` and `/automate`, meets thresholds | CI/CD | `npm run lighthouse` | ❌ W0 | ⬜ pending |
| 11-01-09 | 01 | 0 | POLISH-07 | — | README documents the token system | content check | `grep -A 20 "## Design System" README.md` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/home/Footer.tsx` — replace hardcoded `&copy; 2026` with `&copy; {new Date().getFullYear()}`
- [ ] `src/components/checkout/TrustBadges.tsx` — replace emoji (🏆 🔒 ✅) with lucide-react icons (Trophy, Lock, CheckCircle)
- [ ] `tests/test-polish-redirects.test.ts` — new test file covering all 4 redirects (flowmorph, automate/success, articles, assessment/deep)
- [ ] Add alt text to the 7 flagged `<Image>` components across blog, home, automate, and testimonials
- [ ] Add `:focus-visible` styles to globals.css and component CSS modules (buttons, links, inputs)
- [ ] Add explicit CSS rules for 1024px and 1440px breakpoints (currently only 480px and 768px exist)
- [ ] Create `.lhcirc.json` with thresholds: Performance ≥90, Accessibility ≥95, Best Practices ≥90, SEO ≥100
- [ ] Add `npm run lighthouse` script to package.json (install @lhci/cli)
- [ ] Create root `README.md` with a Design System section documenting the token system in `src/app/globals.css`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive layout integrity at 360/768/1024/1440 | POLISH-05 | No automated visual regression tooling in repo; requires human judgment of layout breakage | Open each page in DevTools responsive mode at each width; confirm no horizontal scroll, no overlapping content, nav/CTA remain usable |
| Keyboard navigation across the site | POLISH-04 | Tab-order and focus-trap behavior require interactive testing, not static analysis | Tab through each page's interactive elements; confirm visible focus ring and logical order |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
