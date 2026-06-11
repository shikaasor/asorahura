import Link from "next/link";
import { getTierDescription, getPreviewBullets, DEFAULT_SECTOR, type Sector } from "@/lib/assessment";
import styles from "./ResultsScreen.module.css";
import { TestimonialCard } from "@/components/shared/TestimonialCard";

import testimonials from "@/content/testimonials.json";

const RESULTS_TESTIMONIAL = testimonials.assessmentResults;

interface Props {
  score: number;
  tier: string;
  firstName: string;
  sector?: Sector;
}

export function ResultsScreen({ score, tier, firstName, sector = DEFAULT_SECTOR }: Props) {
  const description = getTierDescription(score, sector);
  const bullets = getPreviewBullets(score, sector);

  return (
    <div className={styles.wrap}>
      <div className={styles.scoreBlock}>
        <span className={styles.scoreLabel}>Your AI Opportunity Score</span>
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
          Book a discovery call →
        </Link>
      </div>

      <TestimonialCard {...RESULTS_TESTIMONIAL} />
    </div>
  );
}
