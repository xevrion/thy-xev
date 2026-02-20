import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaDiscord, FaGithub, FaInstagram, FaLinkedin, FaSpotify } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

gsap.registerPlugin(ScrollTrigger)

export default function Socials() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const urls = [
    'https://github.com/xevrion',
    'https://instagram.com/yashbavadiya',
    'https://linkedin.com/in/yash-bavadiya-a598a224b',
    'https://discord.com/users/1121919048465268756',
    'https://open.spotify.com/user/7s6e62y95ur6d0nsmv9gj1369',
    'https://x.com/xevrion_the1'
  ]

  const Icons = [FaGithub, FaInstagram, FaLinkedin, FaDiscord, FaSpotify, FaXTwitter]

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
    <div ref={containerRef} className='flex gap-4 justify-center'>
      {Icons.map((Icon, i) => (
        <a
          key={i}
          target='_blank'
          rel='noopener noreferrer'
          href={urls[i]}
          className='inline-block'
        >
          <Icon className='social-icon w-8 h-8 text-[#bcb8b1] hover:rotate-15 hover:scale-[1.1] transition-all duration-250' />
        </a>
      ))}
    </div>
  )
}
