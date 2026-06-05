'use client'

import Link from 'next/link'
import SpotifyWidget from './SpotifyWidget'
import { SectionLabel } from './SectionLabel'
import WakatimeDailyWidget from './WakatimeWidget'
import WakatimeLanguages from './WakatimeLanguages'
import GithubContributions from './GithubContributions'
import VisitorCount from './VisitorCount'
import Socials from './Socials'
import DiscordWidget from './OnlineStatus'
import { ThemeToggle } from './ThemeToggle'

const pages = [
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#now', label: 'Now' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/#contact', label: 'Contact' },
  { href: '/resume', label: 'Resume' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full mt-4">
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-14">

        {/* Top: identity + page nav */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-10">
          <div className="flex flex-col gap-4">
            <Link href="/" className="sg-bold text-2xl text-[var(--color-text)] hover:text-soft-royal-blue transition-colors duration-150">
              Yash Bavadiya
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] sg-regular max-w-sm leading-relaxed">
              CS student at IIT Jodhpur who codes too late and ships anyway. I like making things that feel good to use.
            </p>
            <p className="text-xs font-mono text-[var(--color-text-subtle)] uppercase tracking-widest">
              Making the web a little less ugly.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--color-text-subtle)] uppercase tracking-widest">Discord</span>
              <span className="text-[var(--color-text-subtle)]">—</span>
              <DiscordWidget />
            </div>
            <Socials />
          </div>

          <nav aria-label="Footer navigation" className="flex flex-col gap-3">
            <p className="text-xs font-mono text-[var(--color-text-subtle)] uppercase tracking-widest mb-1">Pages</p>
            <div className="flex flex-wrap gap-2 sm:max-w-48 sm:justify-end">
              {pages.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs px-3 py-1.5 rounded-full border border-battleship-gray/20 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-battleship-gray/40 transition-colors duration-150 sg-regular"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <SectionLabel>The fun stuff</SectionLabel>

        {/* Live widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <SpotifyWidget />
          <WakatimeDailyWidget />
        </div>

        <WakatimeLanguages />
        <GithubContributions />

        {/* Divider */}
        <div className="border-t border-battleship-gray/10" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <VisitorCount />
            <p className="text-xs text-[var(--color-text-muted)] sg-regular font-mono tabular-nums">
              © {year} Yash Bavadiya. All rights reserved.
            </p>
          </div>
          <ThemeToggle />
        </div>

      </div>
    </footer>
  )
}
