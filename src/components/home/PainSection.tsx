import { Clock, AlertCircle, Users } from "lucide-react";
import styles from "./PainSection.module.css";

const painCards = [
  {
    icon: <Clock size={24} />,
    title: "You're the bottleneck",
    body: "Every decision loops back to you. Approvals, reviews, sign-offs — nothing moves without your involvement, and the backlog never shrinks.",
  },
  {
    icon: <AlertCircle size={24} />,
    title: "Every task needs you",
    body: "Delegation keeps failing. The moment you step away, quality drops or work stops entirely. You've become the system instead of running one.",
  },
  {
    icon: <Users size={24} />,
    title: "You can't scale without hiring",
    body: "Growth means more headcount. More headcount means more management. You're not scaling a business — you're managing a growing dependency chain.",
  },
];

export default function PainSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Sound familiar?</h2>
        <div className={styles.grid}>
          {painCards.map((card) => (
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
