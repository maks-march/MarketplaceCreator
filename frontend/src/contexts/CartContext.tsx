import React, { createContext, useContext, useEffect, useState } from 'react';

type CartItemId = number | string;
type CartContextType = {
  items: CartItemId[];
  count: number;
  add: (id: CartItemId) => void;
  remove: (id: CartItemId) => void;
  has: (id: CartItemId) => boolean;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [items, setItems] = useState<CartItemId[]>(() => {
    try {
      const raw = localStorage.getItem('cart_items');
      return raw ? (JSON.parse(raw) as CartItemId[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem('cart_items', JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (id: CartItemId) => setItems((s) => (s.includes(id) ? s : [...s, id]));
  const remove = (id: CartItemId) => setItems((s) => s.filter((i) => i !== id));
  const has = (id: CartItemId) => items.includes(id);
  const clear = () => setItems([]);

  return <CartContext.Provider value={{ items, count: items.length, add, remove, has, clear }}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};