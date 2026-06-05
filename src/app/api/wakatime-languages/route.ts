import { NextResponse } from 'next/server'

export const revalidate = 300

function wakatimeHeaders() {
  const key = process.env.WAKATIME_API_KEY!
  return {
    Authorization: 'Basic ' + Buffer.from(key + ':').toString('base64'),
    Accept: 'application/json',
  }
}

export async function GET() {
  const key = process.env.WAKATIME_API_KEY
  if (!key) return NextResponse.json({ error: 'Missing WAKATIME_API_KEY' }, { status: 500 })

  const today = new Date().toISOString().split('T')[0]
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const url = `https://wakatime.com/api/v1/users/current/summaries?start=${lastWeek}&end=${today}`

  try {
    const res = await fetch(url, { headers: wakatimeHeaders() })
    if (!res.ok) return NextResponse.json({ error: 'WakaTime error' }, { status: res.status })
    const data = await res.json()

    const totals: Record<string, number> = {}
    for (const day of data.data ?? []) {
      for (const lang of day.languages ?? []) {
        totals[lang.name] = (totals[lang.name] ?? 0) + (lang.total_seconds ?? 0)
      }
    }

    const sorted = Object.entries(totals)
      .map(([name, seconds]) => ({ name, seconds }))
      .sort((a, b) => b.seconds - a.seconds)
      .slice(0, 8)

    return NextResponse.json(sorted)
  } catch (err) {
    console.error('[wakatime-languages]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
