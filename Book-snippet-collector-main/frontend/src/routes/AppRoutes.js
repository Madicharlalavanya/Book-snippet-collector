import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
// Import the new pages you will create
import SettingsPage from '../pages/SettingsPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<SignupPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    
    {/* Add the new routes for settings and password reset */}
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
  </Routes>
);

export default AppRoutes;