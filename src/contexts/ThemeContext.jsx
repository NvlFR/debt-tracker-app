// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Buat Context
const ThemeContext = createContext();

// 2. Buat Custom Hook untuk menggunakan Context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// 3. Buat Provider untuk membungkus komponen yang membutuhkan tema
export const ThemeProvider = ({ children }) => {
  // Ambil tema dari localStorage atau default ke 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  // Efek samping untuk menerapkan tema ke elemen <html> dan menyimpan ke localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Fungsi untuk toggle tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};