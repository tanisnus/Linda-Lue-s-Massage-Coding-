type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitGlobal = typeof globalThis & {
  __bookingRateLimits?: Map<string, RateLimitEntry>
}

const DEFAULT_MAX_REQUESTS = 5
const DEFAULT_WINDOW_MS = 15 * 60 * 1000

function getEnvNumber(name: string, fallback: number): number {
  const raw = process.env[name]?.trim()
  if (!raw) return fallback
  const value = Number(raw)
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function getRateLimitStore(): Map<string, RateLimitEntry> {
  const globalStore = globalThis as RateLimitGlobal
  if (!globalStore.__bookingRateLimits) {
    globalStore.__bookingRateLimits = new Map()
  }
  return globalStore.__bookingRateLimits
}

export function getClientIp(
  headers: Record<string, string | string[] | undefined>
): string {
  const forwarded = headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(',')[0]?.trim() || 'unknown'
  }

  const realIp = headers['x-real-ip']
  if (typeof realIp === 'string' && realIp.length > 0) {
    return realIp
  }

  return 'unknown'
}

export function checkBookingRateLimit(clientIp: string): {
  allowed: true
} | {
  allowed: false
  retryAfterSeconds: number
} {
  const maxRequests = getEnvNumber('BOOKING_RATE_LIMIT_MAX', DEFAULT_MAX_REQUESTS)
  const windowMs = getEnvNumber('BOOKING_RATE_LIMIT_WINDOW_MS', DEFAULT_WINDOW_MS)
  const now = Date.now()
  const key = `booking:${clientIp}`
  const store = getRateLimitStore()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    }
  }

  entry.count += 1
  store.set(key, entry)
  return { allowed: true }
}
