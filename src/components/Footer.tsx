'use client'

import SpotifyWidget from './SpotifyWidget'
import { SectionLabel } from './SectionLabel'
import WakatimeDailyWidget from './WakatimeWidget'
import WakatimeLanguages from './WakatimeLanguages'
import GithubContributions from './GithubContributions'
import VisitorCount from './VisitorCount'
import Socials from './Socials'
import { ThemeToggle } from './ThemeToggle'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full mt-4">
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-14">

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
            <Socials />
            <VisitorCount />
            <p className="text-xs text-[var(--color-text-muted)] sg-regular font-mono tabular-nums text-center sm:text-left">
              © {year} Yash Bavadiya. All rights reserved.
            </p>
          </div>
          <ThemeToggle />
        </div>

      </div>
    </footer>
  )
}
