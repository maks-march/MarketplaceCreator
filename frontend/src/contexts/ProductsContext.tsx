import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { productsApi } from '../services/api/products/products.api';
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
      if (res.success && res.data) {
        const items = res.data.products || [];
        
        const mapped: ProductRow[] = items.map((p: any) => ({
           id: p.id,
           name: p.title,
           description: p.description,
           price: p.price,
           category: p.category, 
           images: p.imageLinks ? normalizeProductImageUrls(p.imageLinks) : [],
           brand: p.brand?.name || 'Без бренда',
           quantity: 100
        }));
        setProducts(mapped);
      }
    } catch (e) {
      console.error('Ошибка загрузки товаров', e);
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

  const createProduct = useCallback(async (data: any) => {
      try {
          const res = await productsApi.create(data);
          if (res.success) {
              await loadProducts();
              return true;
          }
          return false;
      } catch (e) {
          console.error(e);
          return false;
      }
  }, [loadProducts]);

  useEffect(() => {
      loadProducts();
  }, [loadProducts]);

  const value = useMemo<Ctx>(
    () => ({
      products,
      loading,
      filters,
      setFilters,
      loadProducts,
      getFilteredProducts,
      createProduct
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