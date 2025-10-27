import { useState } from 'react'
// import { sendBookingEmails, generateGoogleCalendarLink, BookingEmailData } from '../services/emailService'
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

type FormStep = 'personal' | 'service' | 'appointment' | 'requests' | 'review'

export default function BookingForm() {
    const [currentStep, setCurrentStep] = useState<FormStep>('personal')
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

    const steps = [
        { id: 'personal', title: 'Personal Info', description: 'Your contact details' },
        { id: 'service', title: 'Service', description: 'Choose your massage' },
        { id: 'appointment', title: 'Schedule', description: 'Date & time' },
        { id: 'requests', title: 'Requests', description: 'Special needs' },
        { id: 'review', title: 'Review', description: 'Confirm booking' }
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

    const nextStep = () => {
        const stepIndex = steps.findIndex(step => step.id === currentStep)
        if (stepIndex < steps.length - 1) {
            setCurrentStep(steps[stepIndex + 1].id as FormStep)
        }
    }

    const prevStep = () => {
        const stepIndex = steps.findIndex(step => step.id === currentStep)
        if (stepIndex > 0) {
            setCurrentStep(steps[stepIndex - 1].id as FormStep)
        }
    }

    const sendEmails = async (bookingData: BookingData) => {
        console.log('Booking data:', bookingData)
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            const success = await sendEmails(bookingData)
            if (success) {
                setSubmitStatus('success')
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
                setCurrentStep('personal')
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 'personal':
                return (
                    <div className="step-content">
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
                )

            case 'service':
                return (
                    <div className="step-content">
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
                )

            case 'appointment':
                return (
                    <div className="step-content">
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
                )

            case 'requests':
                return (
                    <div className="step-content">
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
                )

            case 'review':
                return (
                    <div className="step-content">
                        <h3>Review Your Booking</h3>
                        <div className="review-summary">
                            <div className="review-section">
                                <h4>Personal Information</h4>
                                <p><strong>Name:</strong> {bookingData.clientName}</p>
                                <p><strong>Email:</strong> {bookingData.clientEmail}</p>
                                <p><strong>Phone:</strong> {bookingData.clientPhone}</p>
                                {bookingData.therapistName && <p><strong>Preferred Therapist:</strong> {bookingData.therapistName}</p>}
                            </div>
                            
                            <div className="review-section">
                                <h4>Service Details</h4>
                                <p><strong>Service:</strong> {bookingData.serviceType}</p>
                                <p><strong>Price:</strong> {bookingData.servicePrice}</p>
                            </div>
                            
                            <div className="review-section">
                                <h4>Appointment</h4>
                                <p><strong>Date:</strong> {bookingData.appointmentDate}</p>
                                <p><strong>Time:</strong> {bookingData.appointmentTime}</p>
                            </div>
                            
                            {bookingData.specialRequests && (
                                <div className="review-section">
                                    <h4>Special Requests</h4>
                                    <p>{bookingData.specialRequests}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="booking-form-container">
            <div className="booking-form-header">
                <h2>Book Your Appointment</h2>
                <p>Follow the steps below to schedule your massage session</p>
            </div>

            {/* Progress Indicator */}
            <div className="progress-indicator">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id
                    const currentStepIndex = steps.findIndex(s => s.id === currentStep)
                    const isCompleted = index < currentStepIndex
                    
                    return (
                        <div
                            key={step.id}
                            className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        >
                            <div className="step-icon">
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <div className="step-info">
                                <h4>{step.title}</h4>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="form-navigation">
                    {currentStep !== 'personal' && (
                        <button type="button" onClick={prevStep} className="nav-button prev">
                            ← Previous
                        </button>
                    )}
                    
                    {currentStep !== 'review' ? (
                        <button type="button" onClick={nextStep} className="nav-button next">
                            Next →
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Booking Appointment...' : 'Book Appointment'}
                        </button>
                    )}
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="status-message success">
                        <h4>✅ Appointment Booked Successfully!</h4>
                        <p>Your appointment has been booked! We will contact you to confirm the details.</p>
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