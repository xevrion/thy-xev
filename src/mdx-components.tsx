import defaultMdxComponents from 'fumadocs-ui/mdx'
import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'
import type { ImgHTMLAttributes } from 'react'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props: ImgHTMLAttributes<HTMLImageElement>) => {
      const src = typeof props.src === 'string' ? props.src : ''
      return (
        <Image
          src={src}
          alt={props.alt ?? ''}
          width={800}
          height={450}
          className="rounded-xl border border-battleship-gray/15 mx-auto my-7"
          style={{ maxWidth: '100%', height: 'auto' }}
          unoptimized={src.startsWith('http')}
        />
      )
    },
    mark: ({ children }: { children: React.ReactNode }) => (
      <mark className="bg-[var(--mark-bg)] text-[var(--mark-fg)] rounded-sm px-[0.2em] not-italic">
        {children}
      </mark>
    ),
    ...components,
  }
}
