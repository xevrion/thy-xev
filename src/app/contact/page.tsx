import type { Metadata } from 'next'
import { Contact } from '@/components/Contact'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Xevrion. Always open for collaborations, new ideas, or just a friendly chat.',
  openGraph: {
    type: 'website',
    url: 'https://xevrion.dev/contact',
    title: 'Contact | Xevrion',
    description: 'Get in touch with Xevrion. Always open for collaborations, new ideas, or just a friendly chat.',
  },
  alternates: { canonical: 'https://xevrion.dev/contact' },
}

export default function ContactPage() {
  return <Contact />
}
