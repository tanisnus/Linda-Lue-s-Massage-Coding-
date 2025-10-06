import './Home.css'
import { Link } from 'react-router-dom'
// import SpaPictureTwo from '../images/picture_two.jpg'
import SpaPictureOne from '../images/picture_one.jpg'

export default function Home() {
    return (
        <div className="home-container">
            {/* Hero Banner Section */}
            <section className="hero-banner">
                {/* Sliding Background Image */}
                <div className="sliding-background">
                    <img src={SpaPictureOne} alt="spa-background" className="background-image" />
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
                        <h1 className="main-heading">
                            Relax, Recover & Recharge
                        </h1>
                        <p className="sub-heading">
                            With the most affordable organic Thai Spa in town
                        </p>
                        
                        <Link to="/service" className="cta-button">
                            EXPLORE NOW
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}
