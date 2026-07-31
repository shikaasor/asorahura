# Phase 6: Palette Decision + Token Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-31
**Phase:** 06-palette-decision-token-foundation
**Areas discussed:** Palette directions to compare, Token scope & naming, Comparison board format, Playfair Display fate

---

## Palette Directions to Compare

| Question | Options | Selected |
|---|---|---|
| How many directions? | 3 directions (Recommended) / 2 directions | ✓ 3 directions |
| Accent color family? | Keep warm gold/amber, lightened / Fresh accent (blue/teal/green) / Present one of each | ✓ Keep warm gold/amber, lightened |
| Overall tone target? | Clean/minimal SaaS / Warm/editorial / Let each direction target a different tone | ✓ Warm/editorial |
| Base surface color? | Warm off-white/cream (Recommended) / Pure/near-white | ✓ Warm off-white/cream |

**Notes:** All 3 directions target warm/editorial tone with lightened-gold accent variation — not one direction per axis. This gives real comparison within the brief rather than a scattergun of unrelated styles.

---

## Token Scope & Naming

| Question | Options | Selected |
|---|---|---|
| Reuse existing names or new naming scheme? | Reuse existing names, new values (Recommended) / New naming scheme | ✓ New naming scheme |
| Keep legacy aliases? | Keep, repointed (Recommended) / Remove now | ✓ Remove them now |
| How to handle the resulting breakage across 36 live stylesheets? | Accept the gap, sequence Phase 8 immediately after / Keep legacy aliases as a bridge, remove in Phase 8 | ✓ Accept the gap |
| Naming convention? | Semantic scale (Recommended) / Role-based names | ✓ Semantic scale |

**Notes:** This is the highest-risk decision in the phase. The combination of new token names + removing legacy aliases means ~100 `var()` references across the other 35 stylesheets resolve to nothing until Phase 8 lands. Claude explicitly surfaced this against PROJECT.md's and STATE.md's documented context before the user confirmed — recorded as an accepted risk (D-07 in CONTEXT.md), not an oversight.

---

## Comparison Board Format

| Question | Options | Selected |
|---|---|---|
| Where does the board live? | Static route in the live app (Recommended) / Standalone throwaway HTML file | ✓ Static route in the live app |
| Who reviews and signs off? | Creative director reviews, replies in writing (Recommended) / You decide | ✓ You decide |
| (Follow-up) Confirm no external review, given PROJECT.md says creative director selects | Confirmed — auto-select, no external review / Build board, then pause for sign-off | ✓ Confirmed — auto-select, no external review |

**Notes:** PROJECT.md explicitly states "Creative director selects from proposed directions" and STATE.md flags the palette review as "a review cycle the team does not control" with a schedule-risk fallback. Claude surfaced this conflict directly before proceeding; user confirmed the auto-select path is intentional for this phase. Recorded as D-10 in CONTEXT.md.

---

## Playfair Display Fate

| Question | Options | Selected |
|---|---|---|
| Keep for display headings or drop entirely? | Drop it entirely (Recommended) / Keep, fix the override | ✓ Drop it entirely |
| Remove `.serif` class and h1-h4 override too? | Yes, remove both (Recommended) / Leave them, just stop loading the font | ✓ Yes, remove both |
| Heading weight/tracking after override removed? | Keep current sans weight/tracking (Recommended) / Loosen tracking for editorial warmth | ✓ Keep current sans weight/tracking |

**Notes:** Confirmed `.serif` class has zero usage outside its own definition in `globals.css` — safe to delete without call-site cleanup.

---

## Claude's Discretion

- Exact hex/HSL values for all 3 palette directions and their contrast-verified pairings
- Exact type scale ratio, spacing scale increments, radius/shadow/transition step values
- Contrast-check script implementation (language/tooling)
- Layout/content details of the `/internal/palette-review` board beyond the required components

## Deferred Ideas

None — discussion stayed within phase scope.
