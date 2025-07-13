// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useTheme } from '../contexts/ThemeContext'; // Untuk tema
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Untuk ikon

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // State untuk menentukan apakah mode login atau register
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-4
                    bg-background-light text-text-light
                    dark:bg-background-dark dark:text-text-dark
                    transition-colors duration-300">

      {/* Tombol Dark/Light Mode */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full
                   bg-gray-200 dark:bg-gray-700
                   text-gray-800 dark:text-gray-200
                   hover:bg-gray-300 dark:hover:bg-gray-600
                   transition-colors duration-200"
        aria-label="Toggle dark mode"
      >
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6" />
        ) : (
          <SunIcon className="h-6 w-6" />
        )}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary-light dark:text-primary-dark">
          {isLogin ? 'Masuk' : 'Daftar'}
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 rounded-l-lg text-lg font-semibold
                        ${isLogin
                          ? 'bg-primary-light dark:bg-primary-dark text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                        transition-all duration-300 ease-in-out`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 rounded-r-lg text-lg font-semibold
                        ${!isLogin
                          ? 'bg-primary-light dark:bg-primary-dark text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                        transition-all duration-300 ease-in-out`}
          >
            Register
          </button>
        </div>

        {/* Render form berdasarkan state isLogin */}
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;