'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import DiscordWidget from './OnlineStatus'
import WeatherWidget from './WeatherWidget'
import { ThemeToggle } from './ThemeToggle'
import { openCommandPalette } from './CommandPalette'

// Sections that live as anchors on the homepage
const ANCHOR_LINKS = ['About', 'Projects', 'Now', 'Contact']

// Links shown in the nav — always shown (filtering is removed; active page is highlighted instead)
const ALL_LINKS = ['About', 'Projects', 'Now', 'Blogs', 'Resume']

function getLinkHref(link: string, isHomepage: boolean) {
  if (link === 'Resume') return '/resume'
  if (link === 'Blogs') return '/blogs'
  if (ANCHOR_LINKS.includes(link)) return isHomepage ? `#${link.toLowerCase()}` : `/#${link.toLowerCase()}`
  return `/${link.toLowerCase()}`
}

export const NavBar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHomepage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 70)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  useEffect(() => { setIsOpen(false) }, [pathname])

  const isActive = (link: string) => {
    if (link === 'Blogs') return pathname.startsWith('/blogs')
    if (link === 'Resume') return pathname === '/resume'
    return false
  }

  return (
    <nav className={`w-full sticky top-0 z-50 transition-all duration-150 ${scrolled && !isOpen ? 'bg-gradient-to-b from-taupe to-transparent backdrop-blur-[1px]' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 sm:px-8 py-4">
        {/* Logo + Discord */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="sg-bold text-xl sm:text-2xl text-soft-royal-blue transition-all duration-200 hover:scale-105 hover:[text-shadow:0_0_10px_#5e7aff]">
              xevrion
            </div>
          </Link>
          <DiscordWidget />
          <WeatherWidget />
        </div>

        {/* Desktop Links + Theme Toggle */}
        <div className="hidden md:flex items-center gap-8">
          {ALL_LINKS.map((link) => {
            const href = getLinkHref(link, isHomepage)
            const active = isActive(link)
            if (link === 'Resume') {
              return (
                <Link
                  key={link}
                  href={href}
                  className="relative font-space-grotesk text-base sm:text-lg font-bold text-soft-royal-blue opacity-60 transition-all duration-250 border-b border-dashed border-soft-royal-blue/50 hover:opacity-90 pb-[1px]"
                >
                  Resume
                </Link>
              )
            }
            return (
              <Link
                key={link}
                href={href}
                className={`relative font-space-grotesk text-base sm:text-lg font-bold text-soft-royal-blue transition-colors duration-250 after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:bg-soft-royal-blue after:transition-all after:duration-250 hover:after:w-full hover:after:left-0 ${active ? 'opacity-100 after:w-full after:left-0' : 'opacity-80 after:w-0'}`}
              >
                {link}
              </Link>
            )
          })}
          <button
            onClick={openCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-battleship-gray/50 text-[var(--color-text)] text-sm sg-regular hover:border-soft-royal-blue hover:text-soft-royal-blue transition-colors duration-150"
            aria-label="Open command palette"
          >
            <span>Search...</span>
            <kbd className="font-mono text-xs">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="text-soft-royal-blue z-50 relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`fixed top-0 left-0 w-full h-screen backdrop-blur-md bg-taupe/75 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {ALL_LINKS.map((link) => (
              <Link
                key={link}
                href={getLinkHref(link, isHomepage)}
                className="font-space-grotesk text-2xl font-bold text-soft-royal-blue opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
