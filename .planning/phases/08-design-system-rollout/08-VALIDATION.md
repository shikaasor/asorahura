---
phase: 8
slug: design-system-rollout
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-09
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (already installed via `npm run test`) |
| **Config file** | `vitest.config.ts` / package.json config |
| **Quick run command** | `npm run verify:contrast` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (dead-code deletion / color conversion must not break the build)
- **After every plan wave:** Run `npm run verify:contrast` and `npm run test`
- **Before `/gsd-verify-work`:** Full suite must be green, plus `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css` returns only `globals.css` token definitions
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | STYLE-01 | — | N/A | build/smoke | `npm run build` | N/A | ⬜ pending |
| 08-02-01 | 02 | 2 | STYLE-02 | — | N/A | smoke | `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css"` | N/A | ⬜ pending |
| 08-02-02 | 02 | 2 | STYLE-03 | — | N/A | manual | Visual inspection + grep for `#0a0a0a`, `#04080F` | N/A | ⬜ pending |
| 08-03-01 | 03 | 3 | STYLE-04 | — | N/A | manual | Visit `/articles`, `/privacy`, `/terms`, `/checkout`, `/assessment` | N/A | ⬜ pending |
| 08-03-02 | 03 | 3 | STYLE-06 | — | N/A | automated | `npm run verify:contrast` | ✅ `scripts/verify-contrast.js` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements — `scripts/verify-contrast.js` and `tests/test-contrast-verification.test.js` already exist from Phase 6. No new test scaffolding needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Palette collisions resolved (two golds, `#0a0a0a` vs `#04080F`) | STYLE-03 | No automated check distinguishes "intentional token" from "leftover duplicate hex" | grep for the old hex values post-conversion; confirm zero non-token occurrences remain |
| Every route renders on one theme | STYLE-04 | Visual theme consistency isn't captured by the contrast script (which checks contrast ratios, not which theme is active) | Load `/articles`, `/privacy`, `/terms`, `/checkout`, `/assessment` in a browser; confirm no dark-on-light or light-on-dark flip vs. rest of site |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
