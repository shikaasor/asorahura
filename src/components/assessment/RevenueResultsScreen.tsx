import Link from "next/link";
import {
  getTierName,
  getTierDescription,
  DEFAULT_SECTOR,
  type Sector,
} from "@/lib/assessment";
import {
  quickScoreToTierLevel,
  deepScoreToTierLevel,
} from "@/lib/sectorRecommendations";
import {
  DIMENSIONS,
  getDeepTier,
  getDimensionInterpretation,
  type Dimension,
} from "@/lib/deepAssessment";
import { getRevenueOpportunities } from "@/lib/revenueCalculation";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import styles from "./RevenueResultsScreen.module.css";

import testimonials from "@/content/testimonials.json";

const RESULTS_TESTIMONIAL = testimonials.assessmentResults;

interface Props {
  assessmentType: "quick" | "deep";
  score: number;
  byDimension?: Record<Dimension, number>;
  firstName: string;
  sector?: Sector;
}

export function RevenueResultsScreen({
  assessmentType,
  score,
  byDimension,
  firstName,
  sector = DEFAULT_SECTOR,
}: Props) {
  const tierLevel =
    assessmentType === "deep" ? deepScoreToTierLevel(score) : quickScoreToTierLevel(score);
  const revenue = getRevenueOpportunities(sector, tierLevel);

  const tierName = assessmentType === "deep" ? getDeepTier(score, sector).name : getTierName(score, sector);
  const description =
    assessmentType === "deep"
      ? getDeepTier(score, sector).description
      : getTierDescription(score, sector);

  return (
    <div className={styles.wrap}>
      <div className={styles.scoreBlock}>
        <span className={styles.scoreLabel}>Your Revenue Opportunities</span>
        <div className={styles.revenueAmount}>
          ~${revenue.totalLow}–${revenue.totalHigh}
          <span className={styles.revenuePeriod}>/mo</span>
        </div>
        <div className={styles.tier}>{tierName}</div>
      </div>

      <p className={styles.description}>{description}</p>

      <div className={styles.automations}>
        <p className={styles.automationsTitle}>Your Top 3 Automations</p>
        {revenue.opportunities.map((opp) => (
          <div key={opp.name} className={styles.automationRow}>
            <span className={styles.automationText}>
              {opp.name} → ~${opp.lowMonthly}–${opp.highMonthly}/mo ({opp.justification})
            </span>
          </div>
        ))}
      </div>

      {assessmentType === "deep" && byDimension && (
        <div>
          <p className={styles.sectionTitle}>Section Breakdown</p>
          <div className={styles.dimensions}>
            {(Object.entries(DIMENSIONS) as [Dimension, (typeof DIMENSIONS)[Dimension]][]).map(
              ([code, dim]) => {
                const dimScore = byDimension[code];
                const pct = Math.round((dimScore / dim.max) * 100);
                const interpretation = getDimensionInterpretation(code, dimScore, sector);
                return (
                  <div key={code} className={styles.dimCard}>
                    <div className={styles.dimCardHeader}>
                      <div className={styles.dimCardLeft}>
                        <span className={styles.dimCode}>{code}</span>
                        <span className={styles.dimName}>{dim.name}</span>
                      </div>
                      <span className={styles.dimScore}>
                        {dimScore}/{dim.max}
                      </span>
                    </div>
                    <div className={styles.dimBar}>
                      <div className={styles.dimFill} style={{ width: `${pct}%` }} />
                    </div>
                    <p className={styles.dimInterpret}>{interpretation}</p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.emailBanner}>
        <span className={styles.emailCheck}>✓</span>
        <div>
          {assessmentType === "deep" ? (
            <>
              <p className={styles.emailBannerTitle}>Full Scorecard Sent to {firstName}</p>
              <p className={styles.emailBannerSub}>
                Your section-by-section breakdown with recommendations has been sent to your inbox.
              </p>
            </>
          ) : (
            <>
              <p className={styles.emailBannerTitle}>Your Full Report Is On Its Way</p>
              <p className={styles.emailBannerSub}>
                Your personalized PDF with the full breakdown has been sent to {firstName}&apos;s inbox.
              </p>
            </>
          )}
        </div>
      </div>

      <div className={styles.cta}>
        {assessmentType === "deep" ? (
          <Link href="/checkout?assessment=deep" className={styles.ctaBtn}>
            View Your Roadmap →
          </Link>
        ) : (
          <Link href="/checkout" className={styles.ctaBtn}>
            See Your Purchase Options →
          </Link>
        )}
      </div>

      {assessmentType === "quick" && <TestimonialCard {...RESULTS_TESTIMONIAL} />}
    </div>
  );
}
