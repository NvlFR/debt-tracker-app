// src/components/layout/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth untuk akses user dan logout
import { useTheme } from '../../contexts/ThemeContext'; // Import useTheme untuk toggle tema
import { SunIcon, MoonIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline'; // Ikon
import { toast } from 'react-toastify'; // Untuk notifikasi logout

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Berhasil logout!');
      // Redireksi akan ditangani oleh PrivateRoute di App.jsx
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Gagal logout.');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo atau Nama Aplikasi */}
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-primary-dark dark:text-primary-light">DebtWise</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Tombol Toggle Tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {/* Avatar Pengguna dan Dropdown (Opsional, untuk nanti jika ada fitur profil) */}
            {currentUser && (
              <div className="relative group">
                <button
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-300" />
                  <span className="ml-2 text-gray-700 dark:text-gray-200 hidden md:block">{currentUser.email}</span>
                </button>
                {/* Dropdown menu - bisa diaktifkan dengan state */}
                <div
                  className="hidden group-hover:block absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">Profil Anda</Link>
                  <Link to="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">Pengaturan</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;