import { google } from 'googleapis'
import { buildTimeRange } from './timeUtils.js'

export const SHOP_TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
]

type BusyPeriod = { start: string; end: string }

function parsePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined

  let key = raw.trim().replace(/^["']|["']$/g, '')
  key = key.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  return key.length > 0 ? key : undefined
}

export function getAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim()
  const privateKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY)

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Calendar credentials (GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY)')
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  })
}

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_ID?.trim() &&
    process.env.GOOGLE_CLIENT_EMAIL?.trim() &&
    process.env.GOOGLE_PRIVATE_KEY?.trim()
  )
}

function getShopCalendarId(): string {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim()
  if (!calendarId) {
    throw new Error('Missing GOOGLE_CALENDAR_ID')
  }
  return calendarId
}

function getCalendarClient() {
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

export async function getBusyPeriods(date: string): Promise<BusyPeriod[]> {
  const calendarId = getShopCalendarId()
  const { start, end } = buildDayRange(date)
  const calendar = getCalendarClient()

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      timeZone: 'America/Los_Angeles',
      items: [{ id: calendarId }],
    },
  })

  const busy = res.data.calendars?.[calendarId]?.busy ?? []

  return busy.filter(
    (period): period is BusyPeriod =>
      typeof period.start === 'string' && typeof period.end === 'string'
  )
}

export async function getAvailableSlots(
  date: string,
  durationMinutes: number
): Promise<string[]> {
  if (!isCalendarConfigured()) {
    return [...SHOP_TIME_SLOTS]
  }

  const busy = await getBusyPeriods(date)

  return SHOP_TIME_SLOTS.filter((time) => {
    const { start, end } = buildTimeRange(date, time, durationMinutes)
    return !busy.some((period) => overlaps(start, end, period))
  })
}

export async function isSlotAvailable(
  date: string,
  time: string,
  durationMinutes: number
): Promise<boolean> {
  if (!isCalendarConfigured()) {
    return true
  }

  const slots = await getAvailableSlots(date, durationMinutes)
  return slots.includes(time)
}
