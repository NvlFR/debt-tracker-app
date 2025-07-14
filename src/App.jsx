// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Tetap import useAuth di sini untuk PrivateRoute

// Import Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS-nya
import VerifyEmail from './pages/VerifyEmail';
// Import halaman-halaman
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DebtPage from './pages/DebtPage';
import ReceivablePage from './pages/ReceivablePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from "./pages/NotFoundPage";

// Import layout
import DashboardLayout from './layouts/DashboardLayout';

// Komponen PrivateRoute untuk melindungi rute yang butuh autentikasi
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Tampilkan loading screen saat AuthContext sedang memuat status autentikasi
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        Memuat...
      </div>
    );
  }

  // Jika tidak terautentikasi, arahkan ke halaman login
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    // ThemeProvider membungkus semuanya karena tema bisa diterapkan di seluruh aplikasi
    <ThemeProvider>
      {/* Router harus menjadi parent bagi komponen yang menggunakan hook React Router seperti useNavigate */}
      <Router>
        {/* AuthProvider sekarang berada di dalam Router agar useNavigate bisa diakses */}
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
             <Route path="/verify-email" element={<VerifyEmail />} />
            {/* Rute dashboard yang memerlukan autentikasi */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              {/* Nested routes untuk dashboard */}
              <Route index element={<DashboardPage />} />
              <Route path="debts" element={<DebtPage />} />
              <Route path="receivables" element={<ReceivablePage />} />
              <Route path="reports" element={<div>Halaman Laporan (belum dibuat)</div>} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Rute fallback untuk halaman tidak ditemukan */}
            <Route path="*" element={<NotFoundPage />} />
            
          </Routes>
        </AuthProvider>
      </Router>

      {/* ToastContainer diletakkan di sini, di luar Router dan AuthProvider,
          agar notifikasi bisa ditampilkan di mana saja dalam hierarki komponen */}
      <ToastContainer
        position="top-right" // Posisi notifikasi
        autoClose={5000}    // Tutup otomatis setelah 5 detik
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Tema notifikasi (light, dark, colored)
      />
    </ThemeProvider>
  );
}

export default App;