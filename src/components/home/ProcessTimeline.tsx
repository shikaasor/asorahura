import styles from "./ProcessTimeline.module.css";

const steps = [
  {
    number: "1",
    name: "Discovery Call",
    description: "We map your current operations and identify the highest-leverage automation opportunities.",
  },
  {
    number: "2",
    name: "AI Audit",
    description: "Deep diagnostic of your workflows, tools, and data — resulting in a prioritised roadmap.",
  },
  {
    number: "3",
    name: "Systems Build",
    description: "I design and build the automation infrastructure, integrated with your existing stack.",
  },
  {
    number: "4",
    name: "You Scale",
    description: "Your team runs on systems that don't need you in the loop for every decision.",
  },
];

export default function ProcessTimeline() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>How it works</h2>
        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.badge}>{step.number}</div>
              <div className={styles.content}>
                <h3 className={styles.stepName}>{step.name}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.connector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
