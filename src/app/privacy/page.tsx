import type { Metadata } from "next";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Asor Ahura",
  description: "How Asor Ahura collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.meta}>Last updated: May 16, 2026</p>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly — such as your name, email address, and
              business details when you submit the assessment, contact form, or engage our services.
            </p>
            <p>
              We also collect usage data automatically through analytics tools (page views, session
              duration, referral source) to understand how visitors use this site.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul>
              <li>Deliver assessment results and follow-up recommendations</li>
              <li>Respond to inquiries and manage client engagements</li>
              <li>Send relevant updates about services (you may opt out at any time)</li>
              <li>Improve site content and user experience</li>
            </ul>
            <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section className={styles.section}>
            <h2>3. Third-Party Services</h2>
            <p>
              This site uses third-party tools including email delivery (Resend), payments (Paddle),
              and analytics. Each provider operates under their own privacy policy and data processing
              terms. We only use providers that meet reasonable data protection standards.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Data Retention</h2>
            <p>
              We retain contact and assessment data for as long as necessary to fulfill the purpose
              it was collected for, or as required by applicable law. You may request deletion of
              your data at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
            <p>
              To exercise any of these rights, email{" "}
              <a href="mailto:hello@asorahura.com">hello@asorahura.com</a>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Cookies</h2>
            <p>
              This site uses minimal cookies necessary for analytics and session management. No
              advertising or tracking cookies are set by default.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this policy as our services evolve. Material changes will be noted at
              the top of this page with a revised date.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Contact</h2>
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
