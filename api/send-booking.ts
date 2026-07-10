import type { VercelRequest, VercelResponse } from '@vercel/node'
import { processBooking } from './processBooking'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const result = await processBooking(req.body)

    if (result.success) {
      return res.status(200).json({ success: true })
    }

    return res.status(result.status).json({ success: false, error: result.error })
  } catch (error) {
    console.error('Unhandled booking API error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ success: false, error: message })
  }
}
