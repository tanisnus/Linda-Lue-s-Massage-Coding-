import { Resend } from 'resend'
import { verifyCancelToken } from './bookingToken.js'
import {
  clientCancellationEmail,
  staffCancellationEmail,
} from './templates.js'

export type CancelBookingResult =
  | { success: true; booking: CancelPreview }
  | { success: false; error: string; status: number }

export type CancelPreview = {
  client_name: string
  service_type: string
  appointment_date: string
  appointment_time: string
  therapist_name: string
}

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim()
  if (!value) return undefined
  return value.replace(/^["']|["']$/g, '')
}

function getStaffRecipients(shopEmail: string, therapistEmail: string): string[] {
  return [...new Set([shopEmail, therapistEmail])]
}

function toPreview(payload: ReturnType<typeof verifyCancelToken>): CancelPreview {
  return {
    client_name: payload!.client_name,
    service_type: payload!.service_type,
    appointment_date: payload!.appointment_date,
    appointment_time: payload!.appointment_time,
    therapist_name: payload!.therapist_name || 'Not specified',
  }
}

export function getCancelPreview(token: string): CancelBookingResult {
  const payload = verifyCancelToken(token)
  if (!payload) {
    return { success: false, status: 400, error: 'Invalid or expired cancellation link.' }
  }

  return { success: true, booking: toPreview(payload) }
}

export async function processCancelBooking(token: string): Promise<CancelBookingResult> {
  const payload = verifyCancelToken(token)
  if (!payload) {
    return { success: false, status: 400, error: 'Invalid or expired cancellation link.' }
  }

  const apiKey = getEnv('RESEND_API_KEY')
  const fromEmail = getEnv('RESEND_FROM_EMAIL')
  const therapistEmail = getEnv('THERAPIST_EMAIL')
  const shopEmail = getEnv('SHOP_EMAIL')

  if (!apiKey || !fromEmail || !therapistEmail || !shopEmail) {
    return {
      success: false,
      status: 500,
      error: 'Email service is not configured. Check environment variables in .env.local or Vercel.',
    }
  }

  try {
    const { deleteBookingEvent } = await import('./calendarService.js')

    if (payload.eventId) {
      try {
        await deleteBookingEvent(payload.eventId)
      } catch (calendarError) {
        console.error('Calendar cancellation failed:', calendarError)
        const message = calendarError instanceof Error ? calendarError.message : 'Unknown error'
        return {
          success: false,
          status: 500,
          error: `Could not remove appointment from the shop calendar: ${message}`,
        }
      }
    }

    const resend = new Resend(apiKey)
    const clientEmail = clientCancellationEmail(payload)
    const staffEmail = staffCancellationEmail(payload)
    const staffRecipients = getStaffRecipients(shopEmail, therapistEmail)

    const [clientResult, staffResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: payload.client_email,
        subject: clientEmail.subject,
        html: clientEmail.html,
      }),
      resend.emails.send({
        from: fromEmail,
        to: staffRecipients,
        subject: staffEmail.subject,
        html: staffEmail.html,
      }),
    ])

    if (clientResult.error) {
      console.error('Client cancellation email error:', clientResult.error)
      return { success: false, status: 500, error: clientResult.error.message }
    }

    if (staffResult.error) {
      console.error('Staff cancellation email error:', staffResult.error)
      return { success: false, status: 500, error: staffResult.error.message }
    }

    return { success: true, booking: toPreview(payload) }
  } catch (error) {
    console.error('Error cancelling booking:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, status: 500, error: `Failed to cancel appointment: ${message}` }
  }
}
