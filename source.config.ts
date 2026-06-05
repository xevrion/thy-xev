import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { pageSchema } from 'fumadocs-core/source/schema'
import { remarkReadingTime } from '@/lib/remarkReadingTime'
import { z } from 'zod'

export const docs = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: pageSchema.extend({
      tags: z.array(z.string()).optional(),
      date: z.coerce.date().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
      valueToExport: ['readingTime'],
    },
  },
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkReadingTime],
    rehypeCodeOptions: {
      inline: 'tailing-curly-colon',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
})
