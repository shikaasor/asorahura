import MaskText from "@/components/motion/MaskText";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <MaskText
          as="h1"
          text="Instagram Lead Automation for Creators"
          className={styles.headline}
        />
        <p className={styles.subheading}>
          Stop paying by the contact. Own your list. The bill stays flat at $6/mo.
        </p>

        <a href="#pricing" className={styles.primaryBtn}>
          Get Yours Now
        </a>
      </div>
    </section>
  );
}
