// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom'; // Gunakan NavLink untuk styling aktif
import {
  HomeIcon,
  ArrowDownCircleIcon, // Untuk Utang
  ArrowUpCircleIcon,   // Untuk Piutang
  ChartBarIcon,        // Untuk Laporan/Dashboard
  Cog6ToothIcon,       // Untuk Pengaturan
  UserIcon             // Untuk Profil
} from '@heroicons/react/24/outline'; // Ikon

const Sidebar = () => {
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Utang', path: '/dashboard/debts', icon: ArrowDownCircleIcon },
    { name: 'Piutang', path: '/dashboard/receivables', icon: ArrowUpCircleIcon },
    // { name: 'Laporan', path: '/dashboard/reports', icon: ChartBarIcon }, // Opsional, jika mau ada halaman laporan
    { name: 'Profil', path: '/dashboard/profile', icon: UserIcon },
    { name: 'Pengaturan', path: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <span className="text-2xl font-bold text-primary-dark dark:text-primary-light">DebtWise</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
              ${isActive
                ? 'bg-primary-light text-white shadow-md'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="h-6 w-6 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;