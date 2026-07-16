export type CancelPreview = {
  client_name: string
  service_type: string
  appointment_date: string
  appointment_time: string
  therapist_name: string
}

export async function fetchCancelPreview(token: string): Promise<{
  success: boolean
  booking?: CancelPreview
  error?: string
}> {
  const response = await fetch(`/api/cancel-booking?token=${encodeURIComponent(token)}`)
  const result = await response.json() as {
    success: boolean
    booking?: CancelPreview
    error?: string
  }

  if (!response.ok || !result.success || !result.booking) {
    return {
      success: false,
      error: result.error || 'Could not load appointment details.',
    }
  }

  return { success: true, booking: result.booking }
}

export async function cancelBooking(token: string): Promise<{
  success: boolean
  booking?: CancelPreview
  error?: string
}> {
  const response = await fetch('/api/cancel-booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })

  const result = await response.json() as {
    success: boolean
    booking?: CancelPreview
    error?: string
  }

  if (!response.ok || !result.success) {
    return {
      success: false,
      error: result.error || 'Could not cancel appointment.',
    }
  }

  return { success: true, booking: result.booking }
}
