import './Contact.css'

export default function Contact() {

    return (
        <div className="contact-container">
            {/* Hero Section */}
            <div className="contact-hero">
                <div className="hero-content">
                    <div className="wellbeing-badge">
                        <span className="leaf-icon">🌿</span>
                        <span className="badge-text">GET IN TOUCH</span>
                    </div>
                    <h1 className="hero-title">Contact Our Spa</h1>
                    <p className="hero-description">
                        Ready to begin your wellness journey? Contact us to book your appointment 
                        or learn more about our natural beauty and spa treatments.
                    </p>
                </div>
                <div className="hero-decoration">
                    <div className="spa-elements">
                        <div className="floating-leaf">🍃</div>
                        <div className="floating-stone">🪨</div>
                        <div className="floating-flower">🌸</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="contact-main">
                <div className="contact-content">
                    {/* Contact Information */}
                    <div className="contact-info-section">
                        <div className="info-card">
                            <div className="info-header">
                                <h3>Visit Our Spa</h3>
                                <div className="location-icon">📍</div>
                            </div>
                            <div className="info-content">
                                <p><strong>Linda Lue's Massage & Spa</strong></p>
                                <p>123 Wellness Avenue<br />
                                Serenity District<br />
                                Peaceful City, PC 12345</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-header">
                                <h3>Call Us</h3>
                                <div className="phone-icon">📞</div>
                            </div>
                            <div className="info-content">
                                <p><strong>Phone:</strong> (555) 123-WELL</p>
                                <p><strong>Text:</strong> (555) 123-9355</p>
                                <p><em>Available 9AM - 8PM daily</em></p>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-header">
                                <h3>Business Hours</h3>
                                <div className="clock-icon">🕒</div>
                            </div>
                            <div className="info-content">
                                <div className="hours-list">
                                    <div className="hours-item">
                                        <span>Monday - Friday</span>
                                        <span>9:00 AM - 8:00 PM</span>
                                    </div>
                                    <div className="hours-item">
                                        <span>Saturday</span>
                                        <span>9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="hours-item">
                                        <span>Sunday</span>
                                        <span>10:00 AM - 5:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-header">
                                <h3>Follow Us</h3>
                                <div className="social-icon">📱</div>
                            </div>
                            <div className="info-content">
                                <div className="social-links">
                                    <a href="#" className="social-link">📘 Facebook</a>
                                    <a href="#" className="social-link">📷 Instagram</a>
                                    <a href="#" className="social-link">🐦 Twitter</a>
                                    <a href="#" className="social-link">📌 Pinterest</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Special Offers Section */}
            <div className="special-offers">
                <div className="offers-content">
                    <h3>Special Offers</h3>
                    <div className="offers-grid">
                        <div className="offer-card">
                            <div className="offer-icon">🎁</div>
                            <h4>First Time Guest</h4>
                            <p>20% off your first massage treatment</p>
                        </div>
                        <div className="offer-card">
                            <div className="offer-icon">💆‍♀️</div>
                            <h4>Wellness Package</h4>
                            <p>Save 15% when you book 3+ services</p>
                        </div>
                        <div className="offer-card">
                            <div className="offer-icon">👥</div>
                            <h4>Couples Special</h4>
                            <p>Book together and save 10% each</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
