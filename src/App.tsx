import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CompanySetupPage from './pages/auth/CompanySetupPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';

// Layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Main Pages
import DashboardPage from './pages/DashboardPage';
import DeclarationsPage from './pages/DeclarationsPage';
import CreateDeclarationPage from './pages/CreateDeclarationPage';
import CertificatesPage from './pages/CertificatesPage';
import TasksPage from './pages/TasksPage';
import DocumentsPage from './pages/DocumentsPage';
import ClientsPage from './pages/ClientsPage';
import PartnershipsPage from './pages/PartnershipsPage';
import EmployeesPage from './pages/EmployeesPage';
import RequestsPage from './pages/RequestsPage';
import SettingsPage from './pages/SettingsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex bg-[#f0f1f3] min-h-screen font-sans selection:bg-brand-500/30">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <Header />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  </div>
);

// Auth Guard
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/company-setup" element={<PublicRoute><CompanySetupPage /></PublicRoute>} />
          <Route path="/admin-login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />

          {/* Protected Main Routes */}
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/declarations" element={<ProtectedRoute><DeclarationsPage /></ProtectedRoute>} />
          <Route path="/declarations/new" element={<ProtectedRoute><CreateDeclarationPage /></ProtectedRoute>} />
          <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
          <Route path="/partnerships" element={<ProtectedRoute><PartnershipsPage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
