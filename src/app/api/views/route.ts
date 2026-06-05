import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VIEWS_FILE = path.join(process.env.DATA_DIR ?? process.cwd(), 'views.json')

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

export async function GET() {
  const views = readViews()
  return NextResponse.json({ total: views['__total__'] ?? 0 })
}

export async function POST() {
  const views = readViews()
  views['__total__'] = (views['__total__'] ?? 0) + 1
  writeViews(views)
  return NextResponse.json({ total: views['__total__'], counted: true })
}
