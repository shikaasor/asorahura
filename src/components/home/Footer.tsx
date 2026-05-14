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
              Scale your business without scaling your payroll.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <nav className={styles.nav} aria-label="Footer navigation">
            <p className={styles.navLabel}>Navigation</p>
            <ul className={styles.navList}>
              <li><Link href="/" className={styles.navLink}>Home</Link></li>
              <li><Link href="/assessment" className={styles.navLink}>Assessment</Link></li>
              <li><Link href="/engage" className={styles.navLink}>Engage</Link></li>
              <li><Link href="/work" className={styles.navLink}>Work</Link></li>
            </ul>
          </nav>

          {/* Column 3: Legal + Social */}
          <div className={styles.legal}>
            <p className={styles.navLabel}>Legal</p>
            <ul className={styles.navList}>
              <li><Link href="/privacy" className={styles.navLink}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={styles.navLink}>Terms</Link></li>
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
