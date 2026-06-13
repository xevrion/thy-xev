'use client'

import { useEffect, useState } from 'react'

const quotes = [
  {
    quote: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    quote: "We suffer more in imagination than in reality.",
    author: "Seneca",
  },
  {
    quote: "Make the best use of what is in your power, and take the rest as it happens.",
    author: "Epictetus",
  },
  {
    quote: "No man is free who is not master of himself.",
    author: "Epictetus",
  },
  {
    quote: "Premature optimization is the root of all evil.",
    author: "Donald Knuth",
  },
  {
    quote: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    author: "Brian W. Kernighan",
  },
  {
    quote: "The first principle is that you must not fool yourself — and you are the easiest person to fool.",
    author: "Richard Feynman",
  },
  {
    quote: "Simplicity is a prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
  },
  {
    quote: "You don't have enemies. Nobody in this entire world deserves to get hurt.",
    author: "Thors, Vinland Saga",
  },
  {
    quote: "Kira is childish and he hates losing... I am also childish and I hate to lose. That's how I know.",
    author: "L Lawliet, Death Note",
  },
  {
    quote: "Gon, you are light. Sometimes you shine so brightly, I must look away.",
    author: "Killua Zoldyck, Hunter x Hunter",
  },
  {
    quote: "A true friend is one who stands equal to me in all respects — one who would never hesitate to fight me for his own dream.",
    author: "Griffith, Berserk",
  },
  {
    quote: "A goal is not always meant to be reached; it often serves simply as something to aim at.",
    author: "Bruce Lee",
  },
  {
    quote: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
    author: "Richard Feynman",
  },
]

export function Quote() {
  const [current, setCurrent] = useState<{ quote: string; author: string } | null>(null)

  useEffect(() => {
    setCurrent(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  if (!current) return null

  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
      <div className="relative border border-[var(--color-text-subtle)]/15 rounded-xl px-8 py-10 overflow-visible transition-colors duration-300 hover:border-soft-royal-blue/20">
        {/* big quote mark */}
        <svg
          aria-hidden="true"
          width="80"
          height="60"
          viewBox="0 0 105 78"
          className="absolute top-4 left-5 opacity-[0.07]"
          style={{ fill: 'var(--color-text)' }}
        >
          <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
        </svg>

        <p className="relative z-10 font-mono text-sm sm:text-base italic text-[var(--color-text-muted)] leading-relaxed">
          "{current.quote}"
        </p>
        <p className="mt-4 text-right font-mono text-xs text-[var(--color-soft-royal-blue)]">
          — {current.author}
        </p>
      </div>
    </div>
  )
}
