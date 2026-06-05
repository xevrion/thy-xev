import { NextResponse } from 'next/server'

export const revalidate = 300 // cache 5 min

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
  const url = `https://wakatime.com/api/v1/users/current/summaries?start=${today}&end=${today}`

  try {
    const res = await fetch(url, { headers: wakatimeHeaders() })
    if (!res.ok) return NextResponse.json({ error: 'WakaTime error' }, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[wakatime-daily]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
