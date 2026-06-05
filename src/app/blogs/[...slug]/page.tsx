import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { source } from '@/lib/source'
import { PostPage } from '@/components/PostPage'
import { getMDXComponents } from '@/mdx-components'

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) return {}

  const title = page.data.title
  const description = page.data.description ?? ''
  const url = `https://xevrion.dev/blogs/${slug.join('/')}`
  const publishedTime = page.data.date ? page.data.date.toISOString() : undefined

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime,
      authors: ['Xevrion'],
      tags: page.data.tags ?? [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: { canonical: url },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body
  const readingTime = (page.data as any)._exports?.readingTime

  return (
    <PostPage
      title={page.data.title}
      description={page.data.description}
      date={page.data.date?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
      tags={page.data.tags ?? []}
      readingTime={readingTime?.text}
    >
      <MDX components={getMDXComponents()} />
    </PostPage>
  )
}
