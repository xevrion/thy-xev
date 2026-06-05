import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NavBar } from '@/components/NavBar'
import { CommandPalette } from '@/components/CommandPalette'
import { MouseGlow } from '@/components/MouseGlow'
import './globals.css'

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
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@xevrion_the1',
    images: ['/android-chrome-512x512.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <MouseGlow />
          <CommandPalette />
          <NavBar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
