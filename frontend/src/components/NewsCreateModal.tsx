import React, { useRef, useState, useEffect } from 'react';
import xIcon from '../assets/X.svg';
import pencilIcon from '../assets/Pencil.svg';
import '../styles/NewsPage.css';

type NewsCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // Обновим тип onSave, чтобы передавать все данные, включая картинки
  onSave: (data: { title: string; date: string; text: string; images: (number | string)[] }) => void;
};

const NewsCreateModal: React.FC<NewsCreateModalProps> = ({ isOpen, onClose, onSave }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Рефы для Drag-and-Drop сортировки
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Состояния для Drag-to-Scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Состояния данных
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('Заголовок новости');
  const [date, setDate] = useState('01.01.2001 11:00');
  const [text, setText] = useState('Текст новости');
  const [images, setImages] = useState<(number | string)[]>([1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // === Логика Drag-to-Scroll (скролл мышкой) ===
  const handleMouseDown = (e: React.MouseEvent) => {
    // Не начинаем скролл, если кликнули на кнопку удаления, добавления или на картинку в режиме редактирования (чтобы работал DnD)
    if ((e.target as HTMLElement).closest('.news-modal__img-delete-btn') || 
        (e.target as HTMLElement).closest('.news-modal__add-img-placeholder') ||
        (isEditing && (e.target as HTMLElement).closest('.news-modal__img-card'))) {
      return;
    }
    if (!galleryRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - galleryRef.current.offsetLeft);
    setScrollLeft(galleryRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (galleryRef.current) {
      galleryRef.current.scrollLeft += e.deltaY;
    }
  };

  // === Логика Drag-and-Drop (сортировка картинок) ===
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
    // Делаем элемент полупрозрачным при перетаскивании
    (e.target as HTMLElement).style.opacity = '0.4';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Обязательно для разрешения сброса (drop)
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Возвращаем непрозрачность
    (e.target as HTMLElement).style.opacity = '1';

    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const newImages = [...images];
    const draggedItemContent = newImages[dragItem.current];
    
    // Удаляем из старой позиции
    newImages.splice(dragItem.current, 1);
    // Вставляем в новую позицию
    newImages.splice(dragOverItem.current, 0, draggedItemContent);

    setImages(newImages);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // === Логика редактирования ===
  const handleDeleteImage = (imgId: number | string) => {
    setImages(prev => prev.filter(id => id !== imgId));
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImageUrl = URL.createObjectURL(files[0]);
      setImages(prev => [...prev, newImageUrl]);
      e.target.value = '';
    }
  };

  const handleSave = () => {
    // Передаем все данные наверх
    onSave({ title, date, text, images });
    setIsEditing(false);
  };

  return (
    <div className="news-modal__backdrop" onClick={onClose}>
      <div className="news-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="news-modal__header-row">
          <h2 className="news-modal__title" style={{ flex: 1, textAlign: 'center' }}>
            {isEditing ? 'Редактирование новости' : 'Просмотр новости'}
          </h2>
          <button className="news-modal__close-btn" onClick={onClose}>
            <img src={xIcon} alt="Close" />
          </button>
        </div>

        <div className="news-modal__info-row">
          <div style={{ flex: 1, marginRight: 20 }}>
            {isEditing ? (
              <input 
                className="news-modal__input-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <span>{title}</span>
            )}
          </div>
          <div>
            {isEditing ? (
              <input 
                className="news-modal__input-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            ) : (
              <span>{date}</span>
            )}
          </div>
        </div>

        <div 
          className="news-modal__gallery"
          ref={galleryRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          {images.map((img, index) => {
            const isUrl = typeof img === 'string';
            return (
              <div 
                key={index} 
                className="news-modal__img-card" 
                style={{ 
                  position: 'relative', 
                  overflow: 'hidden',
                  cursor: isEditing ? 'grab' : 'default',
                  userSelect: 'none' // Важно: запрещаем выделение текста
                }}
                // Атрибуты для Drag-and-Drop
                draggable={isEditing}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={handleDragOver} // Добавили обработчик
                onDragEnd={handleDragEnd}
              >
                {isUrl ? (
                  <img src={img as string} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
                ) : (
                  `Img ${img}`
                )}
                
                {isEditing && (
                  <button 
                    className="news-modal__img-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(img);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}

          {isEditing && (
            <div 
              className="news-modal__add-img-placeholder"
              onClick={handleAddImageClick}
            >
              +
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        <div className="news-modal__content-area">
          <div style={{ flex: 1, marginBottom: 20 }}>
            {isEditing ? (
              <textarea 
                className="news-modal__textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            ) : (
              <p className="news-modal__text">{text}</p>
            )}
          </div>

          <div className="news-modal__actions">
            {isEditing ? (
              <>
                <button 
                  className="news-modal__btn-edit"
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{ border: '1px solid #ff4d4f', color: '#ff4d4f' }}
                >
                  Отмена
                </button>
                <button 
                  className="news-modal__btn-done" 
                  type="button" 
                  onClick={handleSave}
                >
                  Сохранить
                </button>
              </>
            ) : (
              <>
                <button 
                  className="news-modal__btn-edit" 
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  <img src={pencilIcon} alt="" style={{ width: 14, height: 14 }} />
                  Изменить
                </button>

                <button className="news-modal__btn-done" type="button" onClick={onClose}>
                  Готово
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsCreateModal;