import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { Now } from '@/components/Now'

const description = 'What Xevrion is up to right now.'

export const metadata: Metadata = {
  title: 'Now',
  description,
  alternates: { canonical: 'https://xevrion.dev/now' },
}

export default function NowPage() {
  return (
    <>
      <JsonLd
        type="webpage"
        title="Now"
        description={description}
        canonicalUrl="https://xevrion.dev/now"
      />
      <Now />
    </>
  )
}
