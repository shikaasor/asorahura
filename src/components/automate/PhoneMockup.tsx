import styles from "./PhoneMockup.module.css";

export default function PhoneMockup() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.copy}>
          <p className={styles.lead}>
            Real screenshot of @ai_learnt&apos;s live account. This works.
          </p>
        </div>
        <div className={styles.mockupWrap}>
          <div className={styles.phoneFrame} role="img" aria-label="Instagram DM showing lead capture in action">
            <div className={styles.screen}>
              <p className={styles.placeholderText}>Screenshot pending</p>
            </div>
          </div>
          <p className={styles.label}>Real screenshot. Live account. Working now.</p>
        </div>
      </div>
    </section>
  );
}
