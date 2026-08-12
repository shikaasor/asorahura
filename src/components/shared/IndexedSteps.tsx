import styles from "./IndexedSteps.module.css";

export interface IndexedStep {
  number: string;
  title: string;
  description: string;
}

interface IndexedStepsProps {
  label: string;
  heading: string;
  steps: IndexedStep[];
  id?: string;
}

export default function IndexedSteps({ label, heading, steps, id }: IndexedStepsProps) {
  return (
    <section className={styles.section} id={id}>
      <div className={styles.container}>
        <div className={styles.head}>
          <span className={styles.label}>{label}</span>
          <h2 className={styles.heading}>{heading}</h2>
        </div>
        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <span className={styles.num}>{step.number}</span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.desc}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
