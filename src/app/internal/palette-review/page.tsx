import type { Metadata } from "next";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Palette Direction Review — Internal",
  description: "Comparing 3 light-first, warm/editorial directions on production components",
  robots: {
    index: false,
    follow: true,
  },
};

// WCAG 2.0 relative luminance + contrast ratio, mirroring
// scripts/verify-contrast.js's getRelativeLuminance/getContrastRatio so the
// numbers shown below always reflect the actual hex values, never
// hand-typed estimates (see REVIEW.md CR-02).
function toLinear(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Worst-case contrast of a foreground color against every surface it may be
// composited on within a direction, rather than a single hand-picked pairing.
function worstCaseRatio(fgHex: string, surfaces: readonly string[]): number {
  return Math.min(...surfaces.map((s) => contrastRatio(fgHex, s)));
}

type DirectionColors = {
  surfaces: readonly [string, string, string, string];
  ink1: string;
  ink2: string;
  ink3: string;
  accent: string;
  accentHover: string;
  accentActive: string;
};

// Mirrors the per-direction overrides in styles.module.css's .colA/.colB/.colC
// blocks. colB's ink3 matches globals.css's shipped --ink-3 (see WR-01).
const DIRECTION_COLORS: Record<"colA" | "colB" | "colC", DirectionColors> = {
  colA: {
    surfaces: ["#FAF7F2", "#F5F0EA", "#EFE8DE", "#FEFDFB"],
    ink1: "#2B2420",
    ink2: "#6B6359",
    ink3: "#A39E95",
    accent: "#B8860B",
    accentHover: "#A0760A",
    accentActive: "#8B6508",
  },
  colB: {
    surfaces: ["#FDFAF4", "#F9F4ED", "#F2EBDE", "#FFFEF9"],
    ink1: "#1F1B17",
    ink2: "#5D564E",
    ink3: "#8B827A",
    accent: "#C9A86D",
    accentHover: "#B5985B",
    accentActive: "#A1854A",
  },
  colC: {
    surfaces: ["#FFFAF3", "#FBEFF3", "#F4E8E0", "#FFFEF9"],
    ink1: "#1C1815",
    ink2: "#58524B",
    ink3: "#908580",
    accent: "#D4AF37",
    accentHover: "#BFA02D",
    accentActive: "#AA9122",
  },
};

// Success/Error/Warn aren't overridden per direction (see globals.css
// :root) — only the surfaces they're placed on vary by direction.
const SEMANTIC_COLORS = {
  success: "#3D6B1F",
  error: "#AA3918",
  warn: "#935A19",
};

type ContrastRow = {
  label: string;
  a: number;
  b: number;
  c: number;
  floor: number;
};

function buildContrastRow(
  label: string,
  floor: number,
  pick: (colors: DirectionColors) => string
): ContrastRow {
  return {
    label,
    floor,
    a: worstCaseRatio(pick(DIRECTION_COLORS.colA), DIRECTION_COLORS.colA.surfaces),
    b: worstCaseRatio(pick(DIRECTION_COLORS.colB), DIRECTION_COLORS.colB.surfaces),
    c: worstCaseRatio(pick(DIRECTION_COLORS.colC), DIRECTION_COLORS.colC.surfaces),
  };
}

function buildSemanticRow(label: string, hex: string): ContrastRow {
  return {
    label,
    floor: 4.5,
    a: worstCaseRatio(hex, DIRECTION_COLORS.colA.surfaces),
    b: worstCaseRatio(hex, DIRECTION_COLORS.colB.surfaces),
    c: worstCaseRatio(hex, DIRECTION_COLORS.colC.surfaces),
  };
}

// Accent tokens are CTA button fills, not standalone foreground text (see
// .ctaButton/.ctaButtonOutlined in styles.module.css). The pairing that
// actually renders on the page is ink-1 button text on an accent-colored
// fill, so that direct pairing is what gets measured here — not accent
// treated as text sitting on the page surface, which never happens.
function buildInkOnAccentRow(
  label: string,
  pick: (colors: DirectionColors) => string
): ContrastRow {
  return {
    label,
    floor: 4.5,
    a: contrastRatio(DIRECTION_COLORS.colA.ink1, pick(DIRECTION_COLORS.colA)),
    b: contrastRatio(DIRECTION_COLORS.colB.ink1, pick(DIRECTION_COLORS.colB)),
    c: contrastRatio(DIRECTION_COLORS.colC.ink1, pick(DIRECTION_COLORS.colC)),
  };
}

const contrastRows: ContrastRow[] = [
  buildContrastRow("Ink 1 (primary text)", 4.5, (c) => c.ink1),
  buildContrastRow("Ink 2 (secondary text)", 4.5, (c) => c.ink2),
  buildContrastRow("Ink 3 (tertiary text)", 3, (c) => c.ink3),
  buildInkOnAccentRow("CTA text on Accent fill", (c) => c.accent),
  buildInkOnAccentRow("CTA text on Accent Hover fill", (c) => c.accentHover),
  buildInkOnAccentRow("CTA text on Accent Active fill", (c) => c.accentActive),
  buildSemanticRow("Success", SEMANTIC_COLORS.success),
  buildSemanticRow("Error", SEMANTIC_COLORS.error),
  buildSemanticRow("Warn", SEMANTIC_COLORS.warn),
];

function ratioPasses(ratio: number, floor: number): boolean {
  return ratio >= floor;
}

function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

type Direction = {
  key: "colA" | "colB" | "colC";
  label: string;
  note: string;
};

const directions: Direction[] = [
  { key: "colA", label: "Direction A", note: "Deeper gold, traditional warmth" },
  { key: "colB", label: "Direction B (Selected)", note: "Lighter base, medium accent, best contrast" },
  { key: "colC", label: "Direction C", note: "Warmest base, brightest accent, maximum pop" },
];

export default function PaletteReviewPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Palette Direction Review</h1>
          <p className={styles.subtitle}>Comparing 3 light-first, warm/editorial directions</p>
          <p className={styles.instructions}>
            Compare contrast, warmth, and editorial feel. Direction B is auto-selected.
          </p>
        </header>

        <div className={styles.grid}>
          {directions.map((direction) => (
            <div key={direction.key} className={`${styles.column} ${styles[direction.key]}`}>
              <h2 className={styles.columnLabel}>{direction.label}</h2>

              <div className={styles.hero}>
                <h3 className={styles.heroHeadline}>Grow your income through small automations</h3>
                <p className={styles.heroSubheadline}>
                  Start with one automation that visibly makes money, then ascend.
                </p>
                <button type="button" className={styles.ctaButton}>
                  Get Started
                </button>
              </div>

              <div className={styles.pricingCard}>
                <h3 className={styles.pricingTitle}>Done For You</h3>
                <p className={styles.pricingPrice}>$500</p>
                <ul className={styles.pricingFeatures}>
                  <li>Provisioned server</li>
                  <li>Meta app + IG connection</li>
                  <li>Live in 3–5 days</li>
                </ul>
                <button type="button" className={styles.ctaButtonOutlined}>
                  Get Started
                </button>
              </div>

              <div className={styles.ctaStates}>
                <button type="button" className={styles.ctaButton}>
                  Get Started
                </button>
                <button type="button" className={styles.ctaButtonHover}>
                  Get Started (hover)
                </button>
                <button type="button" className={styles.ctaButtonActive}>
                  Get Started (active)
                </button>
              </div>
            </div>
          ))}
        </div>

        <section className={styles.contrastSummary}>
          <h2 className={styles.sectionTitle}>Contrast Summary</h2>
          <table className={styles.contrastTable}>
            <thead>
              <tr>
                <th>Token</th>
                <th>Direction A</th>
                <th>Direction B</th>
                <th>Direction C</th>
              </tr>
            </thead>
            <tbody>
              {contrastRows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>
                    {formatRatio(row.a)} {ratioPasses(row.a, row.floor) ? "PASS" : "FAIL"}
                  </td>
                  <td>
                    {formatRatio(row.b)} {ratioPasses(row.b, row.floor) ? "PASS" : "FAIL"}
                  </td>
                  <td>
                    {formatRatio(row.c)} {ratioPasses(row.c, row.floor) ? "PASS" : "FAIL"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.visualNotes}>
          <h2 className={styles.sectionTitle}>Visual Notes</h2>
          <ul>
            {directions.map((direction) => (
              <li key={direction.key}>
                <strong>{direction.label.replace(" (Selected)", "")}:</strong> {direction.note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
