import { TrendingUp, Clock, Zap, DollarSign } from "lucide-react";
import Link from "next/link";
import styles from "./PainSection.module.css";

const creatorPains = [
  {
    icon: <TrendingUp size={24} />,
    title: "Growing followers, not income",
    body: "You've mastered ad spend and follower growth. But leads come in DMs and you're manually capturing them. That's not a business — that's a job.",
  },
  {
    icon: <Clock size={24} />,
    title: "Your time is your bottleneck",
    body: "Lead capture, qualification, follow-up — you're doing it all manually. Every lead that comes in while you're asleep is a lead you never reach.",
  },
  {
    icon: <Zap size={24} />,
    title: "The systems exist, but they don't talk",
    body: "Instagram, email, CRM, Calendly — they work. But building the flow between them yourself takes time you don't have.",
  },
  {
    icon: <DollarSign size={24} />,
    title: "One automation = time + money back",
    body: "Instagram Comment-to-DM costs $6/mo owned, or $17–$99/mo with ManyChat. At $500, it pays for itself in 3 months.",
  },
];

export default function PainSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Sound familiar?</h2>
        <p className={styles.subheading}>
          Growing creators and coaches hit the same ceiling — manual lead capture while the rest
          of your business runs on autopilot.
        </p>
        <div className={styles.grid}>
          {creatorPains.map((pain) => (
            <div key={pain.title} className={styles.card}>
              <div className={styles.icon}>{pain.icon}</div>
              <h3 className={styles.cardTitle}>{pain.title}</h3>
              <p className={styles.cardBody}>{pain.body}</p>
            </div>
          ))}
        </div>
        <p className={styles.cta}>
          <Link href="/enterprise">Working in a regulated industry? →</Link>
        </p>
      </div>
    </section>
  );
}
