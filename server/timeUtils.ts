export const SPA_TIMEZONE = 'America/Los_Angeles'

export function toCalendarDateTime(
  date: string,
  time: string,
  durationMinutes: number
): { start: string; end: string; timeZone: string } {
  const { hour, minute } = parseTime12h(time)
  const endMinutes = hour * 60 + minute + durationMinutes
  const endHour = Math.floor(endMinutes / 60)
  const endMinute = endMinutes % 60
  const pad = (value: number) => String(value).padStart(2, '0')

  return {
    start: `${date}T${pad(hour)}:${pad(minute)}:00`,
    end: `${date}T${pad(endHour)}:${pad(endMinute)}:00`,
    timeZone: SPA_TIMEZONE,
  }
}

export function buildTimeRange(
  date: string,
  time: string,
  durationMinutes: number
): { start: Date; end: Date } {
  const { hour, minute } = parseTime12h(time)
  const start = toZonedDate(date, hour, minute, SPA_TIMEZONE)
  const end = new Date(start.getTime() + durationMinutes * 60_000)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error(`Invalid date/time: ${date} ${time}`)
  }

  return { start, end }
}

export function toRFC3339(date: Date): string {
  return date.toISOString()
}

function parseTime12h(time: string): { hour: number; minute: number } {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) {
    throw new Error(`Invalid time format: ${time}`)
  }

  const [, hourStr, minuteStr, meridian] = match
  let hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)

  if (meridian.toUpperCase() === 'PM' && hour !== 12) hour += 12
  if (meridian.toUpperCase() === 'AM' && hour === 12) hour = 0

  return { hour, minute }
}

function toZonedDate(
  date: string,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const [year, month, day] = date.split('-').map(Number)

  const localAsUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))
  const offsetMs = getTimezoneOffsetMs(timeZone, localAsUtc)

  return new Date(localAsUtc.getTime() + offsetMs)
}

function getTimezoneOffsetMs(timeZone: string, date: Date): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }))
  return utcDate.getTime() - tzDate.getTime()
}