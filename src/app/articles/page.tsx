"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/articles";
import styles from "./articles.module.css";

export default function ArticlesPage() {
    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className={styles.eyebrow}>Featured Work</p>
                        <h1 className={styles.headline}>In-Depth Case Studies.</h1>
                        <p className={styles.subhead}>
                            Real projects. Real architectures. Real outcomes. Each article documents the engineering decisions behind a production AI system.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className={styles.grid}>
                <div className="container">
                    {articles.map((article, i) => (
                        <motion.div
                            key={article.slug}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                        >
                            <div className={styles.cardNumber}>
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.cardMeta}>
                                    <span className={styles.metrics}>{article.metrics}</span>
                                </div>
                                <h2 className={styles.cardTitle}>{article.title}</h2>
                                <p className={styles.cardDesc}>{article.description}</p>
                                <div className={styles.cardTags}>
                                    {article.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.cardAction}>
                                <Link href={`/articles/${article.slug}`} className={styles.readLink}>
                                    Read Article <ArrowRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer className={styles.footer}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Asor Ahura. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
