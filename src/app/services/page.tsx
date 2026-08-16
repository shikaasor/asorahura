import Link from "next/link";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import FlameHover from "@/components/ui/FlameHover";
import MaskText from "@/components/motion/MaskText";
import Scatter from "@/components/motion/Scatter";
import { getTierById } from "@/lib/checkout";
import styles from "./services.module.css";

const consultation = getTierById("consultation");

import testimonials from "@/content/testimonials.json";

const SERVICE_TESTIMONIALS = testimonials.services;

const serviceTiers = [
  {
    id: "starter",
    name: "Starter Automation",
    price: "$1,000",
    priceNote: "Fixed scope",
    tagline: "Your first automation win: one process, fully built.",
    bullets: [
      "Single workflow automated end-to-end",
      "Integration between 2-3 existing tools",
      "Documentation and handover included",
      "1 round of revisions post-delivery",
    ],
    timeline: "2–3 weeks",
    cta: { text: "Schedule a Call", href: "/engage?tier=starter" },
    enterprise: false,
  },
  {
    id: "ops",
    name: "Operational Automation",
    price: "$2,000–$5,000",
    priceNote: "Scoped per engagement",
    tagline: "Multiple connected workflows: your operations run without you.",
    bullets: [
      "3-5 interconnected workflows automated",
      "Full tool stack integration and data sync",
      "Custom reporting and visibility layer",
      "Team handover and async support (30 days)",
    ],
    timeline: "4–8 weeks",
    cta: { text: "Schedule a Call", href: "/engage?tier=ops" },
    enterprise: false,
  },
  {
    // Systems Integration was removed and its scope folded in here: with
    // Enterprise starting at $5,000 there is no room for a tier above
    // Operational and below it.
    id: "enterprise",
    name: "Enterprise / Complex Build",
    price: "$5,000+",
    priceNote: "Scoped individually",
    tagline: "End-to-end architecture and bespoke builds for complex operations.",
    bullets: [
      "Full operational architecture with AI decision layers",
      "Multi-team or multi-site scope",
      "Compliance-critical workflows (GDPR, HIPAA, offline-first)",
      "Long-term retainer and maintenance available",
    ],
    timeline: "Scoped after discovery call",
    cta: { text: "Schedule a Call", href: "/engage?tier=enterprise" },
    enterprise: true,
  },
];

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <MaskText as="h1" text="Here’s Exactly What I Build" className={styles.heroTitle} />
          <p className={styles.heroSub}>
            Scoped engagements with defined scope, fixed timelines, and full IP transfer on delivery. No retainers, no surprise invoices.
          </p>
          <div className={styles.heroActions}>
            <Link href="/checkout" className={styles.workWithMeBtn}>Book a Call — $200</Link>
            <Link href="/engage" className={styles.heroSecondary}>Or describe your project →</Link>
          </div>
        </div>
      </section>

      {/* The flagship. It sits above the build tiers because it is the step
          almost everyone should take first, and because the guarantee is the
          strongest thing on this page. Content comes from lib/checkout so the
          price and deliverables have one source of truth with the checkout. */}
      <section className={styles.flagshipSection}>
        <div className={styles.tiersInner}>
          <div className={styles.flagship}>
            <div className={styles.flagshipMain}>
              <span className={styles.flagshipBadge}>Start here</span>
              <h2 className={styles.flagshipTitle}>{consultation.name}</h2>
              <p className={styles.flagshipTagline}>{consultation.tagline}</p>
              <ul className={styles.flagshipList}>
                {consultation.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div className={styles.flagshipAside}>
              <span className={styles.flagshipPrice}>{consultation.price}</span>
              <span className={styles.flagshipPriceNote}>{consultation.priceDetail}</span>
              <Link href="/checkout" className={styles.flagshipCta}>
                Book a Call
              </Link>
              <p className={styles.flagshipGuarantee}>
                If I can&rsquo;t find you 10+ hours a week, you get a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tier Grid */}
      <section className={styles.tiersSection}>
        <div className={styles.tiersInner}>
          <Scatter className={styles.tiersGrid}>
            {serviceTiers.map((tier) => (
              <FlameHover key={tier.id} className={styles.tile} radius={18}>
                <div
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
              </FlameHover>
            ))}
          </Scatter>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsInner}>
          {SERVICE_TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

    </main>
  );
}
