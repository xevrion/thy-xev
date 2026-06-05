import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function usePostViews(slug: string, increment = false) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    if (!slug || !API_URL) return
    const method = increment ? 'POST' : 'GET'
    fetch(`${API_URL}/views/${slug}`, { method })
      .then((r) => r.json())
      .then((d) => setViews(d.views ?? null))
      .catch(() => {})
  }, [slug, increment])

  return views
}
