import Link from "next/link";
import styles from "./ServicesPreview.module.css";

const services = [
  {
    title: "AI Opportunity Discovery",
    description:
      "A structured exploration of your current operations. I identify where AI automation delivers the highest ROI and produce a prioritised implementation roadmap.",
    price: "$5,000",
    href: "/engage",
  },
  {
    title: "Ops Automation Build",
    description:
      "End-to-end build of the highest-impact automation identified in your discovery. Covers workflow design, integration, testing, and handover documentation.",
    price: "$5,000 – $15,000",
    href: "/engage",
  },
  {
    title: "Systems Architecture",
    description:
      "Comprehensive AI systems design for complex, multi-workflow operations. Ideal for organisations ready to transform their operational infrastructure at scale.",
    price: "$15,000 – $30,000+",
    href: "/engage",
  },
];

const sectorTracks = ["Law", "Finance", "Real Estate", "Construction", "Other / Cross-Industry"];

export default function ServicesPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>How I help</h2>
        <div className={styles.grid}>
          {services.map((service) => (
            <div key={service.title} className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardBody}>{service.description}</p>
              </div>
              <div className={styles.cardBottom}>
                <span className={styles.price}>{service.price}</span>
                <Link href={service.href} className={styles.learnMore}>
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.sectorStrip}>
          <span className={styles.sectorLabel}>Sector-aware assessment tracks</span>
          <div className={styles.sectorChips}>
            {sectorTracks.map((s) => (
              <span key={s} className={styles.sectorChip}>{s}</span>
            ))}
          </div>
          <Link href="/assessment" className={styles.sectorLink}>
            Take the free AI Opportunity Discovery →
          </Link>
        </div>
      </div>
    </section>
  );
}
