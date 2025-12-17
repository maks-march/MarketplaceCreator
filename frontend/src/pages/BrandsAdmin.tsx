import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Brands from './BrandsPage';
import BrandsCreateModal from '../components/BrandsCreateModal';
import type { BrandPayload } from '../components/BrandsCreateModal';
import '../styles/BrandsAdmin.css';

const BrandsAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let btn: HTMLButtonElement | null = null;
    let removed = false;
    const CLASS_NAME = 'brands-page__injected-add-btn';

    // handler reference — нужен, чтобы корректно удалить слушатель при unmount
    const onBtnClick = () => setIsModalOpen(true);

    const createButton = (container: Element) => {
      try {
        if (!container || container.querySelector(`.${CLASS_NAME}`)) return; // уже вставлено или нет контейнера
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = CLASS_NAME;
        btn.textContent = 'Добавить';
        btn.addEventListener('click', onBtnClick);
        container.appendChild(btn);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('createButton failed', err);
      }
    };

    try {
      let attempts = 0;
      const maxAttempts = 30;
      const tryInsert = () => {
        try {
          const header = document.querySelector('.brands-page__header');
          if (header) {
            createButton(header);
            return;
          }
          attempts += 1;
          if (attempts < maxAttempts) {
            setTimeout(tryInsert, 100);
          } else {
            // eslint-disable-next-line no-console
            console.warn('BrandsAdmin: header container .brands-page__header not found after attempts');
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('tryInsert failed', err);
        }
      };
      tryInsert();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('BrandsAdmin useEffect outer error', err);
    }

    return () => {
      try {
        if (btn) {
          try { btn.removeEventListener('click', onBtnClick); } catch {}
          if (btn.parentElement) {
            try { btn.parentElement.removeChild(btn); } catch {}
          }
          removed = true;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('BrandsAdmin cleanup failed', err);
      }
    };
  }, [navigate, setIsModalOpen]);

  const handleCreate = (item: BrandPayload) => {
    console.log('Brand created', item);
    try { window.dispatchEvent(new CustomEvent('brandCreated', { detail: item })); } catch {}
    setIsModalOpen(false);
  };

  return (
    <div className="admin-brands-page">
      <Brands />

      <BrandsCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default BrandsAdmin;