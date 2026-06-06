'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { SectionLabel } from './SectionLabel'
import data from '../../constants/experience.json'

type ExperienceItem = {
  company: string
  role: string
  location: string
  period: string
  logo: string
  points: string[]
}

const experiences: ExperienceItem[] = data.experience

function ExperienceCard({ item, defaultOpen = false }: { item: ExperienceItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-r border-b border-battleship-gray/15 bg-[var(--color-taupe)] hover:bg-battleship-gray/[0.04] transition-colors duration-150">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-full shrink-0 border border-battleship-gray/20 overflow-hidden bg-battleship-gray/10 flex items-center justify-center">
            <Image
              src={item.logo}
              alt={item.company}
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
          </div>
          <div className="min-w-0">
            <p className="sg-bold text-base text-[var(--color-text)]">{item.company}</p>
            <p className="sg-regular text-sm text-[var(--color-text-muted)]">{item.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="sg-regular text-sm text-[var(--color-text-muted)] tabular-nums">{item.period}</p>
            <p className="font-mono text-xs text-[var(--color-text-subtle)] uppercase tracking-wide">{item.location}</p>
          </div>
          <ChevronDown
            size={16}
            className={`text-[var(--color-text-subtle)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Mobile period/location */}
      <div className="sm:hidden px-6 -mt-2 pb-3 flex items-center justify-between">
        <p className="font-mono text-xs text-[var(--color-text-subtle)] uppercase tracking-wide">{item.location}</p>
        <p className="sg-regular text-xs text-[var(--color-text-muted)] tabular-nums">{item.period}</p>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="px-6 pb-6 pt-3 flex flex-col gap-3 border-t border-battleship-gray/10">
              {item.points.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm sg-regular text-[var(--color-text)] leading-relaxed">
                  <span className="mt-[0.45em] w-1 h-1 rounded-full bg-battleship-gray/40 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const Experience = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10">
      <SectionLabel>Experience</SectionLabel>
      <div className="relative">
        {/* Corner marks matching project cards */}
        <span aria-hidden="true" className="pointer-events-none absolute z-10 -top-2 -left-2 size-4 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-battleship-gray/25"><line x1="5" y1="0" x2="5" y2="10" strokeWidth="1" /><line x1="0" y1="5" x2="10" y2="5" strokeWidth="1" /></svg>
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute z-10 -top-2 -right-2 size-4 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-battleship-gray/25"><line x1="5" y1="0" x2="5" y2="10" strokeWidth="1" /><line x1="0" y1="5" x2="10" y2="5" strokeWidth="1" /></svg>
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute z-10 -bottom-2 -left-2 size-4 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-battleship-gray/25"><line x1="5" y1="0" x2="5" y2="10" strokeWidth="1" /><line x1="0" y1="5" x2="10" y2="5" strokeWidth="1" /></svg>
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute z-10 -bottom-2 -right-2 size-4 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-battleship-gray/25"><line x1="5" y1="0" x2="5" y2="10" strokeWidth="1" /><line x1="0" y1="5" x2="10" y2="5" strokeWidth="1" /></svg>
        </span>
        {/* Full width bordered list matching project grid style */}
        <div className="border-t border-l border-battleship-gray/15 flex flex-col">
          {experiences.map((item, i) => (
            <ExperienceCard key={item.company} item={item} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
