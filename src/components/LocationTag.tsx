'use client'

import { useState, useEffect, useReducer } from 'react'

// const LOCATION = { city: 'Jodhpur', country: 'India', timezone: 'Asia/Kolkata' }
const LOCATION = { city: 'Surat', country: 'India', timezone: 'Asia/Kolkata' }

function getTargetOffsetMinutes(timezone: string, now: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).formatToParts(now)

  const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? '0')
  const targetDate = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return Math.round((targetDate - now.getTime()) / 60000)
}

interface Props {
  city?: string
  country?: string
  timezone?: string
}

export function LocationTag({ city = LOCATION.city, country = LOCATION.country, timezone = LOCATION.timezone }: Props) {
  const [isActive, setIsActive] = useState(false)
  const [{ currentTime, offset }, dispatch] = useReducer(
    (_: { currentTime: string; offset: string }, action: { currentTime: string; offset: string }) => action,
    { currentTime: '', offset: '' }
  )

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const time = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true, timeZone: timezone,
      }).format(now)

      const localOffsetMins = -now.getTimezoneOffset()
      const targetOffsetMins = getTargetOffsetMinutes(timezone, now)
      const diffHrs = Math.round((targetOffsetMins - localOffsetMins) / 60)
      const off = diffHrs === 0 ? 'IST' : diffHrs > 0 ? `+${diffHrs}h from you` : `${diffHrs}h from you`

      dispatch({ currentTime: time, offset: off })
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [timezone])

  return (
    <button
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onClick={() => setIsActive((p) => !p)}
      className="inline-flex items-center gap-2.5 rounded-full border border-battleship-gray/25 px-4 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors duration-300 hover:border-battleship-gray/50 hover:text-[var(--color-text)] cursor-default select-none"
    >
      {/* Pinging dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>

      {/* Sliding text */}
      <span className="relative h-[1.25rem] overflow-hidden min-w-[8rem]">
        <span
          className="block transition-[transform,opacity] duration-500"
          style={{ transform: isActive ? 'translateY(-100%)' : 'translateY(0)', opacity: isActive ? 0 : 1 }}
        >
          {city}, {country}
        </span>
        <span
          className="absolute left-0 top-0 flex items-center gap-1 transition-[transform,opacity] duration-500"
          style={{ transform: isActive ? 'translateY(0)' : 'translateY(100%)', opacity: isActive ? 1 : 0 }}
        >
          {currentTime}
          {offset && <span className="text-xs text-[var(--color-text-subtle)] font-normal">· {offset}</span>}
        </span>
      </span>
    </button>
  )
}
