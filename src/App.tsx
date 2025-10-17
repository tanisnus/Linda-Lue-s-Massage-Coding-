// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'


import Header from './components/header'
import Home from './pages/Home'
import Service from './pages/Service'
import Contact from './pages/Contact'
import Booking from './pages/Booking'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  // const [count, setCount] = useState(0)

  return (
    <>

      <Router>

      {/* Section (Header) */}

        <section className='header-section'>
          <Header />
        </section>


      {/* Section (Main) */}
        <section className='main-section'>
          <Routes>

            <Route element={<Home />} path='/'></Route>
            <Route element={<Service />} path='/service'></Route>
            <Route element={<Contact />} path='/contact'></Route>
            <Route element={<Booking />} path='/booking'></Route>

          </Routes>
        </section>


      </Router>
    </>
  )
}

export default App
