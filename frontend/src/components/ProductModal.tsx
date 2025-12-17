import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/ProductModal.css';

type Product = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  images?: string[];
};

type Props = {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onEdit?: (p?: Product | null) => void;
};

const ProductModal: React.FC<Props> = ({ open, product, onClose, onEdit }) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !product) return null;

  const imgs = product.images ?? [];
  const visible = imgs.slice(0, 4);
  const extraCount = imgs.length > 4 ? imgs.length - 4 : 0;

  return ReactDOM.createPortal(
    <div className="pm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pm-wrap" role="dialog" aria-modal="true" aria-label="Просмотр товара">
        <button className="pm-close" aria-label="Закрыть" onClick={onClose}>✕</button>

        <header className="pm-header">
          <h2 className="pm-title">Просмотр товара</h2>
        </header>

        <div className="pm-top-meta">
          <div className="pm-product-name">{product.name}</div>
          <div className="pm-product-category">{product.category}</div>
        </div>

        <section className="pm-images">
          <div className="pm-images-row">
            {visible.map((src, i) => (
              <div key={i} className="pm-thumb">
                <img src={src} alt={`${product.name} ${i+1}`} />
              </div>
            ))}

            {extraCount > 0 && (
              <div className="pm-more-stack">
                <div className="pm-stack-card pm-stack-1" />
                <div className="pm-stack-card pm-stack-2" />
                <div className="pm-stack-card pm-stack-3" />
                <div className="pm-more-label">+{extraCount}</div>
              </div>
            )}
          </div>
        </section>

        <section className="pm-box pm-desc">
          <div className="pm-box-title">Описание товара</div>
          <div className="pm-box-body">{product.description || 'Нет описания'}</div>
        </section>

        <section className="pm-box pm-specs">
          <div className="pm-box-title">Характеристики товара</div>
          <div className="pm-box-body">—</div>
        </section>

        <footer className="pm-footer">
          <button className="pm-btn pm-edit" onClick={() => onEdit?.(product)}>Изменить</button>
          <button className="pm-btn pm-done" onClick={onClose}>Готово</button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;