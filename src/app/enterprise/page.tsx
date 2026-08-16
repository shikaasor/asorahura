import Link from "next/link";
import MaskText from "@/components/motion/MaskText";
import Scatter from "@/components/motion/Scatter";
import styles from "./enterprise.module.css";

export const metadata = {
  title: "Enterprise AI Automation Solutions | Asor Ahura",
  description:
    "Custom scoping for regulated industries with compliance-aware implementation.",
};

const ENTERPRISE_VERTICALS = [
  {
    id: "law",
    name: "Law",
    regulation: "ABA Rule 1.6 Compliance",
    description:
      "AI-assisted legal workflows with privilege protection and malpractice safeguards.",
    ctaHref: "/engage?enterprise=true&sector=law",
  },
  {
    id: "finance",
    name: "Finance",
    regulation: "SR 11-7 / EU AI Act",
    description:
      "Model risk management, governance-first AI integration, regulatory-ready deployment.",
    ctaHref: "/engage?enterprise=true&sector=finance",
  },
  {
    id: "realestate",
    name: "Real Estate & Property",
    regulation: "Fair Housing / HUD 2024",
    description:
      "Bias-aware automation, tenant compliance, protected-class safeguards.",
    ctaHref: "/engage?enterprise=true&sector=realestate",
  },
  {
    id: "construction",
    name: "Construction",
    regulation: "Industry Standards (Procore/ACC)",
    description:
      "Project automation, compliance-aware reporting, crew coordination.",
    ctaHref: "/engage?enterprise=true&sector=construction",
  },
];

const CASE_STUDY_SUMMARIES = [
  {
    headline:
      "2,000+ resumes screened with consistent AI scoring, eliminating reviewer fatigue across 3 HR departments",
  },
  {
    headline:
      "16,454 chatbot conversations analyzed, surfacing knowledge gaps that explained 100% of escalation spikes for a Swiss insurance company",
  },
];

const SERVICE_TIER_SUMMARIES = [
  { name: "Starter Automation", price: "$1,000" },
  { name: "Operational Automation", price: "$2,000–$5,000" },
  { name: "Enterprise / Complex Build", price: "$5,000+" },
];

export default function EnterprisePage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <MaskText as="h1" text="Enterprise AI Automation Solutions" className={styles.heroTitle} />
          <p className={styles.heroTagline}>
            Custom scoping for regulated industries with compliance-aware implementation
          </p>
        </div>
      </section>

      {/* Verticals */}
      <section className={styles.verticalsSection}>
        <div className="container">
          <MaskText as="h2" text="Industry Expertise" className={styles.sectionHeading} />
          <Scatter className={styles.verticalsGrid}>
            {ENTERPRISE_VERTICALS.map((vertical) => (
              <div key={vertical.id} className={styles.card}>
                <h3 className={styles.cardTitle}>
                  {vertical.name} <span className={styles.regulation}>({vertical.regulation})</span>
                </h3>
                <p className={styles.cardDescription}>{vertical.description}</p>
                <Link href={vertical.ctaHref} className={styles.cardCta}>
                  Discuss Your Challenges →
                </Link>
              </div>
            ))}
          </Scatter>
        </div>
      </section>

      {/* Case Studies */}
      <section className={styles.caseStudiesSection}>
        <div className="container">
          <MaskText as="h2" text="What We’ve Built" className={styles.sectionHeading} />
          <Scatter className={styles.caseStudiesGrid}>
            {CASE_STUDY_SUMMARIES.map((cs) => (
              <div key={cs.headline} className={styles.card}>
                <p className={styles.caseHeadline}>{cs.headline}</p>
              </div>
            ))}
          </Scatter>
          <Link href="/work" className={styles.sectionCta}>
            See all case studies →
          </Link>
        </div>
      </section>

      {/* Service Tiers */}
      <section className={styles.tiersSection}>
        <div className="container">
          <MaskText as="h2" text="Our Enterprise Tiers" className={styles.sectionHeading} />
          <Scatter className={styles.tiersGrid}>
            {SERVICE_TIER_SUMMARIES.map((tier) => (
              <Link href="/services" key={tier.name} className={styles.tierCard}>
                <p className={styles.tierName}>{tier.name}</p>
                <p className={styles.tierPrice}>{tier.price}</p>
              </Link>
            ))}
          </Scatter>
        </div>
      </section>

      {/* Engagement CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <MaskText
            as="h2"
            text="Schedule a Compliance-Aware Discovery Call"
            className={styles.sectionHeading}
          />
          <p className={styles.ctaSubtext}>
            Tell us about your challenges. We&apos;ll map out a custom scoping and timeline.
          </p>
          <Link href="/engage?enterprise=true" className={styles.primaryCta}>
            Discuss Your Needs →
          </Link>
        </div>
      </section>
    </main>
  );
}
