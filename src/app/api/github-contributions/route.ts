import { NextResponse } from 'next/server'

export const revalidate = 3600 // cache 1 hour

const GITHUB_QUERY = `
  query {
    user(login: "xevrion") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`

export async function GET() {
  const token = process.env.GITHUB_PAT
  if (!token) return NextResponse.json({ error: 'Missing GITHUB_PAT' }, { status: 500 })

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: GITHUB_QUERY }),
    })

    if (!res.ok) return NextResponse.json({ error: 'GitHub API error' }, { status: res.status })

    const data = await res.json()
    const calendar =
      data?.data?.user?.contributionsCollection?.contributionCalendar

    if (!calendar) return NextResponse.json({ error: 'Unexpected GitHub response' }, { status: 500 })

    return NextResponse.json(calendar)
  } catch (err) {
    console.error('[github-contributions]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
