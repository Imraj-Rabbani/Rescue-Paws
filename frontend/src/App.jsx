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

const App = () => {
    return (
        <div>
            <ToastContainer />
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/volunteers" element={<VolunteerPage />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
                
                <Route path="/revenue" element={<RevenuePage />} />
            </Routes>
        </div>
    )
}

export default App