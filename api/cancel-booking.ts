import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getCancelPreview, processCancelBooking } from '../server/processCancelBooking.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const token = String(req.query.token ?? '')
      if (!token) {
        return res.status(400).json({ success: false, error: 'Missing cancellation token' })
      }

      const result = getCancelPreview(token)
      if (result.success === false) {
        return res.status(result.status).json({ success: false, error: result.error })
      }

      return res.status(200).json({ success: true, booking: result.booking })
    }

    if (req.method === 'POST') {
      let body: unknown = req.body
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body)
        } catch {
          return res.status(400).json({ success: false, error: 'Invalid JSON body' })
        }
      }

      const token = typeof body === 'object' && body !== null && 'token' in body
        ? String((body as { token: unknown }).token ?? '')
        : ''

      if (!token) {
        return res.status(400).json({ success: false, error: 'Missing cancellation token' })
      }

      const result = await processCancelBooking(token)
      if (result.success === false) {
        return res.status(result.status).json({ success: false, error: result.error })
      }

      return res.status(200).json({ success: true, booking: result.booking })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('Unhandled cancel booking API error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ success: false, error: message })
  }
}
