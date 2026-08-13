import { AssessmentShell } from "@/components/assessment/AssessmentShell";
import { DeepAssessmentShell } from "@/components/assessment/DeepAssessmentShell";
import styles from "./assessment.module.css";

export const maxDuration = 30;

export const metadata = {
  title: "AI Opportunity Discovery | Asor Ahura",
  description:
    "Pick your sector, answer 7 questions, and discover your highest-impact AI opportunities, free, takes 4 minutes.",
};

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ depth?: string }>;
}) {
  const { depth } = await searchParams;
  const isDeep = depth === "deep";

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          {isDeep ? (
            <>
              <h1 className={styles.heroTitle}>
                Full AI Opportunity Discovery Scorecard
              </h1>
              <p className={styles.heroSub}>
                24 questions across 6 dimensions. Map your AI opportunities with precision: process, data, compliance, team, strategy, and sector readiness.
              </p>
              <div className={styles.trustPills}>
                {["Free", "Takes 10 Minutes", "Section-Level Scores", "No Sales Call"].map((t) => (
                  <span key={t} className={styles.pill}>{t}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className={styles.heroTitle}>
                Find Out Exactly Where AI Can Save Your Business 10+ Hours a Week
              </h1>
              <p className={styles.heroSub}>
                Pick your sector, answer 7 questions. Get a personalised opportunity score and a
                report showing exactly where AI can save you the most time.
              </p>
              <div className={styles.trustPills}>
                {["Free", "Takes 4 Minutes", "Instant Results", "No Sales Call"].map((t) => (
                  <span key={t} className={styles.pill}>{t}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className={styles.shell}>
        {isDeep ? <DeepAssessmentShell /> : <AssessmentShell />}
      </section>
    </main>
  );
}
