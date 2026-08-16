import { TrendingUp, Clock, Zap, DollarSign } from "lucide-react";
import Link from "next/link";
import MaskText from "@/components/motion/MaskText";
import Scatter from "@/components/motion/Scatter";
import styles from "./PainSection.module.css";

const creatorPains = [
  {
    icon: <TrendingUp size={24} />,
    title: "Growing followers, not income",
    body: "You've mastered ad spend and follower growth. But leads come in DMs and you're manually capturing them. That's not a business, that's a job.",
  },
  {
    icon: <Clock size={24} />,
    title: "Your time is your bottleneck",
    body: "Lead capture, qualification, follow-up: you're doing it all manually. Every lead that comes in while you're asleep is a lead you never reach.",
  },
  {
    icon: <Zap size={24} />,
    title: "The systems exist, but they don't talk",
    body: "Instagram, email, CRM, Calendly: they work. But building the flow between them yourself takes time you don't have.",
  },
  {
    icon: <DollarSign size={24} />,
    title: "One automation = time + money back",
    body: "Instagram Comment-to-DM costs $6/mo owned, unlimited contacts. ManyChat starts at $14/mo and climbs with every contact you add.",
  },
];

export default function PainSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <MaskText as="h2" text="Sound familiar?" className={styles.heading} />
        <p className={styles.subheading}>
          Growing creators and coaches hit the same ceiling: manual lead capture while the rest
          of your business runs on autopilot.
        </p>
        <Scatter className={styles.grid}>
          {creatorPains.map((pain) => (
            <div key={pain.title} className={styles.card}>
              <div className={styles.icon}>{pain.icon}</div>
              <h3 className={styles.cardTitle}>{pain.title}</h3>
              <p className={styles.cardBody}>{pain.body}</p>
            </div>
          ))}
        </Scatter>
        {/* Rescued from the workflow section when it was cut from four
            states to two. It belongs here: the four cards above state
            problems and answer none of them, so without it the reader goes
            straight from the pain to the price. Kept as one compact strip
            rather than a second card grid — the point of that cut was
            removing bloat, not moving it. */}
        <div className={styles.answer}>
          <p className={styles.answerLead}>What that actually looks like</p>
          <ul className={styles.answerList}>
            <li>Connect the tools you already use</li>
            <li>Remove repetitive handoffs</li>
            <li>Automate predictable decisions</li>
            <li className={styles.answerKeep}>Keep judgment calls in your hands</li>
          </ul>
        </div>

        <p className={styles.cta}>
          <Link href="/enterprise">Working in a regulated industry? →</Link>
        </p>
      </div>
    </section>
  );
}
