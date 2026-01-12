import React, { createContext, useContext, useMemo, useState } from 'react';
import { MOCK_PRODUCTS } from '../utils/mockData';

export type ProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  shortInfo?: string;
  brand?: string;
  color?: string;
  subcategory?: string;
  quantity?: number;
};

export type ProductFilters = {
  category: string; // '' = все
  brand: string;    // подстрока
  color: string;    // '' = все
  priceMin: number;
  priceMax: number;
};

const DEFAULT_FILTERS: ProductFilters = {
  category: '',
  brand: '',
  color: '',
  priceMin: 0,
  priceMax: 9999999,
};

type Ctx = {
  products: ProductRow[];
  setProducts: React.Dispatch<React.SetStateAction<ProductRow[]>>;

  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;

  addProduct: (p: Omit<ProductRow, 'id'>) => void;
  upsertProduct: (p: ProductRow) => void;

  getFilteredProducts: (src?: ProductRow[]) => ProductRow[];
};

const ProductsContext = createContext<Ctx | null>(null);

const norm = (v: unknown) => (v ?? '').toString().trim().toLowerCase();

const mapMockToRow = (): ProductRow[] => {
  return MOCK_PRODUCTS.map((p) => ({
    id: Number(p.id),
    name: p.name ?? '',
    description: p.description ?? '',
    price: Number(p.price ?? 0),
    category: p.category ?? '',
    images: p.image ? [p.image] : [],
    brand: p.brand ?? '',
    color: p.color ?? '',
    shortInfo: '',

    // ✅ добавляем недостающие поля из моков (чтобы в модалке не было прочерков)
    subcategory: '',
    quantity: Number(p.quantity ?? 0),
  }));
};

export const ProductsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [products, setProducts] = useState<ProductRow[]>(() => mapMockToRow());
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const addProduct: Ctx['addProduct'] = (p) => {
    setProducts((prev) => {
      const nextId = Math.max(0, ...prev.map((x) => x.id)) + 1;
      return [{ ...p, id: nextId }, ...prev];
    });
  };

  const upsertProduct: Ctx['upsertProduct'] = (p) => {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev];
    });
  };

  const getFilteredProducts: Ctx['getFilteredProducts'] = (src) => {
    const list = src ?? products;

    const fCat = norm(filters.category);
    const fBrand = norm(filters.brand);
    const fColor = norm(filters.color);

    const min = Number.isFinite(filters.priceMin) ? filters.priceMin : 0;
    const max = Number.isFinite(filters.priceMax) ? filters.priceMax : 9999999;

    return list.filter((p) => {
      const pCat = norm(p.category);
      const pBrand = norm(p.brand);
      const pColor = norm(p.color);
      const price = Number(p.price ?? 0);

      if (fCat && pCat !== fCat) return false;
      if (fBrand && !pBrand.includes(fBrand)) return false;
      if (fColor && pColor !== fColor) return false;
      if (price < min) return false;
      if (price > max) return false;

      return true;
    });
  };

  const value = useMemo<Ctx>(
    () => ({
      products,
      setProducts,
      filters,
      setFilters,
      addProduct,
      upsertProduct,
      getFilteredProducts,
    }),
    [products, filters]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};