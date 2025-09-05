import { useState } from 'react'
import './Contact.css'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        preferredDate: '',
        preferredTime: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false)
            setSubmitStatus('success')
            setFormData({
                name: '',
                email: '',
                phone: '',
                service: '',
                message: '',
                preferredDate: '',
                preferredTime: ''
            })
            
            // Reset status after 3 seconds
            setTimeout(() => setSubmitStatus(''), 3000)
        }, 2000)
    }

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
                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <div className="form-header">
                            <h2>Book Your Appointment</h2>
                            <p>Fill out the form below and we'll get back to you within 24 hours</p>
                        </div>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="service">Service Interest</label>
                                    <select
                                        id="service"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select a service</option>
                                        <option value="massage">Therapeutic Massage</option>
                                        <option value="facial">Natural Facial Treatment</option>
                                        <option value="aromatherapy">Aromatherapy Session</option>
                                        <option value="body-treatment">Body Treatment</option>
                                        <option value="wellness-package">Wellness Package</option>
                                        <option value="consultation">Free Consultation</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="preferredDate">Preferred Date</label>
                                    <input
                                        type="date"
                                        id="preferredDate"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="preferredTime">Preferred Time</label>
                                    <select
                                        id="preferredTime"
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select time</option>
                                        <option value="morning">Morning (9AM - 12PM)</option>
                                        <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                        <option value="evening">Evening (5PM - 8PM)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Tell us about your wellness goals or any specific requirements..."
                                />
                            </div>

                            <button 
                                type="submit" 
                                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner"></span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <span className="arrow">→</span>
                                    </>
                                )}
                            </button>

                            {submitStatus === 'success' && (
                                <div className="success-message">
                                    <span className="success-icon">✓</span>
                                    Thank you! We'll contact you soon to confirm your appointment.
                                </div>
                            )}
                        </form>
                    </div>

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
