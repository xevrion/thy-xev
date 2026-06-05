import type { Metadata } from 'next'
import { Resume } from '@/components/Resume'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'View and download Yash Bavadiya\'s resume. Full Stack Developer and CS student at IIT Jodhpur.',
  openGraph: {
    type: 'website',
    url: 'https://xevrion.dev/resume',
    title: 'Resume | Xevrion',
    description: 'View and download Yash Bavadiya\'s resume.',
  },
  alternates: { canonical: 'https://xevrion.dev/resume' },
}

export default function ResumePage() {
  return <Resume />
}
