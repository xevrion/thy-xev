import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Caveat } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NavBar } from '@/components/NavBar'
import { CommandPalette } from '@/components/CommandPalette'
import { MouseGlow } from '@/components/MouseGlow'
import { JsonLd } from '@/components/JsonLd'
import Footer from '@/components/Footer'
import { SectionDivider } from '@/components/SectionDivider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
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
        <NuqsAdapter>
        <ThemeProvider>
          {/* Outer grid pattern — visible only outside content area */}
          <div
            className="pointer-events-none fixed inset-0 z-[998] hidden xl:block"
            style={{
              backgroundImage: 'linear-gradient(to right, var(--grid-line) 0.5px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 0.5px, transparent 1px)',
              backgroundSize: '80px 80px',
              WebkitMaskImage: 'linear-gradient(to right, black 0%, black calc(50% - 576px), transparent calc(50% - 576px), transparent calc(50% + 576px), black calc(50% + 576px), black 100%)',
              maskImage: 'linear-gradient(to right, black 0%, black calc(50% - 576px), transparent calc(50% - 576px), transparent calc(50% + 576px), black calc(50% + 576px), black 100%)',
            }}
          />
          {/* Vertical content border lines */}
          <div className="pointer-events-none fixed inset-y-0 z-[999] hidden xl:block w-px bg-battleship-gray/15" style={{ left: 'calc(50% - 576px)' }} />
          <div className="pointer-events-none fixed inset-y-0 z-[999] hidden xl:block w-px bg-battleship-gray/15" style={{ left: 'calc(50% + 576px)' }} />
          <JsonLd type="person" />
          <JsonLd type="website" />
          <MouseGlow />
          <CommandPalette />
          <NavBar />
          <SectionDivider />
          <main>{children}</main>
          <SectionDivider />
          <Footer />
        </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
