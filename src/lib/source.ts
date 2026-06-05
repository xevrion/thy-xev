import { docs } from '../../.source/server'
import { type InferPageType, loader } from 'fumadocs-core/source'

export const source = loader({
  baseUrl: '/blogs',
  source: docs.toFumadocsSource(),
})

export type BlogPage = InferPageType<typeof source>
