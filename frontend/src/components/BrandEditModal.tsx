import React, { useEffect, useState } from 'react';
import '../styles/BrandsPage.css';
import AttachFileIcon from '../assets/AttachFile.svg';
// import XIcon from '../assets/X.svg'; // удалён импорт несуществующего файла

export interface BrandEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brand: {
    id?: number;
    name: string;
    country: string;
    description: string;
  }) => void;
  brand: {
    id?: number;
    name: string;
    country: string;
    description?: string;
  } | null;
}

export const BrandEditModal: React.FC<BrandEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  brand,
}) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');

  // заполняем поля при открытии модалки
  useEffect(() => {
    if (brand && isOpen) {
      setName(brand.name || '');
      setCountry(brand.country || '');
      setDescription(brand.description || '');
    }
  }, [brand, isOpen]);

  // убрал проверку !brand, чтобы модалка открывалась для создания нового бренда (когда brand === null)
  if (!isOpen) return null;

  const handleDeleteDescription = () => {
    setDescription('');            // очищаем описание
  };

  const handleSubmit = () => {
    onSave({
      id: brand?.id, // добавил опциональный доступ, на случай если brand null
      name,
      country,
      description,
    });
    onClose();
  };

  return (
    <div className="brand-view-modal__backdrop" onClick={onClose}>
      <div
        className="brand-edit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* шапка с заголовком и крестиком */}
        <div className="brand-edit-modal__header">
          <h2 className="brand-edit-modal__title">
            Редактирование бренда
          </h2>
          <button
            type="button"
            className="brand-edit-modal__close"
            onClick={onClose}
          >
            {/* заменил на текстовый крестик, чтобы избежать ошибки с отсутствующим файлом */}
            <span>&times;</span>
          </button>
        </div>

        <div className="brand-edit-modal__form">
          <input
            className="brand-edit-modal__input brand-edit-modal__input--name"
            placeholder="Название бренда..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* загрузка логотипа */}
          <label className="brand-edit-modal__upload">
            <input
              type="file"
              accept="image/*"
              className="brand-edit-modal__upload-input"
            />
            <img
              src={AttachFileIcon}
              alt=""
              className="brand-edit-modal__upload-icon"
            />
            <span className="brand-edit-modal__upload-text">
              Нажмите, чтобы прикрепить изображение логотипа
            </span>
          </label>

          <div className="brand-edit-modal__country-row">
            <select
              className="brand-edit-modal__select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Страна</option>
              <option value="Россия">Россия</option>
              <option value="Китай">Китай</option>
              <option value="США">США</option>
            </select>
          </div>

          <div className="brand-edit-modal__description-wrapper">
            <textarea
              className="brand-edit-modal__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="brand-edit-modal__footer">
              <button
                type="button"
                className="brand-edit-modal__btn brand-edit-modal__btn--delete"
                onClick={handleDeleteDescription}
              >
                Удалить
              </button>
              <button
                type="button"
                className="brand-edit-modal__btn brand-edit-modal__btn--ok"
                onClick={handleSubmit}
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};