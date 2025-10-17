import BookingForm from '../components/BookingForm'
import './Booking.css'

export default function Booking() {
    return (
        <div className="booking-page-container">
            {/* Hero Section */}
            <section className="booking-hero">
                <div className="booking-hero-content">
                    <div className="wellbeing-badge">
                        <span className="leaf-icon">🌿</span>
                        <span className="badge-text">Book Your Appointment</span>
                    </div>
                    <h1 className="main-heading">Schedule Your Massage</h1>
                    <p className="description">
                        Book your relaxing massage session with our professional therapists. 
                        Choose from our range of services and find the perfect time for your wellness journey.
                    </p>
                </div>
            </section>

            {/* Booking Form Section */}
            <section className="booking-form-section">
                <BookingForm />
            </section>

            {/* Additional Information */}
            <section className="booking-info-section">
                <div className="booking-info-content">
                    <h2>Why Choose Our Booking System?</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-icon">📅</div>
                            <h3>Instant Confirmation</h3>
                            <p>Receive immediate email confirmation with your appointment details and calendar link.</p>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon">👨‍⚕️</div>
                            <h3>Professional Therapists</h3>
                            <p>Choose from our experienced, licensed massage therapists for your session.</p>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon">🔔</div>
                            <h3>Automatic Reminders</h3>
                            <p>Get email reminders and easy calendar integration for your appointments.</p>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon">💆‍♀️</div>
                            <h3>Customized Experience</h3>
                            <p>Specify your preferences and special requests for a personalized massage experience.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
