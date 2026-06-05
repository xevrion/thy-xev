import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VIEWS_FILE = path.join(process.env.DATA_DIR ?? process.cwd(), 'views.json')
const RATE_WINDOW_MS = 10 * 60 * 1000
const ipRateLimit = new Map<string, Record<string, number>>()

function readViews(): Record<string, number> {
  try {
    if (!fs.existsSync(VIEWS_FILE)) return {}
    return JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

function writeViews(data: Record<string, number>) {
  fs.writeFileSync(VIEWS_FILE, JSON.stringify(data, null, 2))
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }
  const views = readViews()
  return NextResponse.json({ slug, views: views[slug] ?? 0 })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  const now = Date.now()
  const ipMap = ipRateLimit.get(ip) ?? {}
  const last = ipMap[slug] ?? 0

  const views = readViews()

  if (now - last < RATE_WINDOW_MS) {
    return NextResponse.json({ slug, views: views[slug] ?? 0, counted: false })
  }

  ipMap[slug] = now
  ipRateLimit.set(ip, ipMap)

  views[slug] = (views[slug] ?? 0) + 1
  writeViews(views)

  return NextResponse.json({ slug, views: views[slug], counted: true })
}
