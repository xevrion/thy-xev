import type { Metadata } from 'next'
import { Projects } from '@/components/Projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'All projects built by Yash Bavadiya — web apps, CLI tools, AI experiments, and open source contributions.',
  alternates: { canonical: 'https://xevrion.dev/projects' },
}

export default function ProjectsPage() {
  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pt-10 sm:pt-14 pb-6 flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
        <h1 className="text-[clamp(2rem,5vw+1rem,3.5rem)] sg-bold text-[var(--color-text)] leading-tight tracking-tight">
          Projects
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-muted)] sg-regular">
          Everything I shipped — and a few things I started at midnight and never quite finished.
        </p>
      </div>
      <Projects noHeader />
    </>
  )
}
