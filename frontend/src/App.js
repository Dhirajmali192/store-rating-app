import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import AdminAddUser from './pages/AdminAddUser';
import AdminAddStore from './pages/AdminAddStore';
import AdminUserDetail from './pages/AdminUserDetail';
import UserStores from './pages/UserStores';
import OwnerDashboard from './pages/OwnerDashboard';
import ChangePassword from './pages/ChangePassword';
import Layout from './components/Layout';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'store_owner') return '/owner';
    return '/stores';
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><Layout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/add" element={<AdminAddUser />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="stores" element={<AdminStores />} />
        <Route path="stores/add" element={<AdminAddStore />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* Normal User Routes */}
      <Route path="/stores" element={<PrivateRoute roles={['user']}><Layout /></PrivateRoute>}>
        <Route index element={<UserStores />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* Store Owner Routes */}
      <Route path="/owner" element={<PrivateRoute roles={['store_owner']}><Layout /></PrivateRoute>}>
        <Route index element={<OwnerDashboard />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      <Route path="/unauthorized" element={
        <div style={{textAlign:'center',padding:'80px',fontFamily:'sans-serif'}}>
          <h1>403 - Access Denied</h1>
          <p>You don't have permission to view this page.</p>
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
