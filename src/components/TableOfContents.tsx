'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { TOCItemType } from 'fumadocs-core/toc'

export type TocItem = TOCItemType

// --- Shared hook: tracks which heading is active based on scroll ---
function useActiveHeading(items: TocItem[]) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const ids = items.map((item) => item.url.slice(1))

    const observer = new IntersectionObserver(
      (entries) => {
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

// --- Progress circle with tip dot (like Anish) ---
function ProgressCircle({
  value,
  size = 20,
  strokeWidth = 2,
}: {
  value: number // 0–1
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = value * circumference
  const angle = -Math.PI / 2 + value * 2 * Math.PI
  const tipX = size / 2 + radius * Math.cos(angle)
  const tipY = size / 2 + radius * Math.sin(angle)

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="shrink-0 text-soft-royal-blue"
    >
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        strokeOpacity={0.2}
      />
      {/* Arc */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-300 ease-out"
      />
      {/* Tip dot */}
      {value > 0 && value < 1 && (
        <circle
          cx={tipX} cy={tipY}
          r={strokeWidth * 0.85}
          fill="currentColor"
          className="transition-all duration-300 ease-out"
        />
      )}
    </svg>
  )
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

  // Auto-scroll active item into view when list is open
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [active, open])

  const activeIdx = items.findIndex((i) => i.url.slice(1) === active)
  const activeItem = activeIdx >= 0 ? items[activeIdx] : null

  if (items.length === 0) return null

  // Progress is heading-based (same as Anish): fraction of headings passed
  const progress = activeIdx >= 0 ? (activeIdx + 1) / items.length : 0

  return (
    <div className="xl:hidden sticky top-14 z-40 bg-[var(--color-taupe)] border-b border-battleship-gray/15 backdrop-blur-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-6 sm:px-8 lg:px-10 h-10 text-sm"
        aria-expanded={open}
      >
        <ProgressCircle value={progress} />

        <span className="flex-1 text-left truncate text-[var(--color-text-muted)] sg-regular text-xs">
          {activeItem ? String(activeItem.title) : ''}
        </span>

        <span className="text-xs sg-regular text-[var(--color-text-subtle)] shrink-0 tabular-nums">
          {activeIdx >= 0 ? activeIdx + 1 : 0}
          <span className="mx-0.5">/</span>
          {items.length}
        </span>

        <ChevronDown
          size={14}
          className={`shrink-0 text-[var(--color-text-subtle)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="toc-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
