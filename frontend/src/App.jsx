import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from './pages/HomePage'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import PayNow from './pages/PayNow'
import SearchPage from './pages/SearchPage'
import CategoryPage from './pages/CategoryPage'
import Login from './pages/Login'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<HomePage/>} />
        <Route path='/products' element={<Products/>}/>
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/category/:category" element={<CategoryPage />} />
        <Route path="/paynow" element={<PayNow />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  )
}

export default App