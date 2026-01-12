import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { HomeIcon, NewsIcon, TagIcon, GroupsIcon, ListIcon } from './Icon';
import ordersSvg from '../assets/Orders.svg'; // или путь к иконке, которую используете
import searchIcon from '../assets/Search.svg';
import shoppingCartSvg from '../assets/Shopping_cart.svg';
import CategoryMenu from './CategoryMenu'; // Импортируем меню
import '../styles/MainPage.css';
import '../styles/CategoryMenu.css'; // Стили меню

interface PageLayoutProps {
  children?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  // ✅ Логика: если есть auth.user.login, показываем его.
  // После фикса updateProfile в AuthContext, auth.user обновится сразу же после сохранения.
  const headerName = auth.user?.login?.trim() || auth.user?.name?.trim() || 'Profile name';
  
  // Аватарка тоже берется из user
  const headerAvatar = auth.user?.avatarUrl || '/vite.svg';

  const goToProfile = () => {
    if (!auth.isAuthenticated) return;
    navigate(auth.role === 'admin' ? '/admin/profile' : '/user/profile');
  };

  const isMainPage = location.pathname === '/';
  const isUserMain = location.pathname === '/user' || location.pathname === '/user/main';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // общая функция для класса навссылок (добавляет is-active при активном пути)
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'is-active' : ''}`;

  // Обработчик выхода
  const handleLogout = () => {
    auth.logout();
    const loginPath = auth.role === 'admin' ? '/admin/login' : '/login';
    navigate(loginPath, { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-header" style={{
        height: '72px',
        background: '#7AC142',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        color: '#fff',
        flexShrink: 0,
        zIndex: 50,
        position: 'relative'
      }}>
        
        {/* ✅ БРЕНД СЛЕВА (возвращаем как было) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#111',
          }}
        >
          <div>Marketplace</div>
          <div>creator</div>
        </div>

        {/* Кнопка категорий — только для пользователя на /user или /user/main */}
        {auth?.role === 'user' && isUserMain && (
          <div
            className={`category-trigger ${isMenuOpen ? 'is-open' : ''}`}
            onClick={() => setIsMenuOpen(o => !o)}
            title="Категории"
            role="button"
            aria-pressed={isMenuOpen}
          >
            {/* простой SVG-иконка (три полоски) */}
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="0" y="1" width="20" height="2" rx="1" fill="#fff" />
              <rect x="0" y="6" width="20" height="2" rx="1" fill="#fff" />
              <rect x="0" y="11" width="20" height="2" rx="1" fill="#fff" />
            </svg>
          </div>
        )}

        {/* Поиск: 337x44 px, АБСОЛЮТНО ПО ЦЕНТРУ */}
        <div style={{ 
          width: '337px',      
          height: '44px',      
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <input 
            type="text" 
            placeholder="Search here..." 
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '22px', 
              border: 'none',
              background: '#fff',
              padding: '0 40px 0 20px',
              fontSize: '14px',
              outline: 'none',
              color: '#333'
            }}
          />
          <img 
            src={searchIcon} 
            alt="Search"
            style={{ 
              position: 'absolute', 
              right: '15px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '16px',
              height: '16px',
              cursor: 'pointer'
            }} 
          />
        </div>

        {/* Кнопка корзины — только для залогиненного user, между поиском и профилем */}
        {auth?.isAuthenticated && auth?.role === 'user' && (
          <button
            type="button"
            onClick={() => navigate('/user/cart')}
            aria-label="Корзина"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <img src={shoppingCartSvg} alt="" width={35} height={35} style={{ display: 'block' }} />
          </button>
        )}
        
        {/* ✅ ПРАВЫЙ БЛОК: профиль кликабельный -> переход в профиль */}
        <div
          className="header-actions"
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <button
            type="button"
            onClick={goToProfile}
            aria-label="Профиль"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <img
              src={headerAvatar}
              alt="avatar"
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                objectFit: 'cover',
                background: '#fff',
                display: 'block',
              }}
            />
            <div style={{ fontWeight: 800, fontSize: 18, color: '#000' }}>
              {headerName}
            </div>
          </button>

          {auth.isAuthenticated && (
            <button type="button" onClick={handleLogout}>
              Выйти
            </button>
          )}
        </div>
      </header>

      {/* Адаптивность для кнопки корзины */}
      <style>{`
        /* на средних экранах уменьшаем смещение от центра */
        @media (max-width: 1200px) {
          .app-header button[aria-label="Корзина"] {
            left: calc(50% + 168.5px + 80px);
          }
        }
        /* на небольших экранах ставим ближе к профилю и уменьшаем отступ */
        @media (max-width: 900px) {
          .app-header button[aria-label="Корзина"] {
            left: calc(100% - 200px); /* приближение к правой части */
          }
        }
        /* скрываем на очень узких экранах */
        @media (max-width: 480px) {
          .app-header button[aria-label="Корзина"] { display: none; }
        }
      `}</style>

      {/* Вставляем само меню категорий */}
      <CategoryMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div
        className="app-body"
        style={{
          display: 'flex',
          flex: 1,
          padding: '0 24px 24px',
          gap: '24px',
          overflowX: 'hidden',
          overflowY: 'auto', // ✅ было overflow:'hidden'
        }}
      >
        {/* ЛЕВОЕ МЕНЮ */}
        <nav
          className="side-nav"
          style={{
            width: '76px',
            height: '372px',
            background: '#D9D9D9',
            borderRadius: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px 0',
            gap: '28px',
            flexShrink: 0,

            position: 'fixed',
            left: '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
          }}
        >
          {auth?.role === 'admin' ? (
            <>
              <NavLink to="/admin/main" className={navClass} title="Главная" end>
                <HomeIcon size={28} />
              </NavLink>

              <NavLink to="/admin/news" className={navClass} title="Новости (админ)">
                <NewsIcon size={24} />
              </NavLink>

              <NavLink to="/admin/products" className={navClass} title="Товары (админ)">
                <img src={ordersSvg} alt="Товары" style={{ width: 22, height: 22 }} />
              </NavLink>

              <NavLink to="/admin/brands" className={navClass} title="Бренды">
                <TagIcon size={26} />
              </NavLink>

              <NavLink to="/admin/users" className={navClass} title="Пользователи">
                <GroupsIcon size={26} />
              </NavLink>

              <NavLink to="/admin/lists" className={navClass} title="Список">
                <ListIcon size={26} />
              </NavLink>
            </>
          ) : (
            // role === 'user' или неавторизованный пользователь — показываем только 1,2,4,6
            <>
              <NavLink to="/user/main" className={navClass} title="Главная" end>
                <HomeIcon size={28} />
              </NavLink>

              <NavLink to="/user/news" className={navClass} title="Новости">
                <NewsIcon size={24} />
              </NavLink>

              {/* пропускаем "Товары" для user */}

              <NavLink to="/user/brands" className={navClass} title="Бренды">
                <TagIcon size={26} />
              </NavLink>

              <NavLink to="/list" className={navClass} title="Список">
                <ListIcon size={26} />
              </NavLink>
            </>
          )}
        </nav>

        {/* контент с учётом фиксированного меню */}
        <main
          className="page-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            marginLeft: '76px',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: isActive ? '#fff' : '#333',
  background: isActive ? '#7AC142' : 'transparent',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
});

export default PageLayout;