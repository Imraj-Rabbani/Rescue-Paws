import React from 'react'
import { Routes, Route } from 'react-router'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/login'element={<Login/>} />
        <Route path='/email-verify'element={<EmailVerify/>} />
      </Routes>
    </div>
  )
}

export default App
