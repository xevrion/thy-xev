'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { TOCItemType } from 'fumadocs-core/toc'

export type TocItem = TOCItemType

// --- Shared hook: tracks which heading is active based on scroll ---
function useActiveHeading(items: TocItem[]) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const ids = items.map((item) => item.url.slice(1)) // strip leading #

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 },
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  return active
}

// --- Desktop sidebar TOC ---
export function DesktopTOC({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items)

  if (items.length === 0) return null

  return (
    <aside className="hidden xl:block sticky top-24 self-start">
      <p className="text-xs font-mono font-medium text-[var(--color-text-muted)] uppercase tracking-widest mb-4">
        On this page
      </p>
      <nav>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const id = item.url.slice(1)
            const isActive = active === id
            return (
              <li
                key={item.url}
                style={{ paddingLeft: item.depth === 3 ? '12px' : item.depth === 4 ? '24px' : '0' }}
              >
                <a
                  href={item.url}
                  className={`block text-sm py-0.5 transition-colors duration-150 truncate ${
                    isActive
                      ? 'text-soft-royal-blue sg-medium'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] sg-regular'
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {String(item.title)}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

// --- Mobile collapsible TOC ---
export function MobileTOC({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items)
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // Track scroll progress through the post for the progress circle
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-scroll active item into view inside the list
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [active, open])

  const activeItem = items.find((i) => i.url.slice(1) === active)
  const activeIdx = items.findIndex((i) => i.url.slice(1) === active)

  if (items.length === 0) return null

  const size = 20
  const strokeWidth = 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <div className="xl:hidden sticky top-[57px] z-40 bg-[var(--color-taupe)] border-b border-battleship-gray/15 backdrop-blur-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-6 sm:px-8 lg:px-10 h-10 text-sm"
      >
        {/* Progress circle */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="shrink-0 text-soft-royal-blue"
        >
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="currentColor" strokeWidth={strokeWidth}
            strokeOpacity={0.2}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="currentColor" strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="transition-all duration-300 ease-out"
          />
        </svg>

        <span className="flex-1 text-left truncate text-[var(--color-text-muted)] sg-regular text-xs">
          {activeItem ? String(activeItem.title) : 'Table of contents'}
        </span>

        <span className="text-xs sg-regular text-[var(--color-text-subtle)] shrink-0 tabular-nums">
          {activeIdx >= 0 ? `${activeIdx + 1}/${items.length}` : `0/${items.length}`}
        </span>

        <ChevronDown
          size={14}
          className={`shrink-0 text-[var(--color-text-subtle)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          className="px-6 sm:px-8 lg:px-10 pb-3 max-h-[50vh] overflow-y-auto"
        >
          <ul className="flex flex-col gap-1 py-1">
            {items.map((item) => {
              const id = item.url.slice(1)
              const isActive = active === id
              return (
                <li
                  key={item.url}
                  data-active={isActive}
                  style={{ paddingLeft: item.depth === 3 ? '12px' : item.depth === 4 ? '24px' : '0' }}
                >
                  <a
                    href={item.url}
                    className={`block text-sm py-1 transition-colors duration-150 ${
                      isActive
                        ? 'text-soft-royal-blue sg-medium'
                        : 'text-[var(--color-text-muted)] sg-regular'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      setOpen(false)
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {String(item.title)}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
