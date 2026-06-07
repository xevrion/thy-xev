import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Laptop, Monitor, Keyboard, Mouse, Headphones, Speaker, Gamepad2, Square, Smartphone, LucideIcon } from 'lucide-react'
import { gear } from '@/lib/uses'

const iconMap: Record<string, LucideIcon> = {
  laptop: Laptop,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  headphones: Headphones,
  speaker: Speaker,
  gamepad: Gamepad2,
  square: Square,
  smartphone: Smartphone,
}

export const metadata: Metadata = {
  title: 'Gear — Yash Bavadiya',
  description: 'Tools, devices, and software I use to get work done.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-subtle)] mb-4">{title}</p>
      <div className="flex flex-col divide-y divide-battleship-gray/10 border border-battleship-gray/15 rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function Row({ icon, index, name, href }: { icon?: string; index?: number; name: string; href?: string }) {
  const Icon = icon ? iconMap[icon] : null
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-text-subtle)]/5 transition-colors duration-150 group">
      <div className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md border border-battleship-gray/20 bg-[var(--color-text-subtle)]/5 text-[var(--color-text-muted)]">
        {Icon ? <Icon className="w-3.5 h-3.5" /> : <span className="text-xs font-mono">{index}</span>}
      </div>
      <span className="flex-1 text-sm text-[var(--color-text)] sg-regular">{name}</span>
      {href && <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />}
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a> : <div>{inner}</div>
}

export default function GearPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-150 mb-10">
        <ArrowLeft className="w-3.5 h-3.5" /> back
      </Link>

      <header className="mb-12">
        <h1 className="sg-bold text-3xl text-[var(--color-text)] mb-2">Gear</h1>
        <p className="text-sm text-[var(--color-text-muted)] sg-regular">Tools, devices, and software I use to get work done.</p>
      </header>

      <div className="flex flex-col gap-10">
        <Section title="Devices">
          {gear.devices.map(d => <Row key={d.name} icon={d.icon} name={d.name} />)}
        </Section>

        <Section title="Software">
          {gear.software.map((s, i) => <Row key={s.name} index={i + 1} name={s.name} href={s.href} />)}
        </Section>

        <Section title="Browser Extensions">
          {gear.extensions.map((e, i) => <Row key={e.name} index={i + 1} name={e.name} href={e.href} />)}
        </Section>
      </div>
    </div>
  )
}
