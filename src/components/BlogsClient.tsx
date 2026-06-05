'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { Search, X, Tag, ChevronDown } from 'lucide-react'
import SplitText from './reactbits/splittext'
import Socials from './Socials'

export interface BlogPost {
  slug: string
  url: string
  title: string
  description: string
  date: string
  displayDate: string
  tags: string[]
  readingTime?: string
}

// --- Tag dropdown (no external dep) ---
function TagDropdown({
  allTags,
  activeTags,
  onChange,
}: {
  allTags: string[]
  activeTags: string[]
  onChange: (tags: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  function toggle(tag: string) {
    onChange(
      activeTags.includes(tag) ? activeTags.filter((t) => t !== tag) : [...activeTags, tag],
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm sg-regular transition-colors duration-150 ${
          activeTags.length > 0
            ? 'border-soft-royal-blue text-soft-royal-blue bg-soft-royal-blue/5'
            : 'border-battleship-gray/40 text-battleship-gray hover:border-soft-royal-blue/50 hover:text-soft-royal-blue'
        }`}
      >
        <Tag size={14} />
        <span>Tags</span>
        {activeTags.length > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-soft-royal-blue text-white text-[10px] sg-medium">
            {activeTags.length}
          </span>
        )}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg border border-battleship-gray/20 bg-[var(--color-taupe)] shadow-lg py-1.5">
          {activeTags.length > 0 && (
            <>
              <button
                onClick={() => onChange([])}
                className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs sg-medium text-battleship-gray/60 hover:text-soft-royal-blue transition-colors duration-150"
              >
                <X size={11} />
                Clear all
              </button>
              <div className="my-1 border-t border-battleship-gray/15" />
            </>
          )}
          {allTags.map((tag) => {
            const checked = activeTags.includes(tag)
            return (
              <label
                key={tag}
                className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-battleship-gray/8 transition-colors duration-100"
              >
                <span
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors duration-150 ${
                    checked
                      ? 'border-soft-royal-blue bg-soft-royal-blue'
                      : 'border-battleship-gray/40'
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 10 8" className="w-2 h-2 fill-white">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span
                  className={`text-sm sg-regular ${
                    checked ? 'text-soft-royal-blue' : 'text-battleship-gray'
                  }`}
                >
                  {tag}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

// --- Post card ---
function PostCard({ post }: { post: BlogPost }) {
  return (
    <div className="border-b border-battleship-gray/20 pb-6">
      <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
        <h2 className="text-2xl sm:text-3xl text-soft-royal-blue sg-bold sm:flex-1 sm:min-w-0">
          <Link href={post.url} className="hover:underline sm:truncate block">
            {post.title}
          </Link>
        </h2>
        <div className="flex items-center gap-3 whitespace-nowrap text-sm sg-regular text-battleship-gray/60 sm:pt-1 shrink-0">
          {post.readingTime && <span>{post.readingTime}</span>}
          {post.readingTime && post.displayDate && (
            <span className="text-battleship-gray/30">·</span>
          )}
          {post.displayDate && <span>{post.displayDate}</span>}
        </div>
      </div>
      {post.description && (
        <p className="text-battleship-gray text-base sg-regular mb-3">{post.description}</p>
      )}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs sg-medium border border-battleship-gray/20 text-battleship-gray/70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// --- Main BlogsClient ---
export function BlogsClient({ posts, allTags }: { posts: BlogPost[]; allTags: string[] }) {
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])

  const results = useMemo(() => {
    let pool = posts
    if (activeTags.length > 0) {
      pool = pool.filter((p) => activeTags.every((t) => p.tags.includes(t)))
    }

    const q = query.trim()
    if (!q) return pool

    const lower = q.toLowerCase()
    const substringMatches = pool.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower),
    )
    const fuzzyMatches = new Fuse(pool, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'description', weight: 0.4 },
      ],
      threshold: 0.1,
      minMatchCharLength: 3,
      ignoreLocation: true,
    })
      .search(q)
      .map((r) => r.item)

    const seen = new Set<string>()
    return [...substringMatches, ...fuzzyMatches].filter((p) => {
      if (seen.has(p.slug)) return false
      seen.add(p.slug)
      return true
    })
  }, [query, activeTags, posts])

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

      {/* Search + tag filter row */}
      <div className="flex gap-3 max-w-xl mx-auto w-full">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-battleship-gray pointer-events-none"
          />
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

        {allTags.length > 0 && (
          <TagDropdown allTags={allTags} activeTags={activeTags} onChange={setActiveTags} />
        )}
      </div>

      {/* Active tag pills */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 -mt-8 max-w-xl mx-auto w-full">
          {activeTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTags(activeTags.filter((t) => t !== tag))}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sg-medium bg-soft-royal-blue/8 border border-soft-royal-blue/30 text-soft-royal-blue hover:bg-soft-royal-blue/15 transition-colors duration-150"
            >
              {tag}
              <X size={10} />
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="flex flex-col gap-10">
        {results.length > 0 ? (
          results.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="text-battleship-gray sg-regular text-center">
            No posts found
            {activeTags.length > 0
              ? ` tagged "${activeTags.join(', ')}"`
              : query
                ? ` for "${query}"`
                : ''}
          </p>
        )}
      </div>

      <Socials />
    </section>
  )
}
