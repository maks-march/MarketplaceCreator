import React, { useEffect, useRef, useState } from 'react';
import AttachFileIcon from '../assets/AttachFile.svg';
import '../styles/BrandsPage.css';

export interface BrandEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brand: {
    id?: number;
    name: string;
    country: string;
    description: string;
    images?: (string | number)[];
  }) => void;
  brand: {
    id?: number;
    name: string;
    country: string;
    description?: string;
    images?: (string | number)[];
  } | null;
}

export const BrandEditModal: React.FC<BrandEditModalProps> = ({ isOpen, onClose, onSave, brand }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // при каждом открытии — инициализация данными выбранного бренда (или сброс)
    setName(brand?.name ?? '');
    setCountry(brand?.country ?? '');
    setDescription(brand?.description ?? '');
    setImages(brand?.images ?? []);
  }, [isOpen, brand]);

  if (!isOpen) return null;

  const handleDeleteDescription = () => setDescription('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    // логотип = первая картинка
    setImages(prev => [url, ...prev.filter(x => x !== url)].slice(0, 20));

    // сброс value чтобы можно было загрузить тот же файл повторно
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    onSave({
      id: brand?.id,
      name,
      country,
      description,
      images,
    });
    onClose();
  };

  return (
    <div className="brand-view-modal__backdrop" onClick={onClose}>
      <div className="brand-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="brand-edit-modal__header">
          <h2 className="brand-edit-modal__title">Редактирование бренда</h2>
          <button type="button" className="brand-edit-modal__close" onClick={onClose}>
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

          <label className="brand-edit-modal__upload">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="brand-edit-modal__upload-input"
              onChange={handleLogoChange}
            />
            <img src={AttachFileIcon} alt="" className="brand-edit-modal__upload-icon" />
            <span className="brand-edit-modal__upload-text">
              Нажмите, чтобы прикрепить изображение логотипа
            </span>
          </label>

          <div className="brand-edit-modal__country-row">
            <select className="brand-edit-modal__select" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">Выберите страну</option>
              <option value="Россия">Россия</option>
              <option value="Китай">Китай</option>
              <option value="США">США</option>
            </select>
          </div>

          <div className="brand-edit-modal__description-wrapper">
            <textarea className="brand-edit-modal__textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="brand-edit-modal__footer">
              <button type="button" className="brand-edit-modal__cancel" onClick={handleDeleteDescription}>
                Очистить
              </button>
              <button type="button" className="brand-edit-modal__save" onClick={handleSubmit}>
                Готово
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};