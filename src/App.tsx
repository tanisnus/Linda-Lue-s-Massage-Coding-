// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header'


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
          </Routes>
        </section>


      </Router>
    </>
  )
}

export default App
