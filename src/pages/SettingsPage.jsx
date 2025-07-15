// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import {
  Cog6ToothIcon,
  BellAlertIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);

    console.log("Notifikasi diubah menjadi:", !notificationsEnabled);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
        Pengaturan
      </h1>

      {/* Bagian Pengaturan Umum */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-gray-200 flex items-center">
          <Cog6ToothIcon className="h-7 w-7 mr-3 text-primary-light dark:text-primary-dark" />
          Umum
        </h2>
        <div className="space-y-4">
          {/* Pengaturan Tema (sudah ada di layout, tapi bisa ditampilkan juga di sini) */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="flex items-center">
              <PaintBrushIcon className="h-6 w-6 mr-3 text-gray-600 dark:text-gray-400" />
              <span className="text-lg text-gray-800 dark:text-gray-200">
                Mode Tampilan
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-md font-semibold
                         bg-gray-200 dark:bg-gray-700
                         text-gray-800 dark:text-gray-200
                         hover:bg-gray-300 dark:hover:bg-gray-600
                         transition-colors duration-200 flex items-center space-x-2"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? (
                <>
                  <MoonIcon className="h-5 w-5" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <SunIcon className="h-5 w-5" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          {/* Contoh Pengaturan Notifikasi */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="flex items-center">
              <BellAlertIcon className="h-6 w-6 mr-3 text-gray-600 dark:text-gray-400" />
              <span className="text-lg text-gray-800 dark:text-gray-200">
                Aktifkan Notifikasi
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={notificationsEnabled}
                onChange={handleToggleNotifications}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light"></div>
            </label>
          </div>

          {/* Tambahkan pengaturan lain di sini */}
          <div className="py-2 text-gray-600 dark:text-gray-400">
            Pengaturan lain seperti zona waktu, format mata uang, dll. akan
            ditambahkan di sini.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
