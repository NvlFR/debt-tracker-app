// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DebtsPage from "./pages/DebtsPage";
import CreditsPage from "./pages/CreditsPage";
import ContactsPage from "./pages/ContactsPage";
import CategoriesPage from "./pages/CategoriesPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import LandingPage from "./pages/LandingPage";
import ContactDetailPage from "./pages/ContactDetailPage";
import Layout from "./layouts/Layout";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/utang"
            element={
              <ProtectedRoute>
                <Layout>
                  <DebtsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/piutang"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreditsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Layout>
                  <ContactsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoriesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-history"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaymentHistoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts/:contactId"
            element={
              <ProtectedRoute>
                <Layout>
                  <ContactDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
