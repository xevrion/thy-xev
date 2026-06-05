'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import Fuse from 'fuse.js'
import projectsData from '../../constants/projects.json'
import { FileText, Folder, Navigation, ExternalLink, Sun, Moon, Music, Github, Linkedin, Twitter, Mail, Zap } from 'lucide-react'
import { FaLastfm } from 'react-icons/fa'
import { useTheme } from 'next-themes'

type ActionType = 'navigate' | 'external' | 'function'

interface PaletteItem {
  id: string
  label: string
  subtitle?: string
  type: 'page' | 'post' | 'project' | 'action'
  actionType: ActionType
  target?: string
  fn?: () => void
  icon?: React.ReactNode
}

const PAGES: PaletteItem[] = [
  { id: 'home',     label: 'Home',     subtitle: 'Go to homepage',          type: 'page', actionType: 'navigate', target: '/' },
  { id: 'about',    label: 'About',    subtitle: 'About me',                type: 'page', actionType: 'navigate', target: '/about' },
  { id: 'blogs',    label: 'Blogs',    subtitle: 'All blog posts',          type: 'page', actionType: 'navigate', target: '/blogs' },
  { id: 'projects', label: 'Projects', subtitle: 'My projects',             type: 'page', actionType: 'navigate', target: '/projects' },
  { id: 'contact',  label: 'Contact',  subtitle: 'Get in touch',            type: 'page', actionType: 'navigate', target: '/contact' },
  { id: 'resume',   label: 'Resume',   subtitle: 'View my resume',          type: 'page', actionType: 'navigate', target: '/resume' },
  { id: 'now',      label: 'Now',      subtitle: "What I'm up to right now", type: 'page', actionType: 'navigate', target: '/now' },
]

const SOCIAL_ACTIONS: PaletteItem[] = [
  { id: 'github',   label: 'Open GitHub',   subtitle: 'github.com/xevrion',            type: 'action', actionType: 'external', target: 'https://github.com/xevrion',                              icon: <Github   size={14} className="opacity-50" /> },
  { id: 'linkedin', label: 'Open LinkedIn', subtitle: 'linkedin.com/in/yash-bavadiya', type: 'action', actionType: 'external', target: 'https://www.linkedin.com/in/yash-bavadiya/',  icon: <Linkedin size={14} className="opacity-50" /> },
  { id: 'twitter',  label: 'Open Twitter',  subtitle: 'x.com/xevrion_the1',            type: 'action', actionType: 'external', target: 'https://x.com/xevrion_the1',                          icon: <Twitter  size={14} className="opacity-50" /> },
  { id: 'lastfm',   label: 'Open Last.fm',  subtitle: 'last.fm/user/xevrion',          type: 'action', actionType: 'external', target: 'https://www.last.fm/user/xevrion/',                     icon: <FaLastfm size={14} className="opacity-50" /> },
  { id: 'email',    label: 'Send Email',    subtitle: 'me@xevrion.dev',                type: 'action', actionType: 'external', target: 'mailto:me@xevrion.dev',                                 icon: <Mail     size={14} className="opacity-50" /> },
]

const PROJECT_ITEMS: PaletteItem[] = [
  ...projectsData.projects,
  ...projectsData.pastProjects,
].map((p) => ({
  id: `project-${p.text}`,
  label: p.text,
  subtitle: p.desc,
  type: 'project' as const,
  actionType: 'external' as const,
  target: p.url,
}))

const STATIC_ITEMS: PaletteItem[] = [...PAGES, ...SOCIAL_ACTIONS, ...PROJECT_ITEMS]

const fuse = new Fuse(STATIC_ITEMS, {
  keys: [{ name: 'label', weight: 0.6 }, { name: 'subtitle', weight: 0.4 }],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 1,
})

function ItemIcon({ item }: { item: PaletteItem }) {
  if (item.icon) return <>{item.icon}</>
  const cls = 'shrink-0 opacity-50'
  if (item.type === 'post')    return <FileText   size={14} className={cls} />
  if (item.type === 'project') return <Folder     size={14} className={cls} />
  if (item.type === 'action')  return <Zap        size={14} className={cls} />
  return                              <Navigation size={14} className={cls} />
}

function TypeBadge({ type }: { type: PaletteItem['type'] }) {
  return (
    <span className="text-[11px] sg-regular text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:block shrink-0">
      {type}
    </span>
  )
}

let _globalOpen: () => void = () => {}
export function openCommandPalette() { _globalOpen() }

export const CommandPalette = () => {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  useEffect(() => { openRef.current = open }, [open])

  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const [spotifyUrl, setSpotifyUrl] = useState<string | null>(null)
  const [spotifyLabel, setSpotifyLabel] = useState('Open current Spotify song')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => { _globalOpen = () => setOpen(true) }, [])

  useEffect(() => {
    if (!open) return
    fetch('/api/now-playing')
      .then((r) => r.json())
      .then((d) => {
        if (d?.songUrl) {
          setSpotifyUrl(d.songUrl)
          const prefix = d.isPlaying ? '▶ Now playing: ' : '↩ Last played: '
          setSpotifyLabel(`${prefix}${d.title} — ${d.artist}`)
        }
      })
      .catch(() => {})
  }, [open])

  const toggleThemeFromCenter = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const x = window.innerWidth / 2
    const y = window.innerHeight / 2
    if (!document.startViewTransition) { setTheme(next); return }
    const maxRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = document.startViewTransition(() => setTheme(next))
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }, [theme, setTheme])

  const dynamicActions: PaletteItem[] = useMemo(() => {
    const isDark = theme === 'dark'
    const items: PaletteItem[] = [{
      id: 'toggle-theme',
      label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Toggle site theme',
      type: 'action',
      actionType: 'function',
      fn: toggleThemeFromCenter,
      icon: isDark ? <Sun size={14} className="opacity-50" /> : <Moon size={14} className="opacity-50" />,
    }]
    if (spotifyUrl) {
      items.push({
        id: 'spotify',
        label: spotifyLabel,
        subtitle: 'Open in Spotify',
        type: 'action',
        actionType: 'external',
        target: spotifyUrl,
        icon: <Music size={14} className="opacity-50" />,
      })
    }
    return items
  }, [spotifyUrl, spotifyLabel, open, toggleThemeFromCenter, theme])

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return [...dynamicActions, ...PAGES, ...SOCIAL_ACTIONS]
    const lower = q.toLowerCase()
    const allSearchable = [...dynamicActions, ...STATIC_ITEMS]
    const substr = allSearchable.filter(
      (i) => i.label.toLowerCase().includes(lower) || (i.subtitle?.toLowerCase().includes(lower) ?? false)
    )
    const fuzzy = fuse.search(q).map((r) => r.item)
    const seen = new Set<string>()
    return [...substr, ...fuzzy].filter((i) => { if (seen.has(i.id)) return false; seen.add(i.id); return true })
  }, [query, dynamicActions])

  useEffect(() => { setActiveIdx(0) }, [results])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (window.innerWidth < 768) return
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen((o) => !o) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  const runItem = useCallback((item: PaletteItem) => {
    if (item.actionType === 'navigate' && item.target) {
      setOpen(false)
      router.push(item.target)
    } else if (item.actionType === 'function' && item.fn) {
      setOpen(false)
      item.fn()
    } else if (item.actionType === 'external' && item.target) {
      setOpen(false)
      window.open(item.target, '_blank', 'noopener noreferrer')
    }
  }, [router])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[activeIdx]) runItem(results[activeIdx]) }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] hidden md:flex items-start justify-center pt-[12vh] px-6"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <motion.div
            key="palette-box"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-taupe border border-battleship-gray/30 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-battleship-gray/20">
              <Navigation size={18} className="text-[var(--color-text-subtle)] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={() => { if (openRef.current) setTimeout(() => inputRef.current?.focus(), 0) }}
                placeholder="Search pages, posts, projects, actions..."
                className="flex-1 bg-transparent text-soft-royal-blue sg-regular text-base placeholder-battleship-gray/70 focus:outline-none"
              />
            </div>

            <ul ref={listRef} className="max-h-96 overflow-y-auto py-2" style={{ scrollbarWidth: 'none' }}>
              {results.length === 0 ? (
                <li className="px-5 py-8 text-center text-[var(--color-text-subtle)] sg-regular text-base">
                  No results for &quot;{query}&quot;
                </li>
              ) : (
                results.map((item, idx) => (
                  <li
                    key={item.id}
                    className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors duration-100 ${
                      idx === activeIdx ? 'bg-soft-royal-blue/10 text-soft-royal-blue' : 'text-[var(--color-text)] hover:bg-soft-royal-blue/5'
                    }`}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => runItem(item)}
                  >
                    <ItemIcon item={item} />
                    <div className="flex-1 min-w-0">
                      <p className="text-base sg-medium truncate">{item.label}</p>
                      {item.subtitle && <p className="text-sm text-[var(--color-text-muted)] sg-regular truncate">{item.subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <TypeBadge type={item.type} />
                      {item.actionType === 'external' && <ExternalLink size={13} className="opacity-30" />}
                    </div>
                  </li>
                ))
              )}
            </ul>

            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-battleship-gray/10 text-sm text-[var(--color-text-muted)] sg-regular">
              <span><kbd className="font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono">↵</kbd> open</span>
              <span><kbd className="font-mono">⌘K</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
