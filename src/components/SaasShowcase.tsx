"use client";

import { motion } from "framer-motion";
import styles from "./SaasShowcase.module.css";

// Easily updatable structure for external SaaS links/demos
const saasLinks = [
    {
        id: "1",
        name: "AI Resume Review",
        description: "Intelligent document analysis & feedback system",
        status: "Live Demo",
        url: "https://airesumereview-rewm52mul6i5jt9ynxc32c.streamlit.app/",
        icon: "📄",
    },
    {
        id: "2",
        name: "Automation System Demo",
        description: "Walkthrough of autonomous agent architecture",
        status: "Live Demo",
        url: "https://www.loom.com/share/ba14e20cd1544518b824439557f9d1db",
        icon: "🎥",
    },
];

export default function SaasShowcase() {
    return (
        <div className={styles.showcase}>
            <div className={styles.header}>
                <span className={styles.icon}>&#9881;</span>
                <span className={styles.label}>Live Systems</span>
            </div>
            <div className={styles.products}>
                {saasLinks.map((product, index) => (
                    <motion.a
                        key={product.id}
                        href={product.url}
                        className={styles.product}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className={styles.productIcon}>{product.icon}</div>
                        <div className={styles.productInfo}>
                            <div className={styles.productHeader}>
                                <h4 className={styles.productName}>{product.name}</h4>
                                <span
                                    className={`${styles.productStatus} ${
                                        product.status === "Live Demo"
                                            ? styles.statusLive
                                            : product.status === "Beta"
                                            ? styles.statusBeta
                                            : styles.statusSoon
                                    }`}
                                >
                                    {product.status}
                                </span>
                            </div>
                            <p className={styles.productDescription}>{product.description}</p>
                        </div>
                        <span className={styles.arrow}>&rarr;</span>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
