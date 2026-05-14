import Link from "next/link";
import styles from "./LeadMagnetStrip.module.css";

export default function LeadMagnetStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Not sure where to start?</h2>
        <p className={styles.subtext}>
          Take the 4-minute AI Readiness Assessment and get a personalised score.
        </p>
        <Link href="/assessment" className={styles.cta}>
          Start Free Assessment
        </Link>
      </div>
    </section>
  );
}
