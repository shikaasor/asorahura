import styles from "./SocialProof.module.css";

const testimonials = [
  {
    quote:
      "Asor extracted and structured 7,826 pages of data from 260 years of Lloyd's List maritime records in a fraction of the time any team could manage manually. The system he built changed how we approach archival research.",
    name: "C.M.",
    role: "Operations Director, Lloyd's List",
  },
  {
    quote:
      "After reviewing over 2,000 resumes and repositioning my profile, I landed three senior offers in 6 weeks. The AI-driven approach cut my job search time by more than half.",
    name: "J.A.",
    role: "Senior Product Manager",
  },
  {
    quote:
      "We reclaimed over 40 hours per month in manual operations tasks within the first 90 days. Asor didn't just automate a process — he redesigned how our team works.",
    name: "R.O.",
    role: "COO, B2B SaaS",
  },
];

export default function SocialProof() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>What clients say</h2>
        <div className={styles.grid}>
          {testimonials.map((t) => (
            <blockquote key={t.name} className={styles.card}>
              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
              <footer className={styles.attribution}>
                <strong>{t.name}</strong>
                <span className={styles.role}>{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
