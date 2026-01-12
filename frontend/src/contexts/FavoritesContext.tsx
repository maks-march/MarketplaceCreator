import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type FavId = number | string;

type FavoritesContextType = {
  ids: FavId[];
  has: (id: FavId) => boolean;
  toggle: (id: FavId) => void;
  add: (id: FavId) => void;
  remove: (id: FavId) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);
const STORAGE_KEY = 'favorite_items';

export const FavoritesProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [ids, setIds] = useState<FavId[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as FavId[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const api = useMemo<FavoritesContextType>(() => {
    const has = (id: FavId) => ids.includes(id);
    const add = (id: FavId) => setIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    const remove = (id: FavId) => setIds(prev => prev.filter(x => x !== id));
    const toggle = (id: FavId) => setIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    const clear = () => setIds([]);
    return { ids, has, toggle, add, remove, clear };
  }, [ids]);

  return <FavoritesContext.Provider value={api}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};