'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import CategoryFilter from '@/components/blog/CategoryFilter';
import EmailCaptureWidget from '@/components/blog/EmailCaptureWidget';
import type { BlogPost } from '@/lib/blog';
import styles from './page.module.css';

export default function BlogListingClient({ posts }: { posts: BlogPost[] }) {
  const categories = Array.from(new Set(posts.map(p => p.category)));
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? posts : posts.filter(p => p.category === active);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Insights</p>
          <h1 className={styles.headline}>Case Studies & AI Insights.</h1>
          <p className={styles.subhead}>
            Real projects. Real architectures. Real outcomes. Engineering decisions behind production AI systems.
          </p>
        </div>
      </section>

      <section className={styles.listing}>
        <div className="container">
          <CategoryFilter categories={categories} active={active} onChange={setActive} />
          <div style={{ marginBottom: '3rem' }}>
            <EmailCaptureWidget />
          </div>
          <div className={styles.grid}>
            {filtered.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src={
                      post.youtubeId
                        ? `https://img.youtube.com/vi/${post.youtubeId}/hqdefault.jpg`
                        : post.coverImage
                    }
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.categoryTag}>{post.category}</span>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <p className={styles.readingTime}>{post.readingTime} min read</p>
                </div>
              </Link>
            ))}
          </div>
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
