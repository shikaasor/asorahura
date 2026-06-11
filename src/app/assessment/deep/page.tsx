import { DeepAssessmentShell } from "@/components/assessment/DeepAssessmentShell";
import styles from "../assessment.module.css";

export const metadata = {
  title: "Full AI Opportunity Discovery Scorecard | Asor Ahura",
  description:
    "24 questions across 6 dimensions. Get a granular, sector-aware view of your AI opportunities with section-level scores and interpretation.",
};

export default function DeepAssessmentPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Full AI Opportunity Discovery Scorecard
          </h1>
          <p className={styles.heroSub}>
            24 questions across 6 dimensions. Map your AI opportunities with precision — process, data, compliance, team, strategy, and sector readiness.
          </p>
          <div className={styles.trustPills}>
            {["Free", "Takes 10 Minutes", "Section-Level Scores", "No Sales Call"].map((t) => (
              <span key={t} className={styles.pill}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.shell}>
        <DeepAssessmentShell />
      </section>
    </main>
  );
}
