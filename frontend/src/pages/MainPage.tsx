import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/MainPage.css';
import { FiltersPanel } from '../components/FiltersPanel';
import { SearchIcon, FilterIcon, SortIcon, ChevronDownIcon, HeartIcon, HeartFilledIcon } from '../components/Icon';
import PageLayout from '../components/PageLayout';
import ProductModal from '../components/ProductModal';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../context/useAuth';
import { useFavorites } from '../contexts/FavoritesContext';
import { getProductThumbUrl } from '../utils/productImages';

type Props = {
  mode?: 'admin' | 'user';
};

const MainPage: React.FC<Props> = ({ mode }) => {
  const basePath = mode === 'admin' ? '/admin' : mode === 'user' ? '/user' : '';

  const auth = useAuth();
  const cart = useCart();
  const favorites = useFavorites();

  const isUserMode = mode === 'user';
  const isAdminMode = mode === 'admin';

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [sortOpen, setSortOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<any | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { products, getFilteredProducts } = useProducts();

  const toggleFavorite = (id: number) => {
    // избранное только для user
    if (!(mode === 'user' && auth.role === 'user')) return;
    favorites.toggle(id);
  };

  const openView = (p: any) => {
    // ✅ передаём весь товар, чтобы модалка видела brand/color/subcategory/quantity и т.д.
    setViewProduct(p);
    setViewOpen(true);
  };
  const closeView = () => {
    setViewOpen(false);
    setViewProduct(null);
  };

  const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'priceAsc', label: 'Цена по возрастанию' },
    { value: 'priceDesc', label: 'Цена по убыванию' },
    { value: 'name', label: 'По названию' },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === selectedSort)?.label || '';

  const toggleSort = () => setSortOpen(o => !o);
  const chooseSort = (v: string) => {
    setSelectedSort(v);
    setSortOpen(false);
  };

  React.useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.sort-select-box')) setSortOpen(false);
    };
    if (sortOpen) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [sortOpen]);

  React.useEffect(() => {
    if (mode !== 'user') return; // открываем из корзины только на user/main
    const params = new URLSearchParams(location.search);
    const idRaw = params.get('productId');
    if (!idRaw) return;

    const idNum = Number(idRaw);
    if (!Number.isFinite(idNum)) return;

    const found = products.find(p => p.id === idNum);
    if (!found) return;

    // открыть модалку
    openView(found);

    // убрать параметр из URL, чтобы при перезагрузке/назад не открывалось снова
    params.delete('productId');
    navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, mode, products]);

  const filteredProducts = useMemo(() => getFilteredProducts(products), [getFilteredProducts, products]);

  const sortedProducts = useMemo(() => {
    const arr = filteredProducts.slice();

    if (selectedSort === 'priceAsc') arr.sort((a: any, b: any) => Number(a.price ?? 0) - Number(b.price ?? 0));
    else if (selectedSort === 'priceDesc') arr.sort((a: any, b: any) => Number(b.price ?? 0) - Number(a.price ?? 0));
    else if (selectedSort === 'name') arr.sort((a: any, b: any) => String(a.name ?? '').localeCompare(String(b.name ?? ''), 'ru'));

    return arr;
  }, [filteredProducts, selectedSort]);

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
            <span className="sort-icon-wrap"><SortIcon size={16} color="#111" /></span>
            <span className="sort-label">{currentSortLabel}</span>
            <span className={`sort-arrow ${sortOpen ? 'rot' : ''}`}><ChevronDownIcon size={14} color="#111" /></span>
          </button>
          {sortOpen && (
            <div className="sort-menu" role="listbox">
              {sortOptions.map(o => (
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
            onClick={() => setFiltersOpen(o => !o)}
          >
            <FilterIcon color="currentColor" filled={filtersOpen} />
          </button>
        </div>
      </div>
      <section className="cards-grid">
        {sortedProducts.map((p: any) => {
          const inCart = cart.has(p.id);
          const favOn = favorites.has(p.id);
          const thumb = getProductThumbUrl(p.images);

          return (
            <div key={p.id} className="card" onClick={() => openView(p)}>
              <div
                className="card-media"
                style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
              >
                <button
                  type="button"
                  className="fav-badge"
                  aria-label={favOn ? 'Убрать из избранного' : 'В избранное'}
                  aria-pressed={favOn}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(p.id);
                  }}
                >
                  {favOn ? <HeartFilledIcon /> : <HeartIcon />}
                </button>
              </div>

              <div className="card-body">
                <h3 className="card-title">{p.name}</h3>
                <p className="card-desc">{p.description}</p>
                <div className="card-price">{p.price} ₽</div>

                {isUserMode || isAdminMode ? (
                  <button
                    type="button"
                    className={`card-add ${inCart ? 'is-in-cart' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    aria-disabled={!(isUserMode && auth.role === 'user')}
                  >
                    {inCart ? 'В корзине' : 'В корзину'}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </section>
      <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />
      <ProductModal open={viewOpen} product={viewProduct} onClose={closeView} />
    </PageLayout>
  );
};

export default MainPage;