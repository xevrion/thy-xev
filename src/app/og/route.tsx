import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { siteConfig } from '@/lib/site'

export const runtime = 'edge'

const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max - 1).trimEnd() + '…' : str

function param(params: URLSearchParams, key: string, fallback: string, max: number) {
  return truncate(params.get(key) ?? fallback, max)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const title = param(searchParams, 'title', siteConfig.role, 80)
    const description = param(
      searchParams,
      'description',
      siteConfig.description,
      120,
    )
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
            padding: '60px',
            backgroundColor: '#0a0a0f',
            fontFamily: 'sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Grid background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(94,122,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,122,255,0.06) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Radial glow */}
          <div
            style={{
              position: 'absolute',
              top: '-150px',
              right: '-150px',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(94,122,255,0.18) 0%, transparent 70%)',
            }}
          />

          {/* Top: breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1 }}>
            <span style={{ color: '#5e7aff', fontSize: '14px', fontWeight: 600 }}>
              {siteConfig.baseUrl.replace('https://', '')}
            </span>
            <span style={{ color: '#4a5568', fontSize: '14px' }}>/</span>
            <span style={{ color: '#718096', fontSize: '14px' }}>{path}</span>
          </div>

          {/* Middle: title + description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
            <h1
              style={{
                fontSize: title.length > 50 ? '42px' : '52px',
                fontWeight: 800,
                color: '#f0f0f0',
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '20px',
                color: '#8a9ab0',
                margin: 0,
                lineHeight: 1.5,
                maxWidth: '800px',
              }}
            >
              {description}
            </p>
          </div>

          {/* Bottom: tags + author */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: '1px solid rgba(94,122,255,0.4)',
                    color: '#5e7aff',
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: 'rgba(94,122,255,0.08)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#718096', fontSize: '15px' }}>{siteConfig.name}</span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#5e7aff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                X
              </div>
            </div>
          </div>
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
