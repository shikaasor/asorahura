import Link from "next/link";
import MaskText from "@/components/motion/MaskText";
import styles from "./SocialProof.module.css";
import testimonials from "@/content/testimonials.json";

const proofItems = [testimonials.services[0], testimonials.services[1], testimonials.hero];

export default function SocialProof() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <MaskText as="h2" text="What clients say" className={styles.heading} />
        <div className={styles.grid}>
          {proofItems.map((t) => (
            <blockquote key={t.name} className={styles.card}>
              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
              <footer className={styles.attribution}>
                {t.headshot && (
                  <img src={t.headshot} alt={t.name} className={styles.headshot} />
                )}
                <strong>{t.name}</strong>
                <span className={styles.role}>{t.title}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <p className={styles.enterpriseNote}>
          <Link href="/enterprise">Looking for enterprise case studies? →</Link>
        </p>
      </div>
    </section>
  );
}
