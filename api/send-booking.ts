import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import {
  clientConfirmationEmail,
  staffNotificationEmail,
  type BookingPayload,
} from './emails/templates'

const resend = new Resend(process.env.RESEND_API_KEY)

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePayload(body: unknown): body is BookingPayload {
  if (!body || typeof body !== 'object') return false
  const data = body as Record<string, unknown>
  return (
    typeof data.client_name === 'string' && data.client_name.length > 0 &&
    typeof data.client_email === 'string' && isValidEmail(data.client_email) &&
    typeof data.client_phone === 'string' &&
    typeof data.service_type === 'string' && data.service_type.length > 0 &&
    typeof data.service_price === 'string' &&
    typeof data.appointment_date === 'string' && data.appointment_date.length > 0 &&
    typeof data.appointment_time === 'string' && data.appointment_time.length > 0 &&
    typeof data.therapist_name === 'string' &&
    typeof data.special_requests === 'string' &&
    typeof data.calendar_link === 'string' && data.calendar_link.length > 0
  )
}


// Serverless functions (Vercel-specific)
// automatically wired up to a URL by the platform. No manual server setup, no explicit routing table; the file path is the route.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const therapistEmail = process.env.THERAPIST_EMAIL
  const shopEmail = process.env.SHOP_EMAIL

  if (!apiKey || !fromEmail || !therapistEmail || !shopEmail) {
    console.error('Missing server environment variables')
    return res.status(500).json({ success: false, error: 'Email service is not configured' })
  }

  if (!validatePayload(req.body)) {
    return res.status(400).json({ success: false, error: 'Invalid booking data' })
  }

  const booking = req.body

  try {
    const clientEmail = clientConfirmationEmail(booking)
    const staffEmail = staffNotificationEmail(booking)

    const [clientResult, staffResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: booking.client_email,
        subject: clientEmail.subject,
        html: clientEmail.html,
      }),
      resend.emails.send({
        from: fromEmail,
        to: therapistEmail,
        cc: shopEmail,
        subject: staffEmail.subject,
        html: staffEmail.html,
      }),
    ])

    if (clientResult.error) {
      console.error('Client email error:', clientResult.error)
      return res.status(500).json({ success: false, error: clientResult.error.message })
    }

    if (staffResult.error) {
      console.error('Staff email error:', staffResult.error)
      return res.status(500).json({ success: false, error: staffResult.error.message })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending booking emails:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ success: false, error: `Failed to send booking emails: ${message}` })
  }
}
