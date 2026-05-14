import { DeepAssessmentShell } from "@/components/assessment/DeepAssessmentShell";
import styles from "../assessment.module.css";

export const metadata = {
  title: "Full AI Readiness Scorecard | Asor Ahura",
  description:
    "20 questions across 5 dimensions. Get a granular view of your AI readiness with section-level scores and interpretation.",
};

export default function DeepAssessmentPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Full AI Readiness Scorecard
          </h1>
          <p className={styles.heroSub}>
            20 questions across 5 dimensions. Score your readiness with precision — process, data, compliance, team, and strategy.
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
