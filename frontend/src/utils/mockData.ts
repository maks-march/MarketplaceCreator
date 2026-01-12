import type { User } from '../types/userTypes';
import type { Product } from '../types/productTypes';
import type { Brand } from '../types/brandTypes';
import type { News } from '../types/newsTypes';
import { buildMockProducts } from './mockProductsFactory';

export const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    login: '1',
    password: '1',
    email: 'admin@local',
    name: 'Администратор',
    role: 'Администратор',
    dateCreated: '01.01.2026',
    avatarUrl: '/vite.svg',
  },
  {
    id: 'user-1',
    login: '1',
    password: '1',
    email: 'user@local',
    name: 'Пользователь',
    role: 'Пользователь',
    dateCreated: '01.01.2026',
    avatarUrl: '/vite.svg',
  },
];

export const MOCK_PRODUCTS: Product[] = buildMockProducts(120, 20260111);

export const MOCK_BRANDS: Brand[] = [
  { 
    id: '1', 
    name: 'Бренд 1', 
    country: 'Россия', 
    description: 'Российский производитель электроники высокого качества', 
    categories: ['Электроника'] 
  },
  { 
    id: '2', 
    name: 'Бренд 2', 
    country: 'Китай', 
    description: 'Международный поставщик мебели и аксессуаров', 
    categories: ['Мебель', 'Аксессуары'] 
  },
  { 
    id: '3', 
    name: 'Бренд 3', 
    country: 'США', 
    description: 'Американская компания инновационных решений', 
    categories: ['Электроника'] 
  },
];

export const MOCK_NEWS: News[] = [
  { 
    id: '1', 
    title: 'Запуск нового каталога товаров', 
    date: '20.11.2024 11:00', 
    images: ['IMG1', 'IMG2', 'IMG3'], 
    text: 'Мы рады сообщить о запуске полностью обновленного каталога товаров с улучшенной навигацией и поиском' 
  },
  { 
    id: '2', 
    title: 'Расширение ассортимента брендов', 
    date: '19.11.2024 14:30', 
    images: ['IMG1'], 
    text: 'Добавлены новые популярные бренды и производители' 
  },
  { 
    id: '3', 
    title: 'Улучшение системы доставки', 
    date: '18.11.2024 10:15', 
    images: ['IMG1', 'IMG2'], 
    text: 'Теперь доставка доступна во все регионы страны' 
  },
];