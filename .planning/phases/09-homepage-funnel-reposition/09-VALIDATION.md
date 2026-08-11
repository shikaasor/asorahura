---
phase: 09
slug: homepage-funnel-reposition
status: planned
nyquist_compliant: true
wave_0_complete: true
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

Note: all four plans run in Wave 1 with no cross-file dependencies (each plan owns a disjoint file set). Verification for each requirement is a directly-runnable `grep` command against the modified file — no Vitest test-file scaffolding was required to satisfy the Nyquist rule, since the grep commands below are themselves automated, immediately-runnable checks.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 09-01 T1 | 09-01 | 1 | HOME-12 | — | N/A | unit (text search) | `grep -c "hours" src/components/home/HeroSection.tsx` (expect 0) | ✅ file exists, edited by plan | ⬜ pending |
| 09-03 T1 | 09-03 | 1 | HOME-13 | — | N/A | unit (text search) | `grep -ci "aba\|sr 11-7\|ai act\|fair housing" src/components/home/PainSection.tsx` (expect 0) | ✅ | ⬜ pending |
| 09-03 T1 | 09-03 | 1 | HOME-13 | — | N/A | unit (link check) | `grep -c "href=\"/enterprise\"" src/components/home/PainSection.tsx` (expect ≥1) | ✅ | ⬜ pending |
| 09-03 T2 | 09-03 | 1 | HOME-14 | — | N/A | unit (text + link) | `grep -E "Free|\$500|\$800" src/components/home/ServicesPreview.tsx \| wc -l` (expect ≥1); `grep -c "href=\"/automate/instagram\"" src/components/home/ServicesPreview.tsx` (expect ≥1) | ✅ | ⬜ pending |
| 09-04 T3 | 09-04 | 1 | HOME-15 | — | N/A | unit (text search) | `grep -c "href=\"/assessment\"" src/app/services/page.tsx` (expect 0); `grep -c "\$5,000\|\$15,000\|\$30,000" src/components/home/ServicesPreview.tsx` (expect 0) | ✅ | ⬜ pending |
| 09-01 T1 | 09-01 | 1 | HOME-16 | — | N/A | unit (link count) | `grep -E "href=\"/(automate\|assessment\|engage)\"" src/components/home/HeroSection.tsx \| wc -l` (expect exactly 1) | ✅ | ⬜ pending |
| 09-01 T2 | 09-01 | 1 | HOME-16 | — | N/A | unit (link count) | `grep -c "className={styles.cta}" src/components/Navigation.tsx` (expect exactly 1) | ✅ | ⬜ pending |
| 09-04 T3 | 09-04 | 1 | HOME-17 | — | N/A | integration (manual read confirmation) | Confirm `<section className={styles.caseStudiesSection}>` in src/app/enterprise/page.tsx appears after `verticalsSection` and before `tiersSection` in source order | ✅ (Phase 10 built the page; no code change required) | ⬜ pending |
| 09-04 T1 | 09-04 | 1 | HOME-18 | T-09-03 | testimonials.json statically imported, not fetched | unit (import + render) | `grep -c "import testimonials from" src/components/home/SocialProof.tsx` (expect 1); render test verifies `.headshot` img elements exist | ✅ | ⬜ pending |
| 09-04 T1 | 09-04 | 1 | HOME-18 | — | N/A | unit (text search) | `grep -c "T\.N\.\|R\.O\.\|P\.J\." src/components/home/SocialProof.tsx` (expect 0) | ✅ | ⬜ pending |
| 09-04 T2 | 09-04 | 1 | HOME-19 | T-09-02 | /engage unconditionally shows enterprise copy regardless of query params | unit (text search) | `grep -ci "enterprise" src/app/engage/page.tsx` (expect ≥1); `grep -c "Discuss Your Enterprise Challenges" src/app/engage/page.tsx` (expect 1) | ✅ | ⬜ pending |
| 09-01 T2 | 09-01 | 1 | HOME-20 | — | N/A | unit (link + text) | `grep -A2 -B2 "href=\"/services\"" src/components/Navigation.tsx \| grep -ci "pricing"` (expect ≥2) | ✅ | ⬜ pending |
| 09-02 T1 | 09-02 | 1 | HOME-21 | T-09-01 | metadataBase points to production domain, not preview | unit (text search) | `grep -c "https://asorahura.com" src/app/layout.tsx` (expect ≥1); `grep -c "vercel.app" src/app/layout.tsx` (expect 0) | ✅ | ⬜ pending |
| 09-01 T1 / 09-02 T2 | 09-01, 09-02 | 1 | HOME-21 | — | N/A | unit (text pattern, cross-file) | `grep -c "Automations that work like your best hire" src/components/home/HeroSection.tsx`, same against `src/components/home/Footer.tsx` and `src/app/layout.tsx` — all ≥1 (byte-identical positioning statement) | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Wave 0 test-infra scaffolding was evaluated and found unnecessary: every requirement in this phase maps to a directly-runnable `grep`-based automated command against the file the plan already modifies (see Per-Task Verification Map above). No dedicated Vitest test files were created as prerequisites — the grep commands themselves satisfy the Nyquist automated-verification rule. Existing `npm run test -- --watch src/components/home` and `npm run test` continue to run as regression gates after each task/wave per the Sampling Rate above.

- [x] No new test scaffolding required — grep-based verification covers all HOME-12..21 requirements
- [x] Existing Vitest suite (`npm run test`) serves as the regression gate for all 4 plans

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

| Threat ID | Pattern | STRIDE | Standard Mitigation | Owning Plan |
|-----------|---------|--------|---------------------|-------------|
| T-09-01 | OG meta tags point to preview domain | Spoofing (wrong origin in social preview) | Update metadataBase to production domain before merge | 09-02 |
| T-09-02 | Old links to /engage shared in social media still route to general form | Elevation of privilege (SMB user reaches enterprise form) | Force unconditional enterprise copy on /engage; full referrer redirect deferred to Phase 10's assessment gate | 09-04 |
| T-09-03 | Hardcoded testimonial quotes change at runtime (if testimonials.json is fetched, not imported) | Tampering | Ensure testimonials.json is imported at build time, not fetched dynamically | 09-04 |

---

*Validation strategy sourced from `09-RESEARCH.md` § Validation Architecture. Task/Plan/Wave IDs backfilled by the planner after PLAN.md files were created — all 4 plans run in Wave 1 with disjoint file ownership.*
