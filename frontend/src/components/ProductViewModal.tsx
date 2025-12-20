import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import xIcon from '../assets/X.svg';
import pencilIcon from '../assets/Pencil.svg';
import '../styles/NewsPage.css';
import type { Product } from '../services/api/products/product.types';

// helper глубокого клонирования
const clone = <T,>(v: T): T => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof (globalThis as any).structuredClone === 'function') return (globalThis as any).structuredClone(v);
  return JSON.parse(JSON.stringify(v));
};

type Props = {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onSave?: (p?: Product | null) => void; // вызывается при сохранении изменений
};

const ProductViewModal: React.FC<Props> = ({ open, product, onClose, onSave }) => {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createdUrlsRef = useRef<string[]>([]);
  const addTargetIndexRef = useRef<number | null>(null); // куда вставлять при выборе файла (или null = append)
  const filesMapRef = useRef<Record<string, File>>({}); // map objectURL -> File

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [isEditing, setIsEditing] = useState(false);

  // локальная копия продукта — чтобы сразу отображать изменения после Save
  const [localProduct, setLocalProduct] = useState(product);
  
  // количество удалённых (скрытых) заглушек — влияет только на число placeholder'ов в галерее
  const [removedPlaceholdersCount, setRemovedPlaceholdersCount] = useState(0);

  useEffect(() => {
    setLocalProduct(product);
  }, [product]);

  useEffect(() => {
    if (open) {
      setIsEditing(false);
      document.body.style.overflow = 'hidden';
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      createdUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      createdUrlsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open || !product) return null;

  // формируем вид галереи: реальные картинки располагаются слева, затем placeholders (с учётом
  // того, что пользователь мог удалить часть заглушек — removedPlaceholdersCount)
  const realImages = localProduct?.imageLinks ?? [];
  const realCount = Math.min(realImages.length, 8);
  const extraCount = Math.max(0, realImages.length - 8);
  const placeholdersToShow = Math.max(0, 8 - realCount - removedPlaceholdersCount);
  const visibleImages = realImages.slice(0, realCount);
  // visibleImages — реальные изображения для рендера слева; placeholdersToShow — сколько пустых слотов рисовать

  // --- drag-to-scroll handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.news-modal__img-delete-btn') ||
        (e.target as HTMLElement).closest('.news-modal__add-img-placeholder')) return;
    if (!galleryRef.current) return;
    setIsDragging(true);
    const rect = galleryRef.current.getBoundingClientRect();
    setStartX(e.pageX - rect.left);
    setScrollLeft(galleryRef.current.scrollLeft);
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const rect = galleryRef.current.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const walk = (x - startX) * 1.4;
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (galleryRef.current) galleryRef.current.scrollLeft += e.deltaY;
  };

  // --- файловый ввод ---
  // открыть диалог для добавления: можно указать слот для замены (index) или null = append
  const handleAddClick = (ev?: React.MouseEvent, slotIndex?: number | null) => {
    ev?.stopPropagation();
    if (!isEditing) return;
    addTargetIndexRef.current = typeof slotIndex === 'number' ? slotIndex : null;
    fileInputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) { addTargetIndexRef.current = null; return; }

    const next = [...(localProduct?.imageLinks || [])];
    const realCount = next.filter(i => typeof i === 'string').length;
    const maxAllowed = Math.max(0, 10 - realCount);
    if (maxAllowed === 0) { addTargetIndexRef.current = null; return; }

    const toAdd = Math.min(files.length, maxAllowed);
    const urls: string[] = [];
    for (let i = 0; i < toAdd; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      createdUrlsRef.current.push(url);
      filesMapRef.current[url] = file;
      urls.push(url);
    }

    const target = addTargetIndexRef.current;
    if (typeof target === 'number' && target >= 0 && target <= next.length) {
      // вставляем начиная с целевого слота (замена/вставка)
      next.splice(target, 0, ...urls);
    } else {
      // append в конец списка реальных изображений (не заменяем визуальные placeholder'ы)
      next.push(...urls);
    }

    // сохраняем и сбрасываем target
    setLocalProduct(prev => ({ 
      ...(prev ?? {} as Product), 
      imageLinks: next 
    }));
    addTargetIndexRef.current = null;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- удаление реальной картинки (по индексу в realImages) ---
  const handleDeleteReal = (realIndex: number) => {
    if (!localProduct?.imageLinks) return;
    if (realIndex < 0 || realIndex >= localProduct.imageLinks.length) return;

    const img = localProduct.imageLinks[realIndex];
    if (typeof img === 'string') {
      // remove objectURL and file mapping if exists
      if (createdUrlsRef.current.includes(img)) {
        try { URL.revokeObjectURL(img); } catch (_) { /* noop */ }
        createdUrlsRef.current = createdUrlsRef.current.filter(u => u !== img);
      }
      if (filesMapRef.current[img]) {
        delete filesMapRef.current[img];
      }
    }

    const next = localProduct.imageLinks.slice();
    next.splice(realIndex, 1);
    setLocalProduct(prev => ({ 
      ...(prev ?? {} as Product), 
      imageLinks: next 
    }));
  };

  // --- удаление заглушки (только UI): уменьшаем число отображаемых заглушек,
  // реальные картинки при этом всегда остаются слева и будут занимать место ---
  const handleDeletePlaceholder = () => {
    setRemovedPlaceholdersCount(prev => {
      const maxRemovable = Math.max(0, 8 - Math.min((localProduct?.imageLinks?.length ?? 0), 8));
      return Math.min(prev + 1, maxRemovable);
    });
  };

  // --- редактирование: открыть / отмена / сохранить ---
  const startEdit = (ev?: React.MouseEvent) => { ev?.stopPropagation(); setIsEditing(true); };
  const cancelEdit = () => {
    setIsEditing(false);
    setLocalProduct(product);
  };
  const handleSave = () => {
    if (!localProduct) return;

    // Пример: realImagesUrls — массив строк (objectURL или уже существующие url/id)
    const imagesToSave = (localProduct.imageLinks || []).filter(i => typeof i === 'string') as string[];

    // Здесь нужно загрузить файлы filesMapRef.current на сервер и получить реальные URL.
    // Пока — логируем файлы, которые нужно отправить.
    const filesToUpload = Object.entries(filesMapRef.current).map(([url, file]) => ({ url, file }));
    if (filesToUpload.length > 0) {
      console.log('Файлы для загрузки на сервер:', filesToUpload);
      // TODO: выполнить upload и заменить temporary objectURL на серверные URL в imagesToSave
    }

    // Передаём на верхний уровень localProduct — при необходимости замените на результат после upload
    if (onSave) onSave({ ...(localProduct as Product), imageLinks: imagesToSave });
    setIsEditing(false);
  };

  // при изменении полей обновляем локальную копию и сразу оповещаем родителя (чтобы карточка на главной обновлялась)
  const setField = (field: keyof Product, value: any) => {
    setLocalProduct(prev => {
      const next = { ...(prev as Product), [field]: value };
      // обновляем внешний список — родитель должен обновить products иммутабельно в onSave
      if (onSave) onSave(clone(next));
      return next;
    });
  };

  return ReactDOM.createPortal(
    <div className="news-modal__backdrop" onClick={onClose}>
      <div className={`news-modal ${isEditing ? 'news-modal--editing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="news-modal__header-row">
          <h2 className="news-modal__title" style={{ flex: 1, textAlign: 'center' }}>
            Просмотр товара
          </h2>
          <button className="news-modal__close-btn" onClick={onClose} aria-label="Закрыть">
            <img src={xIcon} alt="Close" />
          </button>
        </div>

        {/* info row: name left / category right */}
        <div className="news-modal__info-row" style={{ alignItems: 'center' }}>
          <div style={{ flex: 1, marginRight: 20 }}>
            {isEditing ? (
              <input
                className="news-modal__title-input"
                value={localProduct?.title ?? ''}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="Название товара"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', background: '#fff', color: '#000' }}
              />
            ) : (
              <span>{localProduct?.title || 'Без названия'}</span>
            )}
          </div>

          <div style={{ minWidth: 120, textAlign: 'right' }}>
            {isEditing ? (
              // заблокированный (только для чтения) маленький инпут категории справа
              <input
                className="news-modal__date-input"
                value={localProduct?.category ?? ''}
                disabled
                style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', background: '#fff', color: '#000' }}
              />
            ) : (
              <span>{localProduct?.category || ''}</span>
            )}
          </div>
        </div>

        {/* gallery */}
        <div
          className="news-modal__gallery"
          ref={galleryRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          {/* реальные изображения — всегда слева */}
          {visibleImages.map((img, idx) => (
            <div key={`real-${idx}`} className="news-modal__img-card" style={{ position: 'relative', overflow: 'hidden', cursor: isEditing ? 'grab' : 'default', userSelect: 'none' }}>
              <img src={img as string} alt={`img-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
              {isEditing && (
                <button type="button" className="news-modal__img-delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteReal(idx); }} aria-label="Удалить изображение">
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* placeholders — справа от реальных, их число зависит от removedPlaceholdersCount */}
          {Array.from({ length: placeholdersToShow }).map((_, pIdx) => (
            <div key={`ph-${pIdx}`} className="news-modal__img-card" style={{ position: 'relative', overflow: 'hidden', userSelect: 'none' }}>
              <div className="news-modal__img-placeholder-inside" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              {isEditing && (
                <button type="button" className="news-modal__img-delete-btn" onClick={(e) => { e.stopPropagation(); handleDeletePlaceholder(); }} aria-label="Удалить заглушку">
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* глобальная кнопка добавления — добавляет реальные картинки (append) */}
          {(isEditing && ((localProduct?.imageLinks?.length || 0) < 10)) && (
            <div className="news-modal__add-img-placeholder" onClick={(e) => { e.stopPropagation(); handleAddClick(e, null); }} title="Добавить изображение">
              <div className="news-modal__add-inner">+</div>
            </div>
          )}

          {extraCount > 0 && (
            <div className="news-modal__img-more" aria-hidden>
              <div className="news-modal__img-stack news-modal__stack-1" />
              <div className="news-modal__img-stack news-modal__stack-2" />
              <div className="news-modal__img-stack news-modal__stack-3" />
              <div className="news-modal__more-label">+{extraCount}</div>
            </div>
          )}
        </div> {/* конец .news-modal__gallery */}

        {/* grid 3x2 — только в режиме редактирования (перемещено между галереей и короткой информацией) */}
        {isEditing && (
          <div className="news-modal__grid">
            <div className="news-modal__grid-item">
              <label className="news-modal__label">Категория</label>
              <select
                value={localProduct?.category ?? ''}
                onChange={(e) => setField('category', e.target.value)}
                className="news-modal__input"
                style={{ appearance: 'auto' }}
              >
                <option value="">Категория...</option>
                <option value="Электроника">Электроника</option>
                <option value="Мебель">Мебель</option>
                <option value="Аксессуары">Аксессуары</option>
                <option value="Одежда">Одежда</option>
              </select>
            </div>
            {/* <div className="news-modal__grid-item">
              <label className="news-modal__label">Бренд</label>
              <input value={localProduct?.brand ?? ''} onChange={(e) => setField('brand', e.target.value)} className="news-modal__input" />
            </div> тут надо получить список брэндов пользователя и делать выбор из них, так как для создания продукта нужно передать barndId*/}
            <div className="news-modal__grid-item">
              <label className="news-modal__label">Цена</label>
              <input value={localProduct?.price?.toString() ?? ''} onChange={(e) => setField('price', e.target.value)} className="news-modal__input" />
            </div>
          </div>
        )}

        {/* Описание */}
        <div className="news-modal__content-area">
          {isEditing ? (
            <textarea
              className="news-modal__textarea"
              placeholder="Описание товара"
              value={localProduct?.description ?? ''}
              onChange={(e) => setField('description', e.target.value)}
            />
          ) : (
            <p className="news-modal__text">
              {localProduct?.description && localProduct.description.trim() ? localProduct.description : 'Описание товара'}
            </p>
          )}

          {/* кнопки: заменить обработчик Сохранить на handleSave */}
          <div className="news-modal__actions" style={{ alignItems: 'center' }}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onFileChange}
            />

            {/* left button: Изменить (или Отмена в режиме ред.) — сохраняем класс, чтобы цвет не менялся */}
            {isEditing ? (
              <button className="news-modal__btn-edit" onClick={cancelEdit} type="button" style={{ marginRight: 'auto' }}>
                Отмена
              </button>
            ) : (
              <button className="news-modal__btn-edit" onClick={startEdit} type="button" style={{ marginRight: 'auto' }}>
                <img src={pencilIcon} alt="" style={{ width: 14, height: 14, marginRight: 8 }} />
                Изменить
              </button>
            )}

            {/* right button: Сохранить (в режиме ред.) или Готово (в просмотре) — используем класс btn-done для правой зеленой кнопки */}
            {isEditing ? (
              <button className="news-modal__btn-done" onClick={handleSave} type="button">
                Сохранить
              </button>
            ) : (
              <button className="news-modal__btn-done" onClick={onClose} type="button">
                Готово
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductViewModal;