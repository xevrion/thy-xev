'use client'

import type { Post } from '@/lib/posts'

export const PostPage = ({ post, html }: { post: Post; html: string }) => {
  return (
    <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl mx-auto">
      {/* Post header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl text-soft-royal-blue sg-medium mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-battleship-gray/60 sg-regular">{post.displayDate}</span>
          <span className="text-battleship-gray/30">·</span>
          <span className="text-sm text-battleship-gray/60 sg-regular">{post.readingTime}</span>
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs sg-medium border border-battleship-gray/30 text-battleship-gray/70">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Rendered markdown */}
      <div
        className="prose-post"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}
