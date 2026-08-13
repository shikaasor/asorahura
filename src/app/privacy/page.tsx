import type { Metadata } from "next";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Asor Ahura",
  description: "How Asor Ahura collects, uses, and protects your information across our website, tools, and automation services.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.meta}>Last updated: August 12, 2026</p>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h2>1. Scope of This Policy</h2>
            <p>
              This Privacy Policy applies to asorahura.com and every service we operate under it,
              including our website, the AI Opportunity Discovery tool, our automation offerings
              (Instagram Comment-to-DM, Email Triage on Telegram, Writing Constitution + Content,
              Rate-Aware Invoice &amp; Quote, and Client Onboarding Agent), consulting engagements,
              and any related account, checkout, or support interactions. It is not limited to a
              single product or page.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <p>We collect information in three ways:</p>
            <ul>
              <li>
                <strong>Information you provide directly</strong>, such as your name, email
                address, business details, and payment information when you complete the
                discovery tool, a contact or waitlist form, checkout, or an engagement with us.
              </li>
              <li>
                <strong>Information collected automatically</strong>, such as page views, session
                duration, referral source, and general device/browser information, gathered
                through privacy-conscious analytics to understand how visitors use this site.
              </li>
              <li>
                <strong>Information processed on your behalf when you purchase an automation</strong>,
                which may include data from third-party accounts you connect during setup (for
                example, email content for Email Triage, Instagram comments and direct messages
                for Comment-to-DM, or Slack/Drive/Zoom activity for the Client Onboarding Agent).
                This category is described in detail in Section 6.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul>
              <li>Deliver discovery results, quotes, and follow-up recommendations</li>
              <li>Provision, configure, and operate the automation you purchase</li>
              <li>Respond to inquiries and manage client engagements</li>
              <li>Process payments and send order or billing confirmations</li>
              <li>Send relevant updates about services you have shown interest in (you may opt out at any time)</li>
              <li>Maintain the security, integrity, and performance of our site and services</li>
              <li>Improve site content, product copy, and user experience</li>
            </ul>
            <p>
              We do not sell or rent your personal data, and we do not share it with third
              parties for their own independent marketing purposes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Third-Party Services</h2>
            <p>
              We rely on a small set of trusted providers to operate this site and deliver our
              services. Depending on which product or tool you use, your information may pass
              through one or more of the following:
            </p>
            <ul>
              <li>
                <strong>Paddle</strong> as our payment processor for all checkout and billing.
                Asor Ahura does not store your full payment card details; Paddle handles that
                data under its own privacy policy and PCI-compliant systems.
              </li>
              <li><strong>Resend</strong> for transactional and account-related email delivery.</li>
              <li>
                <strong>Privacy-conscious website analytics</strong> that do not use advertising
                cookies or sell visitor data, used only to understand aggregate site usage.
              </li>
              <li>
                <strong>Google APIs (Gmail)</strong>, used only for customers who purchase Email
                Triage on Telegram. See Section 6 for our Limited Use disclosure.
              </li>
              <li>
                <strong>Meta/Instagram Graph API</strong>, used only for customers who purchase
                Instagram Comment-to-DM.
              </li>
              <li>
                <strong>Telegram Bot API</strong>, used to deliver alerts and briefs for Email
                Triage on Telegram.
              </li>
              <li>
                <strong>Slack, Google Drive, and Zoom APIs</strong>, used only for customers who
                purchase the Client Onboarding Agent.
              </li>
              <li>
                <strong>AI model providers</strong> (such as OpenAI, Google, and Anthropic), used
                to generate discovery results, drafts, and summaries within specific tools. We do
                not use your data to train third-party foundation models.
              </li>
            </ul>
            <p>
              Each provider operates under its own privacy policy and data processing terms. We
              select providers that meet reasonable data protection and security standards, and
              we limit what we send them to what is necessary to deliver the relevant feature.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Third-Party Platform Compliance</h2>
            <p>
              Several of our automations operate by connecting to a client&apos;s own third-party
              accounts (for example, a Gmail inbox, an Instagram business account, or a Slack
              workspace) using that provider&apos;s official API. In every case:
            </p>
            <ul>
              <li>Access is granted directly by you through the provider&apos;s own authorization flow, not shared credentials.</li>
              <li>We request only the scopes required to deliver the specific automation you purchased.</li>
              <li>You can revoke access at any time directly through the third-party provider&apos;s own account settings.</li>
              <li>Use of each API is subject to that provider&apos;s developer terms in addition to this policy.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Google API Services &mdash; Limited Use Disclosure</h2>
            <p>
              Email Triage on Telegram uses Gmail API access, granted by you, to read your inbox
              so it can route alerts and generate your daily brief. Asor Ahura&apos;s use and
              transfer of information received from Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. Specifically:
            </p>
            <ul>
              <li>Gmail data is used only to provide and improve the Email Triage feature you purchased, and for security and legal compliance.</li>
              <li>Gmail data is never used for advertising, and never sold to third parties.</li>
              <li>Gmail data is never used to train generalized AI or machine learning models not directly serving your inbox.</li>
              <li>Human access to your Gmail data is limited to what is necessary for support, security, or legal purposes, with your consent or as required by law.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Data Retention</h2>
            <p>
              We retain contact, discovery, and account data for as long as necessary to fulfill
              the purpose it was collected for, to provide the service you purchased, or as
              required by applicable law. Data processed to operate a live automation (such as
              email content read for triage) is retained only as long as needed to generate your
              alert or brief and is not kept as a standing archive beyond what the feature
              requires. You may request deletion of your data at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Data Security</h2>
            <p>
              We use reasonable administrative, technical, and physical safeguards designed to
              protect your information, including encrypted connections, access controls on
              systems that handle client data, and reputable, security-vetted infrastructure
              providers. No method of transmission or storage is completely secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Your Rights</h2>
            <p>Depending on where you live, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Request a copy of your data in a portable format</li>
              <li>Withdraw previously granted third-party API access at any time</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
            <p>
              To exercise any of these rights, email{" "}
              <a href="mailto:hello@asorahura.com">hello@asorahura.com</a>. We will respond within
              a reasonable timeframe and in accordance with applicable law.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Children&apos;s Privacy</h2>
            <p>
              Our site and services are intended for business use by adults. We do not knowingly
              collect personal information from children under 16. If you believe a child has
              provided us with personal information, contact us and we will delete it.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. International Data Transfers</h2>
            <p>
              We and our service providers may process and store information in countries other
              than your own. Where required, we rely on appropriate safeguards, such as standard
              contractual clauses, to protect data transferred across borders.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Cookies</h2>
            <p>
              This site uses minimal cookies necessary for analytics and session management. No
              advertising or third-party tracking cookies are set by default.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this policy as our services evolve. Material changes will be noted at
              the top of this page with a revised date. Continued use of the site after a change
              takes effect constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Contact</h2>
            <p>
              Questions about this policy or how your data is handled? Contact us at{" "}
              <a href="mailto:hello@asorahura.com">hello@asorahura.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
