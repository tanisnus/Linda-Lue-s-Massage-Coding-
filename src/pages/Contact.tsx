import './Contact.css'
import PageMeta from '../components/PageMeta'

export default function Contact() {

    return (
        <div className="contact-container">
            <PageMeta
                title="Contact"
                description="Visit Linda Lue's Massage at 15147 Ventura Blvd, Sherman Oaks, CA 91403. Call or message us for hours, directions, and appointments."
                path="/contact"
            />
            <div className="contact-main">
                <h1 className="contact-title">Contact Information</h1>
                <div className="contact-info-section">
                    <div className="info-card">
                        <div className="info-header">
                            <div className="info-icon location-icon">📍</div>
                            <h3>Visit Our Spa</h3>
                        </div>
                        <div className="info-content">
                            <a 
                                href="https://www.google.com/maps/search/?api=1&query=15147+Ventura+Blvd+Sherman+Oaks+CA+91403" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="address-link"
                            >
                                <p>15147 Ventura Blvd<br />
                                Sherman Oaks, CA 91403</p>
                            </a>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-header">
                            <div className="info-icon phone-icon">📞</div>
                            <h3>Call or Text Us</h3>
                        </div>
                        <div className="info-content">
                            <a href="tel:+18183797079" className="phone-link">
                                <p>(818) 379-7079</p>
                            </a>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-header">
                            <div className="info-icon social-icon">💬</div>
                            <h3>Social Media</h3>
                        </div>
                        <div className="info-content">
                            <div className="social-links">
                                <a href="https://www.instagram.com/lindaluesmassage/" target="_blank" rel="noopener noreferrer" className="social-link">
                                    Instagram: @lindaluesmassage
                                </a>
                                <a href="https://www.tiktok.com/@linda.lues.massag" target="_blank" rel="noopener noreferrer" className="social-link">
                                    TikTok: @linda.lues.massag
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-header">
                            <div className="info-icon clock-icon">🕒</div>
                            <h3>Business Hours</h3>
                        </div>
                        <div className="info-content">
                            <div className="hours-list">
                                <div className="hours-item">
                                    <span>Monday</span>
                                    <span>10:00 AM - 9:00 PM</span>
                                </div>
                                <div className="hours-item">
                                    <span>Tuesday</span>
                                    <span>10:00 AM - 9:00 PM</span>
                                </div>
                                <div className="hours-item">
                                    <span>Wednesday</span>
                                    <span>10:00 AM - 9:00 PM</span>
                                </div>
                                <div className="hours-item">
                                    <span>Thursday</span>
                                    <span>10:00 AM - 9:00 PM</span>
                                </div>
                                <div className="hours-item">
                                    <span>Friday</span>
                                    <span>10:00 AM - 9:00 PM</span>
                                </div>
                                <div className="hours-item">
                                    <span>Saturday</span>
                                    <span>10:00 AM - 9:00 PM</span>
                                </div>
                                <div className="hours-item">
                                    <span>Sunday</span>
                                    <span>10:00 AM - 9:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
