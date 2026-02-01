"use client";

import { motion } from "framer-motion";
import styles from "./LinkedInFeed.module.css";

// Placeholder data structure - easily updatable
const linkedInPosts = [
    {
        id: "1",
        title: "Good news for AI Engineers: You can run...",
        excerpt: "Check out the latest update on running local models...",
        date: "Recent",
        url: "https://www.linkedin.com/posts/aahura_goodnews-for-ai-engineers-you-can-run-activity-7416564506623029248-SX89",
    },
    {
        id: "2",
        title: "Your Accounting Team is Probably Doing This",
        excerpt: "Inefficiencies in financial workflows are costing you...",
        date: "Recent",
        url: "https://www.linkedin.com/posts/aahura_your-accounting-team-is-probably-doing-this-activity-7412513971213197312-OvEh",
    },
    {
        id: "3",
        title: "Most Founders Don't Know Their Business Is...",
        excerpt: "Operational blindness is the silent killer of scale...",
        date: "Recent",
        url: "https://www.linkedin.com/posts/aahura_most-founders-dont-know-their-business-is-activity-7409697338270752768-hNt0",
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
                href="https://www.linkedin.com/in/aahura"
                className={styles.viewAll}
                target="_blank"
                rel="noopener noreferrer"
            >
                View all on LinkedIn &rarr;
            </a>
        </div>
    );
}
