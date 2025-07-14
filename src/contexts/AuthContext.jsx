// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // <--- PENTING: Pastikan path ini benar dan authService diekspor default
import { toast } from 'react-toastify'; // Pastikan Anda sudah menginstal react-toastify dan mengaturnya di App.jsx

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Status loading untuk autentikasi awal

  const navigate = useNavigate();

  // Fungsi untuk memuat user dari token (dipanggil saat aplikasi dimuat)
  const loadUserFromToken = useCallback(async () => {
    setIsLoading(true); // Set true saat mulai memuat
    try {
      const user = await authService.getCurrentUser(); // <--- Panggilan ini sekarang seharusnya berhasil
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        // Jika getCurrentUser mengembalikan null, berarti token tidak valid atau user tidak ditemukan
        // Maka kita akan paksa logout untuk membersihkan localStorage
        authService.logout(); // <--- Panggilan ini sekarang seharusnya berhasil
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error loading user from token:", error);
      authService.logout(); // Paksa logout juga jika ada error
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false); // Set false setelah selesai (baik sukses/gagal)
    }
  }, []); // Dependencies kosong, hanya dijalankan sekali saat mount (atau saat loadUserFromToken berubah)

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]); // Jalankan loadUserFromToken saat komponen mount atau ketika fungsi itu sendiri berubah

  const login = async (email, password) => {
    setIsLoading(true); // Set true saat login dimulai
    try {
      const user = await authService.login(email, password); // <--- Panggilan ini sekarang seharusnya berhasil
      setCurrentUser(user);
      setIsAuthenticated(true);
      toast.success('Login berhasil!');
      navigate('/dashboard'); // Navigasi ke dashboard setelah login
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Email atau password salah.');
      throw error; // Lempar error agar komponen yang memanggil bisa menanganinya
    } finally {
      setIsLoading(false); // Set false setelah login selesai
    }
  };

  const register = async (email, password, username) => { // Perhatikan parameter yang Anda butuhkan
    setIsLoading(true);
    try {
      const user = await authService.register(username, email, password); // Sesuaikan parameter dengan fungsi register di authService
      toast.success('Pendaftaran berhasil! Silakan verifikasi email Anda jika diperlukan.');
      navigate('/auth'); // Contoh: kembali ke halaman login setelah register
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Gagal mendaftar. Email mungkin sudah terdaftar.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      authService.logout(); // <--- Panggilan ini sekarang seharusnya berhasil
      setCurrentUser(null);
      setIsAuthenticated(false);
      toast.info('Anda telah logout.');
      navigate('/auth'); // Navigasi ke halaman login setelah logout
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Terjadi kesalahan saat logout.');
    }
  };

  // Nilai yang akan disediakan oleh AuthContext
  const value = {
    currentUser,
    isAuthenticated,
    isLoading, // <--- PENTING: Pastikan ini diekspos
    login,
    register,
    logout,
    authService, // <--- PENTING: Ekspos authService agar komponen lain bisa memanggil fungsi-fungsinya
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk menggunakan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};