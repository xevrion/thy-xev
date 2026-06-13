import Link from 'next/link'
import data from '../../constants/shenanigans.json'
import { SectionLabel } from './SectionLabel'

const { shenanigans } = data

export function ShenanigansTeaser() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10">
      <SectionLabel>Shenanigans</SectionLabel>

      <p className="text-base sm:text-lg text-[var(--color-text-muted)] sg-regular max-w-2xl">
        Weird, fun, and fast-built side projects — shipped for laughs, learning, and the love of building.
      </p>

      <div className="flex flex-wrap gap-3">
        {shenanigans.map((project) => (
          <a
            key={project.url}
            href={project.live ?? project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-battleship-gray/30 text-sm sg-medium text-[var(--color-text)] transition-all duration-300 hover:border-soft-royal-blue hover:text-soft-royal-blue hover:-translate-y-0.5"
          >
            {project.text}
          </a>
        ))}
      </div>

      <Link
        href="/fun"
        className="text-sm sg-regular text-[var(--color-text-muted)] hover:text-soft-royal-blue transition-colors duration-150 self-start"
      >
        More shenanigans →
      </Link>
    </section>
  )
}
