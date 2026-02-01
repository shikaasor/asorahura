"use client";

import { motion } from "framer-motion";
import styles from "./Testimonials.module.css";
import { Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        quote: "The automated system reduced our reporting time by 25%, allowing our field teams to focus on patient care rather than data entry.",
        author: "Program Director",
        role: "Global Health NGO",
        metric: "25% Efficiency Gain"
    },
    {
        id: 2,
        quote: "We saved over 7,200 support hours annually. The AI agents Asor built handle complex inquiries with incredible accuracy.",
        author: "Operations Lead",
        role: "Legal Tech Company",
        metric: "7,000+ Hours Saved"
    },
    {
        id: 3,
        quote: "Asor's architecture allowed us to scale our operations without linearly increasing headcount. The ROI was immediate.",
        author: "Founder",
        role: "SaaS Startup",
        metric: "Scalable Growth"
    }
];

export default function Testimonials() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>What Clients Say</h2>
                <div className={styles.grid}>
                    {testimonials.map((t, i) => (
                        <motion.div 
                            key={t.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.icon}>
                                <Quote size={24} />
                            </div>
                            <p className={styles.quote}>"{t.quote}"</p>
                            <div className={styles.footer}>
                                <div>
                                    <p className={styles.author}>{t.author}</p>
                                    <p className={styles.role}>{t.role}</p>
                                </div>
                                <div className={styles.metric}>{t.metric}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
