// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        // Error here usually means token invalid or no token, already handled by api.js interceptor or authService.js
        // No need to show another toast here, just ensure user is null
        setUser(null);
        localStorage.removeItem('userToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      navigate('/dashboard');
      toast.success('Login berhasil! Selamat datang.', { position: "top-right", autoClose: 3000 });
      return data;
    } catch (error) {
      setUser(null);
      // Error message is already handled by api.js interceptor or LoginForm
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
      toast.success('Pendaftaran berhasil! Silakan login.', { position: "top-right", autoClose: 3000 });
      return data;
    } catch (error) {
      // Error message is already handled by api.js interceptor or RegisterForm
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
      localStorage.removeItem('userToken');
      navigate('/auth');
      toast.info('Anda telah berhasil logout.', { position: "top-right", autoClose: 3000 });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout. Silakan coba lagi.', { position: "top-right", autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password berhasil diperbarui!', { position: "top-right", autoClose: 3000 });
      return { success: true, message: 'Password berhasil diperbarui!' };
    } catch (error) {
      const errorMessage = error.message || 'Gagal memperbarui password.';
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
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