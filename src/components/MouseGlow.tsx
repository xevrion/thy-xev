'use client'

import { useEffect, useRef, useState } from 'react'

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = glowRef.current
    if (!el) return

    let x = 0, y = 0

    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      x = clientX
      y = clientY
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        el.style.transform = `translate(${x - 60}px, ${y - 60}px)`
      })
    }

    const onEnter = () => setVisible(true)
    const onLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerenter', onEnter)
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      document.documentElement.removeEventListener('pointerenter', onEnter)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-0 w-[120px] h-[120px] rounded-full transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        background: 'radial-gradient(circle, rgba(110,140,255,0.18) 0%, transparent 70%)',
        filter: 'blur(24px)',
        willChange: 'transform',
      }}
    />
  )
}
