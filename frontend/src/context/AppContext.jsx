import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [showCartRestorePrompt, setShowCartRestorePrompt] = useState(false);

  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  axios.defaults.withCredentials = true;

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/auth/status`);
      if (res.data.success) {
        setIsLoggedIn(true);
        setUserData(res.data.user);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setAuthChecked(true);
    }
  };

  const fetchProducts = async () => {
    setProductLoading(true);

    const cached = localStorage.getItem("productData");
    if (cached) {
      console.log("✅ Loaded products from localStorage");
      setProductData(JSON.parse(cached));
      setProductLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${backendUrl}/api/products`);

      // ✅ Slim down product data before caching
      const slimmedProducts = res.data.map(p => ({
        id: p.id || p._id,
        name: p.name,
        sellingPrice: p.sellingPrice,
        stockQuantity: p.stockQuantity,
        category: p.category,
        imageUrl: p.imageUrl, // no base64, only URLs
        discount: p.discount || 0,
        description: p.description || "",
        rating: p.rating || 0
      }));

      setProductData(slimmedProducts);
      localStorage.setItem("productData", JSON.stringify(slimmedProducts));
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse local cart:", err);
      }
    }

    const cachedProducts = localStorage.getItem("productData");
    if (cachedProducts) {
      setProductData(JSON.parse(cachedProducts));
      setProductLoading(false);
    } else {
      fetchProducts();
    }
  }, []);

  // ✅ Save slimmed cart to localStorage
  useEffect(() => {
    const slimmedCart = cart.map(item => ({
      id: item.id,
      quantity: item.quantity,
      name: item.name,
      sellingPrice: item.sellingPrice,
      imageUrl: item.imageUrl
    }));

    try {
      localStorage.setItem("cart", JSON.stringify(slimmedCart));
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cart]);

  useEffect(() => {
    const syncCartWithBackend = async () => {
      if (isLoggedIn && userData) {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        if (localCart.length > 0) {
          setShowCartRestorePrompt(true);
          return;
        }

        try {
          const res = await axios.get(`${backendUrl}/api/user/cart`);
          setCart(res.data.cart || []);
        } catch (err) {
          console.error("Failed to load backend cart:", err);
        }
      }
    };

    syncCartWithBackend();
  }, [isLoggedIn, userData, backendUrl]);

  const restoreCartFromLocal = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const res = await axios.get(`${backendUrl}/api/user/cart`);
      const dbCart = res.data.cart || [];

      const mergedCart = [...dbCart];

      localCart.forEach(localItem => {
        const found = mergedCart.find(i => i.id === localItem.id);
        if (found) {
          found.quantity += localItem.quantity;
        } else {
          mergedCart.push(localItem);
        }
      });

      setCart(mergedCart);
      await axios.post(`${backendUrl}/api/user/cart`, { items: mergedCart });
      localStorage.removeItem("cart");
      setShowCartRestorePrompt(false);
    } catch (err) {
      console.error("Failed to restore cart:", err);
    }
  };

  const discardLocalCart = () => {
    localStorage.removeItem("cart");
    setShowCartRestorePrompt(false);
  };

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

  const resetCart = () => {
    setCart([]);
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
    resetCart,
    updateCartItemQuantity,
    removeFromCart,
    productData,
    productLoading,
    fetchProducts,
    showCartRestorePrompt,
    restoreCartFromLocal,
    discardLocalCart
  };

  return (
    <AppContext.Provider value={value}>
      {authChecked ? props.children : <div className="text-center py-10 text-gray-500">Loading...</div>}
    </AppContext.Provider>
  );
};
