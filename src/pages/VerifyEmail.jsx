// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Pastikan axios terinstal: npm install axios

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Memverifikasi email Anda...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');

      if (!token) {
        setMessage('Token verifikasi tidak ditemukan.');
        return;
      }

      try {
        // Ini adalah MOCK untuk verifikasi email. JSON Server tidak memverifikasi token sungguhan.
        // Di backend nyata, ini akan menjadi POST ke endpoint verifikasi Anda (misal: /api/auth/verify-email)
        // Kita akan simulasikan sukses jika token ada.
        // const response = await axios.post('http://localhost:5000/api/auth/verify-email', { token }); // Jika ada endpoint sungguhan
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasikan penundaan jaringan
        setMessage('Verifikasi email berhasil! Anda sekarang dapat login.');
        setIsSuccess(true);
      } catch (error) {
        console.error('Email verification error:', error);
        setMessage('Verifikasi email gagal atau token tidak valid/kadaluarsa.');
        setIsSuccess(false);
      }
    };

    verifyToken();
  }, [location.search]); // Dependensi

  const handleGoToLogin = () => {
    navigate('/auth'); // Arahkan ke halaman login/auth
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Verifikasi Email</h2>
        <p className={`mb-6 ${isSuccess ? 'text-green-600' : 'text-red-600'} dark:${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
        <button
          onClick={handleGoToLogin}
          className="w-full px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark transition duration-200"
        >
          KEMBALI KE LOGIN
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;