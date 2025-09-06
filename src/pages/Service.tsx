

import './Service.css'

export default function Service() {
    return (
        <div className="service-container">
            {/* Hero Section */}
            <section className="service-hero">
                <div className="hero-content">
                    <div className="wellbeing-badge">
                        <span className="leaf-icon">🌿</span>
                        <span className="badge-text">Relaxation & Wellness</span>
                    </div>
                    <h1 className="main-heading">Our Services</h1>
                    <p className="description">
                        Experience the ultimate relaxation with our professional massage services. 
                        Choose from our range of treatments designed to rejuvenate your body and mind.
                    </p>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="services-content">
                    {/* Individual Massage Services */}
                    <div className="service-category">
                        <h2 className="category-title">Individual Massage Services</h2>
                        <div className="pricing-grid">
                            <div className="pricing-card">
                                <div className="service-icon">💆‍♀️</div>
                                <h3 className="service-name">30 Minutes</h3>
                                <p className="service-description">Perfect for a quick relaxation session</p>
                                <div className="price">$45.00</div>
                            </div>
                            
                            <div className="pricing-card featured">
                                <div className="popular-badge">Most Popular</div>
                                <div className="service-icon">💆‍♂️</div>
                                <h3 className="service-name">60 Minutes</h3>
                                <p className="service-description">Our signature full-body massage experience</p>
                                <div className="price">$69.00</div>
                            </div>
                            
                            <div className="pricing-card">
                                <div className="service-icon">🧘‍♀️</div>
                                <h3 className="service-name">90 Minutes</h3>
                                <p className="service-description">Extended session for deep relaxation</p>
                                <div className="price">$99.00</div>
                            </div>
                            
                            <div className="pricing-card">
                                <div className="service-icon">🌸</div>
                                <h3 className="service-name">120 Minutes</h3>
                                <p className="service-description">Ultimate luxury massage experience</p>
                                <div className="price">$138.00</div>
                            </div>
                        </div>
                    </div>

                    {/* Couple Massage Services */}
                    <div className="service-category">
                        <h2 className="category-title">Couple Massage</h2>
                        <div className="couple-massage-card">
                            <div className="couple-icon">💑</div>
                            <div className="couple-content">
                                <h3 className="couple-title">60 Minutes Couple Massage</h3>
                                <p className="couple-description">
                                    Share the relaxation experience with your loved one. 
                                    Side-by-side massage in our tranquil couples room.
                                </p>
                                <div className="couple-price">$138.00</div>
                                <div className="couple-note">*Price is for both people</div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="additional-info">
                        <div className="info-card">
                            <div className="info-icon">📅</div>
                            <h4>Booking Information</h4>
                            <p>All services include consultation and aftercare advice. Please arrive 15 minutes early for your appointment.</p>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">🎁</div>
                            <h4>Gift Certificates</h4>
                            <p>Perfect for special occasions. Gift certificates are available for all services and never expire.</p>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">⭐</div>
                            <h4>What's Included</h4>
                            <p>Professional massage oils, heated tables, calming music, and a peaceful environment for complete relaxation.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}