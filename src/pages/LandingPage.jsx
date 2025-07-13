// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme hook
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Contoh ikon

// Pastikan kamu sudah menginstal Heroicons: npm install @heroicons/react

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme(); // Dapatkan tema dan fungsi toggle dari context

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4
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

      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
          Kelola <span className="text-primary-light dark:text-primary-dark">Utang & Piutang</span> Lebih Mudah
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90">
          Aplikasi pencatat utang piutang modern untuk individu dan bisnis. Dapatkan kendali penuh atas keuangan Anda.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
        {/* Fitur 1: Pelacakan Akurat */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-3 text-primary-light dark:text-primary-dark">Pelacakan Akurat</h2>
          <p className="opacity-80">Catat setiap transaksi utang dan piutang dengan detail. Tidak ada lagi yang terlewat.</p>
        </div>

        {/* Fitur 2: Visualisasi Data */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-3 text-primary-light dark:text-primary-dark">Visualisasi Data</h2>
          <p className="opacity-80">Lihat grafik interaktif untuk memahami arus kas Anda dan posisi keuangan.</p>
        </div>

        {/* Fitur 3: Notifikasi Pengingat */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-3 text-primary-light dark:text-primary-dark">Notifikasi Pengingat</h2>
          <p className="opacity-80">Dapatkan pengingat otomatis untuk pembayaran jatuh tempo, agar tidak ada yang lupa.</p>
        </div>

        {/* Fitur 4: Aman & Terjamin */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-3 text-primary-light dark:text-primary-dark">Aman & Terjamin</h2>
          <p className="opacity-80">Data Anda disimpan dengan aman, dengan privasi yang terjamin.</p>
        </div>
      </main>

      <footer className="text-center">
        <Link
          to="/auth"
          className="px-8 py-3 rounded-full text-lg font-semibold
                     bg-primary-light text-white
                     dark:bg-primary-dark
                     hover:bg-primary-dark dark:hover:bg-secondary-dark
                     shadow-lg hover:shadow-xl
                     transition-all duration-300 transform hover:scale-105"
        >
          Mulai Sekarang
        </Link>
        <p className="mt-4 text-sm opacity-70">
          Sudah punya akun? <Link to="/auth" className="underline text-primary-light dark:text-primary-dark hover:no-underline">Masuk di sini</Link>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;