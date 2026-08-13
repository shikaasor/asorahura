import Link from "next/link";
import { Linkedin } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Logo / tagline */}
          <div className={styles.brand}>
            <p className={styles.logo}>Asor Ahura</p>
            <p className={styles.tagline}>
              Automations that work like your best hire: reliable, consistent, and yours to keep.
            </p>
          </div>

          {/* Column 2: Creator Path */}
          <nav className={styles.nav} aria-label="Footer navigation: Creator Path">
            <p className={styles.navLabel}>Creator Path</p>
            <ul className={styles.navList}>
              <li><Link href="/" className={styles.navLink}>Home</Link></li>
              <li><Link href="/automate" className={styles.navLink}>Automations</Link></li>
              <li><Link href="/blog" className={styles.navLink}>Learn</Link></li>
              <li><Link href="/assessment" className={styles.navLink}>Discovery</Link></li>
            </ul>
          </nav>

          {/* Column 3: Enterprise */}
          <nav className={styles.nav} aria-label="Footer navigation: Enterprise">
            <p className={styles.navLabel}>Enterprise</p>
            <ul className={styles.navList}>
              <li><Link href="/enterprise" className={styles.navLink}>Enterprise Solutions</Link></li>
              <li><Link href="/engage" className={styles.navLink}>Intake Form</Link></li>
              <li><Link href="/work" className={styles.navLink}>Case Studies</Link></li>
            </ul>
          </nav>

          {/* Column 4: Legal + Social */}
          <div className={styles.legal}>
            <p className={styles.navLabel}>Legal</p>
            <ul className={styles.navList}>
              <li><Link href="/privacy" className={styles.navLink}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={styles.navLink}>Terms</Link></li>
              <li><Link href="/refund" className={styles.navLink}>Refund Policy</Link></li>
            </ul>
            <div className={styles.social}>
              <a
                href="https://www.linkedin.com/in/aahura/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn profile"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; 2026 Asor Ahura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
