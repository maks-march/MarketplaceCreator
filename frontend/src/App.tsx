import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import RequireRole from './auth/RequireRole';
import MainPage from './pages/MainPage';
import MainPageAdmin from './pages/MainPageAdmin';
import BrandsPage from './pages/BrandsPage';
import ForgotPasswordCodePage from './pages/ForgotPasswordCodePage';
import ForgotPasswordNewPasswordPage from './pages/ForgotPasswordNewPasswordPage';
import NewsPage from './pages/NewsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SignUpPage from './pages/SignUpPage';
import AdminLogin from './pages/AdminLogin';
import BrandsAdmin from './pages/BrandsAdmin';
import UserNewsPage from './pages/UserNewsPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';
import { CartProvider } from './contexts/CartContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* публичные / пользовательские */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/forgot-password/code" element={<ForgotPasswordCodePage />} />

          {/* админский логин (публичная страница) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* главная — одна компонента, два роута (admin/user) */}
          <Route
            path="/admin/main"
            element={
              <RequireRole role="admin">
                <MainPage mode="admin" />
              </RequireRole>
            }
          />
          <Route
            path="/admin/products"
            element={
              <RequireRole role="admin">
                <MainPageAdmin />
              </RequireRole>
            }
          />
          <Route
            path="/user/main"
            element={
              <RequireRole role="user">
                <MainPage mode="user" />
              </RequireRole>
            }
          />

          {/* админские страницы — защищены RequireRole role="admin" */}
          <Route
            path="/admin/brands"
            element={
              <RequireRole role="admin">
                <BrandsAdmin />
              </RequireRole>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireRole role="admin">
                <UsersPage />
              </RequireRole>
            }
          />
          <Route
            path="/admin/news"
            element={
              <RequireRole role="admin">
                <NewsPage />
              </RequireRole>
            }
          />

          {/* пользовательские страницы — защищены RequireRole role="user" */}
          <Route
            path="/user/news"
            element={
              <RequireRole role="user">
                <UserNewsPage />
              </RequireRole>
            }
          />

          {/* редиректы на конкретную "главную" */}
          <Route path="/admin" element={<Navigate to="/admin/main" replace />} />
          <Route path="/user" element={<Navigate to="/user/main" replace />} />

          {/* редиректы / старые пути */}
          <Route path="/brands" element={<Navigate to="/admin/brands" replace />} />

          {/* профиль */}
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />

          {/* дополнительные пути (product modal через MainPage) */}
          <Route path="/user/product/:id" element={<MainPage mode="user" />} />
          <Route path="/admin/product/:id" element={<MainPage mode="admin" />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}