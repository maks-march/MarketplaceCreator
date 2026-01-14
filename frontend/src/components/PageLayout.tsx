import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

// ВАЖНО: используем тот же auth, что AdminLogin/LoginPage
import { useAuth } from '../context/useAuth';

import { HomeIcon, NewsIcon, TagIcon, GroupsIcon, ListIcon } from './Icon';
import ordersSvg from '../assets/Orders.svg';
import shoppingCartSvg from '../assets/Shopping_cart.svg';
import CategoryMenu from './CategoryMenu';
import '../styles/MainPage.css';
import '../styles/CategoryMenu.css';

interface PageLayoutProps {
  children?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const headerName = auth.user?.login?.trim() || auth.user?.name?.trim() || 'Profile name';
  const headerAvatar = (auth.user as any)?.avatarUrl || '/vite.svg';

  const isUserMain = location.pathname === '/user' || location.pathname === '/user/main';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'is-active' : ''}`;

  const loginPath = auth.role === 'admin' ? '/admin/login' : '/login';

  const handleLogout = async () => {
    try {
      await auth.logout();
    } finally {
      navigate(loginPath, { replace: true });
    }
  };

  const handleGoToCart = () => {
    navigate('/user/cart');
  };

  const hasToken = () => {
    const v = localStorage.getItem('access_token');
    return !!v && v !== 'undefined' && v !== 'null';
  };

  const goToProfile = () => {
    // ✅ если контекст не успел синхронизироваться, но токен есть — НЕ кидаем на логин
    const authed = auth.isAuthenticated || hasToken();

    if (!authed) {
      navigate(loginPath);
      return;
    }

    navigate(auth.role === 'admin' ? '/admin/profile' : '/user/profile');
  };

  return (
    <div className="app-shell">
      <header
        className="app-header"
        style={{
          height: '72px',
          background: '#7AC142',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          color: '#fff',
          flexShrink: 0,
          zIndex: 50,
          position: 'relative',
        }}
      >
        {/* LEFT: бренд */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{ cursor: 'pointer', lineHeight: 1.1, fontWeight: 800 }}
            onClick={() => navigate(auth.role === 'admin' ? '/admin/main' : '/user/main')}
          >
            <div>Marketplace</div>
            <div>creator</div>
          </div>
        </div>

        {/* RIGHT: корзина + профиль + выход */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            minWidth: 280,
            justifyContent: 'flex-end',
          }}
        >
          {/* Корзина показывается только user */}
          {auth.role !== 'admin' && (
            <button
              type="button"
              onClick={handleGoToCart}
              title="Корзина"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                height: 32,
                width: 32,
              }}
            >
              <img src={shoppingCartSvg} alt="cart" style={{ width: 28, height: 28, display: 'block' }} />
            </button>
          )}

          {/* Профиль */}
          <button
            type="button"
            onClick={goToProfile}
            title="Личный кабинет"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              color: '#fff',
              fontWeight: 800,
              whiteSpace: 'nowrap',
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
            <span>{headerName}</span>
          </button>

          {/* Выход справа от профиля */}
          <button
            type="button"
            onClick={handleLogout}
            title="Выйти"
            style={{
              background: '#fff',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 999,
              fontWeight: 900,
              height: 34,
              display: 'inline-flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            Выйти
          </button>
        </div>
      </header>

      <CategoryMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div
        className="app-body"
        style={{
          display: 'flex',
          flex: 1,
          padding: '0 24px 24px',
          gap: '24px',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        {/* ЛЕВОЕ МЕНЮ (как у вас было) */}
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
            <>
              <NavLink to="/user/main" className={navClass} title="Главная" end>
                <HomeIcon size={28} />
              </NavLink>
              <NavLink to="/user/news" className={navClass} title="Новости">
                <NewsIcon size={24} />
              </NavLink>
              <NavLink to="/user/brands" className={navClass} title="Бренды">
                <TagIcon size={26} />
              </NavLink>
              <NavLink to="/user/cart" className={navClass} title="Корзина">
                <img src={shoppingCartSvg} alt="Корзина" style={{ width: 22, height: 22 }} />
              </NavLink>
            </>
          )}
        </nav>

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

export default PageLayout;