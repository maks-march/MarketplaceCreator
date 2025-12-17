import React, { useState } from 'react';
import '../styles/MainPage.css';
import { FiltersPanel } from '../components/FiltersPanel';
import { SearchIcon, FilterIcon, SortIcon, ChevronDownIcon } from '../components/Icon';
import PageLayout from '../components/PageLayout';
import filterSvg from '../assets/Filter.svg';
import filterActiveSvg from '../assets/Filter_active.svg';
import productsSvg from '../assets/Orders.svg'; // иконка слева (замени имя, если нужно)
import ProductViewModal from '../components/ProductViewModal';
import CreateProductModal from '../components/CreateProductModal';

const MainPageAdmin: React.FC = () => {
  // состояние модалки создания товара
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [sortOpen, setSortOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
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

  const categories = ['Все', 'Электроника', 'Мебель', 'Аксессуары', 'Одежда'];
  const products = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    description: 'Description',
    price: 0,
    category: categories[(i % (categories.length - 1)) + 1]
  }));

  // --- ВЫБОР КАРТОЧЕК ---
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<null | typeof products[0]>(null);

  const openModal = (p: typeof products[0]) => { setModalProduct(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalProduct(null); };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isAllSelected = selectedIds.size === products.length;
  const selectAll = () => {
    if (isAllSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(products.map(p => p.id)));
  };

  return (
    <PageLayout>
      {/* Верхний заголовок удалён — оставляем только тулбар с заголовком */}
      {/* пока верстка один-в-один с пользовательской, потом изменим поведение под админа */}
      <div className="toolbar">
        <div className="sort-select-box">
          <div className="toolbar-title">
            <img src={productsSvg} alt="Товары" className="admin-title-icon" />
            <span className="toolbar-title-text">Товары</span>
          </div>
        </div>

        <div className="toolbar-actions">
        <button
            type="button"
            className={`toolbar-ico filter-toggle ${filtersOpen ? 'is-active' : ''}`}
            aria-pressed={filtersOpen}
            title="Фильтры"
            onClick={() => setFiltersOpen(o => !o)}
          >
            {/* иконка фильтра из assets */}
            <img
              src={filtersOpen ? filterActiveSvg : filterSvg}
              alt="Фильтры"
              className="filter-icon-img"
              width={20}
              height={20}
            />
          </button>

          <div className="admin-actions">
            <button
              type="button"
              className="admin-select-all"
              onClick={selectAll}
            >
              <span
                className={`admin-select-checkbox ${isAllSelected ? 'checked' : ''}`}
                aria-hidden="true"
              />
              <span>Выбрать все</span>
            </button>

            <button
              type="button"
              className="add-button"
              onClick={() => setIsCreateOpen(true)}
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
      <section className="cards-grid">
        {products.map((p) => (
          <div key={p.id} className="card" onClick={() => openModal(p)}>
            <div className="card-media">
              {/* квадратный чекбокс */}
              <button
                type="button"
                className={`card-checkbox ${selectedIds.has(p.id) ? 'checked' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleSelect(p.id); }}
                aria-pressed={selectedIds.has(p.id)}
              />
            </div>
            <div className="card-body">
              <h3 className="card-title">{p.name}</h3>
              <p className="card-desc">{p.description}</p>
              <div className="card-price">0.00 ₽</div>
              <button
                className="card-add"
                onClick={(e) => { e.stopPropagation(); openModal(p); }}
              >
                Редактировать
              </button>
            </div>
          </div>
        ))}
      </section>
      {/* Product modal */}
      <ProductViewModal open={modalOpen} product={modalProduct} onClose={closeModal} onEdit={(p) => { console.log('edit', p?.id); }} />
      <CreateProductModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={(created) => {
          // временный пример: добавляем/заменяем в локальном массив products
          // сюда вставь свою логику обновления products (setProducts)
          console.log('Создан товар:', created);
          setIsCreateOpen(false);
        }}
      />
      <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </PageLayout>
  );
};

export default MainPageAdmin;