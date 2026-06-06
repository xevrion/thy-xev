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
    <>
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pt-10 sm:pt-14 pb-6 flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
        <h1 className="text-[clamp(2rem,5vw+1rem,3.5rem)] sg-bold text-[var(--color-text)] leading-tight tracking-tight">
          Blogs
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-muted)] sg-regular">
          Writing about what I built, what broke, and occasionally both at once.
        </p>
      </div>
      <Suspense>
        <BlogsClient posts={posts} allTags={allTags} />
      </Suspense>
    </>
  )
}
