import Link from "next/link";
import { getTierDescription, getPreviewBullets } from "@/lib/assessment";
import styles from "./ResultsScreen.module.css";

interface Props {
  score: number;
  tier: string;
  firstName: string;
}

export function ResultsScreen({ score, tier, firstName }: Props) {
  const description = getTierDescription(score);
  const bullets = getPreviewBullets(score);

  return (
    <div className={styles.wrap}>
      <div className={styles.scoreBlock}>
        <span className={styles.scoreLabel}>Your AI Readiness Score</span>
        <div className={styles.scoreNumber}>
          {score}<span className={styles.scoreMax}>/100</span>
        </div>
        <div className={styles.tier}>{tier}</div>
      </div>

      <p className={styles.description}>{description}</p>

      <div className={styles.opportunities}>
        <p className={styles.oppTitle}>Your Top Opportunities</p>
        {bullets.map((bullet, i) => (
          <div key={i} className={styles.bullet}>
            <span className={styles.bulletDot} />
            <span className={styles.bulletText}>{bullet}</span>
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.emailBanner}>
        <span className={styles.emailCheck}>✓</span>
        <div>
          <p className={styles.emailBannerTitle}>Your Full Report Is On Its Way</p>
          <p className={styles.emailBannerSub}>
            Your personalized PDF with the full breakdown has been sent to {firstName}&apos;s inbox.
          </p>
        </div>
      </div>

      <div className={styles.cta}>
        <p className={styles.ctaHint}>Ready to act on your results?</p>
        <Link href={`/engage?score=${score}`} className={styles.ctaBtn}>
          Tell Me About Your Problem →
        </Link>
        <Link href="/checkout" className={styles.ctaSecondary}>
          Skip to checkout
        </Link>
      </div>
    </div>
  );
}
