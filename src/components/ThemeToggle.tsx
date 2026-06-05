'use client'

import { useTheme } from 'next-themes'
import { AnimatePresence, motion } from 'framer-motion'
import { SunMedium, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const toggleTheme = (e: React.MouseEvent) => {
    const next = theme === 'dark' ? 'light' : 'dark'

    if (!document.startViewTransition || window.innerWidth < 768) {
      setTheme(next)
      return
    }

    const { clientX, clientY } = e
    const maxRadius = Math.hypot(
      Math.max(clientX, window.innerWidth - clientX),
      Math.max(clientY, window.innerHeight - clientY)
    )

    const transition = document.startViewTransition(() => { setTheme(next) })
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${clientX}px ${clientY}px)`,
            `circle(${maxRadius}px at ${clientX}px ${clientY}px)`,
          ],
        },
        { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }

  if (!mounted) return <div className="w-[28px] h-[28px]" />

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.85 }}
      className="relative text-soft-royal-blue p-1 overflow-hidden cursor-pointer"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {theme === 'dark' ? <SunMedium size={20} /> : <Moon size={20} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}
