import { useEffect, useState } from 'react'
import { sendBookingEmails, generateGoogleCalendarLink } from '../services/emailService'
import type { BookingEmailData } from '../services/emailService'
import { fetchAvailableSlots } from '../services/availabilityService'
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
    therapistName2: string
    specialRequests: string
}

type FormStep = 'personal' | 'service' | 'appointment' | 'requests' | 'review'

const COUPLE_MASSAGE_SERVICE = '60 Minutes Couple Massage'

function isCoupleMassage(serviceType: string): boolean {
    return serviceType === COUPLE_MASSAGE_SERVICE
}

function formatTherapistsForApi(therapistName: string, therapistName2: string, serviceType: string): string {
    if (isCoupleMassage(serviceType)) {
        return `${therapistName},${therapistName2}`
    }
    return therapistName
}

function formatTherapistsForDisplay(therapistName: string, therapistName2: string, serviceType: string): string {
    if (isCoupleMassage(serviceType)) {
        return `${therapistName} & ${therapistName2}`
    }
    return therapistName
}

function areTherapistsReady(serviceType: string, therapistName: string, therapistName2: string): boolean {
    if (isCoupleMassage(serviceType)) {
        return Boolean(
            therapistName &&
            therapistName2 &&
            therapistName !== therapistName2
        )
    }
    return Boolean(therapistName)
}

const SERVICES = [
    { name: '30 Minutes Swedish Massage', price: '$45.00', duration: '30' },
    { name: '60 Minutes Swedish Massage', price: '$69.00', duration: '60' },
    { name: '90 Minutes Swedish Massage', price: '$99.00', duration: '90' },
    { name: '120 Minutes Swedish Massage', price: '$138.00', duration: '120' },
    { name: '60 Minutes Prenatal Massage', price: '$80.00', duration: '60' },
    { name: '60 Minutes Deep Tissue Massage', price: '$80.00', duration: '60' },
    { name: '60 Minutes Couple Massage', price: '$138.00', duration: '60' }
]

const TIME_SLOTS = [
    '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
]

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
        therapistName2: '',
        specialRequests: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({})
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
    const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS)
    const [slotsLoading, setSlotsLoading] = useState(false)
    const [calendarEnabled, setCalendarEnabled] = useState(false)
    const [canConfirmBooking, setCanConfirmBooking] = useState(false)

    useEffect(() => {
        if (currentStep !== 'review') {
            setCanConfirmBooking(false)
            return
        }

        setCanConfirmBooking(false)
        const timer = window.setTimeout(() => setCanConfirmBooking(true), 400)
        return () => clearTimeout(timer)
    }, [currentStep])

    useEffect(() => {
        const therapistsReady = areTherapistsReady(
            bookingData.serviceType,
            bookingData.therapistName,
            bookingData.therapistName2
        )

        if (!bookingData.appointmentDate || !bookingData.serviceType || !therapistsReady) {
            setAvailableSlots(TIME_SLOTS)
            setCalendarEnabled(false)
            return
        }

        const duration = SERVICES.find(s => s.name === bookingData.serviceType)?.duration || '60'
        let cancelled = false

        setSlotsLoading(true)
        fetchAvailableSlots(
            bookingData.appointmentDate,
            duration,
            formatTherapistsForApi(
                bookingData.therapistName,
                bookingData.therapistName2,
                bookingData.serviceType
            )
        )
            .then(({ slots, calendarEnabled: enabled }) => {
                if (cancelled) return
                setAvailableSlots(slots)
                setCalendarEnabled(enabled)

                if (bookingData.appointmentTime && !slots.includes(bookingData.appointmentTime)) {
                    setBookingData(prev => ({ ...prev, appointmentTime: '' }))
                }
            })
            .catch(() => {
                if (cancelled) return
                setAvailableSlots(TIME_SLOTS)
                setCalendarEnabled(false)
            })
            .finally(() => {
                if (!cancelled) setSlotsLoading(false)
            })

        return () => { cancelled = true }
    }, [
        bookingData.appointmentDate,
        bookingData.serviceType,
        bookingData.therapistName,
        bookingData.therapistName2,
    ])

    const services = SERVICES

    // Get available therapists based on day of week
    const getAvailableTherapists = (dateString: string): string[] => {
        if (!dateString) return []
        
        const date = new Date(dateString)
        const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        
        // Define therapists by day of week
        const therapistsByDay: { [key: number]: string[] } = {
            0: ['Tina', 'Saifon', 'Nat', 'Dodo'], // Sunday
            1: ['Pukey', 'Saifon', 'Nat'], // Monday
            2: ['Sandy', 'Emily', 'Saifon', 'Nat'], // Tuesday
            3: ['Sandy', 'Omi', 'JJ'], // Wednesday
            4: ['Sandy', 'Winnie', 'Wanda'], // Thursday
            5: ['Sandy', 'Pukey', 'Saifon', 'Nat'], // Friday
            6: ['Pukey', 'Saifon', 'Nat'] // Saturday
        }
        
        return therapistsByDay[dayOfWeek] || []
    }

    const steps = [
        { id: 'personal', title: 'Personal Info', description: 'Your contact details' },
        { id: 'service', title: 'Service', description: 'Choose your massage' },
        { id: 'appointment', title: 'Schedule', description: 'Date & time' },
        { id: 'requests', title: 'Requests', description: 'Special needs' },
        { id: 'review', title: 'Review', description: 'Confirm booking' }
    ]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        
        // Clear step errors when user makes changes
        if (stepErrors[currentStep]) {
            setStepErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[currentStep]
                return newErrors
            })
        }
        
        // Validate fields in real-time for personal info step
        if (currentStep === 'personal') {
            if (name === 'clientName') {
                const nameError = value.trim() === '' ? 'Please enter your full name' : ''
                setFieldErrors(prev => ({
                    ...prev,
                    clientName: nameError
                }))
            } else if (name === 'clientEmail') {
                const emailError = value.trim() === '' 
                    ? 'Please enter your email address' 
                    : validateEmail(value) || ''
                setFieldErrors(prev => ({
                    ...prev,
                    clientEmail: emailError
                }))
            } else if (name === 'clientPhone') {
                const phoneError = value.trim() === '' ? 'Please enter your phone number' : ''
                setFieldErrors(prev => ({
                    ...prev,
                    clientPhone: phoneError
                }))
            }
        } else {
            // Clear field error when user changes other fields
            if (fieldErrors[name]) {
                setFieldErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors[name]
                    return newErrors
                })
            }
        }
        
        // If date changes, reset therapist and time (therapists vary by day)
        if (name === 'appointmentDate') {
            setBookingData(prev => ({
                ...prev,
                [name]: value,
                therapistName: '',
                therapistName2: '',
                appointmentTime: '',
            }))
        } else if (name === 'therapistName' || name === 'therapistName2') {
            setBookingData(prev => {
                const next = {
                    ...prev,
                    [name]: value,
                    appointmentTime: '',
                }

                if (name === 'therapistName' && value === prev.therapistName2) {
                    next.therapistName2 = ''
                }

                if (name === 'therapistName2' && value === prev.therapistName) {
                    next.therapistName2 = ''
                }

                return next
            })
        } else {
            setBookingData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        
        if (currentStep === 'personal') {
            if (name === 'clientName') {
                const nameError = value.trim() === '' ? 'Please enter your full name' : ''
                setFieldErrors(prev => ({
                    ...prev,
                    clientName: nameError
                }))
            } else if (name === 'clientEmail') {
                const emailError = value.trim() === '' 
                    ? 'Please enter your email address' 
                    : validateEmail(value) || ''
                setFieldErrors(prev => ({
                    ...prev,
                    clientEmail: emailError
                }))
            } else if (name === 'clientPhone') {
                const phoneError = value.trim() === '' ? 'Please enter your phone number' : ''
                setFieldErrors(prev => ({
                    ...prev,
                    clientPhone: phoneError
                }))
            }
        }
    }

    const handleServiceSelect = (service: { name: string; price: string; duration: string }) => {
        setBookingData(prev => ({
            ...prev,
            serviceType: service.name,
            servicePrice: service.price,
            therapistName: '',
            therapistName2: '',
            appointmentTime: '',
        }))
    }

    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 'personal': {
                const emailValid = !fieldErrors.clientEmail && bookingData.clientEmail.trim() !== ''
                return bookingData.clientName.trim() !== '' &&
                       emailValid &&
                       bookingData.clientPhone.trim() !== ''
            }
            case 'service':
                return bookingData.serviceType !== ''
            case 'appointment':
                return bookingData.appointmentDate !== '' &&
                       bookingData.appointmentTime !== '' &&
                       areTherapistsReady(
                           bookingData.serviceType,
                           bookingData.therapistName,
                           bookingData.therapistName2
                       )
            case 'requests':
                // Requests step is optional, so always allow progression
                return true
            case 'review':
                // Review step is the last step
                return true
            default:
                return true
        }
    }

    const validateEmail = (email: string): string | null => {
        if (!email) return null // Empty email is handled by required validation
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        // Check for common invalid patterns
        if (email.includes('@') && !email.includes('@gmail.com') && !email.includes('@yahoo.com') && !email.includes('@hotmail.com') && !email.includes('@outlook.com')) {
            // Allow other domains, just check basic format
        }
        
        if (!emailRegex.test(email)) {
            if (email.includes('@') && !email.includes('.')) {
                return 'Email must include a domain (e.g., @gmail.com)'
            }
            if (email.startsWith('@')) {
                return 'Email cannot start with @'
            }
            if (email.includes('@') && email.split('@').length > 2) {
                return 'Email can only contain one @ symbol'
            }
            if (!email.includes('@')) {
                return 'Email must include @ symbol'
            }
            return 'Please enter a valid email address (e.g., name@gmail.com)'
        }
        
        return null // Valid email
    }

    const validateTimeFormat = (time: string, date: string): string | null => {
        if (!time || !date) return null
        
        try {
            // Test if we can generate a valid calendar link
            generateGoogleCalendarLink(date, time, 'Test Service', '60')
            return null // No error
        } catch (error) {
            return error instanceof Error ? error.message : 'Invalid time format'
        }
    }

    const validatePersonalInfoFields = () => {
        const errors: { [key: string]: string } = {}
        
        if (!bookingData.clientName.trim()) {
            errors.clientName = 'Please enter your full name'
        }
        
        if (!bookingData.clientEmail.trim()) {
            errors.clientEmail = 'Please enter your email address'
        } else {
            const emailError = validateEmail(bookingData.clientEmail)
            if (emailError) {
                errors.clientEmail = emailError
            }
        }
        
        if (!bookingData.clientPhone.trim()) {
            errors.clientPhone = 'Please enter your phone number'
        }
        
        return errors
    }

    const nextStep = () => {
        // Clear previous step errors
        setStepErrors({})
        
        // Validate personal info fields and show errors
        if (currentStep === 'personal') {
            const personalErrors = validatePersonalInfoFields()
            if (Object.keys(personalErrors).length > 0) {
                setFieldErrors(prev => ({ ...prev, ...personalErrors }))
                return
            }
        }
        
        if (!validateCurrentStep()) {
            // Show validation message based on current step
            let errorMsg = ''
            switch (currentStep) {
                case 'personal':
                    errorMsg = 'Please fill in all required fields correctly'
                    break
                case 'service':
                    errorMsg = 'Please select a service'
                    break
                case 'appointment':
                    if (!bookingData.appointmentDate) {
                        errorMsg = 'Please select a date'
                    } else if (!bookingData.appointmentTime) {
                        errorMsg = 'Please select a time'
                    } else if (!areTherapistsReady(
                        bookingData.serviceType,
                        bookingData.therapistName,
                        bookingData.therapistName2
                    )) {
                        if (isCoupleMassage(bookingData.serviceType)) {
                            if (!bookingData.therapistName || !bookingData.therapistName2) {
                                errorMsg = 'Please select two therapists for couple massage'
                            } else if (bookingData.therapistName === bookingData.therapistName2) {
                                errorMsg = 'Please select two different therapists'
                            } else {
                                errorMsg = 'Please select two therapists for couple massage'
                            }
                        } else {
                            errorMsg = 'Please select a therapist'
                        }
                    } else {
                        // Validate time format
                        const timeError = validateTimeFormat(bookingData.appointmentTime, bookingData.appointmentDate)
                        if (timeError) {
                            errorMsg = timeError
                        }
                    }
                    break
            }
            
            if (errorMsg) {
                setStepErrors({ [currentStep]: errorMsg })
            }
            return
        }
        
        // Additional validation for appointment step
        if (currentStep === 'appointment') {
            const timeError = validateTimeFormat(bookingData.appointmentTime, bookingData.appointmentDate)
            if (timeError) {
                setStepErrors({ appointment: timeError })
                return
            }
        }
        
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

    const sendEmails = async (bookingData: BookingData): Promise<{ success: boolean; error?: string }> => {
        try {
            // Validate time before generating calendar link
            if (!bookingData.appointmentTime || !bookingData.appointmentDate) {
                return {
                    success: false,
                    error: 'Please select both date and time for your appointment.'
                }
            }

            // Generate calendar link with error handling
            let calendarLink = ''
            try {
                calendarLink = generateGoogleCalendarLink(
                    bookingData.appointmentDate,
                    bookingData.appointmentTime,
                    bookingData.serviceType,
                    services.find(s => s.name === bookingData.serviceType)?.duration || '60'
                )
            } catch (calendarError) {
                const calendarErrorMessage = calendarError instanceof Error ? calendarError.message : 'Invalid time value'
                return {
                    success: false,
                    error: `Invalid appointment time: ${calendarErrorMessage}`
                }
            }

            // Convert BookingData to BookingEmailData format
            const emailData: BookingEmailData = {
                client_name: bookingData.clientName,
                client_email: bookingData.clientEmail,
                client_phone: bookingData.clientPhone,
                service_type: bookingData.serviceType,
                service_price: bookingData.servicePrice,
                appointment_date: bookingData.appointmentDate,
                appointment_time: bookingData.appointmentTime,
                therapist_name: formatTherapistsForDisplay(
                    bookingData.therapistName,
                    bookingData.therapistName2,
                    bookingData.serviceType
                ),
                special_requests: bookingData.specialRequests,
                calendar_link: calendarLink,
                duration: services.find(s => s.name === bookingData.serviceType)?.duration || '60'
            }

            const result = await sendBookingEmails(emailData)
            return result
        } catch (error) {
            console.error('Error sending emails:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            return {
                success: false,
                error: `Failed to process booking: ${errorMessage}`
            }
        }
    }

    const confirmBooking = async () => {
        if (currentStep !== 'review' || !canConfirmBooking) {
            return
        }

        setIsSubmitting(true)
        setSubmitStatus('idle')
        setErrorMessage('')

        try {
            const result = await sendEmails(bookingData)
            if (result.success) {
                setSubmitStatus('success')
                setErrorMessage('')
                setCurrentStep('review')
            } else {
                setSubmitStatus('error')
                setErrorMessage(result.error || 'An unknown error occurred. Please try again.')
            }
        } catch (error) {
            console.error('Booking error:', error)
            setSubmitStatus('error')
            const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
            setErrorMessage(errorMsg)
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
                                    onBlur={handleFieldBlur}
                                    required
                                    className={fieldErrors.clientName ? 'error-input' : ''}
                                />
                                {fieldErrors.clientName && (
                                    <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                                        ⚠️ {fieldErrors.clientName}
                                    </p>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="clientEmail">Email Address *</label>
                                <input
                                    type="email"
                                    id="clientEmail"
                                    name="clientEmail"
                                    value={bookingData.clientEmail}
                                    onChange={handleInputChange}
                                    onBlur={handleFieldBlur}
                                    required
                                    className={fieldErrors.clientEmail ? 'error-input' : ''}
                                />
                                {fieldErrors.clientEmail && (
                                    <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                                        ⚠️ {fieldErrors.clientEmail}
                                    </p>
                                )}
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
                                    onBlur={handleFieldBlur}
                                    required
                                    className={fieldErrors.clientPhone ? 'error-input' : ''}
                                />
                                {fieldErrors.clientPhone && (
                                    <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                                        ⚠️ {fieldErrors.clientPhone}
                                    </p>
                                )}
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

            case 'appointment': {
                const availableTherapists = getAvailableTherapists(bookingData.appointmentDate)
                const coupleMassage = isCoupleMassage(bookingData.serviceType)
                const therapistsReady = areTherapistsReady(
                    bookingData.serviceType,
                    bookingData.therapistName,
                    bookingData.therapistName2
                )
                const secondTherapistOptions = availableTherapists.filter(
                    therapist => therapist !== bookingData.therapistName
                )
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                const selectedDayName = bookingData.appointmentDate 
                    ? dayNames[new Date(bookingData.appointmentDate).getDay()]
                    : ''
                const therapistDisplayName = formatTherapistsForDisplay(
                    bookingData.therapistName,
                    bookingData.therapistName2,
                    bookingData.serviceType
                )
                
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
                                {bookingData.appointmentDate && (
                                    <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                        Selected: {selectedDayName}
                                    </p>
                                )}
                            </div>
                        </div>
                        {bookingData.appointmentDate && (
                            <>
                                <div className="form-row" style={{ marginTop: '16px' }}>
                                    <div className="form-group" style={{ width: '100%' }}>
                                        <label htmlFor="therapistName">
                                            {coupleMassage ? 'Select First Therapist *' : 'Select Therapist *'}
                                        </label>
                                        <select
                                            id="therapistName"
                                            name="therapistName"
                                            value={bookingData.therapistName}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">
                                                {availableTherapists.length > 0 
                                                    ? coupleMassage ? 'Select first therapist' : 'Select a therapist'
                                                    : 'Select a date first'}
                                            </option>
                                            {availableTherapists.map(therapist => (
                                                <option key={therapist} value={therapist}>{therapist}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {coupleMassage && (
                                    <div className="form-row" style={{ marginTop: '16px' }}>
                                        <div className="form-group" style={{ width: '100%' }}>
                                            <label htmlFor="therapistName2">Select Second Therapist *</label>
                                            <select
                                                id="therapistName2"
                                                name="therapistName2"
                                                value={bookingData.therapistName2}
                                                onChange={handleInputChange}
                                                required
                                                disabled={!bookingData.therapistName}
                                            >
                                                <option value="">
                                                    {!bookingData.therapistName
                                                        ? 'Select first therapist first'
                                                        : secondTherapistOptions.length > 0
                                                            ? 'Select second therapist'
                                                            : 'No other therapists available'}
                                                </option>
                                                {secondTherapistOptions.map(therapist => (
                                                    <option key={therapist} value={therapist}>{therapist}</option>
                                                ))}
                                            </select>
                                            {bookingData.therapistName && bookingData.therapistName2 && bookingData.therapistName === bookingData.therapistName2 && (
                                                <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                                                    Please choose two different therapists
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {availableTherapists.length > 0 && (
                                    <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                        {availableTherapists.length} therapist{availableTherapists.length !== 1 ? 's' : ''} available on {selectedDayName}
                                        {coupleMassage && ' — couple massage requires two different therapists'}
                                    </p>
                                )}
                            </>
                        )}
                        <div className="form-row" style={{ marginTop: '16px' }}>
                            <div className="form-group">
                                <label htmlFor="appointmentTime">Time *</label>
                                <select
                                    id="appointmentTime"
                                    name="appointmentTime"
                                    value={bookingData.appointmentTime}
                                    onChange={handleInputChange}
                                    required
                                    disabled={
                                        slotsLoading ||
                                        !bookingData.appointmentDate ||
                                        !bookingData.serviceType ||
                                        !therapistsReady
                                    }
                                >
                                    <option value="">
                                        {slotsLoading
                                            ? 'Loading available times...'
                                            : !bookingData.serviceType
                                                ? 'Select a service first'
                                                : coupleMassage && (!bookingData.therapistName || !bookingData.therapistName2)
                                                    ? 'Select two therapists first'
                                                    : !bookingData.therapistName
                                                        ? 'Select a therapist first'
                                                        : 'Select a time'}
                                    </option>
                                    {availableSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                                {calendarEnabled && bookingData.appointmentDate && bookingData.serviceType && therapistsReady && !slotsLoading && (
                                    <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                        {availableSlots.length} time slot{availableSlots.length !== 1 ? 's' : ''} available for {therapistDisplayName}
                                    </p>
                                )}
                                {stepErrors.appointment && (
                                    <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                                        ⚠️ {stepErrors.appointment}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

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
                                {areTherapistsReady(
                                    bookingData.serviceType,
                                    bookingData.therapistName,
                                    bookingData.therapistName2
                                ) && (
                                    <p><strong>Preferred Therapist{isCoupleMassage(bookingData.serviceType) ? 's' : ''}:</strong>{' '}
                                        {formatTherapistsForDisplay(
                                            bookingData.therapistName,
                                            bookingData.therapistName2,
                                            bookingData.serviceType
                                        )}
                                    </p>
                                )}
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

            <form
                onSubmit={(e) => e.preventDefault()}
                onKeyDownCapture={(e) => {
                    if (e.key !== 'Enter') return

                    const target = e.target as HTMLElement
                    if (target.tagName === 'TEXTAREA') return

                    e.preventDefault()

                    if (currentStep !== 'review') {
                        nextStep()
                    }
                }}
                className="booking-form"
            >
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className={`form-navigation${submitStatus === 'success' ? ' form-navigation-success' : ''}`}>
                    {currentStep !== 'personal' && submitStatus !== 'success' && (
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
                            type="button"
                            onClick={confirmBooking}
                            className="submit-button"
                            disabled={isSubmitting || submitStatus === 'success' || !canConfirmBooking}
                        >
                            {isSubmitting ? 'Booking Appointment...' : submitStatus === 'success' ? 'Booked ✓' : 'Book Appointment'}
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
                        <p>{errorMessage || 'There was an error booking your appointment. Please try again or contact us directly.'}</p>
                        {errorMessage && (
                            <details style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.8 }}>
                                <summary style={{ cursor: 'pointer' }}>Technical Details (Click to expand)</summary>
                                <pre style={{ marginTop: '5px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'auto' }}>
                                    {errorMessage}
                                </pre>
                            </details>
                        )}
                    </div>
                )}
            </form>
        </div>
    )
}