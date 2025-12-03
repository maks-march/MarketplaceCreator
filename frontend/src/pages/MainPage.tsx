import React, { useState } from 'react';
import '../styles/MainPage.css';
import { FiltersPanel } from '../components/FiltersPanel';
import { SearchIcon, FilterIcon, SortIcon, ChevronDownIcon, HeartIcon, HeartFilledIcon } from '../components/Icon';
import PageLayout from '../components/PageLayout';

const MainPage: React.FC = () => {
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
        {products.map((p) => (
          <div key={p.id} className="card">
            <div className="card-media">
              <button
                type="button"
                className="fav-badge"
                aria-label={favorites.has(p.id) ? 'Убрать из избранного' : 'В избранное'}
                aria-pressed={favorites.has(p.id)}
                onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
              >
                {favorites.has(p.id) ? <HeartFilledIcon /> : <HeartIcon />}
              </button>
            </div>
            <div className="card-body">
              <h3 className="card-title">{p.name}</h3>
              <p className="card-desc">{p.description}</p>
              <div className="card-price">0.00 ₽</div>
              <button className="card-add">ADD</button>
            </div>
          </div>
        ))}
      </section>
      <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </PageLayout>
  );
};

export default MainPage;