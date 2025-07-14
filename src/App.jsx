// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import halaman-halaman yang benar-benar ada dan digunakan
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import VerifyEmail from './pages/VerifyEmail';
import DashboardPage from './pages/DashboardPage';
import DebtPage from './pages/DebtPage'; // Sebelumnya DebtsPage, tapi Anda pakai DebtPage
import ReceivablePage from './pages/ReceivablePage'; // Sebelumnya ReceivablesPage, tapi Anda pakai ReceivablePage
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from "./pages/NotFoundPage";

// Import layout
import DashboardLayout from './layouts/DashboardLayout'; // Pastikan path ini benar

// Komponen PrivateRoute untuk melindungi rute yang butuh autentikasi
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        Memuat...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
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
              <Route index element={<DashboardPage />} />
              <Route path="debts" element={<DebtPage />} /> {/* Gunakan 'debts' karena Anda pakai DebtPage */}
              <Route path="receivables" element={<ReceivablePage />} /> {/* Gunakan 'receivables' karena Anda pakai ReceivablePage */}
              <Route path="reports" element={<div>Halaman Laporan (belum dibuat)</div>} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
}

export default App;