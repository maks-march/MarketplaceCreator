import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import pencilIcon from '../assets/Pencil.svg';
import tagIcon from '../assets/Tag.svg';
import { BrandViewModal } from '../components/BrandViewModal';
import { BrandEditModal } from '../components/BrandEditModal';
import '../styles/BrandsPage.css';

type BrandRow = {
  id: number;
  name: string;
  country: string;
  description?: string;
};

const initialBrands: BrandRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: 'Очень интересно',
  country: 'Страна',
  description: 'Описание бренда',
}));

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandRow[]>(initialBrands);
  const [selectedBrand, setSelectedBrand] = useState<BrandRow | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editBrand, setEditBrand] = useState<BrandRow | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleNameClick = (brand: BrandRow) => {
    setSelectedBrand(brand);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedBrand(null);
  };

  const handleEditClick = (brand: BrandRow) => {
    setEditBrand(brand);
    setIsEditOpen(true);
  };

  const handleEditSave = (data: BrandRow) => {
    setBrands(prev =>
      prev.map(b => (b.id === data.id ? { ...b, ...data } : b)),
    );
  };

  return (
    <PageLayout>
      <div className="brands-page">
        {/* Заголовок с иконкой, выровнен по левому краю таблицы */}
        <div className="brands-page__header">
          <img src={tagIcon} alt="" className="brands-page__icon" />
          <h1 className="brands-page__title">Бренды</h1>
        </div>

        <div className="brands-table">
          <div className="brands-table__header">
            <div className="brands-table__cell brands-table__cell--index">№</div>
            <div className="brands-table__cell brands-table__cell--img">{/* пусто, вместо IMG */}</div>
            <div className="brands-table__cell">Название бренда</div>
            <div className="brands-table__cell">Страна</div>
            <div className="brands-table__cell">Категории</div>
            <div className="brands-table__cell brands-table__cell--actions" />
          </div>

          <div className="brands-table__body">
            {brands.map((brand, i) => {
              const index = i + 1;
              const isOdd = index % 2 === 1;

              return (
                <div
                  key={brand.id}
                  className={
                    'brands-table__row ' +
                    (isOdd
                      ? 'brands-table__row--odd'
                      : 'brands-table__row--even')
                  }
                >
                  <div className="brands-table__cell brands-table__cell--index">
                    {index}
                  </div>

                  <div className="brands-table__cell brands-table__cell--img">
                    IMG
                  </div>

                  <div
                    className="brands-table__cell brands-table__cell--name brands-table__cell--name-clickable"
                    onClick={() => handleNameClick(brand)}
                  >
                    {brand.name}
                  </div>

                  <div className="brands-table__cell">{brand.country}</div>

                  <div className="brands-table__cell">Категория</div>

                  <div className="brands-table__cell brands-table__cell--actions">
                    <button
                      className="brands-table__edit-btn"
                      type="button"
                      onClick={() => handleEditClick(brand)}
                    >
                      <img
                        src={pencilIcon}
                        alt=""
                        className="brands-table__edit-icon"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <BrandViewModal
          isOpen={isViewOpen}
          onClose={handleCloseView}
          brand={
            selectedBrand && {
              name: selectedBrand.name,
              country: selectedBrand.country,
              description: selectedBrand.description,
            }
          }
        />

        <BrandEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleEditSave}
          brand={editBrand}
        />
      </div>
    </PageLayout>
  );
}