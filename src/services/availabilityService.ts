const DEFAULT_TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
]

export async function fetchAvailableSlots(
  date: string,
  duration: string,
  therapist: string
): Promise<{ slots: string[]; calendarEnabled: boolean }> {
  const params = new URLSearchParams({ date, duration, therapist })
  const response = await fetch(`/api/availability?${params}`)
  const result = await response.json() as {
    success: boolean
    slots?: string[]
    calendarEnabled?: boolean
    error?: string
  }

  if (!response.ok || !result.success || !result.slots) {
    return { slots: DEFAULT_TIME_SLOTS, calendarEnabled: false }
  }

  return {
    slots: result.slots,
    calendarEnabled: result.calendarEnabled ?? true,
  }
}
