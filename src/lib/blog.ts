import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  youtubeId?: string;
  category: string;
  tags: string[];
  readingTime: number; // minutes, rounded up
}

export interface BlogPostWithContent extends BlogPost {
  content: string; // MDX body (no frontmatter)
}

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');
const VIDEOS_FILE = path.join(process.cwd(), 'content/videos.json');

interface VideoEntry {
  slug: string;
  title: string;
  excerpt: string;
  youtubeId: string;
  category: string;
  tags: string[];
}

async function getVideoPosts(): Promise<BlogPost[]> {
  try {
    const raw = await fs.readFile(VIDEOS_FILE, 'utf-8');
    const videos: VideoEntry[] = JSON.parse(raw);
    return videos.map((v) => ({
      slug: v.slug,
      title: v.title,
      excerpt: v.excerpt,
      coverImage: '',
      youtubeId: v.youtubeId,
      category: v.category ?? 'Video',
      tags: v.tags ?? [],
      readingTime: 0,
    }));
  } catch {
    return [];
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(CONTENT_DIR);
  const posts = await Promise.all(
    files
      .filter(f => f.endsWith('.mdx'))
      .map(async (file) => {
        const filePath = path.join(CONTENT_DIR, file);
        const raw = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(raw);
        const rt = readingTime(content);
        return {
          slug: file.replace('.mdx', ''),
          title: data.title ?? '',
          excerpt: data.excerpt ?? '',
          coverImage: data.coverImage ?? '',
          youtubeId: data.youtubeId,
          category: data.category ?? 'General',
          tags: data.tags ?? [],
          readingTime: Math.ceil(rt.minutes),
        } satisfies BlogPost;
      })
  );
  const videos = await getVideoPosts();
  return [...posts, ...videos];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
  // Check MDX posts first
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
      youtubeId: data.youtubeId,
      category: data.category ?? 'General',
      tags: data.tags ?? [],
      readingTime: Math.ceil(rt.minutes),
      content,
    };
  } catch {
    // Fall through to video lookup
  }

  // Check videos.json
  const videos = await getVideoPosts();
  const video = videos.find((v) => v.slug === slug);
  if (video) return { ...video, content: '' };

  return null;
}
