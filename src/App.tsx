// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'


import Header from './components/header'
import Home from './pages/Home'
import Service from './pages/Service'
import Contact from './pages/Contact'
import Booking from './pages/Booking'
import CancelBooking from './pages/CancelBooking'
import CancellationConfirmed from './pages/CancellationConfirmed'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import NotFound from './pages/NotFound'



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
          <Suspense fallback={<div style={{ padding: '120px 20px', textAlign: 'center' }}>Loading...</div>}>
            <Routes>
              <Route element={<Home />} path='/'></Route>
              <Route element={<Service />} path='/service'></Route>
              <Route element={<Contact />} path='/contact'></Route>
              <Route element={<Booking />} path='/booking'></Route>
              <Route element={<CancelBooking />} path='/cancel-booking'></Route>
              <Route element={<CancellationConfirmed />} path='/cancellation-confirmed'></Route>
              <Route element={<NotFound />} path='*'></Route>
            </Routes>
          </Suspense>
        </section>


      </Router>
    </>
  )
}

export default App
