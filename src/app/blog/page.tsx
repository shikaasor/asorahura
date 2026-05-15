import { getBlogPosts } from '@/lib/blog';
import BlogListingClient from './BlogListingClient';

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogListingClient posts={posts} />;
}
