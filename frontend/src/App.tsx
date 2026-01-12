import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { useAuth } from './context/useAuth';

// Pages
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminLogin from './pages/AdminLogin';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import CartPage from './pages/CartPage';
import BrandsAdmin from './pages/BrandsAdmin';
import NewsPage from './pages/NewsPage';
import UsersPage from './pages/UsersPage';
import MainPageAdmin from './pages/MainPageAdmin';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ForgotPasswordCodePage from './pages/ForgotPasswordCodePage';
import ForgotPasswordNewPasswordPage from './pages/ForgotPasswordNewPasswordPage';
import AdminListsPage from './pages/AdminListsPage';
import UserNewsPage from './pages/UserNewsPage';

// --- Защита маршрутов ---

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  if (auth.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const RequireUser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <CartProvider>
      <ProductsProvider>
        <CategoriesProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<MainPage mode="user" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/forgot-password/code" element={<ForgotPasswordCodePage />} />
            <Route path="/forgot-new-password" element={<ForgotPasswordNewPasswordPage />} />

            {/* ADMIN ROUTES */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={<Navigate to="/admin/main" replace />} />
            <Route path="/admin/main" element={
              <RequireAdmin>
                <MainPage mode="admin" />
              </RequireAdmin>
            } />
            <Route path="/admin/products" element={
              <RequireAdmin>
                <MainPageAdmin />
              </RequireAdmin>
            } />
            <Route path="/admin/users" element={
              <RequireAdmin>
                <UsersPage />
              </RequireAdmin>
            } />
            <Route path="/admin/brands" element={
              <RequireAdmin>
                <BrandsAdmin />
              </RequireAdmin>
            } />
            <Route path="/admin/news" element={
              <RequireAdmin>
                <NewsPage />
              </RequireAdmin>
            } />
            <Route path="/admin/lists" element={
              <RequireAdmin>
                <AdminListsPage />
              </RequireAdmin>
            } />
            
            <Route path="/admin/profile" element={
              <RequireAdmin>
                <ProfilePage />
              </RequireAdmin>
            } />
            <Route path="/admin/profile/edit" element={
              <RequireAdmin>
                <ProfileEditPage mode="admin" />
              </RequireAdmin>
            } />

            {/* USER ROUTES */}
            <Route path="/user" element={<Navigate to="/user/main" replace />} />
            <Route path="/user/main" element={
              <RequireUser>
                <MainPage mode="user" />
              </RequireUser>
            } />
            <Route path="/user/profile" element={
              <RequireUser>
                <ProfilePage />
              </RequireUser>
            } />
            <Route path="/user/profile/edit" element={
              <RequireUser>
                <ProfileEditPage mode="user" />
              </RequireUser>
            } />
            <Route path="/user/cart" element={
              <RequireUser>
                <CartPage />
              </RequireUser>
            } />
            <Route path="/user/news" element={
              <RequireUser>
                <UserNewsPage />
              </RequireUser>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CategoriesProvider>
      </ProductsProvider>
    </CartProvider>
  );
}