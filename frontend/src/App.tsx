import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import BrandsPage from './pages/BrandsPage';
import ForgotPasswordCodePage from './pages/ForgotPasswordCodePage';
import ForgotPasswordNewPasswordPage from './pages/ForgotPasswordNewPasswordPage';
import NewsPage from './pages/NewsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SignUpPage from './pages/SignUpPage'; // 1. Импорт

import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* 2. Добавляем маршрут для регистрации */}
      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Добавляем маршрут для /forgot-password/code */}
      <Route path="/forgot-password/code" element={<ForgotPasswordCodePage />} />

      <Route path="/" element={<MainPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/forgot-code" element={<ForgotPasswordCodePage />} />
      <Route path="/forgot-new-password" element={<ForgotPasswordNewPasswordPage />} />
      <Route path="/groups" element={<UsersPage />} />
    </Routes>
  );
}