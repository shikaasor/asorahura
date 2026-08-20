import type { Metadata } from "next";
import MaskText from "@/components/motion/MaskText";
import styles from "./terms.module.css";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service | Asor Ahura",
  description: "Terms governing use of the entire Asor Ahura website, tools, and automation services.",
};

export default function TermsPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <MaskText as="h1" text="Terms of Service" className={styles.title} />
          <p className={styles.meta}>Last updated: August 12, 2026</p>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              asorahura.com is operated by Asor Ahura, a sole trader (&quot;Asor Ahura,&quot;
              &quot;we,&quot; &quot;us&quot;). These Terms of Service govern your use of the site
              and every service offered on it, including the AI Opportunity Discovery tool, our
              catalog of automation offerings, consulting engagements, checkout, and support
              channels. By accessing or using this site, you agree to be bound by these terms. If
              you do not agree, do not use this site.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Services Described</h2>
            <p>
              Asor Ahura provides AI automation products and consulting services to small
              businesses, creators, and enterprises. Our catalog includes done-for-you (DFY) and
              done-with-you (DWY) automations, free self-host build maps, optional ongoing support
              retainers, and hourly discovery and strategy engagements. The scope, deliverables,
              timeline, and pricing for any specific offering are as described on that
              offering&apos;s page at the time of purchase, or in a separate written agreement for
              custom consulting work.
            </p>
            <p>
              Content on this site, including case studies, discovery results, and service
              descriptions, is informational and does not constitute a guarantee of specific
              business outcomes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Free Tools</h2>
            <p>
              The AI Opportunity Discovery tool and any free build maps are provided free of
              charge as informational and self-serve resources. Results and templates are
              generated algorithmically or provided as-is, and are not a substitute for
              professional advice. We reserve the right to modify or discontinue any free tool at
              any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Third-Party Account Access</h2>
            <p>
              Some automations require you to connect a third-party account you control, such as
              Gmail, Instagram, Slack, Google Drive, Zoom, or Telegram. By connecting an account,
              you confirm you have the right to grant that access, and you remain responsible for
              complying with that provider&apos;s own terms of service. You may revoke access at
              any time through the provider&apos;s account settings; doing so may stop the
              automation from functioning until access is restored.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Payments and Refunds</h2>
            <p>
              All payments are processed securely through Paddle, our merchant of record. Asor
              Ahura does not store your payment card information. Refund eligibility depends on
              the type of product or service purchased and is set out in full in our{" "}
              <a href="/refund">Refund Policy</a>.
            </p>
            <p>
              Custom consulting engagements booked outside our standard catalog are governed by
              the payment terms in the applicable written agreement.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use this site or our automations for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems or another user&apos;s account or data</li>
              <li>Use an automation to send unsolicited bulk messages or otherwise abuse a connected third-party platform</li>
              <li>Reverse-engineer, resell, or sublicense a delivered automation outside the terms of your purchase</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Intellectual Property</h2>
            <p>
              All site content, including copy, case studies, and design, is the property of Asor
              Ahura unless otherwise noted. You may not reproduce or redistribute it without prior
              written permission.
            </p>
            <p>
              Work product delivered to you under a paid engagement, such as a configured
              automation or a written report, becomes your property on delivery, except for any
              underlying reusable frameworks, templates, or tooling that remain Asor Ahura&apos;s
              intellectual property and are licensed to you for your own use.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Disclaimers</h2>
            <p>
              This site and our services are provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. We do not warrant that any automation will be uninterrupted,
              error-free, or compatible with every future change made by a third-party platform
              (such as Google, Meta, Slack, or Telegram) whose API our automations depend on.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Limitation of Liability</h2>
            <p>
              Asor Ahura is not liable for indirect, incidental, or consequential damages arising
              from use of this site or our services, including losses resulting from a
              third-party platform changing or restricting its API. Our total liability for any
              claim is limited to the amount you paid for the specific service giving rise to the
              claim.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Governing Law</h2>
            <p>
              These terms are governed by applicable law. Any disputes will be resolved through
              good-faith negotiation first, then binding arbitration if necessary.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Changes to These Terms</h2>
            <p>
              We may update these terms at any time. Material changes will be noted with a revised
              date at the top of this page. Continued use of the site after changes take effect
              constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
