import type { VercelRequest, VercelResponse } from '@vercel/node'
import { processBooking } from './lib/processBooking'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const result = await processBooking(req.body)

  if (result.success) {
    return res.status(200).json({ success: true })
  }

  return res.status(result.status).json({ success: false, error: result.error })
}
