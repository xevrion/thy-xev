'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function NotFound() {
  const svgRef = useRef<SVGSVGElement>(null)

  // Randomize the glitch animation timing on each mount so it never feels looped
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const digits = svg.querySelectorAll<SVGTextElement>('.glitch-digit')
    digits.forEach((el) => {
      const delay = (Math.random() * 1.5).toFixed(2)
      const dur = (2.5 + Math.random() * 2).toFixed(2)
      el.style.animationDelay = `${delay}s`
      el.style.animationDuration = `${dur}s`
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 select-none">
      {/* Glitch 404 */}
      <div aria-label="404 — page not found" className="relative">
        <svg
          ref={svgRef}
          viewBox="0 0 520 160"
          width="520"
          height="160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[min(520px,80vw)] h-auto overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <style>{`
              .glitch-digit {
                font-family: var(--font-space-grotesk), 'Space Grotesk', ui-sans-serif, sans-serif;
                font-size: 160px;
                font-weight: 800;
                letter-spacing: -0.04em;
                fill: currentColor;
                animation: glitch-jitter 3s infinite;
              }
              .glitch-ghost {
                font-family: var(--font-space-grotesk), 'Space Grotesk', ui-sans-serif, sans-serif;
                font-size: 160px;
                font-weight: 800;
                letter-spacing: -0.04em;
                animation: glitch-ghost-flicker 3s infinite;
              }
              @keyframes glitch-jitter {
                0%,  52%,  54%,  56%,  80%,  82%,  100% { transform: translate(0, 0);  opacity: 1; }
                53%                                       { transform: translate(-3px, 1px); opacity: 0.85; }
                55%                                       { transform: translate(2px, -1px); opacity: 0.9; }
                81%                                       { transform: translate(-2px, 2px); opacity: 0.8; }
              }
              @keyframes glitch-ghost-flicker {
                0%,  50%,  57%,  79%,  84%,  100% { opacity: 0; transform: translate(0, 0); }
                52%,  53%                          { opacity: 0.18; transform: translate(4px, 0); }
                80%, 81%                           { opacity: 0.12; transform: translate(-3px, 1px); }
              }
              @media (prefers-reduced-motion: reduce) {
                .glitch-digit, .glitch-ghost { animation: none !important; }
              }
            `}</style>
          </defs>

          {/* Ghost / chromatic aberration layer */}
          <text className="glitch-ghost" x="4" y="138" fill="var(--color-soft-royal-blue)">404</text>

          {/* Main digits — each animated independently */}
          <text className="glitch-digit" x="4"   y="138" fill="var(--color-battleship-gray)">4</text>
          <text className="glitch-digit" x="178" y="138" fill="var(--color-battleship-gray)">0</text>
          <text className="glitch-digit" x="346" y="138" fill="var(--color-battleship-gray)">4</text>
        </svg>

        {/* Thin scanline overlay — gives the "bad signal" feel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-sm"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
          }}
        />
      </div>

      {/* Copy */}
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="text-base font-mono text-[var(--color-battleship-gray)] opacity-70 tracking-wide">
          this page doesn't exist
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[var(--color-battleship-gray)]/25 bg-[var(--color-battleship-gray)]/6 text-sm font-medium text-[var(--color-battleship-gray)] hover:border-[var(--color-soft-royal-blue)]/50 hover:text-[var(--color-soft-royal-blue)] hover:bg-[var(--color-soft-royal-blue)]/6 transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M3 7L6.5 3.5M3 7L6.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          go home
        </Link>
      </div>
    </div>
  )
}
