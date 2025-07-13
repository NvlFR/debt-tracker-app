// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // Import service kita
import { useNavigate } from 'react-router-dom';

// 1. Buat Context
const AuthContext = createContext();

// 2. Buat Custom Hook untuk menggunakan Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Buat Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State untuk menyimpan data user yang login
  const [isLoading, setIsLoading] = useState(true); // State untuk menunjukkan apakah sedang memuat status autentikasi
  const navigate = useNavigate();

  // Efek samping untuk memeriksa status login saat aplikasi pertama kali dimuat
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.warn('No active session or failed to fetch user:', error);
        setUser(null); // Pastikan user null jika gagal
        localStorage.removeItem('userToken'); // Bersihkan token jika tidak valid
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Fungsi untuk login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user); // Asumsi `data` berisi `user` object
      navigate('/dashboard'); // Arahkan ke dashboard
      return data;
    } catch (error) {
      setUser(null);
      throw error; // Lempar error agar bisa ditangkap di LoginForm
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk register
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.register(name, email, password);
      // Setelah register, bisa langsung login atau arahkan ke halaman login
      // Jika register juga mengembalikan token, bisa langsung set user di sini
      // setUser(data.user);
      navigate('/auth?registered=true'); // Arahkan kembali ke halaman login dengan notifikasi
      return data;
    } catch (error) {
      throw error; // Lempar error agar bisa ditangkap di RegisterForm
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('userToken');
      navigate('/auth'); // Arahkan ke halaman login
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk mengganti password
  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setIsLoading(false); // Set isLoading to false after successful password change
      return { success: true, message: 'Password berhasil diperbarui!' };
    } catch (error) {
      setIsLoading(false); // Set isLoading to false even on error
      throw error; // Lempar error agar bisa ditangkap di ProfilePage
    }
  };

  const value = {
    user,
    isAuthenticated: !!user, // true jika user tidak null
    isLoading,
    login,
    register,
    logout,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};