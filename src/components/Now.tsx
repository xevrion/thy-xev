'use client'

import SplitText from './reactbits/splittext'

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
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14 flex flex-col gap-12">
      <div className="text-center">
        <SplitText
          text="Now"
          className="text-5xl sm:text-6xl text-soft-royal-blue sg-bold mb-3"
          delay={20}
          duration={1}
          ease="elastic.out(1, 0.5)"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
        <p className="text-battleship-gray/60 sg-regular text-sm">what i'm up to right now</p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 border-b border-battleship-gray/15 pb-5">
            <span className="text-[var(--color-battleship-gray)]/45 sg-regular text-sm font-mono w-28 shrink-0">{item.label}</span>
            <span className="text-[var(--color-battleship-gray)] sg-regular text-base">{item.value}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-battleship-gray/60 sg-regular text-sm">
        last updated 11 April 2026 · inspired by{' '}
        <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="hover:text-battleship-gray transition-colors">
          nownownow.com
        </a>
      </p>
    </section>
  )
}

export default Now
