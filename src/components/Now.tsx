'use client'

import { SectionLabel } from './SectionLabel'
import { Mark } from './Mark'

const items: { label: string; value: React.ReactNode }[] = [
  { label: 'learning',  value: <><Mark>agentic architecture</Mark>, contributing to Kdenlive</> },
  { label: 'building',  value: <>improving <Mark>DaemonDoc</Mark>, cooking up something new</> },
  { label: 'reading',   value: <><Mark>The Alchemist</Mark> — Paulo Coelho</> },
  { label: 'listening', value: <>Babydoll — <Mark>Dominic Fike</Mark></> },
  { label: 'life',      value: 'grind is on' },
  { label: 'mood',      value: 'chill' },
]

export const Now = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10">
      <SectionLabel>Now</SectionLabel>

      <div className="flex flex-col gap-6 max-w-2xl w-full">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 border-b border-battleship-gray/15 pb-5">
            <span className="text-[var(--color-text-subtle)] sg-regular text-sm font-mono w-28 shrink-0">{item.label}</span>
            <span className="text-[var(--color-text)] sg-regular text-base">{item.value}</span>
          </div>
        ))}
      </div>

      <p className="text-[var(--color-text-muted)] sg-regular text-sm">
        last updated 11 April 2026 · inspired by{' '}
        <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
          nownownow.com
        </a>
      </p>
    </section>
  )
}

export default Now
