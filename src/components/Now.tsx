'use client'

const items = [
  { label: 'learning',  value: 'agentic architecture, contributing to Kdenlive' },
  { label: 'building',  value: 'improving DaemonDoc, cooking up something new' },
  { label: 'reading',   value: 'The Alchemist — Paulo Coelho' },
  { label: 'listening', value: 'Babydoll — Dominic Fike' },
  { label: 'life',      value: 'grind is on' },
  { label: 'mood',      value: 'chill' },
]

export const Now = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10 border-t border-battleship-gray/15">
      <div className="flex items-baseline gap-4">
        <p className="text-xs font-mono font-medium tracking-widest text-[var(--color-text-muted)]/60 uppercase">Now</p>
        <p className="text-xs text-[var(--color-text-muted)] sg-regular">what i'm up to right now</p>
      </div>

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
