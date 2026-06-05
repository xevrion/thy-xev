import type { Metadata } from 'next'
import { About } from '@/components/About'

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Hi! I\'m Yash Bavadiya (Xevrion), a Computer Science student from IIT Jodhpur passionate about programming, design, and building creative projects.',
  openGraph: {
    type: 'profile',
    url: 'https://xevrion.dev/about',
    title: 'About Xevrion — Full Stack Developer',
    description: 'Computer Science student from IIT Jodhpur passionate about programming, design, and building creative projects.',
  },
  alternates: { canonical: 'https://xevrion.dev/about' },
}

export default function AboutPage() {
  return <About />
}
