import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";
import { LoginPage } from "./features/auth/LoginPage";
import { ChangePasswordPage } from "./features/auth/ChangePasswordPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { RegisterPage } from "./features/register/RegisterPage";
import { DelegatesPage } from "./features/delegates/DelegatesPage";
import { TeamPage } from "./features/team/TeamPage";
import { AccountPage } from "./features/account/AccountPage";
import { AnalyticsPage } from "./features/analytics/AnalyticsPage";
import { LandingPage } from "./features/landing/LandingPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/delegates" element={<DelegatesPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;