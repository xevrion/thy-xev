'use client'

import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Mail } from 'lucide-react'

const contacts = [
  { icon: <Mail className="w-5 h-5" />,        text: 'me@xevrion.dev',                 url: 'mailto:me@xevrion.dev' },
  { icon: <FaGithub className="w-5 h-5" />,    text: 'github.com/xevrion',              url: 'https://github.com/xevrion' },
  { icon: <FaLinkedin className="w-5 h-5" />,  text: 'linkedin.com/in/yash-bavadiya',   url: 'https://www.linkedin.com/in/yash-bavadiya/' },
  { icon: <FaTwitter className="w-5 h-5" />,   text: 'twitter.com/xevrion',             url: 'https://x.com/xevrion_the1' },
]

export const Contact = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10 border-t border-battleship-gray/15">
      <p className="text-xs font-mono font-medium tracking-widest text-[var(--color-text-muted)]/60 uppercase">Contact</p>

      <div className="max-w-2xl">
        <p className="text-[var(--color-text)] sg-bold text-2xl sm:text-3xl leading-snug mb-2">
          Got something worth building?
        </p>
        <p className="text-[var(--color-text-muted)] sg-regular text-base">
          Always open for collaborations, new ideas, or just a friendly chat.
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-md">
        {contacts.map((c, idx) => (
          <a
            key={idx}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 border border-battleship-gray/20 text-[var(--color-text)] hover:border-soft-royal-blue hover:text-soft-royal-blue transition-colors duration-200"
          >
            {c.icon}
            <span className="sg-regular text-sm truncate">{c.text}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Contact
