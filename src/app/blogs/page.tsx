import type { Metadata } from 'next'
import { Suspense } from 'react'
import { source } from '@/lib/source'
import { BlogsClient, type BlogPost } from '@/components/BlogsClient'

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
  const pages = source.getPages().sort((a, b) => {
    const aTime = a.data.date ? new Date(a.data.date).getTime() : 0
    const bTime = b.data.date ? new Date(b.data.date).getTime() : 0
    return bTime - aTime
  })

  const posts: BlogPost[] = pages.map((page) => {
    const date = page.data.date
    const readingTime = (page.data as any)._exports?.readingTime

    return {
      slug: page.slugs[0] ?? '',
      url: page.url,
      title: page.data.title,
      description: page.data.description ?? '',
      date: date ? date.toISOString() : '',
      displayDate: date
        ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
        : '',
      tags: (page.data.tags as string[] | undefined) ?? [],
      readingTime: readingTime?.text,
    }
  })

  const allTags = Array.from(new Set(pages.flatMap((p) => (p.data.tags as string[] | undefined) ?? []))).sort()

  return (
    <Suspense>
      <BlogsClient posts={posts} allTags={allTags} />
    </Suspense>
  )
}
