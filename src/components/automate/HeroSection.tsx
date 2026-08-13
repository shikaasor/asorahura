import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.headline}>Instagram Lead Automation for Creators</h1>
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
