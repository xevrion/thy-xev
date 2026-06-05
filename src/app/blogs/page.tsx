import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { BlogsClient } from '@/components/BlogsClient'

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Read my blog posts about web development, Linux, programming challenges, and tech insights.',
  openGraph: {
    type: 'website',
    url: 'https://xevrion.dev/blogs',
    title: 'Blogs | Xevrion',
    description: 'Read my blog posts about web development, Linux, programming challenges, and tech insights.',
  },
  alternates: { canonical: 'https://xevrion.dev/blogs' },
}

export default function BlogsPage() {
  const posts = getAllPosts()
  return <BlogsClient posts={posts} />
}
