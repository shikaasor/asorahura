import Link from "next/link";
import { DIMENSIONS, getDeepTier, getDimensionInterpretation, type Dimension } from "@/lib/deepAssessment";
import styles from "./DeepResultsScreen.module.css";

interface Props {
  total: number;
  byDimension: Record<Dimension, number>;
  firstName: string;
}

export function DeepResultsScreen({ total, byDimension, firstName }: Props) {
  const tier = getDeepTier(total);

  return (
    <div className={styles.wrap}>
      <div className={styles.scoreBlock}>
        <span className={styles.scoreLabel}>Your AI Readiness Score</span>
        <div className={styles.scoreNumber}>
          {total}<span className={styles.scoreMax}>/60</span>
        </div>
        <div className={styles.tier}>{tier.name}</div>
      </div>

      <p className={styles.description}>{tier.description}</p>

      <div>
        <p className={styles.sectionTitle}>Section Breakdown</p>
        <div className={styles.dimensions}>
          {(Object.entries(DIMENSIONS) as [Dimension, typeof DIMENSIONS[Dimension]][]).map(([code, dim]) => {
            const score = byDimension[code];
            const pct = Math.round((score / dim.max) * 100);
            const interpretation = getDimensionInterpretation(code, score);
            return (
              <div key={code} className={styles.dimCard}>
                <div className={styles.dimCardHeader}>
                  <div className={styles.dimCardLeft}>
                    <span className={styles.dimCode}>{code}</span>
                    <span className={styles.dimName}>{dim.name}</span>
                  </div>
                  <span className={styles.dimScore}>{score}/{dim.max}</span>
                </div>
                <div className={styles.dimBar}>
                  <div className={styles.dimFill} style={{ width: `${pct}%` }} />
                </div>
                <p className={styles.dimInterpret}>{interpretation}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.emailBanner}>
        <span className={styles.emailCheck}>✓</span>
        <div>
          <p className={styles.emailBannerTitle}>Full Scorecard Sent to {firstName}</p>
          <p className={styles.emailBannerSub}>
            Your section-by-section breakdown with recommendations has been sent to your inbox.
          </p>
        </div>
      </div>

      <div className={styles.cta}>
        <p className={styles.ctaHint}>{tier.action}</p>
        <Link href="/checkout" className={styles.ctaBtn}>
          Book a Discovery Call
        </Link>
      </div>
    </div>
  );
}
