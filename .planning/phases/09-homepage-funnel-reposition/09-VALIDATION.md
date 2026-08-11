---
phase: 09
slug: homepage-funnel-reposition
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-11
---

# Phase 09 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + React Testing Library (existing from Phase 6) |
| **Config file** | `vitest.config.ts` (existing) |
| **Quick run command** | `npm run test -- --watch src/components/home` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --watch src/components/home`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd-verify-work`:** Full suite green + grep checks on hardcoded text
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | HOME-12 | — | N/A | unit (text search) | `grep "hours" src/components/home/HeroSection.tsx \| wc -l` (should be 0) | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-13 | — | N/A | unit (text search) | `grep -i "aba\|sr 11-7\|ai act\|fair housing" src/components/home/PainSection.tsx \| wc -l` (should be 0) | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-13 | — | N/A | unit (link check) | `grep href="/enterprise" src/components/home/PainSection.tsx \| wc -l` (should be ≥1) | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-14 | — | N/A | unit (text + link) | `grep -E "Free\|500\|800" src/components/home/ServicesPreview.tsx \| wc -l` (should be ≥1); `grep href="/automate" src/components/home/ServicesPreview.tsx` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-15 | — | N/A | unit (text search) | `grep -E "Free\|500\|800\|Build Map" src/app/services/page.tsx \| wc -l` (should be 0) | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-16 | — | N/A | unit (link count) | `grep -E "href=\"/(automate\|assessment\|engage)\"" src/components/home/HeroSection.tsx \| wc -l` (should be exactly 1) | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-16 | — | N/A | unit (link count) | `grep "className={styles.cta}" src/components/Navigation.tsx \| wc -l` (should be exactly 1) | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-17 | — | N/A | integration | Render /enterprise, count "Case"/"Study" headings, verify lower on page | ✅ Phase 10 (verify position) | ⬜ pending |
| TBD | TBD | TBD | HOME-18 | — | N/A | unit (import + render) | `grep "import testimonials from" src/components/home/SocialProof.tsx`; render test verifies `.headshot` img elements exist | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-18 | — | N/A | unit (text search) | `grep "T\.N\.\|R\.O\.\|P\.J\." src/components/home/SocialProof.tsx \| wc -l` (should be 0) | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-19 | — | N/A | unit (text search) | `grep -i "enterprise" src/app/engage/page.tsx \| wc -l` (should be ≥1) | ✅ Phase 10 (verify copy) | ⬜ pending |
| TBD | TBD | TBD | HOME-20 | — | N/A | unit (link + text) | `grep -A2 -B2 "href=\"/services\"" src/components/Navigation.tsx \| grep -i "pricing"` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-21 | T-09-01 | metadataBase points to production domain, not preview | unit (text search) | `grep "metadataBase.*https://" src/app/layout.tsx`; verify URL is production | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | HOME-21 | — | N/A | unit (text pattern) | Extract tagline from Footer.tsx, extract eyebrow from HeroSection.tsx, verify substring match | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/components/home/HeroSection.test.tsx` — renders with income framing, single CTA, no /engage link
- [ ] `tests/components/home/PainSection.test.tsx` — no regulation names, /enterprise link present, creator pain points
- [ ] `tests/components/home/ServicesPreview.test.tsx` — Product #1 visible with $0-$800 price, /automate link
- [ ] `tests/components/home/SocialProof.test.tsx` — renders from testimonials.json, shows headshots, no T.N./R.O./P.J. hardcoded
- [ ] `tests/Navigation.test.tsx` — exactly one .cta link, /services link labeled "Pricing"
- [ ] `tests/grep-checks.test.ts` — hardcoded text absence checks (ABA Rule, SR 11-7, T.N., R.O.)
- [ ] Update `src/app/layout.tsx` test to verify metadataBase production domain

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cold reader reaches purchase in ≤2 clicks from homepage | HOME-16 | Requires human judgment of funnel UX, not just link count | Click through homepage → checkout in browser, count clicks |
| Positioning statement consistency across metadata/hero/footer | HOME-21 | Requires human read for tone/message match beyond substring check | Manually compare hero eyebrow, metadata description, footer tagline |

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | N/A (homepage is public) |
| V3 Session Management | no | N/A (homepage is public) |
| V4 Access Control | no | N/A (no user roles on homepage) |
| V5 Input Validation | no | N/A (homepage has no forms) |
| V6 Cryptography | no | N/A (no sensitive data handled) |
| V14 Configuration | yes | metadataBase points to production domain, not preview |

### Known Threat Patterns for This Phase

| Threat ID | Pattern | STRIDE | Standard Mitigation |
|-----------|---------|--------|---------------------|
| T-09-01 | OG meta tags point to preview domain | Spoofing (wrong origin in social preview) | Update metadataBase to production domain before merge |
| T-09-02 | Old links to /engage shared in social media still route to general form | Elevation of privilege (SMB user reaches enterprise form) | Add SMB → /automate redirect in /engage; verify Phase 10 assessment gate works |
| T-09-03 | Hardcoded testimonial quotes change at runtime (if testimonials.json is fetched, not imported) | Tampering | Ensure testimonials.json is imported at build time, not fetched dynamically |

---

*Validation strategy sourced from `09-RESEARCH.md` § Validation Architecture. Task/Plan/Wave IDs are TBD until the planner assigns concrete plan structure — the planner or `gsd-nyquist-auditor` should backfill these columns once PLAN.md files exist.*
