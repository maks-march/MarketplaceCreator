import React, { useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import pencilIcon from '../assets/pencil.svg';
import tagIcon from '../assets/Tag.svg';
import { BrandViewModal } from '../components/BrandViewModal';
import { BrandEditModal } from '../components/BrandEditModal';
import BrandsCreateModal, { type BrandPayload } from '../components/BrandsCreateModal';
import '../styles/BrandsPage.css';

type BrandRow = {
  id: number;
  name: string;
  country: string;
  description?: string;
  images?: (string | number)[];
};

const initialBrands: BrandRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: 'Очень интересно',
  country: 'Страна',
  description: 'Описание бренда',
  images: [],
}));

const truncate16 = (s: string) => (s.length > 16 ? `${s.slice(0, 16)}…` : s);

const normalizeImages = (imgs: unknown): string[] => {
  if (!Array.isArray(imgs)) return [];
  return imgs
    .filter((x): x is string => typeof x === 'string')
    .map(s => s.trim())
    .filter(s => s.length > 0 && s !== 'placeholder');
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandRow[]>(initialBrands);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  const selectedBrand = useMemo(
    () => (selectedBrandId == null ? null : brands.find(b => b.id === selectedBrandId) ?? null),
    [brands, selectedBrandId]
  );

  const handleAddBrandClick = () => setIsCreateOpen(true);

  const handleCreateBrand = (payload: BrandPayload) => {
    const newId = Math.max(0, ...brands.map(b => b.id)) + 1;

    const newBrand: BrandRow = {
      id: newId,
      name: payload.name?.trim() || 'Без названия',
      country: payload.country?.trim() || 'Страна',
      description: payload.description?.trim() || '',
      images: normalizeImages(payload.images),
    };

    setBrands(prev => [newBrand, ...prev]);
    setIsCreateOpen(false);
  };

  const handleNameClick = (brandId: number) => {
    setSelectedBrandId(brandId);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedBrandId(null);
  };

  const handleEditClick = (brandId: number) => {
    setSelectedBrandId(brandId);
    setIsEditOpen(true);
  };

  const handleEditSave = (data: {
    id?: number;
    name: string;
    country: string;
    description: string;
    images?: (string | number)[];
  }) => {
    if (selectedBrandId == null) {
      setIsEditOpen(false);
      return;
    }

    setBrands(prev =>
      prev.map(b =>
        b.id === selectedBrandId
          ? {
              ...b,
              name: data.name?.trim() || 'Без названия',
              country: data.country?.trim() || 'Страна',
              description: data.description ?? '',
              images: data.images ?? b.images ?? [],
            }
          : b
      )
    );

    setIsEditOpen(false);
    setSelectedBrandId(null);
  };

  const getThumbSrc = (img: string | number | undefined) => {
    if (!img) return null;
    if (typeof img !== 'string') return null;
    const s = img.trim();
    if (!s || s === 'placeholder') return null;
    return s;
  };

  return (
    <PageLayout>
      <div className="brands-page">
        <div className="brands-page__header">
          <img src={tagIcon} alt="" className="brands-page__icon" />
          <h1 className="brands-page__title">Бренды</h1>
        </div>

        <div className="brands-table-wrap">
          <div className="brands-table-actions">
            <button
              type="button"
              className="brands-table__add-btn"
              onClick={handleAddBrandClick}
            >
              Добавить
            </button>
          </div>

          <div className="brands-table">
            <div className="brands-table__header">
              <div className="brands-table__cell brands-table__cell--index">№</div>
              <div className="brands-table__cell brands-table__cell--img" />
              <div className="brands-table__cell">Название бренда</div>
              <div className="brands-table__cell">Страна</div>
              <div className="brands-table__cell">Категории</div>
              <div className="brands-table__cell brands-table__cell--actions" />
            </div>

            <div className="brands-table__body">
              {brands.map((brand, i) => {
                const index = i + 1;
                const thumb = getThumbSrc(brand.images?.[0]);

                return (
                  <div
                    key={brand.id}
                    className={`brands-table__row ${(index % 2 === 1) ? 'brands-table__row--odd' : 'brands-table__row--even'}`}
                  >
                    <div className="brands-table__cell brands-table__cell--index">{index}</div>

                    <div className="brands-table__cell brands-table__cell--img">
                      <div className="brands-table__img-placeholder">
                        {thumb ? <img src={thumb} alt="" className="brands-table__thumb" /> : 'IMG'}
                      </div>
                    </div>

                    <div className="brands-table__cell brands-table__cell--name" onClick={() => handleNameClick(brand.id)}>
                      <span className="brands-table__name">{truncate16(brand.name)}</span>
                    </div>

                    <div className="brands-table__cell brands-table__cell--country">{brand.country}</div>
                    <div className="brands-table__cell brands-table__cell--category">Категории</div>

                    <div className="brands-table__cell brands-table__cell--actions">
                      <button type="button" className="brands-table__edit-btn" onClick={() => handleEditClick(brand.id)}>
                        <img src={pencilIcon} alt="edit" className="brands-table__edit-icon" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <BrandViewModal
          isOpen={isViewOpen}
          onClose={handleCloseView}
          brand={
            selectedBrand
              ? {
                  name: selectedBrand.name,
                  country: selectedBrand.country,
                  description: selectedBrand.description,
                  logoUrl: getThumbSrc(selectedBrand.images?.[0]) ?? undefined,
                }
              : null
          }
        />

        <BrandEditModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedBrandId(null);
          }}
          onSave={handleEditSave}
          brand={selectedBrand}
        />

        <BrandsCreateModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateBrand}
        />
      </div>
    </PageLayout>
  );
}