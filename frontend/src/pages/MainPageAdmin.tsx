import React, { useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import ProductViewModal from '../components/ProductViewModal';
import CreateProductModal from '../components/CreateProductModal';
import { FilterIcon } from '../components/Icon';
import { FiltersPanel } from '../components/FiltersPanel';
import '../styles/MainPage.css';
import { useProducts } from '../contexts/ProductsContext';
// import '../styles/AdminProductsPolish.css';
import '../styles/AdminProductsPage.css';
import { getProductThumbUrl } from '../utils/productImages';

type AdminProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[]; // ВАЖНО: только строки (objectURL/http)
  shortInfo?: string; // <-- добавить
};

const pickThumb = (images?: string[]) => {
  const src = (images ?? []).find(s => typeof s === 'string' && s.trim().length > 0);
  return src ?? '';
};

const truncate20 = (s: string) => {
  const t = (s ?? '').toString();
  return t.length > 20 ? `${t.slice(0, 20)}…` : t;
};

const MainPageAdmin: React.FC = () => {
  const { products, addProduct, upsertProduct, getFilteredProducts } = useProducts();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<AdminProduct | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => getFilteredProducts(products), [getFilteredProducts, products]);

  const isAllSelected = filteredProducts.length > 0 && selectedIds.size === filteredProducts.length;

  const toggleSelected = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const setAllSelected = (v: boolean) => {
    setSelectedIds(() => (v ? new Set(filteredProducts.map(p => p.id)) : new Set()));
  };

  const openModal = (p: AdminProduct) => {
    setModalProduct(p);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalProduct(null);
  };

  const handleCreate = (created: {
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    images?: (number | string)[];
    shortInfo?: string;
    brand?: string;
    color?: string;
    subcategory?: string;
    quantity?: number;
  }) => {
    const normalizedImages = (created.images ?? [])
      .filter((x): x is string => typeof x === 'string')
      .map(s => s.trim())
      .filter(Boolean);

    addProduct({
      name: (created.name ?? '').trim() || 'Без названия',
      description: (created.description ?? '').trim(),
      category: (created.category ?? '').trim() || 'Электроника',
      price: Number(created.price ?? 0),
      images: normalizedImages,
      shortInfo: (created.shortInfo ?? '').trim(),
      brand: (created.brand ?? '').trim(),
      color: (created.color ?? '').trim(),
      subcategory: (created.subcategory ?? '').trim(),
      quantity: Number(created.quantity ?? 0),
    });

    setIsCreateOpen(false);
  };

  const handleSaveFromModal = (updated?: any) => {
    if (!updated) return;

    const normalizedImages = (updated.images ?? [])
      .filter((x: unknown): x is string => typeof x === 'string')
      .map((s: string) => s.trim())
      .filter(Boolean);

    upsertProduct({
      id: Number(updated.id),
      name: (updated.name ?? '').trim(),
      description: (updated.description ?? '').trim(),
      category: (updated.category ?? '').trim(),
      price: Number(updated.price ?? 0),
      images: normalizedImages,
      shortInfo: (updated.shortInfo ?? '').trim(),
      brand: (updated.brand ?? '').trim(),
      color: (updated.color ?? '').trim(),
      subcategory: (updated.subcategory ?? '').trim(),
      quantity: Number(updated.quantity ?? 0),
    });

    closeModal();
  };

  return (
    <PageLayout>
      <div className="admin-products-container">
        {/* Шапка оставляем: только заголовок (кнопку "Добавить" убираем отсюда) */}
        <div className="admin-products-header">
          <h1>Товары</h1>
        </div>

        {/* 1) ФИЛЬТРЫ (toolbar) — ВЫШЕ */}
        <div className="toolbar">
          <div />
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

        {/* 2) ОДИН контейнер: "Выбрать все" + "Добавить" — ПРЯМО НАД СЕТКОЙ */}
        <div className="admin-products-controls">
          <button
            type="button"
            className="ap-select-all"
            onClick={() => setAllSelected(!isAllSelected)}
          >
            <input
              className="ap-check"
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => setAllSelected(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              aria-label="Выбрать все"
            />
            <span>Выбрать все</span>
          </button>

          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setIsCreateOpen(true)}
          >
            Добавить
          </button>
        </div>

        {/* 3) Сетка карточек */}
        <section className="cards-grid">
          {filteredProducts.map(p => {
            const thumb = getProductThumbUrl(p.images);
            return (
              <div key={p.id} className="card">
                <div
                  className="card-media"
                  onClick={() => openModal(p)}
                  style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
                >
                  <button
                    type="button"
                    className="fav-badge"
                    aria-pressed={selectedIds.has(p.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelected(p.id);
                    }}
                    title="Выделить"
                  >
                    <input type="checkbox" className="ap-check" checked={selectedIds.has(p.id)} readOnly />
                  </button>

                  {pickThumb(p.images) ? (
                    <img
                      src={pickThumb(p.images)}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                      draggable={false}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f3f3f3', borderRadius: '14px' }} />
                  )}
                </div>

                <div className="card-body">
                  <div className="card-title" title={p.name}>
                    {truncate20(p.name)}
                  </div>
                  <div className="card-desc" title={p.description}>
                    {truncate20(p.description)}
                  </div>
                  <div className="card-price" title={`${p.price} ₽`}>
                    {truncate20(`${p.price} ₽`)}
                  </div>

                  <button className="card-add" type="button" onClick={() => openModal(p)}>
                    Редактировать
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />
        <ProductViewModal open={modalOpen} product={modalProduct} onClose={closeModal} onSave={handleSaveFromModal} />
        <CreateProductModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleCreate} />
      </div>
    </PageLayout>
  );
};

export default MainPageAdmin;