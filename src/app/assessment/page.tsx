import { AssessmentShell } from "@/components/assessment/AssessmentShell";
import styles from "./assessment.module.css";

export const metadata = {
  title: "AI Readiness Assessment | Asor Ahura",
  description:
    "Answer 8 questions and get a personalized AI readiness score — free, takes 4 minutes.",
};

export default function AssessmentPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Find Out Exactly Where AI Can Save Your Business 10+ Hours a Week
          </h1>
          <p className={styles.heroSub}>
            Answer 8 questions. Get a personalized AI readiness score and a
            report showing your highest-impact opportunities.
          </p>
          <div className={styles.trustPills}>
            {["Free", "Takes 4 Minutes", "Instant Results", "No Sales Call"].map((t) => (
              <span key={t} className={styles.pill}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.shell}>
        <AssessmentShell />
      </section>
    </main>
  );
}
