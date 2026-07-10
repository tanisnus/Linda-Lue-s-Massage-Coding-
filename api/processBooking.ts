import { Resend } from 'resend'
import {
  clientConfirmationEmail,
  staffNotificationEmail,
  type BookingPayload,
} from './templates'

export type BookingResult =
  | { success: true }
  | { success: false; error: string; status: number }

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim()
  if (!value) return undefined
  return value.replace(/^["']|["']$/g, '')
}

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

export async function processBooking(body: unknown): Promise<BookingResult> {
  const apiKey = getEnv('RESEND_API_KEY')
  const fromEmail = getEnv('RESEND_FROM_EMAIL')
  const therapistEmail = getEnv('THERAPIST_EMAIL')
  const shopEmail = getEnv('SHOP_EMAIL')

  if (!apiKey || !fromEmail || !therapistEmail || !shopEmail) {
    console.error('Missing server environment variables')
    return {
      success: false,
      status: 500,
      error: 'Email service is not configured. Check environment variables in .env.local or Vercel.',
    }
  }

  let booking: unknown = body
  if (typeof booking === 'string') {
    try {
      booking = JSON.parse(booking)
    } catch {
      return { success: false, status: 400, error: 'Invalid JSON body' }
    }
  }

  if (!validatePayload(booking)) {
    return { success: false, status: 400, error: 'Invalid booking data' }
  }

  try {
    const resend = new Resend(apiKey)
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
      return { success: false, status: 500, error: clientResult.error.message }
    }

    if (staffResult.error) {
      console.error('Staff email error:', staffResult.error)
      return { success: false, status: 500, error: staffResult.error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending booking emails:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, status: 500, error: `Failed to send booking emails: ${message}` }
  }
}
