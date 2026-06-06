'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import data from '../../constants/projects.json'
import { SectionLabel } from './SectionLabel'
import { SectionDivider } from './SectionDivider'
import { ExternalLink, Github } from 'lucide-react'

const { projects, pastProjects } = data

type Project = {
  url: string
  text: string
  desc: string
  image?: string
  live?: string
  tags?: string[]
}

function CornerMark({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute z-10 size-4 flex items-center justify-center ${className}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-battleship-gray/25">
        <line x1="5" y1="0" x2="5" y2="10" strokeWidth="1" />
        <line x1="0" y1="5" x2="10" y2="5" strokeWidth="1" />
      </svg>
    </span>
  )
}

function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const [hovered, setHovered] = React.useState(false)
  const [cursor, setCursor] = React.useState({ x: 0, y: 0 })
  const [visible, setVisible] = React.useState(false)
  const cardRef = React.useRef<HTMLLIElement>(null)

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  React.useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const previewWidth = 256
  const ox = 16, oy = 16
  let px = cursor.x + ox
  let py = cursor.y + oy
  if (typeof window !== 'undefined' && px + previewWidth > window.innerWidth - 8) px = cursor.x - previewWidth - ox

  return (
    <li
      ref={cardRef}
      className="relative flex flex-col gap-4 p-6 border-r border-b border-battleship-gray/15 transition-[opacity,transform,background-color] duration-700 ease-out hover:bg-battleship-gray/[0.04]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cursor-following preview */}
      {project.image && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.12, ease: 'easeOut' } }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.08 } }}
              className="fixed z-[1000] pointer-events-none"
              style={{ left: px, top: py }}
            >
              <div className="p-1 bg-[var(--color-taupe)] border border-battleship-gray/30 shadow-2xl rounded-xl">
                <img src={project.image} width={256} height={160} className="rounded-lg block" alt="preview" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Title + icons */}
      <div className="flex items-start justify-between gap-4">
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="sg-bold text-lg text-[var(--color-text)] hover:text-soft-royal-blue transition-colors duration-150">
          {project.text}
        </a>
        <div className="flex items-center gap-2.5 shrink-0">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-subtle)] hover:text-soft-royal-blue transition-colors" aria-label="Live site">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-subtle)] hover:text-soft-royal-blue transition-colors" aria-label="GitHub">
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="text-[var(--color-text-muted)] sg-regular text-base leading-relaxed flex-1">
        {project.desc}
      </p>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 border border-battleship-gray/30 text-[var(--color-text-muted)] font-mono sg-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
    </li>
  )
}

function ProjectGrid({ items, label }: { items: Project[]; label?: string }) {
  return (
    <div className="flex flex-col gap-3">
      {label && <p className="text-xs font-mono text-[var(--color-text-subtle)] uppercase tracking-widest">{label}</p>}
      <div className="relative">
        <CornerMark className="-top-2 -left-2" />
        <CornerMark className="-top-2 -right-2" />
        <CornerMark className="-bottom-2 -left-2" />
        <CornerMark className="-bottom-2 -right-2" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-battleship-gray/15">
          {items.map((p, i) => (
            <ProjectCard key={p.url} project={p} index={i} />
          ))}
        </ul>
      </div>
    </div>
  )
}

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
