import { Scale, Landmark, Building2, HardHat } from "lucide-react";
import styles from "./PainSection.module.css";

const sectorCards = [
  {
    icon: <Scale size={24} />,
    title: "Law firms",
    body: "You can't paste matter content into public LLMs without an ABA Rule 1.6 risk — but your competitors are already using Harvey on contract review and pulling ahead. The gap is privilege architecture, not ambition.",
  },
  {
    icon: <Landmark size={24} />,
    title: "Finance & RIAs",
    body: "Your model risk management was built for deterministic models. Now GenAI lands inside SR 11-7 and EU AI Act Annex III, and 44% of RIAs running AI tools have no formal validation. Governance has to catch up.",
  },
  {
    icon: <Building2 size={24} />,
    title: "Real estate & property",
    body: "Tenant screening, ad audience targeting, AVMs — every AI use case touches a protected class. Without a bias-impact review and standardised data, every pilot is a future enforcement action.",
  },
  {
    icon: <HardHat size={24} />,
    title: "Construction",
    body: "Procore here, ACC there, paper RFIs in between. 45% of construction firms have zero AI deployed because the data doesn't exist in a form models can use. Platform standardisation comes first — then the takeoff and schedule-risk wins are real.",
  },
];

export default function PainSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Sound familiar?</h2>
        <p className={styles.subheading}>
          Different sectors, same pattern — exposure without architecture. Different sector? The
          general track captures the same dynamics for any operator.
        </p>
        <div className={styles.grid}>
          {sectorCards.map((card) => (
            <div key={card.title} className={styles.card}>
              <div className={styles.icon}>{card.icon}</div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardBody}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
