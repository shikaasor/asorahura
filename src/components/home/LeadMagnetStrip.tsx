import Link from "next/link";
import MaskText from "@/components/motion/MaskText";
import styles from "./LeadMagnetStrip.module.css";

export default function LeadMagnetStrip() {
  return (
    <section className={`${styles.section} blue-band`}>
      <div className={styles.container}>
        <MaskText as="h2" text="Find your 10 hours a week" className={styles.heading} />
        <p className={styles.subtext}>
          One $200 call. I find an automation that saves you at least 10 hours every week, or you
          get your money back.
        </p>
        <Link href="/checkout" className={styles.cta}>
          Book a Call — $200
        </Link>
        {/* The free assessment stays reachable as the lower-commitment path.
            Making the paid call primary should not delete the top of the
            funnel — this is the step most visitors take first. */}
        <Link href="/assessment" className={styles.secondary}>
          Not ready? Take the free 4-minute Discovery →
        </Link>
      </div>
    </section>
  );
}
