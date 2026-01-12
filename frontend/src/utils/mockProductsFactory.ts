import type { Product } from '../types/productTypes';

const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6D2B79F5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const pick = <T,>(rnd: () => number, arr: T[]) => arr[Math.floor(rnd() * arr.length)];

export const buildMockProducts = (count = 80, seed = 12345): Product[] => {
  const rnd = mulberry32(seed);

  const categories = ['Электроника', 'Мебель', 'Аксессуары', 'Одежда'];
  const brands = ['Apple', 'Samsung', 'Xiaomi', 'IKEA', 'Nike', 'Adidas', 'Sony', 'LG'];
  const countries = ['Россия', 'Китай', 'США'];

  // ровно те цвета, что в фильтре
  const colors = ['Белый', 'Чёрный', 'Красный', 'Зелёный', 'Синий'];

  return Array.from({ length: count }).map((_, i) => {
    const category = pick(rnd, categories);
    const brand = pick(rnd, brands);
    const country = pick(rnd, countries);
    const color = pick(rnd, colors);

    // 0..500000, шаг 10
    const price = Math.round((rnd() * 500000) / 10) * 10;

    // количество 0..200
    const quantity = Math.floor(rnd() * 201);

    return {
      id: String(i + 1),
      name: `${brand} ${category} ${i + 1}`,
      description: `Описание ${brand} ${category} ${i + 1}`,
      price,
      brand,
      country,
      category,
      image: undefined,
      color,
      quantity,
    };
  });
};