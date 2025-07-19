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
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/utang"
            element={
              <ProtectedRoute>
                <DebtsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/piutang"
            element={
              <ProtectedRoute>
                <CreditsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <ContactsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          {/* Bagian ini yang diperbaiki */}
          <Route
            path="/payment-history"
            element={
              <ProtectedRoute>
                <PaymentHistoryPage />
              </ProtectedRoute>
            }
          />
                    <Route
              path="/contacts/:contactId"
              element={
                <ProtectedRoute>
                  <ContactDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>

      </AuthProvider>
    </Router>
  );
};

export default App;