// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient"; // Import klien Supabase

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Dapatkan sesi pengguna saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Dengarkan perubahan status otentikasi
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // Hentikan listener saat komponen tidak lagi digunakan
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []); // useEffect hanya berjalan satu kali saat komponen dimuat

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    login,
    logout,
    loading, // Sertakan state loading
  };

  // Tampilkan loading screen atau null saat otentikasi sedang diproses
  if (loading) {
    // Anda bisa mengganti ini dengan komponen loading atau spinner
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
