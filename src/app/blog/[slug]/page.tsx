import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import BlogCTABlock from '@/components/blog/BlogCTABlock';
import EmailCaptureWidget from '@/components/blog/EmailCaptureWidget';
import styles from './article.module.css';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({ source: post.content });

  // Lead-magnet panel for posts that ship a downloadable asset. Rendered
  // twice — once above the article so it is reachable without scrolling,
  // once at the end for readers who finished.
  const downloadPanel = post.downloadUrl ? (
    <div className={styles.downloadPanel}>
      <div>
        <p className={styles.downloadEyebrow}>{ '{ Free download }' }</p>
        <p className={styles.downloadTitle}>Take the whole thing with you.</p>
        <p className={styles.downloadNote}>
          Every step, template and rule in this article, as a single PDF. No email required.
          {post.author && <> Created by {post.author}.</>}
        </p>
      </div>
      <a
        href={post.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn"
      >
        <Download size={16} style={{ marginRight: '0.5rem' }} />
        {post.downloadLabel ?? 'Download the PDF'}
      </a>
    </div>
  ) : null;

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.layout}>
          <Link href="/blog" className={styles.backLink}>
            <ArrowLeft size={16} /> All Articles
          </Link>

          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.categoryTag}>{post.category}</span>
              <span className={styles.readingTime}>{post.readingTime} min read</span>
            </div>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.subtitle}>{post.excerpt}</p>
            {post.author && (
              <p className={styles.byline}>
                Created by <span className={styles.bylineName}>{post.author}</span>
              </p>
            )}
          </header>

          {post.youtubeId ? (
            <div className={styles.coverImageWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${post.youtubeId}`}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          ) : post.coverImage ? (
            <div className={styles.coverImageWrapper}>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="(max-width: 1200px) 100vw, 900px"
              />
            </div>
          ) : null}

          {downloadPanel}

          <article className={styles.body}>{content}</article>

          {downloadPanel}

          <BlogCTABlock
            type={post.category === 'Case Study' ? 'case-study' : 'educational'}
          />

          <div style={{ marginTop: '2rem' }}>
            <EmailCaptureWidget />
          </div>
        </div>
      </div>

    </main>
  );
}
