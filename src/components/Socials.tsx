'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaDiscord, FaGithub, FaHeart, FaInstagram, FaLastfm, FaLinkedin, FaSpotify } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

gsap.registerPlugin(ScrollTrigger)

export default function Socials() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const urls = [
    'https://github.com/xevrion',
    'https://instagram.com/yashbavadiya',
    'https://linkedin.com/in/yash-bavadiya',
    'https://discord.com/users/1121919048465268756',
    'https://open.spotify.com/user/7s6e62y95ur6d0nsmv9gj1369',
    'https://www.last.fm/user/xevrion/',
    'https://x.com/xevrion_the1',
    'https://github.com/sponsors/xevrion'
  ]

  const Icons = [FaGithub, FaInstagram, FaLinkedin, FaDiscord, FaSpotify, FaLastfm, FaXTwitter, FaHeart]

  useEffect(() => {
    if (!containerRef.current) return
    const icons = containerRef.current.children
    gsap.from(icons, {
      opacity: 0,
      scale: 0,
      rotate: -45,
      stagger: 0.1,
      duration: 0.8,

      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        // markers: true,
        toggleActions: 'play none none none',

      }
    })
  }, [])

  return (
    <div ref={containerRef} className='flex gap-4 justify-start'>
      {Icons.map((Icon, i) => (
        <a
          key={i}
          target='_blank'
          rel='noopener noreferrer'
          href={urls[i]}
          title={i === Icons.length - 1 ? 'Sponsor me on GitHub' : undefined}
          className='inline-block'
        >
          <Icon
            className={`social-icon w-8 h-8 text-[var(--color-text)] hover:rotate-15 hover:scale-[1.1] transition-all duration-250 ${
              i === Icons.length - 1 ? 'hover:text-pink-500' : ''
            }`}
          />
        </a>
      ))}
    </div>
  )
}
