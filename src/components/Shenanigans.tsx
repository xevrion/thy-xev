'use client'

import data from '../../constants/shenanigans.json'
import { SectionLabel } from './SectionLabel'
import { ProjectGrid } from './ProjectCard'

const { shenanigans } = data

interface ShenanigansProps {
  /** Hide the SectionLabel and reduce top padding (used when page provides its own h1) */
  noHeader?: boolean
}

export const Shenanigans = ({ noHeader }: ShenanigansProps) => {
  return (
    <section className={`w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col gap-10 ${noHeader ? 'pt-10 pb-14' : 'py-14'}`}>
      {!noHeader && <SectionLabel>Shenanigans</SectionLabel>}
      <ProjectGrid items={shenanigans} />
    </section>
  )
}
