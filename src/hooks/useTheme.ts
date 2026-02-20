import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('light', theme === 'light')
  localStorage.setItem('theme', theme)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const sys = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    const initial = stored ?? sys
    setTheme(initial)
    applyTheme(initial)
  }, [])

  const toggleTheme = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    if (!document.startViewTransition) {
      applyTheme(next)
      setTheme(next)
      return
    }

    const maxRadius = Math.hypot(
      Math.max(clientX, window.innerWidth - clientX),
      Math.max(clientY, window.innerHeight - clientY)
    )

    const transition = document.startViewTransition(() => {
      applyTheme(next)
      setTheme(next)
    })

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

  return { theme, toggleTheme }
}
