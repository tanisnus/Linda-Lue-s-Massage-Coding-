import logo from '../images/logo.jpg'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import './header.css'


export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <>

        {/* Header Navigation Section */}
        <nav className="header-section"> 

            {/* Top Left (Logo) */}
            <div className='top-left-logo-div'>
                <img className='logo-img' src={logo} alt='logo' />
            </div>

            {/* Mobile Menu Button */}
            <button 
                className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Desktop Navigation */}
            <ul className='top-right-navigation-list desktop-nav'>
                <li>
                    <Link to='/'>Home</Link>
                </li>

                <li>
                    <Link to='/service'>Services</Link>
                </li>

                <li>
                    <Link to='/contact'>Contact Us</Link>
                </li>
            </ul>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul className='mobile-navigation-list'>
                    <li>
                        <Link to='/' onClick={closeMobileMenu}>Home</Link>
                    </li>

                    <li>
                        <Link to='/service' onClick={closeMobileMenu}>Services</Link>
                    </li>

                    <li>
                        <Link to='/contact' onClick={closeMobileMenu}>Contact Us</Link>
                    </li>
                </ul>
            </div>

        </nav>

        </>
    )

}