'use client'

import Link from 'next/link'
import data from '../../constants/projects.json'
import { SectionLabel } from './SectionLabel'
import { SectionDivider } from './SectionDivider'
import { ProjectGrid } from './ProjectCard'

const { projects, pastProjects } = data

interface ProjectsProps {
  /** Max total projects to show. undefined = show all. */
  limit?: number
  /** Show "All projects →" link at the bottom */
  showViewAll?: boolean
  /** Merge all projects into one unlabelled grid (no section headers) */
  flat?: boolean
  /** Hide the SectionLabel and reduce top padding (used when page provides its own h1) */
  noHeader?: boolean
}

export const Projects = ({ limit, showViewAll, flat, noHeader }: ProjectsProps) => {
  const allCombined = [...projects, ...pastProjects]

  if (flat) {
    const items = limit !== undefined ? allCombined.slice(0, limit) : allCombined
    return (
      <section className={`w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col gap-10 ${noHeader ? 'pb-14' : 'py-14'}`}>
        {!noHeader && <SectionLabel>Projects</SectionLabel>}
        <ProjectGrid items={items} />
        {showViewAll && (
          <Link
            href="/projects"
            className="text-sm sg-regular text-[var(--color-text-muted)] hover:text-soft-royal-blue transition-colors duration-150 self-start"
          >
            All projects →
          </Link>
        )}
      </section>
    )
  }

  let activeItems = projects
  let pastItems = pastProjects

  if (limit !== undefined) {
    activeItems = projects.slice(0, limit)
    const remaining = limit - activeItems.length
    pastItems = remaining > 0 ? pastProjects.slice(0, remaining) : []
  }

  return (
    <section className={`w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col gap-10 ${noHeader ? 'pt-10 pb-14' : 'py-14'}`}>
      {!noHeader && <SectionLabel>Projects</SectionLabel>}
      <ProjectGrid items={activeItems} label="Currently working" />
      {pastItems.length > 0 && (
        <>
          <SectionDivider />
          <ProjectGrid items={pastItems} label="Past projects" />
        </>
      )}
      {showViewAll && (
        <Link
          href="/projects"
          className="text-sm sg-regular text-[var(--color-text-muted)] hover:text-soft-royal-blue transition-colors duration-150 self-start"
        >
          All projects →
        </Link>
      )}
    </section>
  )
}
