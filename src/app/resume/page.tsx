import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { Resume } from '@/components/Resume'

const description = 'View and download Yash Bavadiya\'s resume. Full Stack Developer and CS student at IIT Jodhpur.'

export const metadata: Metadata = {
  title: 'Resume',
  description,
  openGraph: {
    type: 'website',
    url: 'https://xevrion.dev/resume',
    title: 'Resume | Xevrion',
    description: 'View and download Yash Bavadiya\'s resume.',
  },
  alternates: { canonical: 'https://xevrion.dev/resume' },
}

export default function ResumePage() {
  return (
    <>
      <JsonLd
        type="webpage"
        title="Resume"
        description={description}
        canonicalUrl="https://xevrion.dev/resume"
      />
      <Resume />
    </>
  )
}
