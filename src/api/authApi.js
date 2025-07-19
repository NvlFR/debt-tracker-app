// src/api/authApi.js
import { supabase } from "../config/supabaseClient";

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.session && data.user) {
    return {
      success: true,
      user: {
        id: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email,
      },
    };
  }

  return { success: false, message: "Email atau password salah." };
};

export const registerUser = async (name, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (error) {
    console.error("Supabase sign-up error:", error.message);
    return { success: false, message: error.message };
  }

  if (data.user) {
    return {
      success: true,
      user: {
        id: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email,
      },
    };
  }
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  }
};
