import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { setup } from '@/lib/uses'

export const metadata: Metadata = {
  title: 'Setup — Yash Bavadiya',
  description: 'VS Code / Cursor configuration and extensions I use daily.',
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

function Row({ name, href }: { name: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-text-subtle)]/5 transition-colors duration-150 group">
      <span className="flex-1 text-sm text-[var(--color-text)] sg-regular">{name}</span>
      {href && <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />}
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a> : <div>{inner}</div>
}

export default function SetupPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-150 mb-10">
        <ArrowLeft className="w-3.5 h-3.5" /> back
      </Link>

      <header className="mb-12">
        <h1 className="sg-bold text-3xl text-[var(--color-text)] mb-2">Setup</h1>
        <p className="text-sm text-[var(--color-text-muted)] sg-regular">VS Code / Cursor configuration and extensions I use daily.</p>
      </header>

      <div className="flex flex-col gap-10">
        <Section title="Editors">
          {setup.editor.map(e => <Row key={e.name} name={e.name} href={e.href} />)}
        </Section>

        <Section title="Themes">
          {setup.themes.map(t => <Row key={t.name} name={t.name} href={t.href} />)}
        </Section>

        <Section title="Extensions">
          {setup.extensions.map(e => <Row key={e.name} name={e.name} href={e.href} />)}
        </Section>

        <Section title="Fonts">
          {setup.fonts.map(f => <Row key={f.name} name={f.name} href={f.href} />)}
        </Section>
      </div>
    </div>
  )
}
