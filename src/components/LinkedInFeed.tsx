"use client";

import { motion } from "framer-motion";
import styles from "./LinkedInFeed.module.css";

// Placeholder data structure - easily updatable
const linkedInPosts = [
    {
        id: "1",
        title: "The Future of AI Automation",
        excerpt: "Why intelligent document processing is replacing manual data entry...",
        date: "2 days ago",
        url: "#",
    },
    {
        id: "2",
        title: "Systems Thinking in Operations",
        excerpt: "The difference between adding tools and architecting systems...",
        date: "1 week ago",
        url: "#",
    },
    {
        id: "3",
        title: "Compliance-First Automation",
        excerpt: "How to build audit trails into your automation from day one...",
        date: "2 weeks ago",
        url: "#",
    },
];

export default function LinkedInFeed() {
    return (
        <div className={styles.feed}>
            <div className={styles.header}>
                <span className={styles.icon}>in</span>
                <span className={styles.label}>Recent Insights</span>
            </div>
            <div className={styles.posts}>
                {linkedInPosts.map((post, index) => (
                    <motion.a
                        key={post.id}
                        href={post.url}
                        className={styles.post}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h4 className={styles.postTitle}>{post.title}</h4>
                        <p className={styles.postExcerpt}>{post.excerpt}</p>
                        <span className={styles.postDate}>{post.date}</span>
                    </motion.a>
                ))}
            </div>
            <a
                href="https://linkedin.com/in/asorahura"
                className={styles.viewAll}
                target="_blank"
                rel="noopener noreferrer"
            >
                View all on LinkedIn &rarr;
            </a>
        </div>
    );
}
