import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
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
  XMarkIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const DashboardLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const location = useLocation();

  const bottomNavLinks = [
    { name: "Profil", icon: UserCircleIcon, path: "/dashboard/profile" },
    { name: "Pengaturan", icon: Cog6ToothIcon, path: "/dashboard/settings" },
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleTransactionDropdown = () => {
    setIsTransactionOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 p-2 rounded-lg
                   bg-white dark:bg-gray-800 shadow-lg
                   text-gray-700 dark:text-gray-200
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   z-50 transition-all duration-200"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-5 w-5" />
        ) : (
          <Bars3Icon className="h-5 w-5" />
        )}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 transform
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:relative md:translate-x-0
                    w-72 bg-white dark:bg-gray-800 
                    border-r border-gray-200 dark:border-gray-700
                    flex flex-col z-40 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/dashboard"
            className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            DebtTracker
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hidden md:block
                       bg-gray-100 dark:bg-gray-700
                       text-gray-600 dark:text-gray-300
                       hover:bg-gray-200 dark:hover:bg-gray-600
                       transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {user && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user.name || "Pengguna"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActivePath("/dashboard")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={closeSidebar}
          >
            <HomeIcon className="h-5 w-5 mr-3" />
            Dashboard
          </Link>

          {/* Dropdown Transaksi */}
          <div>
            <button
              onClick={toggleTransactionDropdown}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="flex items-center">
                <ArrowDownCircleIcon className="h-5 w-5 mr-3" />
                Transaksi
              </span>
              {isTransactionOpen ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>

            {isTransactionOpen && (
              <div className="ml-8 mt-2 space-y-1">
                <Link
                  to="/dashboard/transactions/debt"
                  className={`block px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    isActivePath("/dashboard/transactions/debt")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                  onClick={closeSidebar}
                >
                  <ArrowDownCircleIcon className="h-4 w-4 inline mr-2" />
                  Utang
                </Link>
                <Link
                  to="/dashboard/transactions/receivable"
                  className={`block px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    isActivePath("/dashboard/transactions/receivable")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                  onClick={closeSidebar}
                >
                  <ArrowUpCircleIcon className="h-4 w-4 inline mr-2" />
                  Piutang
                </Link>
              </div>
            )}
          </div>

          {/* Lainnya */}
          <Link
            to="/dashboard/parties"
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActivePath("/dashboard/parties")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={closeSidebar}
          >
            <UserGroupIcon className="h-5 w-5 mr-3" />
            Pihak
          </Link>

          <Link
            to="/dashboard/reports"
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActivePath("/dashboard/reports")
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={closeSidebar}
          >
            <ChartBarIcon className="h-5 w-5 mr-3" />
            Laporan
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {bottomNavLinks.map((link) => {
            const isActive = isActivePath(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={closeSidebar}
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.name}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium
              text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
              transition-colors duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
