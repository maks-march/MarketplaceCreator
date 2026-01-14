import React, { useEffect, useMemo, useState } from 'react';
import '../styles/MainPage.css';
import { FiltersPanel } from '../components/FiltersPanel';
import { FilterIcon, SortIcon, ChevronDownIcon, HeartIcon, HeartFilledIcon } from '../components/Icon';
import PageLayout from '../components/PageLayout';
import { productsApi } from '../services/api';
import type { Product as ApiProduct } from '../services/api/products/product.types';

type Props = { mode?: 'admin' | 'user' };

type UiProduct = {
  id: number;
  title: string;
  description: string;
  price?: number;
  images: string[];
};

const pickList = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.products)) return payload.products;
  return [];
};

const normalizeImages = (imgs: any): string[] => {
  if (!Array.isArray(imgs)) return [];
  return imgs
    .filter((x) => typeof x === 'string')
    .map((s) => s.trim())
    .filter(Boolean);
};

const pickThumb = (p: UiProduct) => p.images.find((s) => s.trim().length > 0) ?? '';

const MainPage: React.FC<Props> = ({ mode }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedSort, setSelectedSort] = useState('popular');
  const [sortOpen, setSortOpen] = useState(false);

  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [loadedOk, setLoadedOk] = useState(false);

  const [products, setProducts] = useState<UiProduct[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'priceAsc', label: 'Цена по возрастанию' },
    { value: 'priceDesc', label: 'Цена по убыванию' },
    { value: 'name', label: 'По названию' },
  ];
  const currentSortLabel = sortOptions.find((o) => o.value === selectedSort)?.label || '';
  const toggleSort = () => setSortOpen((o) => !o);
  const chooseSort = (v: string) => {
    setSelectedSort(v);
    setSortOpen(false);
  };

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      setLoadedOk(false);

      try {
        const res: any = await productsApi.getAll();
        if (!mounted) return;

        if (!res) {
          setError('Пустой ответ от API');
          return;
        }

        if (res.success) {
          const payload = res.response ?? res.data ?? null;
          const list = pickList(payload);

          const mapped: UiProduct[] = list.map((p: any) => ({
            id: Number(p.id),
            title: String(p.title ?? p.name ?? 'Товар'),
            description: String(p.description ?? p.text ?? ''),
            price: p.price != null ? Number(p.price) : undefined,
            images: normalizeImages(p.images ?? p.photos ?? p.pictures),
          }));

          setProducts(mapped);
          setLoadedOk(true);
        } else {
          setError((res?.errors && res.errors[0]) || 'Ошибка получения товаров');
        }
      } catch (e) {
        if (mounted) setError('Ошибка сети при загрузке товаров');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.sort-select-box')) setSortOpen(false);
    };
    if (sortOpen) document.addEventListener('mousedown', close);
    return () => {
      mounted = false;
      document.removeEventListener('mousedown', close);
    };
  }, [sortOpen]);

  const showEmpty = loadedOk && !loading && !error && products.length === 0;

  return (
    <PageLayout>
      <div className="toolbar">
        <div className="sort-select-box">
          <button
            type="button"
            className={`sort-trigger ${sortOpen ? 'open' : ''}`}
            onClick={toggleSort}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
          >
            <span className="sort-icon-wrap">
              <SortIcon size={16} color="#111" />
            </span>
            <span className="sort-label">{currentSortLabel}</span>
            <span className={`sort-arrow ${sortOpen ? 'rot' : ''}`}>
              <ChevronDownIcon size={14} color="#111" />
            </span>
          </button>

          {sortOpen && (
            <div className="sort-menu" role="listbox">
              {sortOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`sort-item ${o.value === selectedSort ? 'active' : ''}`}
                  onClick={() => chooseSort(o.value)}
                  role="option"
                  aria-selected={o.value === selectedSort}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className={`toolbar-ico filter-toggle ${filtersOpen ? 'is-active' : ''}`}
            aria-pressed={filtersOpen}
            title="Фильтры"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <FilterIcon color="currentColor" filled={filtersOpen} />
          </button>
        </div>
      </div>

      {loading && <div style={{ padding: 16 }}>Загрузка...</div>}
      {error && <div style={{ padding: 16, color: 'red' }}>{error}</div>}
      {showEmpty && <div style={{ padding: 16 }}>Товары не найдены</div>}

      {!error && products.length > 0 && (
        <section className="cards-grid">
          {products.map((p) => {
            const thumb = pickThumb(p);
            return (
              <div key={p.id} className="card">
                <div
                  className="card-media"
                  style={thumb ? { backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                >
                  <button
                    type="button"
                    className="fav-badge"
                    aria-label={favorites.has(p.id) ? 'Убрать из избранного' : 'В избранное'}
                    aria-pressed={favorites.has(p.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p.id);
                    }}
                  >
                    {favorites.has(p.id) ? <HeartFilledIcon /> : <HeartIcon />}
                  </button>
                </div>

                <div className="card-body">
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-desc">{p.description}</p>
                  <div className="card-price">{p.price != null ? `${p.price.toFixed(2)} ₽` : '—'}</div>
                  <button className="card-add">ADD</button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </PageLayout>
  );
};

export default MainPage;