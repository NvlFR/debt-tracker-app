// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider dan useAuth

// Import halaman-halaman
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DebtPage from './pages/DebtPage';
import ReceivablePage from './pages/ReceivablePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Import layout
import DashboardLayout from './layouts/DashboardLayout';

// Komponen PrivateRoute untuk melindungi rute yang butuh autentikasi
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Tampilkan loading spinner atau placeholder sementara data auth dimuat
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        Memuat...
      </div>
    );
  }

  // Jika tidak terautentikasi, redirect ke halaman login
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <ThemeProvider>
      {/* AuthProvider harus di dalam Router karena menggunakan useNavigate */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Nested Routes untuk Dashboard yang dilindungi PrivateRoute */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="debts" element={<DebtPage />} />
              <Route path="receivables" element={<ReceivablePage />} />
              <Route path="reports" element={<div>Halaman Laporan (belum dibuat)</div>} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;