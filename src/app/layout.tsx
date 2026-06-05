import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Caveat } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NavBar } from '@/components/NavBar'
import { CommandPalette } from '@/components/CommandPalette'
import { MouseGlow } from '@/components/MouseGlow'
import { JsonLd } from '@/components/JsonLd'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://xevrion.dev'),
  title: {
    default: 'Xevrion — Full Stack Developer',
    template: '%s | Xevrion',
  },
  description: 'Computer Science student from IIT Jodhpur passionate about programming, design, and building creative projects.',
  authors: [{ name: 'Yash Bavadiya', url: 'https://xevrion.dev' }],
  creator: 'Xevrion',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://xevrion.dev',
    siteName: 'Xevrion',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@xevrion_the1',
    images: ['/og'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${caveat.variable}`}>
      <body>
        <ThemeProvider>
          {/* Decorative diagonal stripe borders */}
          <div
            className="pointer-events-none fixed inset-y-0 z-[999] hidden w-[60px] overflow-hidden xl:block"
            style={{ left: 'calc(50% - 576px - 60px)' }}
          >
            <div
              className="absolute inset-0 h-full w-[60px] border border-[var(--color-battleship-gray)] opacity-[0.15]"
              style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 2px, var(--color-battleship-gray) 2px, var(--color-battleship-gray) 3px, transparent 3px, transparent 6px)' }}
            />
          </div>
          <div
            className="pointer-events-none fixed inset-y-0 z-[999] hidden w-[60px] overflow-hidden xl:block"
            style={{ left: 'calc(50% + 576px)' }}
          >
            <div
              className="absolute inset-0 h-full w-[60px] border border-[var(--color-battleship-gray)] opacity-[0.15]"
              style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 2px, var(--color-battleship-gray) 2px, var(--color-battleship-gray) 3px, transparent 3px, transparent 6px)' }}
            />
          </div>
          <JsonLd type="person" />
          <JsonLd type="website" />
          <MouseGlow />
          <CommandPalette />
          <NavBar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
