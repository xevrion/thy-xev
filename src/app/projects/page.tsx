import type { Metadata } from 'next'
import { Projects } from '@/components/Projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'All projects built by Yash Bavadiya — web apps, CLI tools, AI experiments, and open source contributions.',
  alternates: { canonical: 'https://xevrion.dev/projects' },
}

export default function ProjectsPage() {
  return <Projects />
}
