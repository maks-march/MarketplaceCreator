import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/NewsModal.css';

export type BrandPayload = {
  id: number;
  name: string;
  country?: string;
  description?: string;
  images: string[]; // blob/http URLs
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (item: BrandPayload) => void;
};

const PLACEHOLDER_COUNT = 4;
const MAX_TOTAL = 20;

const BrandsCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const createdUrlsRef = useRef<string[]>([]);
  const itemNodesRef = useRef<Array<HTMLDivElement | null>>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [combinedSlots, setCombinedSlots] = useState<Array<string>>(() =>
    Array(PLACEHOLDER_COUNT).fill('placeholder')
  );
  const [fileLabel, setFileLabel] = useState('Файл не выбран');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDate('');
      setDescription('');
      setCombinedSlots(Array(PLACEHOLDER_COUNT).fill('placeholder'));
      itemNodesRef.current = [];
      createdUrlsRef.current = [];
      setFileLabel('Файл не выбран');
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
      createdUrlsRef.current.forEach(u => {
        try { URL.revokeObjectURL(u); } catch {}
      });
      createdUrlsRef.current = [];
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const updateFileLabelFromSlots = (slots: string[]) => {
    const imagesCount = slots.filter(s => s !== 'placeholder').length;
    setFileLabel(imagesCount > 0 ? `${imagesCount} файлов` : 'Файл не выбран');
  };

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setCombinedSlots(prev => {
      const available = Math.max(0, MAX_TOTAL - prev.length);
      const toAdd = Math.min(available, files.length);
      if (toAdd === 0) return prev;
      const next = prev.slice();
      for (let i = 0; i < toAdd; i++) {
        const url = URL.createObjectURL(files[i]);
        createdUrlsRef.current.push(url);
        next.push(url);
      }
      updateFileLabelFromSlots(next);
      setTimeout(() => {
        const lastIndex = next.length - 1;
        const node = itemNodesRef.current[lastIndex];
        if (node && typeof node.scrollIntoView === 'function') {
          node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else if (galleryRef.current) {
          galleryRef.current.scrollLeft = galleryRef.current.scrollWidth;
        }
      }, 50);
      return next;
    });
    setTimeout(() => { if (fileRef.current) fileRef.current.value = ''; }, 0);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => addFiles(e.target.files);

  const removeAt = (idx: number) => {
    setCombinedSlots(prev => {
      if (idx < 0 || idx >= prev.length) return prev;
      const arr = prev.slice();
      const removed = arr.splice(idx, 1)[0];
      if (removed && removed !== 'placeholder' && createdUrlsRef.current.includes(removed)) {
        try { URL.revokeObjectURL(removed); } catch {}
        createdUrlsRef.current = createdUrlsRef.current.filter(u => u !== removed);
      }
      updateFileLabelFromSlots(arr);
      return arr;
    });
  };

  const onGalleryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    e.preventDefault();
    const delta = e.deltaY || e.deltaX;
    galleryRef.current.scrollLeft += delta;
  };

  const handleSave = () => {
    const images = combinedSlots.filter(s => s !== 'placeholder');
    const payload: BrandPayload = {
      id: Date.now(),
      name: title.trim() || 'Без названия',
      country: date.trim() || undefined,
      description: description.trim(),
      images,
    };
    onCreate(payload);
    onClose();
  };

  const openFilePicker = () => fileRef.current?.click();

  return ReactDOM.createPortal(
    <div className="news-modal__backdrop brands-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="news-modal" onClick={e => e.stopPropagation()}>
        <div className="news-modal__header">
          <h2 className="news-modal__title">Добавление новости</h2>
          <button className="news-modal__close" type="button" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>

        <div className="news-modal__green-top">
          <div className="news-modal__controls">
            <input
              className="news-modal__input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Заголовок новости"
            />
            <input
              className="news-modal__date"
              value={date}
              onChange={e => setDate(e.target.value)}
              placeholder="01.01.2001 11:00"
            />
          </div>

          <div
            className="news-modal__images-list"
            role="list"
            ref={galleryRef}
            onWheel={onGalleryWheel}
          >
            {combinedSlots.map((slot, i) => {
              const isPlaceholder = slot === 'placeholder';
              return (
                <div
                  key={i}
                  className={`news-modal__img-item ${isPlaceholder ? 'placeholder' : 'with-img'}`}
                  data-index={i}
                  ref={el => { itemNodesRef.current[i] = el; }}
                  role="listitem"
                >
                  {isPlaceholder ? (
                    <>
                      <div className="news-modal__img-placeholder">Img {i + 1}</div>
                      {/* крестик на заглушке — удаляет слот */}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                        type="button"
                        aria-label={`Удалить слот ${i+1}`}
                        className="news-modal__img-remove"
                      >✕</button>
                    </>
                  ) : (
                    <>
                      <img src={slot} alt={`img-${i}`} className="news-modal__img" />
                      {/* крестик на фото — удаляет изображение */}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                        type="button"
                        aria-label={`Удалить изображение ${i+1}`}
                        className="news-modal__img-remove"
                      >✕</button>
                    </>
                  )}
                </div>
              );
            })}

            <div className="news-modal__add-wrap">
              <button
                type="button"
                onClick={openFilePicker}
                className="news-modal__add-btn"
              >
                + Добавить
              </button>
            </div>
          </div>
        </div>

        <div className="news-modal__content-area">
          <textarea
            className="news-modal__textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Текст новости"
          />
        </div>

        <div className="news-modal__actions">
          <button
            type="button"
            className="news-modal__cancel"
            onClick={onClose}
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="news-modal__save"
          >
            Готово
          </button>
        </div>

        {/* скрытый input — теперь полностью скрыт через hidden */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="news-modal__file-input"
          onChange={onFileChange}
          hidden
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </div>,
    document.body
  );
};

export default BrandsCreateModal;