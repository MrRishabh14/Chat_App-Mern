import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import HomePage from './pages/HomePage.jsx'
import {Toster} from 'react-hot-toast'

const App = () => {
  return (
    <div className='bg-[url("./src/assets/bgImage.svg")] bg-contain'>
      <Toster/>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App
