"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./Navigation.module.css";

export default function Navigation() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    return (
        <div className={styles.navWrapper}>
            <nav className={styles.nav}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/logomain.png"
                            alt="Asor Ahura Logo"
                            width={180}
                            height={50}
                            style={{ height: "40px", width: "auto" }}
                            priority
                        />
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={styles.links}
                >
                    <Link href="/services" className={pathname === "/services" ? styles.active : ""}>
                        Services
                    </Link>
                    <Link href="/work" className={pathname === "/work" ? styles.active : ""}>
                        Work
                    </Link>
                    <Link href="/assessment" className={pathname.startsWith("/assessment") ? styles.active : ""}>
                        Assessment
                    </Link>
                    <Link href="/blog" className={pathname.startsWith("/blog") ? styles.active : ""}>
                        Blog
                    </Link>
                    <Link href="/assessment" className={styles.cta}>
                        Get Your AI Audit
                    </Link>
                </motion.div>

                <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                >
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                </button>
            </nav>

            {menuOpen && (
                <div className={styles.mobileMenu}>
                    <Link href="/services" className={pathname === "/services" ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Services</Link>
                    <Link href="/work" className={pathname === "/work" ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Work</Link>
                    <Link href="/assessment" className={pathname.startsWith("/assessment") ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Assessment</Link>
                    <Link href="/blog" className={pathname.startsWith("/blog") ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Blog</Link>
                    <Link href="/assessment" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>Get Your AI Audit</Link>
                </div>
            )}
        </div>
    );
}
