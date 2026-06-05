import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { source } from '@/lib/source'
import { PostPage } from '@/components/PostPage'
import { getMDXComponents } from '@/mdx-components'
import { JsonLd } from '@/components/JsonLd'
import { getTableOfContents } from 'fumadocs-core/content/toc'

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

  const tags = page.data.tags ?? []
  const ogUrl = `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&path=${encodeURIComponent('blogs / ' + slug.join(' / '))}&tags=${tags.map(encodeURIComponent).join(',')}`

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
      tags,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl],
    },
    alternates: { canonical: url },
  }
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body
  const readingTime = (page.data as any)._exports?.readingTime

  // Extract TOC from raw markdown
  const rawMarkdown = await page.data.getText('raw')
  const toc = getTableOfContents(rawMarkdown)

  const date = page.data.date ? formatDate(page.data.date) : undefined
  // lastModified comes from the file stat via fumadocs-mdx
  const lastModified: Date | undefined = (page.data as any).lastModified
  const updatedAt = lastModified ? formatDate(lastModified) : undefined

  return (
    <>
      <JsonLd
        type="article"
        title={page.data.title}
        description={page.data.description ?? ''}
        canonicalUrl={`https://xevrion.dev/blogs/${slug.join('/')}`}
        publishedAt={page.data.date?.toISOString()}
        tags={page.data.tags ?? []}
      />
      <PostPage
        title={page.data.title}
        description={page.data.description}
        date={date}
        updatedAt={updatedAt}
        tags={page.data.tags ?? []}
        readingTime={readingTime?.text}
        toc={toc}
      >
        <MDX components={getMDXComponents()} />
      </PostPage>
    </>
  )
}
