'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../lib/utils'

type LinkPreviewProps = {
  children: React.ReactNode
  url: string
  className?: string
  width?: number
  height?: number
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
)

export const LinkPreview = ({
  children,
  url,
  className,
  width = 256,
  height = 160,
  isStatic = false,
  imageSrc = '',
}: LinkPreviewProps) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [cursor, setCursor] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    setIsMounted(true)
    const check = () => setIsMobile('ontouchstart' in window || window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY })
  }

  const previewWidth = width
  const offsetX = 16
  const offsetY = 16

  const getPosition = () => {
    let x = cursor.x + offsetX
    let y = cursor.y + offsetY
    if (x + previewWidth > window.innerWidth - 8) x = cursor.x - previewWidth - offsetX
    return { x, y }
  }

  const pos = getPosition()

  if (isMobile) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cn('text-[var(--color-text)]', className)}>
        {children}
      </a>
    )
  }

  const src = isStatic
    ? imageSrc
    : `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.isMobile=true&viewport.deviceScaleFactor=1&viewport.width=${width * 3}&viewport.height=${height * 3}`

  return (
    <>
      {isMounted && (
        <div className="hidden">
          <img src={src} width={width} height={height} alt="" />
        </div>
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('text-[var(--color-text)] relative', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </a>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.12, ease: 'easeOut' } }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.08 } }}
            className="fixed z-[1000] pointer-events-none"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="p-1 bg-[var(--color-taupe)] border border-battleship-gray/30 shadow-2xl rounded-xl">
              <img
                src={src}
                width={width}
                height={height}
                className="rounded-lg block"
                alt="preview"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
