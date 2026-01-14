import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { productsApi } from '../services/api';
import { normalizeProductImageUrls } from '../utils/productImages';

export type ProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  brand?: string;
  color?: string;
  quantity?: number;
};

export type ProductFilters = {
  category: string;
  brand: string;
  color: string;
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
  loading: boolean;
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  loadProducts: () => Promise<void>;
  getFilteredProducts: () => ProductRow[];
  createProduct: (data: any) => Promise<boolean>;
};

const ProductsContext = createContext<Ctx | undefined>(undefined);

const norm = (v: unknown) => (v ?? '').toString().trim().toLowerCase();

export const ProductsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll(1, 1000);
      if (res.success && res.response) {
        const apiProducts = (res.response.products ?? res.response) as any[];

        const mapped: ProductRow[] = (apiProducts ?? []).map((p: any) => ({
          id: Number(p.id),
          name: p.title ?? p.name ?? '',
          description: p.description ?? '',
          price: Number(p.price ?? 0),
          category: p.category ?? '',
          images: normalizeProductImageUrls(p.imageLinks ?? p.images),
          brand: p.brand?.name ?? p.brand ?? undefined,
          color: p.color ?? undefined,
          quantity: p.quantity ?? undefined,
        }));

        setProducts(mapped);
      }
    } catch (e) {
      console.error('loadProducts failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFilteredProducts = useCallback(() => {
    const fCat = norm(filters.category);
    const fBrand = norm(filters.brand);
    const fColor = norm(filters.color);
    const min = filters.priceMin;
    const max = filters.priceMax;

    return products.filter((p) => {
      if (fCat && fCat !== 'все' && norm(p.category) !== fCat) return false;
      if (fBrand && fBrand !== 'все' && norm(p.brand) !== fBrand) return false;
      if (fColor && fColor !== 'все' && norm(p.color) !== fColor) return false;
      if (p.price < min || p.price > max) return false;
      return true;
    });
  }, [filters, products]);

  const createProduct = async (payload: any) => {
    const res: any = await productsApi.create(payload);
    if (!res?.success) {
      throw new Error((res?.errors && res.errors[0]) || 'Не удалось создать товар');
    }
    await loadProducts();
    return res.response ?? null;
  };

  useEffect(() => {
    // автозагрузка списка
    loadProducts().catch(() => {});
  }, [loadProducts]);

  const value = useMemo<Ctx>(
    () => ({
      products,
      loading,
      filters,
      setFilters,
      loadProducts,
      getFilteredProducts,
      createProduct,
    }),
    [products, loading, filters, loadProducts, getFilteredProducts, createProduct]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};