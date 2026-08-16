import type { Metadata } from "next";
import MaskText from "@/components/motion/MaskText";
import styles from "./refund.module.css";

export const metadata: Metadata = {
  title: "Refund Policy | Asor Ahura",
  description: "Refund terms covering every product and service sold across the Asor Ahura website.",
};

export default function RefundPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <MaskText as="h1" text="Refund Policy" className={styles.title} />
          <p className={styles.meta}>Last updated: August 12, 2026</p>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h2>1. Scope</h2>
            <p>
              This policy covers every paid product and service sold on asorahura.com, present and
              future, grouped by type below. If a specific offering&apos;s page states different
              terms for a limited-time promotion, those terms apply in addition to, not instead
              of, this policy&apos;s protections.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Done-For-You (DFY) and Done-With-You (DWY) Automations</h2>
            <p>
              One-time DFY and DWY packages are covered by a 30-day money-back guarantee, starting
              from your date of purchase. If the automation has not been delivered as described,
              or you are otherwise not satisfied within that window, contact us at{" "}
              <a href="mailto:asorahura@gmail.com">asorahura@gmail.com</a> and we will issue a full
              refund. Once you are past the 30-day window, or once you have explicitly signed off
              on delivery, the purchase becomes non-refundable.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Tiered Products</h2>
            <p>
              Some automations are sold in multiple tiers (for example, a base tier and a Pro tier
              with additional capabilities). Each tier is covered independently by the 30-day
              money-back guarantee in Section 2, calculated from the purchase date of that specific
              tier. Upgrading from a lower tier to a higher one does not reset or extend the
              refund window on the original purchase.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Monthly Support Retainers and Subscriptions</h2>
            <p>
              Recurring monthly products, such as a Care Plan or an ongoing support retainer, are
              billed monthly and can be cancelled at any time. Cancelling stops future billing;
              you will not be charged for the next billing cycle, and your access continues
              through the end of the period already paid for. We do not provide partial refunds
              for time already used within a billing period.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Free Tools and Build Maps</h2>
            <p>
              Free resources, including self-host build maps and the AI Opportunity Discovery
              tool, are provided at no charge and are not paid products, so no refund applies.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Hourly Consulting Engagements</h2>
            <p>
              Discovery calls, strategy sessions, and other hourly-billed engagements secure a
              scheduled slot with our team. Payment is refundable in full if you cancel at least
              48 hours before your scheduled time. Cancellations within 48 hours, or unattended
              sessions, are non-refundable, though we will make reasonable efforts to reschedule
              once at no additional charge.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Custom Engagements</h2>
            <p>
              Work scoped outside our standard catalog, priced and agreed in a separate written
              agreement, is governed by the refund and cancellation terms in that agreement. Where
              the agreement is silent, the closest matching category above applies.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. How to Request a Refund</h2>
            <p>
              Email <a href="mailto:asorahura@gmail.com">asorahura@gmail.com</a> with your order
              details and the reason for your request. Approved refunds are processed back to your
              original payment method through Paddle, our payment processor, typically within
              5 to 10 business days.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Contact</h2>
            <p>
              Questions about this policy? Contact us at{" "}
              <a href="mailto:asorahura@gmail.com">asorahura@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
