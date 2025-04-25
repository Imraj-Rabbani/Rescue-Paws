import React from 'react'
import { Routes, Route } from 'react-router'
import Login from './pages/Login'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from './pages/HomePage'
import Products from './pages/Products'
import Cart from './pages/Cart'
import ProfilePage from './pages/Profile'
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/login'element={<Login/>} />
        <Route path='/'element={<HomePage/>} />
        <Route path='/products'element={<Products/>}/>
        <Route path="/cart" element={<Cart/>} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
    </div>
  )
}

export default App
