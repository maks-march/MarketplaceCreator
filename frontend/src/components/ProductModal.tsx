import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/ProductModal.css';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../context/useAuth';
import { useFavorites } from '../contexts/FavoritesContext';

type Product = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  images?: string[];
  // дополнительные поля (если они есть в данных — покажем)
  shortInfo?: string;
  brand?: string;
  subcategory?: string;
  color?: string;
  quantity?: number;
};

type Props = {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onEdit?: (p?: Product | null) => void;
};

const ProductModal: React.FC<Props> = ({ open, product, onClose, onEdit }) => {
  const auth = useAuth();
  const cart = useCart();
  const favorites = useFavorites();

  const canAddToCart = auth.role === 'user'; // админ видит кнопку, но она не добавляет
  const inCart = !!product && cart.has(product.id);

  const canFavorite = auth.role === 'user';
  const inFav = !!product && favorites.has(product.id);

  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  // drag-to-scroll refs
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);

  const images = useMemo(() => {
    const arr = (product?.images ?? []).filter((s) => typeof s === 'string' && s.trim().length > 0);
    return arr;
  }, [product]);

  const activeSrc = images[activeIndex] ?? images[0] ?? '';

  useEffect(() => {
    // при открытии/смене товара — сбросить активную картинку
    if (open) setActiveIndex(0);
  }, [open, product?.id]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!images.length) return;
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % images.length);
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, images.length]);

  if (!open || !product) return null;

  const prevPhoto = () => {
    if (!images.length) return;
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextPhoto = () => {
    if (!images.length) return;
    setActiveIndex((i) => (i + 1) % images.length);
  };

  const onThumbsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!thumbsRef.current) return;
    // скроллим галерею горизонтально колёсиком
    e.preventDefault();
    const delta = e.deltaY || e.deltaX;
    thumbsRef.current.scrollLeft += delta;
  };

  const onThumbsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbsRef.current) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragScrollLeftRef.current = thumbsRef.current.scrollLeft;
  };

  const onThumbsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbsRef.current) return;
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    thumbsRef.current.scrollLeft = dragScrollLeftRef.current - dx;
  };

  const stopThumbsDrag = () => {
    isDraggingRef.current = false;
  };

  const scrollThumbs = (dir: number) => {
    if (!thumbsRef.current) return;
    thumbsRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  const toggleCart = () => {
    if (!product) return;
    if (!canAddToCart) return; // admin: не работает
    if (inCart) cart.remove(product.id);
    else cart.add(product.id);
  };

  const toggleFavorite = () => {
    if (!canFavorite) return;
    favorites.toggle(product.id);
  };

  return ReactDOM.createPortal(
    <div className="pm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pm-wrap pm-wrap--big" role="dialog" aria-modal="true" aria-label="Просмотр товара">
        <button className="pm-close" aria-label="Закрыть" onClick={onClose}>✕</button>

        <div className="pm-grid">
          <div className="pm-left">
            <div className="pm-main-photo">
              {activeSrc ? (
                <img src={activeSrc} alt={product.name} />
              ) : (
                <div className="pm-main-photo__placeholder" />
              )}
            </div>

            <div className="pm-thumbs-bar">
              <button type="button" className="pm-thumbs-nav pm-thumbs-nav--prev" onClick={prevPhoto} aria-label="Назад">
                ‹
              </button>

              <div
                className="pm-thumbs"
                ref={thumbsRef}
                onWheel={onThumbsWheel}
                onMouseDown={onThumbsMouseDown}
                onMouseMove={onThumbsMouseMove}
                onMouseUp={stopThumbsDrag}
                onMouseLeave={stopThumbsDrag}
              >
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    className={`pm-thumb-tile ${i === activeIndex ? 'is-active' : ''}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Фото ${i + 1}`}
                  >
                    <img src={src} alt="" draggable={false} />
                  </button>
                ))}
              </div>

              <button type="button" className="pm-thumbs-nav pm-thumbs-nav--next" onClick={nextPhoto} aria-label="Вперёд">
                ›
              </button>
            </div>
          </div>

          {/* RIGHT: инфо */}
          <div className="pm-right">
            <div className="pm-title-row">
              <div className="pm-title-xl">{product.name}</div>
            </div>

            <div className="pm-block">
              <div className="pm-block__title">Описание товара</div>
              <div className="pm-block__text">{product.description?.trim() || '—'}</div>
            </div>

            <div className="pm-block">
              <div className="pm-block__title">Характеристики товара</div>
              <div className="pm-specs">
                <div className="pm-spec-row"><span>Бренд</span><span>{product.brand || '—'}</span></div>
                <div className="pm-spec-row"><span>Категория</span><span>{product.category || '—'}</span></div>
                <div className="pm-spec-row"><span>Подкатегория</span><span>{product.subcategory || '—'}</span></div>
                <div className="pm-spec-row"><span>Цвет</span><span>{product.color || '—'}</span></div>
                <div className="pm-spec-row"><span>Кол-во</span><span>{product.quantity ?? '—'}</span></div>
              </div>
            </div>

            <div className="pm-footer-spacer" />
          </div>

          {/* ✅ НОВЫЙ блок справа: цена + 2 кнопки */}
          <aside className="pm-side" aria-label="Покупка">
            {/* Было "рублей", стало "руб." */}
            <div className="pm-side__price">{Number(product.price ?? 0).toFixed(2)} руб.</div>

            <div className="pm-side__actions">
              <button
                type="button"
                className={`pm-action-btn pm-action-btn--primary ${inCart ? 'is-in-cart' : ''}`}
                onClick={toggleCart}
                aria-disabled={!canAddToCart}
              >
                {inCart ? 'В корзине' : 'В корзину'}
              </button>

              <button
                type="button"
                className={`pm-action-btn pm-action-btn--ghost ${inFav ? 'is-in-fav' : ''}`}
                onClick={toggleFavorite}
                aria-disabled={!canFavorite}
              >
                {inFav ? 'В избранном' : 'В избранное'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;