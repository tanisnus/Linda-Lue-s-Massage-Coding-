import './Home.css'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="home-container">



            
            {/* Left Content Section */}
            <div className="left-content">
                <div className="content-wrapper">
                    {/* Wellbeing Badge */}
                    <div className="wellbeing-badge">
                        <span className="leaf-icon">🌿</span>
                        <span className="badge-text">YOUR WELLBEING</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="main-heading">
                        100% Natural Beauty and Spa Centre
                    </h1>

                    {/* Description */}
                    <p className="description">
                        Experience the ultimate relaxation with our natural treatments. 
                        Let our expert therapists help you unwind and restore your inner balance 
                        through traditional massage techniques and modern wellness practices.
                    </p>

                    {/* CTA Button */}
                    <Link to="/service" className="cta-button">
                        OUR SERVICES
                        <span className="arrow">→</span>
                    </Link>

                    {/* Slider Dots */}
                    <div className="slider-dots">
                        <div className="dot active"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>

                    {/* Bamboo Decoration */}
                    <div className="bamboo-decoration">🎋</div>
                </div>
            </div>




            {/* Right Image Section */}
            <div className="right-content">
                <div className="image-container">
                    {/* Main Oval Image */}
                    <div className="main-image">
                        <div className="oval-frame">
                            <div className="spa-scene">
                                <div className="person-receiving-massage">
                                    <div className="lily-flower">🌸</div>
                                </div>
                                <div className="massage-hands">🤲</div>
                                <div className="spa-products">
                                    <div className="herbal-compress">🌿</div>
                                    <div className="aromatherapy-bottles">🧴</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Circular Image */}
                    <div className="secondary-image">
                        <div className="circular-frame">
                            <div className="facial-treatment">💆‍♀️</div>
                        </div>
                    </div>

                    {/* Spa Stones Decoration */}
                    <div className="spa-stones">🪨</div>
                </div>
            </div>

            {/* Social Media Sidebar */}
            <div className="social-sidebar">
                <div className="social-icon">📘</div>
                <div className="social-icon">🐦</div>
                <div className="social-icon">📌</div>
                <div className="social-icon">📷</div>
            </div>

            
        </div>
    )
}
