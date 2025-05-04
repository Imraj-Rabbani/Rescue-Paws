import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartMessage, setCartMessage] = useState(null);

  // NEW: Product caching
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/auth/status`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsLoggedIn(true);
        setUserData(res.data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const fetchProducts = async () => {
    setProductLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/products`);
      setProductData(res.data);
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

    setCartMessage(`${product.name} added to cart`);
    setTimeout(() => setCartMessage(null), 2000);
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
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    cartMessage,
    productData,
    productLoading,
    fetchProducts
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
