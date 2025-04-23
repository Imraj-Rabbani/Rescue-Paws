import React from 'react'
import { Routes, Route } from 'react-router'
import Login from './pages/Login'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from './pages/HomePage'
import Products from './pages/Products'
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/login'element={<Login/>} />
        <Route path='/'element={<HomePage/>} />
        <Route path='/products'element={<Products/>}/>
      </Routes>
    </div>
  )
}

export default App
