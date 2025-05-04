import { useState, useEffect, createContext } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  // Auth check
  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/auth/status`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsLoggedIn(true);
        setUserData(res.data.user);
      }
    } catch {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  // Product fetch
  const fetchProducts = async () => {
    setProductLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/products`);
      setProductData(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    fetchProducts();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    userData,
    setIsLoggedIn,
    setUserData,
    checkAuthStatus,
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
