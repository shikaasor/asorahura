import type { Metadata } from "next";
import styles from "./refund.module.css";

export const metadata: Metadata = {
  title: "Refund Policy | Asor Ahura",
  description: "Refund terms for Asor Ahura's Build Map, DFY, DWY, and Care Plan products.",
};

export default function RefundPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Refund Policy</h1>
          <p className={styles.meta}>Last updated: May 16, 2026</p>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h2>1. Done-For-You (DFY) and Done-With-You (DWY)</h2>
            <p>
              Both the DFY ($500 one-time) and DWY ($800 one-time) packages are covered by a 30-day
              money-back guarantee. If you&apos;re not satisfied within 30 days of purchase, contact us
              at{" "}
              <a href="mailto:hello@asorahura.com">hello@asorahura.com</a> and we&apos;ll issue a full
              refund.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Care Plan (Monthly Subscription)</h2>
            <p>
              The Care Plan ($9.99/mo) is billed monthly and can be cancelled at any time — you will
              not be charged for the following billing cycle. We do not provide partial refunds for
              time already used within a billing period.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Build Map</h2>
            <p>
              The Build Map is provided free of charge and is not a paid product, so no refund applies.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. How to Request a Refund</h2>
            <p>
              Email <a href="mailto:hello@asorahura.com">hello@asorahura.com</a> with your order
              details. Refunds are processed back to your original payment method through Paddle,
              our payment processor, typically within 5-10 business days.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Contact</h2>
            <p>
              Questions about this policy? Contact us at{" "}
              <a href="mailto:hello@asorahura.com">hello@asorahura.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
