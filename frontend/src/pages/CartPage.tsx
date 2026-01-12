import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductsContext';
import '../styles/CartPage.css';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { HeartFilledIcon, HeartIcon } from '../components/Icon';

type QtyMap = Record<string, number>;
const QTY_KEY = 'mc_cart_qty_v1';

const loadQty = (): QtyMap => {
  try {
    const raw = localStorage.getItem(QTY_KEY);
    return raw ? (JSON.parse(raw) as QtyMap) : {};
  } catch {
    return {};
  }
};

export default function CartPage() {
  const navigate = useNavigate();
  const favorites = useFavorites();

  const cart = useCart();
  const { products } = useProducts();
  const [address, setAddress] = useState('');

  const [qtyById, setQtyById] = useState<QtyMap>(() => loadQty());

  useEffect(() => {
    try { localStorage.setItem(QTY_KEY, JSON.stringify(qtyById)); } catch {}
  }, [qtyById]);

  // товары из корзины
  const items = useMemo(() => {
    const byId = new Map(products.map((p: any) => [String(p.id), p]));
    return cart.items
      .map((id) => byId.get(String(id)))
      .filter(Boolean) as any[];
  }, [cart.items, products]);

  // если в корзине появились новые id — проставить qty=1
  useEffect(() => {
    setQtyById((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const id of cart.items) {
        const key = String(id);
        if (!Number.isFinite(next[key]) || next[key] <= 0) {
          next[key] = 1;
          changed = true;
        }
      }

      // удалить qty для тех, кого уже нет в корзине
      const inCart = new Set(cart.items.map((x) => String(x)));
      for (const key of Object.keys(next)) {
        if (!inCart.has(key)) {
          delete next[key];
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [cart.items]);

  const getQty = (id: number | string) => qtyById[String(id)] ?? 1;

  const inc = (id: number | string) => {
    const key = String(id);
    setQtyById((prev) => ({ ...prev, [key]: (prev[key] ?? 1) + 1 }));
  };

  const dec = (id: number | string) => {
    const key = String(id);
    setQtyById((prev) => {
      const cur = prev[key] ?? 1;
      const nextVal = Math.max(1, cur - 1);
      return { ...prev, [key]: nextVal };
    });
  };

  const removeItem = (id: number | string) => {
    const ok = window.confirm('Товар удаляется из корзины. Продолжить?');
    if (!ok) return;
    cart.remove(id);
  };

  const openFromCart = (id: number | string) => {
    // откроем /user/main и попросим его открыть модалку конкретного товара (см. пункт 3)
    navigate(`/user/main?productId=${encodeURIComponent(String(id))}`);
  };

  const total = useMemo(() => {
    return items.reduce((sum, p) => {
      const q = getQty(p.id);
      const price = Number(p.price ?? 0);
      return sum + price * q;
    }, 0);
  }, [items, qtyById]);

  return (
    <PageLayout>
      <div className="cart-page">
        <h1 className="cart-title">Корзина</h1>

        <div className="cart-layout">
          <div className="cart-list">
            {items.map((p) => {
              const q = getQty(p.id);
              const price = Number(p.price ?? 0);
              const lineTotal = price * q;
              const img = (p.images ?? []).find((s: any) => typeof s === 'string' && s.trim().length > 0) ?? '';

              return (
                <div key={p.id} className="cart-item">
                  <button
                    type="button"
                    className="cart-item__img cart-item__img--click"
                    onClick={() => openFromCart(p.id)}
                    aria-label="Открыть товар"
                    style={img ? { backgroundImage: `url(${img})` } : undefined}
                  />

                  {/* ✅ делаем info-relative, чтобы иконки встали справа сверху */}
                  <div className="cart-item__info cart-item__info--rel">
                    {/* ✅ иконки справа сверху */}
                    <div className="cart-item__top-icons">
                      <button
                        className="cart-top-ico"
                        type="button"
                        aria-label="В избранное"
                        onClick={() => {
                          if (favorites.has(p.id)) favorites.remove(p.id);
                          else favorites.add(p.id);
                        }}
                      >
                        {/* можно заменить на svg позже; сейчас главное — зона 35px и черный цвет */}
                        ♡
                      </button>

                      <button
                        className="cart-top-ico cart-top-ico--trash"
                        type="button"
                        aria-label="Удалить"
                        onClick={() => removeItem(p.id)}
                      >
                        🗑
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-item__name cart-item__name--link"
                      onClick={() => openFromCart(p.id)}
                      aria-label="Открыть товар"
                    >
                      {p.name ?? 'Товар'}
                    </button>

                    <div className="cart-item__desc">{p.description ?? 'Описание товара'}</div>

                    {/* ✅ нижняя зона: счетчик + цена (будет прижато вниз через CSS) */}
                    <div className="cart-item__bottom">
                      <div className="cart-qty">
                        <button className="cart-qty__btn" type="button" aria-label="Минус" onClick={() => dec(p.id)}>
                          –
                        </button>
                        <div className="cart-qty__val">{q}</div>
                        <button className="cart-qty__btn" type="button" aria-label="Плюс" onClick={() => inc(p.id)}>
                          +
                        </button>
                      </div>

                      <div className="cart-item__price">{lineTotal.toFixed(2)} Руб</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {items.length === 0 && <div className="cart-empty">Корзина пуста</div>}
          </div>

          <aside className="cart-right">
            <div className="cart-card">
              <div className="cart-card__row">
                <div className="cart-card__label">Итого</div>
                <div className="cart-card__value">{total.toFixed(2)} Руб</div>
              </div>
              <button className="cart-btn cart-btn--primary" type="button">
                Перейти к оплате
              </button>
            </div>

            <div className="cart-card">
              <div className="cart-card__label">Адрес доставки</div>
              <input
                className="cart-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Введите..."
              />
              <button className="cart-btn" type="button">
                Сохранить
              </button>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}