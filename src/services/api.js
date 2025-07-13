// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response?.data?.message || 'Terjadi kesalahan tidak dikenal.';

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('userToken');
      // Tampilkan toast sebelum redirect
      toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
        position: "top-right",
        autoClose: 3000,
        onClose: () => {
          window.location.href = '/auth'; // Redirect setelah toast muncul
        }
      });
      return Promise.reject(error);
    }

    // Untuk error lain, tampilkan toast generic
    if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 401) {
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    } else if (error.response?.status >= 500) {
      toast.error('Server error: ' + errorMessage, { position: "top-right", autoClose: 5000 });
    }
    return Promise.reject(error);
  }
);

export default api;