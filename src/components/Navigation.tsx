"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import FlameCta from "@/components/ui/FlameCta";
import styles from "./Navigation.module.css";

export default function Navigation() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    // Best guess before the observer confirms: on the homepage we always
    // start scrolled to the top, i.e. over the hero.
    const [overHero, setOverHero] = useState(pathname === "/");

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (pathname !== "/") {
            setOverHero(false);
            return;
        }

        const hero = document.getElementById("home-hero");
        if (!hero) {
            setOverHero(false);
            return;
        }

        // Shrinks the viewport root by the nav's height from the top, so
        // "intersecting" stays true only while the hero still occupies the
        // strip the nav floats over — flips to solid the moment the hero
        // scrolls fully past it.
        const observer = new IntersectionObserver(
            ([entry]) => setOverHero(entry.isIntersecting),
            { rootMargin: "-88px 0px 0px 0px", threshold: 0 }
        );
        observer.observe(hero);
        return () => observer.disconnect();
    }, [pathname]);

    if (pathname.startsWith("/internal")) {
        return null;
    }

    const transparent = pathname === "/" && overHero;

    return (
        <div className={`${styles.navWrapper} ${transparent ? styles.navTransparent : ""}`}>
            <nav className={styles.nav}>
                <div>
                    <Link href="/" className={styles.logo}>
                        {/* White variant of Logo.png — the black original is
                            invisible on the dark canvas. It stays in place as
                            the favicon, where the browser's own chrome is
                            usually light. */}
                        <Image
                            src="/logo-white.png"
                            alt="Asor Ahura Logo"
                            width={180}
                            height={50}
                            style={{ height: "34px", width: "auto" }}
                            quality={100}
                            priority
                        />
                    </Link>
                </div>

                <div className={styles.links}>
                    <Link href="/services" className={pathname === "/services" ? styles.active : ""}>
                        Pricing
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
                    {/* The flagship offer, so it holds the one filled control
                        in the chrome. "See Automations" moved down to a plain
                        nav link — it is a catalogue, not the conversion. */}
                    <Link href="/automate" className={pathname.startsWith("/automate") ? styles.active : ""}>
                        Automations
                    </Link>
                    {/* Constantly lit, not hover-gated like the catalog tiles:
                        this is the one thing on the page we want looked at. */}
                    <FlameCta radius={19}>
                        <Link href="/checkout" className={styles.cta}>
                            Book a Call
                        </Link>
                    </FlameCta>
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
                    <Link href="/services" className={pathname === "/services" ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Pricing</Link>
                    <Link href="/work" className={pathname === "/work" ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Work</Link>
                    <Link href="/assessment" className={pathname.startsWith("/assessment") ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Discovery</Link>
                    <Link href="/blog" className={pathname.startsWith("/blog") ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Blog</Link>
                    <Link href="/enterprise" className={pathname.startsWith("/enterprise") ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Enterprise</Link>
                    <Link href="/automate" className={pathname.startsWith("/automate") ? styles.mobileActive : ""} onClick={() => setMenuOpen(false)}>Automations</Link>
                    <Link href="/checkout" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>Book a Call — $200</Link>
                </div>
            )}
        </div>
    );
}
