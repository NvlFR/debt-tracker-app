// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // <-- Pastikan hanya satu import ini
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext); // Tangkap context di sini
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Kembalikan context
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userFromService = await authService.getCurrentUser();
        if (userFromService) {
          setUser(userFromService);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error loading user from token:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const loginResponse = await authService.login(email, password);
      const currentUser = await authService.getCurrentUser();

      if (currentUser && currentUser.isVerified) {
        setUser(currentUser);
        setIsAuthenticated(true);
        toast.success('Login berhasil!');
      } else if (currentUser && !currentUser.isVerified) {
        toast.warn('Login berhasil, namun akun Anda belum diverifikasi. Silakan cek email Anda.', { position: "top-right", autoClose: 5000 });
        setUser(currentUser);
        setIsAuthenticated(false);
      } else {
        toast.error('Login berhasil, namun gagal mengambil data pengguna.');
        setIsAuthenticated(false);
        setUser(null);
        throw new Error('Gagal memuat data pengguna setelah login.');
      }
      return loginResponse;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.error(error.message || error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.register(name, email, password);
      navigate('/auth?registered=true');
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
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth');
      toast.info('Anda telah berhasil logout.', { position: "top-right", autoClose: 3000 });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout. Silakan coba lagi.', { position: "top-right", autoClose: 3000 });
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

  // --- BAGIAN PENTING UNTUK DIPERBAIKI ---
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    changePassword,
    authService, // <--- TAMBAHKAN BARIS INI!
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};