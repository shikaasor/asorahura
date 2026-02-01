"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./Navigation.module.css";

export default function Navigation() {
    const pathname = usePathname();

    if (pathname === "/flowmorph") return null;

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
                    <Link href="/work" className={pathname === "/work" ? styles.active : ""}>
                        Work
                    </Link>
                    <Link href="/flowmorph" className={pathname === "/flowmorph" ? styles.active : ""}>
                        Flowmorph
                    </Link>
                    <Link href="/engage" className={styles.cta}>
                        Work with Me
                    </Link>
                </motion.div>
            </nav>
        </div>
    );
}
