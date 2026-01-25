"use client";

import { motion } from "framer-motion";
import styles from "./YouTubeFeed.module.css";

// Placeholder data structure - easily updatable
const youtubeVideos = [
    {
        id: "1",
        title: "Building AI Document Processing Pipelines",
        thumbnail: "/thumbnails/video-1.jpg",
        duration: "12:34",
        views: "2.4K views",
        url: "#",
    },
    {
        id: "2",
        title: "From Manual to Autonomous: A Transformation Story",
        thumbnail: "/thumbnails/video-2.jpg",
        duration: "18:22",
        views: "1.8K views",
        url: "#",
    },
    {
        id: "3",
        title: "Compliance Automation Deep Dive",
        thumbnail: "/thumbnails/video-3.jpg",
        duration: "24:15",
        views: "3.1K views",
        url: "#",
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
                            <div className={styles.thumbnailPlaceholder}>
                                <span className={styles.playIcon}>&#9654;</span>
                            </div>
                            <span className={styles.duration}>{video.duration}</span>
                        </div>
                        <div className={styles.videoInfo}>
                            <h4 className={styles.videoTitle}>{video.title}</h4>
                            <span className={styles.videoMeta}>{video.views}</span>
                        </div>
                    </motion.a>
                ))}
            </div>
            <a
                href="https://youtube.com/@asorahura"
                className={styles.viewAll}
                target="_blank"
                rel="noopener noreferrer"
            >
                Subscribe on YouTube &rarr;
            </a>
        </div>
    );
}
