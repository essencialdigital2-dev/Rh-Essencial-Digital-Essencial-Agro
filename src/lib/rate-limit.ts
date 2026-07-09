const store = new Map<string, { count: number; reset: number }>()

export function rateLimit(ip: string, max = 20, windowMs = 60_000): { ok: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.reset) {
    store.set(ip, { count: 1, reset: now + windowMs })
    return { ok: true, remaining: max - 1 }
  }

  entry.count++
  if (entry.count > max) return { ok: false, remaining: 0 }
  return { ok: true, remaining: max - entry.count }
}
