import Link from "next/link";
import styles from "./ServicesPreview.module.css";

const ladder = [
  {
    tier: 1,
    title: "Instagram Lead Automation",
    description: "Capture leads from Instagram comments, convert to DMs, nurture in email.",
    entry: "Free (DIY) or $500 (Done For You)",
    cta: "Get Started",
    href: "/automate/instagram",
  },
  {
    tier: 2,
    title: "The Next Four",
    description:
      "Email triage on Telegram, writing constitution + content, rate-aware invoice, client onboarding agent.",
    entry: "Coming soon.",
    cta: "Join Waitlist",
    href: "/automate",
  },
];

export default function ServicesPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>The Automation Ladder</h2>
        <p className={styles.subheading}>Start with one. Earn with it. Scale to five.</p>
        <div className={styles.grid}>
          {ladder.map((service) => (
            <div
              key={service.title}
              className={`${styles.card} ${service.tier === 1 ? styles.featured : styles.coming}`}
            >
              <div className={styles.tier}>Rung {service.tier}</div>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardBody}>{service.description}</p>
              </div>
              <div className={styles.cardBottom}>
                <span className={styles.price}>{service.entry}</span>
                <Link href={service.href} className={styles.learnMore}>
                  {service.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
