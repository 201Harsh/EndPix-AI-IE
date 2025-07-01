import React from 'react'
import Welcome from '../Pages/Welcome'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from '../Pages/Register'
import Login from '../Pages/Login'
import Dashboard from '../Pages/Dashboard'
import OtpVerification from '../Pages/OtpVerification'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/otp-verify" element={<OtpVerification />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router