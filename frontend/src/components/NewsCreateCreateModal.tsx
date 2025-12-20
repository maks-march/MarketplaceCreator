import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/NewsModal.css';

export type NewsPayload = {
  id: number;
  title: string;
  date?: string;
  text?: string;
  images: string[]; // blob/http URLs
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (item: NewsPayload) => void;
};

const PLACEHOLDER_COUNT = 4;
const MAX_TOTAL = 20; // общий лимит слотов (заглушки + реальные)

const NewsCreateCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const createdUrlsRef = useRef<string[]>([]);
  const itemNodesRef = useRef<Array<HTMLDivElement | null>>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2001-01-01T11:00');
  const [text, setText] = useState('');

  // combinedSlots: 'placeholder' или string URL
  const [combinedSlots, setCombinedSlots] = useState<Array<string>>(() => Array(PLACEHOLDER_COUNT).fill('placeholder'));

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDate('2001-01-01T11:00');
      setText('');
      setCombinedSlots(Array(PLACEHOLDER_COUNT).fill('placeholder'));
      itemNodesRef.current = [];
      createdUrlsRef.current = [];
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
      createdUrlsRef.current.forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
      createdUrlsRef.current = [];
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
      // прокрутка к последнему добавленному после рендера
      setTimeout(() => {
        const lastIndex = next.length - 1;
        const node = itemNodesRef.current[lastIndex];
        if (node && typeof node.scrollIntoView === 'function') {
          node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else if (galleryRef.current) {
          // fallback — прокрутить галерею в конец
          galleryRef.current.scrollLeft = galleryRef.current.scrollWidth;
        }
      }, 50);
      return next;
    });
    // очистка input
    setTimeout(() => { if (fileRef.current) fileRef.current.value = ''; }, 0);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => addFiles(e.target.files);

  // удалить слот по индексу — если url создан нами, revoke
  const removeAt = (idx: number) => {
    setCombinedSlots(prev => {
      if (idx < 0 || idx >= prev.length) return prev;
      const arr = prev.slice();
      const removed = arr.splice(idx, 1)[0];
      if (removed && removed !== 'placeholder' && createdUrlsRef.current.includes(removed)) {
        try { URL.revokeObjectURL(removed); } catch {}
        createdUrlsRef.current = createdUrlsRef.current.filter(u => u !== removed);
      }
      return arr;
    });
  };

  // прокрутка галереи колесиком мыши — вертикальное движение -> горизонтальный скролл
  const onGalleryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    // при необходимости предотвратить прокрутку страницы
    e.preventDefault();
    const delta = e.deltaY || e.deltaX;
    // умножаем на коэффициент для более плавного прокручивания
    galleryRef.current.scrollLeft += delta;
  };

  const handleCreate = () => {
    const images = combinedSlots.filter(s => s !== 'placeholder');
    const payload: NewsPayload = {
      id: Date.now(),
      title: title.trim(),
      date: date || undefined,
      text: text.trim(),
      images,
    };
    onCreate(payload);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="news-modal__backdrop" onClick={onClose}>
      <div className="news-modal" onClick={(e) => e.stopPropagation()}>
        <div className="news-modal__header">
          <h2 className="news-modal__title">Редактирование новости</h2>
          <button className="news-modal__close" type="button" onClick={onClose}>✕</button>
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
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
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
                  className="news-modal__img-item"
                  data-index={i}
                  ref={el => { itemNodesRef.current[i] = el; }}
                  role="listitem"
                >
                  {isPlaceholder ? (
                    <div className="news-modal__placeholder">Img {i + 1}</div>
                  ) : (
                    <img src={slot} alt={`img-${i}`} className="news-modal__img" />
                  )}

                  {/* круглый красный крестик справа сверху */}
                  <button
                    type="button"
                    className="news-modal__img-remove"
                    onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                    aria-label={`Удалить элемент ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="news-modal__add-img" onClick={() => fileRef.current?.click()} role="button" aria-label="Добавить изображения">
                <span className="news-modal__add-plus">+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="news-modal__content-area">
          <textarea
            className="news-modal__textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Текст новости"
          />
        </div>

        <div className="news-modal__actions">
          <button className="news-modal__btn-edit" type="button" onClick={onClose}>Отмена</button>
          <button className="news-modal__btn-done" type="button" onClick={handleCreate}>Создать</button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={onFileChange} />
      </div>
    </div>,
    document.body
  );
};

export default NewsCreateCreateModal;