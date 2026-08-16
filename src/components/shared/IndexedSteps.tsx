import MaskText from "@/components/motion/MaskText";
import Scatter from "@/components/motion/Scatter";
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
    <section className={`${styles.section} blue-band`} id={id}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.head}>
            <span className={styles.label}>{label}</span>
            <MaskText as="h2" text={heading} className={styles.heading} />
          </div>
          <Scatter className={styles.steps} tilt={0}>
            {steps.map((step) => (
              <div key={step.number} className={styles.step}>
                <span className={styles.num}>{step.number}</span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.desc}>{step.description}</p>
              </div>
            ))}
          </Scatter>
        </div>
      </div>
    </section>
  );
}
