import Link from "next/link";
import { CALENDLY_URL, SUPPORT_EMAIL } from "@/lib/constants";
import styles from "./success.module.css";

export const metadata = {
  title: "Payment Successful | Asor Ahura",
};

// Calendly's embed defaults to a white widget, which is the one thing on this
// page that would still look borrowed. These params are read by the embed
// itself; hex values go in without the leading #.
const CALENDLY_EMBED = `${CALENDLY_URL}?background_color=0d0d0d&text_color=e9e7dd&primary_color=cdff06&hide_gdpr_banner=1`;

export default function CheckoutSuccessPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.mark} aria-hidden="true">
            ✓
          </span>
          <h1 className={styles.headline}>Payment confirmed.</h1>
          <p className={styles.subcopy}>
            Now book your discovery call so we can map out exactly how AI will work for your
            business.
          </p>
        </div>

        <div className={styles.steps}>
          <div className={`${styles.step} ${styles.stepDone}`}>
            <span className={styles.stepNum}>✓</span>
            Slot secured
          </div>
          <span className={styles.stepArrow}>→</span>
          <div className={`${styles.step} ${styles.stepActive}`}>
            <span className={styles.stepNum}>2</span>
            Book your call
          </div>
          <span className={styles.stepArrow}>→</span>
          <div className={styles.step}>
            <span className={styles.stepNum}>3</span>
            We build
          </div>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelLabel}>Pick a time</p>
          <iframe
            src={CALENDLY_EMBED}
            className={styles.calendly}
            title="Book your discovery call"
          />
        </div>

        {/* Paddle is named once, in small print, on purpose: it is the merchant
            of record, so the card statement reads PADDLE.NET and the receipt
            arrives from them. Saying so here is what stops an "unknown charge"
            dispute a week from now. */}
        <p className={styles.footNote}>
          Your receipt arrives by email from Paddle, who handle our payments and billing.
          Questions about the call or the charge?{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.footLink}>
            {SUPPORT_EMAIL}
          </a>
        </p>

        <Link href="/" className={styles.home}>
          Return to homepage
        </Link>
      </div>
    </main>
  );
}
