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

  const hasDesc = (brand.description ?? '').trim().length > 0;

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
            <div className="brands-table__img-placeholder">
              {brand.logoUrl ? <img src={brand.logoUrl} alt="" className="brands-table__thumb" /> : 'IMG'}
            </div>
          </div>
          <div className="brand-view-modal__chip brand-view-modal__chip--name">
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
          <div className="brand-view-modal__description-box">
            {hasDesc ? brand.description : '—'}
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