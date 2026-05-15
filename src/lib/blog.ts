import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  readingTime: number; // minutes, rounded up
}

export interface BlogPostWithContent extends BlogPost {
  content: string; // MDX body (no frontmatter)
}

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

export async function getBlogPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(CONTENT_DIR);
  const posts = await Promise.all(
    files
      .filter(f => f.endsWith('.mdx'))
      .map(async (file) => {
        const filePath = path.join(CONTENT_DIR, file);
        const raw = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(raw);
        const rt = readingTime(content); // pass body only, not raw file
        return {
          slug: file.replace('.mdx', ''),
          title: data.title ?? '',
          excerpt: data.excerpt ?? '',
          coverImage: data.coverImage ?? '',
          category: data.category ?? 'General',
          tags: data.tags ?? [],
          readingTime: Math.ceil(rt.minutes),
        } satisfies BlogPost;
      })
  );
  return posts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const rt = readingTime(content);
    return {
      slug,
      title: data.title ?? '',
      excerpt: data.excerpt ?? '',
      coverImage: data.coverImage ?? '',
      category: data.category ?? 'General',
      tags: data.tags ?? [],
      readingTime: Math.ceil(rt.minutes),
      content,
    };
  } catch {
    return null;
  }
}
