import { useState } from 'react'
import { sendBookingEmails, generateGoogleCalendarLink, BookingEmailData } from '../services/emailService'
import './BookingForm.css'

interface BookingData {
    clientName: string
    clientEmail: string
    clientPhone: string
    serviceType: string
    servicePrice: string
    appointmentDate: string
    appointmentTime: string
    therapistName: string
    specialRequests: string
}

export default function BookingForm() {
    const [bookingData, setBookingData] = useState<BookingData>({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        serviceType: '',
        servicePrice: '',
        appointmentDate: '',
        appointmentTime: '',
        therapistName: '',
        specialRequests: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const services = [
        { name: '30 Minutes Swedish Massage', price: '$45.00', duration: '30' },
        { name: '60 Minutes Swedish Massage', price: '$69.00', duration: '60' },
        { name: '90 Minutes Swedish Massage', price: '$99.00', duration: '90' },
        { name: '120 Minutes Swedish Massage', price: '$138.00', duration: '120' },
        { name: '60 Minutes Prenatal Massage', price: '$80.00', duration: '60' },
        { name: '60 Minutes Deep Tissue Massage', price: '$80.00', duration: '60' },
        { name: '60 Minutes Couple Massage', price: '$138.00', duration: '60' }
    ]

    const therapists = [
        'Linda Lue',
        'Sarah Johnson',
        'Michael Chen',
        'Emma Wilson'
    ]

    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
        '5:00 PM', '6:00 PM', '7:00 PM'
    ]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setBookingData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleServiceSelect = (service: { name: string; price: string; duration: string }) => {
        setBookingData(prev => ({
            ...prev,
            serviceType: service.name,
            servicePrice: service.price
        }))
    }

    const sendEmails = async (bookingData: BookingData) => {
        const selectedService = services.find(s => s.name === bookingData.serviceType)
        const calendarLink = generateGoogleCalendarLink(
            bookingData.appointmentDate,
            bookingData.appointmentTime,
            bookingData.serviceType,
            selectedService?.duration || '60'
        )

        // Prepare email data
        const emailData: BookingEmailData = {
            client_name: bookingData.clientName,
            client_email: bookingData.clientEmail,
            client_phone: bookingData.clientPhone,
            service_type: bookingData.serviceType,
            service_price: bookingData.servicePrice,
            appointment_date: bookingData.appointmentDate,
            appointment_time: bookingData.appointmentTime,
            therapist_name: bookingData.therapistName,
            special_requests: bookingData.specialRequests,
            calendar_link: calendarLink,
            shop_email: 'info@lindaluemassage.com', // Replace with your shop email
            therapist_email: `${bookingData.therapistName.toLowerCase().replace(' ', '.')}@lindaluemassage.com` // Replace with actual therapist emails
        }

        return await sendBookingEmails(emailData)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            const success = await sendEmails(bookingData)
            if (success) {
                setSubmitStatus('success')
                // Reset form
                setBookingData({
                    clientName: '',
                    clientEmail: '',
                    clientPhone: '',
                    serviceType: '',
                    servicePrice: '',
                    appointmentDate: '',
                    appointmentTime: '',
                    therapistName: '',
                    specialRequests: ''
                })
            } else {
                setSubmitStatus('error')
            }
        } catch (error) {
            console.error('Booking error:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="booking-form-container">
            <div className="booking-form-header">
                <h2>Book Your Appointment</h2>
                <p>Fill out the form below to schedule your massage session</p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
                {/* Client Information */}
                <div className="form-section">
                    <h3>Your Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="clientName">Full Name *</label>
                            <input
                                type="text"
                                id="clientName"
                                name="clientName"
                                value={bookingData.clientName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientEmail">Email Address *</label>
                            <input
                                type="email"
                                id="clientEmail"
                                name="clientEmail"
                                value={bookingData.clientEmail}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="clientPhone">Phone Number *</label>
                            <input
                                type="tel"
                                id="clientPhone"
                                name="clientPhone"
                                value={bookingData.clientPhone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="therapistName">Preferred Therapist</label>
                            <select
                                id="therapistName"
                                name="therapistName"
                                value={bookingData.therapistName}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a therapist</option>
                                {therapists.map(therapist => (
                                    <option key={therapist} value={therapist}>{therapist}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Service Selection */}
                <div className="form-section">
                    <h3>Select Your Service</h3>
                    <div className="service-grid">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`service-option ${bookingData.serviceType === service.name ? 'selected' : ''}`}
                                onClick={() => handleServiceSelect(service)}
                            >
                                <h4>{service.name}</h4>
                                <p className="service-price">{service.price}</p>
                                <p className="service-duration">{service.duration} minutes</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="form-section">
                    <h3>Appointment Details</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="appointmentDate">Date *</label>
                            <input
                                type="date"
                                id="appointmentDate"
                                name="appointmentDate"
                                value={bookingData.appointmentDate}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="appointmentTime">Time *</label>
                            <select
                                id="appointmentTime"
                                name="appointmentTime"
                                value={bookingData.appointmentTime}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a time</option>
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Special Requests */}
                <div className="form-section">
                    <h3>Special Requests</h3>
                    <div className="form-group">
                        <label htmlFor="specialRequests">Any special requests or notes?</label>
                        <textarea
                            id="specialRequests"
                            name="specialRequests"
                            value={bookingData.specialRequests}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Please let us know about any allergies, injuries, or preferences..."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="form-submit">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Booking Appointment...' : 'Book Appointment'}
                    </button>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="status-message success">
                        <h4>✅ Appointment Booked Successfully!</h4>
                        <p>You will receive a confirmation email shortly with your appointment details and a Google Calendar link to add the appointment to your calendar.</p>
                        <p><strong>Emails sent to:</strong></p>
                        <ul>
                            <li>📧 You (confirmation with calendar link)</li>
                            <li>👨‍⚕️ Your therapist (appointment details)</li>
                            <li>🏢 Massage store (booking notification)</li>
                        </ul>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="status-message error">
                        <h4>❌ Booking Failed</h4>
                        <p>There was an error booking your appointment. Please try again or contact us directly.</p>
                    </div>
                )}
            </form>
        </div>
    )
}
