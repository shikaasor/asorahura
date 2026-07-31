# Phase 6: Palette Decision + Token Foundation - Context

**Gathered:** 2026-07-31
**Status:** Ready for planning

<domain>
## Phase Boundary

A committed light-first design system exists as tokens, ready to build against. This phase covers: (1) building a comparison board of 3 light-first palette directions applied to identical hero/pricing-card/CTA components with pre-computed contrast ratios, (2) selecting one direction, (3) implementing it as a full token set in `globals.css` (color, type, spacing, radius/shadow/transition), (4) resolving the Playfair Display question, and (5) shipping a repeatable contrast-check script. This phase does NOT roll tokens out across the other 35 stylesheets — that's Phase 8.

</domain>

<decisions>
## Implementation Decisions

### Palette Directions
- **D-01:** Comparison board presents exactly 3 light-first directions (not 2) — matches DESIGN-01's upper bound, avoids decision fatigue.
- **D-02:** Accent stays warm gold/amber, lightened for a light surface — preserves brand recognition and existing gold-based assets rather than a full accent reset.
- **D-03:** Overall tone target is warm/editorial (not clean/minimal SaaS) — reads operator-to-operator per PROJECT.md tone, avoids generic-SaaS genericness.
- **D-04:** Base surface color is warm off-white/cream (roughly `#FAF7F2` range), not pure/near-white — pairs with the lightened gold accent and warm/editorial tone.

### Token Scope & Naming
- **D-05:** New tokens use a fresh semantic-scale naming convention, not the existing `--bg-*`/`--gold-*`/`--text-*` names:
  - `--surface-1` through `--surface-4` (surface scale)
  - `--ink-1` through `--ink-3` (text scale)
  - `--accent`, `--accent-hover`, `--accent-active` (accent + states)
  - `--success`, `--error`, `--warn` (semantic)
  - `--border-1`, `--border-2` (border scale)
- **D-06:** Legacy aliases (`--background`, `--foreground`, `--accent` [old gold alias], `--muted`, `--border`) are removed now, not kept as a compatibility bridge.
- **D-07 [ACCEPTED RISK]:** Removing the old `--bg-*`/`--gold-*`/`--text-*` variables and their legacy aliases means the ~100 existing `var()` references across the other 35 live stylesheets will resolve to nothing (broken/invalid colors) between Phase 6 shipping and Phase 8 landing. This was explicitly flagged against PROJECT.md/STATE.md context and confirmed intentional — Phase 8 must be sequenced immediately after Phase 7, and legacy pages are expected to render with broken colors in the interim. Do not add a compatibility shim to soften this; the gap is accepted, not a bug.
- **D-08:** Type scale (~7 steps), spacing scale (~6 steps), and radius/shadow/transition tokens (3 steps each, per DESIGN-04/05) follow the same semantic-scale naming pattern as the color tokens (e.g., numbered steps, not role-based names).

### Comparison Board Format
- **D-09:** The board is a real, non-indexed route inside the live Next.js app (e.g. `/internal/palette-review`), built with actual production components (hero, pricing card, CTA button) — not a standalone throwaway HTML file. No site nav on this route.
- **D-10 [OVERRIDES DOCUMENTED PROCESS — CONFIRMED]:** There is no external creative-director review step for this phase. PROJECT.md's constraints state "Creative director selects from proposed directions" and STATE.md flags the palette review as "a review cycle the team does not control." The user was shown this conflict explicitly and confirmed: Claude builds the 3-direction board and auto-selects the winning direction against the warm/editorial + lightened-gold brief, then implements it as tokens directly — no pause for external sign-off.

### Playfair Display
- **D-11:** Playfair Display is dropped entirely — not kept for display headings. It is currently loaded but functionally inert (h1-h4 are force-overridden to sans in `globals.css:69-76`), and the warm/editorial + approachable-operator tone doesn't need a luxury serif.
- **D-12:** As part of dropping Playfair: remove the Google Fonts/font loading for it, remove the `.serif` utility class (`globals.css:78-80` — confirmed unused anywhere in `src/`, safe to delete), and remove the now-redundant h1-h4 sans override.
- **D-13:** Heading weight/tracking (currently 700 weight, `-0.02em` letter-spacing) stays unchanged when the override is removed — no reason to touch it, and type-scale token values (DESIGN-04) are a separate concern from weight/tracking.

### Claude's Discretion
- Exact hex/HSL values for all 3 palette directions and their contrast-verified pairings.
- Exact type scale ratio, spacing scale increments, and radius/shadow/transition step values.
- Implementation of the contrast-check script (DESIGN-07) — language/tooling choice.
- Layout and content of the `/internal/palette-review` comparison board beyond "hero, pricing card, CTA button, 3 directions side by side, contrast ratios shown."

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & requirements
- `.planning/PROJECT.md` — ICP reposition context, constraints (contrast floor 4.5:1/3:1, light-first direction, creative-director note now superseded by D-10 for this phase only), Key Decisions table
- `.planning/REQUIREMENTS.md` §DESIGN-01 through DESIGN-07 — the 7 requirements this phase must satisfy, plus STYLE-06 (Phase 8 dependency on this phase's contrast script)
- `.planning/ROADMAP.md` "Phase 6: Palette Decision + Token Foundation" — success criteria and the note that Phase 7 may proceed on a provisional accent token if palette selection slips (no longer a live risk given D-10, but the roadmap note stands as written)
- `IMPLEMENTATION_PLAN.md` — source plan this milestone executes (§ references for the dark+gold/contrast failures being fixed)
- `WEBSITE_AUDIT.md` §B4 (contrast failure), §B6 (font sizes/Playfair issue), §H9 — diagnosis this phase directly remediates

### Code
- `src/app/globals.css` — current dark token block (`:root`, lines 1-38), legacy aliases (lines 26-31), h1-h4 sans override (lines 69-76), `.serif` class (lines 78-80) — all in scope for replacement/removal
- `src/app/layout.tsx` — Playfair Display font loading, to be removed

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None directly reusable for the new light palette — the entire `:root` token block in `globals.css` is dark-luxury-specific and is being replaced, not extended.

### Established Patterns
- CSS custom properties defined once in `:root` in `globals.css`, consumed via `var(--token-name)` across ~36 stylesheets. This phase changes only the `globals.css` definitions and the token names; it does not touch the other 35 stylesheets' `var()` call sites (Phase 8's job).
- `.serif` utility class confirmed unused anywhere in `src/` outside its own definition in `globals.css` — safe to delete with no call-site cleanup needed.

### Integration Points
- `/automate` (Phase 7) is the first consumer built directly against the new tokens — it has no legacy `var()` references to break, so D-07's accepted gap does not affect it.
- The 35 other existing stylesheets remain on old token names until Phase 8 — they will render with broken/missing colors between Phase 6 and Phase 8 per D-07.

</code_context>

<specifics>
## Specific Ideas

- Warm off-white/cream base (`#FAF7F2`-ish range), lightened gold accent, warm/editorial tone — these are directional targets for all 3 comparison-board directions, not just the winning one, so the creative comparison has real variation within the warm/editorial brief.
- Semantic-scale naming (`--surface-1..4`, `--ink-1..3`, `--accent`/`--accent-hover`/`--accent-active`, `--success`/`--error`/`--warn`, `--border-1..2`) applies to color tokens and should extend to type/spacing/radius/shadow/transition scales too (numbered steps, not role names).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. (D-07's accepted breakage gap is a scoping *decision*, not a deferred idea — it's explicitly resolved, with the fix living in Phase 8 as already planned.)

</deferred>

---

*Phase: 06-palette-decision-token-foundation*
*Context gathered: 2026-07-31*
