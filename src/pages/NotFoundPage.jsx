// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-primary-light dark:text-primary-dark mb-4">404</h1>
        <p className="text-xl md:text-2xl font-semibold mb-6">Halaman Tidak Ditemukan</p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Maaf, halaman yang Anda cari tidak ada. Mungkin URL salah atau halaman sudah dihapus.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-md text-white font-semibold
                     bg-primary-light dark:bg-primary-dark
                     hover:bg-primary-dark dark:hover:bg-secondary-dark
                     shadow-md hover:shadow-lg
                     transition-all duration-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

// Pastikan baris ini ada dan benar
export default NotFoundPage;