import Link from "next/link";
import styles from "./layout.module.css";

export default function AutomateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    Asor Ahura
                </Link>
            </header>
            <main>{children}</main>
            <footer className={styles.footer}>
                <p className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Asor Ahura. All rights reserved.
                </p>
                <nav className={styles.links} aria-label="Footer navigation">
                    <Link href="/privacy" className={styles.link}>
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className={styles.link}>
                        Terms of Service
                    </Link>
                    <Link href="/refund" className={styles.link}>
                        Refund Policy
                    </Link>
                </nav>
            </footer>
        </>
    );
}
