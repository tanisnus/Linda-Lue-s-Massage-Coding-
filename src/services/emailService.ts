import emailjs from '@emailjs/browser'

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID' // Replace with your EmailJS service ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key

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

export const sendBookingEmails = async (bookingData: BookingEmailData): Promise<boolean> => {
    try {
        // Send email to client
        const clientEmailResult = await emailjs.send(
            EMAILJS_SERVICE_ID,
            'client_template', // Replace with your client email template ID
            {
                to_email: bookingData.client_email,
                client_name: bookingData.client_name,
                service_type: bookingData.service_type,
                service_price: bookingData.service_price,
                appointment_date: bookingData.appointment_date,
                appointment_time: bookingData.appointment_time,
                therapist_name: bookingData.therapist_name,
                special_requests: bookingData.special_requests,
                calendar_link: bookingData.calendar_link,
                shop_email: bookingData.shop_email
            }
        )

        // Send email to therapist
        const therapistEmailResult = await emailjs.send(
            EMAILJS_SERVICE_ID,
            'therapist_template', // Replace with your therapist email template ID
            {
                to_email: bookingData.therapist_email,
                client_name: bookingData.client_name,
                client_email: bookingData.client_email,
                client_phone: bookingData.client_phone,
                service_type: bookingData.service_type,
                service_price: bookingData.service_price,
                appointment_date: bookingData.appointment_date,
                appointment_time: bookingData.appointment_time,
                therapist_name: bookingData.therapist_name,
                special_requests: bookingData.special_requests,
                calendar_link: bookingData.calendar_link
            }
        )

        // Send email to shop
        const shopEmailResult = await emailjs.send(
            EMAILJS_SERVICE_ID,
            'shop_template', // Replace with your shop email template ID
            {
                to_email: bookingData.shop_email,
                client_name: bookingData.client_name,
                client_email: bookingData.client_email,
                client_phone: bookingData.client_phone,
                service_type: bookingData.service_type,
                service_price: bookingData.service_price,
                appointment_date: bookingData.appointment_date,
                appointment_time: bookingData.appointment_time,
                therapist_name: bookingData.therapist_name,
                special_requests: bookingData.special_requests,
                calendar_link: bookingData.calendar_link
            }
        )

        console.log('All emails sent successfully:', {
            client: clientEmailResult.status,
            therapist: therapistEmailResult.status,
            shop: shopEmailResult.status
        })

        return true
    } catch (error) {
        console.error('Error sending booking emails:', error)
        return false
    }
}

export const generateGoogleCalendarLink = (
    appointmentDate: string,
    appointmentTime: string,
    serviceType: string,
    duration: string
): string => {
    const startDate = new Date(`${appointmentDate}T${appointmentTime}`)
    const endDate = new Date(startDate.getTime() + parseInt(duration) * 60000)
    
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
}
