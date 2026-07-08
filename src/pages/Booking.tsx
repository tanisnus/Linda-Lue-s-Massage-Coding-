import BookingForm from '../components/BookingForm'
import PageMeta from '../components/PageMeta'
import './Booking.css'

export default function Booking() {
    return (
        <div className="booking-page-container">
            <PageMeta
                title="Book Online"
                description="Schedule your massage online at Linda Lue's Massage in Sherman Oaks. Choose your service, pick a time, and confirm your appointment."
                path="/booking"
            />
            {/* Hero Section */}
            <section className="booking-hero">
                <div className="booking-hero-content">
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

            {/* Payment Methods Section */}
            <section className="payment-methods-section">
                <div className="payment-methods-container">
                    <div className="payment-header">
                        <div className="payment-header-icon">
                            <span className="payment-icon-symbol">💳</span>
                        </div>
                        <div className="payment-header-content">
                            <h3 className="payment-section-title">Accepted Payment Methods</h3>
                            <p className="payment-section-subtitle">Choose your preferred payment option</p>
                        </div>
                    </div>

                    <div className="payment-options-grid">
                        <div className="payment-option-card">
                            <div className="payment-option-icon">
                                <span className="payment-icon-symbol">💵</span>
                            </div>
                            <div className="payment-option-content">
                                <h4 className="payment-option-name">Cash</h4>
                                <p className="payment-option-description">Pay directly with cash</p>
                                <div className="payment-option-badge no-fee">No Fee</div>
                            </div>
                        </div>

                        <div className="payment-option-card">
                            <div className="payment-option-icon">
                                <span className="payment-icon-symbol">📱</span>
                            </div>
                            <div className="payment-option-content">
                                <h4 className="payment-option-name">Venmo</h4>
                                <p className="payment-option-description">Quick digital payments</p>
                                <div className="payment-option-badge no-fee">No Fee</div>
                            </div>
                        </div>

                        <div className="payment-option-card">
                            <div className="payment-option-icon">
                                <span className="payment-icon-symbol">💳</span>
                            </div>
                            <div className="payment-option-content">
                                <h4 className="payment-option-name">Zelle</h4>
                                <p className="payment-option-description">Fast bank transfers</p>
                                <div className="payment-option-badge no-fee">No Fee</div>
                            </div>
                        </div>

                        <div className="payment-option-card credit-card-option">
                            <div className="payment-option-icon">
                                <span className="payment-icon-symbol">💳</span>
                            </div>
                            <div className="payment-option-content">
                                <h4 className="payment-option-name">Credit Card</h4>
                                <p className="payment-option-description">Via Square Payment</p>
                                <div className="payment-option-badge with-fee">Fee: $5.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Information */}
            <section className="booking-info-section">
                <div className="booking-info-content">
                    <h2>Why Choose Our Booking System?</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-icon"></div>
                            <h3>Confirmation & Reminders</h3>
                            <p>Get instant email confirmation with your appointment details, calendar link, and automatic reminders.</p>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon"></div>
                            <h3>Professional Therapists</h3>
                            <p>Choose from our experienced, licensed massage therapists for your session.</p>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon"></div>
                            <h3>Customized Experience</h3>
                            <p>Specify your preferences and special requests for a personalized massage experience.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
