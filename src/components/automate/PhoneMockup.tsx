import Image from "next/image";
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
          <div className={styles.phoneFrame}>
            <div className={styles.screen}>
              <Image
                src="/images/automate/dm-screenshot.png"
                alt="Instagram DM showing lead capture in action on @ai_learnt's live account"
                fill
                className={styles.screenshotImg}
                sizes="(min-width: 768px) 300px, 80vw"
              />
            </div>
          </div>
          <p className={styles.label}>Real screenshot. Live account. Working now.</p>
        </div>
      </div>
    </section>
  );
}
