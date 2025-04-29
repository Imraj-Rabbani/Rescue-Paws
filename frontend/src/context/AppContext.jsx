import { useState, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); // Changed from false to null for better semantics

    // Add a function to check auth status when app loads
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
            setIsLoggedIn(false);
            setUserData(null);
        }
    };

    // Check auth status on initial load
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData, 
        setUserData,
        checkAuthStatus 
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};