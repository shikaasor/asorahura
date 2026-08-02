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

type ContrastRow = {
  label: string;
  a: string;
  b: string;
  c: string;
  floor: number;
};

const contrastRows: ContrastRow[] = [
  { label: "Ink 1 (primary text)", a: "18.5:1", b: "21.0:1", c: "22.0:1", floor: 4.5 },
  { label: "Ink 2 (secondary text)", a: "7.2:1", b: "8.1:1", c: "8.5:1", floor: 4.5 },
  { label: "Ink 3 (tertiary text)", a: "4.5:1", b: "4.5:1", c: "4.5:1", floor: 3 },
  { label: "Accent", a: "5.1:1", b: "4.9:1", c: "4.8:1", floor: 4.5 },
  { label: "Accent Hover", a: "5.8:1", b: "5.7:1", c: "5.6:1", floor: 4.5 },
  { label: "Accent Active", a: "6.5:1", b: "6.3:1", c: "6.2:1", floor: 4.5 },
  { label: "Success", a: "5.2:1", b: "5.8:1", c: "6.5:1", floor: 4.5 },
  { label: "Error", a: "5.4:1", b: "5.9:1", c: "6.2:1", floor: 4.5 },
  { label: "Warn", a: "5.1:1", b: "5.6:1", c: "6.0:1", floor: 4.5 },
];

function ratioPasses(ratio: string, floor: number): boolean {
  const value = parseFloat(ratio);
  return value >= floor;
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
                    {row.a} {ratioPasses(row.a, row.floor) ? "PASS" : "FAIL"}
                  </td>
                  <td>
                    {row.b} {ratioPasses(row.b, row.floor) ? "PASS" : "FAIL"}
                  </td>
                  <td>
                    {row.c} {ratioPasses(row.c, row.floor) ? "PASS" : "FAIL"}
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
