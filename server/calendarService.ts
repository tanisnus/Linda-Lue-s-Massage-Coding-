import { google } from 'googleapis'
import { buildTimeRange, toCalendarDateTime } from './timeUtils.js'
import type { BookingPayload } from './templates.js'

export const SHOP_TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
]

type BusyPeriod = { start: string; end: string }

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim()
  if (!value) return undefined
  return value.replace(/^["']|["']$/g, '')
}

function parsePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined

  let key = raw.trim().replace(/^["']|["']$/g, '')
  key = key.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  return key.length > 0 ? key : undefined
}

export function getAuth() {
  const clientEmail = getEnv('GOOGLE_CLIENT_EMAIL')
  const privateKey = parsePrivateKey(getEnv('GOOGLE_PRIVATE_KEY'))

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Calendar credentials (GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY)')
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
}

export function isCalendarConfigured(): boolean {
  return Boolean(
    getEnv('GOOGLE_CALENDAR_ID') &&
    getEnv('GOOGLE_CLIENT_EMAIL') &&
    parsePrivateKey(getEnv('GOOGLE_PRIVATE_KEY'))
  )
}

function getShopCalendarId(): string {
  const calendarId = getEnv('GOOGLE_CALENDAR_ID')
  if (!calendarId) {
    throw new Error('Missing GOOGLE_CALENDAR_ID')
  }
  return calendarId
}

function getCalendarClient(): ReturnType<typeof google.calendar> {
  return google.calendar({ version: 'v3', auth: getAuth() })
}

function buildDayRange(date: string): { start: Date; end: Date } {
  const start = buildTimeRange(date, '10:00 AM', 0).start
  const end = buildTimeRange(date, '9:00 PM', 60).end
  return { start, end }
}

function overlaps(slotStart: Date, slotEnd: Date, busy: BusyPeriod): boolean {
  const busyStart = new Date(busy.start).getTime()
  const busyEnd = new Date(busy.end).getTime()
  return slotStart.getTime() < busyEnd && slotEnd.getTime() > busyStart
}

function getEventTherapists(description: string | null | undefined): string[] | null {
  if (!description) return null
  const match = description.match(/Therapists?:\s*(.+)/i)
  if (!match) return null

  return match[1]
    .split(/\s*&\s*|,\s*/)
    .map((name) => name.trim())
    .filter(Boolean)
}

function eventBlocksTherapist(
  description: string | null | undefined,
  therapistName: string
): boolean {
  const therapists = getEventTherapists(description)
  if (!therapists) {
    return true
  }

  const normalized = therapistName.trim().toLowerCase()
  return therapists.some((name) => name.toLowerCase() === normalized)
}

export function parseTherapistList(therapistsParam: string): string[] {
  return therapistsParam
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
}

export function formatTherapistsForCalendar(therapistName: string): string {
  const names = therapistName
    .split(/\s*&\s*|,\s*/)
    .map((name) => name.trim())
    .filter(Boolean)

  return names.join(', ')
}

export async function getBusyPeriodsForTherapist(
  date: string,
  therapistName: string
): Promise<BusyPeriod[]> {
  const calendarId = getShopCalendarId()
  const { start, end } = buildDayRange(date)
  const calendar = getCalendarClient()

  const res = await calendar.events.list({
    calendarId,
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    timeZone: 'America/Los_Angeles',
    singleEvents: true,
  })

  const events = res.data.items ?? []
  const busy: BusyPeriod[] = []

  for (const event of events) {
    if (!eventBlocksTherapist(event.description ?? null, therapistName)) {
      continue
    }

    const eventStart = event.start?.dateTime ?? event.start?.date
    const eventEnd = event.end?.dateTime ?? event.end?.date

    if (typeof eventStart === 'string' && typeof eventEnd === 'string') {
      busy.push({ start: eventStart, end: eventEnd })
    }
  }

  return busy
}

export async function getAvailableSlots(
  date: string,
  durationMinutes: number,
  therapistsParam?: string
): Promise<string[]> {
  if (!isCalendarConfigured()) {
    return [...SHOP_TIME_SLOTS]
  }

  const therapists = parseTherapistList(therapistsParam ?? '')
  if (therapists.length === 0) {
    return []
  }

  let available = [...SHOP_TIME_SLOTS]

  for (const therapist of therapists) {
    const busy = await getBusyPeriodsForTherapist(date, therapist)
    available = available.filter((time) => {
      const { start, end } = buildTimeRange(date, time, durationMinutes)
      return !busy.some((period) => overlaps(start, end, period))
    })
  }

  return available
}

export async function isSlotAvailable(
  date: string,
  time: string,
  durationMinutes: number,
  therapistsParam: string
): Promise<boolean> {
  if (!isCalendarConfigured()) {
    return true
  }

  if (!parseTherapistList(therapistsParam).length) {
    return false
  }

  const slots = await getAvailableSlots(date, durationMinutes, therapistsParam)
  return slots.includes(time)
}

export async function createBookingEvent(booking: BookingPayload): Promise<string | null> {
  if (!isCalendarConfigured()) {
    return null
  }

  const durationMinutes = parseInt(booking.duration, 10)
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    throw new Error('Invalid service duration')
  }

  const calendarId = getShopCalendarId()
  const calendar = getCalendarClient()
  const { start, end, timeZone } = toCalendarDateTime(
    booking.appointment_date,
    booking.appointment_time,
    durationMinutes
  )

  const therapist = formatTherapistsForCalendar(booking.therapist_name || 'Not specified')
  const requests = booking.special_requests || 'None'

  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `${booking.service_type} - ${booking.client_name}`,
      description: [
        `Client: ${booking.client_name}`,
        `Email: ${booking.client_email}`,
        `Phone: ${booking.client_phone}`,
        `Service: ${booking.service_type} (${booking.service_price})`,
        `Therapist: ${therapist}`,
        `Special requests: ${requests}`,
        '',
        'Booked via lindalueswellnessandspa.com',
      ].join('\n'),
      location: '15147 Ventura Blvd, Sherman Oaks, CA 91403',
      start: { dateTime: start, timeZone },
      end: { dateTime: end, timeZone },
    },
  })

  return res.data.id ?? null
}

export async function deleteBookingEvent(eventId: string): Promise<void> {
  if (!isCalendarConfigured() || !eventId) {
    return
  }

  const calendarId = getShopCalendarId()
  const calendar = getCalendarClient()

  await calendar.events.delete({
    calendarId,
    eventId,
  })
}
