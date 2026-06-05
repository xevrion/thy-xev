'use client'

import { ReadingProgress } from './ReadingProgress'
import { DesktopTOC, MobileTOC, type TocItem } from './TableOfContents'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface PostPageProps {
  title: string
  description?: string
  date?: string
  updatedAt?: string
  tags?: string[]
  readingTime?: string
  views?: number
  toc?: TocItem[]
  children: ReactNode
}

export const PostPage = ({
  title,
  description,
  date,
  updatedAt,
  tags = [],
  readingTime,
  views,
  toc = [],
  children,
}: PostPageProps) => {
  return (
    <>
      <ReadingProgress />
      {toc.length > 0 && <MobileTOC items={toc} />}

      <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14">
        {/* Post header */}
        <header className="mb-10 sm:mb-12 pb-8 border-b border-[var(--color-battleship-gray)]/10">
          <h1 className="text-[clamp(1.6rem,4vw+0.5rem,2.5rem)] font-bold text-[var(--color-soft-royal-blue)] leading-[1.15] tracking-tight mb-4">
            {title}
          </h1>

          {description && (
            <p className="text-base sm:text-[1.0625rem] text-[var(--color-text-muted)] leading-relaxed mb-5">
              {description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[var(--color-text-muted)]/70 mb-4">
            {date && <span>{date}</span>}
            {updatedAt && updatedAt !== date && (
              <span>updated {updatedAt}</span>
            )}
            {readingTime && <span>{readingTime}</span>}
            {views != null && <span>{views.toLocaleString()} reads</span>}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blogs?tags=${encodeURIComponent(tag)}`}
                  className="px-2 py-0.5 rounded font-mono text-xs bg-[var(--color-battleship-gray)]/6 text-[var(--color-battleship-gray)]/55 border border-[var(--color-battleship-gray)]/15 hover:text-[var(--color-soft-royal-blue)] hover:bg-[var(--color-soft-royal-blue)]/8 hover:border-[var(--color-soft-royal-blue)]/20 transition-colors duration-150"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Body: article + optional TOC sidebar */}
        <div className={toc.length > 0 ? 'xl:grid xl:grid-cols-[1fr_220px] xl:gap-14' : ''}>
          <article className="prose-post min-w-0">
            {children}
          </article>

          {toc.length > 0 && <DesktopTOC items={toc} />}
        </div>
      </div>
    </>
  )
}
