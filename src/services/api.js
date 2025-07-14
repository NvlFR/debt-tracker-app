// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Pastikan ini sesuai dengan port JSON Server Anda

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
// Ini memastikan setiap request ke API akan membawa token jika ada
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Menggunakan key 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api; // Ekspor instance API secara default