import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { siteConfig } from '@/lib/site'

export const runtime = 'edge'

// Your palette (dark mode values from globals.css)
const C = {
  bg: '#2e2a27',        // --color-taupe dark
  bgLight: '#3a3530',   // slightly lighter taupe for subtle depth
  silver: '#e0dedb',    // --color-silver (main text)
  gray: '#a6a19d',      // --color-battleship-gray
  grayDim: '#7a746e',   // muted text
  blue: '#6e8cff',      // --color-soft-royal-blue
  blueCrayola: '#4c6fff', // --color-blue-crayola
  border: 'rgba(166,161,157,0.15)', // battleship-gray at low opacity
}

const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max - 1).trimEnd() + '…' : str

function param(params: URLSearchParams, key: string, fallback: string, max: number) {
  return truncate(params.get(key) ?? fallback, max)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const title = param(searchParams, 'title', siteConfig.role, 80)
    const description = param(searchParams, 'description', siteConfig.description, 120)
    const path = param(searchParams, 'path', 'home', 60)
    const tags = (searchParams.get('tags')?.split(',').filter(Boolean) ?? [])
      .slice(0, 4)
      .map((t) => truncate(decodeURIComponent(t.trim()), 20))

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px',
            backgroundColor: C.bg,
            fontFamily: 'sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Diagonal stripe texture — matches your site's sidebar borders */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(166,161,157,0.04) 4px, rgba(166,161,157,0.04) 5px)',
            }}
          />

          {/* Soft blue glow — top-right, warm not harsh */}
          <div
            style={{
              position: 'absolute',
              top: '-200px',
              right: '-200px',
              width: '700px',
              height: '700px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(110,140,255,0.10) 0%, transparent 65%)',
            }}
          />

          {/* Warm bottom-left accent */}
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(166,161,157,0.06) 0%, transparent 70%)',
            }}
          />

          {/* Top: domain + breadcrumb path */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
            <span style={{ color: C.blue, fontSize: '15px', fontWeight: 600, letterSpacing: '0.01em' }}>
              {siteConfig.baseUrl.replace('https://', '')}
            </span>
            <span style={{ color: C.grayDim, fontSize: '15px' }}>/</span>
            <span style={{ color: C.grayDim, fontSize: '15px' }}>{path}</span>
          </div>

          {/* Middle: title + description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', zIndex: 1 }}>
            <div
              style={{
                fontSize: title.length > 50 ? '44px' : '56px',
                fontWeight: 700,
                color: C.silver,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '20px',
                color: C.gray,
                lineHeight: 1.55,
                maxWidth: '820px',
              }}
            >
              {description}
            </div>
          </div>

          {/* Bottom: tags left, author right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 1,
            }}
          >
            {/* Tags */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '4px',
                    border: `1px solid rgba(110,140,255,0.35)`,
                    color: C.blue,
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: 'rgba(110,140,255,0.07)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ color: C.silver, fontSize: '15px', fontWeight: 600 }}>
                  {siteConfig.handle}
                </span>
                <span style={{ color: C.grayDim, fontSize: '13px' }}>
                  {siteConfig.baseUrl.replace('https://', '')}
                </span>
              </div>
              {/* Circular avatar with X initial — your brand letter */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: `2px solid rgba(110,140,255,0.5)`,
                  backgroundColor: 'rgba(110,140,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: C.blue,
                }}
              >
                X
              </div>
            </div>
          </div>

          {/* Bottom border line — like your site's horizontal separator */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(to right, transparent, ${C.blue}, transparent)`,
            }}
          />
        </div>
      ),
      { width: 1200, height: 630 },
    )
  } catch (err) {
    console.error('[og]', err)
    return new Response('Failed to generate OG image', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
