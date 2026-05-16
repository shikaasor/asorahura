import type { Metadata } from "next";
import styles from "./terms.module.css";

export const metadata: Metadata = {
  title: "Terms of Service | Asor Ahura",
  description: "Terms governing use of Asor Ahura's website and services.",
};

export default function TermsPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.meta}>Last updated: May 16, 2026</p>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using this website, you agree to be bound by these Terms of Service.
              If you do not agree, do not use this site.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Services Described</h2>
            <p>
              Asor Ahura provides AI automation consulting and implementation services to businesses.
              The scope, deliverables, timeline, and pricing for any engagement are defined in a
              separate written agreement between Asor Ahura and the client.
            </p>
            <p>
              Content on this site (case studies, assessment results, service descriptions) is
              informational and does not constitute a guarantee of specific outcomes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Assessment Tool</h2>
            <p>
              The AI Readiness Assessment is provided free of charge as an informational tool.
              Results are generated algorithmically based on your inputs and are not a substitute
              for professional advice. We reserve the right to modify or discontinue the assessment
              at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Payments and Refunds</h2>
            <p>
              Paid services are governed by the terms in your client agreement. Digital products
              (e.g., reports, toolkits) are non-refundable once delivered unless a defect is
              demonstrated.
            </p>
            <p>
              All payments are processed securely through Paddle. Asor Ahura does not store payment
              card information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Intellectual Property</h2>
            <p>
              All site content — including copy, case studies, and design — is the property of Asor
              Ahura unless otherwise noted. You may not reproduce or redistribute it without prior
              written permission.
            </p>
            <p>
              Work product delivered to clients under a paid engagement becomes the client&apos;s
              property as specified in their agreement.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Limitation of Liability</h2>
            <p>
              Asor Ahura is not liable for indirect, incidental, or consequential damages arising
              from use of this site or services. Our total liability for any claim is limited to the
              amount paid for the specific service giving rise to the claim.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Governing Law</h2>
            <p>
              These terms are governed by applicable law. Any disputes will be resolved through
              good-faith negotiation first, then binding arbitration if necessary.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Changes to These Terms</h2>
            <p>
              We may update these terms at any time. Continued use of the site after changes
              constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href="mailto:hello@asorahura.com">hello@asorahura.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
