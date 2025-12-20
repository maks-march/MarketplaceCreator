import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/NewsPage.css';
import '../styles/MainPage.css';

type Product = {
  id: number;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  images?: (number | string)[];
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
  onCreate?: (p: Product) => void;
};

const CreateProductModal: React.FC<Props> = ({ open, product = null, onClose, onCreate }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createdUrlsRef = useRef<string[]>([]);
  const filesMapRef = useRef<Record<string, File>>({});
  const addTargetIndexRef = useRef<number | null>(null);
  const addModeRef = useRef<'insert' | 'replace' | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  const empty: Product = product ?? {
    id: Date.now(),
    name: '',
    description: '',
    category: '',
    price: 0,
    // изначально массив из 8 элементов-заглушек (пустые строки)
    images: Array(8).fill(''),
    shortInfo: '',
    brand: '',
    subcategory: '',
    color: '',
    quantity: 0,
  };

  const [local, setLocal] = useState<Product>(empty);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (open) {
      setLocal({ ...empty, id: Date.now() });
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
      // revoke temporary urls
      createdUrlsRef.current.forEach(u => {
        try { URL.revokeObjectURL(u); } catch { /* noop */ }
      });
      createdUrlsRef.current = [];
      filesMapRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const setField = (k: keyof Product, v: any) => setLocal(prev => ({ ...(prev as Product), [k]: v }));

  // простой append: выбранные файлы всегда добавляются в конец массива изображений
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      createdUrlsRef.current.push(url);
      filesMapRef.current[url] = file;
      urls.push(url);
    }

    setLocal(prev => {
      const next = [...(prev.images ?? [])];
      // просто добавляем urls в конец массива
      next.push(...urls);
      return { ...(prev as Product), images: next };
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    setLocal(prev => {
      const imgs = (prev.images ?? []).slice();
      const removed = imgs.splice(index, 1);
      // revoke if was created here
      removed.forEach(r => { if (typeof r === 'string' && createdUrlsRef.current.includes(r)) { try { URL.revokeObjectURL(r); } catch {} createdUrlsRef.current = createdUrlsRef.current.filter(u => u !== r); delete filesMapRef.current[r]; } });
      return { ...(prev as Product), images: imgs };
    });
  };

  const handleCreate = () => {
    const normalized: Product = {
      ...(local as Product),
      id: local.id || Date.now(),
      price: Number(local.price || 0),
      quantity: Number(local.quantity || 0),
      images: (local.images || []).map(i => String(i)),
    };
    // TODO: отправить filesMapRef.current на сервер и заменить objectURL на реальные URL
    if (onCreate) onCreate(normalized);
    onClose();
  };

  const preventImgDrag = (e: React.DragEvent<HTMLImageElement>) => e.preventDefault();

  const onGalleryMouseDown = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const onGalleryMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !galleryRef.current) return;
    galleryRef.current.scrollLeft -= e.movementX;
  };

  const stopDrag = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return ReactDOM.createPortal(
    <div className="news-modal__backdrop" onClick={onClose}>
      <div className="news-modal" onClick={e => e.stopPropagation()}>
        <div className="news-modal__header-row">
          <h2 className="news-modal__title" style={{ flex: 1, textAlign: 'center' }}>Создание товара</h2>
          <button className="news-modal__close-btn" onClick={onClose} aria-label="Закрыть">×</button>
        </div>

        <div className="news-modal__info-row" style={{ alignItems: 'center' }}>
          <div style={{ flex: 1, marginRight: 20 }}>
            <input
              className="news-modal__title-input"
              value={local.name ?? ''}
              onChange={e => setField('name', e.target.value)}
              placeholder="Название товара"
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', background: '#fff', color: '#000' }}
            />
          </div>
          <div style={{ minWidth: 120, textAlign: 'right' }}>
            <input
              className="news-modal__date-input"
              value={local.category ?? ''}
              onChange={e => setField('category', e.target.value)}
              placeholder="Категория"
              style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', background: '#fff', color: '#000' }}
            />
          </div>
        </div>

        <div
          className="news-modal__gallery"
          style={{ marginTop: 12, cursor: isDragging ? 'grabbing' : 'grab' }}
          ref={galleryRef}
          onMouseDown={onGalleryMouseDown}
          onMouseMove={onGalleryMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {(local.images ?? []).slice(0, 8).map((img, idx) => {
            const isReal = typeof img === 'string' && img.length > 0 && (img.startsWith('blob:') || img.startsWith('http'));
            return (
              <div
                key={`img-${idx}`}
                className="news-modal__img-card"
                style={{ position: 'relative', overflow: 'hidden', cursor: isReal ? 'default' : 'default' }}
              >
                {isReal ? (
                  <>
                    <img
                      src={String(img)}
                      alt={`img-${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onDragStart={preventImgDrag}
                    />
                    <button
                      type="button"
                      className="news-modal__img-delete-btn"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        width: 28,
                        height: 28,
                        padding: 0,
                        borderRadius: '50%',
                        background: '#ff5b5b',
                        color: '#fff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      aria-label="Удалить"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <div className="news-modal__img-placeholder-inside" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                    <button
                      type="button"
                      className="news-modal__img-delete-btn"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        width: 28,
                        height: 28,
                        padding: 0,
                        borderRadius: '50%',
                        background: '#ff5b5b',
                        color: '#fff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      aria-label="Удалить заглушку"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            );
          })}

          {/* add button (плюс) — открывает диалог для добавления в конец */}
          <div
            className="news-modal__add-img-placeholder"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            title="Добавить изображение"
            style={{ cursor: 'pointer' }}
          >
            <div className="news-modal__add-inner">+</div>
          </div>
        </div>

        <div className="news-modal__grid" style={{ marginTop: 12 }}>
          <div className="news-modal__grid-item">
            <label className="news-modal__label">Категория</label>
            <select value={local.category ?? ''} onChange={(e) => setField('category', e.target.value)} className="news-modal__input" style={{ appearance: 'auto' }}>
              <option value="">Категория...</option>
              <option value="Электроника">Электроника</option>
              <option value="Мебель">Мебель</option>
              <option value="Одежда">Одежда</option>
            </select>
          </div>

          <div className="news-modal__grid-item">
            <label className="news-modal__label">Бренд</label>
            <input value={local.brand ?? ''} onChange={(e) => setField('brand', e.target.value)} className="news-modal__input" />
          </div>

          <div className="news-modal__grid-item">
            <label className="news-modal__label">Цена</label>
            <input value={String(local.price ?? 0)} onChange={(e) => setField('price', Number(e.target.value))} className="news-modal__input" />
          </div>

          <div className="news-modal__grid-item">
            <label className="news-modal__label">Подкатегория</label>
            <input value={local.subcategory ?? ''} onChange={(e) => setField('subcategory', e.target.value)} className="news-modal__input" />
          </div>

          <div className="news-modal__grid-item">
            <label className="news-modal__label">Цвет</label>
            <select value={local.color ?? ''} onChange={(e) => setField('color', e.target.value)} className="news-modal__input" style={{ appearance: 'auto' }}>
              <option value="">Цвет...</option>
              <option value="Белый">Белый</option>
              <option value="Черный">Черный</option>
              <option value="Серый">Серый</option>
              <option value="Зеленый">Зеленый</option>
              <option value="Красный">Красный</option>
              <option value="Синий">Синий</option>
              <option value="Желтый">Желтый</option>
              <option value="Коричневый">Коричневый</option>
            </select>
          </div>

          <div className="news-modal__grid-item">
            <label className="news-modal__label">Количество</label>
            <input value={String(local.quantity ?? 0)} onChange={(e) => setField('quantity', Number(e.target.value))} className="news-modal__input" />
          </div>
        </div>

        <div className="news-modal__short-wrap" style={{ marginTop: 12 }}>
          <textarea className="news-modal__short-input" placeholder="Характеристики товара" value={local.shortInfo ?? ''} onChange={(e) => setField('shortInfo', e.target.value)} />
        </div>

        <div className="news-modal__content-area" style={{ marginTop: 12 }}>
          <textarea className="news-modal__textarea" placeholder="Описание товара" value={local.description ?? ''} onChange={(e) => setField('description', e.target.value)} />
          <div className="news-modal__actions" style={{ alignItems: 'center' }}>
            <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
            <button className="news-modal__btn-edit" onClick={onClose} style={{ marginRight: 'auto' }}>Отмена</button>
            <button className="news-modal__btn-done" onClick={handleCreate}>Сохранить</button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default CreateProductModal;