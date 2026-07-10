export interface BookingEmailData {
    client_name: string
    client_email: string
    client_phone: string
    service_type: string
    service_price: string
    appointment_date: string
    appointment_time: string
    therapist_name: string
    special_requests: string
    calendar_link: string
}

export const sendBookingEmails = async (bookingData: BookingEmailData): Promise<{ success: boolean; error?: string }> => {
    try {
        if (!bookingData.client_email || !bookingData.client_name) {
            return {
                success: false,
                error: 'Missing required booking information. Please fill in your name and email.'
            }
        }

        const response = await fetch('/api/send-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData),
        })

        const responseText = await response.text()
        let result: { success: boolean; error?: string }

        try {
            result = JSON.parse(responseText) as { success: boolean; error?: string }
        } catch {
            return {
                success: false,
                error: responseText || `Failed to send booking emails (status ${response.status})`
            }
        }

        if (!response.ok || !result.success) {
            return {
                success: false,
                error: result.error || `Failed to send booking emails (status ${response.status})`
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Error sending booking emails:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        return {
            success: false,
            error: `Failed to send booking emails: ${errorMessage}`
        }
    }
}

// Convert 12-hour time format (e.g., "10:00 AM") to 24-hour format (e.g., "10:00")
const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ')
    const [hoursStr, minutes] = time.split(':')
    let hours = hoursStr
    
    if (hours === '12') {
        hours = modifier === 'AM' ? '00' : '12'
    } else if (modifier === 'PM') {
        hours = String(parseInt(hours, 10) + 12)
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`
}

export const generateGoogleCalendarLink = (
    appointmentDate: string,
    appointmentTime: string,
    serviceType: string,
    duration: string
): string => {
    try {
        const time24h = convertTo24Hour(appointmentTime)
        const startDate = new Date(`${appointmentDate}T${time24h}`)
        
        if (isNaN(startDate.getTime())) {
            throw new Error(`Invalid time value: ${appointmentTime}. Please select a valid time.`)
        }
        
        const endDate = new Date(startDate.getTime() + parseInt(duration) * 60000)
        
        if (isNaN(endDate.getTime())) {
            throw new Error(`Invalid duration or time calculation.`)
        }
        
        const formatDate = (date: Date): string => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
        }

        const details = `Massage Appointment: ${serviceType}`
        const location = 'Linda Lue\'s Massage & Spa'
        
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: details,
            dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
            details: `Service: ${serviceType}\nDuration: ${duration} minutes\nLocation: ${location}\n\nClick "Yes" to add to your Google Calendar!`,
            location: location
        })

        return `https://calendar.google.com/calendar/render?${params.toString()}`
    } catch (error) {
        console.error('Error generating calendar link:', error)
        throw error
    }
}
