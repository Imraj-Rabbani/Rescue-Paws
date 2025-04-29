import React from 'react'
import { Routes, Route } from 'react-router-dom'; // Import BrowserRouter and Route
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import OrderPage from './components/OrderPage';
import ProductPage from './components/ProductPage';
import VolunteerPage from './components/VolunteerPage';
import AdminDashboard from './pages/AdminDashboard';
import RevenuePage from './components/RevenuePage'; // Import the new component
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
        <Route path="/adminorders" element={<OrderPage />} />
        <Route path="/adminproducts" element={<ProductPage />} />
        <Route path="/adminvolunteers" element={<VolunteerPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/revenue" element={<RevenuePage />} />
      </Routes>
    </div>
  )
}

export default App