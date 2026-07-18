import type { VercelRequest, VercelResponse } from '@vercel/node'
import { processBooking } from '../server/processBooking.js'
import { checkBookingRateLimit, getClientIp } from '../server/rateLimit.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const clientIp = getClientIp(req.headers)
    const rateLimit = checkBookingRateLimit(clientIp)
    if (rateLimit.allowed === false) {
      res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds))
      return res.status(429).json({
        success: false,
        error: 'Too many booking attempts. Please wait a few minutes and try again.',
      })
    }

    const result = await processBooking(req.body)

    if (result.success === false) {
      return res.status(result.status).json({ success: false, error: result.error })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Unhandled booking API error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ success: false, error: message })
  }
}
