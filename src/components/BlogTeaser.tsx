import { source } from '@/lib/source'
import Link from 'next/link'
import { SectionLabel } from './SectionLabel'

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function BlogTeaser() {
  const posts = source
    .getPages()
    .filter((p) => p.data.date)
    .sort((a, b) => new Date(b.data.date!).getTime() - new Date(a.data.date!).getTime())
    .slice(0, 4)

  if (posts.length === 0) return null

  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10">
      <SectionLabel>Writing</SectionLabel>

      <div className="flex flex-col">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group flex items-baseline justify-between gap-4 py-4 border-b border-battleship-gray/15 hover:bg-battleship-gray/5 -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10 transition-colors duration-150"
          >
            <span className="sg-regular text-[var(--color-text)] group-hover:text-soft-royal-blue transition-colors duration-150 truncate">
              {post.data.title}
            </span>
            <span className="shrink-0 font-mono text-xs text-[var(--color-text-muted)] tabular-nums">
              {formatDate(post.data.date!)}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/blogs"
        className="text-sm sg-regular text-[var(--color-text-muted)] hover:text-soft-royal-blue transition-colors duration-150 self-start"
      >
        All posts →
      </Link>
    </section>
  )
}
