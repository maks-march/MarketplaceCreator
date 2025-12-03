import type { User } from '../types/userTypes';
import type { Product } from '../types/productTypes';
import type { Brand } from '../types/brandTypes';
import type { News } from '../types/newsTypes';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    login: 'user',
    password: '12345',
    email: 'user@example.com',
    name: 'Иван Петров Иванович',
    role: 'Пользователь',
    dateCreated: '01.01.2023',
  },
  {
    id: '2',
    login: 'admin',
    password: '12345',
    email: 'admin@admin.com',
    name: 'Администратор Системы',
    role: 'Администратор',
    dateCreated: '01.01.2020',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Товар 1', 
    description: 'Описание товара', 
    price: 1500, 
    brand: 'Бренд 1', 
    country: 'Россия', 
    category: 'Электроника' 
  },
  { 
    id: '2', 
    name: 'Товар 2', 
    description: 'Описание товара', 
    price: 2500, 
    brand: 'Бренд 2', 
    country: 'Китай', 
    category: 'Мебель' 
  },
  { 
    id: '3', 
    name: 'Товар 3', 
    description: 'Описание товара', 
    price: 999, 
    brand: 'Бренд 1', 
    country: 'Россия', 
    category: 'Электроника' 
  },
  { 
    id: '4', 
    name: 'Товар 4', 
    description: 'Описание товара', 
    price: 3500, 
    brand: 'Бренд 3', 
    country: 'США', 
    category: 'Электроника' 
  },
  { 
    id: '5', 
    name: 'Товар 5', 
    description: 'Описание товара', 
    price: 1200, 
    brand: 'Бренд 2', 
    country: 'Китай', 
    category: 'Аксессуары' 
  },
];

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