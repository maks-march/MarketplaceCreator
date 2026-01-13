import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { brandsApi } from '../services/api/brands/brands.api';
import type { BrandLinked, UpdateBrandRequest, CreateBrandRequest } from '../services/api/brands/brands.types';
import BrandsCreateModal, { type BrandPayload } from '../components/BrandsCreateModal';
import { BrandEditModal } from '../components/BrandEditModal';
import { BrandViewModal } from '../components/BrandViewModal';
import '../styles/BrandsPage.css';

type BrandRow = {
  id: number;
  name: string;
  country: string;
  description?: string;
  images?: (string | number)[];
};

const truncate16 = (s: string) => (s.length > 16 ? `${s.slice(0, 16)}…` : s);

const normalizeImages = (imgs: unknown): string[] => {
  if (!Array.isArray(imgs)) return [];
  return imgs
    .filter((x): x is string => typeof x === 'string')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== 'placeholder');
};

const mapApiBrandToRow = (b: BrandLinked): BrandRow => ({
  id: Number(b.id),
  name: b.name ?? '',
  country: '—', // в API нет country
  description: b.description ?? '',
  images: [], // в API нет logo/imageLinks в типах
});

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  const selectedBrand = useMemo(
    () => (selectedBrandId == null ? null : brands.find((b) => b.id === selectedBrandId) ?? null),
    [brands, selectedBrandId]
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await brandsApi.getAll(1, 100);
      if (!res.success) return;

      const payload = res.response as any;
      const list: BrandLinked[] = (payload?.users ?? payload?.brands ?? payload ?? []) as BrandLinked[];
      setBrands(list.map(mapApiBrandToRow));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const handleAddBrandClick = () => setIsCreateOpen(true);

  const handleCreateBrand = async (payload: BrandPayload) => {
    const req: CreateBrandRequest = {
      name: payload.name?.trim() || 'Без названия',
      description: payload.description?.trim() || undefined,
    };

    const res = await brandsApi.create(req);
    if (!res.success) return;

    setIsCreateOpen(false);
    await load();
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

  const handleEditSave = async (data: { id?: number; name: string; country: string; description: string; images?: (string | number)[] }) => {
    if (selectedBrandId == null) return;

    const req: UpdateBrandRequest = {
      name: data.name?.trim() || undefined,
      description: data.description?.trim() || undefined,
    };

    const res = await brandsApi.update(String(selectedBrandId), req);
    if (!res.success) return;

    setIsEditOpen(false);
    setSelectedBrandId(null);
    await load();
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Удалить бренд?');
    if (!ok) return;
    const res = await brandsApi.delete(String(id));
    if (!res.success) return;
    await load();
  };

  const getThumbSrc = (_img: string | number | undefined) => null;

  return (
    <PageLayout>
      <div className="brands-page">
        <div className="brands-page__inner">
          <div className="brands-page__header">
            <h1 className="brands-page__title">Бренды</h1>
            <button className="brands-table__add-btn" onClick={handleAddBrandClick}>
              Добавить
            </button>
          </div>

          {loading ? (
            <div>Загрузка...</div>
          ) : (
            <div className="brands-table-wrap">
              <div className="brands-table">
                <div className="brands-table__header">
                  <div className="brands-table__cell brands-table__cell--index">№</div>
                  <div className="brands-table__cell brands-table__cell--img">IMG</div>
                  <div className="brands-table__cell">Название</div>
                  <div className="brands-table__cell">Описание</div>
                  <div className="brands-table__cell brands-table__cell--actions">Действия</div>
                </div>

                <div className="brands-table__body">
                  {brands.map((b, i) => (
                    <div key={b.id} className={`brands-table__row ${i % 2 === 0 ? 'brands-table__row--odd' : 'brands-table__row--even'}`}>
                      <div className="brands-table__cell brands-table__cell--index">{i + 1}</div>
                      <div className="brands-table__cell brands-table__cell--img">
                        <div className="brands-table__img-placeholder">{getThumbSrc(undefined) ? <img src={getThumbSrc(undefined)!} alt="" className="brands-table__thumb" /> : 'IMG'}</div>
                      </div>
                      <div className="brands-table__cell">
                        <button className="brands-table__name-btn" onClick={() => handleNameClick(b.id)}>
                          {truncate16(b.name)}
                        </button>
                      </div>
                      <div className="brands-table__cell">{truncate16(b.description ?? '')}</div>
                      <div className="brands-table__cell brands-table__cell--actions">
                        <button onClick={() => handleEditClick(b.id)}>✎</button>
                        <button onClick={() => handleDelete(b.id)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <BrandViewModal
            isOpen={isViewOpen}
            onClose={handleCloseView}
            brand={
              selectedBrand
                ? { name: selectedBrand.name, country: selectedBrand.country, description: selectedBrand.description, logoUrl: undefined }
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
            brand={
              selectedBrand
                ? { id: selectedBrand.id, name: selectedBrand.name, country: selectedBrand.country, description: selectedBrand.description, images: selectedBrand.images }
                : null
            }
          />

          <BrandsCreateModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onCreate={handleCreateBrand}
          />
        </div>
      </div>
    </PageLayout>
  );
}