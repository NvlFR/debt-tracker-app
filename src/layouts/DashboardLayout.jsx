// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

import {
  HomeIcon,
  ChartBarIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'; // Ganti ke outline untuk beberapa ikon

const DashboardLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth(); // Ambil fungsi logout dan user dari AuthContext
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Utang', icon: ArrowDownCircleIcon, path: '/dashboard/debts' },
    { name: 'Piutang', icon: ArrowUpCircleIcon, path: '/dashboard/receivables' },
    { name: 'Laporan', icon: ChartBarIcon, path: '/dashboard/reports' },
  ];

  const bottomNavLinks = [
    { name: 'Profil', icon: UserCircleIcon, path: '/dashboard/profile' },
    { name: 'Pengaturan', icon: Cog6ToothIcon, path: '/dashboard/settings' },
  ];

  // Fungsi logout yang sebenarnya
  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari context
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-gray-900 text-text-light dark:text-text-dark transition-colors duration-300">

      {/* Mobile Sidebar Toggle Button (Burger Menu) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden absolute top-4 left-4 p-2 rounded-md
                   bg-gray-200 dark:bg-gray-700
                   text-gray-800 dark:text-gray-200
                   hover:bg-gray-300 dark:hover:bg-gray-600
                   z-50 transition-colors duration-200"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        md:relative md:translate-x-0
                        w-64 bg-white dark:bg-gray-800 shadow-lg md:shadow-none
                        p-6 flex flex-col z-40 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            DebtTracker
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hidden md:block // Sembunyikan di mobile
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
        </div>

        {/* User Info di Sidebar */}
        {user && (
          <div className="mb-6 flex items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            <UserCircleIcon className="h-8 w-8 text-primary-light dark:text-primary-dark mr-3" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name || 'Pengguna'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-grow">
          <ul>
            {navLinks.map((link) => (
              <li key={link.name} className="mb-2">
                <Link
                  to={link.path}
                  className="flex items-center p-3 rounded-lg text-lg font-medium
                             text-gray-700 dark:text-gray-300 hover:bg-primary-light hover:text-white
                             dark:hover:bg-primary-dark transition-colors duration-200"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <link.icon className="h-6 w-6 mr-3" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Navigation / User Options */}
        <nav className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <ul>
            {bottomNavLinks.map((link) => (
              <li key={link.name} className="mb-2">
                <Link
                  to={link.path}
                  className="flex items-center p-3 rounded-lg text-lg font-medium
                             text-gray-700 dark:text-gray-300 hover:bg-primary-light hover:text-white
                             dark:hover:bg-primary-dark transition-colors duration-200"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <link.icon className="h-6 w-6 mr-3" />
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="mt-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg text-lg font-medium
                           text-red-500 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400
                           transition-colors duration-200"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;