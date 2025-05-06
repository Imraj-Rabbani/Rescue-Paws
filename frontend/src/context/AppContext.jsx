import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);

  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  axios.defaults.withCredentials = true;

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/auth/status`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsLoggedIn(true);
        setUserData(res.data.user);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);
      console.error("Auth check failed:", error);
    } finally {
      setAuthChecked(true);
    }
  };

  const fetchProducts = async () => {
    if (productData.length > 0) return;
    setProductLoading(true);
    try {
      const cached = localStorage.getItem("productDataCache");
      const expiry = localStorage.getItem("productDataExpiry");
      const now = Date.now();

      if (cached && expiry && now < parseInt(expiry)) {
        setProductData(JSON.parse(cached));
      } else {
        const res = await axios.get(`${backendUrl}/api/products`);
        setProductData(res.data);
        localStorage.setItem("productDataCache", JSON.stringify(res.data));
        localStorage.setItem("productDataExpiry", (now + 10 * 60 * 1000).toString());
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    fetchProducts();
  }, []);

  const addToCart = (product, quantity = 1) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    toast.success(`🛒 ${product.name} added to cart`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };

  const updateCartItemQuantity = (id, quantity) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    checkAuthStatus,
    cart,
    setCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    productData,
    productLoading,
    fetchProducts
  };

  return (
    <AppContext.Provider value={value}>
      {authChecked ? props.children : <div className="text-center py-10 text-gray-500">Loading...</div>}
    </AppContext.Provider>
  );
};
