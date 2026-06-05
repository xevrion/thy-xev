import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSlugs, getPostBySlug, renderPostHTML } from '@/lib/posts'
import { PostPage } from '@/components/PostPage'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const description = post.description || post.summary
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

  const html = await renderPostHTML(post)

  return <PostPage post={post} html={html} />
}
