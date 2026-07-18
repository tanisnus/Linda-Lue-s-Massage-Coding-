import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAvailableSlots, isCalendarConfigured, SHOP_TIME_SLOTS } from '../server/calendarService.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const date = String(req.query.date ?? '')
    const duration = Number(req.query.duration ?? 60)
    const therapist = String(req.query.therapist ?? '').trim()

    if (!date) {
      return res.status(400).json({ success: false, error: 'Missing date' })
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid duration' })
    }

    if (!isCalendarConfigured()) {
      return res.status(200).json({
        success: true,
        slots: SHOP_TIME_SLOTS,
        calendarEnabled: false,
      })
    }

    if (!therapist) {
      return res.status(200).json({
        success: true,
        slots: [],
        calendarEnabled: true,
      })
    }

    const slots = await getAvailableSlots(date, duration, therapist)

    return res.status(200).json({
      success: true,
      slots,
      calendarEnabled: true,
    })
  } catch (error) {
    console.error('Availability API error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ success: false, error: message })
  }
}
