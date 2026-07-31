---
phase: 06
slug: palette-decision-token-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-31
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — Wave 0 installs |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `grep -r "Playfair\|font-serif\|\.serif" src/` (manual, no framework) |
| **Full suite command** | `npm run verify:contrast` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run relevant manual grep checks (DESIGN-03 token naming, DESIGN-06 Playfair removal)
- **After every plan wave:** Run `npm run verify:contrast`
- **Before `/gsd-verify-work`:** Full suite must be green (contrast script exits 0)
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 0 | DESIGN-07 | V7 | Script reports token names/ratios only, no file paths/content leaked | unit | `tests/test-contrast-verification.test.js` | ❌ Wave 0 | ⬜ pending |
| 06-01-02 | 01 | 1 | DESIGN-01 | V13 | `/internal/palette-review` returns 200, has `robots: noindex`, no site nav | smoke/e2e | `tests/test-palette-review-route.test.ts` | ❌ Wave 0 | ⬜ pending |
| 06-01-03 | 01 | 1 | DESIGN-02 | — | Contrast ratios shown on board match script output | integration | `npm run verify:contrast` | ❌ Wave 0 (script) | ⬜ pending |
| 06-01-04 | 01 | 1 | DESIGN-03 | — | All tokens use semantic-scale naming (`--surface-*`, `--ink-*`, etc.) | manual-check | `grep -E "^  --(surface\|ink\|accent\|spacing\|fontSize)" src/app/globals.css` | ✅ Inline grep | ⬜ pending |
| 06-01-05 | 01 | 1 | DESIGN-04 | — | Type scale tokens exist (12/16/18/20/24/32/48px, 1.25× ratio) | manual-check | `tests/test-token-naming.test.ts` + grep on globals.css | ❌ Wave 0 | ⬜ pending |
| 06-01-06 | 01 | 1 | DESIGN-05 | — | Spacing (6 steps) + radius/shadow/transition (3 steps each) tokens defined | manual-check | Verify values in globals.css | ❌ Wave 0 | ⬜ pending |
| 06-01-07 | 01 | 1 | DESIGN-06 | — | Playfair Display fully removed — no references remain | smoke | `grep -r "Playfair\|font-serif\|\.serif" src/ && echo FAIL \|\| echo PASS` | ✅ Inline grep | ⬜ pending |
| 06-01-08 | 01 | 1 | DESIGN-07 | V7 | `npm run verify:contrast` exits 0 on valid tokens, exits 1 on deliberate failure | integration | `npm run verify:contrast` | ❌ Wave 0 (tests needed) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Task IDs above are placeholders — the planner assigns actual plan/task IDs; this map documents required coverage per requirement.*

---

## Wave 0 Requirements

- [ ] `tests/test-contrast-verification.test.js` — unit tests for luminance calculation, WCAG contrast ratio formula, edge cases (rgba, hsl, hex inputs)
- [ ] `tests/test-palette-review-route.test.ts` — smoke test for GET `/internal/palette-review` returns 200 + `robots: { index: false }` metadata
- [ ] `tests/test-token-naming.test.ts` — verify all tokens in globals.css follow semantic-scale naming convention (numbered steps, not role names)
- [ ] Test framework installation — no framework detected in package.json; planner selects (Jest or Vitest) and installs as part of Wave 0

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Warm/editorial visual tone matches brief (D-03) | DESIGN-01 | Subjective visual judgment, not machine-checkable | View `/internal/palette-review`, confirm Direction B reads warm/editorial per CONTEXT.md D-03/D-04 |
| Comparison board layout (hero/pricing/CTA side-by-side) | DESIGN-01 | Visual layout correctness beyond DOM structure | Load `/internal/palette-review` in browser, visually confirm 3-column layout with identical components per direction |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (contrast tests, route smoke test, token naming test)
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
