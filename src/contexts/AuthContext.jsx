// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const loadUserFromToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        authService.logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error loading user from token:", error);
      authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      setIsAuthenticated(true);
      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Email atau password salah.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, username) => {
    setIsLoading(true);
    try {
      const user = await authService.register(username, email, password);
      toast.success(
        "Pendaftaran berhasil! Silakan verifikasi email Anda jika diperlukan."
      );
      navigate("/auth");
      return user;
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        error.message || "Gagal mendaftar. Email mungkin sudah terdaftar."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      toast.info("Anda telah logout.");
      navigate("/auth");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Terjadi kesalahan saat logout.");
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    authService,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
