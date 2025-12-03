import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, NewsIcon, OrdersIcon, TagIcon, GroupsIcon, ListIcon } from './Icon';
import searchIcon from '../assets/Search.svg';
import CategoryMenu from './CategoryMenu'; // Импортируем меню
import '../styles/MainPage.css';
import '../styles/CategoryMenu.css'; // Стили меню

interface PageLayoutProps {
  children?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMainPage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        
        {/* Кнопка категорий - ТОЛЬКО НА ГЛАВНОЙ */}
        {isMainPage && (
          <div 
            className={`category-trigger ${isMenuOpen ? 'is-open' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Категории"
            // Добавляем стили прямо сюда, чтобы гарантировать позиционирование
            style={{
                position: 'absolute',
                left: '32px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                zIndex: 60 // Поверх всего
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="5" width="20" height="2.5" rx="1.25" fill="white"/>
              <rect x="2" y="10.75" width="20" height="2.5" rx="1.25" fill="white"/>
              <rect x="2" y="16.5" width="20" height="2.5" rx="1.25" fill="white"/>
            </svg>
          </div>
        )}

        {/* Заголовок: черный цвет, отступ 270px */}
        {/* Важно: marginLeft работает от левого края контейнера flex, 
            но если там есть другие элементы, они могут сдвигать. 
            Лучше использовать абсолютное позиционирование или гарантировать порядок.
            В данном случае, так как кнопка категорий теперь absolute, она не влияет на поток.
        */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          lineHeight: '1', 
          fontWeight: 800, 
          fontSize: '18px',
          color: '#000',       
          marginLeft: '270px' // Это должно работать, если слева в потоке ничего нет
        }}>
          <span>Marketplace</span>
          <span>creator</span>
        </div>

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

        {/* Профиль с отступом 280px от правого края */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '280px' }}>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '50%', background: '#fff', 
            color: '#7AC142', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
          }}>
            U
          </div>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Profile name</span>
        </div>
      </header>

      {/* Вставляем само меню категорий */}
      <CategoryMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div
        className="app-body"
        style={{
          display: 'flex',
          flex: 1,
          padding: '0 24px 24px',
          gap: '24px',
          overflow: 'hidden',
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
          <NavLink to="/" style={navLinkStyle} title="Главная">
            <HomeIcon size={28} />
          </NavLink>

          <NavLink to="/news" style={navLinkStyle} title="Новости">
            <NewsIcon size={24} />
          </NavLink>

          <NavLink to="/orders" style={navLinkStyle} title="Заказы">
            <OrdersIcon size={26} />
          </NavLink>

          <NavLink to="/brands" style={navLinkStyle} title="Бренды">
            <TagIcon size={26} />
          </NavLink>

          <NavLink to="/groups" style={navLinkStyle} title="Группы">
            <GroupsIcon size={26} />
          </NavLink>

          <NavLink to="/list" style={navLinkStyle} title="Список">
            <ListIcon size={26} />
          </NavLink>
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