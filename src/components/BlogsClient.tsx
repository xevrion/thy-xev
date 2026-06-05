'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import Fuse from 'fuse.js'
import { Search, X } from 'lucide-react'
import SplitText from './reactbits/splittext'
import Socials from './Socials'
import type { Post } from '@/lib/posts'

function PostCard({ post, activeTag, onTagClick }: { post: Post; activeTag: string | null; onTagClick: (tag: string) => void }) {
  return (
    <div className="border-b border-battleship-gray pb-6">
      <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-2xl sm:text-3xl text-soft-royal-blue sg-bold mb-1 sm:mb-2 sm:flex-1 sm:min-w-0">
          <Link href={`/blogs/${post.slug}`} className="hover:underline sm:truncate block">
            {post.title}
          </Link>
        </h2>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-sm sg-regular text-battleship-gray/60">{post.readingTime}</span>
          <h3 className="text-lg sg-medium text-battleship-gray">{post.displayDate}</h3>
        </div>
      </div>
      <div className="text-battleship-gray text-lg sg-regular mb-3 [&_h2]:text-xl [&_h2]:text-soft-royal-blue [&_h2]:sg-bold [&_span.blue]:text-soft-royal-blue">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.summary}</ReactMarkdown>
      </div>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`px-2 py-0.5 rounded-full text-xs sg-medium border transition-colors duration-150 ${
                activeTag === tag
                  ? 'bg-soft-royal-blue/10 border-soft-royal-blue text-soft-royal-blue'
                  : 'border-battleship-gray/20 text-battleship-gray/70 hover:border-soft-royal-blue/50 hover:text-soft-royal-blue'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function BlogsClient({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts]
  )

  const results = useMemo(() => {
    const q = query.trim()
    let pool = posts
    if (activeTag) pool = pool.filter((p) => p.tags.includes(activeTag))
    if (!q) return pool

    const lower = q.toLowerCase()
    const substringMatches = pool.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.summary.toLowerCase().includes(lower) ||
        p.content.toLowerCase().includes(lower)
    )
    const fuzzyMatches = new Fuse(pool, {
      keys: [{ name: 'title', weight: 0.4 }, { name: 'summary', weight: 0.2 }, { name: 'content', weight: 0.4 }],
      threshold: 0.1,
      minMatchCharLength: 3,
      ignoreLocation: true,
    }).search(q).map((r) => r.item)

    const seen = new Set<string>()
    return [...substringMatches, ...fuzzyMatches].filter((p) => {
      if (seen.has(p.slug)) return false
      seen.add(p.slug)
      return true
    })
  }, [query, activeTag, posts])

  return (
    <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl mx-auto flex flex-col gap-12">
      <div className="text-center">
        <SplitText
          text="Blogs"
          className="text-5xl sm:text-6xl text-soft-royal-blue sg-bold mb-6"
          delay={20}
          duration={1}
          ease="elastic.out(1, 0.5)"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
      </div>

      <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-battleship-gray pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-9 py-2 rounded-lg border border-battleship-gray/40 bg-transparent text-soft-royal-blue placeholder-battleship-gray/60 sg-regular text-sm focus:outline-none focus:border-soft-royal-blue/60 transition-colors duration-200"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-battleship-gray hover:text-soft-royal-blue transition-colors duration-150"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none scroll-fade-x">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs sg-medium border transition-colors duration-150 ${
                activeTag === tag
                  ? 'bg-soft-royal-blue/10 border-soft-royal-blue text-soft-royal-blue'
                  : 'border-battleship-gray/30 text-battleship-gray hover:border-soft-royal-blue/50 hover:text-soft-royal-blue'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {results.length > 0 ? (
          results.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              activeTag={activeTag}
              onTagClick={(tag) => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))
        ) : (
          <p className="text-battleship-gray sg-regular text-center">
            No posts found{activeTag ? ` tagged "${activeTag}"` : ` for "${query}"`}
          </p>
        )}
      </div>

      <Socials />
    </section>
  )
}
