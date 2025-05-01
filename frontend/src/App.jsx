import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages and Components
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import PayNow from './pages/PayNow';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import ProfilePage from './pages/Profile';
import VolunteersPage from './pages/VolunteersPage';
import OrderPage from './components/OrderPage';
import ProductPage from './components/ProductPage';
import VolunteerPage from './components/VolunteerPage';
import AdminDashboard from './pages/AdminDashboard';
import RevenuePage from './components/RevenuePage';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/category/:category" element={<CategoryPage />} />
        <Route path="/paynow" element={<PayNow />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/volunteers" element={<VolunteersPage />} />
        <Route path="/adminorders" element={<OrderPage />} />
        <Route path="/adminproducts" element={<ProductPage />} />
        <Route path="/adminvolunteers" element={<VolunteerPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/revenue" element={<RevenuePage />} />
      </Routes>
    </div>
  );
};

export default App;
