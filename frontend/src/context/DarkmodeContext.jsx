// src/context/DarkmodeContext.jsx (or DarkModeContext.jsx)
import React, { useState, createContext, useEffect } from 'react';

export const DarkmodeContext = createContext(); 
export const DarkmodeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark' || false;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <DarkmodeContext.Provider value={{ isDarkMode, toggleDarkMode }}> 
      {children}
    </DarkmodeContext.Provider>
  );
};