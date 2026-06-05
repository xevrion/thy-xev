import type { Metadata } from 'next'
import { Now } from '@/components/Now'

export const metadata: Metadata = {
  title: 'Now',
  description: 'What Xevrion is up to right now.',
  alternates: { canonical: 'https://xevrion.dev/now' },
}

export default function NowPage() {
  return <Now />
}
