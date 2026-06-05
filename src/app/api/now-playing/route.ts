import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!

export const runtime = 'nodejs'
export const revalidate = 0

async function getAccessToken() {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN,
  })
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })
  const data = await res.json()
  return data.access_token as string
}

export async function GET() {
  if (!REFRESH_TOKEN) {
    return NextResponse.json({ isPlaying: false, message: 'Not authenticated' })
  }

  try {
    const accessToken = await getAccessToken()

    const nowRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (nowRes.status === 200) {
      const data = await nowRes.json()
      if (data?.item) {
        const track = data.item
        return NextResponse.json({
          isPlaying: true,
          title: track.name,
          artist: track.artists.map((a: { name: string }) => a.name).join(', '),
          album: track.album.name,
          albumArt: track.album.images?.[0]?.url,
          songUrl: track.external_urls.spotify,
        })
      }
    }

    // Fallback: recently played
    const recentRes = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    const recentData = await recentRes.json()
    const last = recentData.items?.[0]?.track

    return NextResponse.json({
      isPlaying: false,
      title: last.name,
      artist: last.artists.map((a: { name: string }) => a.name).join(', '),
      albumArt: last.album.images?.[0]?.url,
      songUrl: last.external_urls.spotify,
    })
  } catch (err) {
    console.error('[now-playing]', err)
    return NextResponse.json({ error: 'Failed to fetch playback' }, { status: 500 })
  }
}
