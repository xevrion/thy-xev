'use client'

import { useState, useMemo, useRef, useEffect, useTransition } from 'react'
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { Search, X, Tag, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
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

const PER_PAGE_OPTIONS = [5, 10, 15, 20]

// --- Tag popover ---
function TagPopover({
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
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  function toggle(tag: string) {
    onChange(activeTags.includes(tag) ? activeTags.filter((t) => t !== tag) : [...activeTags, tag])
  }

  const active = activeTags.length > 0

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex h-[38px] items-center gap-2 px-3 text-sm sg-regular transition-colors duration-150 border-y border-l rounded-l-lg ${
          active
            ? 'border-soft-royal-blue text-soft-royal-blue bg-soft-royal-blue/5'
            : 'border-battleship-gray/40 text-[var(--color-text)] hover:border-soft-royal-blue/50 hover:text-soft-royal-blue'
        }`}
      >
        <Tag size={14} />
        <span>Tags</span>
        {active && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-soft-royal-blue text-white text-[10px] sg-medium leading-none">
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
          {active && (
            <>
              <button
                onClick={() => onChange([])}
                className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs sg-medium text-[var(--color-text-muted)] hover:text-soft-royal-blue transition-colors duration-150"
              >
                <X size={11} /> Clear all
              </button>
              <div className="my-1 border-t border-battleship-gray/15" />
            </>
          )}
          <ul className="max-h-56 overflow-y-auto">
            {allTags.map((tag) => {
              const checked = activeTags.includes(tag)
              return (
                <li key={tag}>
                  <label className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-battleship-gray/[0.08] transition-colors duration-100">
                    <span
                      className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors duration-150 ${
                        checked ? 'border-soft-royal-blue bg-soft-royal-blue' : 'border-battleship-gray/40'
                      }`}
                    >
                      {checked && (
                        <svg viewBox="0 0 10 8" className="w-2 h-2">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggle(tag)}
                    />
                    <span className={`text-sm sg-regular ${checked ? 'text-soft-royal-blue' : 'text-[var(--color-text)]'}`}>
                      {tag}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

// --- Per-page select ---
function PerPageSelect({
  value,
  onChange,
}: {
  value: number
  onChange: (n: number) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-[38px] items-center gap-2 px-3 text-sm sg-regular border border-battleship-gray/40 rounded-r-lg text-[var(--color-text)] hover:border-soft-royal-blue/50 hover:text-soft-royal-blue transition-colors duration-150"
      >
        <span>{value} per page</span>
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[130px] rounded-lg border border-battleship-gray/20 bg-[var(--color-taupe)] shadow-lg py-1.5">
          {PER_PAGE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => { onChange(n); setOpen(false) }}
              className={`w-full px-3 py-1.5 text-sm text-left sg-regular transition-colors duration-100 hover:bg-battleship-gray/[0.08] ${
                n === value ? 'text-soft-royal-blue sg-medium' : 'text-[var(--color-text)]'
              }`}
            >
              {n} per page
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// --- Pagination ---
function Pagination({
  current,
  total,
  onChange,
}: {
  current: number
  total: number
  onChange: (p: number) => void
}) {
  if (total <= 1) return null

  // Build page number list with ellipsis
  const pages: (number | '…')[] = (() => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
    if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
    return [1, '…', current - 1, current, current + 1, '…', total]
  })()

  const btn = 'flex items-center justify-center w-8 h-8 rounded-md text-sm sg-regular transition-colors duration-150 disabled:opacity-40'

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
        className={`${btn} text-[var(--color-text)] hover:text-soft-royal-blue disabled:pointer-events-none`}
        aria-label="Previous page"
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-[var(--color-text-subtle)] text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`${btn} ${
              p === current
                ? 'bg-soft-royal-blue/10 border border-soft-royal-blue/40 text-soft-royal-blue sg-medium'
                : 'text-[var(--color-text)] hover:text-soft-royal-blue hover:bg-battleship-gray/[0.08]'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
        className={`${btn} text-[var(--color-text)] hover:text-soft-royal-blue disabled:pointer-events-none`}
        aria-label="Next page"
      >
        <ChevronRight size={15} />
      </button>
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
        <div className="flex items-center gap-3 whitespace-nowrap text-sm sg-regular text-[var(--color-text-muted)] sm:pt-1 shrink-0">
          {post.readingTime && <span>{post.readingTime}</span>}
          {post.readingTime && post.displayDate && <span className="text-[var(--color-text-subtle)]">·</span>}
          {post.displayDate && <span>{post.displayDate}</span>}
        </div>
      </div>
      {post.description && (
        <p className="text-[var(--color-text)] text-base sg-regular mb-3">{post.description}</p>
      )}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs sg-medium border border-battleship-gray/20 text-[var(--color-text-muted)]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const searchParsers = {
  q:    parseAsString.withDefault(''),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  page: parseAsInteger.withDefault(1),
  per:  parseAsInteger.withDefault(10),
}

// --- Main ---
export function BlogsClient({ posts, allTags }: { posts: BlogPost[]; allTags: string[] }) {
  const [params, setParams] = useQueryStates(searchParsers)
  const { q: query, tags: activeTags, page, per: perPage } = params
  const [, startTransition] = useTransition()

  function setQueryReset(q: string) { startTransition(() => { void setParams({ q, page: 1 }) }) }
  function setTagsReset(tags: string[]) { startTransition(() => { void setParams({ tags, page: 1 }) }) }
  function setPerPageReset(per: number) { startTransition(() => { void setParams({ per, page: 1 }) }) }
  function setPage(p: number) { startTransition(() => { void setParams({ page: p }) }) }

  const filtered = useMemo(() => {
    let pool = posts
    if (activeTags.length > 0) {
      pool = pool.filter((p) => activeTags.every((t) => p.tags.includes(t)))
    }
    const q = query.trim()
    if (!q) return pool

    const lower = q.toLowerCase()
    const substringMatches = pool.filter(
      (p) => p.title.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower),
    )
    const fuzzyMatches = new Fuse(pool, {
      keys: [{ name: 'title', weight: 0.6 }, { name: 'description', weight: 0.4 }],
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
  }, [query, activeTags, posts])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pb-10 sm:pb-14 flex flex-col gap-12">
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto w-full">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text)] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQueryReset(e.target.value)}
            placeholder="Search posts..."
            className="w-full h-[38px] pl-9 pr-9 rounded-lg border border-battleship-gray/40 bg-transparent text-soft-royal-blue placeholder-battleship-gray/60 sg-regular text-sm focus:outline-none focus:border-soft-royal-blue/60 transition-colors duration-200"
          />
          {query && (
            <button
              onClick={() => setQueryReset('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)] hover:text-soft-royal-blue transition-colors duration-150"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Fused: Tags | per-page */}
        <div className="flex shrink-0">
          {allTags.length > 0 && (
            <TagPopover allTags={allTags} activeTags={activeTags} onChange={setTagsReset} />
          )}
          {/* Separator */}
          {allTags.length > 0 && (
            <div className="w-px bg-battleship-gray/25 self-stretch" />
          )}
          <PerPageSelect value={perPage} onChange={setPerPageReset} />
        </div>
      </div>

      {/* Active tag pills */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 -mt-8 max-w-2xl mx-auto w-full">
          {activeTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagsReset(activeTags.filter((t) => t !== tag))}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sg-medium bg-soft-royal-blue/[0.08] border border-soft-royal-blue/30 text-soft-royal-blue hover:bg-soft-royal-blue/15 transition-colors duration-150"
            >
              {tag} <X size={10} />
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="flex flex-col gap-10">
        {paginated.length > 0 ? (
          paginated.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="text-[var(--color-text)] sg-regular text-center">
            No posts found
            {activeTags.length > 0 ? ` tagged "${activeTags.join(', ')}"` : query ? ` for "${query}"` : ''}
          </p>
        )}
      </div>

      {/* Bottom: count + pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs sg-regular text-[var(--color-text-subtle)] tabular-nums">
            Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} post{filtered.length !== 1 ? 's' : ''}
          </p>
          <Pagination current={currentPage} total={totalPages} onChange={setPage} />
        </div>
      )}

      <Socials />
    </section>
  )
}
