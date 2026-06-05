import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSlugs, getPostBySlug } from '@/lib/posts'
import { PostPage } from '@/components/PostPage'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const description = post.summary || post.content.slice(0, 155).replace(/[#*`\n]/g, ' ').trim()
  const url = `https://xevrion.dev/blogs/${slug}`

  return {
    title: post.title,
    description,
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      publishedTime: post.date,
      authors: ['Xevrion'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
    alternates: { canonical: url },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return <PostPage post={post} />
}
