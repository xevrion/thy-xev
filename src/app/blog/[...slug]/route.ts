import { notFound } from 'next/navigation'
import { source } from '@/lib/source'

export async function generateStaticParams() {
  return source.generateParams().map(({ slug }) => ({
    slug: [...slug.slice(0, -1), `${slug[slug.length - 1]}.mdx`],
  }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const last = slug[slug.length - 1]
  if (!last?.endsWith('.mdx')) notFound()

  const pageSlug = [...slug.slice(0, -1), last.slice(0, -'.mdx'.length)]
  const page = source.getPage(pageSlug)
  if (!page) notFound()

  const raw = await page.data.getText('raw')

  return new Response(raw, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
