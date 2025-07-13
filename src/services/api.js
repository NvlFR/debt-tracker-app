// src/services/api.js
import axios from 'axios';

// Base URL untuk API backend kamu.
// Gunakan variabel lingkungan (environment variable) untuk kemudahan konfigurasi.
// Contoh: REACT_APP_API_BASE_URL (untuk Create React App) atau VITE_API_BASE_URL (untuk Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; // Ganti dengan URL backend-mu

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token JWT ke setiap request yang terotentikasi
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken'); // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Tambahkan header Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error response, terutama 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Jika respons 401 dan bukan request ke endpoint login/refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Tandai request ini sebagai sudah dicoba lagi
      // Di sini bisa ditambahkan logika untuk refresh token jika ada
      // Untuk sementara, jika 401, kita akan paksa logout
      localStorage.removeItem('userToken');
      // Redirect ke halaman login
      window.location.href = '/auth'; // Menggunakan window.location.href untuk hard redirect
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;