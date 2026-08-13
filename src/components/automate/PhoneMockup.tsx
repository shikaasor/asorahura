import Image from "next/image";
import styles from "./PhoneMockup.module.css";

export default function PhoneMockup() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.mockupWrap}>
          <div className={styles.phoneFrame}>
            <div className={styles.screen}>
              <Image
                src="/images/automate/dm-screenshot.png"
                alt="Instagram DM showing lead capture in action on @ai_learnt's live account"
                fill
                className={styles.screenshotImg}
                sizes="(min-width: 768px) 480px, 90vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
