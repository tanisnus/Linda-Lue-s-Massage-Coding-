import logo from '../images/logo.jpg'

import {Link} from 'react-router-dom'
import './header.css'


export default function Header() {

    return (
        <>

        {/* Header Navigation Section */}
        <nav className="header-section"> 

            {/* Top Left (Logo) */}
            <div className='top-left-logo-div'>
                <img className='logo-img' src={logo} alt='logo' />
            </div>



            {/* Top Right (Navigation) */}
            <ul className='top-right-navigation-list'>
                <li>
                    <Link to='/'>Home</Link>
                </li>

                <li>
                    <Link to='/'>Services</Link>
                </li>

                <li>
                    <Link to='/'>Contact Us</Link>
                </li>
            </ul>


        </nav>




        </>
    )

}