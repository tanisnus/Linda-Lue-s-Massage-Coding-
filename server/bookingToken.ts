import { createHmac, timingSafeEqual } from 'crypto'

export type CancelTokenPayload = {
  eventId: string
  client_email: string
  client_name: string
  client_phone: string
  appointment_date: string
  appointment_time: string
  service_type: string
  service_price: string
  therapist_name: string
  duration: string
}

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim()
  if (!value) return undefined
  return value.replace(/^["']|["']$/g, '')
}

function getSigningSecret(): string {
  const secret = getEnv('BOOKING_CANCEL_SECRET') || getEnv('RESEND_API_KEY')
  if (!secret) {
    throw new Error('Missing BOOKING_CANCEL_SECRET or RESEND_API_KEY')
  }
  return secret
}

export function getSiteUrl(): string {
  return getEnv('BOOKING_SITE_URL') || 'https://www.lindalueswellnessandspa.com'
}

export function signCancelToken(payload: CancelTokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', getSigningSecret()).update(body).digest('base64url')
  return `${body}.${signature}`
}

export function verifyCancelToken(token: string): CancelTokenPayload | null {
  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expected = createHmac('sha256', getSigningSecret()).update(body).digest('base64url')

  try {
    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expected)
    if (sigBuffer.length !== expectedBuffer.length) return null
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null
  } catch {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as CancelTokenPayload
    if (
      typeof payload.client_email !== 'string' ||
      typeof payload.client_name !== 'string' ||
      typeof payload.appointment_date !== 'string' ||
      typeof payload.appointment_time !== 'string' ||
      typeof payload.service_type !== 'string'
    ) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export function buildCancelLink(payload: CancelTokenPayload): string {
  const token = signCancelToken(payload)
  return `${getSiteUrl()}/cancel-booking?token=${encodeURIComponent(token)}`
}
