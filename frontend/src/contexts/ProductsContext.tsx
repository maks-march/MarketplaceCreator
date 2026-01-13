import React, { createContext, useContext, useMemo, useState } from 'react';
import { productsApi } from '../services/api/products/products.api';
import type { Product } from '../services/api/products/product.types';

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
  brand: string; // подстрока
  color: string; // '' = все
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

  // CRUD локально (для UI), API CRUD делайте на страницах админки через productsApi.*
  addProduct: (p: Omit<ProductRow, 'id'>) => void;
  upsertProduct: (p: ProductRow) => void;

  loadProducts: (page?: number, pageSize?: number) => Promise<void>;

  getFilteredProducts: (src?: ProductRow[]) => ProductRow[];
};

const ProductsContext = createContext<Ctx | null>(null);

const norm = (v: unknown) => (v ?? '').toString().trim().toLowerCase();

const mapApiProductToRow = (p: Product): ProductRow => {
  return {
    id: Number(p.id),
    name: p.title ?? '',
    description: p.description ?? '',
    price: Number(p.price ?? 0),
    category: p.category ?? '',
    images: (p.imageLinks ?? []).filter((x): x is string => typeof x === 'string' && x.trim().length > 0),
    brand: p.brand?.name ?? '',
    color: '',
    shortInfo: '',
    subcategory: '',
    quantity: undefined,
  };
};

export const ProductsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const addProduct: Ctx['addProduct'] = (p) => {
    setProducts((prev) => {
      const nextId = Math.max(0, ...prev.map((x) => x.id)) + 1;
      return [{ ...p, id: nextId }, ...prev];
    });
  };

  const upsertProduct: Ctx['upsertProduct'] = (p) => {
    setProducts((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx === -1) return [p, ...prev];
      const copy = prev.slice();
      copy[idx] = p;
      return copy;
    });
  };

  const loadProducts: Ctx['loadProducts'] = async (page = 1, pageSize = 50) => {
    const res = await productsApi.getAll(page, pageSize);
    if (!res.success) return;

    const payload = res.response as any;
    const list: Product[] = (payload?.products ?? payload ?? []) as Product[];
    setProducts(list.map(mapApiProductToRow));
  };

  const getFilteredProducts: Ctx['getFilteredProducts'] = (src) => {
    const list = src ?? products;

    const fCat = norm(filters.category);
    const fBrand = norm(filters.brand);
    const fColor = norm(filters.color);

    return list.filter((p) => {
      const catOk = !fCat || norm(p.category) === fCat;
      const brandOk = !fBrand || norm(p.brand).includes(fBrand);
      const colorOk = !fColor || norm(p.color) === fColor;
      const priceOk = p.price >= filters.priceMin && p.price <= filters.priceMax;
      return catOk && brandOk && colorOk && priceOk;
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
      loadProducts,
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