'use client'

import { useEffect, useRef } from 'react'

const settings = {
  minWind: 0.4,
  maxWind: 2,
  minSize: 3,
  maxSize: 9,
  emitterY: 0.35,
  emitterSpread: 1.1,
  gravity: 0.15,
  turbulence: 0.4,
  particleCount: 28,
  direction: 1,
}

const cache = {
  minSize: 0,
  maxSize: 0,
  minWind: 0,
  maxWind: 0,
}

function updateCache() {
  cache.minSize = Math.min(settings.minSize, settings.maxSize)
  cache.maxSize = Math.max(settings.minSize, settings.maxSize)
  cache.minWind = Math.min(settings.minWind, settings.maxWind)
  cache.maxWind = Math.max(settings.minWind, settings.maxWind)
}

function createParticleImage() {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const cx = 32
  const cy = 32
  const r = 24

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  gradient.addColorStop(0, 'rgba(110, 140, 255, 0.9)')
  gradient.addColorStop(0.4, 'rgba(110, 140, 255, 0.35)')
  gradient.addColorStop(1, 'rgba(110, 140, 255, 0)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()

  const img = new Image()
  img.src = canvas.toDataURL()
  return img
}

export function BannerParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let animationFrameId: number
    let isUnmounted = false

    updateCache()
    const particleImage = createParticleImage()
    if (!particleImage) return

    class Particle {
      x = 0
      y = 0
      size = 0
      windFactor = 0
      vx = 0
      vy = 0
      waveOffset = 0
      alpha = 0

      constructor(initOnScreen = false) {
        this.reset(initOnScreen)
      }

      reset(initOnScreen = false) {
        this.size = cache.minSize + Math.random() * (cache.maxSize - cache.minSize)

        const centerY = height * settings.emitterY
        const spreadHeight = height * settings.emitterSpread
        const minY = centerY - spreadHeight / 2
        const maxY = centerY + spreadHeight / 2
        this.y = minY + Math.random() * (maxY - minY)

        if (initOnScreen) {
          this.x = Math.random() * width
        } else {
          this.x =
            settings.direction === -1
              ? width + this.size + Math.random() * width
              : -this.size - Math.random() * width
        }

        const sizeFactor = (this.size - cache.minSize) / (cache.maxSize - cache.minSize || 1)
        this.windFactor = Math.max(0.1, Math.min(1, 1 - (sizeFactor * 0.5 + Math.random() * 0.5)))

        this.vx = 0
        this.vy = 0
        this.waveOffset = Math.random() * Math.PI * 2
        this.alpha = 0.25 + Math.random() * 0.4
      }

      update() {
        const targetSpeed = cache.minWind + (cache.maxWind - cache.minWind) * this.windFactor
        this.vx += (targetSpeed - this.vx) * 0.08
        this.x += this.vx * settings.direction

        const wave = Math.sin(this.x * 0.008 * settings.direction + this.waveOffset)
        this.vy += wave * settings.turbulence * 0.04
        this.vy += settings.gravity * 0.02
        this.vy *= 0.98
        this.y += this.vy

        const buffer = 100
        const outByX = settings.direction === -1 ? this.x < -buffer : this.x > width + buffer
        if (outByX || this.y > height + buffer || this.y < -buffer) {
          this.reset(false)
        }
      }

      draw() {
        if (!ctx || !particleImage) return
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.drawImage(particleImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
        ctx.restore()
      }
    }

    let particles: Particle[] = []

    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        width = canvas.width = parent.clientWidth
        height = canvas.height = parent.clientHeight
      }
    }

    const initParticles = () => {
      particles = []
      for (let i = 0; i < settings.particleCount; i++) {
        particles.push(new Particle(Math.random() > 0.5))
      }
    }

    const animate = () => {
      if (isUnmounted) return
      ctx.clearRect(0, 0, width, height)
      for (const particle of particles) {
        particle.update()
        particle.draw()
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    setTimeout(() => {
      if (isUnmounted) return
      resize()
      initParticles()
      animate()
    }, 0)

    window.addEventListener('resize', resize)

    return () => {
      isUnmounted = true
      window.removeEventListener('resize', resize)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}
