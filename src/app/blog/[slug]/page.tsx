import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import BlogCTABlock from '@/components/blog/BlogCTABlock';
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
          </header>

          {post.coverImage && (
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
          )}

          <article className={styles.body}>{content}</article>

          <BlogCTABlock
            type={post.category === 'Case Study' ? 'case-study' : 'educational'}
          />
        </div>
      </div>

      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Asor Ahura. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
