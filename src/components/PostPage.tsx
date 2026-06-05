'use client'

import { ReadingProgress } from './ReadingProgress'
import type { ReactNode } from 'react'

interface PostPageProps {
  title: string
  description?: string
  date?: string
  tags?: string[]
  readingTime?: string
  children: ReactNode
}

export const PostPage = ({ title, description, date, tags = [], readingTime, children }: PostPageProps) => {
  return (
    <>
      <ReadingProgress />
      <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl text-soft-royal-blue sg-medium mb-4">{title}</h1>
          {description && (
            <p className="text-battleship-gray/70 sg-regular mb-3">{description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {date && <span className="text-sm text-battleship-gray/60 sg-regular">{date}</span>}
            {readingTime && (
              <>
                <span className="text-battleship-gray/30">·</span>
                <span className="text-sm text-battleship-gray/60 sg-regular">{readingTime}</span>
              </>
            )}
            {tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs sg-medium border border-battleship-gray/30 text-battleship-gray/70">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="prose-post">
          {children}
        </div>
      </section>
    </>
  )
}
