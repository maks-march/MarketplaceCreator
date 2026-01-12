import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UiCategory = {
  id: number;
  name: string;
  icon?: string; // путь к asset
};

export type UiSubcategory = {
  id: number;
  categoryId: number;
  name: string;
};

type CategoriesState = {
  categories: UiCategory[];
  subcategories: UiSubcategory[];
};

type Ctx = {
  categories: UiCategory[];
  subcategories: UiSubcategory[];
  updateCategoryName: (id: number, name: string) => void;
  updateSubcategory: (id: number, patch: Partial<UiSubcategory>) => void;
  createCategory: (name: string) => void;
  createSubcategory: (categoryId: number, name: string) => void;

  deleteCategory: (id: number) => void;      // ✅ add
  deleteSubcategory: (id: number) => void;   // ✅ add
};

const CategoriesContext = createContext<Ctx | undefined>(undefined);

const STORAGE_KEY = 'mc_categories_v1';

const defaultState: CategoriesState = {
  categories: [
    { id: 1, name: 'Акции' },
    { id: 2, name: 'Новый год' },
    { id: 3, name: 'Одежда' },
    { id: 4, name: 'Обувь' },
    { id: 5, name: 'Женщинам' },
    { id: 6, name: 'Мужчинам' },
    { id: 7, name: 'Детям' },
    { id: 8, name: 'Электроника' },
    { id: 9, name: 'Здоровье' },
    { id: 10, name: 'Хобби' },
  ],
  subcategories: [
    { id: 1, categoryId: 2, name: 'Ёлки' },
    { id: 2, categoryId: 2, name: 'Игрушки' },
    { id: 3, categoryId: 2, name: 'Гирлянды' },
    { id: 4, categoryId: 2, name: 'Украшения' },
    { id: 5, categoryId: 2, name: 'Упаковки' },
    { id: 6, categoryId: 2, name: 'Подарки' },
    { id: 7, categoryId: 2, name: 'Фейерверки' },
    { id: 8, categoryId: 2, name: 'Открытки' },
    { id: 9, categoryId: 2, name: 'Костюмы' },
    { id: 10, categoryId: 2, name: 'Символ года' },
  ],
};

const loadState = (): CategoriesState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as CategoriesState;
    if (!parsed?.categories || !parsed?.subcategories) return defaultState;
    return parsed;
  } catch {
    return defaultState;
  }
};

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CategoriesState>(() => loadState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const api: Ctx = useMemo(() => {
    return {
      categories: state.categories,
      subcategories: state.subcategories,

      updateCategoryName: (id, name) => {
        const nextName = name.trim();
        if (!nextName) return;
        setState(prev => ({
          ...prev,
          categories: prev.categories.map(c => (c.id === id ? { ...c, name: nextName } : c)),
        }));
      },

      updateSubcategory: (id, patch) => {
        setState(prev => ({
          ...prev,
          subcategories: prev.subcategories.map(s => (s.id === id ? { ...s, ...patch } : s)),
        }));
      },

      createCategory: (name) => {
        const n = name.trim();
        if (!n) return;
        setState(prev => {
          const nextId = Math.max(0, ...prev.categories.map(c => c.id)) + 1;
          return { ...prev, categories: [{ id: nextId, name: n }, ...prev.categories] };
        });
      },

      createSubcategory: (categoryId, name) => {
        const n = name.trim();
        if (!n) return;
        setState(prev => {
          const nextId = Math.max(0, ...prev.subcategories.map(s => s.id)) + 1;
          return { ...prev, subcategories: [...prev.subcategories, { id: nextId, categoryId, name: n }] };
        });
      },

      deleteCategory: (id) => {
        setState(prev => ({
          categories: prev.categories.filter(c => c.id !== id),
          // ✅ удаляем все подкатегории этой категории
          subcategories: prev.subcategories.filter(s => s.categoryId !== id),
        }));
      },

      deleteSubcategory: (id) => {
        setState(prev => ({
          ...prev,
          subcategories: prev.subcategories.filter(s => s.id !== id),
        }));
      },
    };
  }, [state]);

  return <CategoriesContext.Provider value={api}>{children}</CategoriesContext.Provider>;
};

export const useCategories = () => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider');
  return ctx;
};