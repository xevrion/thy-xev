import Link from 'next/link'
import { ArrowRight, Cpu, Monitor, Terminal } from 'lucide-react'
import { SectionLabel } from './SectionLabel'

const items = [
  {
    href: '/uses/gear',
    icon: Cpu,
    title: 'Gear',
    description: 'Tools, devices, and software I use to get work done.',
  },
  {
    href: '/uses/setup',
    icon: Monitor,
    title: 'Setup',
    description: 'VS Code / Cursor configuration and extensions.',
  },
  {
    href: '/uses/terminal',
    icon: Terminal,
    title: 'Terminal',
    description: 'Zsh, Starship, Fastfetch, and shell configuration.',
  },
]

export function Uses() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
      <SectionLabel>Development</SectionLabel>
      <div className="flex flex-col mt-6">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-5 px-5 py-4 border-x border-t border-battleship-gray/15 hover:bg-[var(--color-text-subtle)]/5 transition-colors duration-150 ${i === items.length - 1 ? 'border-b' : ''} ${i === 0 ? 'rounded-t-lg' : ''} ${i === items.length - 1 ? 'rounded-b-lg' : ''}`}
            >
              <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-battleship-gray/20 bg-[var(--color-text-subtle)]/5 text-[var(--color-text-muted)]">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="sg-semibold text-sm text-[var(--color-text)]">{item.title}</p>
                <p className="text-xs text-[var(--color-text-muted)] sg-regular mt-0.5">{item.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
