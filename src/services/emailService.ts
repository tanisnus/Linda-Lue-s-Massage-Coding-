import emailjs from '@emailjs/browser'

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// EmailJS Template IDs
const CLIENT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CLIENT_TEMPLATE_ID
const STAFF_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_STAFF_TEMPLATE_ID // Therapist + Shop combined

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

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
    shop_email: string
    therapist_email: string
}

export const sendBookingEmails = async (bookingData: BookingEmailData): Promise<{ success: boolean; error?: string }> => {
    try {
        // Validate environment variables
        if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !CLIENT_TEMPLATE_ID || !STAFF_TEMPLATE_ID) {
            const missing = []
            if (!EMAILJS_SERVICE_ID) missing.push('VITE_EMAILJS_SERVICE_ID')
            if (!EMAILJS_PUBLIC_KEY) missing.push('VITE_EMAILJS_PUBLIC_KEY')
            if (!CLIENT_TEMPLATE_ID) missing.push('VITE_EMAILJS_CLIENT_TEMPLATE_ID')
            if (!STAFF_TEMPLATE_ID) missing.push('VITE_EMAILJS_STAFF_TEMPLATE_ID')
            
            console.error('Missing EmailJS configuration:', {
                SERVICE_ID: EMAILJS_SERVICE_ID ? '✓' : '✗',
                PUBLIC_KEY: EMAILJS_PUBLIC_KEY ? '✓' : '✗',
                CLIENT_TEMPLATE: CLIENT_TEMPLATE_ID ? '✓' : '✗',
                STAFF_TEMPLATE: STAFF_TEMPLATE_ID ? '✓' : '✗'
            })
            
            const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
            const errorMessage = isProduction
                ? `Missing EmailJS configuration. Please set environment variables in your hosting platform settings. Missing: ${missing.join(', ')}. See DEPLOYMENT_ENV_VARIABLES.md for instructions.`
                : `Missing EmailJS configuration. Please check your .env.local file. Missing: ${missing.join(', ')}`
            
            return {
                success: false,
                error: errorMessage
            }
        }

        // Validate required booking data
        if (!bookingData.client_email || !bookingData.client_name) {
            return {
                success: false,
                error: 'Missing required booking information. Please fill in your name and email.'
            }
        }

        console.log('Sending client email...', {
            serviceId: EMAILJS_SERVICE_ID,
            templateId: CLIENT_TEMPLATE_ID,
            toEmail: bookingData.client_email
        })

        // Template 1: Send email to client
        const clientEmailResult = await emailjs.send(
            EMAILJS_SERVICE_ID,
            CLIENT_TEMPLATE_ID,
            {
                to_email: bookingData.client_email,
                client_name: bookingData.client_name,
                service_type: bookingData.service_type,
                service_price: bookingData.service_price,
                appointment_date: bookingData.appointment_date,
                appointment_time: bookingData.appointment_time,
                therapist_name: bookingData.therapist_name || 'Not specified',
                special_requests: bookingData.special_requests || 'None',
                calendar_link: bookingData.calendar_link
            }
        )

        console.log('Client email sent:', clientEmailResult.status, clientEmailResult.text)

        // Template 2: Send email to therapist with shop in Cc
        console.log('Sending staff email...', {
            serviceId: EMAILJS_SERVICE_ID,
            templateId: STAFF_TEMPLATE_ID,
            toEmail: bookingData.therapist_email,
            ccEmail: bookingData.shop_email
        })

        const staffEmailResult = await emailjs.send(
            EMAILJS_SERVICE_ID,
            STAFF_TEMPLATE_ID,
            {
                to_email: bookingData.therapist_email,
                cc_email: bookingData.shop_email, // Shop gets a copy
                client_name: bookingData.client_name,
                client_email: bookingData.client_email,
                client_phone: bookingData.client_phone || 'Not provided',
                service_type: bookingData.service_type,
                service_price: bookingData.service_price,
                appointment_date: bookingData.appointment_date,
                appointment_time: bookingData.appointment_time,
                therapist_name: bookingData.therapist_name || 'Not specified',
                special_requests: bookingData.special_requests || 'None',
                calendar_link: bookingData.calendar_link
            }
        )

        console.log('Staff email sent:', staffEmailResult.status, staffEmailResult.text)

        console.log('All emails sent successfully:', {
            client: clientEmailResult.status,
            staff: staffEmailResult.status
        })

        return { success: true }
    } catch (error) {
        console.error('Error sending booking emails:', error)
        
        let errorMessage = 'Unknown error occurred'
        
        if (error instanceof Error) {
            errorMessage = error.message
        } else if (typeof error === 'object' && error !== null) {
            // EmailJS errors are usually objects with text, status, etc.
            const emailjsError = error as { text?: string; status?: number; message?: string }
            if (emailjsError.text) {
                errorMessage = emailjsError.text
            } else if (emailjsError.message) {
                errorMessage = emailjsError.message
            } else if (emailjsError.status) {
                errorMessage = `EmailJS error (Status: ${emailjsError.status})`
            }
        } else {
            errorMessage = String(error)
        }
        
        console.error('Error details:', {
            message: errorMessage,
            error: error
        })
        
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
        // Convert 12-hour time to 24-hour format
        const time24h = convertTo24Hour(appointmentTime)
        const startDate = new Date(`${appointmentDate}T${time24h}`)
        
        // Validate the date
        if (isNaN(startDate.getTime())) {
            throw new Error(`Invalid time value: ${appointmentTime}. Please select a valid time.`)
        }
        
        const endDate = new Date(startDate.getTime() + parseInt(duration) * 60000)
        
        // Validate the end date
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
