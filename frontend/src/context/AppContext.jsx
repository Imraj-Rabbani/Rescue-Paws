import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartMessage, setCartMessage] = useState(null); // message to show temporary cart action

  // ✅ Check login status on load
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/status`, {
        withCredentials: true
      });
      if (response.data.success) {
        setIsLoggedIn(true);
        setUserData(response.data.user);
      }
    } catch (error) {
        console.error("Auth check failed:", error); // now 'error' is used
        setIsLoggedIn(false);
        setUserData(null);
      }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ✅ Add to Cart with visual feedback
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
    setTimeout(() => setCartMessage(null), 2000); // Message clears after 2 seconds
  };

  // ✅ Update Cart Quantity
  const updateCartItemQuantity = (id, quantity) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  // ✅ Remove Item from Cart
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
    cartMessage
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
