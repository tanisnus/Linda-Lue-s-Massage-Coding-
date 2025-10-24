

import './Service.css'
import { Link } from 'react-router-dom'
import spaPictureFirst from '../images/picture_one.jpg'
import spaPictureSecond from '../images/picture_two.jpg'
import spaPictureThird from '../images/picture_three.jpg'
import spaPictureFourth from '../images/picture_four.jpg'
import spaPictureFifth from '../images/picture_five.jpg'

export default function Service() {
    return (
        <div className="service-container">
            {/* Hero Section */}
            <section className="service-hero">
                <div className="hero-content">
                    <div className="wellbeing-badge">
                        {/* <span className="badge-text">Relaxation & Wellness</span> */}
                    </div>
                    <h1 className="main-heading">Our Services</h1>
                    <p className="description">
                        Experience the ultimate relaxation with our professional massage services. 
                        Choose from our range of treatments designed to rejuvenate your body and mind.
                    </p>
                    <Link to="/booking" className="book-now-button primary">
                        Book Now
                    </Link>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="services-content">
                    {/* Individual Massage Services */}
                    <div className="service-category">
                        <h2 className="category-title">Individual Massage Services</h2>
                        <div className="pricing-grid">


                            {/* 30 minutes - Service Offer */}
                            <div className="pricing-card">
                                <div className="image-div-container">
                                    <img src={spaPictureFirst} alt="woman-spa-1" />
                                </div>
                                <h3 className="service-name">30 Minutes</h3>
                                <p className="service-description">Swedish Massage</p>
                                <p className="service-subtitle">Perfect for a quick relaxation session</p>
                                <div className="price">$45.00</div>
                            </div>
                            
                            {/* 60 minutes - Service Offer*/}
                            <div className="pricing-card featured">
                                <div className="popular-badge">Most Popular</div>

                                {/* Image Div Container */}
                                <div className="image-div-container">
                                    <img src={spaPictureSecond} alt="spa-picture-second" />
                                </div>

                                <h3 className="service-name">60 Minutes</h3>
                                <p className="service-description">Swedish Massage</p>
                                <p className="service-subtitle">Our signature full-body massage experience</p>
                                <div className="price">$69.00</div>
                            </div>
                            
                            {/* 90 minutes - Service Offer */}
                            <div className="pricing-card">

                                {/* Image Div Container */}
                                <div className="image-div-container">
                                    <img src={spaPictureThird} alt="spa-picture-third" />
                                </div>

                                <h3 className="service-name">90 Minutes</h3>
                                <p className="service-description">Swedish Massage</p>
                                <p className="service-subtitle">Extended session for deep relaxation</p>
                                <div className="price">$99.00</div>
                            </div>
                            
                            {/* 120 minutes - Service Offer */}
                            <div className="pricing-card">

                                {/* Image Div Container */}
                                <div className="image-div-container">
                                    <img src={spaPictureFourth} alt="spa-picture-fourth" />
                                </div>

                                <h3 className="service-name">120 Minutes</h3>
                                <p className="service-description">Swedish Massage</p>
                                <p className="service-subtitle">Ultimate luxury massage experience</p>
                                <div className="price">$138.00</div>
                            </div>
                            
                            {/* PreNatal Massage - Service Offer */}
                            <div className="pricing-card">
                                <div className="image-div-container">
                                    <img src={spaPictureFirst} alt="spa-picture-six" />
                                </div>
                                <h3 className="service-name">60 Minutes</h3>
                                <p className="service-description">Prenatal Massage</p>
                                <p className="service-subtitle">Specialized massage for expecting mothers</p>
                                <div className="price">$80.00</div>
                            </div>
                            
                            {/* Deep Tissue Massage - Service Offer */}
                            <div className="pricing-card">
                                <div className="image-div-container">
                                    <img src={spaPictureThird} alt="spa-picture-six" />
                                </div>
                                <h3 className="service-name">60 Minutes</h3>
                                <p className="service-description">Deep Tissue Massage</p>
                                <p className="service-subtitle">Intensive therapy for muscle tension relief</p>
                                <div className="price">$80.00</div>
                            </div>
                        </div>
                    </div>




                    {/* Couple Massage Services */}
                    <div className="service-category">
                        <h2 className="category-title">Couple Massage</h2>
                        <div className="couple-massage-card">
                              {/* Image Div Container */}
                              <div className="image-div-container">
                                    <img src={spaPictureFifth} alt="spa-picture-fifth" />
                                </div>
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

                    {/* Call to Action Section */}
                    <div className="cta-section">
                        <h3 className="cta-title">Ready to Book Your Massage?</h3>
                        <p className="cta-description">
                            Choose your preferred service and book your appointment today. 
                            We're here to help you relax and rejuvenate.
                        </p>
                        <Link to="/booking" className="book-now-button secondary">
                            Book Your Appointment
                        </Link>
                    </div>

                    {/* Additional Information */}
                    <div className="additional-info">

                        <div className="info-card">
                            {/* <div className="info-icon"></div> */}
                            <h4>Booking Information</h4>
                            <p>All services include consultation and aftercare advice. Please arrive 15 minutes early for your appointment.</p>
                        </div>
                        
                        <div className="info-card">
                            {/* <div className="info-icon">🎁</div> */}
                            <h4>Gift Certificates</h4>
                            <p>Perfect for special occasions. Gift certificates are available for all services and never expire.</p>
                        </div>
                        
                        <div className="info-card">
                            {/* <div className="info-icon">⭐</div> */}
                            <h4>What's Included</h4>
                            <p>Professional massage oils, heated tables, calming music, and a peaceful environment for complete relaxation.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}