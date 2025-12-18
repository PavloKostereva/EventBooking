'use client';
import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode, mounted]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};