'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import type { Post } from '@/lib/posts'

const Tooltip = ({ message, children }: { message: string; children: React.ReactNode }) => (
  <span className="relative group cursor-help underline decoration-dotted underline-offset-3">
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
      {message}
    </span>
  </span>
)

export const PostPage = ({ post }: { post: Post }) => {
  const content = (() => {
    const lines = post.content.split('\n')
    return [lines[0], ...lines.slice(3)].join('\n')
  })()

  return (
    <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl text-lg mx-auto text-battleship-gray sg-regular">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: (props) => (
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl text-soft-royal-blue sg-medium mb-3" {...props} />
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
          ),
          h2: (props) => <h2 className="text-xl sm:text-2xl text-soft-royal-blue sg-bold mb-3" {...props} />,
          h3: (props) => <h3 className="text-lg sm:text-xl text-soft-royal-blue sg-bold mb-2" {...props} />,
          p: (props) => <p className="text-battleship-gray text-lg mb-4 sg-regular leading-relaxed" {...props} />,
          a: (props) => <a className="text-soft-royal-blue hover:underline transition-colors sg-regular wrap-anywhere" target="_blank" {...props} />,
          code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
            if (className) return <code className={className} {...props}>{children}</code>
            return <code className="inline-code px-1.5 py-0.5 rounded text-[0.875em] font-mono tracking-tight" {...props}>{children}</code>
          },
          blockquote: (props) => <blockquote className="border-l-4 border-soft-royal-blue pl-4 italic text-battleship-gray my-4" {...props} />,
          ul: (props) => <ul className="list-disc ml-6 mb-4" style={{ marginLeft: '1.5rem' }} {...props} />,
          ol: (props) => <ol className="list-decimal ml-6 mb-4" {...props} />,
          li: (props) => <li className="mb-2 text-battleship-gray sg-regular text-lg" {...props} />,
          strong: (props) => <strong className="font-bold" {...props} />,
          em: (props) => <em className="italic text-battleship-gray" {...props} />,
          span: (props: React.HTMLAttributes<HTMLSpanElement> & { 'data-tooltip'?: string }) => {
            if (props.className === 'tooltip') return <Tooltip message={props['data-tooltip'] ?? ''}>{props.children}</Tooltip>
            if (props.className === 'blue') return <span className="text-soft-royal-blue">{props.children}</span>
            return <span {...props} />
          },
          hr: () => <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-soft-royal-blue/30 to-transparent" />,
          pre: (props) => <pre {...props} />,
          table: (props) => (
            <div className="overflow-x-auto my-5">
              <table className="w-full border-collapse text-base text-battleship-gray sg-regular" {...props} />
            </div>
          ),
          thead: (props) => <thead className="border-b-2 border-soft-royal-blue/30" {...props} />,
          tr: (props) => <tr className="border-b border-soft-royal-blue/10" {...props} />,
          th: (props) => <th className="text-left text-soft-royal-blue sg-bold px-4 py-2 text-sm" {...props} />,
          td: (props) => <td className="px-4 py-2 text-sm" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </section>
  )
}
