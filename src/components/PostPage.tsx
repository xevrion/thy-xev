'use client'

import { ReadingProgress } from './ReadingProgress'
import { DesktopTOC, MobileTOC, type TocItem } from './TableOfContents'
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

      <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-20 2xl:px-40 py-12 max-w-screen-2xl mx-auto">
        <div className="xl:grid xl:grid-cols-[1fr_200px] xl:gap-16">
          {/* Main content */}
          <div className="min-w-0">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-2xl sm:text-3xl text-soft-royal-blue sg-medium mb-4">{title}</h1>
              {description && (
                <p className="text-battleship-gray/70 sg-regular mb-4">{description}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-col gap-2 text-sm sg-regular text-battleship-gray/60">
                {date && (
                  <div className="flex items-center gap-2">
                    <span>{date}</span>
                  </div>
                )}
                {updatedAt && updatedAt !== date && (
                  <div className="flex items-center gap-2">
                    <span className="text-battleship-gray/40">Updated</span>
                    <span>{updatedAt}</span>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {readingTime && <span>{readingTime}</span>}
                  {views != null && (
                    <>
                      {readingTime && <span className="text-battleship-gray/30">·</span>}
                      <span>{views.toLocaleString()} reads</span>
                    </>
                  )}
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs sg-medium border border-battleship-gray/30 text-battleship-gray/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="prose-post">{children}</div>
          </div>

          {/* Desktop TOC sidebar */}
          {toc.length > 0 && <DesktopTOC items={toc} />}
        </div>
      </section>
    </>
  )
}
