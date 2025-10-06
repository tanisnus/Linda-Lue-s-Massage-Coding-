import './Home.css'
import { Link } from 'react-router-dom'
import SpaPictureTwo from '../images/picture_two.jpg'

export default function Home() {
    return (
        <div className="home-container">
            {/* Hero Banner Section */}
            <section className="hero-banner">
                {/* Sliding Background Image */}
                <div className="sliding-background">
                    <img src={SpaPictureTwo} alt="spa-background" className="background-image" />
                </div>
                
                {/* Spa Elements Overlay
                <div className="spa-elements">
                    <div className="candles">
                        <div className="candle candle-1"></div>
                        <div className="candle candle-2"></div>
                    </div>
                    <div className="herbal-compress"></div>
                    <div className="oil-bottles">
                        <div className="bottle bottle-1"></div>
                        <div className="bottle bottle-2"></div>
                    </div>
                    <div className="plumeria-flower"></div>
                    <div className="massage-tools"></div>
                </div> */}

                {/* Content Overlay */}
                <div className="hero-content">
                    <div className="content-wrapper">
                        <p className="permission-text">Give yourself permission</p>
                        <h1 className="main-heading">
                            Relax, Revive & Rejuvenate
                        </h1>
                        <p className="sub-heading">
                            with the most affordable organic spa in town
                        </p>
                        
                        <Link to="/service" className="cta-button">
                            EXPLORE NOW
                        </Link>
                    </div>
                </div>
            </section>

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
