import Link from "next/link";
import Testimonials from "@/components/Testimonials";
import styles from "./services.module.css";

const serviceTiers = [
  {
    id: "starter",
    name: "Starter Automation",
    price: "$5,000",
    priceNote: "Fixed scope",
    tagline: "Your first automation win — one process, fully built.",
    bullets: [
      "Single workflow automated end-to-end",
      "Integration between 2-3 existing tools",
      "Documentation and handover included",
      "1 round of revisions post-delivery",
    ],
    timeline: "2–3 weeks",
    cta: { text: "Take the Assessment", href: "/assessment" },
    enterprise: false,
  },
  {
    id: "ops",
    name: "Operational Automation",
    price: "$5,000–$15,000",
    priceNote: "Scoped per engagement",
    tagline: "Multiple connected workflows — your operations run without you.",
    bullets: [
      "3-5 interconnected workflows automated",
      "Full tool stack integration and data sync",
      "Custom reporting and visibility layer",
      "Team handover and async support (30 days)",
    ],
    timeline: "4–8 weeks",
    cta: { text: "Take the Assessment", href: "/assessment" },
    enterprise: false,
  },
  {
    id: "systems",
    name: "Systems Integration",
    price: "$15,000–$30,000",
    priceNote: "Scoped per engagement",
    tagline: "End-to-end architecture — your whole operation connected and automated.",
    bullets: [
      "Full operational architecture design",
      "AI-powered decision layers and exception handling",
      "Multi-system data pipeline with audit trail",
      "Dedicated async support (60 days post-delivery)",
    ],
    timeline: "8–14 weeks",
    cta: { text: "Take the Assessment", href: "/assessment" },
    enterprise: false,
  },
  {
    id: "enterprise",
    name: "Enterprise / Complex Build",
    price: "$30,000+",
    priceNote: "Scoped individually",
    tagline: "Bespoke builds for complex operational environments.",
    bullets: [
      "Multi-team or multi-site scope",
      "Compliance-critical workflows (GDPR, HIPAA, offline-first)",
      "Custom AI model integration and fine-tuning",
      "Long-term retainer and maintenance available",
    ],
    timeline: "Scoped after discovery call",
    cta: { text: "Book Strategy Session", href: "/checkout?tier=strategy" },
    enterprise: true,
  },
];

export default function ServicesPage() {
  const year = new Date().getFullYear();

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Here&apos;s Exactly What I Build</h1>
          <p className={styles.heroSub}>
            Scoped engagements with defined scope, fixed timelines, and full IP transfer on delivery. No retainers, no surprise invoices.
          </p>
        </div>
      </section>

      {/* Tier Grid */}
      <section className={styles.tiersSection}>
        <div className={styles.tiersInner}>
          <div className={styles.tiersGrid}>
            {serviceTiers.map((tier) => (
              <div
                key={tier.id}
                className={`${styles.card} ${tier.enterprise ? styles.cardEnterprise : ""}`}
              >
                {tier.enterprise && (
                  <span className={styles.enterpriseBadge}>Most Complex</span>
                )}
                <div className={styles.cardHeader}>
                  <h2 className={styles.tierName}>{tier.name}</h2>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{tier.price}</span>
                    <span className={styles.priceNote}>{tier.priceNote}</span>
                  </div>
                  <p className={styles.tagline}>{tier.tagline}</p>
                </div>
                <ul className={styles.bullets}>
                  {tier.bullets.map((b) => (
                    <li key={b} className={styles.bullet}>
                      <span className={styles.bulletCheck}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className={styles.cardFooter}>
                  <p className={styles.timeline}>
                    <span className={styles.timelineLabel}>Delivery:</span> {tier.timeline}
                  </p>
                  <Link
                    href={tier.cta.href}
                    className={`${styles.cta} ${tier.enterprise ? styles.ctaEnterprise : styles.ctaDefault}`}
                  >
                    {tier.cta.text}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Assessment callout */}
          <div className={styles.assessmentCallout}>
            <p className={styles.calloutText}>
              Not sure which tier fits? Take the free AI Readiness Assessment — your score maps directly to the right engagement level.
            </p>
            <Link href="/assessment" className={styles.calloutLink}>
              Take the Assessment →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {year} Asor Ahura. Built for operators.</p>
      </footer>
    </main>
  );
}
