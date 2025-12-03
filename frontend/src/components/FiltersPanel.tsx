import React, { useState, useCallback, useRef } from 'react';
import '../styles/MainPage.css';
import { ChevronDownIcon, TagIcon } from './Icon';

interface Props {
  open: boolean;
  onClose: () => void;
}

const RANGE_MIN = 0;
const RANGE_MAX = 9999999;
const STEP = 100; // шаг для клавиатуры

export const FiltersPanel: React.FC<Props> = ({ open, onClose }) => {
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [priceMin, setPriceMin] = useState<number>(RANGE_MIN);
  const [priceMax, setPriceMax] = useState<number>(RANGE_MAX);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<'min' | 'max' | null>(null);

  const clampValues = (min: number, max: number) => {
    if (min < RANGE_MIN) min = RANGE_MIN;
    if (max > RANGE_MAX) max = RANGE_MAX;
    if (min > max) min = max;
    if (max < min) max = min;
    return [min, max];
  };

  const percent = (v: number) => ((v - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;

  const startDrag = (handle: 'min' | 'max', e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = handle;
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
  };

  const onDrag = useCallback((e: MouseEvent) => {
    if (!draggingRef.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(Math.max(x / rect.width, 0), 1);
    const value = Math.round((RANGE_MIN + ratio * (RANGE_MAX - RANGE_MIN)) / STEP) * STEP;
    if (draggingRef.current === 'min') {
      const [min, max] = clampValues(value, priceMax);
      setPriceMin(min);
      setPriceMax(max); // защита перекреста
    } else {
      const [min, max] = clampValues(priceMin, value);
      setPriceMin(min);
      setPriceMax(max);
    }
  }, [priceMin, priceMax]);

  const stopDrag = () => {
    draggingRef.current = null;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  };

  const onInputMin = (v: string) => {
    const num = Number(v.replace(/\D/g, '')) || RANGE_MIN;
    const [min, max] = clampValues(num, priceMax);
    setPriceMin(min);
    setPriceMax(max);
  };
  const onInputMax = (v: string) => {
    const num = Number(v.replace(/\D/g, '')) || RANGE_MAX;
    const [min, max] = clampValues(priceMin, num);
    setPriceMin(min);
    setPriceMax(max);
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

  const apply = () => {
    // здесь можно передать выбранные значения наружу
    onClose();
  };

  return (
    <>
      <div className={`filters-drawer ${open ? 'open' : ''}`}>
        <div className="filters-shell">
          <h3 className="filters-title">Фильтры</h3>

          <label className="filters-label">Категория</label>
          <div className="filters-select">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Категория…</option>
              <option>Электроника</option>
              <option>Мебель</option>
              <option>Аксессуары</option>
              <option>Одежда</option>
            </select>
            <span className="sel-ico"><ChevronDownIcon /></span>
          </div>

            <label className="filters-label">Бренд</label>
            <div className="filters-select">
              <input
                type="text"
                placeholder="Название бренда…"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              {/* Удаляем иконку тега из инпута бренда */}
              {/* <span className="sel-ico"><TagIcon /></span> */}
            </div>

            <label className="filters-label">Цвет</label>
            <div className="filters-select">
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                <option value="">Цвет…</option>
                <option>Белый</option>
                <option>Черный</option>
                <option>Серый</option>
                <option>Зеленый</option>
              </select>
              <span className="sel-ico"><ChevronDownIcon /></span>
            </div>

            <div className="filters-field">
              <label className="filters-label">Цена</label>

              <div className="filters-price-row">
                <input
                  type="number"
                  className="filters-input filters-price-input"
                  placeholder="0"
                  value={priceMin}                          // ← связали со стейтом
                  onChange={(e) => onInputMin(e.target.value)}  // ← обновляем стейт
                />

                <span className="filters-price-separator">—</span>

                <input
                  type="number"
                  className="filters-input filters-price-input filters-price-input--max"
                  placeholder="9999999"
                  value={priceMax}                          // ← связали со стейтом
                  onChange={(e) => onInputMax(e.target.value)}  // ← обновляем стейт
                />
              </div>
            </div>

            {/* Рабочий двойной слайдер */}
            <div className="price-range" ref={trackRef}>
              <div
                className="price-range-fill"
                style={{
                  left: `${percent(priceMin)}%`,
                  width: `${percent(priceMax) - percent(priceMin)}%`
                }}
              />
              <button
                type="button"
                className="price-range-handle"
                style={{ left: `${percent(priceMin)}%` }}
                aria-label="Минимальная цена"
                aria-valuemin={RANGE_MIN}
                aria-valuemax={priceMax}
                aria-valuenow={priceMin}
                onMouseDown={(e) => startDrag('min', e)}
                onKeyDown={(e) => handleKey('min', e)}
              />
              <button
                type="button"
                className="price-range-handle"
                style={{ left: `${percent(priceMax)}%` }}
                aria-label="Максимальная цена"
                aria-valuemin={priceMin}
                aria-valuemax={RANGE_MAX}
                aria-valuenow={priceMax}
                onMouseDown={(e) => startDrag('max', e)}
                onKeyDown={(e) => handleKey('max', e)}
              />
            </div>

            <button className="filters-apply" onClick={apply}>Применить</button>
        </div>
      </div>

      <div className={`filters-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
    </>
  );
};