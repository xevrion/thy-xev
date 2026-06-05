import type { Metadata } from 'next'
import { Projects } from '@/components/Projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my current and past projects including web applications, AI tools, and interactive websites.',
  openGraph: {
    type: 'website',
    url: 'https://xevrion.dev/projects',
    title: 'Projects | Xevrion',
    description: 'Explore my current and past projects including web applications, AI tools, and interactive websites.',
  },
  alternates: { canonical: 'https://xevrion.dev/projects' },
}

export default function ProjectsPage() {
  return <Projects />
}
