import React, { useCallback, useMemo, useRef } from 'react';
import { useProducts } from '../contexts/ProductsContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

const RANGE_MIN = 0;
const RANGE_MAX = 500000;
const STEP = 100;

export const FiltersPanel: React.FC<Props> = ({ open, onClose }) => {
  const { filters, setFilters } = useProducts();

  const category = filters.category;
  const brand = filters.brand;
  const color = filters.color;
  const priceMin = filters.priceMin;
  const priceMax = filters.priceMax;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<'min' | 'max' | null>(null);

  const clampValues = (min: number, max: number) => {
    if (min < RANGE_MIN) min = RANGE_MIN;
    if (max > RANGE_MAX) max = RANGE_MAX;
    if (min > max) min = max;
    if (max < min) max = min;
    return [min, max] as const;
  };

  const percent = (v: number) => ((v - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;

  const onDrag = useCallback(
    (e: MouseEvent) => {
      if (!draggingRef.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = Math.min(Math.max(x / rect.width, 0), 1);
      const value = Math.round((RANGE_MIN + ratio * (RANGE_MAX - RANGE_MIN)) / STEP) * STEP;

      if (draggingRef.current === 'min') {
        const [min, max] = clampValues(value, priceMax);
        setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
      } else {
        const [min, max] = clampValues(priceMin, value);
        setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
      }
    },
    [priceMin, priceMax, setFilters]
  );

  const stopDrag = useCallback(() => {
    draggingRef.current = null;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  }, [onDrag]);

  const startDrag = (handle: 'min' | 'max', e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = handle;
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
  };

  const onInputMin = (v: string) => {
    const num = Number(v.replace(/\D/g, ''));
    const val = Number.isFinite(num) ? num : RANGE_MIN;
    const [min, max] = clampValues(val, priceMax);
    setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
  };

  const onInputMax = (v: string) => {
    const num = Number(v.replace(/\D/g, ''));
    const val = Number.isFinite(num) ? num : RANGE_MAX;
    const [min, max] = clampValues(priceMin, val);
    setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
  };

  const handleKey = (target: 'min' | 'max', e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (target === 'min') onInputMin(String(priceMin - STEP));
      else onInputMax(String(priceMax - STEP));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (target === 'min') onInputMin(String(priceMin + STEP));
      else onInputMax(String(priceMax + STEP));
    }
  };

  const minPct = useMemo(() => percent(priceMin), [priceMin]);
  const maxPct = useMemo(() => percent(priceMax), [priceMax]);

  const apply = () => onClose();

  return (
    <>
      <div className={`filters-drawer ${open ? 'open' : ''}`}>
        <div className="filters-shell">
          <h3 className="filters-title">Фильтры</h3>

          <label className="filters-label">Категория</label>
          <div className="filters-select">
            <select
              value={category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Категория...</option>
              <option value="Электроника">Электроника</option>
              <option value="Мебель">Мебель</option>
              <option value="Аксессуары">Аксессуары</option>
              <option value="Одежда">Одежда</option>
            </select>
          </div>

          <label className="filters-label">Бренд</label>
          <div className="filters-select">
            <input
              value={brand}
              onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
              placeholder="Название бренда..."
            />
          </div>

          <label className="filters-label">Цвет</label>
          <div className="filters-select">
            <select
              value={color}
              onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
            >
              <option value="">Цвет...</option>
              <option value="Белый">Белый</option>
              <option value="Чёрный">Чёрный</option>
              <option value="Красный">Красный</option>
              <option value="Зелёный">Зелёный</option>
              <option value="Синий">Синий</option>
            </select>
          </div>

          <label className="filters-label" style={{ marginTop: 10 }}>Цена</label>
          <div className="price-row">
            <input
              value={priceMin}
              onChange={(e) => onInputMin(e.target.value)}
              onKeyDown={(e) => handleKey('min', e)}
              inputMode="numeric"
            />
            <div className="dash">—</div>
            <input
              value={priceMax}
              onChange={(e) => onInputMax(e.target.value)}
              onKeyDown={(e) => handleKey('max', e)}
              inputMode="numeric"
            />
          </div>

          <div className="price-slider-new">
            <div ref={trackRef} className="track">
              <div className="range" style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }} />
              <button
                type="button"
                className="thumb min"
                style={{ left: `${minPct}%` }}
                onMouseDown={(e) => startDrag('min', e)}
                aria-label="Минимальная цена"
              />
              <button
                type="button"
                className="thumb max"
                style={{ left: `${maxPct}%` }}
                onMouseDown={(e) => startDrag('max', e)}
                aria-label="Максимальная цена"
              />
            </div>
          </div>

          <button type="button" className="filters-apply" onClick={apply}>
            Применить
          </button>
        </div>
      </div>

      <div className={`filters-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
    </>
  );
};