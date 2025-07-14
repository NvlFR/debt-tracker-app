// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // <-- Pastikan hanya satu import ini
import { useNavigate } from 'react-router-dom'; // Untuk redirect, jika diperlukan di sini
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // <-- TAMBAHKAN STATE INI
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userFromService = await authService.getCurrentUser();
        if (userFromService) {
          setUser(userFromService);
          setIsAuthenticated(true); // Set true jika user ditemukan
        } else {
          // Jika tidak ada user (misal token hilang/invalid), pastikan status non-autentikasi
          setUser(null);
          setIsAuthenticated(false);
          // authService.logout() sudah dipanggil di authService.js jika token invalid
        }
      } catch (error) {
        // Error saat memuat user (misal token expired/invalid, 401/403)
        console.error('Error loading user from token:', error);
        // authService.logout() sudah dipanggil di authService.js untuk 401/403
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Panggil login dari authService, yang akan menyimpan userToken di localStorage
      const loginResponse = await authService.login(email, password);

      // Setelah login berhasil, panggil getCurrentUser untuk mendapatkan data user lengkap,
      // ini juga akan memvalidasi token dan mengatur state isVerified
      const currentUser = await authService.getCurrentUser();

      if (currentUser && currentUser.isVerified) {
        setUser(currentUser);
        setIsAuthenticated(true); // User terverifikasi, set authenticated true
        toast.success('Login berhasil!'); // Notifikasi sukses di sini
        // Redirect ke dashboard akan dihandle oleh LoginForm.jsx
      } else if (currentUser && !currentUser.isVerified) {
        // Jika login berhasil tapi user belum terverifikasi
        toast.warn('Login berhasil, namun akun Anda belum diverifikasi. Silakan cek email Anda.', { position: "top-right", autoClose: 5000 });
        setUser(currentUser); // Tetap set user, tapi mungkin tidak diizinkan masuk dashboard oleh PrivateRoute jika Anda menerapkan isVerified di sana
        setIsAuthenticated(false); // Atau biarkan false jika Anda ingin memaksa verifikasi
        // throw new Error('Akun belum diverifikasi. Silakan cek email Anda.'); // Opsi untuk melempar error agar LoginForm bisa menangkapnya
      } else {
        // Kasus seharusnya tidak terjadi jika loginResponse sukses tapi currentUser null
        toast.error('Login berhasil, namun gagal mengambil data pengguna.');
        setIsAuthenticated(false);
        setUser(null);
        throw new Error('Gagal memuat data pengguna setelah login.');
      }
      return loginResponse; // Kembalikan respons login asli
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      // Pastikan logout dan hapus token jika login gagal
      authService.logout(); // <-- Pastikan ini memanggil logout dari authService
      setUser(null);
      setIsAuthenticated(false);
      toast.error(error.message || error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
      throw error; // Lempar error agar LoginForm bisa menampilkannya
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.register(name, email, password);
      // Redirect ini lebih baik di RegisterForm.jsx
      navigate('/auth?registered=true'); // Contoh redirect setelah register sukses
      toast.success('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.', { position: "top-right", autoClose: 5000 });
      return data;
    } catch (error) {
      console.error('Register error in AuthContext:', error);
      toast.error(error.message || error.response?.data?.message || 'Pendaftaran gagal.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout(); // Panggil logout dari authService
      setUser(null);
      setIsAuthenticated(false); // Set false setelah logout
      // localStorage.removeItem('userToken'); // Sudah dihandle oleh authService.logout()
      navigate('/auth'); // Redirect ke halaman login setelah logout
      toast.info('Anda telah berhasil logout.', { position: "top-right", autoClose: 3000 });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout. Silakan coba lagi.', { position: "top-right", autoClose: 3000 });
      // Tetap pastikan status logout jika ada error
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      toast.success(response.message || 'Password berhasil diperbarui!', { position: "top-right", autoClose: 3000 });
      return { success: true, message: response.message || 'Password berhasil diperbarui!' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Gagal memperbarui password.';
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated, // Gunakan state isAuthenticated yang baru
    isLoading,
    login,
    register,
    logout,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};