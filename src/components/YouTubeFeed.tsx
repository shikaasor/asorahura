"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./YouTubeFeed.module.css";

function getYouTubeId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : "";
}

// Easily updatable — just add a YouTube URL and title
const youtubeVideos = [
    {
        id: "1",
        title: "AI Automation with n8n & DeepSeek R1",
        views: "Latest",
        url: "https://youtu.be/Uz-HJe-sK28",
    },
    {
        id: "2",
        title: "Local AI Integration Strategy",
        views: "Popular",
        url: "https://youtu.be/PVkXHyQDHsM",
    },
    {
        id: "3",
        title: "The Anti-Gravity of Operations",
        views: "Insight",
        url: "https://youtu.be/jZBm3YJp3C8",
    },
];

export default function YouTubeFeed() {
    return (
        <div className={styles.feed}>
            <div className={styles.header}>
                <span className={styles.icon}>&#9654;</span>
                <span className={styles.label}>Latest Videos</span>
            </div>
            <div className={styles.videos}>
                {youtubeVideos.map((video, index) => (
                    <motion.a
                        key={video.id}
                        href={video.url}
                        className={styles.video}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className={styles.thumbnail}>
                            <Image
                                src={`https://img.youtube.com/vi/${getYouTubeId(video.url)}/hqdefault.jpg`}
                                alt={video.title}
                                fill
                                style={{ objectFit: "cover" }}
                            />
                            <span className={styles.playIcon}>&#9654;</span>
                        </div>
                        <div className={styles.videoInfo}>
                            <h4 className={styles.videoTitle}>{video.title}</h4>
                            <span className={styles.videoMeta}>{video.views}</span>
                        </div>
                    </motion.a>
                ))}
            </div>
            <a
                href="https://www.youtube.com/channel/UCua5vXRbyWhuZnOAKQgFmhQ"
                className={styles.viewAll}
                target="_blank"
                rel="noopener noreferrer"
            >
                Subscribe on YouTube &rarr;
            </a>
        </div>
    );
}
