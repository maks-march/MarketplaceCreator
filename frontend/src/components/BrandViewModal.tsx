import React from 'react';
import '../styles/BrandsPage.css';

export interface BrandViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: {
    name: string;
    country: string;
    description?: string;
    logoUrl?: string;
  } | null;
}

export const BrandViewModal: React.FC<BrandViewModalProps> = ({
  isOpen,
  onClose,
  brand,
}) => {
  if (!isOpen || !brand) return null;

  return (
    <div className="brand-view-modal__backdrop" onClick={onClose}>
      <div
        className="brand-view-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="brand-view-modal__header">
          <h2 className="brand-view-modal__title">Просмотр бренда</h2>
          <button
            type="button"
            className="brand-view-modal__close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="brand-view-modal__top">
          <div className="brand-view-modal__chip brand-view-modal__chip--logo">
            Логотип
          </div>
          <div className="brand-view-modal__chip brand-view-modal__chip--name">
            Название бренда
            <span className="brand-view-modal__chip-value">
              {brand.name}
            </span>
          </div>
          <div className="brand-view-modal__chip brand-view-modal__chip--country">
            Страна:&nbsp;
            <span className="brand-view-modal__chip-value">
              {brand.country}
            </span>
          </div>
        </div>

        <div className="brand-view-modal__content">
          <div className="brand-view-modal__description-label">
            Описание бренда
          </div>
          <div className="brand-view-modal__description-box">
            {brand.description || 'Описание бренда'}
          </div>
        </div>

        <div className="brand-view-modal__footer">
          <button
            type="button"
            className="brand-view-modal__done-btn"
            onClick={onClose}
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};