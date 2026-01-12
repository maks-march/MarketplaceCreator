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

const MAX_TOTAL = 1;

const COUNTRIES = ['Россия', 'Китай', 'США'] as const;

const BrandsCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const createdUrlsRef = useRef<string[]>([]);
  const itemNodesRef = useRef<Array<HTMLDivElement | null>>([]);

  const [title, setTitle] = useState('');
  const [country, setCountry] = useState<string>('');
  const [description, setDescription] = useState('');

  const [combinedSlots, setCombinedSlots] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCountry('');
      setDescription('');
      setCombinedSlots([]);
      itemNodesRef.current = [];
      createdUrlsRef.current = [];
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

  const setSingleImage = (file: File) => {
    const url = URL.createObjectURL(file);

    setCombinedSlots(prev => {
      const prevUrl = prev[0];
      if (prevUrl && createdUrlsRef.current.includes(prevUrl)) {
        try { URL.revokeObjectURL(prevUrl); } catch {}
        createdUrlsRef.current = createdUrlsRef.current.filter(x => x !== prevUrl);
      }
      createdUrlsRef.current.push(url);
      return [url];
    });

    setTimeout(() => {
      if (fileRef.current) fileRef.current.value = '';
    }, 0);
  };

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setSingleImage(files[0]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => addFiles(e.target.files);

  const removeAt = (idx: number) => {
    if (idx !== 0) return;
    setCombinedSlots(prev => {
      const prevUrl = prev[0];
      if (prevUrl && createdUrlsRef.current.includes(prevUrl)) {
        try { URL.revokeObjectURL(prevUrl); } catch {}
        createdUrlsRef.current = createdUrlsRef.current.filter(x => x !== prevUrl);
      }
      return [];
    });
  };

  const onGalleryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    e.preventDefault();
    const delta = e.deltaY || e.deltaX;
    galleryRef.current.scrollLeft += delta;
  };

  const handleSave = () => {
    const images = combinedSlots.slice(0, MAX_TOTAL);

    const desc = description.trim();
    const normalizedDescription =
      !desc || desc.toLowerCase() === 'описание бренда' ? '' : desc;

    const payload: BrandPayload = {
      id: Date.now(),
      name: title.trim() || 'Без названия',
      country: country.trim() || undefined,
      description: normalizedDescription,
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
          <h2 className="news-modal__title">Создание бренда</h2>
          <button className="news-modal__close" type="button" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        <div className="news-modal__green-top">
          <div className="news-modal__controls">
            <input
              className="news-modal__input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Название бренда..."
            />

            <select
              className="news-modal__date"
              value={country}
              onChange={e => setCountry(e.target.value)}
              aria-label="Страна"
            >
              <option value="">Выберите страну...</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="news-modal__images-list" role="list" ref={galleryRef} onWheel={onGalleryWheel}>
            {combinedSlots[0] && (
              <div className="news-modal__img-item with-img" role="listitem">
                <img className="news-modal__img" src={combinedSlots[0]} alt="logo" draggable={false} />
                <button
                  onClick={(e) => { e.stopPropagation(); removeAt(0); }}
                  type="button"
                  aria-label="Удалить логотип"
                  className="news-modal__img-remove"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="news-modal__add-wrap">
              <button
                type="button"
                className="news-modal__add-btn"
                onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
                aria-label="Добавить логотип"
                title="Добавить логотип"
              />
            </div>
          </div>
        </div>

        <div className="news-modal__content-area">
          <textarea
            className="news-modal__textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Описание бренда"
          />
        </div>

        <div className="news-modal__actions">
          <button type="button" className="news-modal__cancel" onClick={onClose}>Отмена</button>
          <button type="button" className="news-modal__btn-done" onClick={handleSave}>Создать</button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={false}
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