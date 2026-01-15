import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { CategoriesProvider } from './contexts/CategoriesContext';

import { useAuth } from './context/useAuth';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminLogin from './pages/AdminLogin';

import MainPage from './pages/MainPage';
import MainPageAdmin from './pages/MainPageAdmin';

import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import AdminProfilePage from './pages/AdminProfilePage';

import BrandsPage from './pages/BrandsPage';
import BrandsAdmin from './pages/BrandsAdmin';

import UsersPage from './pages/UsersPage';
import NewsPage from './pages/NewsPage';
import CartPage from './pages/CartPage';
import AdminListsPage from './pages/AdminListsPage';
import AdminNewsPage from './pages/AdminNewsPage';

const isAuthedByStorage = () => {
  const token = localStorage.getItem('access_token');
  return !!token && token !== 'undefined' && token !== 'null';
};

const roleByStorage = () => {
  const r = localStorage.getItem('current_role');
  return r === 'admin' || r === 'user' ? r : null;
};

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  const authed = auth.isAuthenticated || isAuthedByStorage();

  // ✅ роль берём ТОЛЬКО из контекста. Если контекст не успел — он bootstrap'ится в AuthProvider.
  if (!authed) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (auth.role !== 'admin') return <Navigate to="/user/main" replace />;
  return <>{children}</>;
};

const RequireUser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  const authed = auth.isAuthenticated || isAuthedByStorage();

  if (!authed) return <Navigate to="/login" state={{ from: location }} replace />;
  if (auth.role !== 'user') return <Navigate to="/admin/main" replace />;
  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const auth = useAuth();
  const authed = auth.isAuthenticated || isAuthedByStorage();
  const role = auth.role ?? roleByStorage();

  if (!authed) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'admin' ? '/admin/main' : '/user/main'} replace />;
};

export default function App() {
  return (
    <CartProvider>
      <ProductsProvider>
        <CategoriesProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />

            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* User */}
            <Route
              path="/user/main"
              element={
                <RequireUser>
                  <MainPage mode="user" />
                </RequireUser>
              }
            />
            <Route
              path="/user/profile"
              element={
                <RequireUser>
                  <ProfilePage />
                </RequireUser>
              }
            />
            <Route
              path="/user/profile/edit"
              element={
                <RequireUser>
                  <ProfileEditPage mode="user" />
                </RequireUser>
              }
            />
            <Route
              path="/user/brands"
              element={
                <RequireUser>
                  <BrandsPage />
                </RequireUser>
              }
            />
            <Route
              path="/user/news"
              element={
                <RequireUser>
                  <NewsPage />
                </RequireUser>
              }
            />
            <Route
              path="/user/cart"
              element={
                <RequireUser>
                  <CartPage />
                </RequireUser>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/main"
              element={
                <RequireAdmin>
                  <MainPage mode="admin" />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/products"
              element={
                <RequireAdmin>
                  <MainPageAdmin />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <RequireAdmin>
                  <AdminProfilePage />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/profile/edit"
              element={
                <RequireAdmin>
                  <ProfileEditPage mode="admin" />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/brands"
              element={
                <RequireAdmin>
                  <BrandsAdmin />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireAdmin>
                  <UsersPage />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/news"
              element={
                <RequireAdmin>
                  <AdminNewsPage />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/lists"
              element={
                <RequireAdmin>
                  <AdminListsPage />
                </RequireAdmin>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CategoriesProvider>
      </ProductsProvider>
    </CartProvider>
  );
}