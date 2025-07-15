// // src/pages/AuthPage.jsx
// import React, { useState } from 'react';
// import LoginForm from '../components/auth/LoginForm';
// import RegisterForm from '../components/auth/RegisterForm';
// import { useTheme } from '../contexts/ThemeContext'; // Untuk tema
// import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Untuk ikon
// import { useNavigate } from 'react-router-dom';


// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true); // State untuk menentukan apakah mode login atau register
//   const { theme, toggleTheme } = useTheme();
//    const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4
//                     bg-background-light text-text-light
//                     dark:bg-background-dark dark:text-text-dark
//                     transition-colors duration-300">

//       {/* Tombol Dark/Light Mode */}
//       <button
//         onClick={toggleTheme}
//         className="absolute top-4 right-4 p-2 rounded-full
//                    bg-gray-200 dark:bg-gray-700
//                    text-gray-800 dark:text-gray-200
//                    hover:bg-gray-300 dark:hover:bg-gray-600
//                    transition-colors duration-200"
//         aria-label="Toggle dark mode"
//       >
//         {theme === 'light' ? (
//           <MoonIcon className="h-6 w-6" />
//         ) : (
//           <SunIcon className="h-6 w-6" />
//         )}
//       </button>

//       <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
//         <h1 className="text-3xl font-bold text-center mb-6 text-primary-light dark:text-primary-dark">
//           {isLogin ? 'Masuk' : 'Daftar'}
//         </h1>

//         <div className="flex justify-center mb-6">
//           <button
//             onClick={() => setIsLogin(true)}
//             className={`px-6 py-2 rounded-l-lg text-lg font-semibold
//                         ${isLogin
//                           ? 'bg-primary-light dark:bg-primary-dark text-white shadow-md'
//                           : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
//                         transition-all duration-300 ease-in-out`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setIsLogin(false)}
//             className={`px-6 py-2 rounded-r-lg text-lg font-semibold
//                         ${!isLogin
//                           ? 'bg-primary-light dark:bg-primary-dark text-white shadow-md'
//                           : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
//                         transition-all duration-300 ease-in-out`}
//           >
//             Register
//           </button>
//         </div>

//         {/* Render form berdasarkan state isLogin */}
//         {isLogin ? <LoginForm /> : <RegisterForm />}
//       </div>
//     </div>
//   );
// };

// export default AuthPage;


// src/pages/AuthPage.jsx
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// Pastikan path ini benar dan komponen ini ada dan memiliki logika autentikasi
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

// SVG Icon Components (Biarkan saja, tidak ada masalah di sini)
const SunIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
  </svg>
);

const MoonIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const UserIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const UserPlusIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

const MailIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <circle cx="12" cy="16" r="1"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [theme, setTheme] = useState('light');
  // const navigate = useNavigate(); // useNavigate tidak digunakan secara langsung di sini lagi

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // Tambahkan atau hapus class 'dark' dari elemen html
    document.documentElement.classList.toggle('dark', theme === 'light');
  };

  // HAPUS DEFINISI KOMPONEN LoginForm DAN RegisterForm DI SINI!
  // Karena Anda sudah mengimpornya dari '../components/auth/'

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl ${
          theme === 'dark' ? 'bg-purple-500' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl ${
          theme === 'dark' ? 'bg-blue-500' : 'bg-purple-300'
        }`}></div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 z-50 ${
          theme === 'dark'
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-white shadow-lg'
        }`}
      >
        {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
      </button>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className={`w-full max-w-md backdrop-blur-sm rounded-2xl shadow-2xl border transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gray-800/40 border-gray-700/50'
            : 'bg-white/80 border-white/50'
        }`}>

          {/* Header */}
          <div className="p-8 pb-6">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}>
                {isLogin ? <UserIcon className="text-white" size={24} /> : <UserPlusIcon className="text-white" size={24} />}
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isLogin ? 'Masuk ke akun Anda' : 'Daftar untuk memulai'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className={`flex rounded-xl p-1 mb-6 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLogin
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white text-blue-600 shadow-md'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !isLogin
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white text-blue-600 shadow-md'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Daftar
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 pb-8">
            {/* Gunakan komponen form yang sudah diimpor */}
            {isLogin ? (
              <LoginForm />
            ) : (
              <RegisterForm />
            )}

            {/* Additional Links */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className={`ml-1 font-medium transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'text-purple-400 hover:text-purple-300'
                      : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;