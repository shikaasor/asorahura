"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

export default function Navigation() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    if (pathname.startsWith("/internal") || pathname.startsWith("/automate")) {
        return null;
    }

    return (
        <div className={styles.navWrapper}>
            <nav className={styles.nav}>
                <div>
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/logomain.png"
                            alt="Asor Ahura Logo"
                            width={180}
                            height={50}
                            style={{ height: "40px", width: "auto" }}
                            quality={100}
                            priority
                        />
                    </Link>
                </div>

                <div className={styles.links}>
                    <Link href="/services" className={pathname === "/services" ? styles.active : ""}>
                        Services
                    </Link>
                    <Link href="/work" className={pathname === "/work" ? styles.active : ""}>
                        Work
                    </Link>
                    <Link href="/assessment" className={pathname.startsWith("/assessment") ? styles.active : ""}>
                        Discovery
                    </Link>
                    <Link href="/blog" className={pathname.startsWith("/blog") ? styles.active : ""}>
                        Blog
                    </Link>
                    <Link href="/enterprise" className={pathname.startsWith("/enterprise") ? styles.active : ""}>
                        Enterprise
                    </Link>
                    <Link href="/assessment" className={styles.cta}>
                        Start AI Opportunity Discovery
                    </Link>
                </div>

                <button
                    type="button"
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
                    <Link href="/assessment" className={pathname.startsWith("/assessment") ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Discovery</Link>
                    <Link href="/blog" className={pathname.startsWith("/blog") ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Blog</Link>
                    <Link href="/enterprise" className={pathname.startsWith("/enterprise") ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Enterprise</Link>
                    <Link href="/assessment" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>Start AI Opportunity Discovery</Link>
                </div>
            )}
        </div>
    );
}
