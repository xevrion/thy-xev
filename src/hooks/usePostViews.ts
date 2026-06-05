import { useState, useEffect } from 'react'

export function usePostViews(slug: string, increment = false) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    if (!slug) return
    const method = increment ? 'POST' : 'GET'
    fetch(`/api/views/${slug}`, { method })
      .then((r) => r.json())
      .then((d) => setViews(d.views ?? null))
      .catch(() => {})
  }, [slug, increment])

  return views
}
