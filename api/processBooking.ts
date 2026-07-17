import { Resend } from 'resend'
import { buildCancelLink } from './bookingToken.js'
import {
  clientConfirmationEmail,
  staffNotificationEmail,
  type BookingPayload,
} from './templates.js'

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

const COUPLE_MASSAGE_SERVICE = '60 Minutes Couple Massage'

function parseTherapistNames(therapistName: string): string[] {
  return therapistName
    .split(/\s*&\s*|,\s*/)
    .map((name) => name.trim())
    .filter(Boolean)
}

function validateCoupleTherapists(serviceType: string, therapistName: string): string | null {
  if (serviceType !== COUPLE_MASSAGE_SERVICE) {
    return null
  }

  const therapists = parseTherapistNames(therapistName)
  if (therapists.length !== 2) {
    return 'Couple massage requires two therapists'
  }

  if (new Set(therapists.map((name) => name.toLowerCase())).size !== 2) {
    return 'Couple massage requires two different therapists'
  }

  return null
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
    typeof data.calendar_link === 'string' && data.calendar_link.length > 0 &&
    typeof data.duration === 'string' && data.duration.length > 0
  )
}

function getStaffRecipients(shopEmail: string, therapistEmail: string): string[] {
  return [...new Set([shopEmail, therapistEmail])]
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

  const coupleTherapistError = validateCoupleTherapists(booking.service_type, booking.therapist_name)
  if (coupleTherapistError) {
    return { success: false, status: 400, error: coupleTherapistError }
  }

  const durationMinutes = parseInt(booking.duration, 10)
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return { success: false, status: 400, error: 'Invalid service duration' }
  }

  try {
    const { isSlotAvailable, isCalendarConfigured, createBookingEvent, formatTherapistsForCalendar } = await import('./calendarService.js')
    let calendarEventId: string | null = null

    if (isCalendarConfigured()) {
      try {
        const slotOpen = await isSlotAvailable(
          booking.appointment_date,
          booking.appointment_time,
          durationMinutes,
          formatTherapistsForCalendar(booking.therapist_name)
        )

        if (!slotOpen) {
          return {
            success: false,
            status: 409,
            error: 'That time slot was just booked. Please pick another time.',
          }
        }

        calendarEventId = await createBookingEvent(booking)
      } catch (calendarError) {
        console.error('Calendar booking failed:', calendarError)
        const message = calendarError instanceof Error ? calendarError.message : 'Unknown error'
        return {
          success: false,
          status: 500,
          error: `Could not add appointment to the shop calendar: ${message}`,
        }
      }
    }

    const bookingForEmail: BookingPayload = {
      ...booking,
      cancel_link: buildCancelLink({
        eventId: calendarEventId ?? '',
        client_email: booking.client_email,
        client_name: booking.client_name,
        client_phone: booking.client_phone,
        appointment_date: booking.appointment_date,
        appointment_time: booking.appointment_time,
        service_type: booking.service_type,
        service_price: booking.service_price,
        therapist_name: booking.therapist_name,
        duration: booking.duration,
      }),
    }

    const resend = new Resend(apiKey)
    const clientEmail = clientConfirmationEmail(bookingForEmail)
    const staffEmail = staffNotificationEmail(bookingForEmail)

    const staffRecipients = getStaffRecipients(shopEmail, therapistEmail)

    const [clientResult, staffResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: booking.client_email,
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
